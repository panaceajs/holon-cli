const vfs = require('vinyl-fs');
const path = require('path');
const template = require('../../../lib/vfs/template');
const { fancyFileLog } = require('../../../lib/file-log');
const { toVariableName } = require('../../../lib/strings');

exports.command = 'create-container <targetComponent>';

exports.describe = 'Creates a react-redux container in the current directory.';

exports.builder = yargs =>
  yargs
    .option({
      state: {
        type: 'string',
        alias: ['s', 'stateNamespace'],
        describe: `State namespace of combined reducer`
      },
      map: {
        type: 'array',
        alias: ['m', 'mapProps'],
        describe: `List of props mapped in \`mapStateToProps\`, separated by \`, \``
      },
      dispatch: {
        type: 'array',
        alias: ['d', 'dispatchProps'],
        describe: `List of prop functions mapped in \`mapDispatchToProps\`, separated by \`, \``
      },
      theme: {
        type: 'string',
        alias: 'T',
        describe: 'Path to exported createMuiTheme()',
        default: 'shared/themes'
      },
      testsOnly: {
        type: 'boolean',
        alias: 't',
        describe: 'Creates just the test, not the component itself.',
        default: false
      }
    })
    .coerce({
      targetComponent: targetComponent =>
        path.relative(process.cwd(), targetComponent),
      map: props => props.map(toVariableName),
      dispatch: props => props.map(toVariableName)
    })
    .example(
      '$0 create-container ../../components/MyComponent',
      `Creates a react-redux hoc container in \`./MyComponent\``
    )
    .example(
      '$0 create-container ../../components/MyComponent --map one, two, three',
      `Creates a react-redux hoc container with tests in \`./MyComponent\`, maps props \`one\`, \`two\` and \`three\`.`
    )
    .example(
      '$0 create-container ../../components/MyComponent --dispatch someFunction, someOtherFunction',
      `Creates a react-redux hoc container with tests in \`./MyComponent\`, maps prop functions \`someFunction\` and \`someOtherFunction\`.`
    )
    .example(
      '$0 create-container ../../components/MyComponent --stateNamespace login',
      `Creates a react-redux hoc container with tests in \`./MyComponent\`, assumes \`login\` as state namespace.`
    )
    .example(
      '$0 create-container ../../components/MyComponent --testsOnly',
      `Creates tests in \`./MyComponent\`.`
    )
    .strict();

exports.handler = async argv => {
  const name = path.basename(argv.targetComponent);

  const glob = argv.testsOnly
    ? '../../../../templates/container/**/*.spec.js'
    : '../../../../templates/container/**/*.js';

  return vfs
    .src(glob, { cwd: __dirname })
    .pipe(template({ container: { ...argv, name } }))
    .pipe(vfs.dest(`./${name}`, { cwd: process.cwd() }))
    .pipe(fancyFileLog());
};
