import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            auth: {
                errors: {
                    emailAlreadyInUse: "This email is already in use",
                    invalidEmail: "Invalid email address",
                    userNotFound: "Invalid email or password",
                    wrongPassword: "Invalid email or password",
                    weakPassword: "Password is too weak (minimum 6 characters)",
                    tooManyRequests: "Too many login attempts. Try again later",
                    unexpected: "An unexpected error occurred",
                    notLoggedIn: "User is not logged in",
                    rollbackError: "An error occured while rollbacking user creation.",
                },
            },
        },
    },
    pl: {
        translation: {
            auth: {
                errors: {
                    emailAlreadyInUse: "Ten adres email jest już używany",
                    invalidEmail: "Nieprawidłowy adres email",
                    userNotFound: "Nieprawidłowy email lub hasło",
                    wrongPassword: "Nieprawidłowy email lub hasło",
                    weakPassword: "Hasło jest zbyt słabe (minimum 6 znaków)",
                    tooManyRequests: "Zbyt wiele prób logowania. Spróbuj ponownie za chwilę",
                    unexpected: "Wystąpił nieoczekiwany błąd",
                    notLoggedIn: "Użytkownik nie jest zalogowany",
                    rollbackError: "Wystąpił błąd podczas cofania tworzenia użytkownika.",
                },
            },
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
