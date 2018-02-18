const {
  toUpperCaseVariableName,
  toVariableName
} = require('../../utils/strings');

const updateComponentTestsChain = require('../../scaffolding/component-tests/update/chain');

exports.command = 'component-tests <name>';

exports.describe = 'Update react stateless functional component tests';

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
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      props: props => props.map(toVariableName),
      dispatchProps: props => props.map(toVariableName)
    });

exports.handler = argv => updateComponentTestsChain(argv);
