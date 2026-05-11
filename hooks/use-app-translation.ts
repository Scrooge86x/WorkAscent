import { useLanguageStore } from "@/store/useLanguageStore";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export const useAppTranslation = () => {
    const { t, i18n } = useTranslation();
    const language = useLanguageStore((state) => state.language);
    const lastSynced = useRef<string | null>(null);

    useEffect(() => {
        if (language && i18n.language !== language && lastSynced.current !== language) {
            lastSynced.current = language;
            i18n.changeLanguage(language);
        }
    }, [language, i18n]);

    return { t, i18n, language };
};
