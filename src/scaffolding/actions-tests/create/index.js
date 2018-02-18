const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { template, dest } = require('../../../utils/vfs');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes = {},
  stateNamespace
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
    .pipe(dest(`./actions/__tests__`, { cwd, logger, dryRun }));
