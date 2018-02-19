const { basename } = require('path');
const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { template, dest } = require('../../../utils/vfs');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes = {}
}) =>
  vfs
    .src('./templates/*.js', {
      cwd: __dirname
    })
    .pipe(
      template({
        paths: { cwd, cwdDir: basename(cwd) },
        reducer: {
          actionTypes
        }
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest(`./store`, {
        cwd,
        logger,
        dryRun
      })
    );
