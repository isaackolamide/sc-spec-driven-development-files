---
name: changelog-manager
description: Automatically generates or updates CHANGELOG.md in the project root based on git history before merging changes.
---

# Changelog Manager Skill

This skill is used to keep the `CHANGELOG.md` in the project root up-to-date. It parses the Git commit history, groups commits by date, and prepends new entries without duplicating existing logs.

## When to use
Manually invoke this skill before merging a feature branch into the main branch.

## How to use
Run the automated script using the following command:

```bash
npm run changelog
```
