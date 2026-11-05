# Setup

Installing a skill does not execute this file automatically. Follow the setup for your agent.

## Requirements

- Node 24 or newer with npm/npx for the pinned local MCP.
- An Unleash instance URL, including any base path but without `/api`, such as `https://example.com/unleash`.
- A personal access token for the agent. It acts with your permissions.
- Claude Code with plugin configuration support, or Codex CLI available in your terminal.

## Personal access token

1. In Unleash, open your avatar → **View profile settings → Personal API tokens**, or visit `<instance>/profile/personal-api-tokens`, preserving any instance base path.
2. Create a token, name it for your agent, and choose an expiry.
3. Copy the complete value when it is shown. Paste it into the plugin configuration field or the Codex helper's hidden prompt, never into chat.

A PAT cannot grant extra permissions. If the agent cannot create a flag, check your project access. The application needs a separate **backend** or **frontend** SDK token, obtained during onboarding. See the maintained [Unleash token guide](https://docs.getunleash.io/concepts/api-tokens-and-client-keys).

## Claude Code

Install and invoke the plugin as described in [README](README.md#claude-code). In `/plugin`, select the installed plugin and choose its configuration option if the URL/token prompt does not appear. The PAT field is sensitive and uses Claude Code's secure credential store.

The plugin starts the local MCP through the shared launcher. It supplies the non-secret instance URL in the MCP connection instructions so the agent can prepare SDK URLs and direct UI links. Follow any reload instruction, then check `/mcp` for a successful connection.

For a client without the combined install command, add the marketplace and install separately:

```text
/plugin marketplace add nunogois/unleash-skills
/plugin install unleash-skills@nunogois
```

For a client without plugin configuration support, update Claude Code or configure MCP using the [upstream instructions](https://github.com/Unleash/unleash-mcp).

## Codex

Install the plugin as described in [README](README.md#codex). Installation supplies both the skill and MCP server. Codex does not expand Claude's `userConfig` values, so the Codex MCP configuration uses the launcher's saved settings instead.

Start plugin setup or invoke `$onboarding`. If credentials are missing, the agent should locate this installed plugin and give you the exact command to run `scripts/setup-codex.js` in your own terminal. For example, the command takes this form, with the real installed path filled in:

```sh
node /absolute/path/to/installed/unleash-skills/scripts/setup-codex.js
```

The agent can locate the helper relative to its loaded skill. The install result also reports the installed path when using `codex plugin add unleash-skills@nunogois --json`. The helper only asks for the URL and hidden PAT and saves them to `~/.config/unleash-skills/mcp.json`, with mode `0600` on POSIX. It does not install skills or register an extra MCP server. This is a plaintext local file, not an OS credential vault. Restart the plugin's MCP connection or Codex afterward.

The launcher reads `UNLEASH_BASE_URL` and `UNLEASH_PAT` from its environment first, falling back to saved settings for missing values. Credentials go to the MCP in its environment, not command arguments. Previously saved connection settings remain usable after switching to plugin installation.

To remove the plugin, run `codex plugin remove unleash-skills@nunogois`. Delete `~/.config/unleash-skills/mcp.json` if you no longer need the saved connection, and revoke the PAT in Unleash separately.

If you used the earlier manual setup, it may have created a standalone `unleash-onboarding` MCP server and an `~/.agents/skills/onboarding` symlink. After confirming the plugin works, remove that old server with `codex mcp remove unleash-onboarding` and remove only the symlink pointing at this repository. Do not remove an unrelated skill with the same name.

## Remote MCP

Local MCP is the default so this repository can pin the beta version. Reuse a compatible remote connection if configured, or follow the [upstream remote setup](https://github.com/Unleash/unleash-mcp#connect-to-the-remote-server). An instance admin must enable the remote server, and authentication depends on the supported client/organization flow.

A remote server's version is controlled by the Unleash deployment; enabling it does not pin it to this beta. Check its tool compatibility and identify the intended instance when multiple connections exist.

For Codex, a remote registration pattern is:

```sh
codex mcp add unleash-onboarding-remote --url https://YOUR-INSTANCE/api/admin/mcp
codex mcp login unleash-onboarding-remote
```

Use your full instance base path in the URL. This alternative does not use the local launcher or its credential file. Keep the onboarding skill installed separately.

## Updates and version checks

The plugin and MCP have separate versions. The local MCP package pin lives in `scripts/local-mcp.js`; both setup paths use it. In Claude Code, select `plugin:unleash-skills:mcp` under `/mcp` to check the intended connection. `claude plugin list --json` shows your installed plugin's version and path. The MCP initialization response reports its runtime `serverInfo.version` when the client exposes it.

- **Claude marketplace install:** choose **Update now** under `/plugin` → Installed, or run `claude plugin update unleash-skills@nunogois` in your terminal. Then `/reload-plugins` or start a new session. Custom marketplaces do not auto-update by default; you can enable that under `/plugin` → Marketplaces.
- **Claude local development:** `--plugin-dir` reads the source directly. Reload or start a new session after edits. Local marketplaces may also load in place; check the installed path. Avoid mixing two copies when testing.
- **Codex plugin install:** refresh the marketplace with `codex plugin marketplace upgrade nunogois`, then install the updated copy through the plugin browser or `codex plugin add unleash-skills@nunogois`. Start a new conversation and restart the MCP/client to load changes.

See [Claude's update instructions](https://code.claude.com/docs/en/discover-plugins#keep-plugins-updated) and [loading rules](https://code.claude.com/docs/en/plugins/loading#in-place-and-copied-plugins).

## Troubleshooting

- **No MCP tools:** check Node, the client's connection settings, and reload requirements.
- **Authentication failure:** check the instance URL and PAT without displaying the token.
- **Permission failure:** request the required project access; the MCP cannot grant permissions you do not have.
- **No SDK-token tool:** create the appropriate token in the project's API access settings; do not use the PAT in your SDK.
- **Skill missing in Codex:** check that the plugin is installed/enabled and start a new conversation. Use `codex plugin list --json` to inspect its installed path.
- **No automatic chat reaction:** the feature needs an observable result and an available observer, such as Claude's `Monitor`. The agent can also guide you to try the application yourself. See [observation guidance](skills/onboarding/references/live-observation.md).
