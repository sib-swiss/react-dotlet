import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './Minimap.css';
import store from '../../core/store';

import { CANVAS_ID_MINIMAP_TOP } from '../constants/constants';
import { getCanvasMouseCoordinates } from '../common/helpers';
import { dragMinimap, changeViewPosition } from '../actions/actionCreators';


/**
 * Top canvas layer to interact with user mouse events.
 */
class MoveLayer extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.mouseDown = false;
        this.initCoords = {};
        this.initRect = {};
        this.shortClick = true;
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            s1: storeState.s1,
            s2: storeState.s2,
            zoomLevel: storeState.zoomLevel,
        }
    }
    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    /**
     * Return the sequence index corresponding to that sequence pixel
     */
    scale(px) {
        let L = Math.max(this.state.s1.length, this.state.s2.length);
        return ~~ ((L / this.props.size) * px);
    }
    /**
     * Return the sequence indices (i,j) at the center of the minmap square `minimapView`.
     */
    seqCoordsFromMinimapView(minimapView) {
        let x = minimapView.x + minimapView.size/2;
        let y = minimapView.y + minimapView.size/2;
        let i = this.scale(x);
        let j = this.scale(y);
        return {i, j};
    }
    /**
     * Draw the region corresponding to the position we click on the minimap.
     */
    viewPosition(mouseEvent) {
        let coords = getCanvasMouseCoordinates(mouseEvent);
        let i = this.scale(coords.x);
        let j = this.scale(coords.y);
        store.dispatch(changeViewPosition(i, j));
    }
    /**
     * Return whether minimap pixel coordinates (x,y) are inside the moving square.
     */
    isInRect(x,y) {
        let storeState = store.getState();
        let rect = storeState.minimapView;
        return (x >= rect.x && x < rect.x + rect.size
        && y >= rect.y && y < rect.y + rect.size);
    }

    /**** EVENTS ****/

    /**
     * If mouse button is held down for more than a few ms,
     * consider it as a drag event instead of simple click.
     */
    _onMouseDown(e) {
        let storeState = store.getState();
        let coords = getCanvasMouseCoordinates(e);
        this.shortClick = true;  // A priori, a simple click is expected
        if (storeState.zoomLevel > 1 && this.isInRect(coords.x, coords.y)) {
            document.body.style.cursor = "move";
            this.initCoords = coords;
            this.initRect = storeState.minimapView;
            this.mouseDown = true;
            this.cancelClickTimeout = setTimeout( () => {
                this.shortClick = false;
            }, 50 );
        }
    }
    /**
     * Release the dragging of the minimap square.
     */
    _onMouseUp(e) {
        clearTimeout( this.cancelClickTimeout );
        if (this.mouseDown && ! this.shortClick) {
            document.body.style.cursor = "default";
            this.mouseDown = false;
            this.shortClick = true;
            let minimapView = store.getState().minimapView;
            let idx = this.seqCoordsFromMinimapView(minimapView);
            store.dispatch(changeViewPosition(idx.i, idx.j));
        }
    }
    /**
     * Move the minimap square, but don't redraw yet (maybe in the future).
     */
    _onMouseMove(e) {
        if (this.mouseDown && ! this.shortClick) {
            let coords = getCanvasMouseCoordinates(e);
            let xShift = coords.x - this.initCoords.x;
            let yShift = coords.y - this.initCoords.y;
            let x = this.initRect.x + xShift;
            let y = this.initRect.y + yShift;
            store.dispatch(dragMinimap(x, y));
        }
    }
    /**
     * Prevent bugs when pointing outside of the canvas while dragging.
     */
    _onMouseLeave(e) {
        document.body.style.cursor = "default";
        if (this.mouseDown && ! this.shortClick) {
            clearTimeout( this.cancelClickTimeout );
            this.mouseDown = false;
            this.shortClick = true;
            this.viewPosition(e);
        }
    }
    /**
     * Move the minimap square to that position and redraw.
     */
    _onClick(e) {
        clearTimeout( this.cancelClickTimeout );
        if (this.shortClick) {
            document.body.style.cursor = "default";
            this.viewPosition(e);
        }
    }

    render() {
        return <div className={s.canvas}>
            <canvas id={CANVAS_ID_MINIMAP_TOP} height={this.props.size} width={this.props.size}
                    onMouseDown={this._onMouseDown}
                    onMouseUp={this._onMouseUp}
                    onMouseMove={this._onMouseMove}
                    onMouseLeave={this._onMouseLeave}
                    onClick={this._onClick}
            />
        </div>;
    }
}


export default MoveLayer;
