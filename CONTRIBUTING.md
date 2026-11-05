# Development

Keep the shared skill independent of any one agent, language, framework, or demo. Use current SDK documentation for integrations and keep client-specific setup at the repository level.

## Local testing

Requires Node 24 or newer. The setup helpers and tests have no repository dependencies. The MCP downloads its pinned npm package when launched.

Run the helper tests:

```sh
npm test
```

Validate both Claude manifests:

```sh
claude plugin validate --strict .claude-plugin/plugin.json
claude plugin validate --strict .claude-plugin/marketplace.json
```

Lint Markdown:

```sh
npx --yes markdownlint-cli2@0.24.0 '**/*.md'
```

Use a skill frontmatter validator when available. Manifest and Markdown validation do not verify the agent's behavior.

To load this checkout directly in Claude Code:

```sh
claude --plugin-dir /absolute/path/to/unleash-skills
```

Or use `/plugin install unleash-skills --marketplace /absolute/path/to/unleash-skills` inside Claude Code. Keep tokens in client configuration, never in this repository.

## Optional browser starter

From `skills/onboarding/assets/browser-demo`:

```sh
npm ci --ignore-scripts
npm run build
```

Its dependency lockfile is committed. Keep its dependencies and SDK usage consistent with the current official documentation. The storefront is optional inspiration; preserve other languages and backend integration paths.

## Behavior checks

Try a new demo, an existing application, a restricted user, and resuming partial setup. Cover both a frontend and backend SDK. Verify the actual application changes OFF → ON → OFF using the user's flag; a running server, SDK fallback, or MCP evaluation alone is insufficient.

For browser demos, check a narrow viewport and a late toggle after the agent handoff. For backend demos, check the exact request/command and expected before/after output. Test both useful live observation and user-led interaction. Native monitoring needs a live client test; its availability depends on the client/provider/settings.

Confirm failures remain actionable: incorrect token/environment, unavailable project permissions, missing SDK-token tools, and an interrupted observer. Neither the application nor its output should expose the agent's PAT.

## Distributing changes

Bump the version in root `plugin.json`, `.claude-plugin/plugin.json`, and root `package.json` together. The portable `plugin.json`/`mcp.json` and `.agents/plugins/marketplace.json` provide Codex installation; the Claude manifests retain its native configuration prompts. Both packages share the same skill and launcher. Claude's cached installations use the plugin version to detect updates. Push the changes to the marketplace repository before asking users to update. The MCP package pin is separate; change it deliberately and verify tool compatibility.
