const merge2 = require('merge2');

const updateContainerTests = require('./');

module.exports = argv => {
  const tasks = [updateContainerTests];

  return merge2(tasks.map(task => task(argv)));
};
