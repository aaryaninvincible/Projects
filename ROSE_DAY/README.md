# Rose Day Project

## Files
- `index.html`: page to send your crush
- `admin.html`: your live response dashboard
- `styles.css`: theme + animations
- `app.js`: step flow + Firebase logging

## Firebase Setup
1. Create a Firebase project.
2. Enable **Cloud Firestore** in test mode first.
3. Open `ROSE_DAY/app.js`.
4. Paste your Firebase config.
5. Host this folder on Firebase Hosting, Netlify, or GitHub Pages.

## Stored Data
All interaction steps are written to Firestore collection:
- `rose_day_events`

Events include:
- `page_opened`
- `rose_button_clicked`
- `bouquet_stage_1`
- `bouquet_stage_2`
- `bouquet_stage_3_complete`
- `chocolate_response_submitted` (with `answer: yes/no`)

## How You Track Responses
1. Share `index.html` link with her.
2. Open `admin.html` yourself.
3. You will see new events and answer updates appear there.
