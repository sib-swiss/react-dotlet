
import { MATCH, MISMATCH } from '../constants';

let IDENTITY = {
    [MATCH]: 1,
    [MISMATCH]: 0
};

let PENALTY = {
    [MATCH]: 2,
    [MISMATCH]: -1
};

export { IDENTITY, PENALTY };
