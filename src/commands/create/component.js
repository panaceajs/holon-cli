const {
  toVariableName,
  toUpperCaseVariableName
} = require('../../lib/strings');
const vfs = require('vinyl-fs');
const template = require('../../lib/vfs-template');

exports.command = 'create-component <name>';

exports.describe =
  'creates a react stateless functional component in the current directory';

exports.builder = yargs =>
  yargs
    .option({
      props: {
        type: 'array'
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      props: props => props.map(toVariableName)
    })
    .example('$0 create component', exports.describe)
    .strict();

exports.handler = async argv => {
  console.log(argv);

  return vfs
    .src('../../../templates/create/component/**/*.js', { cwd: __dirname })
    .pipe(template({ component: { ...argv } }))
    .pipe(vfs.dest(`./${argv.name}`, { cwd: process.cwd() }));
};
