/* eslint no-nested-ternary: 0 */
module.exports = ({
  holon: {
    holonName,
    stateNamespace,
    magic,
    withLayout,
    withContainer,
    withComponent,
    componentName,
    withReducer,
    // withSagas,
    dispatchOnMount
  }
}) => {
  const loaders = [];
  if (magic || withReducer) {
    loaders.push('injectReducers');
  }
  const dispatchActions = Object.keys(dispatchOnMount);
  // if (magic || withSagas) {
  //   loaders.push('injectSagas');
  // }
  // ${magic || withSagas ? `import sagas from './sagas';` : ``}
  // ${magic || withSagas ? `injectSagas({ ${stateNamespace}: sagas });` : ``}
  return `${
    loaders.length
      ? `import { ${loaders.join(', ')} } from 'shared/utils/loaders';`
      : ``
  }
${
    dispatchActions.length
      ? `import { withDispatchOnMount } from 'shared/hoc/with-dispatch';
import { ${dispatchActions.join(', ')} } from './actions';`
      : ``
  }
${
    magic || withLayout
      ? `import ${holonName}Layout from './layouts/${holonName}Layout';`
      : withContainer
        ? `import ${componentName} from './containers/${componentName}';`
        : withComponent
          ? `import ${componentName} from './components/${componentName}';`
          : ``
  }
${magic || withReducer ? `import reducer from './store/reducer';` : ``}

  ${
    magic || withReducer
      ? `injectReducers({ ${stateNamespace}: reducer });`
      : ``
  }

  export default ${dispatchActions.length ? `withDispatchOnMount(` : ``}${
    magic || withLayout
      ? `${holonName}Layout`
      : withComponent || withContainer ? componentName : `() => <div></div>;`
  }${
    dispatchActions.length
      ? `, ${
          dispatchActions.length > 1
            ? `[${dispatchActions.join(', ')}]`
            : `${dispatchActions[0]}`
        })`
      : ``
  };
  `;
};
