const through2 = require('through2');
const inquirer = require('inquirer');
const diff = require('diff');
const fs = require('fs');
const path = require('path');
const ansiColors = require('ansi-colors');
const PluginError = require('plugin-error');
const fancyLog = require('fancy-log');
const pkg = require('../../package');

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
    key: 'x',
    name: 'abort',
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

function isTest() {
  return process.env.NODE_ENV === 'test';
}

function log(...args) {
  if (isTest()) {
    return;
  }
  fancyLog.apply(fancyLog, args);
}

module.exports = function conflict(dest, opt = {}) {
  if (!dest) {
    error('Missing destination dir parameter!');
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
  const logger = opt.logger || log;

  return through2.obj(function t2obj(file, enc, cb) {
    const newPath = path.resolve(opt.cwd || process.cwd(), dest, file.relative);
    fs.stat(newPath, (err, stat) => {
      if (!replaceAll && stat && !stat.isDirectory()) {
        fs.readFile(newPath, 'utf8', (fsReadErr, contents) => {
          if (fsReadErr) {
            error(
              `Reading old file for comparison failed with: ${err.message}`
            );
          }
          if (contents === String(file.contents)) {
            logFile({
              message: 'Skipping',
              file,
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
              stat,
              logger
            });
            return cb();
          }

          function askCb(action) {
            switch (action) {
              case 'replaceAll':
                replaceAll = true;
              /* falls through */
              case 'replace':
                logFile({
                  message: 'Overwriting',
                  file,
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
                  stat,
                  logger
                });
                break;
              case 'end':
                log(ansiColors.red('Aborting...'));
                process.exit(0);
                break;
              case 'diff':
                logFile({
                  message: 'Showing diff for',
                  file,
                  stat,
                  logger
                });
                diffFiles(file, newPath);
                ask(file, defaultChoiceIndex, askCb.bind(this));
                return;
            }
            cb();
          }
          ask(file, defaultChoiceIndex, askCb.bind(this));
        });
      } else {
        logFile({
          message: 'Creating',
          file,
          stat,
          logger
        });
        this.push(file);
        cb();
      }
    });
  });
};

function ask(file, defaultChoiceIndex, cb) {
  inquirer.prompt(
    [
      {
        type: 'expand',
        name: 'replace',
        message: `Replace ${file.relative}?`,
        default: defaultChoiceIndex,
        choices
      }
    ],
    answers => {
      cb(answers.replace);
    }
  );
}

function colorFromPart(part) {
  if (part.added) {
    return 'bgGreen';
  } else if (part.removed) {
    return 'bgRed';
  }
  return 'grey';
}

function formatPart(part, i) {
  const indent = new Array(8).join(' ');
  return (
    (!i ? indent : '') +
    part.value
      .split('\n')
      .map(line => ansiColors[colorFromPart(part)](line))
      .join(`\n${indent}`)
  );
}

function diffFiles(newFile, oldFilePath) {
  if (newFile.isStream()) {
    error('Diff does not support file streams');
  }
  try {
    const content = fs.readFileSync(oldFilePath, 'utf8');
    const differences = diff.diffLines(content, String(newFile.contents));
    log(
      `File differences: ${ansiColors.bgGreen('added')} ${ansiColors.bgRed(
        'removed'
      )}\n\n${differences.map(formatPart).join('')}`
    );
  } catch (err) {
    error(`Reading old file for diff failed with: ${err.message}`);
  }
}

/*
 * Args: message, file, stat, extraText
 */
function logFile(options) {
  const { message, file, stat, extraText, logger } = options;

  if (!file || !file.relative || (stat && stat.isDirectory())) {
    return;
  }
  const fileName = ansiColors.magenta(file.relative);
  if (extraText) {
    logger(message, fileName, extraText);
  } else {
    logger(message, fileName);
  }
}
