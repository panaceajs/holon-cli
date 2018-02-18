const {
  toUpperCaseVariableName,
  toActionStates
} = require('../../utils/strings');

const createContainerTestsChain = require('../../scaffolding/container-tests/create/chain');

exports.command = 'container-tests <name>';

exports.describe = 'Create react redux container test.';

exports.builder = yargs =>
  yargs
    .option({
      stateNamespace: {
        type: 'string',
        alias: ['s', 'state'],
        describe: `State namespace of combined reducer. Defaults to current directory name`,
        demandOption: true
      },
      actionTypes: {
        type: 'array',
        describe: 'List of actionType:stateProp tuples to map.'
      },
      mapProps: {
        type: 'array',
        alias: 'm',
        describe:
          'List of props to add to mapStateToProps. Assumes that props also exist on state.'
      },
      mui: {
        type: 'boolean',
        describe: 'Create tests for material-ui component.'
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      actionTypes: toActionStates
    });

exports.handler = argv => createContainerTestsChain(argv);
