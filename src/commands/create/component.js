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
        describe: 'list of props, separate by `, `',
        type: 'array'
      },
      testsOnly: {
        describe: 'creates just the test, not the component itself',
        type: 'boolean'
      },
      withStyles: {
        describe:
          'wraps the component in a withStyles hoc, uses mount instead of shallow for testing',
        type: 'boolean'
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      props: props => props.map(toVariableName)
    })
    .example('$0 create component', exports.describe)
    .example('$0 create component', exports.describe)
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
