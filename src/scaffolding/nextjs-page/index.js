const vfs = require('vinyl-fs');
const file = require('gulp-file');
const { resolve } = require('path');
const eslint = require('gulp-eslint');
const constantCase = require('constant-case');
const exists = require('../../utils/exists');
const defaultLogger = require('../../utils/logger');
const { babel, dest } = require('../../utils/vfs');
const addImports = require('../../babel-transforms/add-imports');
const nextjsPageDefaultExport = require('../../babel-transforms/nextjs-page-default-export');
const reducerInitialState = require('../../babel-transforms/reducer-initial-state');
const reducerCases = require('../../babel-transforms/reducer-cases');

module.exports = ({
  stateNamespace,
  magic,
  withReducer,
  replace,
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes = {}
}) => {
  const imports = {
    react: [{ default: 'React' }],
    '../shared/store': ['boundWithRedux'],
    '../shared/components/Page': [{ default: 'Page' }],
    '../shared/components/Typography': ['Section', 'Heading1', 'Paragraph']
  };

  if (withReducer || magic) {
    imports['./store/reducer'] = [{ default: 'reducer' }];
    imports['redux-saga/effects'] = ['takeEvery', 'put'];
  }
  return (replace || !exists(resolve(cwd, 'index.js'))
    ? file('index.js', '', { src: true })
    : vfs.src(`index.js`, { cwd, allowEmpty: true })
  )
    .pipe(
      babel({
        sourceType: 'module',
        plugins: [
          [
            addImports,
            {
              imports
            }
          ],
          [
            nextjsPageDefaultExport,
            { stateNamespace, magic, withReducer, actionTypes }
          ]
        ]
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest(`./`, { cwd, logger, dryRun }));
};
