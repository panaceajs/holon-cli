const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { babel, dest } = require('../../../utils/vfs');

const actionTypeImports = require('../../../babel-transforms/action-type-imports');
const actionCreatorsImports = require('../../../babel-transforms/action-creators-imports');
const actionCreatorsTests = require('../../../babel-transforms/action-creators-tests');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes,
  stateNamespace
}) =>
  vfs
    .src('actions/__tests__/*.spec.js', { cwd })
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            actionTypeImports,
            {
              actionTypes: actionTypes || [],
              targetPath: '../../action-types'
            }
          ],
          [
            actionCreatorsImports,
            {
              actionTypes: actionTypes || [],
              targetPath: '../'
            }
          ],
          [
            actionCreatorsTests,
            {
              actionTypes: actionTypes || [],
              stateNamespace
            }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest('./actions/__tests__', { cwd, logger, dryRun }));
