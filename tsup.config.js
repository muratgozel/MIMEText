import {defineConfig} from 'tsup'

export default defineConfig(() => ({
    sourcemap: true,
    clean: true,
    dts: true,
    format: ['cjs', 'esm', 'iife'],
    globalName: 'MimeText',
    minify: true,
    bundle: true,
    target: 'es2020',
    treeshake: true,
    shims: true,
    entry: ['src/entrypoints/browser.ts', 'src/entrypoints/gas.ts', 'src/entrypoints/node.ts']
}))
