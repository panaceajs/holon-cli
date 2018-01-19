#!/usr/bin/env node
const pkg = require('../package.json');
const yargs = require('yargs');

const { argv } = yargs
  .commandDir('../src/commands', { recurse: true, exclude: /full/ })
  .demandCommand()
  .version(pkg.version)
  .help()
  .wrap(120)
  .strict()
  .epilog('copyright 2018');

console.log('123');
