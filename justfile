set shell := ["bash", "-cu"]
set windows-shell := ["pwsh", "-Command"]

tsc := "pnpm exec tsgo"
biome := "pnpm exec biome"
tsdown := "pnpm exec tsdown"
vitest := "pnpm exec vitest"
typedoc := "pnpm exec typedoc"
publish := "pnpm publish"

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
test_rollup := "tests/plugins/rollup"
test_rolldown := "tests/plugins/rolldown"
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

bench_keyframes := "benchmarks/keyframes"
bench_style := "benchmarks/style"
bench_variables := "benchmarks/variables"

# Default action
_:
    just build
    just lint
    just fmt
    just test

# Install
i:
    pnpm install

# Install with frozen-lockfile
if:
    pnpm install --frozen-lockfile

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

    cd ./{{bench_keyframes}}/src && ls-lint {{lsl_cfg}}
    cd ./{{bench_style}}/src && ls-lint {{lsl_cfg}}
    cd ./{{bench_variables}}/src && ls-lint {{lsl_cfg}}

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
    typos
    just tsc

# Lint code with Biome
lint-biome:
    {{biome}} lint .

# Format code
fmt:
    {{biome}} check --write .

# Build core packages
build-core:
    cd ./{{compiler}} && {{tsdown}} -c tsdown.config.ts
    cd ./{{integ}} && {{tsdown}} -c tsdown.config.ts
    cd ./{{web}} && {{tsdown}} -c tsdown.config.ts

# Build plugins:
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

# Run tests
test:
    cd ./{{test_compiler}} && {{vitest}} run

    cd ./{{test_webpack}} && {{vitest}} run
    cd ./{{test_webpack_postcss}} && {{vitest}} run

    cd ./{{test_rsbuild}} && {{vitest}} run
    cd ./{{test_rsbuild_postcss}} && {{vitest}} run

    cd ./{{test_rollup}} && {{vitest}} run
    cd ./{{test_rolldown}} && {{vitest}} run

    cd ./{{test_vite}} && {{vitest}} run
    cd ./{{test_vite_postcss}} && {{vitest}} run

    cd ./{{test_web}} && {{vitest}} run

# Run variables benchmarks
bench-var:
    cd ./{{bench_variables}} && {{vitest}} bench --run

# Run keyframes benchmarks
bench-kf:
    cd ./{{bench_keyframes}} && {{vitest}} bench --run

# Run style benchmarks
bench-style:
    cd ./{{bench_style}} && {{vitest}} bench --run

# Run all benchmarks
bench:
    just bench-var
    just bench-kf
    just bench-style

# Publish compiler package with dev tag
publish-dev-compiler:
    cd ./{{compiler}} && {{publish}} --no-git-checks --tag dev --access public

# Publish integration package with dev tag
publish-dev-integ:
    cd ./{{integ}} && {{publish}} --no-git-checks --tag dev --access public

# Publish web package with dev tag
publish-dev-web:
    cd ./{{web}} && {{publish}} --no-git-checks --tag dev --access public

# Publish Unplugin with dev tag
publish-dev-unplugin:
    cd ./{{unplugin}} && {{publish}} --no-git-checks --tag dev --access public

# Publish Rsbuild plugin with dev tag
publish-dev-rsbuild:
    cd ./{{rsbuild}} && {{publish}} --no-git-checks --tag dev --access public

# Publish Next plugin with dev tag
publish-dev-next:
    cd ./{{next}} && {{publish}} --no-git-checks --tag dev --access public

# Publish PostCSS plugin with dev tag
publish-dev-postcss:
    cd ./{{postcss}} && {{publish}} --no-git-checks --tag dev --access public

# Publish all packages with dev tag
publish-dev:
    just publish-dev-compiler
    just publish-dev-integ
    just publish-dev-web

    just publish-dev-unplugin
    just publish-dev-rsbuild
    just publish-dev-next
    just publish-dev-postcss

# Publish compiler package
publish-compiler:
    cd ./{{compiler}} && {{publish}} --access public

# Publish integration package
publish-integ:
    cd ./{{integ}} && {{publish}} --access public

# Publish web package
publish-web:
    cd ./{{web}} && {{publish}} --access public

# Publish Unplugin
publish-unplugin:
    cd ./{{unplugin}} && {{publish}} --access public

# Publish Rsbuild plugin
publish-rsbuild:
    cd ./{{rsbuild}} && {{publish}} --access public

# Publish Next plugin
publish-next:
    cd ./{{next}} && {{publish}} --access public

# Publish PostCSS plugin
publish-postcss:
    cd ./{{postcss}} && {{publish}} --access public

# Publish all packages
publish:
    just publish-compiler
    just publish-integ
    just publish-web

    just publish-unplugin
    just publish-rsbuild
    just publish-next
    just publish-postcss

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
