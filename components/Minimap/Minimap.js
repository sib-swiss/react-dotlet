import React from 'react';
import s from './Minimap.css';

import { MINIMAP_SIZE } from '../constants/constants';
import BackgroundLayer from './BackgroundLayer';
import SquareLayer from './SquareLayer';
import LinesLayer from './LinesLayer';
import MoveLayer from './MoveLayer';


class Minimap extends React.Component {
    constructor() {
        super();
        this.size = MINIMAP_SIZE;
    }
    render() {
        return <div className={s.root}>
            <BackgroundLayer size={this.size} />
            <SquareLayer size={this.size} />
            <LinesLayer size={this.size} />
            <MoveLayer size={this.size} />
        </div>;
    }
}




export default Minimap;
