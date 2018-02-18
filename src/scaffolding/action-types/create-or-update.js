const exists = require('../../utils/exists');
const create = require('./create');
const update = require('./update');

module.exports = ({ cwd }) =>
  exists(`action-types/index.js`, cwd) ? update : create;