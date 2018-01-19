const { toVariableName } = require('../../lib/strings');
const vfs = require('vinyl-fs');
const path = require('path');
const constantCase = require('constant-case');
const template = require('../../lib/vfs-template');

exports.command = 'create-container <targetComponent>';

exports.describe = 'Creates a react-redux container in the current directory.';

exports.builder = yargs =>
  yargs
    .option({
      mappedProps: {
        type: 'array',
        alias: 'm',
        describe: `List of props mapped in \`mapStateToProps\`, separated by \`, \``
      },
      dispatchProps: {
        type: 'array',
        alias: 'd',
        describe: `List of prop functions mapped in \`mapDispatchToProps\`, separated by \`, \``
      },
      testsOnly: {
        type: 'boolean',
        alias: 't',
        describe: 'Creates just the test, not the component itself.'
      }
    })
    .coerce({
      targetComponent: targetComponent =>
        path.relative(process.cwd(), targetComponent),
      mappedProps: props => props.map(toVariableName),
      dispatchProps: props => props.map(toVariableName)
    })
    .example(
      '$0 create container ../../components/MyComponent',
      `Creates a react-redux hoc container in \`./MyComponent\``
    )
    .example(
      '$0 create container ../../components/MyComponent --mappedProps one, two, three',
      `Creates a react-redux hoc container with tests in \`./MyComponent\`, maps props \`one\`, \`two\` and \`three\`.`
    )
    .example(
      '$0 create container ../../components/MyComponent --dispatchProps someFunction, someOtherFunction',
      `Creates a react-redux hoc container with tests in \`./MyComponent\`, maps prop functions \`someFunction\` and \`someOtherFunction\`.`
    )
    .example(
      '$0 create container ../../components/MyComponent --testsOnly',
      `Creates tests in \`./MyComponent\`.`
    )
    .strict();

exports.handler = async argv => {
  const name = path.basename(argv.targetComponent);
  console.log({ ...argv, name });

  const glob = argv.testsOnly
    ? '../../../templates/create/container/**/__tests__/*.js'
    : '../../../templates/create/container/**/*.js';

  return vfs
    .src(glob, { cwd: __dirname })
    .pipe(template({ container: { ...argv, name }, utils: { constantCase } }))
    .pipe(vfs.dest(`./${name}`, { cwd: process.cwd() }));
};
