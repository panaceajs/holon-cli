const camelCase = require('camel-case');
const ucf = require('upper-case-first');

const toVariableName = name =>
  camelCase(
    name
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/^[0-9]+/g, '')
      .trim()
  );

const toUpperCaseVariableName = name => ucf(toVariableName(name));

module.exports = { toVariableName, toUpperCaseVariableName };
