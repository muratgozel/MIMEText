const os = require('os')
const {exec} = require('child_process')

exec('git status --porcelain', function(error, stdout, stderr) {
  if (error) {
    console.log(error)
    return;
  }

  const out = stdout + stderr
  const arr = out.split(os.EOL).filter(
    line =>
      line.slice(0, 3).indexOf(' M') !== -1 ||
      line.slice(0, 3).indexOf(' D') !== -1 ||
      line.slice(0, 3).indexOf('??') !== -1
  )

  process.stdout.write( arr && arr.length > 0 ? 'yes' : 'no' )
})
