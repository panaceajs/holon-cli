const vfs = require('vinyl-fs');
const file = require('gulp-file');
const { resolve } = require('path');
const eslint = require('gulp-eslint');

const defaultLogger = require('../../utils/logger');
const { babel, dest } = require('../../utils/vfs');
const exists = require('../../utils/exists');

const actionTypesTransform = require('../../babel-transforms/action-types');

module.exports = ({
  replace,
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes
}) =>
  (replace || !exists(resolve(cwd, 'action-types', 'index.js'))
    ? file('index.js', '', { src: true })
    : vfs.src('action-types/index.js', { cwd, allowEmpty: true })
  )
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
