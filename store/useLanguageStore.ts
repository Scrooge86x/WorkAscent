import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LanguageState {
    language: string;
    setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: "en",
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: "app-language",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
