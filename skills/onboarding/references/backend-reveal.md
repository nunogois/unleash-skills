# Observe a backend flag

Use with [the onboarding skill](../SKILL.md) for backend SDKs, existing services, workers, and command-line applications. Use [the integration reference](integration.md) for the selected SDK's current initialization and refresh behavior.

## Choose an observable behavior

Use the application's language, runtime, and existing SDK integration. [Demo inspiration](demo-inspiration.md) includes backend-driven visual examples as well as API and CLI ideas. A backend SDK can drive a visible browser feature when the application already has a UI; keep the evaluation on the server. Agree on a small feature the user can exercise: a changed API response, a different calculation, an optional result field, a CLI output change, or a safe test job taking a different path. Do not add a frontend SDK or a browser UI unless the user wants one.

Evaluate the flag where the feature runs, such as inside the request handler or job, using the initialized SDK client. Keeping a Boolean evaluated once at startup prevents later requests from seeing an updated flag. If the app deliberately snapshots configuration per job or session, explain that and trigger a fresh safe test input to observe the change.

## Prepare the before and after

Run the exact request or command once with the flag disabled and confirm its initial result. Use the real local address, method, route, port, and required non-secret arguments discovered from the app. Do not hand the user a generic placeholder or assume an endpoint exists. Keep secret-bearing headers out of chat and use the app's normal credential mechanism.

Before the toggle, explain:

- Which flag/environment to enable, with a direct link.
- The exact request, command, or safe input to repeat afterward.
- What specific result will change, and the expected SDK refresh delay.

For example, using an endpoint that really exists: “This request currently shows the standard recommendation. Turn on the flag in development, wait for the SDK to refresh, then run the same request again. You should see the personalized recommendation. I'll compare the two responses.” Supply the actual command and expected fields from the integration; do not invent results in advance.

Keep chat focused on this action. Running an HTTP service does not itself exercise its flagged endpoint, and a CLI that has exited cannot react to later toggles. A short-lived command may need another invocation that waits for fresh flag data; explain this instead of promising continuous updates. Do not restart a long-running service to demonstrate a dynamic flag change unless that is an explicit property of the integration.

## Observe the result

Choose the appropriate experience using [live observation](live-observation.md). If a captured response or output is useful, attach an event-driven observer before the handoff when possible. If the feature is better tested hands-on, give the user the exact request, command, or interaction to try and let them explore it. In Claude Code, prefer native `Monitor` for a small stream of the app's actual feature output; running the app with background Bash alone does not stream updates to Claude. Keep the service/worker and observer active. Compare actual responses, command output, or application events after the user toggles. For a safe read-only endpoint, the agent can repeat the request during its observation window. Jobs and write requests need user direction and appropriate test inputs; do not loop them automatically.

A flag-state log can show that SDK configuration changed, but the success criterion is the application's changed behavior. Capture only useful output; avoid repeated poll noise or dumping unrelated logs. When the agent cannot observe the app, tell the user exactly what to run and ask what they see. Report the actual output as monitor events arrive, including the return transition, while the watch is active. Only promise automatic reactions after a handoff when the client has a working event-driven monitor attached.

If the result stays the same, check SDK readiness and refresh timing, token environment/project scope, targeting/context, and whether the feature branch re-evaluates the flag. Keep the existing targeting intact. When successful, explain how toggling off and repeating the same action restores the original behavior.
