const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { babel, dest } = require('../../../utils/vfs');

const { resolve } = require('path');
const { toUpperCaseVariableName } = require('../../../utils/strings');
const componentTests = require('../../../babel-transforms/component-tests');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  name,
  props = [],
  dispatchProps = [],
  withStyles,
  themePath
}) => {
  const componentName = toUpperCaseVariableName(name);
  return vfs
    .src('index.spec.js', {
      cwd: resolve(cwd, 'components', componentName, '__tests__'),
      allowEmpty: true
    })
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            componentTests,
            {
              name,
              props,
              dispatchProps,
              withStyles,
              themePath
            }
          ]
        ]
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
