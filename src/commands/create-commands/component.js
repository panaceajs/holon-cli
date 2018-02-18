const {
  toUpperCaseVariableName,
  toVariableName
} = require('../../utils/strings');

const createComponentChain = require('../../scaffolding/component/create/chain');

exports.command = 'component <name>';

exports.describe = 'Create react stateless functional component';

exports.builder = yargs =>
  yargs
    .option({
      props: {
        type: 'array',
        describe: 'List of props.'
      },
      dispatchProps: {
        type: 'array',
        describe: 'List of function props.'
      },
      mui: {
        type: 'boolean',
        describe:
          'Create a material-ui component, wrapped in a `withStyles` hoc.'
      },
      testsOnly: {
        type: 'boolean',
        alias: 't',
        describe: 'Creates just the tests.',
        default: false
      }
    })
    .example(
      `$ holon create component YourComponent
// creates a component in ./components/YourComponent/index.js
adasd`
    )
    .coerce({
      name: toUpperCaseVariableName,
      props: props => props.map(toVariableName),
      dispatchProps: props => props.map(toVariableName)
    });

exports.handler = argv => createComponentChain(argv);
