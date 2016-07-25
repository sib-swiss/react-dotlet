import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './DotterPanel.css';
import * as dotter from './dotter';
import store from '../../core/store';
import { CANVAS_SIZE, CANVAS_ID } from '../constants/constants';
import { inspectCoordinate, keyboardArrowShiftCoordinate } from '../actions/actionCreators';


class DotterPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', (e) => this._onKeyDown(e), true)
    }
    componentWillUnmount() {
        //window.removeEventListener('scroll', (e) => this._onKeyDown)
    }

    componentDidUpdate() {
        let state = store.getState();
        dotter.fillCanvas(state.s1, state.s2, state.windowSize, state.scoringMatrix);
    }

    _onKeyDown(e) {
        var keyCode = e.keyCode;
        var direction;
        switch (e.keyCode) {
            case 37: direction = 'left'; break;
            case 38: direction = 'up'; break;
            case 39: direction = 'right'; break;
            case 40: direction = 'down'; break;
            default: return;
        }
        store.dispatch(keyboardArrowShiftCoordinate(direction));
    }

    _onClick(e) {
        let state = store.getState();
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
            <div className={s.root}>
                <canvas id={CANVAS_ID}
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
