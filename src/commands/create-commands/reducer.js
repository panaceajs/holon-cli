const {
  toUpperCaseVariableName,
  toActionStates
} = require('../../utils/strings');

const createReducerChain = require('../../scaffolding/reducer/create/chain');

exports.command = 'reducer';

exports.describe = 'Create reducer and tests';

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
        describe:
          'Creates or updates actions and action types, including tests.'
      },
      withActions: {
        type: 'boolean',
        describe: 'Create or update actions, including tests.'
      },
      withActionTypes: {
        type: 'boolean',
        describe: 'Create or update action types, including tests.'
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

exports.handler = argv => createReducerChain(argv);
