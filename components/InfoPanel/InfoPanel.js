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

    //calculateMean(scores) {
    //    let mean = 0;
    //    let n = 0;
    //    for (let key of Object.keys(scores)) {
    //        let val = scores[key];
    //        mean += key * val;
    //        n += val;
    //    }
    //    return n > 0 ? (mean / n).toFixed(2) : 0;
    //}

    render() {
        let state = store.getState();
        let d = new Dotter(state.canvasSize, state.windowSize, state.s1, state.s2, state.scoringMatrix);
        let i = state.i, j = state.j;
        let score = d.scoreAround(i, j);

        return (
            <div id="info-panel" className={s.root}>
                <ul>
                    <li>Sequence 1 length: {d.ls1}</li>
                    <li>Sequence 2 length: {d.ls2}</li>
                    <li>{`Score at (${i+1}:${d.s1[i]}, ${j+1}:${d.s2[j]}) : ${score}`}</li>
                </ul>
            </div>
        );
    }
}


export default InfoPanel;
