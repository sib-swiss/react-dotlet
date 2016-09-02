import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Dotter from './dotter';
import store from '../../core/store';
import { CANVAS_ID_LINES } from '../constants/constants';
import { inspectCoordinate } from '../actions/actionCreators';
import { viewRectangleCoordinates } from '../common/helpers';


class PositionLinesLayer extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.mouseDown = false;
        this.state = this.stateFromStore();
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            i: storeState.i,
            j: storeState.j,
        }
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }
    componentDidMount() {
        document.addEventListener('keydown', this._onKeyDown, true);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this._onKeyDown, true);
    }
    componentDidUpdate() {
        this.drawPositionLines();
    }

    /**
     * Draw the vertical and horizontal lines showing the current position (i,j) on the canvas.
     */
    drawPositionLines() {
        let state = store.getState();
        let zoomLevel = this.props.zoomLevel;

        /* Compute the pixel coordinates in the square view that correspond
           to the currenly looked-up sequence indices. */
        var d = new Dotter(state);
        let x = d.coordinateFromSeqIndex(this.state.i);
        let y = d.coordinateFromSeqIndex(this.state.j);
        let view = state.view;
        x = (x - view.x) * zoomLevel;
        y = (y - view.y) * zoomLevel;

        /* If the point size is > 1, make the lines pass in the middle. */
        if (this.smallSequence) {
            x += d.scaleToPx / 2 + 0.5;
            y += d.scaleToPx / 2 + 0.5;
        }

        /* Draw */
        let canvas = document.getElementById(CANVAS_ID_LINES);
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.fillRect(x, 1, 1, canvas.width);
        ctx.fillRect(1, y, canvas.height, 1);
    }

    _onMouseEnter() { document.body.style.cursor = "crosshair"; }
    _onMouseLeave() { document.body.style.cursor = "default"; }
    _onMouseDown() { this.mouseDown = true; }
    _onMouseUp() { this.mouseDown = false;         }
    _onMouseMove(e) {
        if (this.mouseDown) {
            this.inspect(e);
        }
    }
    _onClick(e) {
        this.inspect(e);
    }
    _onKeyDown(e) {
        if ( document.activeElement.tagName.toLowerCase() === 'textarea'
          || document.activeElement.tagName.toLowerCase() === 'input' ) {
            return;
        }
        var keyCode = e.keyCode;
        var direction;
        switch (e.keyCode) {
            case 37: direction = 'left'; break;
            case 38: direction = 'up'; break;
            case 39: direction = 'right'; break;
            case 40: direction = 'down'; break;
            default: return;
        }
        let j = this.state.j,
            i = this.state.i;
        let state = store.getState();
        let ls1 = state.s1.length,
            ls2 = state.s2.length;
        switch (direction) {
            case 'down':  if (j < ls2-1) j++; break;
            case 'up':    if (j > 0)     j--; break;
            case 'right': if (i < ls1-1) i++; break;
            case 'left':  if (i > 0)     i--; break;
        }
        store.dispatch(inspectCoordinate(i, j));
    }

    /*
     * Get the mouse coordinates relative to the canvas position,
     * deduce the approximate corresponding sequence characters indices `i` and `j`,
     * and fire an action.
     */
    inspect(event) {
        let state = store.getState();
        let canvasSize = this.props.canvasSize;
        let zoomLevel = this.props.zoomLevel;

        // Get canvas coordinates
        let canvas = event.target;
        let dims = canvas.getBoundingClientRect();
        let x = event.pageX - dims.left,
            y = event.pageY - dims.top;

        // Return corresponding char indices
        let view = state.view;
        let d = new Dotter(state);
        let i = d.seqIndexFromCoordinate(view.x + x/zoomLevel);
        let j = d.seqIndexFromCoordinate(view.y + y/zoomLevel);

        // Make sure we don't get out of seq bounds while dragging
        i = Math.min(Math.max(0, i), d.ls1-1);
        j = Math.min(Math.max(0, j), d.ls2-1);

        store.dispatch(inspectCoordinate(i, j));
    }


    render() {
        let canvasSize = this.props.canvasSize;
        return (
            <canvas id={CANVAS_ID_LINES}
                    width={canvasSize}
                    height={canvasSize}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        zIndex: 1,
                    }}
                    onMouseDown={this._onMouseDown}
                    onMouseUp={this._onMouseUp}
                    onMouseMove={this._onMouseMove}
                    onMouseEnter={this._onMouseEnter}
                    onMouseLeave={this._onMouseLeave}
                    onClick={this._onClick}
            >
            </canvas>
        );
    }
}


export default PositionLinesLayer;
