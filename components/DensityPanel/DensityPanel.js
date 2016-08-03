import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './DensityPanel.css';
import store from '../../core/store';
import { toDensity, minMaxObject, object2array } from './helpers';

import BarChart from '../BarChart/BarChart';

class DensityPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.stateFromStore();
    }

    stateFromStore() {
        return {
            scores: store.getState().scores,
        };
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    render() {
        let minmax = minMaxObject(this.state.scores);
        let data = toDensity(this.state.scores);
        data = object2array(data);

        return (
            <div id="density-panel" className={s.root}>
                <BarChart data={data} width={300} height={200} />
            </div>
        );
    }
}


export default DensityPanel;
