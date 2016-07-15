
import React from 'react';
import store from '../../core/store';
import { changeSequence } from './actionCreators';

class InputPanel extends React.Component {
    onChange(e) {
        console.log(e.target.value)
        store.dispatch(changeSequence(1, e.target.value));
    }

    render() {
        return (<div>
        <form>
            <div className="mdl-textfield mdl-js-textfield">
                <input className="mdl-textfield__input" type="text" id="seq1_input"
                        onChange={this.onChange} />
                <label className="mdl-textfield__label" htmlFor="seq1_input">Sequence 1</label>
            </div>
            <div className="mdl-textfield mdl-js-textfield">
                <input className="mdl-textfield__input" type="text" id="seq2_input" />
                <label className="mdl-textfield__label" htmlFor="seq2_input">Sequence 2</label>
            </div>
        </form>
        </div>);
    }
}


export default InputPanel;
