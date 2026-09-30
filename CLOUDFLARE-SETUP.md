# Deploy through Cloudflare

The website runs on a Cloudflare Worker with Static Assets. GitHub stores the code. The included configuration has a preview Worker and a separate production Worker. No database, email provider or live form is required for the default starter.

For the account-guided public preview path and copy-paste production prompt, see [GUIDED-LAUNCH.md](docs/GUIDED-LAUNCH.md). The default `npm run deploy` command intentionally publishes preview settings; production remains a separate command.

## 1. Prepare your accounts and copy

Use your own GitHub repository and Cloudflare account. Install from the lockfile with npm ci. Give preview/production Workers unique names in wrangler.jsonc; generic names could collide with other projects in your account. Confirm the correct Cloudflare account before deployment. Review current Cloudflare plans and limits.

## 2. Sign in and publish a preview

```sh
npx wrangler login
npx wrangler whoami
npm run deploy:preview
```

This publishes to a workers.dev address printed by Wrangler. The preview is PUBLIC unless you separately configure access protection; noindex is not privacy. Use sample data only. Validate the homepage, service actions, FAQ, 404 and demo form on the deployed address. Login authenticates the CLI; do not paste tokens into chat.

## 3. Choose the live contact method

In src/site.json replace all example content, set example=false and choose one:

- contactMode=email: supply your real public email. The button opens the visitor’s email app; it does not submit a server form or prove delivery. Test on your device and retain another contact method if your audience needs it.
- contactMode=booking: set bookingUrl to your approved existing HTTPS request/scheduling link. Test the destination with a labelled request and inspect it in the actual operational system. A request form is not necessarily instant booking.

Set siteUrl to your intended primary HTTPS origin, without a path, query or fragment. Approve the real page copy. The production build blocks example/demo settings, but cannot verify that your contact inbox or vendor account actually works.

## 4. Deploy production

After owner authorization:

```sh
npm run deploy:production
```

This runs checks and builds production metadata, robots and sitemap. Keep the returned URL/version and source commit in BUILD-STATUS.md. The CLI publishes; these instructions alone do not mean deployment occurred. Verify your contact flow and public pages after deployment.

## 5. Point your domain to the Worker

Do this after preview validation. Domain registration can stay with your existing registrar. Cloudflare Worker Custom Domains require an active Cloudflare zone in the same account. Do not treat an arbitrary CNAME to workers.dev as a substitute for Worker domain setup.

Ask Codex to inspect your current registrar, authoritative nameservers, DNS zone, website records, DNSSEC status, email records and subdomains. Export/copy existing records and document old values before changes. Cloudflare’s automatic DNS scan is not proof all records were imported.

If DNS is already on Cloudflare, inspect that existing zone. If it is elsewhere, add the domain to Cloudflare and reproduce the entire DNS zone, then follow the current onboarding instructions to change registrar nameservers. Coordinate DNSSEC carefully using the current provider instructions; a stale DS record can break resolution. Preserve MX, TXT, SPF, DKIM, DMARC, verification records and mail-related hostnames, including required DNS-only behavior. Do not transfer registration or cancel the old host merely to move the website.

For the production Worker, use its Settings → Domains & Routes → Add → Custom Domain flow (verify current UI), choose the approved hostname and let Cloudflare manage its DNS/certificate. Resolve conflicts with existing web records only after recording rollback. Alternatively Codex can add the verified custom-domain route to the production Wrangler config and deploy after approval. It must use the actual account/zone and preserve unrelated records.

Choose an apex/www primary hostname, configure the other explicitly with an appropriate redirect and test both. Do not invent domain names in config. Verify DNS, HTTPS, homepage/direct routes, canonical URL, sitemap and incoming/outgoing email after cutover. Keep the old website and DNS values until validation passes. Nameserver rollback and web-record rollback are different actions; document both for the actual setup.

## 6. GitHub deployment automation

The included CI only verifies code. For the first release use manual Wrangler deployment so users can establish account wiring without extra secrets. Later choose ONE deployment mechanism: Cloudflare Git-triggered builds or GitHub Actions. Do not activate both for the same Worker.

Before adding automatic production deploys, define the authorized branch, checks, preview/production wiring, least-privilege Cloudflare token, rollback and who approves changes. Keep deploy tokens in secret stores. Never run untrusted pull-request code with production credentials. Pin added Actions to verified revisions. Test a failed check prevents release and verify a successful deployment’s actual source SHA.

## Official references

Recheck current instructions during setup:
- https://developers.cloudflare.com/workers/static-assets/get-started/
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/
- https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
