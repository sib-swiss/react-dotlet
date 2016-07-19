
import React from 'react';
import store from '../../core/store';
import { changeSequence, changeWindowSize, updateScores } from './actions/actionCreators';
import * as validators from './validators';

/* Material-UI */
import TextField from 'material-ui/TextField';


class InputPanel extends React.Component {

    onChangeSeq1(e) {
        store.dispatch(changeSequence(1, e.target.value));
    }
    onChangeSeq2(e) {
        store.dispatch(changeSequence(2, e.target.value));
    }
    onChangeWindowSize(e) {
        if (e.target.value !== '') {
            store.dispatch(changeWindowSize(e.target.value));
        }
    }

    componentDidMount() {
        store.dispatch(changeSequence(1, this._seq1Input.getValue()));
        store.dispatch(changeSequence(1, this._seq2Input.getValue()));
    }

    render() {
        return (<div>
        <form>
            <TextField hintText="Sequence1" floatingLabelText="Sequence1" id="seq1_input"
                       ref={(c) => this._seq1Input = c}
                       onChange={this.onChangeSeq1}
                       defaultValue={store.getState().input.s1}
            />
            <TextField hintText="Sequence2" floatingLabelText="Sequence2" id="seq2_input"
                       ref={(c) => this._seq2Input = c}
                       onChange={this.onChangeSeq2}
                       defaultValue={store.getState().input.s2}
            />
            <TextField hintText="Window size" floatingLabelText="Window size" id="window_size_input"
                       type="number"
                       onChange={this.onChangeWindowSize}
                       defaultValue={store.getState().input.window_size || 1}
            />
        </form>
        </div>);
    }
}


export default InputPanel;
