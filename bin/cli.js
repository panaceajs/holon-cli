#!/usr/bin/env node
const pkg = require('../package.json');
const yargs = require('yargs');
const pinoColada = require('pino-colada');
const pino = require('pino');
const eventEmitter = require('events').EventEmitter;

const colada = pinoColada();
colada.pipe(process.stdout);

// uhoh, this is not so good eh

// eslint-disable-next-line
eventEmitter.prototype._maxListeners = 100;

const pinoInstance = pino(colada);
// eslint-disable-next-line
const { argv } = yargs
  .commandDir('../src/commands', {
    exclude: /full/
  })
  .demandCommand()
  .config({
    logger: {
      ...['info', 'warn', 'error', 'debug', 'trace'].reduce(
        (logTypes, current) => ({
          ...logTypes,
          [current]: pinoInstance[current].bind(pinoInstance)
        }),
        {}
      )
    }
  })
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
