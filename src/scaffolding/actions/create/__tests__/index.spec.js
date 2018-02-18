const { resolve } = require('path');
const snapshot = require('../../../../utils/task-snapshot');
const task = require('../');

describe('actions', () => {
  it('should create actions in `actions/index.js`', async () => {
    await expect(
      snapshot(task, {
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
  it('should create actions in `other-dir/actions/index.js`', async () => {
    await expect(
      snapshot(task, {
        cwd: resolve('other-dir'),
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
});
