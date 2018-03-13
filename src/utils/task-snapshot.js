/* eslint no-nested-ternary: 0 */
const concat = require('concat-stream');
const { relative } = require('path');
const { existsSync, readFileSync } = require('fs');

const sortByFilename = ({ path: a }, { path: b }) =>
  a === b ? 0 : a < b ? -1 : 1;
module.exports = (task, options = {}) => {
  const { cwd = process.cwd() } = options;
  return new Promise((resolve, reject) => {
    task(options)
      .pipe(
        concat({ encoding: 'object' }, body => {
          resolve(
            body
              .sort(sortByFilename)
              .map(file => {
                let previous;
                let existingContents = '';
                const newContents = String(file.contents);
                const fileExists = existsSync(file.path);
                if (fileExists) {
                  existingContents = readFileSync(file.path, 'utf8');
                  previous = existingContents;
                }

                return `
--------------------------------------------------------------------------------
// ./${relative(cwd, file.path)}
// ${!fileExists ? `Create` : 'Update'}
--------------------------------------------------------------------------------
${
                  fileExists
                    ? `
${previous}

      ↓ ↓ ↓ ↓ ↓ ↓


`
                    : ``
                }
${newContents}


`;
              })
              .join('\n')
          );
        })
      )
      .on('error', err => {
        reject(err);
      });
  });
};
