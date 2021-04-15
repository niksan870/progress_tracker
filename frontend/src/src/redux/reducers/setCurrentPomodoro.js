import { SET_CURRENT_POMODORO } from "../constants/action-types";

export default (previousState = false, { type, payload }) => {
    if (type === SET_CURRENT_POMODORO) {
        return payload;
    }
    return previousState;
};