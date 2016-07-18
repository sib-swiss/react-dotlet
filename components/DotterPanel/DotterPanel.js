import React from 'react';
import s from './DotterPanel.css';
import * as dotter from './dotter';
import store from '../../core/store';
import { CANVAS_SIZE } from './constants/constants';


class DotterPanel extends React.Component {
    static propTypes = {
        window_size: React.PropTypes.number,
    };

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
        let state = store.getState().input;
        dotter.fillCanvas(state.s1, state.s2, this.props.window_size);
    }

    componentDidUpdate() {
        let state = store.getState().input;
        dotter.fillCanvas(state.s1, state.s2, this.props.window_size);
    }


}



export default DotterPanel;
