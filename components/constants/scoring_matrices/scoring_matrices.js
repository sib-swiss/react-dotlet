import { SCORING_MATRIX_NAMES } from '../constants';
import { BLOSUM_45, BLOSUM_62, BLOSUM_80 } from './blosum';
import { PAM_30, PAM_70 } from './pam';
import { IDENTITY } from './identity';

const SCORING_MATRICES = {
    [SCORING_MATRIX_NAMES.IDENTITY]: IDENTITY,
    [SCORING_MATRIX_NAMES.BLOSUM45]: BLOSUM_45,
    [SCORING_MATRIX_NAMES.BLOSUM62]: BLOSUM_62,
    [SCORING_MATRIX_NAMES.BLOSUM80]: BLOSUM_80,
    [SCORING_MATRIX_NAMES.PAM30]: PAM_30,
    [SCORING_MATRIX_NAMES.PAM70]: PAM_70,
};

const MIN_MAX = {
    [SCORING_MATRIX_NAMES.IDENTITY]: [0, 1],
    [SCORING_MATRIX_NAMES.BLOSUM45]: [-5, 15],
    [SCORING_MATRIX_NAMES.BLOSUM62]: [-4, 11],
    [SCORING_MATRIX_NAMES.BLOSUM80]: [-6, 11],
    [SCORING_MATRIX_NAMES.PAM30]: [-17, 13],
    [SCORING_MATRIX_NAMES.PAM70]: [-11, 13],
};

export {
    SCORING_MATRICES,
    MIN_MAX,
};
