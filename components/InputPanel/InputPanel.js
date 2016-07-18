
import React from 'react';
import store from '../../core/store';
import { changeSequence } from './actions/actionCreators';

class InputPanel extends React.Component {

    componentDidMount() {
        window.componentHandler.upgradeDom();
    }
    componentWillUnmount() {
        window.componentHandler.downgradeDom();
    }

    onChangeSeq1(e) {
        store.dispatch(changeSequence(1, e.target.value));
    }
    onChangeSeq2(e) {
        store.dispatch(changeSequence(2, e.target.value));
    }
    onChangeWindowSize(e) {

    }

    render() {
        return (<div>
        <form>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" ref="root">
                <input className="mdl-textfield__input" type="text" id="seq1_input"
                       onChange={this.onChangeSeq1}
                       defaultValue={store.getState().input.s1}
                />
                <label className="mdl-textfield__label" htmlFor="seq1_input">Sequence 1</label>
            </div>
            <div className="mdl-textfield mdl-js-textfield">
                <input className="mdl-textfield__input" type="text" id="seq2_input"
                       onChange={this.onChangeSeq2}
                       defaultValue={store.getState().input.s2}
                />
                <label className="mdl-textfield__label" htmlFor="seq2_input">Sequence 2</label>
            </div>
            <div className="mdl-textfield mdl-js-textfield">
                <input className="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="text2" />
                    <label className="mdl-textfield__label" htmlFor="text2">Number...</label>
                    <span className="mdl-textfield__error">Number required!</span>
            </div>
        </form>

        </div>);
    }
}


export default InputPanel;
