# Crate

A personal web app that shows your Spotify Liked Songs the way iTunes used to: browsable by artist, grouped by album, with an A–Z jump rail. No backend, no build step. Your data never leaves your device — the app talks directly to Spotify's API from your browser and caches the library in local storage.

Files: `index.html` (the whole app), `manifest.webmanifest` + `sw.js` + the two icons (PWA install and offline support). Upload all of them to the same folder.

## What you need

- A Spotify **Premium** account (Spotify requires this for all new developer apps as of Feb 2026)
- A free hosting account (GitHub Pages, Netlify, or Vercel — any static host with HTTPS works)

## Setup (10 minutes, one time)

### 1. Host the file

The app must be served over HTTPS for Spotify login to work (opening the file directly from your phone/computer won't work). The fastest option is GitHub Pages:

1. Create a new repository on github.com (e.g. `crate`), public or private with Pages enabled.
2. Upload all the files (`index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`) to it.
3. In the repo: Settings → Pages → Source: "Deploy from a branch" → branch `main`, folder `/ (root)` → Save.
4. After a minute your app is live at `https://YOURUSERNAME.github.io/crate/`

(Netlify alternative: go to app.netlify.com/drop and drag the folder in — done.)

### 2. Create your Spotify app

1. Go to https://developer.spotify.com/dashboard and log in with your Spotify account.
2. Click "Create app". Name and description can be anything (e.g. "Crate").
3. For **Redirect URI**, open your hosted app once — the setup screen displays the exact URI to copy (it's just your app's own URL, e.g. `https://YOURUSERNAME.github.io/crate/`). Paste it in and save. The URI must match exactly, including the trailing slash.
4. Under "Which API/SDKs are you planning to use?", select **Web API**.
5. Save, then open the app's settings and copy the **Client ID**.

### 3. Connect

Open your hosted app, paste the Client ID, tap "Connect Spotify", and approve access. The first sync pulls your whole library (a 4,000-song library takes roughly a minute — 50 songs per request). After that, opening the app is instant: it loads from cache and quietly checks for new likes in the background.

## Everyday use

- **Artists tab** — your whole library grouped by artist, with an iPod-style A–Z rail on the right edge for jumping. Sort chips switch between A–Z (ignoring "The"), most liked, and most recently liked from. A "Main only" toggle hides artists who only appear as features on your liked songs — it also filters the top-artists and one-hit-wonder lists in Stats, and it remembers your choice.
- **Artist page** — tap an artist to see every song you've liked from them, grouped by album, newest first. Tap a song to open it in the Spotify app.
- **Songs tab** — all liked songs, newest first, searchable by title or artist.
- **Stats tab** — totals, likes per year, a by-decade breakdown of when your music was released, your top artists, a duplicate finder (same song liked from different releases — singles vs. albums, remasters), and every one-hit wonder in your library.
- **Game tab** — a Heardle-style guessing game. Pick Liked Songs or one of your playlists; a mystery song plays for 1 second, then 2, 4, 7, 11, and 16 across six tries, with autocomplete guessing from that source. Streams audio right in the browser (first use asks you to reconnect once, to grant the playback permission). Win/loss stats and streaks are tracked. Works best in Chrome; playback requires Premium.
- **Settings (gear icon)** — sync new likes, full resync, log out.

On Android, Chrome will offer "Install app" (menu → Add to Home screen) — it launches fullscreen with its own icon, and your cached library is browsable even offline.

## Things worth knowing

- **Unliked songs**: the quick sync compares your cached count against Spotify's total, so if you've unliked songs elsewhere, a banner appears offering a one-tap resync. (The quick sync itself only fetches new likes — that's what makes it fast.)
- **Updating the app**: if you replace `index.html` later, also bump the `VERSION` string at the top of `sw.js` so installed copies fetch the new version promptly. Reloading twice also works.
- **Only you (plus up to 4 others)** can use your app: Spotify's Development Mode allows 5 users per app, and additional users must be added under "User Management" in the developer dashboard.
- **If your Premium lapses**, the Spotify app tied to your account stops working until you resubscribe (Spotify's rule, not the app's).
- **Game audio and spoilers**: the game overrides the phone's media notification to say "Mystery song" while a round is live, but the notification may flash the real title for an instant when playback starts — glance away if you're a purist. Starting the game also makes "Crate Game" your active Spotify device; switch back in the Spotify app afterwards if you were listening on your phone.
- Your Client ID is not a secret in this setup — PKCE auth is designed for exactly this kind of public client app.

## Ideas for later

Playback control from inside the app (the player API endpoints are still available to Development Mode apps), a "one-hit wonders" view of artists you've only liked once, filtering by the year you liked songs, or building a playlist from an artist's liked songs (`POST /me/playlists` + `POST /playlists/{id}/items`).
