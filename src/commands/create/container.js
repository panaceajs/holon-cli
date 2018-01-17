const { toVariableName } = require('../../lib/strings');
const vfs = require('vinyl-fs');
const path = require('path');
const constantCase = require('constant-case');
const template = require('../../lib/vfs-template');

exports.command = 'create-container <targetComponent>';

exports.describe = 'creates a react-redux container in the current directory';

exports.builder = yargs =>
  yargs
    .option({
      mappedProps: {
        type: 'array'
      },
      dispatchProps: {
        type: 'array'
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
      exports.describe
    )
    .strict();

exports.handler = async argv => {
  const name = path.basename(argv.targetComponent);
  console.log({ ...argv, name });
  return vfs
    .src('../../../templates/create/container/**/*.js', { cwd: __dirname })
    .pipe(template({ container: { ...argv, name }, utils: { constantCase } }))
    .pipe(vfs.dest(`./${name}`, { cwd: process.cwd() }));
};
