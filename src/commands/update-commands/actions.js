const {
  toUpperCaseVariableName,
  toActionStates
} = require('../../utils/strings');

const createContainerChain = require('../../scaffolding/actions/update/chain');

exports.command = 'actions';

exports.describe = 'Updates action creators and tests.';

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
        describe: 'Creates or updates action types, including tests.'
      },
      withActionTypes: {
        type: 'boolean',
        alias: 'm',
        describe: 'Creates or updates action types, including tests.'
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

exports.handler = argv => createContainerChain(argv);
