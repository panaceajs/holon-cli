const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { template, dest } = require('../../../utils/vfs');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  holonName,
  magic,
  withComponent,
  componentName
}) =>
  vfs
    .src('./templates/*.js', {
      cwd: __dirname,
      allowEmpty: true
    })
    .pipe(
      template({
        layout: {
          holonName,
          magic,
          withComponent,
          componentName
        }
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest(`./layouts/${holonName}Layout`, {
        cwd,
        logger,
        dryRun
      })
    );
