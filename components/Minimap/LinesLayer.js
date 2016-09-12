import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './Minimap.css';
import store from '../../core/store';

import { CANVAS_ID_MINIMAP_LINES } from '../constants/constants';


/**
 * Middle canvas layer with the position lines.
 */
class LinesLayer extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            zoomLevel: storeState.zoomLevel,
            i: storeState.i,
            j: storeState.j,
            s1: storeState.s1,
            s2: storeState.s2,
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

    /**
     * Return the pixel corresponding to that sequence index.
     */
    scale(index) {
        let L = Math.max(this.state.s1.length, this.state.s2.length);
        return ~~ ((this.props.size / L) * index);
    }

    draw() {
        let size = this.props.size;
        let zoom = this.state.zoomLevel;
        let x = this.scale(this.state.i);
        let y = this.scale(this.state.j);
        // Draw
        let canvas = document.getElementById(CANVAS_ID_MINIMAP_LINES);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, size, size);
        ctx.fillStyle = "red";
        ctx.fillRect(x+0.5, 0, 1, size);
        ctx.fillRect(0, y+0.5, size, 1);
    }

    render() {
        return <div className={s.canvas}>
            <canvas id={CANVAS_ID_MINIMAP_LINES} height={this.props.size} width={this.props.size} />
        </div>;
    }
}


export default LinesLayer;
