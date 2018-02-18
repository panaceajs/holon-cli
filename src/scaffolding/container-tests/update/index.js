const vfs = require('vinyl-fs');
const { basename, resolve } = require('path');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { babel, dest } = require('../../../utils/vfs');

const { toUpperCaseVariableName } = require('../../../utils/strings');
const actionCreatorsImports = require('../../../babel-transforms/action-creators-imports');
const mapStateAndDispatchToPropsTest = require('../../../babel-transforms/map-state-and-dispatch-to-props-test');
const reducerInitialState = require('../../../babel-transforms/reducer-initial-state');
const containerDispatchTests = require('../../../babel-transforms/container-dispatch-tests');

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
    .src('index.spec.js', {
      cwd: resolve(cwd, 'containers', componentName, '__tests__'),
      allowEmpty: true
    })
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            actionCreatorsImports,
            {
              actionTypes,
              targetPath: '../../../actions'
            }
          ],
          [
            reducerInitialState,
            {
              actionTypes,
              variableName: 'initialState',
              stateNamespace
            }
          ],
          [
            mapStateAndDispatchToPropsTest,
            {
              actionTypes,
              mapProps,
              stateNamespace
            }
          ],
          [
            containerDispatchTests,
            {
              componentName,
              actionTypes,
              mapProps,
              stateNamespace
            }
          ]
        ]
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
