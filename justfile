set shell := ["bash", "-cu"]
set windows-shell := ["pwsh", "-Command"]

tsc := "pnpm exec tsc"
biome := "pnpm exec biome"
tsdown := "pnpm exec tsdown"
vitest := "pnpm exec vitest"
typedoc := "pnpm exec typedoc"

publish_dev := "pnpm publish --no-git-checks --tag dev --access public"
publish := "pnpm publish --access public"

lsl_cfg := "-config ../../../.ls-lint.yaml"

compiler := "packages/compiler"
integ := "packages/integration"
web := "packages/web"

unplugin := "plugins/unplugin"
rsbuild := "plugins/rsbuild"
next := "plugins/next"
postcss := "plugins/postcss"

test_compiler := "tests/compiler"
test_core := "tests/plugins/core"
test_webpack := "tests/plugins/webpack"
test_webpack_postcss := "tests/plugins/webpack-postcss"
test_rsbuild := "tests/plugins/rsbuild"
test_rsbuild_postcss := "tests/plugins/rsbuild-postcss"
test_next_turbopack := "tests/plugins/next-turbopack"
test_next_webpack := "tests/plugins/next-webpack"
test_rollup := "tests/plugins/rollup"
test_tsdown := "tests/plugins/tsdown"
test_vite := "tests/plugins/vite"
test_vite_postcss := "tests/plugins/vite-postcss"
test_web := "tests/web"

ex_var := "examples/set-variables"
ex_fallback := "examples/fallback"
ex_merge := "examples/merge"

tmpl_webpack := "templates/webpack"
tmpl_rsbuild := "templates/rsbuild"
tmpl_next_tp := "templates/next-turbopack"
tmpl_next_wp := "templates/next-webpack"
tmpl_rollup := "templates/rollup"
tmpl_rolldown := "templates/rolldown"
tmpl_vite := "templates/vite"

bench_variables := "benchmarks/variables"
bench_keyframes := "benchmarks/keyframes"
bench_style := "benchmarks/style"
bench_merge := "benchmarks/merge"

# Default action
_:
    just --list -u

# Install
i:
    pnpm install

# Install with frozen-lockfile
if:
    pnpm install --frozen-lockfile

# Build core packages
build-core:
    cd ./{{compiler}} && {{tsdown}} -c tsdown.config.ts
    cd ./{{integ}} && {{tsdown}} -c tsdown.config.ts
    cd ./{{web}} && {{tsdown}} -c tsdown.config.ts

# Build plugins
build-plugins:
    cd ./{{unplugin}} && {{tsdown}} -c tsdown.config.ts
    cd ./{{rsbuild}} && {{tsdown}} -c tsdown.config.ts
    cd ./{{next}} && {{tsdown}} -c tsdown.config.ts
    cd ./{{postcss}} && {{tsdown}} -c tsdown.config.ts

# Build tests
build-tests:
    cd ./{{test_core}} && {{tsdown}} -c tsdown.config.ts

# Build packages
build:
    just build-core
    just build-plugins
    just build-tests

# Format code
fmt:
    {{biome}} check --write .

# Lint with ls-lint
lslint:
    cd ./{{compiler}}/src && ls-lint {{lsl_cfg}}
    cd ./{{integ}}/src && ls-lint {{lsl_cfg}}
    cd ./{{web}}/src && ls-lint {{lsl_cfg}}

    cd ./{{unplugin}}/src && ls-lint {{lsl_cfg}}
    cd ./{{rsbuild}}/src && ls-lint {{lsl_cfg}}
    cd ./{{next}}/src && ls-lint {{lsl_cfg}}
    cd ./{{postcss}}/src && ls-lint {{lsl_cfg}}

    cd ./{{test_compiler}}/src && ls-lint {{lsl_cfg}}
    cd ./{{test_web}}/src && ls-lint {{lsl_cfg}}

    cd ./{{bench_variables}}/src && ls-lint {{lsl_cfg}}
    cd ./{{bench_keyframes}}/src && ls-lint {{lsl_cfg}}
    cd ./{{bench_style}}/src && ls-lint {{lsl_cfg}}
    cd ./{{bench_merge}}/src && ls-lint {{lsl_cfg}}

    cd ./{{ex_var}}/src && ls-lint {{lsl_cfg}}
    cd ./{{ex_fallback}}/src && ls-lint {{lsl_cfg}}
    cd ./{{ex_merge}}/src && ls-lint {{lsl_cfg}}

    cd ./{{tmpl_webpack}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_rsbuild}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_next_tp}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_next_wp}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_rollup}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_rolldown}}/src && ls-lint {{lsl_cfg}}
    cd ./{{tmpl_vite}}/src && ls-lint {{lsl_cfg}}

# Lint with typos-cli
typos:
    typos

# Lint with TypeScript Compiler
tsc:
    cd ./{{compiler}} && {{tsc}} --noEmit
    cd ./{{integ}} && {{tsc}} --noEmit
    cd ./{{web}} && {{tsc}} --noEmit

    cd ./{{unplugin}} && {{tsc}} --noEmit
    cd ./{{rsbuild}} && {{tsc}} --noEmit
    cd ./{{next}} && {{tsc}} --noEmit
    cd ./{{postcss}} && {{tsc}} --noEmit

# Lint code
lint:
    just lslint
    just typos
    just tsc

# Lint code with Biome
lint-biome:
    {{biome}} lint .

