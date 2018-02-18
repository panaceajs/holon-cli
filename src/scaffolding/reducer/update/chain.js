const merge2 = require('merge2');
const updateReducer = require('./');
const createOrUpdateReducerTests = require('../../reducer-tests/create-or-update');
const createOrUpdateActions = require('../../actions/create-or-update');
const createOrUpdateActionsTest = require('../../actions-tests/create-or-update');
const createOrUpdateActionTypes = require('../../action-types/create-or-update');
const createOrUpdateActionTypesTests = require('../../action-types-tests/create-or-update');

module.exports = argv => {
  const { testsOnly, magic, withActions, withActionTypes } = argv;
  const tasks = [];

  if (!testsOnly) {
    tasks.push(updateReducer);
  }

  tasks.push(createOrUpdateReducerTests(argv));

  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(createOrUpdateActions(argv));
    }
    tasks.push(createOrUpdateActionsTest(argv));
  }

  if (magic || withActionTypes) {
    if (!testsOnly) {
      tasks.push(createOrUpdateActionTypes(argv));
    }

    tasks.push(createOrUpdateActionTypesTests(argv));
  }

  return merge2(tasks.map(task => task(argv)));
};
