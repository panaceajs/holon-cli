const vfs = require('vinyl-fs');
const { basename, resolve } = require('path');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { babel, dest } = require('../../../utils/vfs');

const { toUpperCaseVariableName } = require('../../../utils/strings');
const actionCreatorsImports = require('../../../babel-transforms/action-creators-imports');
const mapStateAndDispatchToProps = require('../../../babel-transforms/map-state-and-dispatch-to-props');

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
    .src('index.js', {
      cwd: resolve(cwd, 'containers', componentName),
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
              targetPath: '../../actions'
            }
          ],
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
