# Guided launch with Codex

Use your own GitHub and Cloudflare accounts. The browser questionnaire creates a brief; it does not create accounts, modify repository files or deploy. Keep the first version in demo mode until you approve it.

## Quick public preview

[Set up a Cloudflare preview](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2FMetaCode2023%2Fxovion-custom-website)

Cloudflare's supported flow copies the public repo into your account, lets you select repository/Worker names, and configures Workers Builds. Continuing through the account flow can publish a public fictional sample. It does not connect the business domain or activate a real contact form. Confirm the account and names before continuing; choose names that do not overwrite another project.

Review the detected commands: build `npm run build`, deploy `npm run deploy` (equivalent to the checked preview deployment). Use Node.js 22 or newer. The default Worker has SITE_STAGE=preview, serves the sample with noindex headers and requires no business secrets/database. The returned workers.dev URL is evidence only after you open and inspect it. `/start/` contains the onboarding questionnaire; the business homepage is `/`.

After the copy is created, edit THAT repository in Codex. Cloudflare updates from its configured branch; do not enable a second deployment mechanism for the same Worker. This automatic preview path does not automatically wait for every GitHub check. Configure explicit production gating before enabling production automation.

If the button flow is unavailable, fork/download the repo and use the CLI preview steps in CLOUDFLARE-SETUP.md. The GitHub connector available during this build cannot enable the repository's template setting: the owner can enable Settings → General → Template repository. Fork and ZIP flows already work without that setting. Do not label the template flow verified until the owner completes and checks it.

The button URL/configuration, local checks and deployment dry runs can be checked without signing into a production account. They do not prove an account-backed copy/build/deployment succeeded. A maintainer should complete one fresh-account preview before promoting this as one-click deployment.

## Production launch prompt

```text
Read AGENTS.md, BUILD-STATUS.md, CLOUDFLARE-SETUP.md and LAUNCH-CHECKLIST.md. Continue this existing customized project in my own repository. Check the actual files and identify what is complete, what needs my business facts and what needs account access. Finish authorized local fixes and checks. Confirm approved copy, image rights, non-demo contact method, intended HTTPS origin and successful real-device contact testing. Prepare the production build and Wrangler dry run; browser checks should cover my actual configuration. Document account/Worker/branch wiring, which deployment mechanism is active, how production checks block release and how to roll back. Preserve current email and DNS records. Give me one precise next action for any access blocker. Keep production publication, domain changes and integration activation pending my authorization. Never claim a deployment, email delivery or booking succeeded without evidence. Record results and the next prompt in BUILD-STATUS.md.
```

## Account-backed acceptance record

Before broad promotion, record the date, source SHA, actual copied repository, account-confirmed Worker name, build result, working preview URL, successful homepage/start/download checks and remaining domain/contact steps. Keep credentials and private account details out of public notes. A completed technical rehearsal is separate from a first-time user's usability review.

Official flow reference: https://developers.cloudflare.com/workers/platform/deploy-buttons/
