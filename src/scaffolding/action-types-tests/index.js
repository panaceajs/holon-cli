const vfs = require('vinyl-fs');
const file = require('gulp-file');
const { resolve } = require('path');
const eslint = require('gulp-eslint');
const constantCase = require('constant-case');
const defaultLogger = require('../../utils/logger');
const { babel, dest } = require('../../utils/vfs');
const exists = require('../../utils/exists');

const addImports = require('../../babel-transforms/add-imports');
const actionTypestTestsDescribe = require('../../babel-transforms/action-types-tests-describe');
const actionTypesTests = require('../../babel-transforms/action-types-tests');

module.exports = ({
  replace,
  stateNamespace,
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes = {}
}) =>
  (replace ||
  !exists(resolve(cwd, 'action-types', '__tests__', 'index.spec.js'))
    ? file('index.spec.js', '', { src: true })
    : vfs.src('action-types/__tests__/index.spec.js', { cwd, allowEmpty: true })
  )
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [actionTypestTestsDescribe],
          [
            addImports,
            {
              imports: {
                '../': Object.keys(actionTypes).map(constantCase)
              }
            }
          ],
          [
            actionTypesTests,
            {
              actionTypes,
              stateNamespace
            }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest('./action-types/__tests__', { cwd, logger, dryRun }));
