const { resolve } = require('path');
const processStreams = require('../../utils/stream-sequence');
const container = require('./');
const actions = require('../actions');
const actionTypesHandler = require('../action-types');
const reducer = require('../reducer');
const component = require('../component');

module.exports = argv => {
  const {
    stateNamespace,
    magic,
    testsOnly,
    withActions,
    withActionTypes,
    withComponent,
    withReducer
  } = argv;

  const options = { ...argv, cwd: resolve(process.cwd(), stateNamespace) };

  const tasks = [];

  if (!testsOnly) {
    tasks.push(container);
  }
  //   tasks.push(createActionsTests);

  if (magic || withActionTypes) {
    if (!testsOnly) {
      tasks.push(actionTypesHandler);
    }
    // tasks.push(createOrUpdateActionTypeTests(argv));
  }

  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(actions);
    }
    // tasks.push(createOrUpdateActionTypeTests(argv));
  }

  if (magic || withReducer) {
    if (!testsOnly) {
      tasks.push(reducer);
    }
    //   tasks.push(createOrUpdateReducerTests(argv));
  }
  if (magic || withComponent) {
    if (!testsOnly) {
      tasks.push(component);
    }
    //   tasks.push(createOrUpdateReducerTests(argv));
  }

  return processStreams(options, tasks);
};
