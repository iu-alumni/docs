# IU Alumni Docs

Documentation for the IU Alumni platform — a community platform for Innopolis University graduates to plan events and stay connected.

## Live site

**[iu-alumni.github.io/docs](https://iu-alumni.github.io/docs)**

## What's documented

| Section | Description |
| --- | --- |
| Technical | Architecture, stack decisions, and component design with Mermaid diagrams |
| Requirements | Functional requirements, quality attributes, and use-case specifications |
| Metrics & Analytics | KPIs, engagement metrics, and measurement methodology |
| Sprints | Meeting notes and sprint records |

## Local development

```bash
npm install
npm run docs:dev
```

The dev server starts at `http://localhost:5173/docs/`.

## Build

```bash
npm run docs:build   # output → src/.vitepress/dist/
npm run docs:preview # preview the built site locally
```

## Markdown lint

Run lint checks on all markdown files in `src/`:

```bash
npm run lint:md        # check for issues
npm run lint:md:fix    # check and auto-fix fixable issues
```

Run these commands from the `docs/` directory so `.markdownlint.json` is picked up.

## Stack

Built with [VitePress](https://vitepress.dev) + [vitepress-plugin-mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid). Deployed to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

## Contributing

See the org-wide [Contributing Guide](https://github.com/iu-alumni/.github/blob/main/CONTRIBUTING.md).
