import Stuff from 'stuff';
import { createAction } from "redux-actions";
import { AN_ACTION, ANOTHER_ACTION_WHICH_SHOULD_NOT_BE_OVERRIDDEN } from "../action-types";
export default Stuff;
export const anAction = createAction(AN_ACTION);
export const existingAction = createAction(ANOTHER_ACTION_WHICH_SHOULD_NOT_BE_OVERRIDDEN);