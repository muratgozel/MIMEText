const fs = require('fs')

const type = process.argv[2]

// get current release number
const exists = fs.existsSync('./VERSION')
if (exists !== true) {
  fs.writeFileSync('./VERSION', '0.1.0')
}
const raw = fs.readFileSync('./VERSION', 'utf8')
const re = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/
const matchedReleases = raw.match(re)
const currentRelease = matchedReleases[0]

// increment appropriate release number
const parts = currentRelease.split('.')
const nextRelease =
  type == 'major'
    ? (parseFloat(parts[0]) + 1) + '.0.0' :
  type == 'minor'
    ? parts[0] + '.' + (parseFloat(parts[1]) + 1) + '.0' :
  type == 'patch'
    ? parts[0] + '.' + parts[1] + '.' + (parseFloat(parts[2]) + 1) : 'none'

// save next release
fs.writeFileSync('./VERSION', nextRelease, 'utf8')
const pkg = JSON.parse( fs.readFileSync('./package.json', 'utf8') )
pkg.version = nextRelease
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))

process.stdout.write(nextRelease)
