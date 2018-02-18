const vfs = require('vinyl-fs');
const { basename } = require('path');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { template, dest } = require('../../../utils/vfs');

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
        reducer: {
          actionTypes,
          stateNamespace
        }
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest(`./store/__tests__`, {
        cwd,
        logger,
        dryRun
      })
    );
