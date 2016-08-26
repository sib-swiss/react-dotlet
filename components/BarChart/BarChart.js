'use strict';

/*
 * Source: https://github.com/adeveloperdiary/react-d3-charts
 * simplified and updated to D3 v4.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as d3scale from 'd3-scale';
import * as d3array from 'd3-array';
import * as d3axis from 'd3-axis';
import * as d3selection from 'd3-selection';
import * as d3shape from 'd3-shape';

import store from '../../core/store';
import s from './BarChart.css';


class BarChart extends React.Component {

    static get propTypes() {
        return {
            data: React.PropTypes.array,  // Typically some [{x: value, y: frequency}, ...]
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            chartId: React.PropTypes.string,
            color: React.PropTypes.string,
            logColor: React.PropTypes.string,
            margins: React.PropTypes.object,
        };
    }

    static get defaultProps() {
        return {
            data: [{x: 0, y: 0}],
            width: 300,
            height: 70,
            chartId: 'v_chart',
            color: '#5E6EC7',
            logColor: 'green',
            margins: {top: 5, right: 20, bottom: 30, left: 40},
        };
    }

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.stateFromStore();
    }

    stateFromStore() {
        return {
            minBound: store.getState().greyScale.minBound,
            maxBound: store.getState().greyScale.maxBound,
        }
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }

    render() {
        let _this = this;
        let width = this.props.width;
        let height = this.props.height;

        let data = this.props.data;
        data = data.sort((a,b) => a.x - b.x);
        let N = data.length;
        if (N === 0) {
            return <div></div>;
        }

        let maxX = d3array.max(data, d => d.x);
        let minX = d3array.min(data, d => d.x);
        let maxY = d3array.max(data, d => d.y);
        let logData = data.map(d => ({x: d.x, y: Math.log(d.y)}));
        let maxLogY = d3array.max(logData, d => d.y);
        //console.log("data = "+ JSON.stringify(data, null, 2))

        let margin = this.props.margins,
            w = width - (margin.left + margin.right),
            h = height - (margin.top + margin.bottom);

        let transform = 'translate('+ margin.left +','+ margin.top +')';

        let xTicks = [minX, maxX];
        // Find the score closest to 0 to add a tick. Use bisection method if necessary.
        let last = data[0].x;
        for (let d of data) {
            if (d.x >= 0) {
                xTicks.splice(1, 0, d.x);
                break;
            }
        }

        /* Axes */

        let x = d3scale.scaleBand()
            .domain(data.map(d => d.x))
            .rangeRound([0, w])
            .paddingInner(0.1);

        let y = d3scale.scaleLinear()
            .domain([0, maxY])
            .range([h, 0]);

        let ylog = d3scale.scaleLinear()
            .domain([0, maxLogY])
            .range([h, 0]);

        let xAxis = d3axis.axisBottom(x)
            .scale(x)
            .tickValues(xTicks);

        let yAxis = d3axis.axisLeft(y)
            .ticks(5);

        /* Bars */

        let rectForeground = data.map(function(d, i) {
            return (
                <rect fill={_this.props.color} rx="3" ry="3" key={i}
                      x={x(d.x)} y={y(d.y)}
                      height={h-y(d.y)}
                      width={x.bandwidth()}/>
            )
        });

        /* Log scale line */

        var lineFunction = d3shape.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return ylog(d.y); })
            .curve(d3shape.curveBasis);

        let logLine = <path d={lineFunction(logData)}
                            stroke={this.props.logColor} fill="none" strokeOpacity={1} />

        return(
            <div className={s.root}>
                <svg id={this.props.chartId} width={this.props.width} height={this.props.height} >
                    <g transform={transform}>
                        {logLine}
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
        var translate = "translate(0,"+ this.props.h +")";
        return (
            <g className="axis" transform={this.props.axisType == 'x' ? translate : ""} />
        );
    }
}

Axis.propTypes = {
    h: React.PropTypes.number,
    axis: React.PropTypes.func,
    axisType: React.PropTypes.oneOf(['x','y'])
};


export default BarChart;


