/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
    branches: ['main'],
    plugins: [
        ['@semantic-release/commit-analyzer', { preset: 'angular' }],
        ['@semantic-release/release-notes-generator', { preset: 'angular' }],
        ['@semantic-release/npm', { npmPublish: true }],
        ['@semantic-release/github']
    ]
}