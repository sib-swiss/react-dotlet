import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';


class GreyScaleGradient extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.stateFromStore();
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

    render() {
        let width = this.props.width;
        let height = this.props.height;
        let min = this.state.minBound * (100/255);
        let max = this.state.maxBound * (100/255);
        let margins = this.props.margins;

        return <div style={{marginLeft: margins.left, marginTop: margins.top}}>
            <svg width={width} height={height}>
                <defs>
                    <linearGradient id="greyscale-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="black" stopOpacity="100%" />
                        <stop offset={min+"%"} stopColor="black" stopOpacity="100%" />
                        <stop offset={max+"%"} stopColor="white" stopOpacity="100%" />
                        <stop offset="100%" stopColor="white" stopOpacity="100%" />
                    </linearGradient>
                </defs>
                <rect x={0} y={0} width={width} height={height}
                      fill="url(#greyscale-gradient)">
                </rect>
            </svg>
        </div>;
    }
}


export default GreyScaleGradient;
