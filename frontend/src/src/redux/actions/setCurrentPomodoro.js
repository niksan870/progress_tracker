import { SET_CURRENT_POMODORO } from "../constants/action-types";

export function setCurrentPomodoro(payload) {
    return { type: SET_CURRENT_POMODORO, payload };
}