import axios, { type InternalAxiosRequestConfig } from "axios";
import { APP_EXTERNAL, fetchConfig } from "./external";
import { apiErrorHandler } from "./errors/errorHandling";

const getRequestConfig = async (config: InternalAxiosRequestConfig) => {
    if (!APP_EXTERNAL.LOADED) {
    await fetchConfig()
  }
  config.baseURL = APP_EXTERNAL.BACKEND_URL;
  return config;
}

type ConfigOptions = {
    errorHandler: (err: unknown) => void
}

const newAxiosInstance = ({errorHandler}: ConfigOptions) => {
    const instance = axios.create()

    instance.interceptors.request.use(async (config) => await getRequestConfig(config))
    instance.interceptors.response.use((res) => res, errorHandler)
    
    return instance
}


export const karandashClient = newAxiosInstance({
    errorHandler: apiErrorHandler
})
