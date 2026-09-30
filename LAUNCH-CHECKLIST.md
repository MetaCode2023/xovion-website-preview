# Launch checklist

- Confirm real business name, contact, services, coverage and approved copy. Remove fictional content.
- Confirm rights for all images/logos/reviews. No unpublished customer data in source.
- Run npm ci, npm run verify and a Wrangler deploy dry run. Production configuration must pass its build gates.
- Inspect at 360px, 390px, tablet and desktop widths; check keyboard navigation, focus, labels and dialog escape/close. Confirm no overflow at enlarged text sizes.
- Use a real email or verified request/booking URL and test it. Record what actually happened, including owner receipt when relevant. Demo form sends nothing.
- Review actual privacy practices before adding analytics or collecting information. Add policy pages for the actual features and owner requirements.
- Confirm GitHub/Cloudflare ownership, current plan limits and correct account/Worker names.
- Authorize production deployment. Record source commit, deployed version and verified URL.
- Inventory and preserve DNS/email before authorized domain cutover; verify web and mail afterward. Keep rollback details.
- Verify HTTPS, intended primary/www behavior, canonical URL, robots, sitemap and 404.
- Record completed checks, unverified items and maintenance contact in BUILD-STATUS.md. A successful compile alone is not a launch proof.
