import { DO_SOMETHING } from '../../action-types';

export default ((state = {}, { type, payload, error }) => {
  switch (type) {
    case DO_SOMETHING:
      {
        // should remain untouched
        return { ...state,
          SOME_VALUE: payload || null,
          error
        };
      }
    default:
      return state;
  }
});