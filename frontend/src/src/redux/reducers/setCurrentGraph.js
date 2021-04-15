import { SET_CURRENT_GRAPH } from "../constants/action-types";

export default (previousState = false, { type, payload }) => {
    if (type === SET_CURRENT_GRAPH) {
        return payload;
    }
    return previousState;
};