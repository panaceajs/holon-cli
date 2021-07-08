const vfs = require('vinyl-fs');
const file = require('gulp-file');
const { resolve } = require('path');
const eslint = require('gulp-eslint');
const constantCase = require('constant-case');

const exists = require('../../utils/exists');
const defaultLogger = require('../../utils/logger');
const { babel, dest } = require('../../utils/vfs');

const actionCreators = require('../../babel-transforms/action-creators');
const addImports = require('../../babel-transforms/add-imports');

module.exports = ({
  replace,
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes
}) =>
  (replace || !exists(resolve(cwd, 'actions', 'index.js'))
    ? file('index.js', '', { src: true })
    : vfs.src('actions/index.js', { cwd, allowEmpty: true })
  )
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            addImports,
            {
              imports: {
                'redux-actions': ['createAction'],
                '../action-types': Object.keys(actionTypes).map(constantCase)
              }
            }
          ],
          [
            actionCreators,
            {
              actionTypes: actionTypes || {}
            }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest('./actions', { cwd, logger, dryRun }));
