# Listen and respond to the running app

Use with [the onboarding skill](../SKILL.md) before asking the user to toggle a flag. Apply [browser observation](browser-demo.md) or [backend observation](backend-reveal.md) to choose the actual behavior to watch.

## Choose whether to monitor

Use live monitoring when the feature produces a meaningful result the agent can capture: a changed greeting, API response, rendered state, or relevant application event. Tool availability alone is not a reason to attach a watcher. Do not add artificial logging, repeated requests, or an observation bridge solely to justify using Monitor.

For features best explored directly, invite the user to try the application themselves. Explain where to go, what to do before/after toggling, and what should change. Examples include completing a checkout flow, exploring a new search interaction, or comparing the feel of a feature. Let them try it at their own pace; ask what they thought or whether it behaved as expected when helpful. This can be the preferred experience even when browser tools are available. Do not claim to observe their actions unless a real observer is attached.

The remaining instructions apply when live monitoring adds useful evidence.

## Establish the evidence stream

Show the initial app output/result in the conversation. Attach the observer before inviting the toggle and retain its handle. Emit a concise line when application behavior changes, including enough before/after detail to recognize the feature. Flush output promptly in the selected language/runtime. Do not emit unchanged state on every poll, log credentials, or treat old log lines as new transitions.

For a terminal app, use its actual greeting/result lines. For an API, compare the actual relevant response from a safe read-only request. For a browser, capture its DOM/rendered-state or console transition through browser tools or a small local observation bridge. A browser log is not part of the dev server log unless an explicit bridge forwards it. Observing the SDK's flag value can support the result but does not replace observing that the feature branch ran.

Use a stable demo identity/context and configure the intended demo audience before starting. Repeated random rollout assignments are not toggle events. Keep both the app and the observer attached to their respective persistent process/task mechanisms; ending a watch should not stop the app.

## Claude Code: use native Monitor

Check the tools actually available in the session. When `Monitor` is available, read its actual schema and use it for a short, bounded watch. The maintained [Claude tools reference](https://code.claude.com/docs/en/tools-reference#monitor-tool) documents streaming each output line back to Claude and interjecting when events arrive. Native watches have deadlines; the documented default is five minutes, suitable for trying both toggle directions during onboarding. Tell the user how long this watch is active. Do not extend it indefinitely or install automatic global plugin monitors/hooks for every session.

Start the app separately so its lifetime is independent of the watch. If it already writes useful output to a known log, Monitor can tail new lines from that file. Otherwise prepare a small read-only observer that prints only relevant behavior changes. On systems with `tail`, `tail -n 0 -F` on the actual, safely quoted log path is one option; ensure that file exists and the app is writing to it. A background Bash command capturing stdout alone does not stream each line into the conversation.

Confirm Monitor started successfully before saying “I'm listening.” Then give a short handoff and let its events drive the next response. Show the relevant actual app output in a small code block or quote, followed by a natural sentence such as “There it is—the original greeting is back.” Describe only what the event proves. Keep the watch for the reverse toggle too; do not end with “tell me when you've switched it.” A handoff response does not mean event monitoring has stopped while this native watch and session remain active.

Stop the observer after the user has tried both directions, asks to stop, or its deadline expires. Report a stopped/failed observer honestly; do not continue claiming to listen. A session exit, deadline, permission denial, or unavailable tool limits this behavior. Never silently assume Monitor is present based on the client name; tool availability depends on client/provider/settings.

## Other clients and fallback

Use an equivalent native event-streaming tool if it is available, without assuming Claude-specific tools exist in Codex or other agents. If the client only supports process execution plus polling, keep the current turn active and check captured behavior output in short calls for up to two minutes. Surface relevant app output immediately. Do not finish the turn and claim ordinary shell output will wake the agent later.

If output capture is impossible, give the user an actual visible observation path, such as the app in their browser or a command in their terminal, and explain that automatic chat reactions are unavailable in this session. For a monitoring-oriented flow, ask them to report the result only if observation cannot be attached. Deliberately choosing user-led application testing is a separate, equally valid experience. Native client permissions and tool schemas apply; do not ask the user to enable broad permissions or change global configuration just to make this work.
