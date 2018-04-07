const { resolve } = require('path');
const processStreams = require('../../utils/stream-sequence');
const containerTransform = require('./');
const containerTestsTransform = require('../container-tests');
const actionsTransform = require('../actions');
const actionsTestsTransform = require('../actions-tests');
const actionTypesTransform = require('../action-types');
const actionTypesTestsTransform = require('../action-types-tests');

const reducerTransform = require('../reducer');
const componentTransform = require('../component');
const componentTestsTransform = require('../component-tests');

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
    tasks.push(containerTransform);
  }
  tasks.push(containerTestsTransform);

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

  if (magic || withReducer) {
    if (!testsOnly) {
      tasks.push(reducerTransform);
    }
    //   tasks.push(createOrUpdateReducerTests(argv));
  }
  if (magic || withComponent) {
    if (!testsOnly) {
      tasks.push(componentTransform);
    }
    tasks.push(componentTestsTransform);
  }

  return processStreams(options, tasks);
};
