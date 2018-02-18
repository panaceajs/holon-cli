const vfs = require('vinyl-fs');
const { basename } = require('path');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../../utils/logger');
const { template, dest } = require('../../../../utils/vfs');

const { toUpperCaseVariableName } = require('../../../../utils/strings');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  name,
  props = [],
  dispatchProps = [],
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
        component: {
          componentName,
          props,
          dispatchProps,
          stateNamespace
        }
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest(`./components/${componentName}`, { cwd, logger, dryRun }));
};
