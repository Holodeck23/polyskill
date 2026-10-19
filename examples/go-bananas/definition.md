---
identity:
  name: go-bananas
  description:
    full: >
      End-of-session closer. Use when the user says "go bananas", "wrap up",
      "finish what's owed", or asks for a handover prompt. If there is room
      left in the session it finishes every outstanding task it can do itself,
      writes exact prompts for anything a browser agent should do, and walks
      the user through anything only they can do. If the session is nearly
      out of room it updates the docs, pushes what is safe, and writes one
      complete copy-paste handover prompt for a fresh session, with plain-language
      options and a recommendation for every open decision.
    short: Finish what's owed, or hand over cleanly
activation:
  triggers:
    - go bananas
    - wrap up
    - handover prompt
    - finish outstanding tasks
  auto_invoke: false
  user_invoke: true
dependencies:
  mcp: []
  bash:
    - pattern: git:*
      reason: check working tree state and push safe work
  env: []
resources:
  scripts: []
  references: []
  assets: []
behavior:
  dynamic_injections: []
constraints:
  max_body_lines: 500
  recommended_body_tokens: 5000
---

# go-bananas

Excellent work so far. This skill closes out a session: either finish what's owed, or hand over cleanly so a fresh session can pick it up.

## Step 1. Take stock

Before deciding anything, list what is still open. Look back through this session for:

- Tasks the user asked for that are not done, or only partly done.
- Things you said you would do ("I'll also...", "next I'll...") and haven't.
- Failing tests, lint errors, TODOs you introduced, unpushed commits.
- Decisions you deferred to the user.

If you are in a git repository, run `git status --short --branch` and `git log --oneline -5` so the list reflects what is actually committed and pushed.

Show the user the list in a short checklist before acting on it.

## Step 2. Pick a mode

Judge how much room is left in this session. Signals that it is running low: the conversation is very long, earlier context has already been summarized or compacted, or the remaining work is large (many files, a long debugging loop).

- **Room left → Mode A (Finish).**
- **Running low, or unsure → Mode B (Hand over).** A clean handover is cheap; a session that dies mid-task is expensive.

Say which mode you picked and why, in one line.

## Mode A. Finish what's owed

Work through the checklist from Step 1. Sort every item into exactly one bucket:

1. **You can do it yourself → do it.** Don't ask permission for work already requested. Verify each item (run the tests, re-read the output) before ticking it off.
2. **A browser agent can do it inside an app → write the prompt.** Give the user one copy box per task containing a detailed, exact prompt for the browser agent: the URL or app to open, every click/field/value, what "done" looks like, and what to do if something doesn't match.
3. **Only the user can do it → walk them through it.** Numbered steps, one action per step, saying exactly where to click and what they should see after. Typical cases: logging in, paying, approving access, anything needing their judgment or credentials.

Finish with the checklist again, each item marked done, handed to a browser agent, or waiting on the user.

## Mode B. Hand over

1. **Update the docs.** Bring README, CHANGELOG, setup notes, or any project docs in line with what changed this session. Only edit docs that are actually stale.
2. **Push what is safe.** Commit and push work that is complete, builds, and passes its checks. Never push secrets, broken builds, or half-finished changes to a shared branch; leave those described in the handover instead. Say what you pushed and what you held back.
3. **Write the handover prompt** (format below).

### Handover prompt format

Deliver the whole prompt as **one** Markdown code block so it copies in one go.

Use a **four-backtick fence** (` ```` `) or a tilde fence (`~~~`) for the outer block. Any code, commands, or scripts inside it then use normal three-backtick fences without breaking the outer block. Check the result: the outer fence must open once at the top and close once at the bottom, with nothing outside it except one line telling the user to paste it into a new session.

The prompt must include:

- **Goal.** What we are building and why, in two or three sentences.
- **Where things stand.** Repo, branch, last commit, what is done and verified.
- **Outstanding tasks.** Every owed or open task, most important first, with enough detail that a fresh session can start without asking.
- **Known issues.** Errors, flaky tests, gotchas discovered this session.
- **Decisions for the user.** For each open decision:
  - The question in plain, non-technical language.
  - Each option with a concrete example of what it would mean in practice.
  - Pros and cons of each.
  - **Your recommendation** and why it's the most useful choice.
- **First move.** The exact first thing the new session should do.

## Notes

- Never claim something is done that you didn't verify. "Pushed" means the push succeeded.
- If nothing is outstanding, say so plainly and stop. Don't invent work.
