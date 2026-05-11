import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            auth: {
                errors: {
                    title: "Firebase Auth error:",
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
                validation: {
                    invalidEmail: "Invalid email",
                    emailRequired: "Email is required",
                    passwordRequired: "Password is required",
                },
            },
            login: {
                title: "Sign in",
                emailLabel: "E-mail",
                passwordLabel: "Password",
                button: "Login",
                noAccount: "Don't have an account? ",
                signUpLink: "Sign up",
            },
            register: {
                title: "Register\naccount",
                nameLabel: "Name",
                emailLabel: "E-mail",
                passwordLabel: "Password",
                repeatPasswordLabel: "Repeat password",
                button: "Register",
                hasAccount: "Already have an account? ",
                logInLink: "Log in",
            },
            settings: {
                headerTitle: "WorkAscent",
                title: "Settings",
                language: "Language",
                appearance: "Appearance",
                light: "Light",
                auto: "Auto",
                dark: "Dark",
                account: "Account",
                loggedInAs: "Logged in as:",
                logout: "Log out",
                logoutFailed: "Logout failed",
            },
        },
    },
    pl: {
        translation: {
            auth: {
                errors: {
                    title: "Błąd Firebase Auth:",
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
                validation: {
                    invalidEmail: "Nieprawidłowy email",
                    emailRequired: "Email jest wymagany",
                    passwordRequired: "Hasło jest wymagane",
                },
            },
            login: {
                title: "Zaloguj się",
                emailLabel: "E-mail",
                passwordLabel: "Hasło",
                button: "Zaloguj",
                noAccount: "Nie masz konta? ",
                signUpLink: "Zarejestruj się",
            },
            register: {
                title: "Zarejestruj\nkonto",
                nameLabel: "Imię/Nazwa",
                emailLabel: "E-mail",
                passwordLabel: "Hasło",
                repeatPasswordLabel: "Powtórz hasło",
                button: "Zarejestruj",
                hasAccount: "Masz już konto? ",
                logInLink: "Zaloguj się",
            },
            settings: {
                headerTitle: "WorkAscent",
                title: "Ustawienia",
                language: "Język",
                appearance: "Wygląd",
                light: "Jasny",
                auto: "Automatyczny",
                dark: "Ciemny",
                account: "Konto",
                loggedInAs: "Zalogowany jako:",
                logout: "Wyloguj się",
                logoutFailed: "Wylogowanie nie powiodło się",
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
