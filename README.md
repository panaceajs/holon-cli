# holon-cli

__⚡️ This package is in active development, and --not-- fit for production yet.__

Utility library for creating scalable react/redux/saga applications.


## Installation

If you are using npm:

```
$ npm install -g @panacea/holon-cli
```

If you are using yarn:

```
$ yarn global add @panacea/holon-cli 
```


## Usage

### Scaffolding

#### Create react stateless function component

```
$ holon create-component

Creates a react stateless functional component with tests in the current directory.

Options:
  --version, -v     Show version number                                                                        [boolean]
  --help, -h        Show help                                                                                  [boolean]
  --props, -p       List of props, separated by `, `.                                                            [array]
  --withStyles, -w  Wraps the component in a `withStyles` hoc, uses mount instead of shallow for testing.      [boolean]
  --theme, -T       Path to exported createMuiTheme()                                [string] [default: "shared/themes"]
  --testsOnly, -t   Creates just the test, not the component itself.                          [boolean] [default: false]

Examples:
  holon create-component MyComponent                          Creates a component with tests in `./MyComponent`.
  holon create-component MyComponent --props one, two, three  Creates a component with tests in ./MyComponent with
                                                              `one`,  `two` and  `three` as props.
  holon create-component MyComponent --withStyles             Creates a component with tests in `./MyComponent` with a
                                                              material-ui `withStyles` hoc.
  holon create-component MyComponent --testsOnly              Creates tests in `./MyComponent/__tests__`.
```


#### Create react-redux container

```
$ holon create-container

Creates a react-redux container in the current directory.

Options:
  --version, -v                    Show version number                                                         [boolean]
  --help, -h                       Show help                                                                   [boolean]
  --state, -s, --stateNamespace    State namespace of combined reducer                                          [string]
  --map, -m, --mapProps            List of props mapped in `mapStateToProps`, separated by `, `                  [array]
  --dispatch, -d, --dispatchProps  List of prop functions mapped in `mapDispatchToProps`, separated by `, `      [array]
  --theme, -T                      Path to exported createMuiTheme()                 [string] [default: "shared/themes"]
  --testsOnly, -t                  Creates just the test, not the component itself.           [boolean] [default: false]

Examples:
  holon create-container ../../components/MyComponent           Creates a react-redux hoc container in `./MyComponent`
  holon create-container ../../components/MyComponent --map     Creates a react-redux hoc container with tests in
  one, two, three                                               `./MyComponent`, maps props `one`, `two` and `three`.
  holon create-container ../../components/MyComponent           Creates a react-redux hoc container with tests in
  --dispatch someFunction, someOtherFunction                    `./MyComponent`, maps prop functions `someFunction` and
                                                                `someOtherFunction`.
  holon create-container ../../components/MyComponent           Creates a react-redux hoc container with tests in
  --stateNamespace login                                        `./MyComponent`, assumes `login` as state namespace.
  holon create-container ../../components/MyComponent           Creates tests in `./MyComponent`.
  --testsOnly
```


#### Create action creators and types.

```
$ holon create-actions -h

Creates redux action creators and action-type with tests in the current directory.

Options:
  --version, -v                  Show version number                                                           [boolean]
  --help, -h                     Show help                                                                     [boolean]
  --actionTypes, -a              List of action names, separated by `, `.                                        [array]
  --stateNamespace, -s, --state  State namespace of combined reducer. Defaults to current directory name
                                                                                             [string] [default: "blaat"]
  --testsOnly, -t                Creates just the test, not the action creators and action-types itself.
                                                                                              [boolean] [default: false]

Examples:
  holon create-actions                                     Creates action creators and action-types with tests in
                                                           `./actions` and `./action-types`.
  holon create-actions --actionTypes first, second, third  Creates tests in `./actions/__tests__` and
                                                           `./action-types/__tests__` with `first`, `second` and `third`
                                                           as actin types in `./`.
  holon create-actions --stateNamespace login              Creates tests in `./actions/__tests__` and
                                                           `./action-types/__tests__` in `./`, assumes `login` as state
                                                           namespace.
  holon create-actions --testsOnly                         Creates tests in `./actions/__tests__` and
                                                           `./action-types/__tests__`.
```

#### Create reducer, action creators and action types.

```
$ holon create-reducer

Creates redux reducer, action creators and action types with tests in the current directory.

Options:
  --version, -v                  Show version number                                                           [boolean]
  --help, -h                     Show help                                                                     [boolean]
  --actionTypes, -a              List of actions, separated by `, `.                                             [array]
  --stateNamespace, -s, --state  State namespace of combined reducer. Defaults to current directory name
                                                                                             [string] [default: "blaat"]
  --reducerOnly, -r              Creates just the reducer. (Does not create action creators and action types)
                                                                                              [boolean] [default: false]
  --testsOnly, -t                Creates just the reducer tests. (Does not create tests for action creators and action
                                 types)                                                       [boolean] [default: false]

Examples:
  holon create-reducer                                     Creates reducer, action creators and action types with tests
                                                           in `./`.
  holon create-reducer --actionTypes first, second, third  Creates reducer, action creators and action types with tests
                                                           with `first`, `second` and `third` as action types in
                                                           ./store.
  holon create-reducer --stateNamespace login              Creates reducer, action creators and action types with tests
                                                           in ./store, assumes `login` as state namespace.
  holon create-reducer --reducerOnly                       Creates reducer with tests in `./store/reducer`.
  holon create-reducer --testsOnly                         Creates reducer tests in `./store/__tests__`.
```


### Tab completion

Enable bash-completion shortcuts for commands and options.

```
$ holon completion
```

### Configuration

You can override defaults in `package.json`.

```
...
  "holon": {
    "theme": "<path to your `createMuiTheme()` export. default to `shared/themes`"
  }
```

## License

[MIT](LICENSE).
