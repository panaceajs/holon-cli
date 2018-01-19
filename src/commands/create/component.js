const {
  toVariableName,
  toUpperCaseVariableName
} = require('../../lib/strings');
const vfs = require('vinyl-fs');
const template = require('../../lib/vfs-template');

exports.command = 'create-component <name>';

exports.describe =
  'Creates a react stateless functional component with tests in the current directory.';

exports.builder = yargs =>
  yargs
    .option({
      props: {
        type: 'array',
        alias: 'p',
        describe: 'List of props, separated by `, `.'
      },
      withStyles: {
        type: 'boolean',
        alias: 'w',
        describe:
          'Wraps the component in a `withStyles` hoc, uses mount instead of shallow for testing.'
      },
      testsOnly: {
        type: 'boolean',
        alias: 't',
        describe: 'Creates just the test, not the component itself.'
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      props: props => props.map(toVariableName)
    })
    .example(
      '$0 create-component MyComponent',
      `Creates a component with tests in ./MyComponent.`
    )
    .example(
      '$0 create-component MyComponent --props one, two, three',
      `Creates a component with tests in ./MyComponent with \`one\`,  \`two\` and  \`three\` as props.`
    )
    .example(
      '$0 create-component MyComponent --withStyles',
      `Creates a component with tests in ./MyComponent with a material-ui \`withStyles\` hoc.`
    )
    .example(
      '$0 create-component MyComponent --testsOnly',
      `Creates tests in ./MyComponent/__tests__.`
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
