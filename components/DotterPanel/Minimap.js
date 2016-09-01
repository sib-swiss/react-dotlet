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
        this.state = this.stateFromStore();
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
            i: storeState.i,
            j: storeState.j,
            L: Math.max(storeState.s1.length, storeState.s2.length),
        }
    }

    draw() {
        let canvas = document.getElementById(CANVAS_ID_MINIMAP_SQUARE);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, this.size, this.size);
        let i = this.state.i, j = this.state.j;
        let rect = viewRectangleCoordinates(i, j, this.state.L, this.size, this.state.zoomLevel);
        // Draw the view rectangle
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0,0, this.size, this.size);
        ctx.fillStyle = "white";
        ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
        // Draw the position lines
        let x = this.scale(i);
        let y = this.scale(j);
        ctx.fillStyle = "red";
        ctx.fillRect(x+0.5, 0, 1, this.size);
        ctx.fillRect(0, y+0.5, this.size, 1);
    }

    render() {
        return <div className={s.root}>
            <canvas id={CANVAS_ID_MINIMAP_SQUARE} height={this.size} width={this.size} className={s.canvas} />
        </div>;
    }
}


class SquareLayer extends React.Component {
    constructor() {
        super();
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
            L: Math.max(storeState.s1.length, storeState.s2.length),
        }
    }

    draw() {
        let storeState = store.getState();
        let canvas = document.getElementById(CANVAS_ID_MINIMAP_SQUARE);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, this.size, this.size);
        let i = storeState.i, j = storeState.j;
        let rect = viewRectangleCoordinates(i, j, this.state.L, this.size, this.state.zoomLevel);
        // Draw the view rectangle
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0,0, this.size, this.size);
        ctx.fillStyle = "white";
        ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
    }

    render() {
        return <div>
            <canvas id={CANVAS_ID_MINIMAP_SQUARE} height={this.props.size} width={this.props.size} />
        </div>;
    }
}


class LinesLayer extends React.Component {
    constructor() {
        super();
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
            i: storeState.i,
            j: storeState.j,
            L: Math.max(storeState.s1.length, storeState.s2.length),
        }
    }

    /**
     * Return the pixel corresponding to that sequence index.
     */
    scale(index) {
        return ~~ ((this.size / this.state.L) * index);
    }

    draw() {
        let canvas = document.getElementById(CANVAS_ID_MINIMAP_LINES);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, this.size, this.size);
        let i = this.state.i, j = this.state.j;
        let x = this.scale(i);
        let y = this.scale(j);
        ctx.fillStyle = "red";
        ctx.fillRect(x+0.5, 0, 1, this.size);
        ctx.fillRect(0, y+0.5, this.size, 1);
    }

    render() {
        return <div>
            <canvas id={CANVAS_ID_MINIMAP_LINES} height={this.props.size} width={this.props.size} />
        </div>;
    }
}


export default Minimap;
