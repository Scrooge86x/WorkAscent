# WorkAscent

**Language / Język:** [English](#english) · [Polski](#polski)

---

<a id="english"></a>

# English

**[↑ Switch language](#workascent)** · [Polski →](#polski)

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure-main-parts)
- [Getting started](#getting-started)
    - [1. Prerequisites](#1-prerequisites)
    - [2. Install dependencies](#2-install-dependencies)
    - [3. Environment variables](#3-environment-variables)
    - [4. Run the app](#4-run-the-app)
- [Scripts](#scripts)
- [Main screens & flows](#main-screens--flows)
- [Localization](#localization)
- [Theme](#theme)
- [Notes](#notes)
- [License](#license)

## Features

- **Job offers list** – FlashList of offers with pull-to-refresh
- **Filtering & sorting** – by location (city / region / country), remote only, salary range, tags, creation date / salary / title
- **Offer details** – full description, contact info, location and salary
- **Create / edit offers** – form with validation (title, description, location, salary, tags, contact)
- **Authentication** – email/password login & registration (Firebase Auth)
- **User menu** – create offer, “My offers”, settings, logout
- **Settings** – language (EN/PL) and appearance (Light / Auto / Dark)
- **Offline awareness** – network status check before fetching data
- **Internationalization** – `i18next` + `react-i18next` with English and Polish translations
- **Theming** – system / light / dark via Zustand + React Native Paper (MD3)

## Tech stack

| Area      | Technology                            |
| --------- | ------------------------------------- |
| Framework | Expo ~54, React Native 0.81, React 19 |
| Routing   | Expo Router (file-based)              |
| UI        | React Native Paper (MD3)              |
| Auth & DB | Firebase Auth + Firestore             |
| Forms     | Formik + Yup                          |
| State     | Zustand (persisted with AsyncStorage) |
| i18n      | i18next / react-i18next               |
| Lists     | @shopify/flash-list                   |

## Project structure (main parts)

```
app/                    # Expo Router screens
  _layout.tsx           # Root layout (PaperProvider, Stack, theme)
  index.tsx             # Home – offers list
  login.tsx / register.tsx
  offer-details.tsx
  offer-form.tsx
  offer-filter.tsx
  settings.tsx
components/             # UI components (AppHeader, OfferItem, UserMenu, …)
hooks/                  # useAppTranslation, search-params helpers, color scheme
models/                 # Offer, Location, User types
services/               # AuthService, OffersService, UserService, FirebaseConfig
store/                  # useThemeStore, useLanguageStore
i18n/                   # Translation files (en/, pl/)
```

## Getting started

### 1. Prerequisites

- Node.js 18+
- Expo CLI / `npx expo`
- Firebase project (Auth + Firestore enabled)

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` (or configure Expo public env) with your Firebase config:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

The app throws if `EXPO_PUBLIC_FIREBASE_API_KEY` is missing.

### 4. Run the app

```bash
npx expo start
```

Then open in:

- Expo Go
- iOS Simulator
- Android Emulator
- Web (`npm run web`)

Platform-specific:

```bash
npm run ios
npm run android
```

## Scripts

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `npm start`             | Start Expo development server      |
| `npm run android`       | Run on Android                     |
| `npm run ios`           | Run on iOS                         |
| `npm run web`           | Start web version                  |
| `npm run lint`          | Run ESLint                         |
| `npm run reset-project` | Move starter code to `app-example` |

## Main screens & flows

1. **Home** (`/`) – list of offers; filter icon opens the filter modal.
2. **Filter** (`/offer-filter`) – location, remote, salary range, tags, sort; applies params and navigates back to home.
3. **Offer details** (`/offer-details?id=…`) – view offer; owner can edit or delete.
4. **Offer form** (`/offer-form` or with `id`) – create or edit offer.
5. **Login / Register** – Firebase email/password; after success redirects to home.
6. **Settings** – language and theme; logout when signed in.

Auth state is observed with `react-firebase-hooks`. Offers are stored in the Firestore `offers` collection; users in `users`.

## Localization

Translations live under `i18n/en/` and `i18n/pl/`. Language is persisted with Zustand + AsyncStorage and synced via `useAppTranslation`.

Supported languages: **English**, **Polski**.

## Theme

- Controlled by `useThemeStore` (`light` | `dark` | `auto`).
- `auto` follows the system color scheme.
- Applied through React Native Paper `MD3LightTheme` / `MD3DarkTheme` in the root layout.

## Notes

- Salary `0` is treated as “for negotiation”.
- Remote offers clear city/region/country on save.
- Filter/search params are passed via Expo Router search params and compacted with helpers in `hooks/search-params-helpers.ts`.
- Some starter Expo components (parallax scroll, themed text/view, collapsible, icon-symbol) are present but not central to the job-offers flow.

---

<a id="polski"></a>

# Polski

**[↑ Przełącz język](#workascent)** · [← English](#english)

## Spis treści

- [Funkcje](#funkcje)
- [Stack technologiczny](#stack-technologiczny)
- [Struktura projektu](#struktura-projektu-główne-części)
- [Rozpoczęcie pracy](#rozpoczęcie-pracy)
    - [1. Wymagania](#1-wymagania)
    - [2. Instalacja zależności](#2-instalacja-zależności)
    - [3. Zmienne środowiskowe](#3-zmienne-środowiskowe)
    - [4. Uruchomienie aplikacji](#4-uruchomienie-aplikacji)
- [Skrypty](#skrypty)
- [Główne ekrany i przepływy](#główne-ekrany-i-przepływy)
- [Lokalizacja](#lokalizacja)
- [Motyw](#motyw)
- [Uwagi](#uwagi)
- [Licencja](#licencja)

## Funkcje

- **Lista ofert pracy** – FlashList z pull-to-refresh
- **Filtrowanie i sortowanie** – lokalizacja (miasto / region / kraj), tylko zdalne, zakres wynagrodzenia, tagi, data utworzenia / wynagrodzenie / tytuł
- **Szczegóły oferty** – pełny opis, dane kontaktowe, lokalizacja i wynagrodzenie
- **Tworzenie / edycja ofert** – formularz z walidacją (tytuł, opis, lokalizacja, wynagrodzenie, tagi, kontakt)
- **Uwierzytelnianie** – logowanie i rejestracja e-mail + hasło (Firebase Auth)
- **Menu użytkownika** – nowa oferta, „Moje oferty”, ustawienia, wylogowanie
- **Ustawienia** – język (EN/PL) i wygląd (Jasny / Auto / Ciemny)
- **Wykrywanie braku sieci** – sprawdzenie statusu sieci przed pobieraniem danych
- **Internacjonalizacja** – `i18next` + `react-i18next` z tłumaczeniami angielskimi i polskimi
- **Motyw** – systemowy / jasny / ciemny przez Zustand + React Native Paper (MD3)

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

## Struktura projektu (główne części)

```
app/                    # Ekrany Expo Router
  _layout.tsx           # Layout główny (PaperProvider, Stack, motyw)
  index.tsx             # Home – lista ofert
  login.tsx / register.tsx
  offer-details.tsx
  offer-form.tsx
  offer-filter.tsx
  settings.tsx
components/             # Komponenty UI (AppHeader, OfferItem, UserMenu, …)
hooks/                  # useAppTranslation, helpery parametrów wyszukiwania, color scheme
models/                 # Typy Offer, Location, User
services/               # AuthService, OffersService, UserService, FirebaseConfig
store/                  # useThemeStore, useLanguageStore
i18n/                   # Pliki tłumaczeń (en/, pl/)
```

## Rozpoczęcie pracy

### 1. Wymagania

- Node.js 18+
- Expo CLI / `npx expo`
- Projekt Firebase (włączone Auth + Firestore)

### 2. Instalacja zależności

```bash
npm install
```

### 3. Zmienne środowiskowe

Utwórz plik `.env` (lub skonfiguruj publiczne zmienne Expo) z konfiguracją Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

Aplikacja rzuca błąd, jeśli brakuje `EXPO_PUBLIC_FIREBASE_API_KEY`.

### 4. Uruchomienie aplikacji

```bash
npx expo start
```

Następnie otwórz w:

- Expo Go
- Symulatorze iOS
- Emulatorze Androida
- Przeglądarce (`npm run web`)

Wersje natywne:

```bash
npm run ios
npm run android
```

## Skrypty

| Komenda                 | Opis                                   |
| ----------------------- | -------------------------------------- |
| `npm start`             | Uruchom serwer deweloperski Expo       |
| `npm run android`       | Uruchom na Androidzie                  |
| `npm run ios`           | Uruchom na iOS                         |
| `npm run web`           | Uruchom wersję web                     |
| `npm run lint`          | Uruchom ESLint                         |
| `npm run reset-project` | Przenieś kod startowy do `app-example` |

## Główne ekrany i przepływy

1. **Home** (`/`) – lista ofert; ikona filtra otwiera modal filtrów.
2. **Filtr** (`/offer-filter`) – lokalizacja, zdalne, zakres wynagrodzenia, tagi, sortowanie; stosuje parametry i wraca do home.
3. **Szczegóły oferty** (`/offer-details?id=…`) – podgląd oferty; właściciel może edytować lub usunąć.
4. **Formularz oferty** (`/offer-form` lub z `id`) – tworzenie lub edycja oferty.
5. **Logowanie / Rejestracja** – Firebase e-mail/hasło; po sukcesie przekierowanie na home.
6. **Ustawienia** – język i motyw; wylogowanie po zalogowaniu.

Stan uwierzytelnienia obserwowany przez `react-firebase-hooks`. Oferty w kolekcji Firestore `offers`; użytkownicy w `users`.

## Lokalizacja

Tłumaczenia znajdują się w `i18n/en/` oraz `i18n/pl/`. Język jest zapisywany przez Zustand + AsyncStorage i synchronizowany przez `useAppTranslation`.

Obsługiwane języki: **English**, **Polski**.

## Motyw

- Sterowany przez `useThemeStore` (`light` | `dark` | `auto`).
- `auto` podąża za systemowym schematem kolorów.
- Aplikowany przez React Native Paper `MD3LightTheme` / `MD3DarkTheme` w root layout.

## Uwagi

- Wynagrodzenie `0` jest traktowane jako „do negocjacji”.
- Oferty zdalne przy zapisie czyszczą miasto/region/kraj.
- Parametry filtrów/wyszukiwania przekazywane są przez search params Expo Router i kompresowane helperami w `hooks/search-params-helpers.ts`.
- Część komponentów startowych Expo (parallax scroll, themed text/view, collapsible, icon-symbol) jest obecna, ale nie stanowi rdzenia przepływu ofert pracy.
