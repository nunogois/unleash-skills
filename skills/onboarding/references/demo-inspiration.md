# Demo inspiration

Use with [the onboarding skill](../SKILL.md) when choosing a small scenario. Apply [browser guidance](browser-demo.md) or [backend guidance](backend-reveal.md) according to the application and SDK.

## Public Unleash examples

These repositories are optional inspiration for the experience, not required templates, languages, dependencies, or installation steps. Read their current README and only the relevant implementation when borrowing a concrete pattern; do not clone or run a full application just to choose an idea. Keep SDK configuration grounded in the selected SDK's current official docs.

- [Unleash fullstack demo](https://github.com/Unleash/unleash-fullstack-demo-app): look for a recognizable product experience, such as spending insights or an assistant becoming available, and how the app makes runtime control apparent. Borrow a small feature idea rather than reproducing its full experiment, metrics, or safeguards setup.
- [Otterbank](https://github.com/Unleash/otterbank-demo): look for the immediate appearance of a useful feature and the connection between server-side behavior and what a user sees. Its README describes backend SDK evaluation with a browser UI rendering the response. This pattern can work in other backend languages too; a visual demo does not require a frontend SDK.

Do not copy repository-specific instance URLs, tokens, project IDs, flag names, polling settings, or deployment assumptions. Inspect live source before relying on implementation details. Use the user's instance, environment, language, and chosen SDK.

## Other directions to adapt

These are ideas, not a fixed menu to show the user. Pick one that fits their context or create another. If they already chose a feature, use that rather than suggesting a replacement.

| Idea | What the user observes | Backend/API/CLI adaptation |
| --- | --- | --- |
| Spending insight | A useful summary appears alongside a transaction list. | The same request gains a summary derived from local sample transactions. |
| Better search | Basic matching becomes ranked results or a filterable search view. | Repeat the same query and compare the ordering or matching results. |
| Recommendations | A relevant recommendation appears on a product or content page. | Repeat a request for the same test user and compare the recommendation field. |
| In-app help | A contextual help panel appears where the user needs it. | A support endpoint switches from a generic response to context-specific guidance. |
| Better reports | A report gains grouped totals or an additional useful section. | Rerun the same export command and compare the generated report or output. |
| Express checkout | A longer checkout becomes a short, interactive flow. | A local checkout-preview endpoint returns a different set of required steps. |

Keep sample data and processing local. An assistant-inspired demo can use clearly labeled deterministic demo answers; adding a paid AI provider or extra API key is unnecessary for demonstrating a flag. Do not imply canned responses are a live AI integration. Banking or checkout examples use fictional data and make no real transfers or purchases.

## Keep the first moment small

One flag should cause one understandable behavior change, with a useful disabled experience and an obvious enabled result. Explain how toggling it off restores the original behavior. Favor a feature the user can exercise immediately over a configuration screen, a flag-state label, or technical logs alone.

Start with a straightforward on/off feature. Variants, audience targeting demonstrations, simulated broken releases, impact metrics, and automated safeguards can be follow-ups when requested. Do not make them prerequisites for the first successful toggle. Preserve the same observation method before and after, so the difference is attributable to the flag rather than to changed input.
