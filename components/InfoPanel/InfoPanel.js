import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';
import s from './InfoPanel.css';
import Dotter from '../DotterPanel/dotter';


class InfoPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = store.getState();
    }

    stateFromStore() {
        return store.getState();
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    render() {
        let state = store.getState();
        let d = new Dotter(state.canvasSize, state.windowSize, state.s1, state.s2, state.scoringMatrix);
        let i = this.state.i, j = this.state.j;
        let score = d.scoreAround(j, i);

        return (
            <div id="info-panel" className={s.root}>
                {`[${d.ls1} x ${d.ls2}] # Score at (${i+1}:${d.s1[i]}, ${j+1}:${d.s2[j]}) : ${score}`}
            </div>
        );
    }
}


export default InfoPanel;
