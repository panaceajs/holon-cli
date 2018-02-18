const vfs = require('vinyl-fs');
const { basename } = require('path');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { dest, template } = require('../../../utils/vfs');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes = {},
  stateNamespace = basename(cwd)
}) =>
  vfs
    .src('./templates/__tests__/*.js', {
      cwd: __dirname
    })
    .pipe(
      template({
        actions: {
          actionTypes,
          stateNamespace
        }
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest(`./action-types/__tests__`, { cwd, logger, dryRun }));
