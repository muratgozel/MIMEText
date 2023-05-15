import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
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
        external: [/@babel\/runtime/, /core-js/, /js-base64/],
        input: 'build/entrypoints/browser.js',
        output: [
            {
                format: 'cjs',
                file: 'dist/browser/mimetext.cjs',
                sourcemap: false
            },
            {
                format: 'es',
                file: 'dist/browser/mimetext.es.js',
                sourcemap: false
            }
        ],
        plugins: [
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
                file: 'dist/browser/mimetext.iife.js',
                sourcemap: true,
                globals: {
                    MimeText: 'MimeText'
                }
            }
        ],
        plugins: [
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
        external: [/@babel\/runtime/, /core-js/, /mime-types/],
        input: 'build/entrypoints/node.js',
        output: [
            {
                format: 'cjs',
                file: 'dist/node/mimetext.cjs',
                sourcemap: false
            },
            {
                format: 'es',
                file: 'dist/node/mimetext.es.js',
                sourcemap: false
            }
        ],
        plugins: [
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
                file: 'dist/gas/mimetext.js',
                sourcemap: true,
                globals: {
                    MimeText: 'MimeText'
                }
            }
        ],
        plugins: [
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
