import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';
import { changeGreyScale } from '../actions/actionCreators';
import s from './GreyScaleLayer.css';


/**
 * Clickable layer on top of the Density chart,
 * to drag left and right to change the grey scale by shifting the current interval.
 */
class GreyScaleLayer extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.stateFromStore();
        this.mouseDown = false;
        this.initialPos = null;
        this.initialMinGrey = null;
        this.initialMaxGrey = null;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    stateFromStore() {
        return {
            minBound: store.getState().greyScale.minBound,
            maxBound: store.getState().greyScale.maxBound,
        }
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    greyFromInnerPosition(e) {
        let area = e.target;
        let dims = area.getBoundingClientRect();
        let x = e.pageX - dims.left;
        let grey = (x / dims.width) * 255;
        return grey;
    }

    /* Change grey scale when dragging the area left and right */
    onMouseEnter(e) {
        if (this.state.maxBound - this.state.minBound < 255) {
           document.body.style.cursor = "col-resize";
        }
    }
    onMouseLeave(e) { document.body.style.cursor = "default"; }
    onMouseDown(e) {
        this.mouseDown = true;
        this.initialPos = this.greyFromInnerPosition(e);  // we don't care about the value, just a difference from it
        this.initialMinGrey = this.state.minBound;
        this.initialMaxGrey = this.state.maxBound;
    }
    onMouseUp(e) {
        this.mouseDown = false;
        this.initialPos = null;
        this.initialMinGrey = null;
        this.initialMaxGrey = null;
    }
    onMouseMove(e) {
        e.preventDefault();  // otherwise it selects text around the axes
        if (this.mouseDown) {
            let grey = this.greyFromInnerPosition(e);
            let greyShift = grey - this.initialPos;
            if (greyShift > 0) {
                greyShift = Math.min(greyShift, 255-this.initialMaxGrey);
            } else {
                greyShift = - Math.min(-greyShift, this.initialMinGrey);
            }
            if (greyShift !== 0) {
                let newMin = this.initialMinGrey + greyShift;
                let newMax = this.initialMaxGrey + greyShift;
                store.dispatch(changeGreyScale(newMin, newMax));
            }
        }
    }

    render() {
        return (
            <div className={s.root}
               onMouseDown={this.onMouseDown}
               onMouseUp={this.onMouseUp}
               onMouseMove={this.onMouseMove}
               onMouseEnter={this.onMouseEnter}
               onMouseLeave={this.onMouseLeave}
               style={{
                    height: this.props.height,
                    width: this.props.width,
                    marginLeft: this.props.margins.left,
               }}
            />
        );
    }
}


export default GreyScaleLayer;
