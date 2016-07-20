import React from 'react';
import store from '../../core/store';
import { changeSequence, changeWindowSize, changeScoringMatrix } from './actions/actionCreators';
import * as validators from './validators';
import { SCORING_MATRICES } from '../constants/constants';


/* Material-UI */
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class InputPanel extends React.Component {

    state = {
        windowSize: 1,
        scoringMatrix: 'identity',
    };

    onChangeSeq1 = (event, index, value) => {
        store.dispatch(changeSequence(1, value));
    };
    onChangeSeq2 = (event, index, value) => {
        store.dispatch(changeSequence(2, value));
    };
    onChangeWindowSize = (event, index, value) => {
        if (value !== '') {
            this.setState({ windowSize: value });
            store.dispatch(changeWindowSize(value));
        }
    };
    onChangeScoringMatrix = (event, index, value) => {
        this.setState({ scoringMatrix: value });
        store.dispatch(changeScoringMatrix(value));
    };

    componentDidMount() {
        // Trigger any event to initialize the canvas with default parameters already in store.
        store.dispatch(changeWindowSize(this.state.windowSize));
    }

    render() {
        return (<div>
        <form>
            <TextField hintText="Sequence1" floatingLabelText="Sequence1" id="seq1_input"
                       ref={(c) => this._seq1Input = c}
                       floatingLabelFixed={true}
                       onChange={this.onChangeSeq1}
                       defaultValue={store.getState().input.s1}
            />
            <TextField hintText="Sequence2" floatingLabelText="Sequence2" id="seq2_input"
                       ref={(c) => this._seq2Input = c}
                       floatingLabelFixed={true}
                       onChange={this.onChangeSeq2}
                       defaultValue={store.getState().input.s2}
            />
            <TextField hintText="Window size" floatingLabelText="Window size" id="windowSize_input"
                       type="number"
                       style={{width: '110px'}}
                       floatingLabelFixed={true}
                       onChange={this.onChangeWindowSize}
                       defaultValue={this.state.windowSize || 1}
            />
            <SelectField floatingLabelText="Scoring matrix"
                         floatingLabelFixed={true}
                         onChange={this.onChangeScoringMatrix}
                         value={this.state.scoringMatrix}
                         >
                <MenuItem value={SCORING_MATRICES.IDENTITY} primaryText="Identity" />
                <MenuItem value={SCORING_MATRICES.BLOSUM45} primaryText="BLOSUM 45" />
                <MenuItem value={SCORING_MATRICES.BLOSUM62} primaryText="BLOSUM 62" />
                <MenuItem value={SCORING_MATRICES.BLOSUM80} primaryText="BLOSUM 80" />
                <MenuItem value={SCORING_MATRICES.PAM30} primaryText="PAM 30" />
                <MenuItem value={SCORING_MATRICES.PAM70} primaryText="PAM 70" />
            </SelectField>
        </form>
        </div>);
    }
}


export default InputPanel;
