const { resolve } = require('path');
const processStreams = require('../../utils/stream-sequence');
const componentTransform = require('./');
const componentTestsTransform = require('../component-tests');
const containerTransform = require('../container');
const containerTestsTransform = require('../container-tests');
const actionsTransform = require('../actions');
const actionsTestsTransform = require('../actions-tests');
const actionTypesTransform = require('../action-types');
const actionTypesTestsTransform = require('../action-types-tests');
const reducerTransform = require('../reducer');
const reducerTestsTransform = require('../reducer-tests');

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
  tasks.push(componentTestsTransform);

  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(actionsTransform);
    }
    tasks.push(actionsTestsTransform);
  }
  if (magic || withContainer) {
    if (!testsOnly) {
      tasks.push(containerTransform);
    }
    tasks.push(containerTestsTransform);
  }
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

  return processStreams(options, tasks);
};
