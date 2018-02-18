const {
  toUpperCaseVariableName,
  toActionStates
} = require('../../utils/strings');

const updateContainerChain = require('../../scaffolding/action-types-tests/update/chain');

exports.command = 'action-types-tests';

exports.describe = 'Updates action type tests.';

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
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      actionTypes: toActionStates
    });

exports.handler = argv => updateContainerChain(argv);
