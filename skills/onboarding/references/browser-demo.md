# A demo worth toggling

Use with [the onboarding skill](../SKILL.md) when creating a browser demo and guiding its first live toggle. For SDK-specific choices, use [the integration reference](integration.md).

## Choose a useful visual example

Use [demo inspiration](demo-inspiration.md) when helpful. A browser can render a backend-evaluated feature too; do not choose a frontend SDK solely because the result is visual. Create or adapt a small app around the user's context: a new search experience, an optional dashboard feature, or a checkout improvement, for example. The feature should have an obvious, useful before/after behavior and keep reacting to the real flag. The scenario, stack, and design can vary; do not send every user through the same storefront.

The starter's plain-JavaScript SDK choice is not a recommendation for every framework. For the chosen language, framework, and runtime, discover and prioritize the most specific suitable official SDK and adapt the example accordingly.

If useful, copy `assets/browser-demo` from this skill's directory into the agreed demo directory, excluding generated `node_modules` and `dist` folders. This optional starter is a runnable product page whose standard checkout becomes express checkout when the real flag is enabled. Both paths are interactive; it makes no payments or real orders. Adapt it rather than treating it as a fixed specification. The remaining starter-specific setup applies only when using it.

Use its documented npm scripts and locked installation: `npm ci --ignore-scripts`, then `npm run dev`. It needs Node 24 or newer. If this runtime is unavailable, use the user's existing stack while preserving the visual/live-update outcome. Do not install another runtime without discussing it.

Prepare `.env` from `.env.example` with the actual frontend SDK URL, flag name, and flag-page URL. Leave only `VITE_UNLEASH_FRONTEND_TOKEN` for the user's scoped **frontend** token. Every `VITE_` variable is browser-visible: never put a PAT or backend token there. `vite.config.js` proxies the frontend SDK requests locally to the configured endpoint, preserving its base path; this avoids needing a demo-only CORS change on the instance. The `src/main.js` SDK initialization and state-change handler implement the behavior. The project uses installed SDK documentation as the source for APIs; read current [browser SDK docs](https://docs.getunleash.io/sdks/javascript-browser) before changing it.

When resuming previous work, preserve the chosen SDK and application unless the user wants a different experience. Do not convert a backend integration to a browser demo automatically. If the user chooses that change, a backend token cannot be reused as a frontend token; obtain the correct token rather than exposing a backend secret in the browser.

## Make the flag sufficient

Prepare a 100% development audience on the new demo flag, keeping it disabled. Inspect the result; a pending change request is not applied configuration. Do not use the first toggle as a test of an unknown strategy. Existing flags need their targeting respected; do not overwrite a real rollout for a demo.

Follow [fast demo feedback](integration.md#fast-feedback-for-new-demos) when building or adapting the example. The browser must independently fetch and re-render as the flag changes. The starter uses a two-second development refresh interval so the reveal follows the user's action promptly, without a busy request loop. Keep refresh enabled; this is a demo setting, not a production polling recommendation. It wires live listeners before starting the SDK and logs only transitions, not every poll or token value. Its loading/error state is separate from the disabled feature state. The [SDK event documentation](https://docs.getunleash.io/sdks/javascript-browser#events) distinguishes cached initialization, a successful network fetch, and later configuration updates; use the installed SDK's matching semantics.

No fake flag switch, SDK override, bootstrap value, or local storage toggle should drive the demonstration. The Unleash flag must control the actual feature. When diagnosing the page, inspect the real SDK requests without logging credentials.

## Stay for the reveal

Open the demo in a browser using available tools, or give the clickable local URL and ask the user to open it. A frontend SDK does not run merely because its dev server is running: load the page and verify a successful fetch and the initial feature state.

Choose between useful live observation and user-led interaction using [live observation](live-observation.md). If the user should explore the feature themselves, give the app/flag links and concrete steps, then let them try it. When a captured result adds value, attach an observer before the toggle and prefer Claude Code `Monitor` when present:

- With browser tools, check the page's connection indicator and actual checkout. The starter also exposes `document.documentElement.dataset.connection` and `.flagEnabled` for observation, and logs `[Unleash demo] <flag>: OFF → ON` only on transitions. A `vite ready` log is not SDK evidence.
- With captured browser-console output, stream meaningful feature transitions to the event observer and show them in chat. Browser console output does not automatically appear in the dev server's terminal output: use existing browser-console capture or a local observation bridge only when it helps the chosen experience. Do not monitor Vite output and claim it contains browser evaluations.
- Without browser tools, check whether the app can expose a small local behavior-event stream from its actual rendering path. If no browser observation or event capture is available, explain that limitation and have the user observe the page. A server-side flag value alone cannot prove a browser update.

Use the native event monitor for ongoing reactions when available; otherwise stay active for the first user-driven change and check output in short calls. Leave the browser tab and a persistent dev server running afterward so toggles keep working after the agent finishes. Retain the process/session handle for checking logs and restarting if needed. Verify the actual process is still alive before saying so. If the client cannot preserve background processes, give the user the run command before the reveal.

Show the app link, flag link, next action, and relevant observed output at the reveal. A brief confirmation of the observed feature change beats a setup inventory. Delayed metrics and lifecycle bookkeeping belong in diagnostics, not the success message.
