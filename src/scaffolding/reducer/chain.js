const { resolve } = require('path');
const processStreams = require('../../utils/stream-sequence');
const reducerTransform = require('./');
const reducerTestsTransform = require('../reducer-tests');
const actionsTransform = require('../actions');
const actionsTestsTransform = require('../actions-tests');
const actionTypesTransform = require('../action-types');
const actionTypesTestsTransform = require('../action-types-tests');
const componentTransform = require('../component');
const componentTestsTransform = require('../component-tests');
const containerTransform = require('../container');
const containerTestsTransform = require('../container-tests');

module.exports = argv => {
  const {
    stateNamespace,
    magic,
    testsOnly,
    withActions,
    withActionTypes,
    withContainer,
    withComponent

    // , magic, withActionTypes, withReducer
  } = argv;

  const options = {
    ...argv,
    name: 'Example',
    cwd: resolve(process.cwd(), stateNamespace)
  };
  const tasks = [];

  if (!testsOnly) {
    tasks.push(reducerTransform);
  }
  tasks.push(reducerTestsTransform);

  if (magic || withActionTypes) {
    if (!testsOnly) {
      tasks.push(actionTypesTransform);
    }
    tasks.push(actionTypesTestsTransform);
  }
  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(actionsTransform);
    }
    tasks.push(actionsTestsTransform);
  }

  if (magic || withComponent) {
    if (!testsOnly) {
      tasks.push(componentTransform);
    }
    tasks.push(componentTestsTransform);
  }

  if (magic || withContainer) {
    if (!testsOnly) {
      tasks.push(containerTransform);
    }
    tasks.push(containerTestsTransform);
  }

  return processStreams(options, tasks);
};
