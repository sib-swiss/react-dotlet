import React from 'react';
import s from './DensityPanel.css';
import store from '../../core/store';


class DensityPanel extends React.Component {

    state = this.getStore()

    getStore() {
        return {
            scores: store.getState().input.scores,
        }
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.getStore() );
        });
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        return (
            <div id="density-panel" className={s.densityPanel}>
                {JSON.stringify(this.state.scores)}
            </div>
        );
    }
}


export default DensityPanel;
