const merge2 = require('merge2');
const createActionsTests = require('./');

module.exports = argv => {
  const tasks = [createActionsTests];

  return merge2(tasks.map(task => task(argv)));
};
