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
        describe: 'List of props, separate by `, `.',
        type: 'array'
      },
      withStyles: {
        describe:
          'Wraps the component in a `withStyles` hoc, uses mount instead of shallow for testing.',
        type: 'boolean'
      },
      testsOnly: {
        describe: 'Creates just the test, not the component itself.',
        type: 'boolean'
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      props: props => props.map(toVariableName)
    })
    .example(
      '$0 create-component YourComponent',
      `Creates a component with tests in ./YourComponent.`
    )
    .example(
      '$0 create-component YourComponent --props one, two, three',
      `Creates a component with tests in ./YourComponent with \`one\`,  \`two\` and  \`three\` as props.`
    )
    .example(
      '$0 create-component YourComponent --withStyles',
      `Creates a component with tests in ./YourComponent with a material-ui \`withStyles\` hoc.`
    )
    .example(
      '$0 create-component YourComponent --testsOnly',
      `Creates tests in ./YourComponent/__tests__.`
    )
    .strict();

exports.handler = async argv => {
  const glob = argv.testsOnly
    ? '../../../templates/create/component/**/__tests__/*.js'
    : '../../../templates/create/component/**/*.js';

  return vfs
    .src(glob, { cwd: __dirname })
    .pipe(template({ component: { ...argv } }))
    .pipe(vfs.dest(`./${argv.name}`, { cwd: process.cwd() }));
};
