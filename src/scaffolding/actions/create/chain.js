const merge2 = require('merge2');
const createActions = require('./');
const createActionsTests = require('../../actions-tests/create');
const createOrUpdateActionTypes = require('../../action-types/create-or-update');
const createOrUpdateActionTypeTests = require('../../action-types-tests/create-or-update');
const createOrUpdateReducer = require('../../reducer/create-or-update');
const createOrUpdateReducerTests = require('../../reducer-tests/create-or-update');

module.exports = argv => {
  const { testsOnly, magic, withActionTypes, withReducer } = argv;
  const tasks = [];
  if (!testsOnly) {
    tasks.push(createActions);
  }
  tasks.push(createActionsTests);

  if (magic || withActionTypes) {
    if (!testsOnly) {
      tasks.push(createOrUpdateActionTypes(argv));
    }
    tasks.push(createOrUpdateActionTypeTests(argv));
  }
  if (magic || withReducer) {
    if (!testsOnly) {
      tasks.push(createOrUpdateReducer(argv));
    }
    tasks.push(createOrUpdateReducerTests(argv));
  }

  return merge2(tasks.map(task => task(argv)));
};