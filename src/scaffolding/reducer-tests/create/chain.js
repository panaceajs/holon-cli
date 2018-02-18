const merge2 = require('merge2');
const createReducerTests = require('./');

module.exports = argv => {
  const tasks = [createReducerTests];

  return merge2(tasks.map(task => task(argv)));
};
