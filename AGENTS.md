## Identity

Ammolite is a CSS-in-JS library written in TypeScript.

- You are a professional TypeScript and CSS developer working on this repository.

## Non-Negotiable Rules

- Do not hallucinate.
- Do not invent APIs, files, or behavior.
- Do not assume features that are not present in the repository.
- Do not introduce new dependencies unless explicitly requested.
- Preserve existing code style.
- Preserve file and directory structure.

## Architecture

This repository is a pnpm workspace.

### Core

- `packages/compiler` - CSS-in-JS compiler (AST transforms, codegen, static extraction)
- `packages/integration` - Shared integration layer for build tools
- `packages/web` - User-facing API

### Plugins

- `plugins/unplugin` - Rollup, Vite, Webpack
- `plugins/rsbuild` - Rsbuild integration
- `plugins/next` - Next.js Integration
- `plugins/postcss` - PostCSS integration

### Tests

- `tests/compiler` - CSS-in-JS compiler tests
- `tests/plugins/core` - Core package for plugin tests
- `tests/plugins/webpack` - Webpack plugin tests
- `tests/plugins/webpack-postcss` - Webpack PostCSS plugin tests
- `tests/plugins/rsbuild` - Rsbuild plugin tests
- `tests/plugins/rsbuild-postcss` - Rsbuild PostCSS plugin tests
- `tests/plugins/next-webpack` - Next.js webpack plugin tests
- `tests/plugins/next-turbopack` - Next.js Turbopack plugin tests
- `tests/plugins/rollup` - Rollup plugin tests
- `tests/plugins/rolldown` - Rollup plugin tests (Rolldown)
- `tests/plugins/vite` - Vite plugin tests
- `tests/plugins/vite-postcss` - Vite PostCSS plugin tests
- `tests/web` - User-facing API tests

## Dependency Boundaries

- `packages/compiler` must NOT depend on:
    - `packages/integration`
    - `packages/web`
    - any `plugins/*`

- `packages/integration` may depend on:
    - `packages/compiler`

- `plugins/*` may depend on:
    - `packages/compiler`
    - `packages/integration`

- `packages/web` may depend on (mostly unnecessary):
    - `packages/compiler`

- `tests/*` may only depend on the package they test.

Do not introduce circular dependencies.

## Code Standards

Language:

- TypeScript only.
- No `any` unless unavoidable.
- All variables must have explicit types.
- All exported APIs must have explicit types.

Style:

- Functional programming only.
- No classes unless the codebase already uses one in that exact location.
- No OOP abstractions.
- No mutation unless required.
- Prefer pure functions.
- Prefer small composable utilities.

## Editing Rules

When modifying code:

- Prefer minimal diffs.
- Do not refactor unrelated code.
- Do not rename files or symbols unless they are incorrect.
- If behavior changes, update tests accordingly.
- Never change public API semantics without explicit instruction.

If uncertain about intended behavior:

- Prefer reading tests as source of truth.
- Do not guess.

If a change affects multiple packages:

- Update in dependency order (compiler → integration → plugins → web).

## Testing Rules

- Do not delete failing tests to fix errors.
- Do not weaken assertions.
- Add tests when adding new behavior.
- Keep test style consistent with existing tests.

## Performance

- Avoid runtime allocations inside hot paths.
- Avoid unnecessary object cloning.
- Avoid non-deterministic behavior.
- Ensure stable output ordering where relevant.
- Compiler output must be deterministic.

## Tooling

The project uses:

- Node.js
- pnpm (workspace)
- just (task runner)
- ls-lint
- typos-cli

Always prefer `just` commands.

Never run raw `pnpm` unless explicitly required.

## Commands

Install dependencies:

```sh
just i
```

Lint:

```sh
just lint
```

Format:

```sh
just fmt
```

Build:

```sh
just build
```

Test:

```sh
just test
```

## What NOT to Do

- Do not migrate tooling.
- Do not introduce frameworks.
- Do not add config files unless explicitly requested.
- Do not add formatting rules.
- Do not silently change build behavior.
