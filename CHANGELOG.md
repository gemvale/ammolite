[< Back](./README.md)

## Next

### Compiler

- upgrade `oxc-parser` to `~0.132.0`
- upgrade `rolldown` to `^1.0.0`

## 0.1.4 (2026-04-25)

### Compiler

- resolve tsconfig paths in webpack and Rspack
- fix reference error: name is not defined
- upgrade `oxc-parser` to `~0.127.0`
- upgrade `rolldown` to `1.0.0-rc.17`

### Unplugin

- add `tsconfigPath` option
- add support for Rspack
- update package metadata

### Rsbuild Plugin

- add `tsconfigPath` option
- extends plugin from Rspack instead of webpack

### NextJS Plugin

- add `tsconfigPath` option

### Web

- allow passing `false`, `null` and `undefined` values into `merge` function

## 0.1.3 (2026-03-06)

### Compiler

- upgrade `rolldown` to `1.0.0-rc.7`

### Unplugin

- avoid duplicated cache clears per CWD

### PostCSS Plugin

- remove unused options types
- remove `fdir` from dependencies

## 0.1.2 (2026-03-05)

### Compiler

- upgrade `oxc-parser` to `~0.116.0`
- upgrade `rolldown` to `1.0.0-rc.6`

### PostCSS Plugin

- ensure stable CSS output

## 0.1.1 (2026-03-04)

### Compiler

- avoid unexpected behaviours on windows

### Unplugin

- merge config in internal config plugin

### PostCSS Plugin

- export internal cache plugin

## 0.1.0 (2026-03-02)

initial release
