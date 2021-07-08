module.exports = {
  replace: {
    type: 'boolean',
    describe: 'Overwrite existing files'
  },
  stateNamespace: {
    type: 'string',
    alias: ['state'],
    describe: `State namespace of combined reducer. Defaults to current directory name`,
    demandOption: true
  },
  props: {
    type: 'array',
    describe: 'List of props.'
  },
  mapProps: {
    type: 'array',
    describe:
      'List of props to add to mapStateToProps. Assumes that props also exist on state.'
  },
  dispatchProps: {
    type: 'array',
    describe: 'List of function props.'
  },
  actionTypes: {
    type: 'array',
    describe: 'List of actionType:stateProp tuples to map.'
  },
  testsOnly: {
    type: 'boolean',
    describe: 'Creates just the tests.',
    default: false
  },
  magic: {
    type: 'boolean',
    alias: 'xoxo',
    describe: 'Creates or updates action types, including tests.'
  },
  withActionTypes: {
    type: 'boolean',
    describe: 'Creates or updates action types, including tests.'
  },
  withReducer: {
    type: 'boolean',
    describe:
      'Create or update reducer initial state and cases, including tests.'
  }
};
