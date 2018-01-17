exports.command = 'init <target>';

exports.describe = 'create holon project';

exports.builder = yargs =>
  yargs.example(
    '$0 init my-project',
    'creates a holon project in ./my-project'
  );

exports.handler = argv => {
  const { target } = argv;

  console.log('target', target);
};
