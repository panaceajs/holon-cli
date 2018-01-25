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
const reducerModule = require('../reducer');
const { defaultActionTypes } = require('../../../globals');

exports.command = 'create-saga <name>';

exports.describe =
  'Creates redux saga, reducer, action creators and action types with tests in the current directory.';

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
      noActions: {
        type: 'boolean',
        alias: 'n',
        describe:
          'Creates just the saga. (Does not create action creators and action types)',
        default: false
      },
      testsOnly: {
        type: 'boolean',
        alias: 't',
        describe:
          'Creates just the saga tests. (Does not create tests for action creators and action types)',
        default: false
      }
    })
    .coerce({
      name: toVariableName,
      actionTypes: actionTypes => actionTypes.map(toVariableName)
    })
    .example(
      '$0 create-saga',
      `Creates saga, reducer, action creators and action types with tests in \`./\`.`
    )
    .example(
      '$0 create-saga --actionTypes first, second, third',
      `Creates saga, reducer, action creators and action types with tests with \`first\`, \`second\` and \`third\` as action types in ./store.`
    )
    .example(
      '$0 create-saga --stateNamespace login',
      `Creates saga, reducer, action creators and action types with tests in ./store, assumes \`login\` as state namespace.`
    )
    .example(
      '$0 create-saga --noActions',
      `Creates saga and reducer with tests in \`./store/reducer\`. Does not create action creators and action types.`
    )
    .example(
      '$0 create-saga --noReducer',
      `Creates saga and actions with tests in \`./store/reducer\`. Does not create reducer.`
    )
    .example(
      '$0 create-saga --testsOnly',
      `Creates reducer tests in \`./store/__tests__\`.`
    );

const scaffold = argv => {
  const glob = argv.testsOnly
    ? '../../../../templates/saga/**/*.spec.js'
    : '../../../../templates/saga/**/*.js';

  return vfs
    .src(glob, { cwd: __dirname })
    .pipe(
      template({
        paths: { cwd: process.cwd(), cwdDir: basename(process.cwd()) },
        saga: {
          ...argv,
          defaultActionTypes
        }
      })
    )
    .pipe(vfs.dest(`./sagas/${argv.name}`, { cwd: process.cwd() }))
    .pipe(fancyFileLog());
};

exports.handler = argv => {
  console.log(process.cwd());
  const handlers = [scaffold];

  if (!argv.noActions) {
    handlers.push(actionsModule.handler);
  }
  if (!argv.noReducer) {
    handlers.push(reducerModule.handler);
  }

  return multistream(handlers.map(handler => handler(argv)));
};
