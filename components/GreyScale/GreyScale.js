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
        this.onChangeGreyScale = this.onChangeGreyScale.bind(this);
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

    onChangeGreyScale(e, value) {
        store.dispatch(changeGreyScale(value, this.state.maxAlpha));
    }

    render() {
        let min = this.state.minAlpha;
        let max = this.state.maxAlpha;
        console.debug(min, max, this.state.minBound)
        return (
            <Slider
                id='greyscale-slider'
                sliderStyle={{margin: 0}}
                tabIndex="0" ref='greyscale-slider'
                min={min} max={max}
                step={1}
                disabled={max === min}
                value={this.state.minBound}
                onChange={this.onChangeGreyScale}
            />

        );
    }
}


export default GreyScaleSlider;
