const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const { basename } = require('path');
const defaultLogger = require('../../../utils/logger');
const { template, dest } = require('../../../utils/vfs');

const { toUpperCaseVariableName } = require('../../../utils/strings');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  name,
  actionTypes = {},
  mapProps = [],
  stateNamespace = basename(cwd)
}) => {
  const componentName = toUpperCaseVariableName(name);
  return vfs
    .src('./templates/*.js', {
      cwd: __dirname,
      allowEmpty: true
    })
    .pipe(
      template({
        paths: { cwd, cwdDir: basename(cwd) },
        container: {
          actionTypes,
          componentName,
          mapProps,
          stateNamespace
        }
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest(`./containers/${componentName}`, {
        cwd,
        logger,
        dryRun
      })
    );
};
