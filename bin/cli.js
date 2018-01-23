#!/usr/bin/env node
const pkg = require('../package.json');
const yargs = require('yargs');

const { argv } = yargs
  .commandDir('../src/commands', {
    recurse: true,
    exclude: /full/
  })
  .demandCommand()
  .pkgConf('holon')
  .version(pkg.version)
  .help()
  .alias('help', 'h')
  .alias('version', 'v')
  .wrap(120)
  .completion(
    'completion',
    'Enable bash-completion shortcuts for commands and options.'
  )
  .epilog('copyright 2018');
