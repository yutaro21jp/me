# Tasks

## Dependency Security Follow-up

- `contentlayer2` and `next-contentlayer2` were safely updated to `0.5.8`.
- Remaining `npm audit --omit=dev` advisories are moderate-only and currently have no direct upstream fix.
- Main unresolved areas are `pliny` (`js-yaml`), `contentlayer2`/`mdx-bundler` (`uuid`), and Next's internal `postcss`.
- Do not force Next's internal `postcss` version; keep the dependency tree valid and wait for an upstream Next patch.
- A full cleanup likely requires replacing or removing `pliny` and/or `contentlayer2`; treat that as a planned migration, not a quick dependency bump.
- Validate any future migration with `npm run build`, `npm audit --omit=dev`, and production deploy checks.
