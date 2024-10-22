import { createContext, useContext, useEffect, useState } from "react"
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { Route, useNavigate } from "react-router-dom";
import jwt from "jwt-decode"
import { ErrorCode } from "helpers/errorcodes"
import { Identity } from "models/Identity";
import { axiosRequest } from "api/api";
import configSettings from "settings/config.json";
const identityCookieName = "reclaim_identity";
const providerCookieName = "reclaim_provider";
const authEndPoint = "/account/authenticate";
const reauthEndPoint = "/account/authenticate/refresh";
const googleAuthEndPoint = "/account/authenticate/google";
const authLocalStorageKey = "reclaim_jwt_timer";

var authTimer: ReturnType<typeof setTimeout>;
var authTimerCountdown: ReturnType<typeof setInterval>;

interface IAuthenticationContext {
  redirectUnauthenticated: (includeRedirectParam: boolean) => void,
  authorize: (emailAddress: string, password: string) => Promise<string>,
  authorizeGoogle: (credential: string, nonce: string) => Promise<string>,
  clearIdentity: () => void,
  getIdentity: () => Identity | null,
  getProvider: () => string 
  jwtAccessTokenLifeRemaining: number
}

export const AuthenticationContext = (): IAuthenticationContext => {
  const {
    redirectUnauthenticated,
    authorize,
    authorizeGoogle,
    clearIdentity,
    getIdentity,
    getProvider,
    jwtAccessTokenLifeRemaining
  } = useContext(Context);

  return {
    redirectUnauthenticated,
    authorize,
    authorizeGoogle,
    clearIdentity,
    getIdentity,
    getProvider,
    jwtAccessTokenLifeRemaining
  };
}
    
const Context = createContext({} as IAuthenticationContext);

export function AuthenticationProvider({ children }: { children: any }) {
  const [jwtAccessTokenLifeRemaining, setJwtAccessTokenLifeRemaining] = useState(100);
  
  const navigate = useNavigate();              
  
  useEffect(() => {
    // on page refresh we need to restart the JWT token timer
    const jwtCountdown = Number(localStorage.getItem(authLocalStorageKey));
    const identity = getIdentity();
    
    if (jwtAccessTokenLifeRemaining == 100 && identity?.emailAddress != null && !isNaN(jwtCountdown)) 
      restartJwtTimers(identity);
  }, []);

  const restartJwtTimers = (identity: Identity) => {
    clearTimeout(authTimer);
    clearInterval(authTimerCountdown);

    const ttl = getJwtTokenTtl(Date.parse(identity.expiration));

    authTimer = setTimeout(() => {
      reauthorize(identity.emailAddress);
    }, ttl);

    authTimerCountdown = setInterval(() => {
      const countdown = (Date.parse(identity.expiration) - (new Date()).getTime()) / 1000;
      setJwtAccessTokenLifeRemaining(100.0 * (countdown) / Number(configSettings.AccessTokenTimeout));
      localStorage.setItem(authLocalStorageKey, countdown.toString());      
    }, 250);
  }
  
  const redirectUnauthenticated = (includeRedirectParam: boolean) => {
    if (includeRedirectParam && window.location.pathname.indexOf("/signin") < 0)
      navigate("/signin?redirectTo=" + encodeURIComponent(window.location.pathname));
    else
      navigate("/signin");
  }

  const getIdentity = (): Identity | null => {
    const identityCookie = Cookies.get(identityCookieName);

    if (identityCookie != undefined) {
      const identity = Identity.parse(identityCookie);

      if (identity)
        return identity;
    }

    return null;
  }

  const getProvider = (): string => {
    const provider = Cookies.get(providerCookieName);

    if (provider && provider.length > 0)
      return provider;
    else
      return "";
  }

  const saveProvider = (provider: string) => {
    const params = { domain: window.location.hostname, secure: true, expires: 365 };
    Cookies.set(providerCookieName, provider, params);
  }

  const getJwtTokenTtl = (expiration: number): number => {
    let margin = Number(configSettings.AccessTokenTimeout) * Number(configSettings.AccessTokenRefreshMarginPercent) / 100;

    if (margin < Number(configSettings.AccessTokenMinimumRefreshMargin))
      margin = Number(configSettings.AccessTokenMinimumRefreshMargin);

    const ttl = (expiration - margin * 1000) - new Date().getTime();
    return ttl;
  }

  const saveIdentity = (emailAddress: string, role: string, validUntil: string) => {
    const emailAddresses = emailAddress.split(":");
    const expiresInSeconds = (new Date(validUntil).getTime() - Date.now()) / 1000;
    const expiresInDays = (expiresInSeconds) / 60 / 60 / 24;
    const params = { domain: window.location.hostname, secure: true, expires: expiresInDays };
    
    var identity = new Identity(emailAddresses[0], role, null, validUntil);

    Cookies.set(identityCookieName, JSON.stringify(identity), params);
    
    restartJwtTimers(identity);
  }

  const clearIdentity = () => {
    clearTimeout(authTimer);
    clearInterval(authTimerCountdown);
    localStorage.removeItem(authLocalStorageKey);
    Cookies.remove(identityCookieName);    
  }

  const authorize = async (emailAddress: string, password: string): Promise<string> => {
    console.log("authorizing...");
    
    await axiosRequest.post(authEndPoint, {
        "emailAddress": emailAddress,
        "password": password
      }
    ).then(async result => {
      saveIdentity(emailAddress, result.data.role, result.data.validUntil);
      saveProvider("Local");
     
      return result.data.accessToken;
    }
    ).catch(error => { throw error; });

    return "";
  }

  const authorizeGoogle = async (credential: string, nonce: string): Promise<string> => {
    console.log("authorizing google...");
    
    const item = jwt<any>(credential);
    await axiosRequest.post(googleAuthEndPoint, {
        "emailAddress": item.email,
        "googleJwt": credential
      }
    ).then(async result => {
      if (nonce != item.nonce) {
        clearIdentity();
        throw { response: { data: { errorCode: 2201, errorCodeName: ErrorCode.GoogleJwtNonceInvalid } } };
      }

      saveIdentity(item.email, result.data.role, result.data.validUntil);
      saveProvider("Google");

      return result.data.accessToken;
    }
    ).catch(error => { throw error; });

    return "";
  }

  const reauthorize = async (emailAddress: string): Promise<string> => {
    console.log("reauthorizing...");
    await axiosRequest.post(reauthEndPoint, {
        "emailAddress": emailAddress,
        "refreshToken": "_"
      }
    ).then(async result => {  
      saveIdentity(emailAddress, result.data.role, result.data.validUntil);
      return result.data.accessToken;
    }
    ).catch(error => { throw error; });

    return "";
  }
  
  return (
    <Context.Provider value={{
      redirectUnauthenticated,
      authorize,
      authorizeGoogle,
      clearIdentity,
      getIdentity,
      getProvider,
      jwtAccessTokenLifeRemaining
    }}>{children}
    </Context.Provider>
  )
}
