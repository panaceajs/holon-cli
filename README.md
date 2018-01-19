# holon-cli

__⚡️ This package is in active development, and --not-- fit for production yet.__

Utility library for creating scalable react/redux/saga applications.


## Installation

If you are using npm:

```
$ npm install -g @panacea/holon
```

If you are using yarn:

```
$ yarn add -g @panacea/holon
```


## Usage


### Create react stateless function component

```
$ holon create-component

Creates a react stateless functional component with tests in the current directory.

Options:
  --version, -v     Show version number                                                                        [boolean]
  --help, -h        Show help                                                                                  [boolean]
  --props, -p       List of props, separated by `, `.                                                            [array]
  --withStyles, -w  Wraps the component in a `withStyles` hoc, uses mount instead of shallow for testing.      [boolean]
  --testsOnly, -t   Creates just the test, not the component itself.                                           [boolean]

Examples:
  holon create-component MyComponent                          Creates a component with tests in ./MyComponent.
  holon create-component MyComponent --props one, two, three  Creates a component with tests in ./MyComponent with
                                                              `one`,  `two` and  `three` as props.
  holon create-component MyComponent --withStyles             Creates a component with tests in ./MyComponent with a
                                                              material-ui `withStyles` hoc.
  holon create-component MyComponent --testsOnly              Creates tests in ./MyComponent/__tests__.
```


### Create react-redux container

```
$ holon create-container

Creates a react-redux container in the current directory.

Options:
  --version, -v                    Show version number                                                         [boolean]
  --help, -h                       Show help                                                                   [boolean]
  --state, -s, --statePrefix       State prefix name of combined reducer                                        [string]
  --map, -m, --mapProps            List of props mapped in `mapStateToProps`, separated by `, `                  [array]
  --dispatch, -d, --dispatchProps  List of prop functions mapped in `mapDispatchToProps`, separated by `, `      [array]
  --testsOnly, -t                  Creates just the test, not the component itself.                            [boolean]

Examples:
  holon create-container ../../components/MyComponent           Creates a react-redux hoc container in `./MyComponent`
  holon create-container ../../components/MyComponent --map     Creates a react-redux hoc container with tests in
  one, two, three                                               `./MyComponent`, maps props `one`, `two` and `three`.
  holon create-container ../../components/MyComponent           Creates a react-redux hoc container with tests in
  --dispatch someFunction, someOtherFunction                    `./MyComponent`, maps prop functions `someFunction` and
                                                                `someOtherFunction`.
  holon create-container ../../components/MyComponent           Creates tests in `./MyComponent`.
  --testsOnly
```


### Create action creators and types.

```
$ holon create-actions -h

Creates redux action creators and action-type with tests in the current directory.

Options:
  --version, -v    Show version number                                                                         [boolean]
  --help, -h       Show help                                                                                   [boolean]
  --names, -a      List of action names, separated by `, `.                                                      [array]
  --testsOnly, -t  Creates just the test, not the action creators and action-types itself.                     [boolean]

Examples:
  holon create-actions              Creates action creators and action-types with tests in ./actions and ./action-types.
  holon create-actions --testsOnly  Creates tests in ./actions/__tests__ and ./action-types/__tests__.
```

## License

[MIT](LICENSE).
