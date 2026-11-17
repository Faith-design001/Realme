# Deterministic Git Rollback Without Hallucination

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Field Agent Registration (Task 03)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. The Deliberate Destructive Modification

To test rollback discipline without relying on generative AI hallucination, we introduced an intentional breaking change to the client validation logic:
* **The Fault**: Replaced the robust multi-word legal name regex with a naive single-character permissive string match:
  ```typescript
  // DESTRUCTIVE REGRESSION: Allows single token names like "a"
  const isValidName = (name: string) => name.length > 0;
  ```
* **Committed as**: `feat(regression): loosen full name validation to accept single token names` (Commit SHA: `d891f2a`).

---

## 2. Commit History Audit & Target Commit Selection

Rather than instructing an agent with a vague prompt (*"Please undo what we just did"*), which invites the LLM to guess the previous syntax and introduce subtle side-effects, we audited the immutable Git commit history:

```text
$ git log --oneline -n 5
d891f2a (HEAD -> main) feat(regression): loosen full name validation to accept single token names
2188e4d feat(task-02): implement deal mutation form, complete interview answers, defects log, and machine evidence
f5f89ba docs(audit): update directory manifest in working-tree.md with canonical stylesheet and middleware
b303359 docs(telemetry): record first-load performance bottleneck analysis in performance-note.md
f6fc47e docs(telemetry): record server API network telemetry and static asset latency log in performance-note.md
```

### Target Identification
* **Commit to Revert**: `d891f2a`
* **Target Clean State**: `2188e4d`

---

## 3. Rollback Command Executed

We executed an atomic, non-destructive `git revert` pointing directly at the offending commit SHA:

```bash
git revert --no-edit d891f2a
```

### Git Revert Log Output
```text
[main a104ef9] Revert "feat(regression): loosen full name validation to accept single token names"
 1 file changed, 1 insertion(+), 1 deletion(-)
```

---

## 4. Why Naming the Commit SHA Is Safer Than Natural Language

1. **Cryptographic Precision**: A Git commit SHA-1 digest is a mathematically unique hash of the exact tree object, parent hierarchy, and file contents. Naming the ID instructs the VCS to invert the exact diff hunk byte-for-byte, eliminating ambiguity.
2. **Preventing AI Hallucination**: Asking an AI model in natural language to *"undo the last change"* relies on the model's probabilistic reconstruction of previous context. Models frequently alter adjacent comments, change variable naming, or re-introduce previously fixed defects when attempting to "undo" in prose.

