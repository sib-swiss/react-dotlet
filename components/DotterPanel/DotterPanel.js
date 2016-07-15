import React from 'react';
import s from './DotterPanel.css';
import { IDENTITY } from './constants/scoring_matrices/dna';
import * as dotter from './dotter';
import store from '../../core/store';

const CANVAS_SIZE = 600;

class DotterPanel extends React.Component {
    static propTypes = {
        window_size: React.PropTypes.number,
    };

    state = {
        s1: store.getState().input.s1,
        s2: store.getState().input.s2,
    };

    componentWillMount() {
        store.subscribe(() => {
            var state = store.getState();
            this.setState({
                s1: state.input.s1,
                s2: state.input.s2,
            });
        });
    }

    render() {
        return (
            <div className={s.canvasContainer}>
                <canvas id='dotter-canvas'
                      ref={(c) => this._refDotterCanvas = c}
                      className={s.canvas}
                      width={CANVAS_SIZE}
                      height={CANVAS_SIZE}
                ></canvas>
            </div>
        );
    }

    componentDidMount() {
        this.fillCanvas();
    }

    componentDidUpdate() {
        this.fillCanvas();
    }


    fillCanvas() {
        /* Init blank canvas */
        let cv = this._refDotterCanvas;
        let ctx = cv.getContext('2d');
        let canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let s1 = this.state.s1;
        let s2 = this.state.s2;

        let ls1 = s1.length;
        let ls2 = s2.length;
        let L = Math.min(ls1, ls2);

        let window_size = this.props.window_size;
        let ws = Math.floor(window_size / 2);   // # of nucleotides on each side

        let canvas_pt = dotter.getCanvasPt(CANVAS_SIZE, L);
        let npoints = CANVAS_SIZE / canvas_pt;
        let step = L / npoints;                 // n points -> n-1 steps. What if not int?

        //console.log(window_size, ws, L, canvas_pt, step)

        for (let i=0; i <= npoints; i++) {      // n-1 steps
            let q1 = i * step;                  // position on seq1. First is 0, last is L
            let l1 = Math.max(q1 - ws, 0),
                r1 = q1 + ws + 1;               // nucleotides window on seq1
            //console.log(s1, [l1,r1], s1.slice(l1, r1))
            let subseq1 = s1.slice(l1, r1);

            for (let j=0; j <= i; j++) {        // i steps
                let q2 = j * step;              // position on seq2
                let l2 = Math.max(q2 - ws, 0),
                    r2 = q2 + ws + 1;           // nucleotides window on seq2
                let subseq2 = s2.slice(l2, r2);
                let score = dotter.DnaScoreMatches(subseq1, subseq2, IDENTITY);
                //console.log([i, j], [q1, q2], [l1,r1], [l2,r2], subseq1, subseq2, score)
                if (score > 0) {
                    ctx.globalAlpha = score / window_size;
                    ctx.fillRect(q1 * canvas_pt, q2 * canvas_pt, canvas_pt, canvas_pt)
                    if (i !== j) {
                        ctx.fillRect(q2 * canvas_pt, q1 * canvas_pt, canvas_pt, canvas_pt)
                    }
                }
            }
        }

    }


}

export default DotterPanel;
