import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';
import Slider from 'material-ui/Slider';
import { changeGreyScale } from '../actions/actionCreators';


class GreyScaleSlider extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        let storeState = this.stateFromStore();
        this.state = Object.assign(storeState, {
            widthMin: storeState.maxBound * 100/255,
            widthMax: (255 - storeState.minBound) * 100/255,
            max1: storeState.maxBound,
            min2: storeState.minBound,
        });
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            minBound: storeState.greyScale.minBound,
            maxBound: storeState.greyScale.maxBound,
        };
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    onChangeMinBound(e, value) {
        if (value <= this.state.maxBound) {
            store.dispatch(changeGreyScale(value, this.state.maxBound));
        } else {
            this.setState({minBound: this.state.maxBound});
        }
    }
    onChangeMaxBound(e, value) {
        if (value >= this.state.minBound) {
            store.dispatch(changeGreyScale(this.state.minBound, value));
        }
    }

    onRelaxMinBound(e, value) {
        console.log(e, value, e.target.value, this.state.max1, this.state.minBound, this.state.maxBound)
        this.setState({
            widthMax: (255 - value) * 100/255,
            min2: value,
        });
    }
    onRelaxMaxBound(e, value) {
        console.log(e, value, e.target.value, this.state.max1, this.state.minBound, this.state.maxBound)
        this.setState({
            widthMin: value * 100/255,
            max1: value,
        });
    }

    render() {
        let minBound = this.state.minBound;
        let maxBound = this.state.maxBound;
        //let w1 = maxBound * 100/255;
        //let w2 = (255 - minBound) * 100/255;
        let w1 = this.state.widthMin;
        let w2 = this.state.widthMax;
        console.debug(minBound, maxBound, w1, w2)
        return (<div style={Object.assign(this.props.style, {})}>
            <Slider
                style={{width: w1+'%', float: 'left'}}
                id='greyscale-slider-min'
                sliderStyle={{margin: 0}}
                tabIndex="0" ref='greyscale-slider-min'
                min={0} max={this.state.max1}
                step={1}
                value={minBound}
                onChange={this.onChangeMinBound.bind(this)}
                onDragStop={this.onRelaxMinBound.bind(this)}
            />
            <Slider
                style={{width: w2+'%', float: 'right'}}
                id='greyscale-slider-max'
                axis='x-reverse'
                sliderStyle={{margin: 0}}
                tabIndex="0" ref='greyscale-slider-max'
                min={this.state.min2} max={255}
                step={1}
                value={255 - maxBound}
                onChange={this.onChangeMaxBound.bind(this)}
                onDragStop={this.onRelaxMaxBound.bind(this)}
            />
        </div>);
    }
}


export default GreyScaleSlider;
