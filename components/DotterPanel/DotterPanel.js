import React from 'react';
import s from './DotterPanel.css';

const CANVAS_SIZE = 600;

class Panel extends React.Component {
    static propTypes = {
        s1: React.PropTypes.string,
        s2: React.PropTypes.string,
        window_size: React.PropTypes.number,
    };

    render() {
        return (
            <div className={s.canvasContainer}>
                <canvas id='dotter-canvas'
                      ref={(c) => this._refDotterCanvas = c}
                      className={s.canvas}
                ></canvas>
            </div>
        );
    }

    componentDidMount() {
        this.fillCanvas();
    }

    fillCanvas() {
        let cv = this._refDotterCanvas;
        let ctx = cv.getContext('2d');
        let canvas = ctx.canvas;
        let s1 = this.props.s1;
        let s2 = this.props.s2;
        let ls1 = s1.length;
        let ls2 = s2.length;
        let m = Math.min(ls1, ls2);
        let M = Math.max(ls1, ls2);
        let Q = CANVAS_SIZE / M;
        console.log(Q);
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        for (let i=0; i<ls2; i++) {
            for (let j=0; j<ls2; j++) {
                if (s1[i] === s2[j]) ctx.strokeRect(Q*i, Q*j, Q, Q);
            }
        }
    }

  movingAverage(s1, s2) {

  }

}

export default Panel;
