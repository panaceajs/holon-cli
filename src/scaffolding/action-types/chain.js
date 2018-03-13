const { resolve } = require('path');
const processStreams = require('../../utils/stream-sequence');
const actionTypesTransform = require('./');
const actionsTransform = require('../actions');
const reducerTransform = require('../reducer');
const containerTransform = require('../container');
const componentTransform = require('../component');

module.exports = argv => {
  const {
    stateNamespace,
    magic,
    testsOnly,
    withActions,
    withReducer,
    withContainer,
    withCommponent
  } = argv;

  const options = {
    ...argv,
    name: stateNamespace,
    cwd: resolve(process.cwd(), stateNamespace)
  };

  const tasks = [];

  if (!testsOnly) {
    tasks.push(actionTypesTransform);
  }
  //   tasks.push(createActionsTests);

  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(actionsTransform);
    }
    // tasks.push(createOrUpdateActionTypeTests(argv));
  }

  if (magic || withReducer) {
    if (!testsOnly) {
      tasks.push(reducerTransform);
    }
    //   tasks.push(createOrUpdateReducerTests(argv));
  }

  //   return merge2(tasks.map(task => task(argv)));
  if (magic || withContainer) {
    if (!testsOnly) {
      tasks.push(containerTransform);
    }
    //   tasks.push(createOrUpdateReducerTests(argv));
  }

  if (magic || withCommponent) {
    if (!testsOnly) {
      tasks.push(componentTransform);
    }
    //   tasks.push(createOrUpdateReducerTests(argv));
  }

  return processStreams(options, tasks);
};
