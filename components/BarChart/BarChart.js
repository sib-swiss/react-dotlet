'use strict';

/*
 * Source: https://github.com/adeveloperdiary/react-d3-charts
 * simplified and updated to D3 v4.
 */

import React from 'react';
import * as d3scale from 'd3-scale';
import * as d3array from 'd3-array';


class BarChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = { width: 300 };
    }

    static get propTypes() {
        return {
            data: React.PropTypes.array,  // Typically some [{key: value}, ...]
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            chartId: React.PropTypes.string,
            color: React.PropTypes.string,
        };
    }

    static get defaultProps() {
        return {
            width: 300,
            height: 70,
            chartId: 'v_chart',
            color: "#5E6EC7",
        };
    }

    render() {
        var _this = this;
        var data = this.props.data;
        //console.log("data = "+ JSON.stringify(data, null, 2))

        if (data.length === 0) {
            return <div></div>;
        }

        var margin = {top: 5, right: 5, bottom: 5, left: 5},
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);

        var transform='translate('+margin.left+','+margin.top+')';

        var x = d3scale.scaleBand()
            .domain(data.map(d => d.x))
            .rangeRound([0, this.state.width])
            .paddingInner(0.2)

        var y = d3scale.scaleLinear()
            .domain([0, d3array.max(data, d => d.y)])
            .range([h, 0]);

        var rectForeground = data.map(function(d, i) {
            return (
                <rect fill={_this.props.color} rx="3" ry="3" key={i}
                      x={x(d.x)} y={y(d.y)} className="shadow"
                      height={h-y(d.y)}
                      width={x.bandwidth()}/>
            )
        });

        return(
            <div>
                <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
                    <g transform={transform}>
                        {rectForeground}
                    </g>
                </svg>
            </div>
        );
    }

}


export default BarChart;


