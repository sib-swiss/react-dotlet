import React from 'react';
import store from '../../core/store';
import { changeSequence, changeWindowSize, changeScoringMatrix } from './actions/actionCreators';
import * as validators from './validators';

/* Material-UI */
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class InputPanel extends React.Component {

    state = {
        windowSize: 1,
        scoringMatrix: 1,
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
        store.dispatch(changeSequence(1, this._seq1Input.getValue()));
        store.dispatch(changeSequence(2, this._seq2Input.getValue()));
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
                <MenuItem value={1} primaryText="Identity" />
                <MenuItem value={2} primaryText="BLOSUM45"/>
                <MenuItem value={3} primaryText="BLOSUM62"/>
                <MenuItem value={4} primaryText="BLOSUM80"/>
                <MenuItem value={5} primaryText="PAM30"/>
                <MenuItem value={6} primaryText="PAM70"/>
            </SelectField>
        </form>
        </div>);
    }
}


export default InputPanel;
