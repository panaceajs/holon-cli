const exists = require('../../utils/exists');
const create = require('./create');
const update = require('./update');

module.exports = ({ cwd, componentName }) =>
  exists(`containers/${componentName}/index.js`, cwd) ? update : create;
