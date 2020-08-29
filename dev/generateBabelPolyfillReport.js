const {execSync} = require('child_process')
const fs = require('fs')

const result = execSync('POLYFILL_REPORTING=1 npm run build', {encoding: 'utf8'})
const lines = result.split(/[\r\n]/).filter(l => typeof l == 'string' && l.length > 0)

const rePolyfills = /^(es\.)|^(esnext\.)|^(helpers\.)|^(web\.)/g
let searchPolyfills = false
const polyfillsData = []
let searchTargets = false
let targetsData = '{'
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]

  if (searchPolyfills === true && line.slice(0, 2) == '  ') {
    const matches = line.slice(2).match(rePolyfills)
    if (matches && matches.length > 0) polyfillsData.push(line.trim().split(' ')[0])
  }

  if (searchTargets === true && line == '}') searchTargets = false
  if (searchTargets === true && line.length > 3 && line.slice(0, 3) == '  "') {
    targetsData += line.trim()
  }

  if (searchPolyfills === false && line.indexOf('Using polyfills with `usage` option:') !== -1)
    searchPolyfills = true
  if (searchTargets === false && line.indexOf('Using targets:') !== -1) {
    targetsData = '{'
    searchTargets = true
  }
}

targetsData += '}'
const targets = JSON.parse(targetsData)

const readmeData = fs.readFileSync('./README.md', 'utf8')
const re = /\[comment\]: # \(BABEL_POLYFILLS_REPORT_START\)[\s\S]+\[comment\]: # \(BABEL_POLYFILLS_REPORT_END\)/gm
if (re.test(readmeData)) {
  const replacement = `[comment]: # (BABEL_POLYFILLS_REPORT_START)
\`\`\`js
// polyfills:
${JSON.stringify(polyfillsData.filter((s, i, self) => self.indexOf(s) === i), null, 2)}
// based on the targets:
${JSON.stringify(targets, null, 2)}
\`\`\`
[comment]: # (BABEL_POLYFILLS_REPORT_END)`

  fs.writeFileSync('./README.md', readmeData.replace(re, replacement))
}
