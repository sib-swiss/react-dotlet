
import { COMPUTE_DENSITY, INSPECT_COORDINATE } from './actionTypes';


function computeDensity(scores) {
    return {
        type: COMPUTE_DENSITY,
        scores: scores,
    }
}

function inspectCoordinate(x, y) {
    return {
        type: INSPECT_COORDINATE,
        x: x,
        y: y,
    }
}


export {
    computeDensity,
    inspectCoordinate,
};
