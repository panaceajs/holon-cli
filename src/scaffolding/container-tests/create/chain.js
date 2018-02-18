const merge2 = require('merge2');

const createContainerTests = require('./');

module.exports = argv => {
  const tasks = [createContainerTests];

  return merge2(tasks.map(task => task(argv)));
};
