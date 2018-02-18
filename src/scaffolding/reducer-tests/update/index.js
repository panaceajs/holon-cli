const vfs = require('vinyl-fs');
const { basename } = require('path');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { babel, dest } = require('../../../utils/vfs');

const actionCreatorsImports = require('../../../babel-transforms/action-creators-imports');
const reducerTests = require('../../../babel-transforms/reducer-tests');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes,
  stateNamespace = basename(cwd)
}) =>
  vfs
    .src('store/__tests__/reducer*.js', { cwd })
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            actionCreatorsImports,
            {
              actionTypes: actionTypes || [],
              targetPath: '../../actions'
            }
          ],
          [
            reducerTests,
            {
              actionTypes: actionTypes || [],
              stateNamespace
            }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest('./store/__tests__', {
        cwd,
        logger,
        dryRun
      })
    );
