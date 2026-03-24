import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "../../assets/locales/en";
import ru from "../../assets/locales/ru";
import es from "../../assets/locales/es";
import fr from "../../assets/locales/fr";

const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (locales.length > 0) {
    return locales[0].languageCode;
  }
  return "en";
};

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    try {
      const storedLang = await AsyncStorage.getItem("appLanguage");
      if (storedLang) {
        callback(storedLang);
      } else {
        callback(getDeviceLanguage());
      }
    } catch (e) {
      callback(getDeviceLanguage());
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang) => {
    try {
      await AsyncStorage.setItem("appLanguage", lang);
    } catch (e) {
      console.log("Error saving language:", e);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      es: { translation: es },
      fr: { translation: fr },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
