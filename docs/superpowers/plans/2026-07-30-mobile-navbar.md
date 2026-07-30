# Mobile Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the overcrowded phone header with a compact brand, icon-only booking action, and clear menu trigger.

**Architecture:** Keep the existing Navbar state and navigation behavior. Add dedicated classes and a calendar icon for responsive controls, then style the header and menu with mobile-first CSS that cannot be overridden by shared button display rules.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, project CSS, Vite.

## Global Constraints

- Preserve the full `clinic.nameShort` wordmark.
- Keep all current navigation targets and accessible labels.
- Keep desktop navigation unchanged.

---

## Task 1: Separate responsive header controls

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] Add a calendar icon component.
- [ ] Add dedicated desktop Book and Staff visibility classes.
- [ ] Add an icon-only mobile Book control.
- [ ] Add explicit menu control and panel classes.
- [ ] Preserve menu state, Escape handling, and scroll behavior.

## Task 2: Style the compact header and menu

**Files:**
- Modify: `src/index.css`

- [ ] Size the mobile logo, wordmark, booking icon, and hamburger.
- [ ] Prevent shared button styles from overriding responsive visibility.
- [ ] Style the mobile menu panel, rows, active state, and action group.
- [ ] Keep desktop styles unchanged.

## Task 3: Verify and publish

- [ ] Run the production build.
- [ ] Verify header fit at 320px, 360px, 390px, and 430px.
- [ ] Verify menu click, Escape close, booking scroll, and desktop layout.
- [ ] Commit and push to `origin/main`.
