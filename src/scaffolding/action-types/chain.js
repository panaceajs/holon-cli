const { resolve } = require('path');
const processStreams = require('../../utils/stream-sequence');
const actionTypesTransform = require('./');
const actionTypesTestsTransform = require('../action-types-tests');
const actionsTransform = require('../actions');
const actionsTestsTransform = require('../actions-tests');
const reducerTransform = require('../reducer');
const containerTransform = require('../container');
const componentTransform = require('../component');
const componentTestsTransform = require('../component-tests');

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
  tasks.push(actionTypesTestsTransform);

  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(actionsTransform);
    }
    tasks.push(actionsTestsTransform);
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

  if (magic || withCommponent) {
    if (!testsOnly) {
      tasks.push(componentTransform);
    }
    tasks.push(componentTestsTransform);
  }

  return processStreams(options, tasks);
};