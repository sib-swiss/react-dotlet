import React from 'react';
import s from './TwoSeqsPanel.css';
import store from '../../core/store';
import * as helpers from '../helpers';


class TwoSeqsPanel extends React.Component {

    state = this.stateFromStore();

    stateFromStore() {
        let storeState = store.getState();
        return {
            s1: storeState.input.s1,
            s2: storeState.input.s2,
            window_size: storeState.input.window_size,
            i: storeState.dotter.i,
            j: storeState.dotter.j,
        }
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    /*
     * Make it prettier: Mark start or end of the sequence.
     * @param w: subsequence to decorate
     * @param seq: full original sequence it was extracted from
     * @param i: index of the subsequence center
     * @param ws: number of elements on each side
     */
    formatSeq(w, seq, i, ws) {
        // Mark start of the sequence
        if (i <= ws) {
            w = '_'.repeat(ws-i) + w;
        // Mark end of the sequence
        } else {
            let L = seq.length;
            if (i >= L - ws - 1) {
                w += '_'.repeat(L - i - 1);
            }
        }
        return w;
    }

    render() {
        let i = this.state.i,
            j = this.state.j,
            s1 = this.state.s1,
            s2 = this.state.s2,
            window_size = this.state.window_size;
        let c1 = s1[i];
        let c2 = s2[j];
        //let ws = Math.floor(window_size / 2);
        let ws = 10;
        let w1 = helpers.getSequenceAround(s1, i, ws);
        let w2 = helpers.getSequenceAround(s2, j, ws);
        w1 = this.formatSeq(w1, s1, i, ws);
        w2 = this.formatSeq(w2, s2, j, ws);
        console.debug(i, j, c1, c2, w1, w2, window_size)

        return (
            <div id="two-seqs-panel" className={s.twoSeqsPanel}>
                <div className={s.sequence}>{w1}</div>
                <div className={s.sequence}>{w2}</div>
                "{i}, {j}"
            </div>
        );
    }
}


export default TwoSeqsPanel;
