# When setup or preview gets stuck

Run `npm run doctor` from the project folder. It reads files and checks prerequisites without changing anything. A FAIL produces exit code 1; WARN means a later launch item, not necessarily a broken preview. A clean report does not prove the server, browser, email or vendor account works.

| Problem | Next action |
|---|---|
| `node` or `npm` is not found | Install Node.js 22 or newer, reopen the terminal, then run `npm ci`. Doctor cannot run until Node works. |
| `package.json` cannot be found | Open a terminal in the extracted project folder, not its parent or the ZIP. |
| Wrangler is missing or wrong version | Run `npm ci`. Keep the checked-in lockfile. |
| Content validation fails | Correct the named field in `src/site.json`; see EDITING-CONTENT.md. Restore your local backup if needed. |
| Production warning on the demo | Expected. Finish business facts, live contact settings and the real HTTPS origin before launch. |
| Network-interface lookup fails / `uv_interface_addresses` | Use a normal local computer or a supported development environment; this can be an environment restriction. |
| Port already in use | Close the older dev terminal with Ctrl+C, then run `npm run dev` again. |
| Source edits do not show | Check the dev terminal for errors. Edit `src/` or `public/`, not generated `dist/`. Restart dev after script/config edits. |
| Reload or layout still looks wrong | Include the exact terminal error and a screenshot in your Codex request; runtime and browser checks are separate. |
| Deployment authorization fails | Follow CLOUDFLARE-SETUP.md. Privately confirm login and the correct account. Do not paste tokens or account details into public issues. |

## Codex prompt

```text
Diagnose this existing starter using npm run doctor and the error below. Fix the project issues you can without changing my accounts or publishing. Preserve business content and setup backups. Run relevant checks and give me one precise next action for anything blocked by my environment. Do not claim browser or account verification unless actually performed.

[paste diagnostic output and the relevant error; omit credentials]
```
