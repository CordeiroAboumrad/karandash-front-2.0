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
    try {
      const response = await axios.get("/config.json");
      APP_EXTERNAL.BACKEND_URL = response.data.APP_EXTERNAL_BACKEND_CONFIG;
      APP_EXTERNAL.LOADED = true;
    } catch (error) {
      console.log(error);
    }
  }
};
