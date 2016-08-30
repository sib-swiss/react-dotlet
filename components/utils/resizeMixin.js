import ReactDOM from 'react-dom';

/*
 * Source:
 * https://github.com/adeveloperdiary/react-d3-charts/blob/gh-pages/01_Visitor_Dashboard/lib/charts/utils/ReactMixins.js
 */

var resizeMixin = {

    componentWillMount: function() {
        var _this = this;
        $(window).on('resize', function(e) {
            _this.updateSize();
        });
        this.setState({width:this.props.width});
    },

    componentDidMount: function() {
        this.updateSize();
    },

    componentWillUnmount: function() {
        $(window).off('resize');
    },

    updateSize: function() {
        var node = ReactDOM.findDOMNode(this);
        var parentWidth = $(node).width();

        if (parentWidth < this.props.width) {
            this.setState({ width: parentWidth-20 });
        } else {
            this.setState({ width: this.props.width });
        }
    }
};


window.resizeMixin = resizeMixin;
