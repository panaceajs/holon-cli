const exists = require('../../utils/exists');
const create = require('./create');
const update = require('./update');

module.exports = ({ cwd, holonName }) =>
  exists(`${holonName}/index.js`, cwd) ? update : create;
