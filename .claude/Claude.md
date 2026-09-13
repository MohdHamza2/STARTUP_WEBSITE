# CLAUDE PROJECT INSTRUCTIONS

## PROJECT AI OPERATING SYSTEM

You are working on this project as an AI development agent.

You must follow the project's documented development workflow.

The authoritative role instructions are located in:

.agents/FRONTEND_AGENT.md
.agents/BACKEND_AGENT.md
.agents/DATABASE_AGENT.md

---

# 1. FIRST ACTION

Before doing development work:

Read:

1. brain.md
2. reports/progress.md
3. Relevant PRD
4. Relevant architecture documentation
5. Relevant technology documentation
6. Relevant testing documentation
7. Relevant debugging documentation
8. The appropriate .agents role file

Do not begin coding before understanding the current project state.

---

# 2. ROLE SELECTION

If working on frontend:

Follow:
.agents/FRONTEND_AGENT.md

If working on backend:

Follow:
.agents/BACKEND_AGENT.md

If working on database:

Follow:
.agents/DATABASE_AGENT.md

If a task crosses multiple boundaries, identify the affected agents and coordinate rather than silently taking ownership of everything.

---

# 3. PROJECT MEMORY

brain.md is the project's long-term memory.

reports/progress.md is the project's chronological working log.

Both must remain current.

Never allow important project decisions to exist only inside the current AI conversation.

---

# 4. DEVELOPMENT CYCLE

Every feature follows:

PLAN
→ VERIFY PLAN
→ BUILD
→ VERIFY
→ TEST
→ BROWSER TEST WHEN APPLICABLE
→ VALIDATE
→ DEBUG IF REQUIRED
→ VERIFY FIX
→ REGRESSION TEST
→ COMMIT
→ UPDATE PROGRESS
→ UPDATE BRAIN
→ NEXT FEATURE

---

# 5. NEVER GUESS

When something fails:

DO NOT randomly modify code.

Determine:

Expected
Actual
Error
Reproduction
Evidence
Root cause
Smallest fix

Then fix and verify.

---

# 6. NO UNRELATED REFACTORING

Do not rewrite unrelated code.

Do not change architecture simply because another approach looks better.

Do not replace dependencies without a documented reason.

---

# 7. NO DOCKER

Docker is NOT part of this project's preferred development setup.

Do not introduce Docker or Docker Compose.

Use the project's approved free/native services.

PostgreSQL is the preferred database where database infrastructure is required.

---

# 8. SECURITY

Never expose:

- API keys
- Passwords
- Private keys
- Tokens
- Session secrets
- Database credentials

Never commit .env secrets.

---

# 9. COMMIT POLICY

Never commit unverified code.

Every commit must:

1. Have a focused purpose.
2. Pass relevant verification.
3. Have a meaningful Conventional Commit message.
4. Be recorded in reports/progress.md.
5. Be recorded in brain.md when meaningful.

---

# 10. MULTI-AGENT RULE

Before modifying a file:

Check whether another agent owns the area.

Avoid simultaneous conflicting changes.

If a shared file must change:

Document the change and coordinate.

---

# 11. SESSION HANDOFF

Before ending a session:

Update:

reports/progress.md

and:

brain.md

Record:

- Current task
- Completed work
- Files changed
- Verification
- Tests
- Commit
- Bugs
- Blockers
- Exact next step

The next AI must be able to continue immediately.

---

# 12. ABSOLUTE PRIORITY

Follow:

PROJECT DOCUMENTATION
>
SECURITY
>
ARCHITECTURE
>
CORRECTNESS
>
VERIFICATION
>
TESTING
>
PERFORMANCE
>
UX
>
SPEED

Never sacrifice the higher-level rules for convenience.