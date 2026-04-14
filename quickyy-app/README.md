# Quickyy App

Quickyy is an Expo + React Native canteen ordering app with:
- Student and vendor auth flows
- Profile module (edit profile, settings, permissions, payment methods)
- Dark/light/system theme support
- Notification center
- My reviews + rating flow
- Firebase-ready auth and data collection

## Setup

1. Install dependencies
```bash
npm install
```

2. Configure Firebase in `app.json` -> `expo.extra`
```json
{
  "FIREBASE_API_KEY": "...",
  "FIREBASE_AUTH_DOMAIN": "...",
  "FIREBASE_PROJECT_ID": "...",
  "FIREBASE_STORAGE_BUCKET": "...",
  "FIREBASE_MESSAGING_SENDER_ID": "...",
  "FIREBASE_APP_ID": "..."
}
```

If Firebase keys are empty, app still runs with local storage fallback.

3. Start app
```bash
npx expo start
```

4. Run readiness checks
```bash
npm run check
```

## Deploy Readiness Checklist

- Set all Firebase keys in `app.json`
- Enable Firebase Auth (Anonymous + Email/Password)
- Create Firestore database and rules
- Verify app icons/splash and package IDs in `app.json`
- Ensure `google-services.json` exists at project root
- Run lint before release:
```bash
npm run lint
```

## Build Android APK / AAB

1. Login to Expo account:
```bash
npx eas login
```

2. Build installable APK (internal testing):
```bash
npm run build:apk
```

3. Build Play Store AAB (production):
```bash
npm run build:aab
```

4. Download build artifacts from the Expo build URL shown in terminal output.
