# Ask Codex for better UI and UX

Choose the outcome you need. These are reusable ways to ask for improvements; your business keeps its own visual identity. You can combine prompts after reviewing the first result.

## Which prompt should I use?

| What feels wrong | Start with |
|---|---|
| Visitors may not understand the business or next step | 1. Clearer first impression |
| The page looks unfinished or inconsistent | 2. Visual polish |
| The phone experience is awkward | 3. Mobile usability |
| Getting in touch takes too much effort | 4. Contact journey |
| People cannot navigate or read the page comfortably | 5. Accessibility |
| You have a reference but cannot explain what you like | 6. Learn from a reference |
| You want an impartial review before launch | 7. Full visitor walkthrough |

Add your audience, desired visitor action and constraints to the chosen prompt. Useful context: “People find us on their phones; they need to understand our services and request a quote. Keep our logo, wording and booking provider.” Give Codex actual screenshots or files when possible. A link alone may not provide access.

## 1. Clearer first impression

```text
Improve this website's clarity for [audience], whose main goal is [goal]. Read AGENTS.md and BUSINESS-BRIEF.md. Inspect the current homepage and explain the three biggest obstacles to understanding what we do, who we serve and the next step. Then implement focused improvements to content order, headings, navigation labels and primary actions. Use src/site.json for copy. Preserve confirmed facts and the existing contact destination. Omit unsupported claims. Show the before/after reasoning and run the relevant checks. Do not publish.
```

## 2. Visual polish

```text
Make this existing website feel more intentional and professionally designed while preserving its identity and page structure. Inspect screenshots or a browser preview first; if you cannot inspect them, say so and keep visual conclusions provisional. Identify inconsistent typography, spacing, alignment, contrast, button treatment and content density. Implement the highest-impact fixes using reusable CSS values and a coherent heading hierarchy. Preserve readable body text, visible focus and reduced-motion behavior. Avoid decorative elements that distract from the visitor's task. Check narrow and wide layouts and summarize what visibly changed. Run checks and provide a reviewable preview; do not publish.
```

## 3. Mobile usability

```text
Improve this website for people using phones. Inspect at 360px and 390px widths and with enlarged text. Walk through navigation, services, FAQs and the contact action. Fix horizontal overflow, cramped controls, awkward line breaks, difficult reading and excessive scrolling caused by layout. Keep the primary action easy to find without covering content. Preserve keyboard access and the desktop layout. Run npm run test:browser plus the relevant project checks, report actual results and provide before/after screenshots when browser tools are available. Do not publish.
```

## 4. Contact journey

```text
Improve the journey from arriving on this website to [requesting a quote / emailing us / opening our scheduler]. Follow the existing contactMode and destination. Identify unclear expectations, competing actions, extra steps and misleading success wording. Make button labels, explanatory copy and states accurately describe what happens. In demo mode keep the explicit notice that nothing is sent or saved. An inquiry is not a confirmed booking. Preserve existing vendor links and avoid adding tracking, data collection or new backend services as part of this UI pass. Test the controls and report which external steps still need owner verification. Do not publish.
```

## 5. Accessibility

```text
Review this website for practical accessibility: keyboard navigation, visible focus, meaningful headings, control labels, text contrast, enlarged text, reduced motion and dialog behavior. Reproduce concrete issues, fix them in the existing project, and check focus placement and return after closing the dialog. Use automated browser checks where possible and document manual checks separately. Do not claim complete accessibility compliance from an automated pass. Preserve the visual identity and working contact flow. Run relevant checks and show the preview; do not publish.
```

## 6. Learn from a reference

```text
Use the attached reference as inspiration for improving this existing website. What I like is [typography / spacing / information hierarchy / navigation / interaction]. First explain which specific design principles could help our visitors. Apply those principles to our own business content and existing visual identity. Keep our assets and contact flow; do not copy another business's wording, logos or imagery. Implement a focused first pass, verify responsive behavior and present the result for review. State any reference or browser access limitations. Do not publish.
```

## 7. Full visitor walkthrough

```text
Audit this website as a first-time visitor from [audience] trying to [goal]. Read the project instructions and business brief, inspect the current experience and walk through the task on phone and desktop. List the five most consequential problems with the location, evidence, visitor impact and proposed fix. Implement the top three within the current site's scope, preserving confirmed business facts and account wiring. Run npm run verify and npm run test:browser. Distinguish browser evidence from assumptions, and report remaining issues and the next useful prompt in BUILD-STATUS.md. Show the result for review; do not publish.
```

## Follow up after seeing the result

Be concrete: “The heading is too large on my phone; give the service list more space and keep the contact button visible.” Or: “Keep the typography change, restore the previous colors and simplify the header.” Continue in the same project. Ask Codex to inspect the current files rather than relying on an older screenshot.

Browser checks catch specific regressions. They do not judge whether the design is attractive, whether copy persuades your audience or whether an external provider received an inquiry. Review those separately with the business owner.
