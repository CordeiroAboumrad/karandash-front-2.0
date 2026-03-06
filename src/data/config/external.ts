import axios from "axios";

export const APP_EXTERNAL = {
  BACKEND_URL: "",
  LOADED: false,
  FRONTEND_INDEX: import.meta.env.BASE_URL,
};

const loadLocalConfig = () => {
  APP_EXTERNAL.BACKEND_URL =
    "https://karandash-backend-161163229461.southamerica-east1.run.app";
};

export const fetchConfig = async () => {
  if (import.meta.env.DEV) {
    console.log("Usando configuração local...");
    loadLocalConfig();
  } else {
    APP_EXTERNAL.BACKEND_URL =
      import.meta.env.VITE_APP_EXTERNAL_BACKEND_CONFIG;
    APP_EXTERNAL.LOADED = true;
  }
};