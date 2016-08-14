import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './DensityPanel.css';
import store from '../../core/store';

import BarChart from '../BarChart/BarChart';
import GreyScaleSlider from '../GreyScale/GreyScale';


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
        return (
            <div id="density-panel" className={s.root}>
                <BarChart data={this.state.density} width={300} height={200} />
                <GreyScaleSlider style={{paddingLeft: '40px', paddingRight: '20px'}}/>
            </div>
        );
    }
}


export default DensityPanel;
