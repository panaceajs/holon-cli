const camelCase = require('camel-case');
const {
  toUpperCaseVariableName,
  toActionStates
} = require('../../utils/strings');
const createHolonChain = require('../../scaffolding/holon/create/chain');

exports.command = 'holon <holonName>';

exports.describe =
  'Create holon structure. Will create optional layout, component, container, action types, actions and reducer.';

exports.builder = yargs =>
  yargs
    .option({
      stateNamespace: {
        type: 'string',
        alias: ['s', 'state'],
        describe: `State namespace of combined reducer. Defaults to current directory name`
      },
      actionTypes: {
        type: 'array',
        describe: 'List of actionType:stateProp tuples to map.'
      },
      // mapProps: {
      //   type: 'array',
      //   alias: 'm',
      //   describe:
      //     'List of props to add to mapStateToProps. Assumes that props also exist on state.'
      // },
      magic: {
        type: 'boolean',
        alias: 'xoxo',
        describe:
          'Alias for --withActions --withActionTypes --withReducer --withComponent --withContainer --withLayout.',
        implies: ['actionTypes', 'componentName']
      },
      withLayout: {
        type: 'boolean',
        describe: 'Create or update layout, including tests.'
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
      componentName: {
        type: 'string',
        describe: `Name of example component`,
        default: 'Example'
      },
      dispatchOnMount: {
        type: 'array',
        describe:
          'List of actions to dispatch on mount. Follows same pattern as action types. Will create actions and action types if --magic or --witchActions and --witchActionTypes are set.'
      },
      testsOnly: {
        type: 'boolean',
        alias: 't',
        describe: 'Creates just the tests.',
        default: false
      }
    })
    .coerce({
      holonName: toUpperCaseVariableName,
      componentName: toUpperCaseVariableName,
      actionTypes: toActionStates,
      dispatchOnMount: toActionStates
    });

exports.handler = argv => {
  const { holonName, stateNamespace } = argv;

  createHolonChain({
    ...argv,
    cwd: holonName,
    stateNamespace: stateNamespace || camelCase(holonName)
  });
};
