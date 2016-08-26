import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './DensityPanel.css';
import store from '../../core/store';

import BarChart from '../BarChart/BarChart';
import GreyScaleSlider from '../GreyScale/GreyScaleSlider';
import GreyScaleLayer from '../GreyScale/GreyScaleLayer';


class DensityPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.stateFromStore();
    }

    stateFromStore() {
        return {
            density: store.getState().density,
        };
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    render() {
        let chartWidth = 300;
        let chartHeight = 200;
        let chartMargins = {top: 5, right: 20, bottom: 30, left: 40};
        return (
            <div id="density-panel" className={s.root} style={{position: 'relative'}}>
                <GreyScaleLayer width={chartWidth} height={chartHeight} margins={chartMargins} />
                <BarChart data={this.state.density} width={chartWidth} height={chartHeight} margins={chartMargins} />
                <GreyScaleSlider style={{paddingLeft: '40px', paddingRight: '20px'}} />
            </div>
        );
    }
}


export default DensityPanel;
