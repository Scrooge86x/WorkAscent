# WorkAscent

[English version](README.md)

Aplikacja ofert pracy w React Native (Expo). Przeglądanie, filtrowanie, tworzenie i zarządzanie ofertami z logowaniem, lokalizacją EN/PL oraz motywem jasnym/ciemnym.

## Spis treści

- [Funkcje](#funkcje)
- [Rozpoczęcie pracy](#rozpoczęcie-pracy)
    - [Wymagania](#wymagania)
    - [Instalacja](#instalacja)
    - [Zmienne środowiskowe](#zmienne-środowiskowe)
    - [Uruchomienie](#uruchomienie)
- [Skrypty](#skrypty)
- [Główne ekrany](#główne-ekrany)
- [Lokalizacja](#lokalizacja)
- [Motyw](#motyw)
- [Uwagi](#uwagi)
- [Stack technologiczny](#stack-technologiczny)
- [Licencja](#licencja)

## Funkcje

- Lista ofert z pull-to-refresh
- Filtrowanie i sortowanie (lokalizacja, zdalne, zakres wynagrodzenia, tagi, data / wynagrodzenie / tytuł)
- Szczegóły oferty, tworzenie i edycja z walidacją
- Logowanie e-mail/hasło (Firebase)
- Menu użytkownika: nowa oferta, moje oferty, ustawienia, wylogowanie
- Ustawienia: język (EN/PL), wygląd (Jasny / Auto / Ciemny)
- Sprawdzenie sieci przed requestami
- i18n (angielski, polski)
- Motyw systemowy / jasny / ciemny

## Rozpoczęcie pracy

### Wymagania

- **Node.js 20.19+** (wymagane przez Expo SDK 54)
- Expo CLI (`npx expo`)
- Projekt Firebase z włączonym Auth i Firestore

### Instalacja

```bash
npm install
```

### Zmienne środowiskowe

Utwórz plik `.env` z konfiguracją Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

Aplikacja rzuca błąd, jeśli brakuje `EXPO_PUBLIC_FIREBASE_API_KEY`.

### Uruchomienie

```bash
npx expo start
```

Następnie otwórz w Expo Go, symulatorze iOS lub emulatorze Androida.

```bash
npm run ios
npm run android
```

## Skrypty

| Komenda                 | Opis                                   |
| ----------------------- | -------------------------------------- |
| `npm start`             | Serwer deweloperski Expo               |
| `npm run android`       | Uruchom na Androidzie                  |
| `npm run ios`           | Uruchom na iOS                         |
| `npm run web`           | Web (nie jest głównym celem)           |
| `npm run lint`          | ESLint                                 |
| `npm run reset-project` | Przenieś kod startowy do `app-example` |

## Główne ekrany

1. **Home** (`/`) – lista ofert; filtr otwiera ekran filtrów
2. **Filtr** (`/offer-filter`) – lokalizacja, zdalne, wynagrodzenie, tagi, sortowanie → parametry i powrót do home
3. **Szczegóły oferty** (`/offer-details?id=…`) – podgląd; właściciel może edytować lub usunąć
4. **Formularz oferty** (`/offer-form` lub z `id`) – tworzenie lub edycja
5. **Logowanie / Rejestracja** – Firebase e-mail/hasło → home po sukcesie
6. **Ustawienia** – język, motyw, wylogowanie

Stan auth przez `react-firebase-hooks`. Oferty w Firestore `offers`, użytkownicy w `users`.

## Lokalizacja

Tłumaczenia w `i18n/en/` i `i18n/pl/`. Język zapisywany (Zustand + AsyncStorage), synchronizacja przez `useAppTranslation`.

## Motyw

`useThemeStore`: `light` | `dark` | `auto` (system). Aplikowany przez motywy MD3 React Native Paper w root layout.

## Uwagi

- Wynagrodzenie `0` = „do negocjacji”
- Oferty zdalne przy zapisie czyszczą miasto / region / kraj
- Parametry filtrów przez search params Expo Router (`hooks/search-params-helpers.ts`)

## Stack technologiczny

| Obszar      | Technologia                           |
| ----------- | ------------------------------------- |
| Framework   | Expo ~54, React Native 0.81, React 19 |
| Routing     | Expo Router (file-based)              |
| UI          | React Native Paper (MD3)              |
| Auth i baza | Firebase Auth + Firestore             |
| Formularze  | Formik + Yup                          |
| Stan        | Zustand (persist z AsyncStorage)      |
| i18n        | i18next / react-i18next               |
| Listy       | @shopify/flash-list                   |
