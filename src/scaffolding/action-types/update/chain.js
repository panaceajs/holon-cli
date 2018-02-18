const merge2 = require('merge2');
const updateActionTypes = require('./');
const createOrUpdateActionTypeTests = require('../../action-types-tests/create-or-update');
const createOrUpdateActions = require('../../actions-tests/create-or-update');
const createOrUpdateActionsTests = require('../../actions-tests/create-or-update');

module.exports = argv => {
  const { testsOnly, magic, withActions } = argv;
  const tasks = [];

  if (!testsOnly) {
    tasks.push(updateActionTypes);
  }
  tasks.push(createOrUpdateActionTypeTests(argv));

  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(createOrUpdateActions(argv));
    }
    tasks.push(createOrUpdateActionsTests(argv));
  }

  return merge2(tasks.map(task => task(argv)));
};
