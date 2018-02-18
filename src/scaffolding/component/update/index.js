const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { babel, dest } = require('../../../utils/vfs');

const { resolve } = require('path');
const { toUpperCaseVariableName } = require('../../../utils/strings');
const completeProps = require('../../../babel-transforms/complete-props');
const componentExample = require('../../../babel-transforms/component-example');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  name,
  props = [],
  dispatchProps = [],
  withStyles
}) => {
  const componentName = toUpperCaseVariableName(name);
  return vfs
    .src('index.js', {
      cwd: resolve(cwd, 'components', componentName),
      allowEmpty: true
    })
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [[completeProps, { props, dispatchProps }]]
      })
    )
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            componentExample,
            {
              props,
              dispatchProps,
              componentName,
              withStyles
            }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest(`./components/${componentName}`, {
        cwd,
        logger,
        dryRun
      })
    );
};
