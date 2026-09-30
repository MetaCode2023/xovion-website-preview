# Build status

Version 0.1: working editable homepage, demo inquiry dialog, guided setup, optional sections, public business details and Cloudflare Worker Static Assets. Preview and production use separate commands; production requires approved content and a real contact destination.

## Plug-and-play onboarding

- `/start/` provides a browser questionnaire, personalized business brief and first Codex prompt.
- Users can copy the complete kit or download two Markdown files. Answers stay in page memory; there is no server submission or storage.
- Packaged guides and a Cloudflare preview setup button explain the account, repository, build and domain steps.
- `npm run deploy` explicitly targets preview. Production builds exclude onboarding and packaged guides.
- Reusable UI/UX prompts guide improvements without forcing a fixed design preset.

## Verification

23 unit tests cover configuration, escaping, setup/backups, questionnaire validation, private-information scanning, watcher recovery and Worker behavior. GitHub Actions runs these checks plus Chromium desktop/phone browser checks on the actual Wrangler Worker.

The clean-copy rehearsal installs dependencies, customizes a fictional business, verifies output, performs a Cloudflare dry run and builds production. It checks the sitemap and onboarding exclusion. This exposed a production sitemap variable error, now fixed. No actual deployment occurs during rehearsal.

Local Wrangler startup is blocked in this build environment by `uv_interface_addresses`; actual Worker browser checks run in GitHub Actions. Human usability review, Safari checks and account-backed Cloudflare deployment remain separate acceptance steps.

## Remaining launch work

No hosted website or Cloudflare account resources are provisioned. GitHub's template-repository setting requires an owner action; ZIP/fork paths are documented. No custom database, CRM, server intake or live integrations are implemented. A Cloudflare setup button does not prove an owner completed deployment.

Next prompt: Read START-HERE.md and BUSINESS-BRIEF.md. Customize this repo for my business, run checks and give me a local preview before deploying.
