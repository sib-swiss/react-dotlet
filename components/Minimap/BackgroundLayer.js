import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './Minimap.css';

import store from '../../core/store';
import { CANVAS_ID, CANVAS_ID_MINIMAP_BOTTOM } from '../constants/constants';


/**
 * The bottom layer that has a smaller copy of the non-zoomed dot plot.
 */
class BackgroundLayer extends React.Component {
    constructor() {
        super();
        this.state = this.stateFromStore();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            s1: storeState.s1,
            s2: storeState.s2,
            scoresUpdated: storeState.scoresUpdated,
            canvasSize: storeState.canvasSize,
        }
    }
    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }
    componentDidUpdate() {
        this.draw();
    }

    draw() {
        let size = this.props.size;
        let storeState = store.getState();
        let canvas = document.getElementById(CANVAS_ID_MINIMAP_BOTTOM);
        let ctx = canvas.getContext("2d");
        if (storeState.zoomLevel === 1) {
            let mainCanvas = document.getElementById(CANVAS_ID);
            ctx.clearRect(0,0, size, size);
            ctx.drawImage(mainCanvas, 0,0, size, size);
        }
    }

    render() {
        return <div>
            <canvas id={CANVAS_ID_MINIMAP_BOTTOM} height={this.props.size} width={this.props.size} />
        </div>;
    }
}


export default BackgroundLayer;

