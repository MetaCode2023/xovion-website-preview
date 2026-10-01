# Build status

Version 0.1: working editable homepage, demo inquiry dialog, guided setup, optional sections, public business details and Cloudflare Worker Static Assets. Preview and production use separate commands; production requires approved content and a real contact destination.

## Plug-and-play onboarding

- `/start/` provides a browser questionnaire, personalized business brief and first Codex prompt.
- Users can copy the complete kit or download one complete Markdown kit. Answers stay in page memory; there is no server submission or storage.
- Packaged guides and a Cloudflare preview setup button explain the account, repository, build and domain steps.
- `npm run deploy` explicitly targets preview. Production builds exclude onboarding and packaged guides.
- Reusable UI/UX prompts guide improvements without forcing a fixed design preset.

## Verification

24 unit tests cover configuration, escaping, setup/backups, questionnaire validation, private-information scanning, watcher recovery and Worker behavior. GitHub Actions runs these checks plus Chromium desktop/phone browser checks on the actual Wrangler Worker.

The clean-copy rehearsal installs dependencies, customizes a fictional business, verifies output, performs a Cloudflare dry run and builds production. It checks the sitemap and onboarding exclusion. This exposed a production sitemap variable error, now fixed. No actual deployment occurs during rehearsal.

Local Wrangler startup is blocked in this build environment by `uv_interface_addresses`; actual Worker browser checks run in GitHub Actions. Human usability review, Safari checks and account-backed Cloudflare deployment remain separate acceptance steps.

## Remaining launch work

No hosted website or Cloudflare account resources are provisioned. GitHub's template-repository setting requires an owner action; ZIP/fork paths are documented. No custom database, CRM, server intake or live integrations are implemented. A Cloudflare setup button does not prove an owner completed deployment.

Next prompt: Read START-HERE.md and BUSINESS-BRIEF.md. Customize this repo for my business, run checks and give me a local preview before deploying.

## UX hardening pass — 2026-09-30

Live homepage and onboarding were verified at https://xovion-website-preview.metastone-account.workers.dev/ and /start/. Generation, copying and the business brief download succeeded; the separate prompt download did not complete in the cloud browser. The cause was not proven. This pass replaces the two-file flow with a single complete kit download and explicit manual-copy fallback, without assuming that a click proves a saved file.

The form now shows four essentials first, expandable optional details, completion progress, field-specific errors with focus, stale-kit prevention and a clear next action. Inputs have length/control-character checks. Preview homepages link to onboarding; production still excludes it. Automated browser coverage includes clipboard rejection, field focus and invalid contact recovery. Human usability and Safari review remain unperformed.

Light UI polish: consistent surface/button/input radii, calmer heading sizing, three clear step cards, a completion badge, a defined optional-details panel and cleaner phone navigation. Existing generation, copy, download and validation behavior is preserved. Browser and live deployment checks accompany this pass.
