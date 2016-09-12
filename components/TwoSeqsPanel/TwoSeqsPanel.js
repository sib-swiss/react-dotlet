import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './TwoSeqsPanel.css';
import store from '../../core/store';

import Dotter from '../DotterPanel/dotter';
import * as helpers from '../common/helpers';
import { formatSeq } from './helpers';
import { inspectCoordinate } from '../actions/actionCreators';
import Slider from 'material-ui/Slider';


const nbsp = String.fromCharCode(160); // code for &nbsp;


class TwoSeqsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.stateFromStore();

        this.nchars = 73;            // total number of chars to display, always odd for simplicity.
        this.half = (this.nchars-1) / 2;  // on each side of `i`, always int if nchars is odd.

        this.ruler = formatSeq("|", 0, this.nchars, nbsp);  // "|"
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            s1: storeState.s1,
            s2: storeState.s2,
            windowSize: storeState.windowSize,
            i: storeState.i,
            j: storeState.j,
        };
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    onSliderChange = (seqn, e, value) => {
        let storeState = store.getState();
        let i = storeState.i,
            j = storeState.j;
        if (seqn === 1) {
            i += value - this.state.i;
            store.dispatch(inspectCoordinate(i, j));
        } else {
            j += value - this.state.j;
            store.dispatch(inspectCoordinate(i, j));
        }
    };

    /*
     * Draw the border showing the running window.
     * @param nseq: sequence number (1 - top or 2 - bottom).
     * @param k: index in the sequence of the middle character.
     * @param windowSize: the size in chars of the window to take the average on.
     * @param ws: precalculated `Math.floor(windowSize / 2)`.
     */
    borderCharStyle(nseq, k, windowSize, ws) {
        if (k === this.half - (windowSize - ws) + 1) {
            if (k === this.half + ws) {  // window size == 1
                if (nseq === 1) return s.windowTopRight +' '+ s.windowTopLeft;
                else return s.windowBotRight +' '+ s.windowBotLeft;
            }
            if (nseq === 1) return s.windowTopLeft;
            else return s.windowBotLeft;
        }
        if (k === this.half + ws) {
            if (nseq === 1) return s.windowTopRight;
            else return s.windowBotRight;
        }
    }

    /*
     * Return "s.same" style if the characters match on both substrings
     * @param k: character index in `w1`/`w2`.
     * @param w1: sequence 1.
     * @param w2: sequence 2.
     * @param fill: character used to indicate an inexistent element.
     */
    sameCharStyle(k, w1, w2, fill) {
        if (w1[k] === w2[k] && w1[k] !== fill) {
            return s.same;
        } else {
            return  '';
        }
    }

    render() {
        let i = this.state.i,
            j = this.state.j,
            s1 = this.state.s1,
            s2 = this.state.s2,
            windowSize = this.state.windowSize;
        let state = store.getState();
        let d = new Dotter(state.canvasSize, windowSize, s1,s2, state.scoringMatrix);

        let nchars = this.nchars;
        let half = this.half;
        let w1 = helpers.getSequenceAround(s1, i, half, half);
        let w2 = helpers.getSequenceAround(s2, j, half, half);

        /* Formatting */
        let fill = nbsp;
        w1 = formatSeq(w1, i, nchars, fill);
        w2 = formatSeq(w2, j, nchars, fill);
        let seqinfo1 = formatSeq("Seq1:"+(i+1), 4, nchars, nbsp);
        let seqinfo2 = formatSeq("Seq2:"+(j+1), 4, nchars, nbsp);

        let spans1 = w1.split('').map((c,k) =>
            <span key={k} className={[
                s.seq1,
                this.sameCharStyle(k, w1, w2, fill),
                this.borderCharStyle(1, k, windowSize, d.hws),
            ].join(' ')} >{c}</span> );

        let spans2 = w2.split('').map((c,k) =>
            <span key={k} className={[
                s.seq2,
                this.sameCharStyle(k, w1, w2, fill),
                this.borderCharStyle(2, k, windowSize, d.hws),
            ].join(' ')} >{c}</span> );

        console.debug([i,j], [d.lws, d.hws], [s1.length-d.hws-1, s2.length-d.hws-1])
        return (
            <div id="two-seqs-panel" className={s.root}>
                <Slider
                    sliderStyle={{margin: 0}}
                    tabIndex="0" ref='slider1'
                    min={d.lws}
                    max={Math.max(s1.length-d.rws-1, 1)}
                    disabled={s1.length <= windowSize}
                    step={1}
                    value={i}
                    onChange={this.onSliderChange.bind(null, 1)}
                />
                <div className={s.second}>
                    <pre>
                        <span className={s.sequence}>{seqinfo1}</span>
                        <span className={s.sequence}>{this.ruler}</span>
                        <span className={s.sequence}>{spans1}</span>
                        <span className={s.sequence}>{spans2}</span>
                        <span className={s.sequence}>{this.ruler}</span>
                        <span className={s.sequence}>{seqinfo2}</span>
                    </pre>
                </div>
                <Slider
                    sliderStyle={{margin: 0}}
                    tabIndex="0" ref='slider2'
                    min={d.lws}
                    max={Math.max(s2.length-d.rws-1, 1)}
                    disabled={s2.length <= windowSize}
                    step={1}
                    value={j}
                    onChange={this.onSliderChange.bind(null, 2)}
                />
            </div>
        );
    }
}


export default TwoSeqsPanel;
