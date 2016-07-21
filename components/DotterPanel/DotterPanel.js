import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './DotterPanel.css';
import * as dotter from './dotter';
import store from '../../core/store';
import { CANVAS_SIZE } from '../constants/constants';
import { inspectCoordinate } from './actions/actionCreators';


class DotterPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidUpdate() {
        let state = store.getState().input;
        dotter.fillCanvas(state.s1, state.s2, state.windowSize, state.scoringMatrix);
    }

    _onClick(e) {
        let state = store.getState().input;
        let cv = e.target;
        let dims = cv.getBoundingClientRect();
        let x = e.pageX - dims.left,
            y = e.pageY - dims.top;
        let ls1 = state.s1.length,
            ls2 = state.s2.length;
        let L = Math.max(ls1, ls2);
        let i = dotter.seqIndexFromCoordinate(x, L);
        let j = dotter.seqIndexFromCoordinate(y, L);
        store.dispatch(inspectCoordinate(Math.min(i,ls1), Math.min(j,ls2)));
    }

    /*
     * Return the index on the sequence `seq` corresponding to pixel coordinate `px` (approximately).
     * @param px: position clicked on the canvas.
     * @param L: matrix size (max sequence length).
     */
    seqIndexFromCoordinate(px, L, canvasSize=CANVAS_SIZE) {
        let ratio = px / canvasSize;  // x or y: the canvas is square
        let index = Math.floor(L * ratio);
        return index;
    }

    render() {
        return (
            <div className={s.canvasContainer}>
                <canvas id='dotter-canvas'
                        ref={(c) => this._refDotterCanvas = c}
                        className={s.canvas}
                        width={CANVAS_SIZE}
                        height={CANVAS_SIZE}
                        onClick={this._onClick}
                ></canvas>
            </div>
        );
    }
}



export default DotterPanel;
