const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { babel, dest } = require('../../../utils/vfs');

const actionTypeImports = require('../../../babel-transforms/action-type-imports');
const actionTypesTests = require('../../../babel-transforms/action-types-tests');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes,
  stateNamespace
}) => {
  console.log('d', dryRun);
  return vfs
    .src('action-types/__tests__/*.js', { cwd })
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            actionTypeImports,
            {
              actionTypes: actionTypes || [],
              targetPath: '../',
              stateNamespace
            }
          ],
          [
            actionTypesTests,
            {
              actionTypes: actionTypes || [],
              stateNamespace
            }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest('./action-types/__tests__', { cwd, logger, dryRun }));
};
