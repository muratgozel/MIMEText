export default (api) => {
    api.cache(false)

    const presets = [
        ['@babel/env', {
            useBuiltIns: false,
            debug: false
        }]
    ]
    const plugins = [
        ['@babel/plugin-transform-runtime', {
            corejs: {version: 3, proposals: true},
            helpers: true,
            regenerator: true,
            absoluteRuntime: false
        }]
    ]

    return {
        presets,
        plugins
    }
}
