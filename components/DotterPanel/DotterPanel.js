import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './DotterPanel.css';
import * as dotter from './dotter';
import store from '../../core/store';
import { CANVAS_ID, CANVAS_SIZE } from '../constants/constants';
import { inspectCoordinate } from '../actions/actionCreators';


class DotterPanel extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = Object.assign(
            this.stateFromStore(), {
            canvasSize: CANVAS_SIZE,
        });
        this._onResize = this._onResize.bind(this);
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            alphas: storeState.greyScale.initialAlphas,
            windowSize: storeState.windowSize,
            scoringMatrix: storeState.scoringMatrix,
        }
    }

    /* Lifecycle */

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }
    componentDidMount() {
        window.addEventListener('resize', this._onResize);
    }
    componentWillUnmount() {
        window.addEventListener('resize', this._onResize);
    }
    componentDidUpdate() {
        let greyScale = store.getState().greyScale;
        let scaledAlphas = dotter.rescaleAlphas(greyScale.initialAlphas, greyScale.minBound, greyScale.maxBound);
        dotter.fillCanvas(scaledAlphas);
    }

    /* Events */

    _onResize() {
        let _this = this;
        clearTimeout(window.resizedFinished);
        window.resizedFinished = setTimeout(function() {
            _this.setState({
                canvasSize: 0.33 * window.innerWidth,
            });
        }, 250);
    }

    render() {
        let canvasSize = this.state.canvasSize;
        return (
            <div className={s.root}>
                <div className={s.legendX}>{"Sequence 1"}</div>
                <div>
                    <div className={s.legendY}>{"Sequence 2"}</div>
                    <div style={{position: 'relative', minHeight: canvasSize, minWidth: canvasSize}}>

                        {/* Bottom layer: the dot plot */}

                        <canvas id={CANVAS_ID}
                                className={s.canvas}
                                width={canvasSize}
                                height={canvasSize}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    zIndex: 0,
                                }}
                        ></canvas>

                        {/* Top layer: the lines indicating the current position */}

                        <PositionLinesLayer canvasSize={canvasSize} />

                    </div>
                </div>
            </div>
        );
    }
}



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
        return {
            i: store.getState().i,
            j: store.getState().j,
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

    _onClick(e) {
        this.inspect(e);
    }
    _onMouseDown() {
        this.mouseDown = true;
        document.body.style.cursor = "crosshair";
    }
    _onMouseUp() {
        this.mouseDown = false;
        document.body.style.cursor = "default";
    }
    _onMouseMove(e) {
        if (this.mouseDown) {
            this.inspect(e);
        }
    }
    _onKeyDown(e) {
        if ( document.activeElement.tagName.toLowerCase() === 'textarea') {
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
        let state = store.getState();
        let j = state.j,
            i = state.i;
        let ls1 = state.s1.length,
            ls2 = state.s2.length;
        switch (direction) {
            case 'down':  if (j < ls2-1) j++; break;
            case 'up':    if (j > 0)     j--; break;
            case 'right': if (i < ls1-1) i++; break;
            case 'left':  if (i > 0)     i--; break;
        }
        dotter.drawPositionLines(i, j, ls1, ls2, this.props.canvasSize);
        store.dispatch(inspectCoordinate(i, j));
    }

    /*
     * Get the mouse coordinates relative to the canvas position,
     * deduce the approximate corresponding sequence characters indices `i` and `j`,
     * and fire an action.
     */
    inspect(event) {
        let canvasSize = this.props.canvasSize;
        // Get canvas coordinates
        let canvas = event.target;
        let dims = canvas.getBoundingClientRect();
        let x = event.pageX - dims.left,
            y = event.pageY - dims.top;
        // Fetch store state to get the seq lengths
        let state = store.getState();
        let ls1 = state.s1.length,
            ls2 = state.s2.length;
        let L = Math.max(ls1, ls2);
        // Return corresponding char indices
        let i = dotter.seqIndexFromCoordinate(x, L, canvasSize);
        let j = dotter.seqIndexFromCoordinate(y, L, canvasSize);
        // Make sure we don't get out of bounds while dragging
        i = Math.min(Math.max(0, i), ls1-1);
        j = Math.min(Math.max(0, j), ls2-1);
        // Draw and dispatch
        dotter.drawPositionLines(i, j, ls1, ls2, canvasSize);
        store.dispatch(inspectCoordinate(i, j));
    }


    render() {
        return (
            <canvas id={CANVAS_ID +'-topLayer'}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    style={{
                        width: this.props.canvasSize,
                        height: this.props.canvasSize,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        zIndex: 1,
                    }}
                    onMouseDown={this._onMouseDown}
                    onMouseUp={this._onMouseUp}
                    onMouseMove={this._onMouseMove}
                    onClick={this._onClick}
            >
            </canvas>
        );
    }
}



export default DotterPanel;
