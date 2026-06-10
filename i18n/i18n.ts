import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAuth from "./en/auth.json";
import enCommon from "./en/common.json";
import enHome from "./en/home.json";
import enLogin from "./en/login.json";
import enMenu from "./en/menu.json";
import enOfferDetails from "./en/offerDetails.json";
import enOfferForm from "./en/offerForm.json";
import enRegister from "./en/register.json";
import enSettings from "./en/settings.json";

import plAuth from "./pl/auth.json";
import plCommon from "./pl/common.json";
import plHome from "./pl/home.json";
import plLogin from "./pl/login.json";
import plMenu from "./pl/menu.json";
import plOfferDetails from "./pl/offerDetails.json";
import plOfferForm from "./pl/offerForm.json";
import plRegister from "./pl/register.json";
import plSettings from "./pl/settings.json";

const resources = {
    en: {
        translation: {
            ...enCommon,
            ...enAuth,
            ...enLogin,
            ...enRegister,
            ...enSettings,
            ...enMenu,
            ...enOfferDetails,
            ...enHome,
            ...enOfferForm,
        },
    },
    pl: {
        translation: {
            ...plCommon,
            ...plAuth,
            ...plLogin,
            ...plRegister,
            ...plSettings,
            ...plMenu,
            ...plOfferDetails,
            ...plHome,
            ...plOfferForm,
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "pl",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
