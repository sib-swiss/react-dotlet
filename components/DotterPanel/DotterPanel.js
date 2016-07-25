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
        window.addEventListener('keydown', this._onKeyDown, true)
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this._onKeyDown, true)
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

    render() {
        return (
            <div className={s.root} style={{position: 'relative', minHeight: CANVAS_SIZE}}>
                <canvas id={CANVAS_ID}
                        className={s.canvas}
                        width={CANVAS_SIZE}
                        height={CANVAS_SIZE}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            zIndex: 0,
                        }}
                ></canvas>
                <canvas id={CANVAS_ID +'-topLayer'}
                        width={CANVAS_SIZE}
                        height={CANVAS_SIZE}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            zIndex: 1,
                        }}
                        onClick={this._onClick}
                >
                </canvas>
            </div>
        );
    }
}



export default DotterPanel;
