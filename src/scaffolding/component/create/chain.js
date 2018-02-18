const generic = require('./generic/chain');
const materialUI = require('./material-ui/chain');

module.exports = argv => {
  const { mui } = argv;

  return mui ? materialUI(argv) : generic(argv);
};
