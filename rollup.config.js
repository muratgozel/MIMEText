import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import typescript from "@rollup/plugin-typescript";

const extensions = ['.js', '.ts']

const babelPresetsBrowser = [
    '@babel/preset-typescript',
    ['@babel/preset-env', {
        useBuiltIns: false,
        debug: true
    }]
]
const babelPresetsNode = [
    '@babel/preset-typescript',
    ['@babel/preset-env', {
        targets: {
            node: '14'
        },
        useBuiltIns: false,
        debug: true
    }]
]
const babelPlugins = [
    ['@babel/plugin-transform-runtime', {
        corejs: {
            version: 3,
            proposals: true
        },
        helpers: true,
        absoluteRuntime: false,
        useESModules: true,
        version: "^7.26.0"
    }]
]

export default [
    {
        input: 'src/entrypoints/browser.ts',
        output: [
            {
                format: 'iife',
                name: 'MimeText',
                file: 'dist/mimetext.iife.js',
                sourcemap: true,
                globals: {
                    MimeText: 'MimeText'
                }
            }
        ],
        plugins: [
            typescript({ noForceEmit: true }),
            nodeResolve({ preferBuiltins: false, browser: true, extensions }),
            commonjs({ sourceMap: true }),
            babel({
                extensions,
                //include: ['src/**/*.ts'],
                //exclude: ['node_modules/**'],
                exclude: [/core-js/],
                babelHelpers: 'runtime',
                babelrc: false,
                presets: babelPresetsBrowser,
                plugins: babelPlugins
            }),
            terser({sourceMap: true})
        ]
    },
    {
        input: 'src/entrypoints/browser.ts',
        external: [/@babel\/runtime/, /js-base64/],
        output: [
            {
                format: 'es',
                file: 'dist/mimetext.browser.es.js',
                sourcemap: true
            },
            {
                format: 'cjs',
                file: 'dist/mimetext.browser.cjs.js',
                sourcemap: true
            }
        ],
        plugins: [
            typescript({ noForceEmit: true }),
            nodeResolve({ preferBuiltins: false, browser: true, extensions }),
            commonjs({ sourceMap: true }),
            babel({
                extensions,
                include: ['src/**/*.ts'],
                babelHelpers: 'runtime',
                babelrc: false,
                presets: babelPresetsBrowser,
                plugins: babelPlugins
            }),
            terser({sourceMap: true})
        ]
    },
    {
        input: 'src/entrypoints/node.ts',
        external: [/@babel\/runtime/, 'mime-types'],
        output: [
            {
                format: 'es',
                file: 'dist/mimetext.node.es.js',
                sourcemap: true
            },
            {
                format: 'cjs',
                file: 'dist/mimetext.node.cjs.js',
                sourcemap: true
            }
        ],
        plugins: [
            typescript({ noForceEmit: true }),
            nodeResolve({ preferBuiltins: true, browser: false, extensions }),
            commonjs({ sourceMap: true }),
            babel({
                extensions,
                include: ['src/**/*.ts'],
                babelHelpers: 'runtime',
                babelrc: false,
                presets: babelPresetsNode,
                plugins: babelPlugins
            }),
            terser({sourceMap: true})
        ]
    },
    {
        input: 'src/entrypoints/gas.ts',
        output: [
            {
                format: 'iife',
                name: 'MimeText',
                file: 'dist/mimetext.gas.iife.js',
                sourcemap: true,
                globals: {
                    MimeText: 'MimeText'
                }
            }
        ],
        plugins: [
            typescript({ noForceEmit: true }),
            nodeResolve({ preferBuiltins: false, browser: false, extensions }),
            commonjs({ sourceMap: true }),
            babel({
                extensions,
                //include: ['src/**/*.ts'],
                //exclude: ['node_modules/**'],
                exclude: [/core-js/],
                babelHelpers: 'runtime',
                babelrc: false,
                presets: babelPresetsNode,
                plugins: babelPlugins
            }),
            terser({sourceMap: true})
        ]
    }
]
