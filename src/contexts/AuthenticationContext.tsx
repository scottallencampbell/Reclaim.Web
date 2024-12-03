import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import * as jwtDecode from 'jwt-decode'
import { ErrorCode } from 'api/api'
import { Identity } from 'models/Identity'
import configSettings from 'settings/config.json'
import {
  AccountAuthentication,
  AccountAuthenticationRefresh,
  AccountClient,
  GoogleAccountAuthentication,
} from 'api/api'
import { max } from 'lodash'

const identityCookieName = 'reclaim_identity'
const providerCookieName = 'reclaim_provider'
const authLocalStorageKey = 'reclaim_jwt_timer'

var authTimer: ReturnType<typeof setTimeout>
var authTimerCountdown: ReturnType<typeof setInterval>

interface IAuthenticationContext {
  redirectUnauthenticated: (includeRedirectParam: boolean) => void
  authorize: (emailAddress: string, password: string) => Promise<string>
  authorizeGoogle: (credential: string, nonce: string) => Promise<string>
  clearIdentity: () => void
  getIdentity: () => Identity | null
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
    jwtAccessTokenLifeRemaining,
  } = useContext(Context)

  return {
    redirectUnauthenticated,
    authorize,
    authorizeGoogle,
    clearIdentity,
    getIdentity,
    getProvider,
    jwtAccessTokenLifeRemaining,
  }
}

const Context = createContext({} as IAuthenticationContext)

