const exists = require('../../utils/exists');
const create = require('./create');
const update = require('./update');

module.exports = ({ cwd }) =>
  exists('actions/index.js', cwd) ? update : create;
