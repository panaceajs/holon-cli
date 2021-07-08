const jestJunit = require('jest-junit');
const htmlJestReporter = require('html-jest-reporter');
const jestHtmlReporter = require('jest-html-reporter');

module.exports = results => {
  [jestJunit, htmlJestReporter, jestHtmlReporter].map(reporter =>
    reporter(results)
  );
  return results;
};
