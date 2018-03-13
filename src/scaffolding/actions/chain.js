const { resolve } = require('path');
const processStreams = require('../../utils/stream-sequence');
const actionsTransform = require('./');
const actionTypesTransform = require('../action-types');
const reducerTransform = require('../reducer');
const containerTransform = require('../container');
const componentTransform = require('../component');

module.exports = argv => {
  const {
    stateNamespace,
    magic,
    testsOnly,
    withActionTypes,
    withReducer,
    withContainer,
    withComponent
  } = argv;

  const options = {
    ...argv,
    name: 'Example',
    cwd: resolve(process.cwd(), stateNamespace)
  };

  const tasks = [];

  if (!testsOnly) {
    tasks.push(actionsTransform);
  }
  //   tasks.push(createActionsTests);

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

  if (magic || withContainer) {
    if (!testsOnly) {
      tasks.push(containerTransform);
    }
    //   tasks.push(createOrUpdateReducerTests(argv));
  }

  if (magic || withComponent) {
    if (!testsOnly) {
      tasks.push(componentTransform);
    }
    //   tasks.push(createOrUpdateReducerTests(argv));
  }

  //   return merge2(tasks.map(task => task(argv)));

  return processStreams(options, tasks);
};
