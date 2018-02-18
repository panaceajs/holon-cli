const merge2 = require('merge2');
const createActionTypes = require('./');
const createActionTypeTests = require('../../action-types-tests/create');
const createOrUpdateActions = require('../../actions-tests/create-or-update');
const createOrUpdateActionsTests = require('../../actions-tests/create-or-update');

module.exports = argv => {
  const { testsOnly, magic, withActions } = argv;

  const tasks = [];

  if (!testsOnly) {
    tasks.push(createActionTypes);
  }
  tasks.push(createActionTypeTests);

  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(createOrUpdateActions(argv));
    }
    tasks.push(createOrUpdateActionsTests(argv));
  }

  return merge2(tasks.map(task => task(argv)));
};
