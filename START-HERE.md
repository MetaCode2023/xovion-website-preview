# Start here

Use a computer for the build. Read README.md first. Make your own copy of the repository and open it in Codex with local project access. Follow the official [Codex setup](https://developers.openai.com/codex/quickstart/) for your chosen interface; sign in through the supported flow. Do not paste passwords or tokens into chat.

For examples of a useful brief, see examples/business-briefs/README.md. For a complete rehearsal and feedback worksheet, see docs/FIRST-TIME-USER-TEST.md.

## Browser questionnaire

On a local/deployed preview, open `/start/`. Fill in public business facts and create your brief. Download WEBSITE-KIT.md and give the complete file to Codex. Ask it to save the brief as BUSINESS-BRIEF.md and follow the included first prompt. You can also copy everything from your phone; on your computer, give the combined text to Codex in the starter folder. Answers stay in page memory and are cleared on reload. This does not modify your repo or deploy.

## Guided setup

Run `npm ci`, then `npm run setup` in the project folder. Answer the questions and type `yes` to save. Existing content and the brief are backed up locally. Keep demo contact mode while reviewing. Run `npm run dev`; edits rebuild and reload the preview automatically. Then give Codex the prompt below to refine the design and copy.

## First prompt

```text
Read AGENTS.md, README.md and BUSINESS-BRIEF.md. Customize this working starter for my business. Inspect the folder and my local Node/npm tools first; continue the existing project. Ask only for business facts that truly block the first preview. Use src/site.json for content and keep demo contact mode until I choose a live contact method. Replace fictional claims with my confirmed facts and omit missing testimonials/prices. Install from the lockfile, implement the changes, run npm run verify and give me a local preview. Do not deploy yet. Record progress and the exact next prompt in BUILD-STATUS.md. Finish the working first version rather than stopping at a plan.
```

If your business brief is empty, paste the name, location, services, contact method and preferred look after that prompt. Codex can use a temporary text wordmark and omit photos until you provide licensed assets.

## Review

Open the local preview address. Check it on a narrow window, navigate the services, open FAQs and try the demo using fictional details. Nothing should be submitted. Tell Codex specific changes and provide a screenshot when useful. Continue in the same folder.

## Improve UI and UX

Choose a prompt in docs/UI-UX-PROMPTS.md after reviewing the first preview. Explain what feels awkward, who uses the site and what they need to do. Ask for concrete changes and browser evidence. These prompts guide improvements without choosing a fixed visual style for you.

## Launch prompt

```text
Read CLOUDFLARE-SETUP.md and LAUNCH-CHECKLIST.md. Prepare this project for my own GitHub and Cloudflare accounts. First finish all local checks, approved business copy and a real email or existing booking link. Prepare exact account-specific setup steps. Keep domain changes and production publication pending my authorization. Never claim a deployment or message delivery succeeded without evidence. Save remaining owner actions and the next prompt in BUILD-STATUS.md.
```

## Future updates

```text
Continue from BUILD-STATUS.md in this project. Make this change: [describe it]. Update source files, run the relevant checks and show me the result before publishing. Keep current working contact links and account wiring. Record changes and any remaining steps.
```

If stuck: run `npm run doctor`, then paste its output and the error and say “Diagnose this in the existing project. Fix everything you can, then give me the single next action you need from me.”

Browser kit: `/start/` needs only four essential answers; optional details are expandable. Copy everything or download one WEBSITE-KIT.md containing both the brief and first prompt. Give the whole file to Codex and ask it to save the brief as BUSINESS-BRIEF.md. If downloads/clipboard are blocked, use Select text to copy. Answers are lost when you close/reload the page; copy or download first.
