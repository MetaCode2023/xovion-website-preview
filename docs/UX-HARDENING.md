# Setup journey review — 2026-09-30

Goal: a first-time business owner creates useful context, takes it to Codex and understands what deployment does. Existing navy/white/orange styling is preserved.

| Step | Finding | Implemented change | Verification limit |
|---|---|---|---|
| 1. Arrive at the homepage | Public root showed only the fictional business, with no path to the kit | Preview notice links to /start/; production omits the link | Customer website remains independently customized |
| 2. Describe the business | All 12 fields were visible together, making optional questions look equally important | Four essentials, completion progress and expandable optional details | Human completion-time study not performed |
| 3. Correct an answer | Generator errors appeared away from the affected control | Field-specific message, aria-invalid/description and focus; optional group expands when needed | Screen-reader/Safari manual checks remain |
| 4. Take the kit to Codex | Separate prompt download did not complete in live cloud-browser testing; cause unconfirmed | One complete Markdown download, clipboard copy and explicit manual selection; no false saved-file confirmation | Browser can still block downloads; use copy fallback |
| 5. Review and launch | Account access and contact activation could be mistaken for automatic outcomes | Existing preview/production separation retained; next instructions spell out saving brief and reviewing before launch | Domain, real contact receipt and fresh-account deploy acceptance need owner verification |

Technical checks cover size/control characters, contact destinations, stale output, focus recovery, clipboard rejection, responsive layout and production exclusion. No new tracking, persistence or backend submission was added. Current screenshots capture the live before/after experience; test logs establish behavior separately.
