import React from 'react';
import s from './TwoSeqsPanel.css';
import store from '../../core/store';


class TwoSeqsPanel extends React.Component {

    state = this.getStore();

    getStore() {
        let storeState = store.getState();
        return {
            s1: storeState.input.s1,
            s2: storeState.input.s2,
            i: storeState.dotter.i,
            j: storeState.dotter.j,
        }
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.getStore() );
        });
    }

    render() {
        return (
            <div>
                {JSON.stringify(this.state)}
            </div>
        );
    }
}


export default TwoSeqsPanel;
