import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';
import s from './InputPanel.css';
import { changeSequence, changeWindowSize, changeScoringMatrix } from '../actions/actionCreators';
import { SCORING_MATRIX_NAMES, DNA, CANVAS_ID } from '../constants/constants';
import { commonSeqType } from './input';
import { printCanvas } from './helpers';
//import * as validators from './validators';


/* Material-UI */
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';


class InputPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = this.getStoreState();
        Object.assign(this.state, {
            open: false,
            activeSequence: 1,
        });
    }

    getStoreState() {
        let storeState = store.getState();
        return {
            s1: storeState.s1,
            s2: storeState.s2,
            windowSize: storeState.windowSize,
            scoringMatrix: storeState.scoringMatrix,
        };
    }

    componentDidMount() {
        // Trigger any event to initialize the canvas with default parameters already in store.
        store.dispatch(changeWindowSize(this.state.windowSize));
    }

    /* Callbacks */

    openTextarea(seqn) {
        this.setState({
            open: ! (this.state.open && (seqn === this.state.activeSequence)),
            activeSequence: seqn,
        });
    }
    onChangeSeq1 = (e) => {
        //e.stopImmediatePropagation()
        let value = e.target.value;
        let s1 = value.replace(/\s/g,'').toUpperCase();
        this.setState({ s1 });
        store.dispatch(changeSequence(1, s1));
    };
    onChangeSeq2 = (e) => {
        let value = e.target.value;
        let s2 = value.replace(/\s/g,'').toUpperCase();
        this.setState({ s2 });
        store.dispatch(changeSequence(2, s2));
    };
    onChangeWindowSize = (e, value) => {
        if (value !== '') {
            this.setState({ windowSize: value });
            store.dispatch(changeWindowSize(value));
        }
    };
    onChangeScoringMatrix = (e, index, value) => {
        this.setState({ scoringMatrix: value });
        store.dispatch(changeScoringMatrix(value));
    };
    onPrint() {
        printCanvas(CANVAS_ID);
    }
    onTranslate() {

    }


    render() {
        let seq1type = store.getState().s1Type;
        let seq2type = store.getState().s2Type;
        let commonType = commonSeqType(seq1type, seq2type);  // to know which matrices are available

        return (
        <div className={s.root}>
        <Toolbar style={{paddingBottom: '52px', height: '52px'}}>

            {/* Sequences input */}

            <ToolbarGroup style={{marginTop: '-3px'}}>
                <RaisedButton onClick={this.openTextarea.bind(this, 1)}
                    secondary={this.state.open && this.state.activeSequence === 1} label="Sequence&nbsp;1" />
                <RaisedButton onClick={this.openTextarea.bind(this, 2)}
                    secondary={this.state.open && this.state.activeSequence === 2} label="Sequence&nbsp;2" />
            </ToolbarGroup>

            {/* Window size selection */}

            <ToolbarGroup style={{marginTop: '-3px'}}>
                <TextField floatingLabelText="Window size" id="windowSize_input"
                           type="number"
                           style={{width: '110px', marginTop: 0}}
                           inputStyle={{marginTop: '2px'}}
                           underlineStyle={{margin: '0.75em 0'}}
                           underlineFocusStyle={{margin: '0.75em 0'}}
                           floatingLabelStyle={{marginTop: '-6px'}}
                           floatingLabelFixed={true}
                           onChange={this.onChangeWindowSize}
                           defaultValue={this.state.windowSize}
                />
            </ToolbarGroup>

            {/* Scoring matrix selection */}

            <ToolbarGroup  style={{marginTop: '-3px'}}>
                <SelectField floatingLabelText="Scoring matrix"
                             floatingLabelFixed={true}
                             style={{width: '150px', marginTop: 0}}
                             inputStyle={{marginTop: '5px'}}
                             underlineShow={false}
                             floatingLabelStyle={{marginTop: '-6px'}}
                             onChange={this.onChangeScoringMatrix}
                             value={this.state.scoringMatrix}
                             >
                    <MenuItem checked={this.state.scoringMatrix === SCORING_MATRIX_NAMES.IDENTITY}
                              value={SCORING_MATRIX_NAMES.IDENTITY}
                              primaryText="Identity" />
                    <MenuItem checked={this.state.scoringMatrix === SCORING_MATRIX_NAMES.BLOSUM45}
                              value={SCORING_MATRIX_NAMES.BLOSUM45}
                              disabled={commonType === DNA}
                              primaryText="BLOSUM 45" />
                    <MenuItem checked={this.state.scoringMatrix === SCORING_MATRIX_NAMES.BLOSUM62}
                              value={SCORING_MATRIX_NAMES.BLOSUM62}
                              disabled={commonType === DNA}
                              primaryText="BLOSUM 62" />
                    <MenuItem checked={this.state.scoringMatrix === SCORING_MATRIX_NAMES.BLOSUM80}
                              value={SCORING_MATRIX_NAMES.BLOSUM80}
                              disabled={commonType === DNA}
                              primaryText="BLOSUM 80" />
                    <MenuItem checked={this.state.scoringMatrix === SCORING_MATRIX_NAMES.PAM30}
                              value={SCORING_MATRIX_NAMES.PAM30}
                              disabled={commonType === DNA}
                              primaryText="PAM 30" />
                    <MenuItem checked={this.state.scoringMatrix === SCORING_MATRIX_NAMES.PAM70}
                              value={SCORING_MATRIX_NAMES.PAM70}
                              disabled={commonType === DNA}
                              primaryText="PAM 70" />
                </SelectField>
            </ToolbarGroup>

            {/* Print button */}

            <ToolbarGroup style={{marginTop: '1px'}} >
                <IconButton onClick={this.onPrint} >
                    <FontIcon className="material-icons">print</FontIcon>
                </IconButton>
            </ToolbarGroup>

        </Toolbar>

            {/* Where we enter the sequence */}

            <div className={s.textareaContainer} style={{display: this.state.open ? 'block' : 'none'}}>
                <div className={s.translateButtonContainer}>
                    <IconButton onClick={this.onTranslate}>
                        <FontIcon className="material-icons ">translate</FontIcon>
                    </IconButton>
                </div>
                <textarea className={s.textarea} rows={3}
                    value={this.state.activeSequence === 1 ? this.state.s1 : this.state.s2}
                    placeholder={this.state.activeSequence === 1 ? 'Sequence 1:' : 'Sequence 2:'}
                    onChange={this.state.activeSequence === 1 ? this.onChangeSeq1 : this.onChangeSeq2}
                />
            </div>
        </div>);
    }
}



export default InputPanel;
