const { resolve } = require('path');
const snapshot = require('../../../../utils/task-snapshot');
const task = require('../');

describe('action-types', () => {
  it('should create action types in `action-types/index.js`', async () => {
    await expect(
      snapshot(task, {
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
  it('should create action types in `other-dir/action-types/index.js`', async () => {
    await expect(
      snapshot(task, {
        cwd: resolve('other-dir'),
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
});
