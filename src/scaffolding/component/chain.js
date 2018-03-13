const { resolve } = require('path');
const processStreams = require('../../utils/stream-sequence');
const componentTransform = require('./');
const containerTransform = require('../container');
const actionsTransform = require('../actions');
const actionTypesTransform = require('../action-types');
const reducerTransform = require('../reducer');

module.exports = argv => {
  const {
    stateNamespace,
    magic,
    testsOnly,
    withContainer,
    withActions,
    withActionTypes,
    withReducer
  } = argv;

  const options = { ...argv, cwd: resolve(process.cwd(), stateNamespace) };
  const tasks = [];
  if (!testsOnly) {
    tasks.push(componentTransform);
  }
  // tasks.push(createActionsTests);

  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(actionsTransform);
    }
    // tasks.push(createOrUpdateActionTypeTests(argv));
  }
  if (magic || withContainer) {
    if (!testsOnly) {
      tasks.push(containerTransform);
    }
    // tasks.push(createOrUpdateActionTypeTests(argv));
  }
  if (magic || withActionTypes) {
    if (!testsOnly) {
      tasks.push(actionTypesTransform);
    }
    // tasks.push(createOrUpdateActionTypeTests(argv));
  }
  if (magic || withReducer) {
    if (!testsOnly) {
      tasks.push(reducerTransform);
    }
    //   tasks.push(createOrUpdateReducerTests(argv));
  }

  return processStreams(options, tasks);
};
