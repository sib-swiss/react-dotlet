import React from 'react';
import s from './TwoSeqsPanel.css';
import store from '../../core/store';


class TwoSeqsPanel extends React.Component {

    state = this.getStore();

    getStore() {
        let storeState = store.getState().input;
        return {
            s1: storeState.s1,
            s2: storeState.s2,
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
            <div>
                {JSON.stringify(this.state)}
            </div>
        );
    }
}


export default TwoSeqsPanel;
