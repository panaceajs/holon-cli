const vfs = require('vinyl-fs');
const file = require('gulp-file');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../utils/logger');
const { babel, dest } = require('../../utils/vfs');
const { resolve } = require('path');

const exists = require('../../utils/exists');
const { toUpperCaseVariableName } = require('../../utils/strings');
const addImports = require('../../babel-transforms/add-imports');
const componentDefaultExport = require('../../babel-transforms/component-default-export');
const completeProps = require('../../babel-transforms/complete-props');
const componentExample = require('../../babel-transforms/component-example');

module.exports = ({
  replace,
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  name,
  actionTypes = {},
  props = [],
  mapProps = [],
  dispatchProps = [],
  withStyles
}) => {
  const allProps = [...props, ...Object.values(actionTypes), ...mapProps];
  const allDispatchProps = [...dispatchProps, ...Object.keys(actionTypes)];

  const componentName = toUpperCaseVariableName(name);

  return (replace ||
  !exists(resolve(cwd, 'components', componentName, 'index.js'))
    ? file('index.js', '', { src: true })
    : vfs.src(`components/${componentName}/index.js`, { cwd, allowEmpty: true })
  )
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [addImports, { imports: { react: [{ default: 'React' }] } }],
          [componentDefaultExport],
          [completeProps, { props: allProps, dispatchProps: allDispatchProps }]
        ]
      })
    )
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            componentExample,
            {
              props: allProps,
              dispatchProps: allDispatchProps,
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
