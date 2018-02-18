const merge2 = require('merge2');
const updateReducerTests = require('./');

module.exports = argv => {
  const tasks = [updateReducerTests];

  return merge2(tasks.map(task => task(argv)));
};
