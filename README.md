# Unleash skills

Connect a feature flag to a demo or your existing application, then see its behavior change when you toggle the flag in Unleash.

Personal skills for **Claude Code**, **Codex**, and compatible agents. This repository targets the local **Unleash MCP `0.6.0-beta.5`** and requires **Node 24 or newer**. It is independent of the [official Unleash skills](https://github.com/Unleash/unleash-claude-skills).

| Skill | What it does |
| --- | --- |
| [onboarding](skills/onboarding/SKILL.md) | Guides your first flag integration with a frontend or backend SDK, using your application or a small demo. |

New to Unleash? [Start a free trial](https://auth.app.getunleash.io/sign-up), then use the onboarding skill once your instance is ready.

## Claude Code

Run inside Claude Code:

```text
/plugin install unleash-skills --marketplace nunogois/unleash-skills
```

Choose user scope to use it across projects. Configure your Unleash instance URL and personal access token when prompted, then run:

```text
/unleash-skills:onboarding
```

The combined install command requires Claude Code 2.1.275 or newer. See [setup](SETUP.md) for PAT guidance, older clients, and troubleshooting.

## Codex

Install through Codex's plugin support. In the plugin browser, add the marketplace `nunogois/unleash-skills` and install **unleash-skills**, or use the CLI:

```sh
codex plugin marketplace add nunogois/unleash-skills
codex plugin add unleash-skills@nunogois
```

The plugin includes the skill and pinned local MCP. Start its setup or ask:

```text
Use $onboarding to connect my first Unleash flag.
```

Codex does not run Claude's URL/PAT prompts. On first use, the agent provides a command to run the plugin's credential helper in your terminal. It asks for the URL and hidden PAT; no separate repository clone, skill symlink, or MCP registration is needed. [Connection setup](SETUP.md#codex).

## What to expect

- Work in your existing language and application, or create a small demo. Browser demos are favored when you have no preference; backend SDKs, APIs, and CLI applications are supported too.
- Create or reuse a flag, connect the appropriate SDK, and get a direct link to toggle the flag yourself.
- Try the app with clear before/after steps, or have the agent watch useful app output. Claude Code can react through its native `Monitor` tool when available; observation depends on the client's tools and permissions.

The agent reads current SDK documentation. Demo ideas are adaptable; the bundled storefront and [public demo references](skills/onboarding/references/demo-inspiration.md) are optional inspiration.

Your agent needs access to your application and an appropriate Unleash connection. The PAT authenticates the agent; the app needs a separate SDK token. Keep tokens out of chat. See [setup](SETUP.md) for permissions and local/remote MCP options.

## Other agents

Install `skills/onboarding` through your agent's Agent Skills support and configure the Unleash MCP separately. Installing a skill alone does not install MCP. Other agents have not been validated here.

## Updates and development

Follow [update instructions](SETUP.md#updates-and-version-checks) to refresh an installed copy. For local plugin testing, checks, and the optional browser starter, see [development](CONTRIBUTING.md).
