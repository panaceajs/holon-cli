const constantCase = require('constant-case');
const camelCase = require('camel-case');
const ucFirst = require('upper-case-first');

module.exports = ({ saga: { name, actionTypes } }) => `// saga ${name}`;
