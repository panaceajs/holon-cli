const exists = require('../../utils/exists');
const create = require('./create');
const update = require('./update');

module.exports = ({ cwd, name }) =>
  exists(`components/${name}/index.js`, cwd) ? update : create;
