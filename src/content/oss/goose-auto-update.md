---
title: "Automatic Update Installation"
description: "Added auto-download and install functionality for Goose desktop app updates."
repo: "block/goose"
repoUrl: "https://github.com/block/goose"
type: "pr"
link: "https://github.com/block/goose/pull/5345"
publishDate: "2025-12-01"
tags:
    - TypeScript
    - Electron
    - Desktop
---

Implemented a feature request to have Goose auto-download and install updates when available.

## What I did

- Built automatic update detection and download functionality
- Integrated with Electron's auto-updater system
- Added UI feedback for update progress and status

## Testing

- Built the app locally (`npm run package` / `npm run make`)
- Verified updates auto-downloaded to the downloads folder
- Confirmed correct release versions were fetched (tested on macOS)

## Impact

- Part of Hacktoberfest 2025 (large contribution)
- Merged into main branch
- Improves user experience by automating the update process
