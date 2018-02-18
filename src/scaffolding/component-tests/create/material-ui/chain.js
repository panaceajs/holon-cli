const merge2 = require('merge2');

const createComponentTests = require('./');

module.exports = argv => {
  const tasks = [createComponentTests];

  return merge2(tasks.map(task => task(argv)));
};
