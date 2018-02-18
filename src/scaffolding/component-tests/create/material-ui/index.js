const vfs = require('vinyl-fs');
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
  dispatchProps = []
}) => {
  const componentName = toUpperCaseVariableName(name);

  return vfs
    .src('./templates/__tests__/*.js', {
      cwd: __dirname,
      allowEmpty: true
    })
    .pipe(
      template({
        component: {
          componentName,
          props,
          dispatchProps
        }
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest(`./components/${componentName}/__tests__`, {
        cwd,
        logger,
        dryRun
      })
    );
};
