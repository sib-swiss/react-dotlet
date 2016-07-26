'use strict';

/*
 * Source: https://github.com/adeveloperdiary/react-d3-charts
 * simplified and updated to D3 v4.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import * as d3scale from 'd3-scale';
import * as d3array from 'd3-array';
import * as d3axis from 'd3-axis';
import * as d3selection from 'd3-selection';


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
        let _this = this;
        let data = this.props.data;
        data = data.sort((a,b) => a.x - b.x);
        let N = data.length;
        let maxY = d3array.max(data, d => d.y);
        let maxX = d3array.max(data, d => d.x);
        let minX = d3array.min(data, d => d.x);
        //console.log("data = "+ JSON.stringify(data, null, 2))

        if (data.length === 0) {
            return <div></div>;
        }

        let margin = {top: 5, right: 20, bottom: 30, left: 40},
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);

        let transform = 'translate('+ margin.left +','+ margin.top +')';

        /* Axes */

        let x = d3scale.scaleBand()
            .domain(data.map(d => d.x))
            .rangeRound([0, w])
            .paddingInner(0.2);

        let y = d3scale.scaleLinear()
            .domain([0, maxY])
            .range([h, 0]);

        let xAxis = d3axis.axisBottom(x)
            .scale(x)
            .tickValues([minX, 0, maxX]);

        let yAxis = d3axis.axisLeft(y)
            .ticks(5);

        /* Bars */

        let rectForeground = data.map(function(d, i) {
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
                        <Axis h={h} axis={yAxis} axisType="y" />
                        <Axis h={h} axis={xAxis} axisType="x"/>
                    </g>
                </svg>
            </div>
        );
    }

}


class Axis extends React.Component {
    componentDidUpdate() { this.renderAxis(); }
    componentDidMount() { this.renderAxis(); }

    renderAxis() {
        var node = ReactDOM.findDOMNode(this);
        d3selection.select(node).call(this.props.axis);
    }

    render() {
        var translate = "translate(0,"+(this.props.h)+")";
        return (
            <g className="axis" transform={this.props.axisType=='x'?translate:""} >
            </g>
        );
    }
}

Axis.propTypes = {
    h: React.PropTypes.number,
    axis: React.PropTypes.func,
    axisType: React.PropTypes.oneOf(['x','y'])
};


export default BarChart;


