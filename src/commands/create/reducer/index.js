const vfs = require('vinyl-fs');
const { basename } = require('path');
const multistream = require('multistream');
const { fancyFileLog } = require('../../../lib/file-log');
const template = require('../../../lib/vfs/template');
const {
  toVariableName,
  toUpperCaseVariableName
} = require('../../../lib/strings');
const actionsModule = require('../actions');

exports.command = 'create-reducer';

exports.describe =
  'Creates redux reducer, action creators and action types with tests in the current directory.';

exports.builder = yargs =>
  yargs
    .option({
      actionTypes: {
        type: 'array',
        alias: 'a',
        describe: 'List of actions, separated by `, `.'
      },
      stateNamespace: {
        type: 'string',
        alias: ['s', 'state'],
        describe: `State namespace of combined reducer. Defaults to current directory name`,
        default: basename(process.cwd())
      },
      reducerOnly: {
        type: 'boolean',
        alias: 'r',
        describe:
          'Creates just the reducer. (Does not create action creators and action types)',
        default: false
      },
      testsOnly: {
        type: 'boolean',
        alias: 't',
        describe:
          'Creates just the reducer tests. (Does not create tests for action creators and action types)',
        default: false
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      actionTypes: actionTypes => actionTypes.map(toVariableName)
    })
    .example(
      '$0 create-reducer',
      `Creates reducer, action creators and action types with tests in \`./\`.`
    )
    .example(
      '$0 create-reducer --actionTypes first, second, third',
      `Creates reducer, action creators and action types with tests with \`first\`, \`second\` and \`third\` as action types in ./store.`
    )
    .example(
      '$0 create-reducer --stateNamespace login',
      `Creates reducer, action creators and action types with tests in ./store, assumes \`login\` as state namespace.`
    )
    .example(
      '$0 create-reducer --reducerOnly',
      `Creates reducer with tests in \`./store/reducer\`.`
    )
    .example(
      '$0 create-reducer --testsOnly',
      `Creates reducer tests in \`./store/__tests__\`.`
    );

const scaffold = argv => {
  const glob = argv.testsOnly
    ? '../../../../templates/reducer/**/*.spec.js'
    : '../../../../templates/reducer/**/*.js';

  return vfs
    .src(glob, { cwd: __dirname })
    .pipe(
      template({
        paths: { cwd: process.cwd(), cwdDir: basename(process.cwd()) },
        reducer: {
          ...argv,
          defaultActionTypes: ['aRandomAction', 'anotherRandomAction']
        }
      })
    )
    .pipe(vfs.dest(`./`, { cwd: process.cwd() }))
    .pipe(fancyFileLog());
};

exports.handler = argv => {
  if (argv.testsOnly || argv.reducerOnly) {
    return scaffold(argv);
  }

  return multistream([scaffold(argv), actionsModule.handler(argv)]);
};
