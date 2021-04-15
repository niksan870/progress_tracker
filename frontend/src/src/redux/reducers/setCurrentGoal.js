import { SET_CURRENT_GOAL } from "../constants/action-types";

export default (previousState = false, { type, payload }) => {
    if (type === SET_CURRENT_GOAL) {
        return payload;
    }
    return previousState;
};