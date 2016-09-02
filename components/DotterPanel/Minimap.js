import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './Minimap.css';

import store from '../../core/store';
import { CANVAS_ID_MINIMAP_SQUARE, CANVAS_ID_MINIMAP_LINES, CANVAS_ID_MINIMAP_TOP } from '../constants/constants';
import { viewRectangleCoordinates, getCanvasMouseCoordinates } from '../common/helpers';


class Minimap extends React.Component {
    constructor() {
        super();
        this.size = 150;
    }
    render() {
        return <div className={s.root}>
            <SquareLayer size={this.size} />
            <LinesLayer size={this.size} />
            <MoveLayer size={this.size} />
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


/**
 * Bottom canvas layer with the square representing the current zooming window.
 */
class SquareLayer extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.mouseDown = false;
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
    }

    stateFromStore() {
        let storeState = store.getState();
        let rect = viewRectangleCoordinates(storeState.i, storeState.j, storeState.L, this.props.size, storeState.zoomLevel);
        return {
            s1: storeState.s1,
            s2: storeState.s2,
            //windowSize: storeState.windowSize,
            rect: rect,
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

    _onMouseDown() {
        this.mouseDown = true;
        document.body.style.cursor = "move";
    }
    _onMouseUp() {
        this.mouseDown = false;
        document.body.style.cursor = "default";
    }
    _onMouseMove() {
        console.debug(this.mouseDown)
    }

    draw() {
        let size = this.props.size;
        let rect = this.state.rect;
        // Draw the view rectangle
        let canvas = document.getElementById(CANVAS_ID_MINIMAP_SQUARE);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, size, size);
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0,0, size, size);
        ctx.fillStyle = "white";
        ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
    }

    render() {
        return <div>
            <canvas id={CANVAS_ID_MINIMAP_SQUARE} height={this.props.size} width={this.props.size}
                    onMouseDown={this._onMouseDown} onMouseUp={this._onMouseUp}
                    onMouseMove={this._onMouseMove} />
        </div>;
    }
}


/**
 * Top canvas layer to interact with user mouse events.
 */
class MoveLayer extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.mouseDown = false;
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
    }

    stateFromStore() {
        let storeState = store.getState();
        let rect = viewRectangleCoordinates(storeState.i, storeState.j, storeState.L, this.props.size, storeState.zoomLevel);
        return {
            s1: storeState.s1,
            s2: storeState.s2,
            zoomLevel: storeState.zoomLevel,
            rect: rect,
        }
    }
    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }
    componentDidUpdate() {
    }

    isInRect(x,y) {
        let rect = this.state.rect;
        return (x >= rect.x && x < rect.x + rect.size
             && y >= rect.y && y < rect.y + rect.size);
    }

    _onMouseDown(e) {
        document.body.style.cursor = "move";
        let coords = getCanvasMouseCoordinates(e);
        if (this.isInRect(coords.x, coords.y)) {
            this.mouseDown = true;
        }
    }
    _onMouseUp() {
        this.mouseDown = false;
        document.body.style.cursor = "default";
    }
    _onMouseMove() {
        if (this.mouseDown) {
        }
    }

    render() {
        return <div className={s.canvas}>
            <canvas id={CANVAS_ID_MINIMAP_TOP} height={this.props.size} width={this.props.size}
                    onMouseDown={this._onMouseDown} onMouseUp={this._onMouseUp}
                    onMouseMove={this._onMouseMove} />
        </div>;
    }
}




export default Minimap;
