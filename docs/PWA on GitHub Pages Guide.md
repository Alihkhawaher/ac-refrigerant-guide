# PWA on GitHub Pages Guide

> How to make your static website installable as a Progressive Web App (PWA) and host it on GitHub Pages.  
> Based on a real working project — everything here is tested and confirmed.

---

## Table of Contents

1. [What is a PWA?](#what-is-a-pwa)
2. [PWA Requirements Checklist](#pwa-requirements-checklist)
3. [File Structure](#file-structure)
4. [Step 1 — Create manifest.json](#step-1--create-manifestjson)
5. [Step 2 — Create sw.js (Service Worker)](#step-2--create-swjs-service-worker)
6. [Step 3 — Update index.html](#step-3--update-indexhtml)
7. [Step 4 — Add App Icons](#step-4--add-app-icons)
8. [Step 5 — Deploy to GitHub Pages](#step-5--deploy-to-github-pages)
9. [What Works ✅ vs What Does NOT Work ❌](#what-works--vs-what-does-not-work-)
10. [Testing Your PWA](#testing-your-pwa)
11. [Common Issues & Fixes](#common-issues--fixes)
12. [Install Banner (Optional)](#install-banner-optional)

---

## What is a PWA?

A **Progressive Web App** is a regular website that browsers can install like a native app. When installed:
- It appears on the home screen / desktop
- Opens without browser chrome (looks like a native app)
- Works **offline** (via the service worker cache)
- Gets its own app icon

PWAs work on Android, iOS, Windows, and macOS.

---

## PWA Requirements Checklist

For a browser to offer installation, your site must have ALL of these:

- [ ] Served over **HTTPS** (GitHub Pages does this automatically ✅)
- [ ] A `manifest.json` file linked in `<head>`
- [ ] A **service worker** registered from the page
- [ ] The manifest has: `name`, `short_name`, `start_url`, `display: "standalone"`, and at least one icon (192×192)
- [ ] The service worker must be on the **same origin** as the page

---

## File Structure

Minimum files needed:

```
your-repo/
├── index.html          ← your main page
├── manifest.json       ← PWA manifest
├── sw.js               ← service worker
├── .nojekyll           ← prevents GitHub Jekyll processing
└── icons/
    ├── icon-192.png    ← required
    └── icon-512.png    ← recommended
```

---

## Step 1 — Create manifest.json

Place this file at the **root** of your repo:

```json
{
  "name": "My App Full Name",
  "short_name": "My App",
  "description": "A short description of what the app does",
  "id": "./",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0077b6",
  "orientation": "any",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### ⚠️ Critical: Use `./` NOT `/` for GitHub Pages

GitHub Pages hosts your site at a **subdirectory**: `https://username.github.io/repo-name/`

| Field | ✅ Correct | ❌ Wrong |
|-------|-----------|---------|
| `start_url` | `"./"` | `"/"` |
| `scope` | `"./"` | `"/"` |
| `id` | `"./"` | `"/"` |
| icon `src` | `"icons/icon-192.png"` | `"/icons/icon-192.png"` |

Using `/` means the root of the GitHub Pages domain (`https://username.github.io/`), NOT your app's subdirectory. This will break installation and offline functionality.

### Display modes explained

| Value | Behavior |
|-------|----------|
| `"standalone"` | Opens without browser UI — looks like a native app ✅ |
| `"fullscreen"` | No status bar at all (good for games) |
| `"minimal-ui"` | Keeps a minimal browser toolbar |
| `"browser"` | Opens in a regular browser tab (not really a PWA) |

---

## Step 2 — Create sw.js (Service Worker)

Place this at the **root** of your repo. This is what makes the app work offline.

```javascript
var CACHE_NAME = 'my-app-v1';
var ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
  // Add ALL files your app needs to work offline
];

// Install: cache all assets
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting(); // Activate immediately
    })
  );
});

// Activate: delete old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names
          .filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim(); // Take control of all open pages
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        // Cache new successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      });
    }).catch(function() {
      // Offline fallback: serve index.html for navigation requests
      if (e.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
```

### When to update the cache version

Every time you change your files, **bump the cache version** in `CACHE_NAME`:

```javascript
// Before
var CACHE_NAME = 'my-app-v1';

// After a code change
var CACHE_NAME = 'my-app-v2';
```

This forces old service workers to be replaced and users get the new version. If you don't bump the version, returning users may keep seeing stale cached content.

### ⚠️ Critical: Use `./` NOT `/` in ASSETS list

```javascript
// ✅ Correct — relative paths
var ASSETS = [
  './',
  './index.html',
  './css/styles.css'
];

// ❌ Wrong — absolute paths break under GitHub Pages subdirectory
var ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css'
];
```

### Service worker scope

The service worker at `sw.js` in the root automatically controls all pages under its directory. On GitHub Pages this means it controls `https://username.github.io/repo-name/` and everything under it — which is what you want.

---

## Step 3 — Update index.html

Add these to your `<head>` section:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>

  <!-- PWA meta tags -->
  <meta name="theme-color" content="#0077b6">
  <meta name="description" content="Your app description here">

  <!-- iOS PWA support (Safari doesn't use manifest for these) -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="My App">
  <link rel="apple-touch-icon" href="icons/icon-192.png">

  <!-- PWA Manifest -->
  <link rel="manifest" href="manifest.json">

  <!-- Your styles -->
  <link rel="stylesheet" href="css/styles.css">
</head>
```

Add this **before `</body>`** to register the service worker:

```html
<!-- Service Worker Registration -->
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js')
      .then(function(reg) {
        console.log('SW registered, scope:', reg.scope);
      })
      .catch(function(err) {
        console.error('SW registration failed:', err);
      });
  });
}
</script>
```

### Why register on `load` event?

Registering inside `window.addEventListener('load', ...)` means the service worker only registers **after the page has fully loaded**. This avoids the service worker competing with the page's own network requests during initial load, giving better performance.

---

## Step 4 — Add App Icons

You need at minimum:
- `icons/icon-192.png` — 192×192 pixels
- `icons/icon-512.png` — 512×512 pixels

### Icon requirements

| Property | Requirement |
|----------|-------------|
| Format | PNG (recommended), WebP, or SVG |
| Shape | Square |
| Background | Solid color (avoid transparency for `maskable`) |
| Min size | 192×192px (required), 512×512px (strongly recommended) |

### `purpose: "any"` vs `purpose: "maskable"`

- **`"any"`** — Used as-is on any platform
- **`"maskable"`** — The icon will be cropped into a circle/rounded square on Android. The icon design should have a **"safe zone"** — keep important content in the center 80% of the image

If you only have one icon, you can declare it twice with both purposes (like in this project's `manifest.json`). This is acceptable when the icon already looks good both masked and unmasked.

### Free tools to create icons
- [Favicon.io](https://favicon.io) — generate icons from text, image, or emoji
- [RealFaviconGenerator](https://realfavicongenerator.net) — comprehensive icon generator
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) — CLI tool

---

## Step 5 — Deploy to GitHub Pages

This is covered in detail in the **GitHub Pages Deployment Guide**, but in short:

1. Make sure your repo has `.github/workflows/pages.yml` using the modern Actions method
2. Make sure GitHub Pages source is set to **"GitHub Actions"** (not "Deploy from a branch")
3. Make sure `.nojekyll` exists at the root
4. Push to your main branch

The service worker **requires HTTPS** to work. GitHub Pages always uses HTTPS, so this is handled automatically.

> 💡 See `GitHub Pages Deployment Guide.md` in this folder for the complete deployment workflow.

---

## What Works ✅ vs What Does NOT Work ❌

### manifest.json

| Setting | Works? | Notes |
|---------|--------|-------|
| `"start_url": "./"` | ✅ Yes | Correct for GitHub Pages subdirectory |
| `"start_url": "/"` | ❌ No | Points to domain root, not your app |
| `"scope": "./"` | ✅ Yes | Controls the correct subdirectory |
| `"display": "standalone"` | ✅ Yes | Looks like a native app |
| Icon with both `"any"` and `"maskable"` purpose | ✅ Yes | Covers all platforms |
| Icon paths as `"icons/icon-192.png"` | ✅ Yes | Relative, works under subdirectory |
| Icon paths as `"/icons/icon-192.png"` | ❌ No | Absolute, breaks under subdirectory |

### Service Worker

| Setting | Works? | Notes |
|---------|--------|-------|
| `sw.js` at root | ✅ Yes | Controls the entire app scope |
| `sw.js` in a subfolder (e.g., `js/sw.js`) | ❌ No | Scope is limited to that subfolder only — can't control `./index.html` |
| Relative asset paths `'./'` | ✅ Yes | Works under subdirectory |
| Absolute asset paths `'/'` | ❌ No | Cache requests go to wrong URL |
| `self.skipWaiting()` in install | ✅ Yes | New SW activates immediately |
| `self.clients.claim()` in activate | ✅ Yes | SW takes control of open tabs immediately |
| Caching cross-origin requests (CDN fonts, etc.) | ❌ No | `response.type === 'basic'` check blocks it. Handle opaque responses separately or skip caching them |

### iOS / Safari specifics

| Feature | Works? | Notes |
|---------|--------|-------|
| `beforeinstallprompt` event | ❌ No | iOS doesn't fire this event |
| `<meta name="apple-mobile-web-app-capable">` | ✅ Yes | Required for iOS standalone mode |
| `<link rel="apple-touch-icon">` | ✅ Yes | Required for iOS home screen icon |
| Offline caching via service worker | ✅ Yes | Works on iOS 11.3+ |
| Push notifications via PWA | ❌ Limited | Only supported on iOS 16.4+ and only when installed |

---

## Testing Your PWA

### Chrome DevTools

1. Open your deployed site in Chrome
2. Press `F12` → go to **Application** tab
3. Check:
   - **Manifest** — should show your manifest details with no errors
   - **Service Workers** — should show your SW as "activated and running"
   - **Cache Storage** — should list your `CACHE_NAME` with all cached files

### Lighthouse Audit

1. `F12` → **Lighthouse** tab
2. Check "Progressive Web App"
3. Click **Analyze page load**
4. Aim for all PWA checks to be green

### Test offline

1. In DevTools → **Application** → **Service Workers**
2. Check the **"Offline"** checkbox
3. Reload the page — it should still work from cache

### Test on mobile

1. Open the site in Chrome on Android
2. Wait 2+ minutes for Chrome to qualify the install prompt
3. You should see an **"Add to Home Screen"** banner or prompt
4. On iOS: tap the Share button → "Add to Home Screen"

---

## Common Issues & Fixes

### "Service Worker registration failed"

**Cause:** The SW file path is wrong, or you're testing on `http://localhost` without a dev server that supports SW (some don't).

**Fix:** 
- Make sure `sw.js` is at the **root** of the site
- Test on the deployed HTTPS site, or use `http://localhost` (localhost is whitelisted for SW)
- Check the browser console for the exact error

---

### PWA install prompt never shows

**Cause:** Browser has strict criteria before showing the install prompt.

**Requirements Chrome checks:**
- Served over HTTPS ✓
- Has a valid manifest with `name`, `short_name`, `start_url`, `icons` ✓
- Has a registered service worker ✓
- User has interacted with the page for at least 30 seconds (Chrome heuristic)

**Fix:** Wait a bit on the page before expecting the prompt. You can listen for it:
```javascript
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  // Show your own install button/banner
});
```

---

### Cached old version keeps showing after an update

**Cause:** You changed the code but didn't bump `CACHE_NAME` in `sw.js`.

**Fix:** Change `CACHE_NAME` to a new value (e.g., `my-app-v2`). This triggers the old SW to delete old caches and install fresh ones.

---

### Icons don't show on iOS

**Cause:** iOS ignores the manifest `icons` for home screen — it uses `apple-touch-icon` instead.

**Fix:** Make sure you have this in `<head>`:
```html
<link rel="apple-touch-icon" href="icons/icon-192.png">
```

---

### App opens in browser instead of standalone mode on iOS

**Cause:** Missing `apple-mobile-web-app-capable` meta tag.

**Fix:** Add to `<head>`:
```html
<meta name="apple-mobile-web-app-capable" content="yes">
```

---

## Install Banner (Optional)

You can show a custom install banner to prompt users to install the PWA. Add this to your HTML and JS:

**HTML** (just before `</body>`):
```html
<div id="installBanner" style="display:none; position:fixed; bottom:0; left:0; right:0;
     background:#0077b6; color:#fff; padding:12px 16px;
     display:flex; align-items:center; justify-content:space-between;
     z-index:9999; box-shadow:0 -2px 10px rgba(0,0,0,0.3);">
  <span>📲 Install this app for offline use</span>
  <button id="installDismiss" style="background:none;border:1px solid #fff;
          color:#fff;padding:4px 10px;border-radius:4px;cursor:pointer;">✕</button>
</div>
```

**JavaScript**:
```javascript
(function() {
  var deferredPrompt = null;
  var banner = document.getElementById('installBanner');
  var dismissBtn = document.getElementById('installDismiss');

  // Chrome/Edge/Android: listen for install prompt
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    // Show banner after user has been on page a bit
    setTimeout(function() { banner.style.display = 'flex'; }, 2000);
  });

  // Clicking the banner triggers the install
  banner.addEventListener('click', function(ev) {
    if (ev.target === dismissBtn) {
      banner.style.display = 'none';
      return;
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(result) {
        banner.style.display = 'none';
        deferredPrompt = null;
      });
    }
  });

  // Hide if already installed
  window.addEventListener('appinstalled', function() {
    banner.style.display = 'none';
  });

  // iOS: beforeinstallprompt doesn't fire — show instructions instead
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  var isStandalone = window.navigator.standalone;
  if (isIOS && !isStandalone) {
    setTimeout(function() { banner.style.display = 'flex'; }, 3000);
    // Override click to show iOS instructions
    banner.addEventListener('click', function(ev) {
      if (ev.target !== dismissBtn) {
        alert('To install on iOS:\nTap the Share button (□↑) then tap "Add to Home Screen"');
      }
      banner.style.display = 'none';
    });
  }
})();
```

---

## Quick Reference: Complete PWA Checklist

### Files needed
- [ ] `manifest.json` at root with `name`, `short_name`, `start_url: "./"`, `scope: "./"`, `display: "standalone"`, and icons
- [ ] `sw.js` at root (NOT in a subfolder)
- [ ] `icons/icon-192.png` (192×192px)
- [ ] `icons/icon-512.png` (512×512px)
- [ ] `.nojekyll` at root

### index.html `<head>` tags
- [ ] `<link rel="manifest" href="manifest.json">`
- [ ] `<meta name="theme-color" content="...">`
- [ ] `<meta name="apple-mobile-web-app-capable" content="yes">`
- [ ] `<meta name="apple-mobile-web-app-title" content="...">`
- [ ] `<link rel="apple-touch-icon" href="icons/icon-192.png">`

### index.html before `</body>`
- [ ] Service worker registration script

### Paths — always relative
- [ ] manifest.json icon paths: `"icons/icon-192.png"` (no leading `/`)
- [ ] manifest.json start_url/scope/id: `"./"`
- [ ] sw.js ASSETS array: `'./'`, `'./index.html'` etc.

### GitHub Pages
- [ ] Deployed over HTTPS (automatic with GitHub Pages)
- [ ] `build_type: workflow` in GitHub Pages settings
- [ ] Correct workflow file (see `GitHub Pages Deployment Guide.md`)
