// import axios from "axios";
import Cookies from "js-cookie";
import { Identity } from "models/Identity";
import configSettings from "settings/config.json";

const contentTypeHeaderKey = "Content-Type";
const authEndPoint = "/account/authenticate";
const reauthEndPoint = "/account/authenticate/refresh";
const identityCookieName = "reclaim_identity";

var overlayTimer: ReturnType<typeof setTimeout>;
const apiRootUrl = process.env.REACT_APP_API_URL;

console.log("Web URL: " + process.env.REACT_APP_WEB_URL);
console.log("Api URL: " + apiRootUrl);

/*
export const axiosRequest = axios.create({
  baseURL: apiRootUrl,
  withCredentials: true
});
*/

export const restartIdentityTimer = () => {
  const identity = getIdentity();
}

export const getIdentity = (): Identity | null => {
  const identityCookie = Cookies.get(identityCookieName);
  
  if (identityCookie != undefined) {
    const identity = Identity.parse(identityCookie);

    if (identity)
      return identity;
  }

  return null;
}
