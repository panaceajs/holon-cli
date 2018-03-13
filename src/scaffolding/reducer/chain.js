const { resolve } = require('path');
const processStreams = require('../../utils/stream-sequence');
const reducerTransform = require('./');
const actionsTransform = require('../actions');
const actionTypesTransform = require('../action-types');
const componentTransform = require('../component');
const containerTransform = require('../container');

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
  //   tasks.push(reducerTransformTests);

  if (magic || withActionTypes) {
    if (!testsOnly) {
      tasks.push(actionTypesTransform);
    }
    // tasks.push(actionTypesTransformTests);
  }
  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(actionsTransform);
    }
    // tasks.push(actionTypesTransformTests);
  }

  if (magic || withComponent) {
    if (!testsOnly) {
      tasks.push(componentTransform);
    }
    // tasks.push(actionTypesTransformTests);
  }

  if (magic || withContainer) {
    if (!testsOnly) {
      tasks.push(containerTransform);
    }
    // tasks.push(actionTypesTransformTests);
  }

  return processStreams(options, tasks);
};
