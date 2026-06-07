# Verity — the AI-native GRC platform that shows its work

**Verity** is a next-generation governance, risk, and compliance (GRC) platform. It uses
agentic AI to test compliance controls — SOC 2, ISO 27001, NIST CSF, PCI DSS, EU AI Act —
against **real evidence sources** (AWS, GitHub, Okta, Confluence) and produces a defensible,
reproducible audit trail.

The market is dominated by incumbents (Vanta, Drata, AuditBoard) built before LLMs existed —
their AI is bolted onto CRUD apps designed for periodic checkbox checks. Verity is AI-native
from the ground up: **agents plan, collect, test, and explain; humans review only the residue.**

## What makes Verity different

- **The LLM never does math.** Every number traces to a deterministic tool call (DuckDB,
  Python, structured queries). The agent plans queries and explains results — it doesn't
  invent figures.
- **Every claim is cited.** Each asserted fact about a document includes an exact quote +
  page + section, validated by string match against the source. Hallucinated citations are
  rejected before they reach a user.
- **Defensible by design.** Every verdict is reproducible months later: same evidence, same
  model version, same prompt hash, same skill version → same result.
- **Layered verification, not "another agent to check."** Five layers — schema validation →
  citation grounding → deterministic checks → adversarial cross-model → human review. Cheap
  layers run on everything; expensive layers run on what matters.
- **Visible reasoning.** The agent's reasoning trace *is* the product. Planning, tool calls,
  deterministic checks, and verdicts surface as legible steps. No black boxes.

## How it works

1. **Connect evidence** — cloud accounts, code, identity, and document sources.
2. **Agents test controls** — autonomous agents plan and run controls against live evidence
   across multiple compliance frameworks.
3. **Verify** — the five-layer stack grounds every claim and flags anything uncertain.
4. **Review the residue** — humans review only the small fraction of outputs that need a
   judgment call (target: under 20%).

## Frameworks covered

SOC 2 · ISO 27001 · NIST CSF · PCI DSS · EU AI Act (and growing).

---

### About this repository

This repo is the **Verity marketing website** — a self-contained, no-build landing page
(pure HTML/CSS/JS, deploys to GitHub Pages as-is). For details on previewing, deploying, or
regenerating the product screenshots, see the comments in `index.html`, `app.js`, and the
`_capture/` tooling folder.
