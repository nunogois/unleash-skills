# Token guidance

Use with [the onboarding skill](../SKILL.md) when setting up authentication or handing SDK-token creation to the user.

Read the live [API token guide](https://docs.getunleash.io/concepts/api-tokens-and-client-keys) and the selected SDK's documentation before giving instructions. The MCP `docs` tool returns a documentation index; follow its links and read the relevant pages. If unavailable, use the official [documentation index](https://docs.getunleash.io/llms.txt) or fetch the guide directly. Match current UI labels and project-level instructions, rather than recalling an older admin flow. If retrieval fails, state the limitation.

## Agent access

A personal access token (PAT) lets the agent act with the user's permissions; it does not grant extra access. It is separate from the token the application needs.

When helping configure MCP, link to the user's Personal API tokens page. Prefer a link returned by the instance; the UI route fallback is `<instance>/profile/personal-api-tokens`. Explain how to create a token named for their agent, choose an expiry, and copy its complete value into the agent's configuration field or hidden terminal prompt. The token is shown once. Never ask the user to paste it into the conversation or inspect the agent's credential store.

## Application access

Choose a **backend** token for a server SDK and a **frontend** token for a browser/mobile SDK, using the selected project and environment. Do not call the backend option “Client” because an API enum or old example does. The live docs are the source for labels and supported steps.

Check actual MCP schemas for token provisioning; do not invent a tool. If manual creation is needed, give a clickable link to the selected project's **Settings → API access** page. Tell the user to click **New API token** first, then choose the token type and environment. Prefer returned/discovered UI links. The route fallback is `<instance>/projects/<URL-encoded-project-id>/settings/api-access`; append it to the instance root while preserving its base path. Do not use a leading `/` with URL resolution that drops that path.

Explain the handoff naturally: the agent's PAT is already configured, and the application now needs its own SDK token. Give the actual project API access link, followed by **New API token**, token type, environment, and the local file/field to edit. Say what you will do once it is saved. Keep the instructions specific to the chosen app and use the current Backend or Frontend label.

Prepare the ignored configuration file with the real SDK URL, leaving only the token value for the user. Tell them which file and field to edit. Read token values only through the application's normal configuration when running it; do not dump the file into tool output. An existing secure token cannot be retrieved after creation: the UI/API may only expose its selector. Use a valid token the user already has or guide them to create a new one; do not mistake a selector for an SDK credential.
