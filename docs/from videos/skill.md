# Downloading YouTube Subtitles to `from videos` Folder

## Prerequisites

- `yt-dlp` must be installed (`yt-dlp --version` to verify)

## Steps

### 1. List Available Subtitles

First, check what subtitle tracks are available for the video:

```bash
yt-dlp --list-subs "https://www.youtube.com/watch?v=VIDEO_ID"
```

Look for Arabic options:
- `ar-orig` — Arabic (Original auto-detected language captions) — **prefer this**
- `ar` — Arabic (translated from another language)

### 2. Download Arabic Subtitles

Download only the subtitles (no video) in SRT format:

```bash
yt-dlp --write-auto-subs --sub-langs "ar-orig" --sub-format srt --skip-download -o "docs/from videos/VIDEO_ID" "https://www.youtube.com/watch?v=VIDEO_ID"
```

This creates a file: `docs/from videos/VIDEO_ID.ar-orig.srt`

### 3. Get the Video Title

Get the exact video title from YouTube:

```bash
yt-dlp --get-title "https://www.youtube.com/watch?v=VIDEO_ID"
```

### 4. Rename to Standard Naming Convention

Rename the file following this pattern:

```
<subject>-<videoId>.srt
```

**Rules:**
- `<subject>` — The **exact video title** obtained from `yt-dlp --get-title`
- `<videoId>` — The YouTube video ID (the `v=` parameter from the URL)
- Separate subject and videoId with a hyphen `-`
- Replace spaces in the subject with underscores `_`
- Use Western numerals (not Arabic-Indic)
- Remove any extra punctuation (e.g., multiple dots, question marks)

**Example:**
Video title: `من افضل في التبريد......غاز ٢٢ او ٤١٠`
Filename: `من_افضل_في_التبريد_غاز_22_او_410-hCjjIQ7GOEU.srt`

### 5. Verify

Confirm the file exists and contains Arabic content:

```bash
dir "docs\from videos\*.srt"
```

## Quick Reference Command

```bash
yt-dlp --write-auto-subs --sub-langs "ar-orig" --sub-format srt --skip-download -o "docs/from videos/VIDEO_ID" "https://www.youtube.com/watch?v=VIDEO_ID"
ren "docs\from videos\VIDEO_ID.ar-orig.srt" "<SUBJECT>-VIDEO_ID.srt"