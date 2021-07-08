const { resolve } = require('path');
const processStreams = require('../../utils/stream-sequence');
const actionsTransform = require('./');
const actionsTestsTransform = require('../actions-tests');
const actionTypesTransform = require('../action-types');
const actionTypesTestsTransform = require('../action-types-tests');
const reducerTransform = require('../reducer');
const reducerTestsTransform = require('../reducer-tests');
const containerTransform = require('../container');
const containerTestsTransform = require('../container-tests');
const componentTransform = require('../component');
const componentTestsTransform = require('../component-tests');

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
  tasks.push(actionsTestsTransform);

  if (magic || withActionTypes) {
    if (!testsOnly) {
      tasks.push(actionTypesTransform);
    }
    tasks.push(actionTypesTestsTransform);
  }

  if (magic || withReducer) {
    if (!testsOnly) {
      tasks.push(reducerTransform);
    }
    tasks.push(reducerTestsTransform);
  }

  if (magic || withContainer) {
    if (!testsOnly) {
      tasks.push(containerTransform);
    }
    tasks.push(containerTestsTransform);
  }

  if (magic || withComponent) {
    if (!testsOnly) {
      tasks.push(componentTransform);
    }
    tasks.push(componentTestsTransform);
  }

  return processStreams(options, tasks);
};
