# SDK integration

Use this reference with [the onboarding skill](../SKILL.md) when choosing and wiring an SDK.

Start from the [official SDK index](https://docs.getunleash.io/sdks) and use the documentation for the detected language/framework and installed SDK version. The MCP's documentation tool can help locate it. If documentation cannot be retrieved, report the gap rather than inventing package names or initialization APIs.

- Distinguish server-side evaluation from browser/mobile evaluation. A framework may contain both; configure each side only where the chosen example needs it.
- A personal access token controls the agent's Admin API access. A backend SDK uses a backend token; a browser/mobile SDK uses a frontend token. Do not expose a personal or backend token in browser code.
- Read the current token guidance through [the token reference](tokens.md) before giving UI instructions. API enum values such as `CLIENT` are not the UI label.
- Obtain the correct SDK URL, token type, environment, startup/readiness procedure, evaluation API, and shutdown/metrics-flush behavior from the selected SDK's documentation. Do not derive every SDK endpoint by appending the same suffix.
- Fill the application configuration with the already-known instance URL and the SDK-specific endpoint from its docs. Create the ignored configuration file with the real URL and only the token left for the user to fill in. Do not make the user reconstruct the URL or ask them to send it again.
- Keep SDK credentials in the application's existing secret/configuration mechanism. For a demo, use an ignored local environment file and a credential-free example file. Do not print tokens in examples, logs, or the final response.
- Initialize the client once at the appropriate application lifecycle boundary. Use a real flag evaluation in a visible behavior with a sensible disabled fallback. Keep the process alive long enough to receive flag changes and report metrics.
- For an existing application, preserve its authentication, build tooling, dependency manager, and unrelated behavior. Prefer adapting an existing SDK client over adding a second one.
- For browser examples, subscribe to SDK changes and update the UI on every change; reading the flag only at startup is insufficient. Use [the browser demo reference](browser-demo.md) for browser examples and the optional starter.
- For backend examples, evaluate the flag where the feature actually runs, rather than caching a Boolean at startup. Follow [the backend reveal reference](backend-reveal.md) to give an exact before/after request or command and explain when to repeat it.
- Test initialization and the disabled behavior first, then stay engaged through the user's toggle and observe the changed behavior. Distinguish an application run from a code-only example when the runtime or credentials are unavailable.

## Fast feedback for new demos

For a demo built from scratch, explicitly configure a short SDK refresh interval, aiming for one to two seconds when the selected SDK supports it, so the toggle feels connected to the result. Check the installed SDK's option name, time unit, and supported minimum in its official docs; do not copy a seconds value into a millisecond option or assume the same setting exists across SDKs. Prefer the SDK's supported live-update mechanism when appropriate.

Check the whole path: a backend-evaluated browser demo may also need a short refresh of its read-only UI data. Avoid leaving a slow default at another layer that hides the faster SDK update. Do not repeatedly trigger jobs or write requests to make a demo look responsive.

Keep these settings local to the new demo. Preserve existing application refresh settings unless changing them is part of the agreed task. Short polling is for the demo experience, not a production recommendation; keep normal cleanup and client shutdown behavior.
