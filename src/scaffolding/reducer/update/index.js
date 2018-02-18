const vfs = require('vinyl-fs');
const { basename } = require('path');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { babel, dest } = require('../../../utils/vfs');

const actionTypeImports = require('../../../babel-transforms/action-type-imports');
const reducerInitialState = require('../../../babel-transforms/reducer-initial-state');
const reducerCases = require('../../../babel-transforms/reducer-cases');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes,
  stateNamespace = basename(cwd)
}) =>
  vfs
    .src('store/*.js', { cwd })
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            actionTypeImports,
            {
              actionTypes: actionTypes || {},
              targetPath: '../action-types'
            }
          ],
          [
            reducerInitialState,
            { actionTypes: actionTypes || {}, stateNamespace }
          ],
          [reducerCases, { actionTypes: actionTypes || {} }]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest('./store', {
        cwd,
        logger,
        dryRun
      })
    );