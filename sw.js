/* Crate service worker — offline shell + font caching.
   Never touches Spotify API or auth traffic. */
"use strict";

const VERSION = "crate-v6";
const SHELL = ["./", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Never intercept Spotify API/auth or album artwork — always live.
  if (/spotify\.com$|scdn\.co$|spotifycdn\.com$/.test(url.hostname)) return;

  // App shell: network-first so updates arrive, cache as offline fallback.
  if (req.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put("./", copy));
          return res;
        })
        .catch(() => caches.match("./"))
    );
    return;
  }

  // Fonts + same-origin static assets: cache-first, refresh in background.
  if (url.hostname.includes("fonts.g") || url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const refetch = fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => hit);
        return hit || refetch;
      })
    );
  }
});
