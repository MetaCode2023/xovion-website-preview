# Edit content without changing the layout

Edit `src/site.json`, or ask Codex to edit it. Keep valid JSON: double quotes, no comments and no trailing commas. `npm run dev` rebuilds changes automatically. Errors appear in the terminal and retry after correction.

| Field | What it controls |
|---|---|
| `name`, `tagline`, `location`, `headline`, `description` | Business identity and hero copy |
| `services` | Service cards: each entry needs `name` and `description` |
| `copy.navServices`, `copy.navProcess`, `copy.navContact` | Navigation labels; destinations stay connected to their sections |
| `copy.cta`, `copy.serviceCta` | Main and service button/link labels |
| `copy.heroSteps` | Short hero summary list |
| `copy.servicesEyebrow`, `copy.servicesHeading` | Service section headings |
| `copy.processEyebrow`, `copy.processHeading` | Process section headings |
| `copy.processSteps` | List of objects with `title` and `description` |
| `copy.faqHeading`, `copy.faqs` | FAQ heading and objects with `question` and `answer` |
| `copy.contactEyebrow`, `copy.contactHeading` | Contact section headings |
| `contactMode`, `email`, `bookingUrl`, `siteUrl` | Contact destination and production origin |

Optional sections default to visible. Set `sections.services`, `sections.process` or `sections.faq` to `false` to remove the section and its related navigation. No template edit is needed. Disabled process/FAQ section copy can be omitted; keep their lists nonempty when visible. Keep the services list populated even when cards are hidden, because the demo dialog still uses it. The hero and contact section remain visible. Copy is plain text: HTML is escaped, so `<br>` prints as text. Use CSS or the template to change layout.

Demo labels and notices stay in the template/client so changing sales copy cannot hide the fact that nothing is submitted. Do not describe an inquiry link as a confirmed appointment.

`npm run setup` prepares neutral section copy when replacing the fictional example. Running setup again preserves your existing section copy; it still regenerates the brief after confirmation and keeps backups. Review the content with the owner before publication.

## Codex prompt

```text
Read BUSINESS-BRIEF.md and docs/EDITING-CONTENT.md. Update src/site.json, including all copy fields, for my business using only confirmed facts. Preserve the current layout and contact destination. Write useful FAQs and process steps without inventing prices, testimonials, credentials or availability. Run npm run verify and show the local preview. Do not publish.
```

## Public business details

```json
"businessDetails": {
  "phone": "+1 (605) 555-0123",
  "hours": ["Example: Mon–Fri 9 AM–5 PM Central"],
  "serviceAreas": ["Example town"],
  "address": "",
  "directionsUrl": ""
}
```

These are fictional examples. Replace with approved information; leave unknown values blank or lists empty. Phone numbers become tap-to-call links; use 7–15 digits with optional formatting. Hours are display text, not calculated availability; state the relevant timezone. A service area does not imply a storefront. Publish an address only when approved for public visits. Directions must use an existing HTTPS URL without embedded credentials; the link opens the configured destination without embedding a map or adding tracking.
