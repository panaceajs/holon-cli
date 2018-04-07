const vfs = require('vinyl-fs');
const file = require('gulp-file');
const { resolve } = require('path');
const eslint = require('gulp-eslint');
const camelCase = require('camel-case');
const constantCase = require('constant-case');
const defaultLogger = require('../../utils/logger');
const { babel, dest } = require('../../utils/vfs');
const exists = require('../../utils/exists');

const addImports = require('../../babel-transforms/add-imports');
const actionsTestsDescribe = require('../../babel-transforms/actions-tests-describe');
const actionsTests = require('../../babel-transforms/actions-tests');

module.exports = ({
  replace,
  stateNamespace,
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes = {}
}) =>
  (replace || !exists(resolve(cwd, 'actions', '__tests__', 'index.spec.js'))
    ? file('index.spec.js', '', { src: true })
    : vfs.src('actions/__tests__/index.spec.js', { cwd, allowEmpty: true })
  )
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [actionsTestsDescribe],
          [
            addImports,
            {
              imports: {
                '../': Object.keys(actionTypes).map(camelCase),
                '../../action-types': Object.keys(actionTypes).map(constantCase)
              }
            }
          ],
          [
            actionsTests,
            {
              actionTypes,
              stateNamespace
            }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest('./actions/__tests__', { cwd, logger, dryRun }));
