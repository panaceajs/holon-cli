const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { babel, dest } = require('../../../utils/vfs');

const actionTypesTransform = require('../../../babel-transforms/action-types');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes
}) =>
  vfs
    .src('action-types/index.js', { cwd, allowEmpty: true })
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            actionTypesTransform,
            {
              actionTypes: actionTypes || []
            }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest('./action-types', { cwd, logger, dryRun }));
