#!/usr/bin/env node
const {exec, execSync} = require('child_process')
const fs = require('fs')
const path = require('path')
const cli = require('yargs')()
const semver = require('semver')

function readVersion() {
  return JSON.parse(
    fs.readFileSync('./package.json', 'utf8')
  ).version
}

function gitHasChanges(cb) {
  exec('git status -s', function(error, stdout, stderr) {
    if (stderr) {
      return cb(new Error(stderr.trim()))
    }

    return cb(null, stdout.trim().split(/[\r\n]/g))
  })
}

function commitChanges(version, msg, branch='master') {
  const commands = [
    'git tag -a "' + version + '" -m "' + msg + '"',
    'git add .',
    'git commit -m "' + msg + '"',
    'git push origin ' + branch + ' --tags'
  ]

  for (let i = 0; i < commands.length; i++) {
    try {
      execSync(commands[i], {stdio: 'inherit', encoding: 'utf8'})
    } catch (e) {
      return false
    }
  }

  return true
}

function commit(argv) {
  gitHasChanges(function(err, changes) {
    if (err || (changes && changes.length < 1))
      throw new Error('there are no changes to commit.')

    // check version
    const version = readVersion()
    const desiredLevel = argv.level
    const newVersion = semver.inc(version, desiredLevel)
    const msg = argv.message

    // update version in package.json
    fs.writeFileSync(
      './package.json',
      JSON.stringify(
        Object.assign(
          {},
          JSON.parse( fs.readFileSync('./package.json', 'utf8') ),
          {version: newVersion}
        ),
        null,
        2
      )
    )

    const result = commitChanges(newVersion, msg)
    if (!result)
      throw new Error('git command error.')

    return true
  })

}

cli
  .usage('Usage: npm run commit [level] "message"')
  .command(
    'commit',
    'Commits changes to a remote repo.',
    {
      level: {
        alias: 'l',
        describe: 'The semver compatible level of the commit.',
        choices: ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'],
        demandOption: true
      },
      message: {
        alias: 'm',
        describe: 'A commit message.',
        demandOption: true
      }
    },
    commit
  )

cli.parse(process.argv.slice(2))
