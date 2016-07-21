import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './DensityPanel.css';
import store from '../../core/store';
import { minMaxObject, object2array } from './helpers';

/* React-D3 */
import rd3 from 'rd3';
//const LineChart = rd3.LineChart;
const AreaChart = rd3.AreaChart;
const BarChart = rd3.BarChart;


class DensityPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.getStore();
    }

    getStore() {
        return {
            scores: store.getState().input.scores,
        };
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
        let minmax = minMaxObject(this.state.scores);
        let data = object2array(this.state.scores);
        data = [{name: 'dummy', 'values': data}];
        let marginX = 0.1 * minmax.maxX;
        let marginY = 0.1 * minmax.maxY;
        console.log(3, data, minmax)
        return (
            <div id="density-panel" className={s.root}>
                <BarChart
                    data={data}
                    width={400}
                    height={400}
                    viewBoxObject={{
                        x: 0,
                        y: 0,
                        width: 450,
                        height: 400
                    }}
                    xAccessor={ (d) => d ? d.x : 0 }
                    yAccessor={ (d) => d ? d.y : 0 }
                />
               {/*
                domain={ {x: [0 - marginX, minmax.maxX + marginX],
                y: [0, minmax.maxY + marginY], } }
                 */}

                {JSON.stringify(this.state.scores)}
            </div>
        );
    }
}


export default DensityPanel;
