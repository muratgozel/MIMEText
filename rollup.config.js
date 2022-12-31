import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import {babel} from '@rollup/plugin-babel';
import {terser} from "rollup-plugin-terser";

const babelPlugins=[]

babelPlugins.push(['@babel/plugin-transform-runtime', {
  corejs: {version: 3, proposals: true},
  helpers: true,
  regenerator: true,
  absoluteRuntime: false
}])

export default [
  {
    external: [
      /@babel\/runtime/, /core-js/
    ],
    input: 'src/entrypoints/browser.js',
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
      nodeResolve({preferBuiltins: false}),
      commonjs({sourceMap: true}),
      babel({
        babelHelpers: 'runtime',
        babelrc: false,
        exclude: ['node_modules/**'],
        presets: [
          ['@babel/env', {
            useBuiltIns: false,
            debug: false
          }]
        ],
        plugins: babelPlugins
      })
    ]
  },
  {
    input: 'src/entrypoints/browser.js',
    output: [
      {
        format: 'iife',
        name: 'MimeText',
        file: 'dist/browser/iife/index.js',
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve({preferBuiltins: false}),
      commonjs({sourceMap: true}),
      babel({
        babelHelpers: 'runtime',
        babelrc: false,
        exclude: ['node_modules/**'],
        presets: [
          ['@babel/env', {
            useBuiltIns: 'usage',
            corejs: {version: 3, proposals: true},
            debug: false
          }]
        ],
        plugins: babelPlugins
      }),
      terser()
    ]
  },
  {
    external: [
      /@babel\/runtime/, /core-js/
    ],
    input: 'src/entrypoints/node.js',
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
      nodeResolve({preferBuiltins: false}),
      commonjs({sourceMap: true})
    ]
  },
  {
    input: 'src/entrypoints/gas.js',
    output: [
      {
        format: 'iife',
        name: 'MimeText',
        file: 'dist/gas/iife/index.js',
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve({preferBuiltins: false}),
      commonjs({sourceMap: true}),
      babel({
        babelHelpers: 'runtime',
        babelrc: false,
        exclude: ['node_modules/**'],
        presets: [
          ['@babel/env', {
            useBuiltIns: 'usage',
            corejs: {version: 3, proposals: true},
            debug: false
          }]
        ],
        plugins: babelPlugins
      }),
      terser()
    ]
  }
]
