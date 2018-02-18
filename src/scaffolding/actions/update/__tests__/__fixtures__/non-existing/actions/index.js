import { createAction } from 'redux-actions';
import { IGNORED_ACTION } from '../action-types';

export const ignoredAction = createAction(IGNORED_ACTION);
