# Check before publishing project files

`npm run check:private` is part of `npm run verify`, deployment preparation and CI. It flags credential filenames, private-key markers, common GitHub/AWS token formats and likely long credential assignments. Findings show file, line and rule; suspected values are never printed.

In Git repositories it scans the Git index (the exact staged versions), including newly staged files. Stage intended edits and additions before running it; unstaged changes are not part of that snapshot. A ZIP copy without Git scans project files while excluding generated output, dependencies and setup backups. Such a copy may flag local credential files: move them outside the copy or initialize Git and keep them ignored before rerunning. Example environment files may contain placeholder names, but detected credential values are still flagged.

This is a narrow heuristic check, not comprehensive secret scanning or a customer-data detector. Review business briefs, screenshots, images, PDFs and any new files yourself. It does not scan Git history or binary file contents. Never use passing output as permission to publish private information.

When flagged, remove the secret/file from the proposed commit and store runtime credentials using the vendor's supported secret mechanism. If it was already exposed, revoke/rotate it and address repository history separately; deleting the current file does not undo exposure. Do not paste suspected values into chat or public issues. Investigate false positives using the filename/rule before changing the scanner; there is no blanket bypass flag.
