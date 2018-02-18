const {
  toUpperCaseVariableName,
  toVariableName
} = require('../../utils/strings');

const createComponentTestsChain = require('../../scaffolding/component-tests/create/chain');

exports.command = 'component-tests <name>';

exports.describe = 'Create react stateless functional component tests';

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
        describe: 'Updates tests for material-ui component.'
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      props: props => props.map(toVariableName),
      dispatchProps: props => props.map(toVariableName)
    });

exports.handler = argv => createComponentTestsChain(argv);
