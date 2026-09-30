# Add capabilities when needed

First launch the site with a verified contact destination. Decide each addition from the business workflow, not a list of available products.

| Need | First choice | Custom extension only when justified |
|---|---|---|
| Appointment requests | Existing scheduler/request URL | Supported API integration with confirmed availability |
| Customer records | Existing CRM or job system | Explicit migration/authority plan |
| Branded form | Existing vendor form | Worker validation, Turnstile, D1, delivery outbox, protected inbox |
| Voice reception | Existing agent | Authenticated server tools and signed post-call webhook |
| Private files | Existing operational system | R2 with authenticated object access and retention |
| Payments | Hosted payment flow | Supported provider integration and verified status |

For a custom inquiry flow, commit receipt before claiming success. Store delivery status separately; retries must not create duplicate records. Use Queues/outbox/reconciliation where external delivery is involved. Never infer booking from a saved inquiry. Keep contact preferences separate from marketing permissions.

Write DATA-OWNERSHIP.md before integrations: which system owns customers, quotes, jobs and payments; fields transferred; credential owner; retention; failure recovery; human escalation. Verify actual vendor plan, OAuth scopes, schema and webhook signatures. Use test environments, disabled live configuration and explicit activation. Do not invent supported mutations or assume every paid plan includes API access.

The starter implements none of those custom integrations. Ask Codex to design and implement only the one you need next, with tests and evidence before live activation.
