const {
  toUpperCaseVariableName,
  toVariableName
} = require('../../utils/strings');

const updateComponentChain = require('../../scaffolding/component/update/chain');

exports.command = 'component <name>';

exports.describe = 'Updates react stateless functional component';

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
          'Updates a material-ui component, wrapped in a `withStyles` hoc.'
      },
      testsOnly: {
        type: 'boolean',
        alias: 't',
        describe: 'Creates just the tests.',
        default: false
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      props: props => props.map(toVariableName),
      dispatchProps: props => props.map(toVariableName)
    });

exports.handler = argv => updateComponentChain(argv);
