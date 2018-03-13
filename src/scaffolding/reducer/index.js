const vfs = require('vinyl-fs');
const file = require('gulp-file');
const { resolve } = require('path');
const eslint = require('gulp-eslint');
const constantCase = require('constant-case');
const exists = require('../../utils/exists');
const defaultLogger = require('../../utils/logger');
const { babel, dest } = require('../../utils/vfs');
const addImports = require('../../babel-transforms/add-imports');
const reducerDefaultExport = require('../../babel-transforms/reducer-default-export');
const reducerInitialState = require('../../babel-transforms/reducer-initial-state');
const reducerCases = require('../../babel-transforms/reducer-cases');

module.exports = ({
  replace,
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes = {}
}) =>
  (replace || !exists(resolve(cwd, 'store', 'reducer.js'))
    ? file('reducer.js', '', { src: true })
    : vfs.src('store/reducer.js', { cwd, allowEmpty: true })
  )
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            addImports,
            {
              imports: {
                '../action-types': Object.keys(actionTypes).map(constantCase)
              }
            }
          ],
          [reducerDefaultExport],
          [reducerInitialState, { actionTypes }],
          [reducerCases, { actionTypes }]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest('./store', { cwd, logger, dryRun }));
