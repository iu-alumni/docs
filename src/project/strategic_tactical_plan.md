# Strategic & Tactical Plan — IU Alumni Platform (ALUMAP)

Period: Feb 4 – Jul 25 (≈ 24 weeks, 5 roadmap phases)

![plan roadmap](../public/milestone.png)

---

## Part 1 — Strategic Plan

### 1.1 Vision (where we want to be on July 25)

A self-hostable, university-operated alumni platform that can be handed over to a successor team and run for years with minimal intervention. By the end of July:

1. The platform runs on university infrastructure.
2. Every production change is gated by automated tests — not by exploratory testing.
3. The system is observable enough that an on-call engineer can answer "is something broken?" in under 60 seconds from a single dashboard.
4. The codebase is healthy enough that a new contributor can ship a feature in their first week without a senior pairing on every step.
5. Every quality claim in our documentation is backed by an evidence artifact that anyone can re-run.
6. New functionality (social and engagement features) is built on top of this foundation.

### 1.2 The strategic bet

ALUMAP is already in production. That changes the engineering problem. We are not building a system; we are *evolving a running one* through a server migration, three feature phases, and a stabilization phase, without breaking the alumni already using it.

This forces three strategic choices:

1. Stability > velocity in the migration phase, velocity > polish in the feature phases, polish > everything in stabilization. The order matters; the ratio shifts at each phase boundary.
2. Quality investments are front-loaded. The test, security, and observability foundation built in phases 1–2 is what makes phases 3–4 fast. Feature work without that foundation looks fast for two sprints and then collapses.
3. The migration is the forcing function for everything we should already have done. If we cannot restore from backup, we cannot migrate. If we cannot run the test suite headlessly, we cannot validate the migration. If our dashboards do not tell us when the platform is broken, we will not know if the migration broke it. We use phase 1 to fix all three.
