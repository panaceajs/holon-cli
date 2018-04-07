# holon-cli

![alt text](./docs/holon-logo.png "Logo with tree")


__⚡️ This package is in active development, and --not-- fit for production yet.__

Utility library for creating scalable react/redux/saga applications.


## Installation

If you are using npm:

```
$ npm install -g @panacea/holon-cli@next
```

If you are using yarn:

```
$ yarn global add @panacea/holon-cli@next
```


## Usage

Please refer to command line help (for now).

```
$ holon
```

### Create next.js pages

```
$ cd pages
$ holon nextjs-page --stateNamespace pageName --actionTypes fetchUsers:users selectUser:currentUser --magic
```

## License

[MIT](LICENSE).
