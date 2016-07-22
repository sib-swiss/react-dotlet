import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';
import s from './InfoPanel.css';

class InfoPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = store.getState().input;
    }

    stateFromStore() {
        return {};
        //return store.getState();
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    render() {
        return (
            <div id="info-panel">
                <ul>
                    <li>Some useful dynamic stats</li>
                    <li>Some even more useful stats</li>
                </ul>
            </div>
        );
    }
}


export default InfoPanel;
