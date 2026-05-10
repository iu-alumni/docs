# Frontend migration decision

## 1. Summary

This document estimates engineering effort, in developer-hours, for two related questions:

1. How long it would take to migrate every feature currently delivered through the Flutter codebase (mobile + Telegram Mini App, both built from one Flutter project) to a WebView-based architecture — i.e. one web app served as the Telegram Mini App and embedded in thin native WebView shells on Android.
2. How long it would take to implement the new requirements specified in on each path: (a) continuing on the current Flutter + Mini App stack, vs (b) doing it on a greenfield WebView stack.

Based on the numbers, it appears that the migration is a poor decision for our scope of requirements.

---

## 2. Scope and Assumptions

- 1 dev-week = 12 hours per developer.
- Buffers: 10% on Scenario A, 15% on Scenario B delta, 5% PM + 10% bug-fix on Scenario C. Because we are junior team working slowly, we expect ~1.3× these numbers.

---

## 3. Scenario A — Migrate Flutter + Mini App to WebView

Cost of porting every feature in the Flutter codebase (mobile + Mini App / Flutter web) to a single Nuxt 3 web app, plus a thin native WebView shell on each mobile platform. No new requirements; pure feature parity.

| Work item | Hours |
|---|--:|
| Nuxt 3 scaffold (reuse patterns from `iu-alumni-frontend`) | 8 |
| Auth + token plumbing in browser (storage, Axios interceptors, session restore) | 5 |
| 10 auth sub-pages (sign-in, register, code/email verify, OTP req/verify, Telegram OTP req/verify, restored verify, password reset req/confirm) | 10 |
| Events list page (cursor pagination, search, refresh) | 5 |
| Event detail page (cover, join/leave, participants, conditions) | 4 |
| Event create / edit page (form, cover upload, location picker) | 3 |
| Profile page (read-only, badges, Telegram link, follow controls) | 3 |
| Profile edit page (avatar, bio, location, social links) | 3 |
| Map page (Leaflet markers, clustering, location filter) | 12 |
| City / location autocomplete | 3 |
| App loading / splash + bootstrap | 1 |
| Root nav (responsive bottom tabs / sidebar, deep links) | .5 |
| Shared component library (cards, lists, dialogs, error/loading states) | 12 |
| Telegram WebApp SDK wiring (`initData`, viewport, MainButton, BackButton) | 4 |
| PWA shell (service worker, manifest, web push subscription) | 8 |
| Android WebView shell (Kotlin, push, deep links, file pickers, JS bridge) | 7 |
| Analytics integration (AppMetrica web SDK + native bridge) | 3 |
| TS API client layer (port of 7 gateways) | 8 |
| Pinia stores mirroring 14 Cubits | 8 |
| Domain types + typed errors (Freezed/fpdart → TS) | 7 |
| Build / deploy pipeline rework (testing + prod images, GHCR, Swarm) | 5 |
| Cross-browser + Mini App + WebView shell QA | 14 |
| **Subtotal** | **133.5** |
| Bug-fix / regression buffer (~10%) | 13.35 |
| **Total — Scenario A** | **146.85** |

**At 12 h/week:** ~12.2 weeks solo, or ~6.1 weeks with Roukaya and Ghadeer in parallel but add 7hrs for organization so ~7 weeks.

---

## 4. Scenario B — Implement requirements on greenfield WebView

Cost of building the WebView path and using it to fulfil docs-repo requirements directly (Flutter retired at cutover). Total = Scenario A port effort + genuinely new behaviour beyond what is already in Flutter. FR10 (redesign) and FR3–FR5 (fixes) are absorbed into the port — you build the correct design once.

| FR | Description | Web(h) |
|---|---|--:|
| FR3 / FR4 / FR5 | Auth / email / event creation fixes | 0 |
| FR6 | Auto-notify on event creation | 2 |
| FR7 | Map auto-update + manual | 6 |
| FR8 | Follow request feature | 16 |
| FR9 | Follow notifications | 2 |
| FR23 | Email notifications | 3 |
| FR24 | Roles refinement | 2 |
| **Net-new beyond port** |  | **31** |

Net-new total: 31 h. With 15% cross-cutting (regression QA, coordination, bug-fix buffer): **35.65 h**.

| Component | Hours |
|---|--:|
| Scenario A — full migration / port | 146.85 |
| Net-new requirements work (incl. 15% cross-cutting) | 35.65 |
| **Total — Scenario B** | **182.5** |

**At 12 h/week:** ~15.2 weeks solo, or ~7.6 weeks with Roukaya and Ghadeer together but maybe add 1 week for PM and learning buffer so total ~8.6 weeks.

---

## 5. Scenario C — Implement requirements on the current stack

Cost of implementing new features in requirements doc on the existing Flutter + Mini App.

| FR | Description | MiniApp (h) | Flutter (h) |
|---|---|--:|--:|
| FR6 | Auto-notify on event creation | 2 | 2 |
| FR7 | Map auto-update monthly + manual | 4 | 4 |
| FR8 | Follow request feature (send / accept / reject) | 16 | 16 |
| FR9 | Follow notifications | 2 | 2 |
| FR10 | Profile redesign | 10 | 20 |
| FR21-22 | Event listing / detail polish | 2 | 4 |
| FR23 | Email notifications (registration, reminders, announcements) | 8 | 2 |
| FR24 | Roles refinement | 2 | 2 |
| **Per-feature subtotal** | | **46** | **52** |

Per-feature total: **98 h**

| Cross-cutting | Hours |
|---|--:|
| Cross-platform regression QA (mobile-main + main mini app + admin) | 12 |
| Native-shell hardening (push, store metadata, Mini App manifest) | 6 |
| PM / coordination (~5%) | 5 |
| Bug-fix buffer (~10%) | 10 |
| **Cross-cutting total** | **33** |

**Total — Scenario C: 131 h** — ~11 weeks solo, or ~5.5 weeks split.
