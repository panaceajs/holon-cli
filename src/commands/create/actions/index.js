const vfs = require('vinyl-fs');
const { basename } = require('path');
const { fancyFileLog } = require('../../../lib/file-log');
const template = require('../../../lib/vfs/template');
const {
  toVariableName,
  toUpperCaseVariableName
} = require('../../../lib/strings');
const { defaultActionTypes } = require('../../../globals');

exports.command = 'create-actions';

exports.describe =
  'Creates redux action creators and action-type with tests in the current directory.';

exports.builder = yargs =>
  yargs
    .option({
      actionTypes: {
        type: 'array',
        alias: ['a'],
        describe: 'List of action names, separated by `, `.'
      },
      stateNamespace: {
        type: 'string',
        alias: ['s', 'state'],
        describe: `State namespace of combined reducer. Defaults to current directory name`,
        default: basename(process.cwd())
      },
      testsOnly: {
        type: 'boolean',
        alias: 't',
        describe:
          'Creates just the test, not the action creators and action-types itself.',
        default: false
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      actionTypes: actionTypes => actionTypes.map(toVariableName)
    })
    .example(
      '$0 create-actions',
      `Creates action creators and action-types with tests in \`./actions\` and \`./action-types\`.`
    )
    .example(
      '$0 create-actions --actionTypes first, second, third',
      `Creates tests in \`./actions/__tests__\` and \`./action-types/__tests__\` with \`first\`, \`second\` and \`third\` as actin types in \`./\`.`
    )
    .example(
      '$0 create-actions --stateNamespace login',
      `Creates tests in \`./actions/__tests__\` and \`./action-types/__tests__\` in \`./\`, assumes \`login\` as state namespace.`
    )
    .example(
      '$0 create-actions --testsOnly',
      `Creates tests in \`./actions/__tests__\` and \`./action-types/__tests__\`.`
    );

exports.handler = argv => {
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
          // name: toUpperCaseVariableName(argv.name),
          // props: argv.props.map(toVariableName),
          // state: argv.state || basename(process.cwd()),
          defaultActionTypes
        }
      })
    )
    .pipe(vfs.dest(`./`, { cwd: process.cwd() }))
    .pipe(fancyFileLog());
};
