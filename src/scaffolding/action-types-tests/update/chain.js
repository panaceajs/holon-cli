const merge2 = require('merge2');
const updateActionTypeTests = require('./');

module.exports = argv => {
  const tasks = [updateActionTypeTests];

  return merge2(tasks.map(task => task(argv)));
};
