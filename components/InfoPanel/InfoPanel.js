import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';
import s from './InfoPanel.css';
import { SCORING_MATRIX_NAMES } from '../constants/constants';
import { SCORING_MATRICES } from '../constants/scoring_matrices/scoring_matrices';
import { calculateMatches, calculateScore } from '../common/scoring';
import { getSequenceAround } from '../common/helpers';


class InfoPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = store.getState();
    }

    stateFromStore() {
        return store.getState();
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    calculateMean(scores) {
        let mean = 0;
        let n = 0;
        for (let key of Object.keys(scores)) {
            let val = scores[key];
            mean += key * val;
            n += val;
        }
        return n > 0 ? (mean / n).toFixed(2) : 0;
    }

    render() {

        let i = this.state.i,
            j = this.state.j,
            s1 = this.state.s1,
            s2 = this.state.s2,
            density = this.state.density,
            windowSize = this.state.windowSize,
            scoringMatrixName = this.state.scoringMatrix;

        let scoringFunction;
        if (scoringMatrixName === SCORING_MATRIX_NAMES.IDENTITY) {
            scoringFunction = calculateMatches;
        } else {
            scoringFunction = calculateScore;
        }
        let matrix = SCORING_MATRICES[scoringMatrixName];

        let ws = Math.floor(windowSize / 2);
        let ss1 = getSequenceAround(s1, i, ws);
        let ss2 = getSequenceAround(s2, j, ws);
        let localScore = scoringFunction(ss1, ss2, matrix);
        let mean = this.calculateMean(density);

        return (
            <div id="info-panel" className={s.root}>
                <ul>
                    <li>{`Score at (${i+1}:${s1[i]}, ${j+1}:${s2[j]}) : ${localScore}`}</li>
                    <li>{"Mean score: "+ mean}</li>
                </ul>
            </div>
        );
    }
}


export default InfoPanel;
