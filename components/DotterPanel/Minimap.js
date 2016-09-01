import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './Minimap.css';

import Dotter from './dotter';
import store from '../../core/store';
import { CANVAS_ID_MINIMAP_SQUARE, CANVAS_ID_MINIMAP_LINES } from '../constants/constants';
import { viewRectangleCoordinates } from '../common/helpers';


class Minimap extends React.Component {
    constructor() {
        super();
        this.size = 150;
    }
    render() {
        return <div className={s.root}>
            <SquareLayer size={this.size} />
            <LinesLayer size={this.size} />
        </div>;
    }
}


/**
 * Bottom canvas layer with the square representing the current zooming window.
 */
class SquareLayer extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    componentDidUpdate() {
        this.draw();
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            s1: storeState.s1,
            s2: storeState.s2,
            windowSize: storeState.windowSize,
            zoomLevel: storeState.zoomLevel,
            L: Math.max(storeState.s1.length, storeState.s2.length),
        }
    }

    draw() {
        let size = this.props.size;
        let storeState = store.getState();
        let canvas = document.getElementById(CANVAS_ID_MINIMAP_SQUARE);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, size, size);
        let i = storeState.i, j = storeState.j;
        let rect = viewRectangleCoordinates(i, j, this.state.L, size, this.state.zoomLevel);
        // Draw the view rectangle
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0,0, size, size);
        ctx.fillStyle = "white";
        ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
    }

    render() {
        return <div>
            <canvas id={CANVAS_ID_MINIMAP_SQUARE} height={this.props.size} width={this.props.size} />
        </div>;
    }
}


/**
 * Top canvas layer with the position lines.
 */
class LinesLayer extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    componentDidUpdate() {
        this.draw();
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            zoomLevel: storeState.zoomLevel,
            i: storeState.i,
            j: storeState.j,
            L: Math.max(storeState.s1.length, storeState.s2.length),
        }
    }

    /**
     * Return the pixel corresponding to that sequence index.
     */
    scale(index) {
        return ~~ ((this.props.size / this.state.L) * index);
    }

    draw() {
        let size = this.props.size;
        let zoom = this.state.zoomLevel;
        console.debug(zoom)
        let canvas = document.getElementById(CANVAS_ID_MINIMAP_LINES);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, size, size);
        let i = this.state.i;
        let j = this.state.j;
        let x = this.scale(i);  // where it should be if no zoom
        let y = this.scale(j);
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


export default Minimap;
