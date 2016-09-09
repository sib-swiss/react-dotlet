import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import s from './Minimap.css';
import store from '../../core/store';
import { CANVAS_ID_MINIMAP_SQUARE } from '../constants/constants';

/**
 * Bottom canvas layer with the square representing the current zooming window.
 */
class SquareLayer extends React.Component {
    constructor() {
        super();
        this.state = this.stateFromStore();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    stateFromStore() {
        let storeState = store.getState();
        return {
            s1: storeState.s1,
            s2: storeState.s2,
            minimapView: storeState.minimapView,
        }
    }
    componentWillMount() {
        store.subscribe(() => {
            this.setState( this.stateFromStore() );
        });
    }
    componentDidUpdate() {
        this.draw();
    }

    draw() {
        let size = this.props.size;
        let rect = this.state.minimapView;
        let canvas = document.getElementById(CANVAS_ID_MINIMAP_SQUARE);
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, size, size);
        //ctx.fillStyle = "#ccc";
        //ctx.fillRect(0,0, size, size);
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(rect.x, rect.y, rect.size, rect.size);
    }

    render() {
        return <div className={s.canvas}>
            <canvas id={CANVAS_ID_MINIMAP_SQUARE} height={this.props.size} width={this.props.size} />
        </div>;
    }
}


export default SquareLayer;
