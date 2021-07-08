const { resolve } = require('path');
const snapshot = require('../../../utils/task-snapshot');
const task = require('../');

describe('action-types', () => {
  it('should create action types in `action-types/index.js`', async () => {
    await expect(
      snapshot(task, {
        create: true,
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });

  it('should create action types in `other-dir/action-types/index.js`', async () => {
    await expect(
      snapshot(task, {
        create: true,
        cwd: resolve('other-dir'),
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });

  it('should update action types in `./action-types/index.js`', async () => {
    await expect(
      snapshot(task, {
        cwd: resolve(__dirname, '__fixtures__'),
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
});
