import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import { changeGreyScale } from '../actions/actionCreators';
import s from './GreyScaleSlider.css';

/**
 * Two sliders to change the grey scale, one for the white threshold,
 * the second for the black threshold.
 */
class GreyScaleSlider extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.stateFromStore();
        //Object.assign(this.state, {
        //    widthMin: 100,
        //    widthMax: 100,
        //});
        this.onChangeMinBound = this.onChangeMinBound.bind(this);
        this.onChangeMaxBound = this.onChangeMaxBound.bind(this);
        //this.onRelaxMinBound = this.onRelaxMinBound.bind(this);
        //this.onRelaxMaxBound = this.onRelaxMaxBound.bind(this);
        //this.onTest = this.onTest.bind(this);
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

    onChangeMinBound(e, value) {
        //if (value <= this.state.maxBound) {
            store.dispatch(changeGreyScale(value, this.state.maxBound));
        //} else {
        //    this.setState({minBound: this.state.maxBound});
        //}
    }
    onChangeMaxBound(e, v) {
        let value = 255 - v;
        //if (value >= this.state.minBound) {
            store.dispatch(changeGreyScale(this.state.minBound, value));
        //} else {
        //    this.setState({maxBound: 225 - this.state.minBound});
        //}
    }

    //onRelaxMinBound(e, x) {
    //    let value = this.refs['greyscale-slider-min'].state.value;
    //    console.log(777, value, e, e.target.value, x)
    //    this.setState({
    //        widthMax: (255 - value) * 100/255,
    //        minBound: value,
    //    });
    //}
    //onRelaxMaxBound(e) {
    //    let value = this.refs['greyscale-slider-max'].state.value;
    //    console.warn(888, value, e);
    //    this.setState({
    //        widthMin: (255 - value) * 100/255,
    //        maxBound: 255 - value,
    //    });
    //}
    //onTest(e, value) {
    //    console.log(999, value, e.target.value, this.refs['greyscale-slider-min'].state.value)
    //}

    /**
     * Superpose two sliders to give the illusion of a range slider.
     * The superposition is the doing of the negative margin-right on the first slider.
     */
    render() {
        let min = this.state.minBound;
        let max = this.state.maxBound;
        let margins = this.props.margins;
        //let w1 = this.state.widthMin;
        //let w2 = this.state.widthMax;
        let w1 = 100, w2 = 100;
        //console.debug('-', min, max, w1, w2)
        //console.debug('-', [0, max], min)
        //console.debug('-', [min, 255], 255-max)
        let minPercentage = Math.round(this.state.minBound * (100/255))+'%';
        let maxPercentage = Math.round(this.state.maxBound * (100/255))+'%';
        
        return <div style={{paddingLeft: margins.left, paddingRight: margins.right}}>
            <Slider
                style={{width: w1+'%', float: 'left'}}
                id='greyscale-slider-min'
                sliderStyle={{margin: 0}}
                tabIndex="0" ref='greyscale-slider-min'
                min={0} max={255}
                step={1}
                value={min}
                onChange={this.onChangeMinBound}
            /><textarea className={s.sliderPercentage} value={minPercentage} onChange={this.onChangeMinBound} disabled/>
            <Slider
                style={{width: w2+'%', float: 'right'}}
                id='greyscale-slider-max'
                axis='x-reverse'
                sliderStyle={{margin: 0}}
                tabIndex="0" ref='greyscale-slider-max'
                min={0} max={255}  // 255-0
                step={1}
                value={(255 - max)}
                onChange={this.onChangeMaxBound}
            /><textarea className={s.sliderMaxPercentage} value={maxPercentage} onChange={this.onChangeMaxBound} disabled/>
        </div>;
    }
}

// <Slider style={{width: w1+'%', float: 'left'}}, marginRight: '-'+w1+'%'}}
//min={0} max={max}
//min={0} max={255-min}
//onDragStop={(e, value) => this.onRelaxMinBound(e, value)}
//onDragStop={this.onRelaxMaxBound}

export default GreyScaleSlider;
