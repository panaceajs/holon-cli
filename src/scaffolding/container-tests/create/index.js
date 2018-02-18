const vfs = require('vinyl-fs');
const { basename } = require('path');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { template, dest } = require('../../../utils/vfs');

const { toUpperCaseVariableName } = require('../../../utils/strings');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  name,
  actionTypes = [],
  mapProps = [],
  stateNamespace = basename(cwd)
}) => {
  const componentName = toUpperCaseVariableName(name);
  return vfs
    .src('./templates/__tests__/*.js', {
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
      dest(`./containers/${componentName}/__tests__`, {
        cwd,
        logger,
        dryRun
      })
    );
};
