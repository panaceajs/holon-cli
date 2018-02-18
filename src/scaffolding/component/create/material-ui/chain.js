const merge2 = require('merge2');

const createComponent = require('./');
const createComponentTests = require('../../../component-tests/create');

module.exports = argv => {
  const { testsOnly } = argv;
  const tasks = [];
  if (!testsOnly) {
    tasks.push(createComponent);
  }
  tasks.push(createComponentTests);

  return merge2(tasks.map(task => task(argv)));
};
