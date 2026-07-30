# Mobile Hero Photo Zone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the clinic receptionist and sign visible on phones by separating the mobile photo focal area from the hero cards.

**Architecture:** Add a semantic class to the existing hero media wrapper, then use mobile-only CSS to constrain it to an upper photo zone and move the existing cards into normal flow below it. Existing tablet/desktop rules, content, data, and interactions remain unchanged.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, project CSS, Vite.

## Global Constraints

- Apply the redesign only below 640px.
- Preserve all current copy, data, accessibility labels, animations, and CTA targets.
- Keep tablet and desktop layouts unchanged.

---

## Task 1: Create the mobile photo zone

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/index.css`

- [ ] Add a stable `hero-media` class to the existing image wrapper.
- [ ] Add mobile-only layout rules for a 30rem upper photo zone.
- [ ] Reframe the image around the sign and receptionist.
- [ ] Move the cards below the protected focal area with a small boundary overlap.
- [ ] Compact mobile card spacing without changing content or actions.

## Task 2: Verify responsiveness

- [ ] Run `npm run build`.
- [ ] Verify 360px, 390px, and 430px viewport widths in a browser.
- [ ] Confirm the receptionist and sign are visible and cards do not overflow.
- [ ] Verify desktop layout remains bottom-aligned and unchanged.

## Task 3: Publish

- [ ] Review the focused diff.
- [ ] Commit the implementation.
- [ ] Push `main` to `origin`.
