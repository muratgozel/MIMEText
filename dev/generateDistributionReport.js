const fs = require('fs')

const files = fs.readdirSync('./dist')
const list = files.filter(f => f.slice(0, 1) != '.').map(function(f) {
  return f + ' (' + (fs.statSync('./dist/' + f)['size'] / 1000).toFixed(2) + ' KB)'
})

const readmeData = fs.readFileSync('./README.md', 'utf8')
const re = /\[comment\]: # \(DISTRIBUTIONS_REPORT_START\)[\s\S]+\[comment\]: # \(DISTRIBUTIONS_REPORT_END\)/gm
if (re.test(readmeData)) {
  const replacement = `[comment]: # (DISTRIBUTIONS_REPORT_START)
\`\`\`js
${JSON.stringify(list, null, 2)}
\`\`\`
[comment]: # (DISTRIBUTIONS_REPORT_END)`

  fs.writeFileSync('./README.md', readmeData.replace(re, replacement))
}
