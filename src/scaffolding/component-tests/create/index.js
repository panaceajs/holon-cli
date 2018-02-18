const generic = require('./generic');
const materialUI = require('./material-ui');

module.exports = argv => {
  const { mui } = argv;

  return mui ? materialUI(argv) : generic(argv);
};
