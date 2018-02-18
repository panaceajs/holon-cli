const through2 = require('through2');
const inquirer = require('inquirer');
const PluginError = require('plugin-error');
const diff = require('diff');
const fs = require('fs');
const path = require('path');
const pkg = require('../../../package');
const colors = require('ansi-colors');
const defaultLogger = require('../logger');

const log = {
  ...defaultLogger
};

const choices = [
  {
    key: 'y',
    name: 'replace',
    value: 'replace'
  },
  {
    key: 'n',
    name: 'do not replace',
    value: 'skip'
  },
  {
    key: 'a',
    name: 'replace this and all others',
    value: 'replaceAll'
  },
  {
    key: 's',
    name: 'skip this and all others',
    value: 'skipAll'
  },
  {
    key: 'q',
    name: 'quit',
    value: 'end'
  },
  {
    key: 'd',
    name: 'show the differences between the old and the new',
    value: 'diff'
  }
];

function error(message) {
  throw new PluginError(pkg.name, message);
}

function ask(file, destPath, defaultChoiceIndex, cb) {
  inquirer
    .prompt([
      {
        type: 'expand',
        name: 'replace',
        message: `⚡️  Replace ${path.relative(process.cwd(), destPath)}?`,
        default: defaultChoiceIndex,
        choices
      }
    ])
    .then(answers => {
      cb(answers.replace);
    });
}
/*
 * Args: message, file, stat, extraText
 */
function logFile({ message, file, stat, extraText, logger, destPath }) {
  if (!file || !file.relative || (stat && stat.isDirectory())) {
    return;
  }

  if (extraText) {
    logger.info(message, destPath, extraText);
  } else {
    logger.info(message, destPath);
  }
}

function colorFromPart(part) {
  if (part.added) {
    return 'bggreen';
  } else if (part.removed) {
    return 'bgmagenta';
  }
  return 'grey';
}

function formatPart(part, i) {
  const indent = new Array(8).join(' ');
  return (
    (!i ? indent : '') +
    part.value
      .split('\n')
      .map(line => colors[colorFromPart(part)](colors.white(line)))
      .join(`\n${indent}`)
  );
}

function diffFiles(newFile, oldFilePath, logger) {
  if (newFile.isStream()) {
    error('Diff does not support file streams');
  }
  try {
    const content = fs.readFileSync(oldFilePath, 'utf8');
    const differences = diff.diffLines(content, String(newFile.contents));
    logger.info(
      `File differences: ${colors.bggreen('added')} ${colors.bgmagenta(
        'removed'
      )}\n\n${differences.map(formatPart).join('')}`
    );
  } catch (err) {
    error(`Reading old file for diff failed with: ${err.message}`);
  }
}

module.exports = function conflict(dest, opt = {}) {
  if (!dest) {
    error('🔥  Missing destination dir parameter!');
  }

  let replaceAll = opt.replaceAll || false;
  let skipAll = opt.skipAll || false;
  const defaultChoice = opt.defaultChoice || null;

  let defaultChoiceIndex = null;

  choices.forEach((choice, index) => {
    if (choice.key === defaultChoice) {
      defaultChoiceIndex = index;
    }
  });

  const { logger = log } = opt;
  /* eslint-disable func-names, default-case, no-shadow */
  return through2.obj(function(file, enc, cb) {
    const newPath = path.resolve(opt.cwd || process.cwd(), dest, file.relative);
    const destPath = path.join(dest, file.relative);

    fs.stat(newPath, (err, stat) => {
      if (!replaceAll && stat && !stat.isDirectory()) {
        fs.readFile(newPath, 'utf8', (err, contents) => {
          if (err) {
            error(
              `Reading old file for comparison failed with: ${err.message}`
            );
          }
          if (contents === String(file.contents)) {
            logFile({
              message: 'Skipping',
              file,
              destPath,
              stat,
              extraText: '(identical)',
              logger
            });
            return cb();
          }

          if (skipAll) {
            logFile({
              message: 'Skipping',
              file,
              destPath,
              stat,
              logger
            });
            return cb();
          }

          const askCb = function askCb(action) {
            switch (action) {
              case 'replaceAll':
                replaceAll = true;
              /* falls through */
              case 'replace':
                logFile({
                  message: 'Overwriting',
                  file,
                  destPath,
                  stat,
                  logger
                });
                this.push(file);
                break;
              case 'skipAll':
                skipAll = true;
              /* falls through */
              case 'skip':
                logFile({
                  message: 'Skipping',
                  file,
                  destPath,
                  stat,
                  logger
                });
                break;
              case 'end':
                logger.info(colors.red('Aborting...'));
                process.exit(0);
                break;
              case 'diff':
                logFile({
                  message: 'Showing diff for',
                  file,
                  destPath,
                  stat,
                  logger
                });
                diffFiles(file, newPath, logger);
                ask(file, destPath, defaultChoiceIndex, askCb.bind(this));
                return;
            }
            cb();
          };

          diffFiles(file, newPath, logger);
          ask(file, destPath, defaultChoiceIndex, askCb.bind(this));
        });
      } else {
        logFile({
          message: 'Creating',
          file,
          destPath,
          stat,
          logger
        });
        this.push(file);
        cb();
      }
    });
  });
};
