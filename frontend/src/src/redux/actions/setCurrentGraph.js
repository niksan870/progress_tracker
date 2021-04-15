import { SET_CURRENT_GRAPH } from "../constants/action-types";

export function setCurrentGraph(payload) {
    return { type: SET_CURRENT_GRAPH, payload };
}