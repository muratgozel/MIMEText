import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'

const babelPresetsStandart = [
    ['@babel/env', {
        useBuiltIns: false,
        debug: false
    }]
]
const babelPresetsIife = [
    ['@babel/env', {
        useBuiltIns: 'usage',
        corejs: {version: 3, proposals: true},
        debug: false
    }]
]
const babelPlugins = [
    ['@babel/plugin-transform-runtime', {
        corejs: {version: 3, proposals: true},
        helpers: true,
        regenerator: true,
        absoluteRuntime: false
    }]
]

export default [
    {
        external: [/@babel\/runtime/, /core-js/],
        input: 'build/entrypoints/browser.js',
        output: [
            {
                format: 'cjs',
                file: 'dist/browser/cjs/index.js',
                sourcemap: true
            },
            {
                format: 'es',
                file: 'dist/browser/es/index.js',
                sourcemap: true
            }
        ],
        plugins: [
            alias({
                entries: [{
                    find: /^#src\/(.*)/,
                    replacement: 'build/$1.js'
                }]
            }),
            json(),
            nodeResolve({preferBuiltins: false}),
            commonjs({sourceMap: true}),
            babel({
                babelHelpers: 'runtime',
                babelrc: false,
                exclude: ['node_modules/**'],
                presets: babelPresetsStandart,
                plugins: babelPlugins
            })
        ]
    },
    {
        input: 'build/entrypoints/browser.js',
        output: [
            {
                format: 'iife',
                name: 'MimeText',
                file: 'dist/browser/iife/index.js',
                sourcemap: true,
                globals: {
                    MimeText: 'MimeText'
                }
            }
        ],
        plugins: [
            alias({
                entries: [{
                    find: /^#src\/(.*)/,
                    replacement: 'build/$1.js'
                }]
            }),
            json(),
            nodeResolve({preferBuiltins: false}),
            commonjs({sourceMap: true}),
            babel({
                babelHelpers: 'runtime',
                babelrc: false,
                exclude: ['node_modules/**'],
                presets: babelPresetsIife,
                plugins: babelPlugins
            }),
            terser({sourceMap: true})
        ]
    },
    {
        external: [/@babel\/runtime/, /core-js/],
        input: 'build/entrypoints/node.js',
        output: [
            {
                format: 'cjs',
                file: 'dist/node/cjs/index.js',
                sourcemap: true
            },
            {
                format: 'es',
                file: 'dist/node/es/index.js',
                sourcemap: true
            }
        ],
        plugins: [
            alias({
                entries: [{
                    find: /^#src\/(.*)/,
                    replacement: 'build/$1.js'
                }]
            }),
            json(),
            nodeResolve({preferBuiltins: true}),
            commonjs({sourceMap: true})
        ]
    },
    {
        input: 'build/entrypoints/gas.js',
        output: [
            {
                format: 'iife',
                name: 'MimeText',
                file: 'dist/gas/iife/index.js',
                sourcemap: true,
                globals: {
                    MimeText: 'MimeText'
                }
            }
        ],
        plugins: [
            alias({
                entries: [{
                    find: /^#src\/(.*)/,
                    replacement: 'build/$1.js'
                }]
            }),
            json(),
            nodeResolve({preferBuiltins: false}),
            commonjs({sourceMap: true}),
            babel({
                babelHelpers: 'runtime',
                babelrc: false,
                exclude: ['node_modules/**'],
                presets: babelPresetsIife,
                plugins: babelPlugins
            }),
            terser({sourceMap: true})
        ]
    }
]
