# GitHub Pages Deployment Guide

> Based on real troubleshooting experience from this project. Everything here is tested and confirmed.

---

## Table of Contents

1. [Requirements](#requirements)
2. [The Correct Workflow File](#the-correct-workflow-file)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [What Works ✅](#what-works)
5. [What Does NOT Work ❌](#what-does-not-work)
6. [Common Failure Modes & How to Diagnose](#common-failure-modes--how-to-diagnose)
7. [PWA Notes for GitHub Pages](#pwa-notes-for-github-pages)
8. [How to Re-deploy Manually](#how-to-re-deploy-manually)

---

## Requirements

### Repository Requirements
- A public GitHub repository (GitHub Pages is free for public repos)
- Your main branch is named `master` or `main` (note it in the workflow trigger)
- All site files live at the root of the repo (or a subfolder — configure `path` accordingly)
- A `.nojekyll` file at the root **if** you don't want Jekyll to process your files

### GitHub Settings Requirements
- **Pages source MUST be set to "GitHub Actions"** — NOT "Deploy from a branch"
- The `github-pages` environment must be allowed to deploy (it's auto-created on first run)

### Workflow File Requirements
- Must be placed at: `.github/workflows/<any-name>.yml`
- Needs three specific permissions: `contents: read`, `pages: write`, `id-token: write`
- Must use the official GitHub Pages actions (see below)

---

## The Correct Workflow File

Save this as `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]   # Change to "main" if your branch is named main
  workflow_dispatch:     # Allows manual trigger from GitHub Actions tab

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'          # '.' = root of repo. Change to './dist' for built projects

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Step-by-Step Setup

### First-time setup

**Step 1 — Set GitHub Pages source to "GitHub Actions"**

You can do this two ways:

**Option A — Via GitHub CLI (recommended):**
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" api repos/YOUR_USERNAME/YOUR_REPO/pages --method PUT -f build_type=workflow
```

**Option B — Via GitHub website manually:**
1. Go to your repo on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under "Build and deployment" → Source, select **"GitHub Actions"**
4. Click Save

**Step 2 — Add the workflow file**

Create `.github/workflows/pages.yml` with the content above.

**Step 3 — Add `.nojekyll` to root (for static HTML/JS sites)**

This tells GitHub NOT to run Jekyll processing on your files:
```powershell
New-Item .nojekyll -ItemType File
```

**Step 4 — Commit and push**
```powershell
git add .
git commit -m "add: GitHub Pages deployment workflow"
git push origin master
```

**Step 5 — Watch the workflow run**
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" run list --repo YOUR_USERNAME/YOUR_REPO --limit 5
```

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## What Works ✅

| Approach | Works? | Notes |
|----------|--------|-------|
| **Modern Actions deployment** (`actions/configure-pages` + `upload-pages-artifact` + `deploy-pages`) | ✅ Yes | The correct method. Deploys in ~2–5 minutes |
| `workflow_dispatch` trigger | ✅ Yes | Lets you redeploy manually from the Actions tab |
| Static HTML/CSS/JS sites | ✅ Yes | No build step needed, just upload the files |
| `path: '.'` (deploy from root) | ✅ Yes | Deploys everything in the repo root |
| `path: './dist'` (deploy a build output folder) | ✅ Yes | For React/Vue/etc. built projects |
| `.nojekyll` file | ✅ Yes | Required to prevent Jekyll from mangling files with underscores in names |
| PWA with `manifest.json` and `sw.js` | ✅ Yes | Works fine, see [PWA Notes](#pwa-notes-for-github-pages) |
| Setting `build_type=workflow` via GitHub API | ✅ Yes | Switches Pages source from branch to Actions without going to web UI |
| `concurrency` block in workflow | ✅ Yes | Prevents two deployments running at the same time |

---

## What Does NOT Work ❌

| Approach | Works? | Why it fails |
|----------|--------|-------------|
| **`peaceiris/actions-gh-pages`** (push to `gh-pages` branch) with Pages set to "GitHub Actions" | ❌ No | Pushes to branch but the Pages workflow doesn't pick it up properly |
| **Legacy "Deploy from a branch"** source (`build_type: legacy`) | ❌ Unreliable | Triggers GitHub's `pages build and deployment` which gets **stuck in `deployment_queued` forever** and times out after 10 minutes |
| Using `contents: write` only (without `pages: write` and `id-token: write`) | ❌ No | `actions/deploy-pages` will fail with an authentication error |
| Having both a `gh-pages` branch AND using the modern workflow | ❌ Conflict | GitHub gets confused about which source to use |
| Skipping `actions/configure-pages` step | ❌ No | Without it, the artifact won't be formatted correctly for Pages |
| Using `permissions: contents: write` with the modern deployment approach | ❌ No | Modern Pages deployment needs `pages: write` + `id-token: write` |

---

## Common Failure Modes & How to Diagnose

### Symptom: Workflow passes but site shows 404

**Cause:** GitHub Pages source is still set to "Deploy from a branch" (legacy) instead of "GitHub Actions".

**Check:**
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" api repos/USERNAME/REPO/pages
```
Look at `"build_type"` — it must be `"workflow"`, not `"legacy"`.

**Fix:**
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" api repos/USERNAME/REPO/pages --method PUT -f build_type=workflow
```

---

### Symptom: `pages build and deployment` workflow runs and gets stuck for 10+ minutes then fails

**Cause:** You are using the old "Deploy from a branch" method (legacy pipeline). GitHub's build queue sometimes gets stuck indefinitely.

**Fix:** Switch to the modern Actions-based deployment (see workflow above). Do NOT use `peaceiris/actions-gh-pages` for new projects.

---

### Symptom: `actions/deploy-pages` step hangs for several minutes

**Not a bug.** The deploy step contacts GitHub's Pages API and waits for confirmation. It normally takes 2–5 minutes. The old legacy method took 10+ minutes and then timed out — the new method actually completes.

---

### Symptom: Workflow fails with "Resource not accessible by integration"

**Cause:** Missing `pages: write` or `id-token: write` in permissions.

**Fix:** Make sure your workflow has:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

---

### Symptom: Pages API returns `"status": "errored"`

This is the GitHub Pages *last build* status. After you fix the workflow and push, this will update to `"built"` once the new workflow succeeds. It reflects the previous state.

---

### How to check Pages status at any time
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" api repos/USERNAME/REPO/pages
```

Key fields to look at:
- `"status"`: should be `"built"` when healthy, `"errored"` when something failed
- `"build_type"`: must be `"workflow"` (not `"legacy"`)
- `"html_url"`: the live URL of your site

---

## PWA Notes for GitHub Pages

When your site is deployed to GitHub Pages, it lives at a **subdirectory URL**: `https://username.github.io/repo-name/`

### manifest.json — Use relative `./` paths
```json
{
  "start_url": "./",
  "scope": "./",
  "id": "./"
}
```
✅ Relative paths like `./` work correctly under the subdirectory.  
❌ Absolute paths like `/` will break (they point to `https://username.github.io/` not your app).

### sw.js — Use relative paths for cached assets
```javascript
var ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js'
  // etc.
];
```
✅ `./` relative paths work correctly.  
❌ Absolute paths like `/index.html` will 404 when cached.

### Service worker registration in index.html
```javascript
navigator.serviceWorker.register('sw.js')
```
✅ Registering `'sw.js'` (relative, no `./`) works correctly.

### The `scope` in manifest.json
Since your app is at `/repo-name/`, setting `"scope": "./"` means the SW controls `https://username.github.io/repo-name/` — which is correct.

---

## How to Re-deploy Manually

If you want to re-deploy without making a code change:

**Option A — GitHub website:**
1. Go to your repo → **Actions** tab
2. Click "Deploy to GitHub Pages" in the left sidebar
3. Click **"Run workflow"** button → **"Run workflow"**

**Option B — GitHub CLI:**
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" workflow run pages.yml --repo USERNAME/REPO
```

**Option C — Make a dummy commit:**
```powershell
git commit --allow-empty -m "chore: re-trigger deployment"
git push origin master
```

---

## Quick Reference: Checklist for New Projects

- [ ] Repo is public (or you have GitHub Pro/Team for private Pages)
- [ ] `.github/workflows/pages.yml` exists with the correct content
- [ ] Permissions include `pages: write` and `id-token: write`
- [ ] GitHub Pages source is set to **"GitHub Actions"** (`build_type: workflow`)
- [ ] `.nojekyll` file exists at root (for static sites)
- [ ] `manifest.json` uses relative `./` paths (for PWA)
- [ ] `sw.js` uses relative `./` paths (for PWA)
- [ ] Pushed to the trigger branch (`master` or `main`)
