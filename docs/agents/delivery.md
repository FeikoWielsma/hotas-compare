# Delivery workflow

## Start with an observable outcome

Read the relevant issue and existing implementation. State what the user will be able to do, or which catalog facts will change, and how that outcome will be checked. Resolve routine implementation choices independently; surface decisions that need the maintainer's product or editorial judgment.

Inspect the working tree before editing. Preserve other work and keep the task's changes identifiable. Current code and data take precedence over historical handover notes; use those notes for context and unresolved questions.

## Branches and pull requests

This is a solo-maintainer project. Use PRs as a bounded integration checkpoint with evidence, rather than a ceremony requiring another human reviewer.

- Prefer one branch and PR per coherent feature, bug fix, shared schema change, or batch of catalog updates. Several implementation commits can belong to one PR.
- Small documentation or data corrections can use a direct commit when that matches the user's requested workflow. Avoid splitting a coherent task into trivial PRs.
- Keep unrelated work out of the diff. With T3, use an app-bound worktree when a task needs its own checkout. A new worktree starts from committed work; account for dependencies that are still uncommitted.
- Follow the user's scope for committing, pushing, opening PRs, merging, and deployment. Existing authorization persists. Complete local preparation and verification before requesting any genuinely missing publication authorization.
- A PR should explain the concrete behavior or data change, link the issue when present, record verification, and identify remaining judgment calls. Include preview or screenshot evidence when it helps assess UI changes; include source evidence for disputed catalog changes.
- With T3's PR linking tools, register each PR worked on with the current thread. When asked to monitor a PR, use the app's watcher when available.

## Verify the result

Choose checks from the current `package.json` and existing tests. Match verification to the change:

- **Application logic, schema, or broad catalog edits:** run type checks, the relevant tests, and the production build. Run the full suite for shared behavior or integration changes.
- **Focused data corrections:** run the relevant schema/content checks and inspect affected derived values. A source citation establishes provenance; a passing test establishes only what that test checks.
- **UI changes:** run the relevant code checks and exercise the changed behavior in the browser at desktop and narrow widths. Check affected states such as unknown values, empty results, and long product names.
- **Documentation only:** check the diff, referenced paths, and consistency with actual commands and tools. Application tests are unnecessary unless executable behavior changed.

Schema additions in `src/lib/schema.ts` must also get a widget in `keystatic.config.ts`; `src/lib/keystatic-config.test.ts` fails on drift, because Keystatic drops fields it has no widget for when a product is saved.

Use these journeys as applicable to the changed area: catalog filtering and region switching; comparison add/remove and navigation; product details and store links; wizard completion and shared-state restoration. Verify the visible outcome, not just a successful click or page load. Confirm the browser serves current data when the dev server may be stale.

Record what was actually checked and its result. Distinguish local verification, CI results, and deployed behavior. Identify preexisting failures separately and explain their effect on confidence. After the final edit, rerun checks affected by that edit.

## Coordinate delegated work

When delegation is part of the task, give each worker a bounded outcome, file or product ownership, required evidence, and a completion criterion. Separate implementation worktrees where concurrent edits would overlap; keep shared schema/interface changes with one owner.

The coordinating agent integrates the results and verifies the combined change. An independent review should inspect a specific commit against the issue and challenge behavior and evidence. Agreement between models is supporting feedback, not proof that a catalog fact is correct.

## Finish and improve the workflow

Report the outcome, verification, remaining limitations, and delivery state (local changes, commit, PR, or deployment). Make clear which decisions still need the maintainer.

When the same correction recurs, fix the environment: prefer a schema rule or meaningful regression test for executable invariants, and a short procedure for research judgment. Keep each rule in one authoritative place and link it from the relevant entry point. Group related audit findings into existing issues before creating new tasks.

Automated gates and recurring jobs must be implemented and observed before claiming they enforce this workflow. Until then, perform the applicable checks explicitly.