export function AuthenticationProvider({ children }: { children: any }) {
  const [jwtAccessTokenLifeRemaining, setJwtAccessTokenLifeRemaining] = useState(100)

  const apiClient = useMemo(() => new AccountClient(process.env.REACT_APP_API_URL), [])
  const navigate = useNavigate()

  const redirectUnauthenticated = (includeRedirectParam: boolean) => {
    if (includeRedirectParam && window.location.pathname.indexOf('/signin') < 0) {
      navigate('/signin?redirectTo=' + encodeURIComponent(window.location.pathname))
    } else {
      navigate('/signin')
    }
  }

  const getIdentity = (): Identity | null => {
    const identityCookie = Cookies.get(identityCookieName)

    if (identityCookie !== undefined) {
      const identity = Identity.parse(identityCookie)

      if (identity) {
        return identity
      }
    }

    return null
  }

  const getProvider = (): string => {
    const provider = Cookies.get(providerCookieName)

    if (provider && provider.length > 0) {
      return provider
    } else {
      return ''
    }
  }

  const saveProvider = (provider: string) => {
    const params = { domain: window.location.hostname, secure: true, expires: 365 }
    Cookies.set(providerCookieName, provider, params)
  }

  const getJwtTokenTtl = (expiration: number): number => {
    let margin =
      (Number(configSettings.AccessTokenTimeout) *
        Number(configSettings.AccessTokenRefreshMarginPercent)) /
      100

    margin = max([margin, Number(configSettings.AccessTokenMinimumRefreshMargin)])!

    const ttl = expiration - margin * 1000 - new Date().getTime()
    return ttl
  }

  const clearIdentity = () => {
    clearTimeout(authTimer)
    clearInterval(authTimerCountdown)
    localStorage.removeItem(authLocalStorageKey)
    Cookies.remove(identityCookieName)
  }

  const authorize = async (emailAddress: string, password: string): Promise<string> => {
    console.log('authorizing...')

    const request = AccountAuthentication.fromJS({
      emailAddress: emailAddress,
      password: password,
    })

    await apiClient
      .authenticate(request)
      .then(async (result) => {
        saveIdentity(
          result.role,
          emailAddress,
          result.avatarUrl,
          result.niceName,
          result.validUntil.toISOString()
        )
        saveProvider('Local')

        return result.accessToken
      })
      .catch((error) => {
        throw error
      })

    return ''
  }

  const authorizeGoogle = async (credential: string, nonce: string): Promise<string> => {
    console.log('authorizing google...')

    const item = jwtDecode.jwtDecode<{ email: string; nonce: string }>(credential)

    const request = GoogleAccountAuthentication.fromJS({
      emailAddress: item.email,
      googleJwt: credential,
    })

    await apiClient
      .authenticateGoogle(request)
      .then(async (result) => {
        if (nonce !== item.nonce) {
          clearIdentity()
          // eslint-disable-next-line no-throw-literal
          throw {
            response: {
              data: { errorCode: 2201, errorCodeName: ErrorCode.GoogleJwtNonceInvalid },
            },
          }
        }

        saveIdentity(
          result.role,
          item.email,
          result.avatarUrl,
          result.niceName,
          result.validUntil.toISOString()
        )
        saveProvider('Google')

        return result.accessToken
      })
      .catch((error) => {
        throw error
      })

    return ''
  }

  const restartJwtTimers = useCallback(
    (identity: Identity) => {
      clearTimeout(authTimer)
      clearInterval(authTimerCountdown)

      const ttl = getJwtTokenTtl(Date.parse(identity.expiration))

      authTimer = setTimeout(() => {
        reauthorize(identity.emailAddress)
      }, ttl)

      authTimerCountdown = setInterval(() => {
        const countdown = (Date.parse(identity.expiration) - new Date().getTime()) / 1000
        setJwtAccessTokenLifeRemaining(
          (100.0 * countdown) / Number(configSettings.AccessTokenTimeout)
        )
        localStorage.setItem(authLocalStorageKey, countdown.toString())
      }, 250)
    },
    [setJwtAccessTokenLifeRemaining]
  )

  const saveIdentity: (
    role: string,
    emailAddress: string,
    avatarUrl: string,
    niceName: string,
    validUntil: string
  ) => void = useCallback(
    (
      role: string,
      emailAddress: string,
      avatarUrl: string,
      niceName: string,
      validUntil: string
    ) => {
      const emailAddresses = emailAddress.split(':')
      const expiresInSeconds = (new Date(validUntil).getTime() - Date.now()) / 1000
      const expiresInDays = expiresInSeconds / 60 / 60 / 24
      const params = {
        domain: window.location.hostname,
        secure: true,
        expires: expiresInDays,
      }

      const identity = new Identity(
        role,
        emailAddresses[0],
        avatarUrl,
        niceName,
        null,
        validUntil
      )

      Cookies.set(identityCookieName, JSON.stringify(identity), params)
      restartJwtTimers(identity)
    },
    [restartJwtTimers]
  )

  const reauthorize = useCallback(
    async (emailAddress: string): Promise<string> => {
      console.log('reauthorizing...')

      const request = AccountAuthenticationRefresh.fromJS({
        emailAddress: emailAddress,
        refreshToken: '_',
      })

      await apiClient
        .authenticateRefresh(request)
        .then(async (result) => {
          saveIdentity(
            result.role,
            emailAddress,
            result.avatarUrl,
            result.niceName,
            result.validUntil.toISOString()
          )
          return result.accessToken
        })
        .catch((error) => {
          throw error
        })

      return ''
    },
    [apiClient, saveIdentity]
  )

  useEffect(() => {
    // on page refresh we need to restart the JWT token timer
    const jwtCountdown = Number(localStorage.getItem(authLocalStorageKey))
    const identity = getIdentity()

    if (
      jwtAccessTokenLifeRemaining === 100 &&
      identity?.emailAddress != null &&
      !isNaN(jwtCountdown)
    ) {
      restartJwtTimers(identity)
    }
  }, [jwtAccessTokenLifeRemaining, restartJwtTimers])

  return (
    <Context.Provider
      value={{
        redirectUnauthenticated,
        authorize,
        authorizeGoogle,
        clearIdentity,
        getIdentity,
        getProvider,
        jwtAccessTokenLifeRemaining,
      }}>
      {children}
    </Context.Provider>
  )
}
