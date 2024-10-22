import axios from "axios";
import Cookies from "js-cookie";
import { Identity } from "models/Identity";
import configSettings from "settings/config.json";

const contentTypeHeaderKey = "Content-Type";
const authEndPoint = "/account/authenticate";
const reauthEndPoint = "/account/authenticate/refresh";
const identityCookieName = "reclaim_identity";

var overlayTimer: ReturnType<typeof setTimeout>;
const apiRootUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : configSettings.ApiRootUrl;

console.log("Web URL: " + process.env.REACT_APP_WEB_URL);
console.log("Api URL: " + apiRootUrl);

export const axiosRequest = axios.create({
  baseURL: apiRootUrl,
  withCredentials: true
});

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

const showOverlay = (isMakingRequest: boolean) => {
  const overlay = document.getElementById("overlay");

  if (!overlay)
    return;

  if (isMakingRequest) {
    overlayTimer = setTimeout(() => {
      overlay.classList.add("enabled");
    }, 500);
  } else {
    clearTimeout(overlayTimer);
    overlay.classList.remove("enabled");
  }
}

axiosRequest.interceptors.request.use((config) => {
  let isShowOverlay = true;
  
  if (config.url?.endsWith("document")) {
    config.headers[contentTypeHeaderKey] = "multipart/form-data"; 
  } else {
    config.headers[contentTypeHeaderKey] = "application/json";
  } 

  config.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups";

  if ((config.url == authEndPoint || config.url == reauthEndPoint) && config?.data?.refreshToken !== undefined)
    isShowOverlay = false;
   
  showOverlay(isShowOverlay); 
  return config;
}, (error) => {
  showOverlay(false);
  return Promise.reject(error);
});

axiosRequest.interceptors.response.use((config) => {
  // config.headers["Access-Control-Allow-Origin"] = "*";
  
  showOverlay(false);
  return config;
}, (error) => {
  showOverlay(false);
  return Promise.reject(error);
});

