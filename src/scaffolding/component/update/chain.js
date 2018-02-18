const merge2 = require('merge2');

const updateComponent = require('./');
const createOrUpdateComponentTests = require('../../component-tests/create-or-update');

module.exports = argv => {
  const { testsOnly } = argv;
  const tasks = [];
  if (!testsOnly) {
    tasks.push(updateComponent);
  }
  tasks.push(createOrUpdateComponentTests(argv));

  return merge2(tasks.map(task => task(argv)));
};
