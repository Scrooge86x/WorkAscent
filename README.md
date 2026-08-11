# WorkAscent

[Polska wersja](README.pl.md)

A React Native (Expo) job offers app. Browse, filter, create and manage offers with authentication, EN/PL localization and light/dark theme.

## Table of contents

- [Features](#features)
- [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Install](#install)
    - [Environment variables](#environment-variables)
    - [Run](#run)
- [Scripts](#scripts)
- [Main screens](#main-screens)
- [Localization](#localization)
- [Theme](#theme)
- [Notes](#notes)
- [Tech stack](#tech-stack)
- [License](#license)

## Features

- Job offers list with pull-to-refresh
- Filtering and sorting (location, remote, salary range, tags, date / salary / title)
- Offer details, create and edit with validation
- Email/password auth (Firebase)
- User menu: new offer, my offers, settings, logout
- Settings: language (EN/PL), appearance (Light / Auto / Dark)
- Offline check before network requests
- i18n (English, Polish)
- System / light / dark theme

## Getting started

### Prerequisites

- **Node.js 20.19+** (required by Expo SDK 54)
- Expo CLI (`npx expo`)
- Firebase project with Auth and Firestore enabled

### Install

```bash
npm install
```

### Environment variables

Create a `.env` with your Firebase config:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

The app throws if `EXPO_PUBLIC_FIREBASE_API_KEY` is missing.

### Run

```bash
npx expo start
```

Then open in Expo Go, iOS Simulator or Android Emulator.

```bash
npm run ios
npm run android
```

## Scripts

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `npm start`             | Start Expo dev server              |
| `npm run android`       | Run on Android                     |
| `npm run ios`           | Run on iOS                         |
| `npm run web`           | Start web (not the primary target) |
| `npm run lint`          | ESLint                             |
| `npm run reset-project` | Move starter code to `app-example` |

## Main screens

1. **Home** (`/`) – offers list; filter opens the filter screen
2. **Filter** (`/offer-filter`) – location, remote, salary, tags, sort → applies params and returns home
3. **Offer details** (`/offer-details?id=…`) – view; owner can edit or delete
4. **Offer form** (`/offer-form` or with `id`) – create or edit
5. **Login / Register** – Firebase email/password → home on success
6. **Settings** – language, theme, logout

Auth state via `react-firebase-hooks`. Offers live in Firestore `offers`, users in `users`.

## Localization

Translations under `i18n/en/` and `i18n/pl/`. Language is persisted (Zustand + AsyncStorage) and synced with `useAppTranslation`.

## Theme

`useThemeStore`: `light` | `dark` | `auto` (follows system). Applied with React Native Paper MD3 themes in the root layout.

## Notes

- Salary `0` means “for negotiation”
- Remote offers clear city / region / country on save
- Filter params go through Expo Router search params (`hooks/search-params-helpers.ts`)

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
