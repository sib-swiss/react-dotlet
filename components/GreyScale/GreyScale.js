import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';
import Slider from 'material-ui/Slider';
import { changeGreyScale } from '../actions/actionCreators';


class GreyScaleSlider extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.stateFromStore();
        this.onChangeMinBound = this.onChangeMinBound.bind(this);
        this.onChangeMaxBound = this.onChangeMaxBound.bind(this);
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            minBound: storeState.greyScale.minBound,
            maxBound: storeState.greyScale.maxBound,
            minAlpha: storeState.greyScale.minAlpha,
            maxAlpha: storeState.greyScale.maxAlpha,
        };
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    onChangeMinBound(e, value) {
        store.dispatch(changeGreyScale(value, this.state.maxBound));
    }
    onChangeMaxBound(e, value) {
        store.dispatch(changeGreyScale(this.state.minBound, value));
    }

    render() {
        let min = this.state.minAlpha;
        let max = this.state.maxAlpha;
        console.debug('GreyScale:', min, max, this.state.minBound, this.state.maxBound)
        return (<div>
            <Slider
                id='greyscale-slider-min'
                sliderStyle={{margin: 0}}
                tabIndex="0" ref='greyscale-slider'
                min={min} max={max}
                step={1}
                disabled={max <= min}
                value={this.state.minBound}
                onChange={this.onChangeMinBound}
            />
            <Slider
                id='greyscale-slider-max'
                sliderStyle={{margin: 0}}
                tabIndex="0" ref='greyscale-slider'
                min={min} max={max}
                step={1}
                disabled={max <= min}
                value={this.state.maxBound}
                onChange={this.onChangeMaxBound}
            />
        </div>);
    }
}


export default GreyScaleSlider;
