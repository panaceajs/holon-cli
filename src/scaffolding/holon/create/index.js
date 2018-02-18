const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const { basename } = require('path');
const defaultLogger = require('../../../utils/logger');
const { template, dest } = require('../../../utils/vfs');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  holonName,
  magic,
  withLayout,
  withReducer,
  withSagas,
  withComponent,
  withContainer,
  componentName,
  stateNamespace = basename(cwd),
  dispatchOnMount = {}
}) =>
  vfs
    .src('./templates/*.js', {
      cwd: __dirname,
      allowEmpty: true
    })
    .pipe(
      template({
        paths: { cwd, cwdDir: basename(cwd) },
        holon: {
          holonName,
          stateNamespace,
          magic,
          withLayout,
          withComponent,
          withContainer,
          withReducer,
          withSagas,
          componentName,
          dispatchOnMount
        }
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest(`./`, {
        cwd,
        logger,
        dryRun
      })
    );
