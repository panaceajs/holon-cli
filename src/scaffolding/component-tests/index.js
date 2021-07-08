const vfs = require('vinyl-fs');
const file = require('gulp-file');
const { resolve } = require('path');
const eslint = require('gulp-eslint');

const defaultLogger = require('../../utils/logger');
const { toUpperCaseVariableName } = require('../../utils/strings');
const { babel, dest } = require('../../utils/vfs');
const exists = require('../../utils/exists');

const addImports = require('../../babel-transforms/add-imports');
const componentTestsDescribe = require('../../babel-transforms/component-tests-describe');
const componentTests = require('../../babel-transforms/component-tests');

module.exports = ({
  replace,
  name,
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes = {},
  props = [],
  mapProps = [],
  dispatchProps = []
}) => {
  const allProps = [...props, ...Object.values(actionTypes), ...mapProps];
  const allDispatchProps = [...dispatchProps, ...Object.keys(actionTypes)];

  const componentName = toUpperCaseVariableName(name);

  return (replace ||
  !exists(
    resolve(cwd, 'components', componentName, '__tests__', 'index.spec.js')
  )
    ? file('index.spec.js', '', { src: true })
    : vfs.src(`components/${componentName}/__tests__/index.spec.js`, {
        cwd,
        allowEmpty: true
      })
  )
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            addImports,
            {
              imports: {
                react: [{ default: 'React' }],
                enzyme: ['shallow'],
                [`../`]: [{ default: componentName }]
              }
            }
          ],
          [componentTestsDescribe],
          [
            componentTests,
            {
              name,
              props: allProps,
              dispatchProps: allDispatchProps
            }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest(`components/${componentName}/__tests__/`, { cwd, logger, dryRun })
    );
};
