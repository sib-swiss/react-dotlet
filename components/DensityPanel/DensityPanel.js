import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './DensityPanel.css';
import store from '../../core/store';
import { toDensity, minMaxObject, object2array } from './helpers';

/* React-D3 */
import rd3 from 'rd3';
const BarChart = rd3.BarChart;


class DensityPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.getStore();
    }

    getStore() {
        return {
            scores: store.getState().scores,
        };
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.getStore() );
        });
    }

    render() {
        let minmax = minMaxObject(this.state.scores);
        let data = toDensity(this.state.scores)
        data = object2array(data);
        data = [{name: 'dummy', 'values': data}];
        let marginX = 0.1 * minmax.maxX;
        let marginY = 0.1 * minmax.maxY;
        return (
            <div id="density-panel" className={s.root}>
                <div className={s.centerMe}>
                    <BarChart
                        data={data}
                        width={250}
                        height={250}
                        viewBoxObject={{
                            x: 0,
                            y: 0,
                            width: 250,
                            height: 250,
                        }}
                        xAccessor={ (d) => d ? d.x : 0 }
                        yAccessor={ (d) => d ? d.y : 0 }
                    />
                   {/*
                    domain={ {x: [0 - marginX, minmax.maxX + marginX],
                    y: [0, minmax.maxY + marginY], } }
                    {JSON.stringify(this.state.scores)}
                     */}
                </div>
            </div>
        );
    }
}


export default DensityPanel;
