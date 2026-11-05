---
name: onboarding
description: Connect a first Unleash feature flag to a demo or existing application and observe its behavior change. Use for getting started with Unleash or connecting a first SDK. Not for migrations, rollout management, or general flag administration.
---

# Unleash onboarding

Help the user observe a real behavior change when they toggle their flag in Unleash. A working SDK is preparation; the outcome is trying the feature. Support frontend and backend SDKs across languages, with the same workflow in Claude Code, Codex, and compatible agents.

## Guide the user

Use the clear, friendly, practical tone of Unleash's getting-started docs. Explain what each step achieves, keep updates short, and ask only for missing choices or information. Avoid clipped status reports and long setup inventories.

Describe what will change and how the user can try it. At the reveal, give the flag link and one useful action. Show actual output when it helps; let hands-on application testing lead when that is the better experience. Keep metrics, lifecycle bookkeeping, paths, and strategy internals in diagnostics unless requested.

## Establish the connection

Reuse the instance URL from the MCP connection instructions, earlier conversation, or returned project/flag URLs. Preserve its base path. Identify the intended connection if several exist. Ask for the URL only if those sources do not provide it; never inspect credential stores to discover it.

This skill targets `@unleash/mcp@0.6.0-beta.5`. Discover the connected tools and read their actual schemas: use `search`/`inspect` for discovery, `manage_flag` for flag definitions, `release` for targeting, and `docs` to locate current documentation. Do not use older `create_flag` or `wrap_change` recipes. Tool prefixes vary by client.

Verify the instance by reading accessible projects. Follow pagination or narrow incomplete listings; a failed or partial response is not evidence that no projects exist. Distinguish authentication and permission failures, and do not repeatedly retry a denied operation.

If setup is missing, read the repository's [setup guide](https://github.com/nunogois/unleash-skills/blob/main/SETUP.md) or the local checkout's `SETUP.md`. For an installed Codex plugin missing credentials, provide the exact terminal command for its [credential helper](../../scripts/setup-codex.js) using the installed plugin path; do not ask the user to clone the repo, symlink the skill, or register a second MCP. Keep PAT input in the terminal. Give the relevant step and resume after any required reload without duplicating flags or application scaffolds. Never ask for tokens in chat.

## Choose the application

Ask whether to use an existing app or create a demo, unless already clear.

- **Existing app:** inspect its language, framework, runtime, dependencies, and Unleash integration. Agree on the feature when unclear, reuse its SDK client where appropriate, and preserve unrelated behavior. Keep backend evaluation on the backend even if the result appears in a UI.
- **New demo:** favor a visual experience when the user has no preference. Adapt it to their context and honor requested languages or SDKs. Do not ask them to choose a stack just to use a template. [Demo inspiration](references/demo-inspiration.md) and the bundled storefront are optional starting points.
- **Browser example:** use [browser guidance](references/browser-demo.md). A visual result can come from a frontend SDK or a backend-evaluated response.
- **Backend, worker, or CLI:** use [backend guidance](references/backend-reveal.md). Choose behavior the user can deliberately exercise with a request, command, or safe test input. Do not add a browser solely to demonstrate a backend flag.

Read [SDK integration guidance](references/integration.md) and the selected SDK's current official docs. New demos should use the documented short-refresh settings for prompt feedback; preserve existing app settings unless a change is agreed.

## Prepare the flag and SDK

Find a suitable project the user can work in, preferring `default` when appropriate. Read access does not imply write access. If no suitable project permits the work, explain the specific access needed; local preparation can continue without claiming server setup is complete.

Inspect existing flags before creating one. Confirm project, flag name, and environment when not already authorized. Reuse appropriate work when resuming. Do not replace an existing rollout or change production settings; use a fresh demo flag when needed.

For a new demo flag, prepare a 100% audience in the chosen development environment while keeping the flag disabled. The beta's `release` schema supports `flag.state: "disabled"` with an `audience.targets` entry having `rollout: 100`. Inspect the applied result; a pending change request is not applied configuration. Use stable demo identity/context so random sampling cannot masquerade as a toggle. The user's first toggle should be sufficient, without asking them to configure targeting during the reveal.

Read [token guidance](references/tokens.md). The agent's PAT and the app's SDK token are separate. If tooling cannot provision the SDK token, link directly to the selected project's token-creation page and explain the type/environment to choose. Prepare the application's ignored configuration with the known SDK URL; leave only the token for the user. Do not send them to global admin settings, repeat URL questions, or substitute a PAT in SDK code.

## Try the first toggle

Use the client's supported persistent process mechanism and verify the app is running. If it cannot keep a process alive, give the user the actual run command before the handoff. Verify a successful SDK network fetch and the disabled behavior. A cached value, fallback, or MCP evaluation alone is insufficient.

Choose the experience using [live observation](references/live-observation.md):

- **Useful observable result:** attach an observer before inviting the toggle. Prefer an available native event tool, such as Claude Code `Monitor`, and show the relevant actual output as it changes. Keep the watch for the return transition within its deadline. Ordinary background execution alone does not provide live reactions.
- **Hands-on interaction:** give the user clear before/after steps and let them try the application at their own pace. Ask about the result when helpful; do not claim to watch actions you cannot see.

Use a returned flag-page link when available; otherwise preserve the instance base path and URL-encode identifiers in `<instance>/projects/<project>/features/<flag>`. Give the actual app link, request, or command, the right environment, the expected change, and the selected SDK's refresh delay. Backend behavior may need a fresh request/job/command after toggling.

Report only what the application's behavior proves. If the result does not change after the expected refresh and action, check the process, SDK initialization, token scope, targeting/context, and where the flag is evaluated. Resolve the cause before claiming success. SDK metrics are secondary evidence and can lag.

Acknowledge the result briefly and explain how disabling the flag restores the original behavior. Finish with useful links or actions, and any incomplete steps. Never claim success from generated code or a running server alone, or keep claiming to listen after an observer stops.