# Run tests
test:
    cd ./{{test_compiler}} && {{vitest}} run

    cd ./{{test_webpack}} && {{vitest}} run
    cd ./{{test_webpack_postcss}} && {{vitest}} run

    cd ./{{test_rsbuild}} && {{vitest}} run
    cd ./{{test_rsbuild_postcss}} && {{vitest}} run

    cd ./{{test_next_webpack}} && {{vitest}} run
    cd ./{{test_next_turbopack}} && {{vitest}} run

    cd ./{{test_rollup}} && {{vitest}} run
    cd ./{{test_tsdown}} && {{vitest}} run

    cd ./{{test_vite}} && {{vitest}} run
    cd ./{{test_vite_postcss}} && {{vitest}} run

    cd ./{{test_web}} && {{vitest}} run

# Check code
check:
    just build
    just fmt
    just lint
    just test

# Run variables benchmarks
bench-var:
    cd ./{{bench_variables}} && {{vitest}} bench --run

# Run keyframes benchmarks
bench-kf:
    cd ./{{bench_keyframes}} && {{vitest}} bench --run

# Run style benchmarks
bench-style:
    cd ./{{bench_style}} && {{vitest}} bench --run

# Run merge benchmarks
bench-merge:
    cd ./{{bench_merge}} && {{vitest}} bench --run

# Run all benchmarks
bench:
    just bench-var
    just bench-kf
    just bench-style
    just bench-merge

# Set packages version
ver VER:
    node ./scripts/set-ver.ts {{VER}}

# Publish packages with dev tag as dry-run
publish-dev-try:
    cd ./{{compiler}} && {{publish_dev}} --dry-run
    cd ./{{integ}} && {{publish_dev}} --dry-run
    cd ./{{web}} && {{publish_dev}} --dry-run

    cd ./{{unplugin}} && {{publish_dev}} --dry-run
    cd ./{{rsbuild}} && {{publish_dev}} --dry-run
    cd ./{{next}} && {{publish_dev}} --dry-run
    cd ./{{postcss}} && {{publish_dev}} --dry-run

# Publish packages with dev tag
publish-dev:
    cd ./{{compiler}} && {{publish_dev}}
    cd ./{{integ}} && {{publish_dev}}
    cd ./{{web}} && {{publish_dev}}

    cd ./{{unplugin}} && {{publish_dev}}
    cd ./{{rsbuild}} && {{publish_dev}}
    cd ./{{next}} && {{publish_dev}}
    cd ./{{postcss}} && {{publish_dev}}

# Publish packages as dry-run
publish-try:
    cd ./{{compiler}} && {{publish}} --dry-run
    cd ./{{integ}} && {{publish}} --dry-run
    cd ./{{web}} && {{publish}} --dry-run

    cd ./{{unplugin}} && {{publish}} --dry-run
    cd ./{{rsbuild}} && {{publish}} --dry-run
    cd ./{{next}} && {{publish}} --dry-run
    cd ./{{postcss}} && {{publish}} --dry-run

# Publish packages
publish:
    cd ./{{compiler}} && {{publish}}
    cd ./{{integ}} && {{publish}}
    cd ./{{web}} && {{publish}}

    cd ./{{unplugin}} && {{publish}}
    cd ./{{rsbuild}} && {{publish}}
    cd ./{{next}} && {{publish}}
    cd ./{{postcss}} && {{publish}}

# Clean builds (Linux)
clean-linux:
    rm -rf ./templates/next-webpack/next-env.d.ts
    rm -rf ./templates/next-webpack/.next
    rm -rf ./templates/next-turbopack/next-env.d.ts
    rm -rf ./templates/next-turbopack/.next
    rm -rf ./templates/*/dist
    rm -rf ./examples/*/dist
    rm -rf ./tests/plugins/*/dist
    rm -rf ./plugins/*/dist
    rm -rf ./packages/*/dist

# Clean builds (macOS)
clean-macos:
    just clean-linux

# Clean builds (Windows)
clean-windows:
    Remove-Item -Recurse -Force ./templates/next-webpack/next-env.d.ts
    Remove-Item -Recurse -Force ./templates/next-webpack/.next
    Remove-Item -Recurse -Force ./templates/next-turbopack/next-env.d.ts
    Remove-Item -Recurse -Force ./templates/next-turbopack/.next
    Remove-Item -Recurse -Force ./templates/*/dist
    Remove-Item -Recurse -Force ./examples/*/dist
    Remove-Item -Recurse -Force ./tests/plugins/*/dist
    Remove-Item -Recurse -Force ./plugins/*/dist
    Remove-Item -Recurse -Force ./packages/*/dist

# Clean
clean:
    just clean-{{os()}}

# Clean everything (Linux)
clean-all-linux:
    just clean

    rm -rf ./benchmarks/*/node_modules
    rm -rf ./templates/*/node_modules
    rm -rf ./examples/*/node_modules
    rm -rf ./tests/plugins/*/node_modules
    rm -rf ./tests/*/node_modules
    rm -rf ./plugins/*/node_modules
    rm -rf ./packages/*/node_modules

    rm -rf ./node_modules

# Clean everything (macOS)
clean-all-macos:
    just clean-all-linux

# Clean everything (Windows)
clean-all-windows:
    just clean

    Remove-Item -Recurse -Force ./benchmarks/*/node_modules
    Remove-Item -Recurse -Force ./templates/*/node_modules
    Remove-Item -Recurse -Force ./examples/*/node_modules
    Remove-Item -Recurse -Force ./tests/plugins/*/node_modules
    Remove-Item -Recurse -Force ./tests/*/node_modules
    Remove-Item -Recurse -Force ./plugins/*/node_modules
    Remove-Item -Recurse -Force ./packages/*/node_modules

    Remove-Item -Recurse -Force ./node_modules

# Clean everything
clean-all:
    just clean-all-{{os()}}
