
import Dotter from './Dotter';


function DotterFromState(state) {
    return new Dotter(state.canvasSize, state.windowSize, state.s1, state.s2, state.scoringMatrix);
}


export {
    DotterFromState,
};
