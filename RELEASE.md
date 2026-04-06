# 🚀 Maintainer Release Guide

This document outlines the exact workflow for publishing new versions of `fpx-now` to the npm registry and updating the documentation site.

## 1. Semantic Versioning (Which command to run?)
We follow standard SemVer (`v[Major].[Minor].[Patch]`).

* **`npm version patch` (v1.0.1 -> v1.0.2)**
    * **When to use:** Bug fixes, typo corrections in the README, refactoring code without changing how the user interacts with the tool.
* **`npm version minor` (v1.0.1 -> v1.1.0)**
    * **When to use:** Adding a completely new feature (e.g., adding an `fpx update` command) that does not break existing functionality.
* **`npm version major` (v1.0.1 -> v2.0.0)**
    * **When to use:** Breaking changes. If you completely rewrite how the configuration file works, or remove a command people rely on, you bump the major version.

## 2. The Release Workflow
When you are ready to publish a new version to the world, follow these exact steps:

### Step A: Normal Commits
Push your code to `main` as normal. (This does *not* trigger a publish).
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Step B: Cut the Release
Use npm to bump the version number. This automatically updates `package.json` and creates a Git tag for you.

```bash
npm version patch  # (or minor, or major)
```

### Step C: Push & Trigger Automation
Push the new code and the new tag to GitHub.

```bash
git push origin main --follow-tags
```

(This triggers the GitHub Action which publishes to npm, generates the GitHub Release, and updates `fpx.mehdiacho.tech`).

## FAQ: --tags vs --follow-tags
Always use `--follow-tags` instead of `--tags`.

`git push --tags` blindly pushes every single local tag you have on your machine to GitHub, even experimental ones that aren't attached to your current branch.

`git push --follow-tags` is much safer. It only pushes tags that are explicitly attached to the commits you are actively pushing to the `main` branch.

### Step 3: Save and Commit
Save that file, and then you can push it up to your repository using your new normal workflow (no need to bump the npm version just for adding this file!):

```bash
git add RELEASE.md
git commit -m "docs: add release guide cheat sheet"
git push origin main
```
