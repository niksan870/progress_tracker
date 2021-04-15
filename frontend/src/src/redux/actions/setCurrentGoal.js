import { SET_CURRENT_GOAL } from "../constants/action-types";

export function setCurrentGoal(payload) {
    return { type: SET_CURRENT_GOAL, payload };
}