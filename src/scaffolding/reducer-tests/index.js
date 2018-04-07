const vfs = require('vinyl-fs');
const file = require('gulp-file');
const { resolve } = require('path');
const eslint = require('gulp-eslint');
const camelCase = require('camel-case');
const defaultLogger = require('../../utils/logger');
const { toUpperCaseVariableName } = require('../../utils/strings');
const { babel, dest } = require('../../utils/vfs');
const exists = require('../../utils/exists');

const addImports = require('../../babel-transforms/add-imports');
const reducerTestsDescribe = require('../../babel-transforms/reducer-tests-describe');
const reducerTestsInitialState = require('../../babel-transforms/reducer-tests-initial-state');
const reducerTestsCases = require('../../babel-transforms/reducer-tests-cases');
const containerTestsBeforeEach = require('../../babel-transforms/container-tests-before-each');
const componentTestsDescribe = require('../../babel-transforms/component-tests-describe');
const componentTests = require('../../babel-transforms/component-tests');
const mapStateAndDispatchToPropsTest = require('../../babel-transforms/map-state-and-dispatch-to-props-test');
const reducerInitialState = require('../../babel-transforms/reducer-initial-state');
const containerDispatchTests = require('../../babel-transforms/container-dispatch-tests');

/*

const mapStateAndDispatchToPropsTest = require('../../../babel-transforms/map-state-and-dispatch-to-props-test');
const reducerInitialState = require('../../../babel-transforms/reducer-initial-state');
const containerDispatchTests = require('../../../babel-transforms/container-dispatch-tests');

*/
module.exports = ({
  stateNamespace,
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
  const componentName = toUpperCaseVariableName(name);
  return (replace ||
  !exists(resolve(cwd, 'store', '__tests__', 'reducer.spec.js'))
    ? file('reducer.spec.js', '', { src: true })
    : vfs.src(`store/__tests__/reducer.spec.js`, {
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
                enzyme: ['shallow'],
                [`../reducer`]: [{ default: 'reducer' }],
                '../../actions': Object.keys(actionTypes).map(camelCase)
              }
            }
          ],
          [reducerTestsDescribe, { stateNamespace }],
          [reducerTestsInitialState, { stateNamespace }],
          [reducerTestsCases, { stateNamespace, actionTypes }]
          // [containerTestsBeforeEach]
          // [
          //   mapStateAndDispatchToPropsTest,
          //   {
          //     name: componentName,
          //     actionTypes,
          //     mapProps,
          //     stateNamespace
          //   }
          // ]
          // [mapStateAndDispatchToPropsTest],
          // [
          //   componentTests,
          //   {
          //     name,
          //     props: allProps,
          //     dispatchProps: allDispatchProps
          //   }
          // ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest(`store/__tests__/`, { cwd, logger, dryRun }));
};
