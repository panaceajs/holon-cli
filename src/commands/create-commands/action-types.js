const {
  toUpperCaseVariableName,
  toActionStates
} = require('../../utils/strings');

const createContainerChain = require('../../scaffolding/action-types/create/chain');

exports.command = 'action-types';

exports.describe = 'Creates action types and tests.';

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
        describe: 'List of actionType:stateProp tuples to map.',
        demandOption: true
      },
      magic: {
        type: 'boolean',
        alias: 'xoxo',
        describe: 'Creates or updates actions, including tests.'
      },
      withActions: {
        type: 'boolean',
        alias: 'm',
        describe: 'Creates or updates actions, including tests.'
      },
      withReducer: {
        type: 'boolean',
        describe:
          'Create or update reducer initial state and cases, including tests.'
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
      actionTypes: toActionStates
    });

exports.handler = argv => {
  console.log('hello');

  return createContainerChain(argv);
};
