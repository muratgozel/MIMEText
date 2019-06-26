const fs = require('fs')

// get current release number
const exists = fs.existsSync('./VERSION')
if (exists !== true) {
  process.stdout.write('0.1.0')
}
else {
  const raw = fs.readFileSync('./VERSION', 'utf8')
  const re = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/
  const matchedReleases = raw.match(re)
  const currentRelease = matchedReleases[0]
  process.stdout.write(currentRelease)
}
