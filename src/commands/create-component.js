const inquirer = require('inquirer');
const camelcase = require('camel-case');
const ucf = require('upper-case-first');
const vfs = require('vinyl-fs');
// const tap = require('gulp-tap');
const template = require('../lib/vfs-template');

exports.command = 'xcreate <name>';

exports.describe = 'creates a holon component in the current directory';

const choices = [
  { name: 'A holon module', value: 'holon' },
  new inquirer.Separator(),
  {
    name: 'A react stateless functional component',
    value: 'component'
    // disabled: true
  },
  {
    name: 'A react-redux container',
    value: 'container',
    disabled: true
  },
  {
    name: 'A redux reducer',
    value: 'reducer',
    disabled: true
  },
  {
    name: 'A saga',
    value: 'saga',
    disabled: true
  },
  new inquirer.Separator(),
  {
    name: 'Unit tests for an existing component',
    value: 'component-tests',
    disabled: true
  },
  {
    name: 'Unit tests for an existing container',
    value: 'container-tests',
    disabled: true
  }
];

exports.builder = yargs =>
  yargs
    .option({
      type: {
        choices: choices
          .filter(({ name, value, disabled }) => name && value && !disabled)
          .map(({ value }) => value),
        type: 'string'
      },
      name: {
        type: 'string'
      }
    })
    .example('$0 create holon', exports.describe)
    .strict();

exports.handler = async argv => {
  const { name, type } = argv;

  const argvAnswers = { type };
  let promptAnswers = {};
  const questions = [];

  if (!type) {
    questions.push({
      type: 'list',
      name: 'type',
      message: 'What would you like to create?',
      pageSize: 100,
      choices
    });
  }

  if (!name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'What is its name?',
      filter: value => ucf(camelcase(value))
    });
  }

  questions.push({
    type: 'confirm',
    name: 'addProps',
    message: 'Add props?'
  });

  questions.push({
    type: 'input',
    name: 'props',
    message: 'Enter prop names, separate by comma: ',
    filter: value =>
      value
        .split(',')
        .map(propName => camelcase(propName))
        .filter(
          (propName, index, collection) =>
            propName && collection.indexOf(propName) === index
        ),
    when: pAnswers => pAnswers.addProps
  });

  if (questions.length) {
    promptAnswers = await inquirer.prompt([...questions]);
  }

  const answers = { ...argvAnswers, ...promptAnswers };
  // console.log(JSON.stringify(answers, null, '  '));

  if (answers.type === 'component') {
    vfs
      .src('../../templates/component/**/*.js', { cwd: __dirname })
      .pipe(template({ component: { ...answers } }))
      .pipe(vfs.dest(`./${answers.name}`, { cwd: process.cwd() }));
  }
};
