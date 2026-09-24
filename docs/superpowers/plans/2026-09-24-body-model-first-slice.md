# Body Model First Slice Implementation Plan

> For agentic workers: implement inline in this task. The owner delegated the
> model choice and requested integration in the same turn.

**Goal:** Add a small, source-pinned BodyParts3D whole-body silhouette with
pectoralis major highlighted to the local muscle prototype.

**Architecture:** A deterministic Python script extracts seven meshes from a
pinned Human Atlas adaptation of BodyParts3D 4.0 into one GLB and records a
manifest. A progressively loaded Astro component mounts a locally bundled
model viewer on activation. Static anatomy and evidence remain primary.

**Tech stack:** Python standard library, GLB 2.0, Astro, model-viewer, Vitest,
Playwright.

---

## 1. Decision and asset

- [ ] Record owner-directed bounded model choice and the still-pending review
      gates in the repository decision and hold documents.
- [ ] Write the asset contract test and observe its missing-artifact failure.
- [ ] Add the pinned source reader and deterministic seven-mesh GLB builder.
- [ ] Generate the asset and manifest; confirm the asset contract passes.

## 2. Page integration

- [ ] Write the prototype journey check and observe the absent-control failure.
- [ ] Add the opt-in viewer component to the pectoralis page.
- [ ] Style the model card for desktop, tablet, and phone, including no-script
      and load-failure messaging.
- [ ] Confirm the browser journey and inspect the model visually.

## 3. Handoff

- [ ] Run all repository gates required for the touched work and record their
      exact results.
- [ ] Write the bounded handoff, close the claim, commit, and push the branch.
- [ ] Leave the local preview on the new model page for owner inspection.
