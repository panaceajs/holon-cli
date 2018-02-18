const merge2 = require('merge2');

const updateComponent = require('./');

module.exports = argv => {
  const tasks = [updateComponent];

  return merge2(tasks.map(task => task(argv)));
};
