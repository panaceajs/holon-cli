const merge2 = require('merge2');
const createActionTypes = require('./');

module.exports = argv => {
  const tasks = [createActionTypes];

  return merge2(tasks.map(task => task(argv)));
};
