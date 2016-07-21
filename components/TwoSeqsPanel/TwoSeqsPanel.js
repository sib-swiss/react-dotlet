import React from 'react';
import s from './TwoSeqsPanel.css';
import store from '../../core/store';
import * as helpers from '../helpers';
import { formatSeq } from './helpers';


class TwoSeqsPanel extends React.Component {

    state = this.stateFromStore();

    stateFromStore() {
        let storeState = store.getState();
        return {
            s1: storeState.input.s1,
            s2: storeState.input.s2,
            windowSize: storeState.input.windowSize,
            i: storeState.dotter.i,
            j: storeState.dotter.j,
        }
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    render() {
        let i = this.state.i,
            j = this.state.j,
            s1 = this.state.s1,
            s2 = this.state.s2,
            windowSize = this.state.windowSize;
        let ws = Math.floor(windowSize / 2);
        let nchars = 73;            // total number of chars to display, always odd for simplicity.
        let half = (nchars-1) / 2;  // on each side of `i`, always int if nchars is odd.
        let w1 = helpers.getSequenceAround(s1, i, half);
        let w2 = helpers.getSequenceAround(s2, j, half);
        let L = Math.max(s1.length, s2.length);

        /* Formatting */
        let nbsp = String.fromCharCode(160); // code for &nbsp;
        let fill = nbsp;
        w1 = formatSeq(w1, i, nchars, fill);
        w2 = formatSeq(w2, j, nchars, fill);
        let ruler = formatSeq("|", 0, nchars, nbsp);  // "|"
        let caret = formatSeq("^", 0, nchars, nbsp);  // "^"
        let seqinfo1 = formatSeq("Seq1:"+(i+1), 4, nchars, nbsp);
        let seqinfo2 = formatSeq("Seq2:"+(j+1), 4, nchars, nbsp);

        /* Return "s.same" style if the characters match on both substrings */
        function sameCharStyle(k) {
            if (w1[k] === w2[k] && w1[k] !== fill) {
                return s.same;
            } else {
                return  '';
            }
        }

        /* Draw the border showing the running window */
        function borderCharStyle(nseq, k) {
            let center = nchars/2;
            if (k === center - (windowSize - ws) + 1) {
                if (k === center + ws) {  // window size == 1
                    if (nseq === 1) return s.windowTopRight +' '+ s.windowTopLeft;
                    else return s.windowBotRight +' '+ s.windowBotLeft;
                }
                if (nseq === 1) return s.windowTopLeft;
                else return s.windowBotLeft;
            }
            if (k === center + ws) {
                if (nseq === 1) return s.windowTopRight;
                else return s.windowBotRight;
            }
        }

        let spans1 = w1.split('').map((c,i) =>
            <span key={i} className={[
                s.seq1,
                sameCharStyle(i),
                borderCharStyle(1, i),
            ].join(' ')} >{c}</span> );

        let spans2 = w2.split('').map((c,i) =>
            <span key={i} className={[
                s.seq2,
                sameCharStyle(i),
                borderCharStyle(2, i),
            ].join(' ')} >{c}</span> );

        return (
            <div id="two-seqs-panel" className={s.twoSeqsPanel}>
            <pre>
                <div className={s.sequence}>{seqinfo1}</div>
                <div className={s.sequence}>{ruler}</div>
                <div className={s.sequence}>{spans1}</div>
                <div className={s.sequence}>{spans2}</div>
                <div className={s.sequence}>{caret}</div>
                <div className={s.sequence}>{ruler}</div>
                <div className={s.sequence}>{seqinfo2}</div>
                {"windowSize: " + windowSize}
            </pre>
            </div>
        );
    }
}


export default TwoSeqsPanel;
