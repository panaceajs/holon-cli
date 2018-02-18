const {
  toUpperCaseVariableName,
  toActionStates
} = require('../../utils/strings');

const createContainerChain = require('../../scaffolding/container/create/chain');

exports.command = 'container <name>';

exports.describe =
  'Create react redux container. Creates missing action types and action creators, creates missing reducer cases. Will create action types, actions and reducer if need be.';

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
      magic: {
        type: 'boolean',
        alias: 'xoxo',
        describe:
          'Creates or updates actions, action types, reducer and components, including tests.',
        implies: ['actionTypes']
      },
      withActions: {
        type: 'boolean',
        describe: 'Create or update actions, including tests.',
        implies: ['actionTypes']
      },
      withActionTypes: {
        type: 'boolean',
        describe: 'Create or update action types, including tests.',
        implies: ['actionTypes']
      },
      withReducer: {
        type: 'boolean',
        describe:
          'Create or update reducer initial state and cases, including tests.',
        implies: ['actionTypes']
      },
      withComponent: {
        type: 'boolean',
        describe: 'Create or update component, including tests.'
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
