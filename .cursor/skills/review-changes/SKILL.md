---
name: review-changes
description: Review all changes on the current branch. Use when the user asks for a code review or PR review.
disable-model-invocation: false
inputs:
  - id: branch
    type: currentBranch
    description: The branch to review
---

# review-changes

Review all changes on the current branch compared to the upstream branch.

## Context

{{branch}}

## Determining the Base Branch

**IMPORTANT:** This repository uses `master` as the integration branch.

1. **Use `master` as the default base branch** for all comparisons:

   ```bash
   git diff origin/master...HEAD
   ```

2. **Verify by checking GitHub workflows** if unsure - look at `.github/workflows/*.yml` for `pull_request.branches` targets

3. **Use the correct git diff syntax:**
   - `origin/master...HEAD` - shows changes in current branch since it diverged from master
   - Run `git log --oneline origin/master..HEAD` to see commits being reviewed

## Pre-flight: Detect Change Types

Before launching subagents, analyze what files changed:

```bash
git diff origin/master...HEAD --name-only
```

**Conservative skip rules (only skip when 100% safe):**

| Reviewer              | Run         | Notes                                       |
| --------------------- | ----------- | ------------------------------------------- |
| `reviewer-prettier`   | ✅ Always   | Formats `.md`, `.json`, `.ts`, `.tsx`, etc. |
| `reviewer-typescript` | Conditional | Skip ONLY if NO `.ts`/`.tsx` files changed  |
| `reviewer-eslint`     | Conditional | Skip ONLY if NO `.ts`/`.tsx` files changed  |
| `reviewer-tests`      | Conditional | Skip ONLY if NO `.ts`/`.tsx` files changed  |

**When in doubt, run the check.** Fast failures are better than missed issues.

## Execution Strategy

**IMPORTANT:** Launch ALL applicable subagents in a SINGLE parallel batch.
Do NOT wait for one group to finish before starting another.

In one tool call batch, launch all applicable reviewers:

- `reviewer-prettier` (always)
- `reviewer-typescript` (if `.ts`/`.tsx` files changed)
- `reviewer-eslint` (if `.ts`/`.tsx` files changed)
- `reviewer-tests` (if `.ts`/`.tsx` files changed)

## Analysis Required

Check for:

**Code Quality & Bugs:**

- Potential bugs, edge cases, or runtime errors
- Code smells, anti-patterns, or violations of repository rules (check `.cursor/rules/*`)
- Newly added TODO/FIXME comments that should be addressed
- Suspicious or unclear code changes
- Business logic changes that need scrutiny

**Standards & Compliance:**

- Delegate to `reviewer-typescript` subagent to check for TypeScript errors
- Delegate to `reviewer-eslint` subagent to check for linting violations
- Delegate to `reviewer-prettier` subagent to check for formatting issues
- Breaking changes to public API surface
- Package exports changes
- Type definition changes

**FuryStack App-Specific:**

- Public API changes (exported functions, classes, types)
- Dependency injection patterns (`@Injectable`, `@Injected`)
- Observable patterns (`ObservableValue`, subscriptions)
- Disposable resources (`Symbol.dispose`, `Symbol.asyncDispose`)

**Shades Styling Patterns:**

- Flag `useState()` used only for CSS-representable states (hover, focus, active)
- Recommend using `css` property with pseudo-selectors instead:

  ```typescript
  // ❌ Anti-pattern to flag
  const [isHovered, setIsHovered] = useState('hover', false)
  <div onMouseEnter={() => setIsHovered(true)} style={{ opacity: isHovered ? 1 : 0.7 }} />

  // ✅ Recommend instead
  css: { opacity: '0.7', '&:hover': { opacity: '1' } }
  ```

- Static `style` props in Shade definitions should use `css` instead

**Testing & Coverage:**

- Delegate to `reviewer-tests` subagent to run unit tests and assess coverage
- Missing test coverage for new/changed public APIs
- Test quality and edge case coverage

**Performance & Security:**

- Performance concerns (memory leaks, missing disposal)
- Security vulnerabilities or data exposure

**Documentation:**

- Missing or outdated documentation for public APIs
- README updates for new features

## Subagent Output Rules

**IMPORTANT:** Only include subagent results in the final output if they found errors or issues.

- If `reviewer-typescript` passes → Do NOT mention it in the output
- If `reviewer-eslint` passes → Do NOT mention it in the output
- If `reviewer-prettier` passes → Do NOT mention it in the output
- If `reviewer-tests` passes → Do NOT mention it in the output

Only report subagent findings when they detect actual problems.

## Output Format

**1. Summary:** Brief overview of changes (2-3 sentences max)

**2. Issues by Priority:**

- 💀 **Critical:** Must fix before merge
- 🔥 **High:** Should fix before merge
- 🤔 **Medium:** Consider addressing
- 💚 **Low:** Nice to have

For each issue, be specific: package, file, line, problem, suggested fix.

**3. Test Coverage:** Assess coverage quality. Warn if public APIs lack tests.

**4. Breaking Changes:** List any breaking changes and suggest migration guide if needed.

**5. Changelog:** Generate a short, consistent changelog as a copyable markdown code block.

Format:

- Use present tense, imperative mood (e.g., "Add", "Fix", "Update", "Remove")
- One line per logical change (max 5-7 lines)
- Group by type if multiple changes: Features, Fixes, Refactors
- No verbose descriptions - keep each line under 80 characters

Example:

```
- Add user profile validation
- Fix observable memory leak in cache
- Update dependency injection patterns
```

**6. Pull Request Description:** Generate as a copyable markdown code block with:

- Relevant emoji per header
- Brief description of what the PR does
- **Remaining Tasks** checklist generated from found issues (if any), grouped by priority:

```markdown
## 📋 Remaining Tasks

### 💀 Critical

- [ ] Fix TypeScript error in `frontend/src/foo.ts:42`

### 🔥 High

- [ ] Add missing test for `handleSubmit` function

### 🤔 Medium

- [ ] Address memory leak in observable subscription
```

Omit empty priority sections. If no issues found, omit the entire Remaining Tasks section.

**Style:** Be critical, specific, and concise. Focus on code quality and API surface area. If unsure, ask for clarification.
