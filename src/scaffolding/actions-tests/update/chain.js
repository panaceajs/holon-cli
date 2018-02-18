const merge2 = require('merge2');
const updateActionsTests = require('./');

module.exports = argv => {
  const tasks = [updateActionsTests];

  return merge2(tasks.map(task => task(argv)));
};
