const vfs = require('vinyl-fs');
const { basename } = require('path');
const { fancyFileLog } = require('../../../lib/file-log');
const template = require('../../../lib/vfs/template');
const {
  toVariableName,
  toUpperCaseVariableName
} = require('../../../lib/strings');

exports.command = 'create-actions';

exports.describe =
  'Creates redux action creators and action-type with tests in the current directory.';

exports.builder = yargs =>
  yargs
    .option({
      names: {
        type: 'array',
        alias: 'a',
        describe: 'List of action names, separated by `, `.'
      },
      state: {
        type: 'string',
        alias: ['s', 'stateNamespace'],
        describe: `State namespace of combined reducer. Defaults to current directory name`
      },
      testsOnly: {
        type: 'boolean',
        alias: 't',
        describe:
          'Creates just the test, not the action creators and action-types itself.'
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      props: props => props.map(toVariableName),
      state: state => state || basename(process.cwd())
    })
    .example(
      '$0 create-actions',
      `Creates action creators and action-types with tests in ./actions and ./action-types.`
    )
    .example(
      '$0 create-actions --testsOnly',
      `Creates tests in ./actions/__tests__ and ./action-types/__tests__.`
    );

exports.handler = async argv => {
  const glob = argv.testsOnly
    ? '../../../../templates/actions/**/*.spec.js'
    : '../../../../templates/actions/**/*.js';

  return vfs
    .src(glob, { cwd: __dirname })
    .pipe(
      template({
        paths: { cwd: process.cwd(), cwdDir: basename(process.cwd()) },
        actions: {
          ...argv,
          defaultNames: ['aRandomAction', 'anotherRandomAction']
        }
      })
    )
    .pipe(vfs.dest(`./`, { cwd: process.cwd() }))
    .pipe(fancyFileLog());
};
