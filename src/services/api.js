import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "../utils/cookie.js";

const api = axios.create({
   baseURL: "https://attendanceapi.zolosystems.com/",
 // baseURL: "http://localhost:8080/",
  withCredentials: true,
  timeout: 20000,
  headers: {
   // "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {

  const safeGetItem = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`Unable to access localStorage for key: ${key}`, e);
      return "";
    }
  };

  const token = getCookie("_token");
  const preSid = getCookie("_pre_session");
  const cachedFingerprint = getCookie("_brw_id");
  const token_id = getCookie("_session_id");

  // ✅ DO NOT overwrite headers object
  config.headers = config.headers || {};

  if (cachedFingerprint) {
    config.headers["brwId"] = cachedFingerprint;
  }

  if (token_id) {
    config.headers["tokenId"] = token_id;
  } else {
    config.headers["preSid"] = preSid;
  }

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status >= 500 && error.response?.status < 600 ||
      error.response?.data?.status === "error"
    ) {     
      // Redirect
      window.location.replace("/error");
    }

    // if(error.response?.status == 401){
    //    // Redirect
    //   deleteCookie("_session_id");
    //   deleteCookie("_pre_session");
    //   deleteCookie("_brw_id");
    //   deleteCookie("_token");
    //   localStorage.clear();
    //   window.location.replace("/login");
    // }
    return Promise.reject(error);
  }
);
export default api;