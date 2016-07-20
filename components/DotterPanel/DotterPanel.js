import React from 'react';
import s from './DotterPanel.css';
import * as dotter from './dotter';
import store from '../../core/store';
import { CANVAS_SIZE } from '../constants/constants';
import { inspectCoordinate } from './actions/actionCreators';


class DotterPanel extends React.Component {

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
        let i = dotter.seqPosFromCoordinate(x, state.s1);
        let j = dotter.seqPosFromCoordinate(y, state.s2);
        store.dispatch(inspectCoordinate(i, j));
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
