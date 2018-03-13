const vfs = require('vinyl-fs');
const file = require('gulp-file');
const { resolve } = require('path');
const eslint = require('gulp-eslint');
const camelCase = require('camel-case');

const exists = require('../../utils/exists');
const defaultLogger = require('../../utils/logger');
const { babel, dest } = require('../../utils/vfs');

const addImports = require('../../babel-transforms/add-imports');
const { toUpperCaseVariableName } = require('../../utils/strings');
const mapStateAndDispatchToProps = require('../../babel-transforms/map-state-and-dispatch-to-props');
const containerDefaultExport = require('../../babel-transforms/container-default-export');

module.exports = ({
  replace,
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  name,
  actionTypes = {},
  mapProps = [],
  stateNamespace
}) => {
  const componentName = toUpperCaseVariableName(name);
  return (replace ||
  !exists(resolve(cwd, 'containers', componentName, 'index.js'))
    ? file('index.js', '', { src: true })
    : vfs.src(`containers/${componentName}/index.js`, { cwd, allowEmpty: true })
  )
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            addImports,
            {
              imports: {
                'react-redux': ['connect'],
                [`../../components/${componentName}`]: [
                  { default: componentName }
                ],
                '../../actions': Object.keys(actionTypes).map(camelCase)
              }
            }
          ],
          [containerDefaultExport, { componentName }],
          [
            mapStateAndDispatchToProps,
            {
              actionTypes,
              mapProps,
              stateNamespace,
              targetPath: '../../actions'
            }
          ]
        ]
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
