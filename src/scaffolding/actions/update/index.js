const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { babel, dest } = require('../../../utils/vfs');

const actionTypeImports = require('../../../babel-transforms/action-type-imports');
const actionCreators = require('../../../babel-transforms/action-creators');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes
}) =>
  vfs
    .src('actions/index.js', { cwd, allowEmpty: true })
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
            actionCreators,
            {
              actionTypes: actionTypes || {}
            }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest('./actions', { cwd, logger, dryRun }));
