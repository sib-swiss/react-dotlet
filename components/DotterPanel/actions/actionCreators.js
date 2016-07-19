
import { INSPECT_COORDINATE } from './actionTypes';


function inspectCoordinate(i, j) {
    return {
        type: INSPECT_COORDINATE,
        i: i,
        j: j,
    }
}


export {
    inspectCoordinate,
};
