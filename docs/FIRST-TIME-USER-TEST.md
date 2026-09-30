# First-time-user acceptance test

Use a fresh copy of this repository. This exercise tests whether the instructions and prompts help someone unfamiliar with the project. Do not publish, change DNS or use real customer data during the rehearsal.

## Automated rehearsal

Run `npm run test:first-run` from the starter folder. It makes a temporary clean copy, installs from the lockfile, runs the setup logic with fictional answers, hides optional sections, adds fictional public details, verifies output and runs a Cloudflare deployment dry run. It also builds a fictional production configuration and confirms that the onboarding page is excluded. It removes the temporary copy afterward and leaves your project unchanged.

This proves a repeatable technical path, not that a person found the instructions easy. It does not sign into Codex/Cloudflare, start Wrangler's browser server, exercise the interactive terminal itself or publish a website. Browser checks run separately with `npm run test:browser`.

## Human walkthrough

| Step | Expected result | What to record |
|---|---|---|
| Copy/extract the repo and open the correct folder | User locates README and START-HERE | First confusing instruction; time to find the starting point |
| Install Node and run `npm ci` | Dependencies install from the lockfile | Missing prerequisite or error; whether doctor/help resolves it |
| Run `npm run setup` with fictional business facts | Questions are understandable; user reviews and confirms | Unclear question, unsuitable default, confidence before saving |
| Give Codex the first prompt and actual business brief | Codex continues this project and creates a coherent first version | Missing fact, inaccessible file, redundant question or unexpected change |
| Run `npm run dev` and edit copy | Preview opens and updates | Actual URL, error, reload behavior and recovery after an invalid edit |
| Hide one section and add fictional phone/hours | Section/nav disappear; contact detail is readable | Whether docs made the edit understandable; phone-link destination |
| Choose one UI/UX prompt | Codex produces specific improvements and a reviewable result | Whether visitor task got easier; before/after screenshots |
| Run verification and browser checks | Commands succeed or give actionable errors | Exact commands, results and environment limitations |
| Read the Cloudflare guide and run a dry run | User understands account ownership, preview vs production and domain steps | Any remaining ambiguity; no claim that account/DNS steps were performed |

## Record the outcome

Copy this into BUILD-STATUS.md after the exercise. Keep public notes free of credentials and private account/customer details.

```text
Date and starter commit:
Environment (OS, Node; no private account details):
Rehearsal: automated / human / both
Completed steps and evidence:
First point of confusion:
Other blockers, with exact instruction/file:
Fixes made and checks rerun:
Browser checks actually performed:
Cloudflare/account/domain steps actually performed:
Unperformed checks:
Single next action or Codex prompt:
```

A task is resolved when the tester can repeat it using the corrected instructions without an unexplained intervention. Keep automation results separate from human usability observations. Never mark a human review complete based only on a green CI run.
