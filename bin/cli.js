#!/usr/bin/env node
const pkg = require('../package.json');
const yargs = require('yargs');

const { argv } = yargs
  .commandDir('../src/commands', { recurse: true })
  .demandCommand()
  .version(pkg.version)
  .help()
  .wrap(80)
  .strict()
  .epilog('copyright 2018');

console.log('123');
