import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';
import s from './InputPanel.css';
import { changeSequence, changeWindowSize, changeScoringMatrix, openToast } from '../actions/actionCreators';
import { SCORING_MATRIX_NAMES, DNA, CANVAS_ID } from '../constants/constants';
import { commonSeqType, guessSequenceType, formatSeq } from './input';
import { printCanvas } from './helpers';
import * as validators from './validators';
import { validateFasta, validURL } from './fastaValidator';

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
        let storeState = store.getState();
        this.state = {
            open: false,
            activeSequence: 1,
            s1: storeState.s1,
            s2: storeState.s2,
            windowSize: storeState.windowSize,
            scoringMatrix: storeState.scoringMatrix,
        };
        this._textArea = null;
    }

    componentDidMount() {
        // Trigger any event to initialize the canvas with default parameters already in store.
        store.dispatch(changeWindowSize(this.state.windowSize));
    }

    /* Callbacks */
    async fetchFasta(url) {
        // GET request using fetch with async/await
        try {
            if (validURL(url) == true) {
                const response = await fetch(url);
                const data = await response.text();
                const data2 = validateFasta(data);
                return data2;
            }
        } 
        catch (err) {
            throw err;
        }
        finally {
            store.dispatch(openToast("Invalid URL"));
        }
    }

    openTextarea(seqn) {
        this.setState({
            open: ! (this.state.open && (seqn === this.state.activeSequence)),
            activeSequence: seqn,
        });
    }
    onChangeSeq1 = (e) => {
        let s1 = e.target.value;
        if (validURL(s1) == true) {
            const getData = async () => {
                const sequence = await this.fetchFasta(e.target.value);
                s1 = sequence;
                s1Type = guessSequenceType(s1, 200);
                this.setState({ s1 });
                store.dispatch(changeSequence(1, s1, s1Type));
            };
            getData();
        }
        let s1Type = guessSequenceType(s1, 200);
        this.setState({ s1 });
        s1 = formatSeq(s1);
        let isValid = validators.isValidInputSequence(s1, s1Type);
        if (isValid.valid) {
            store.dispatch(changeSequence(1, s1, s1Type));
        }
        if (!isValid.valid && !validURL(s1)){
            store.dispatch(openToast("Invalid "+ s1Type +" sequence character '"+ isValid.wrongChar +"'"));
        };
    };
    onChangeSeq2 = (e) => {
        let s2 = e.target.value;
        if (validURL(s2) == true) {
            const getData = async () => {
                const sequence = await this.fetchFasta(e.target.value);
                s2 = sequence;
                s2Type = guessSequenceType(s2, 200);
                this.setState({ s2 });
                store.dispatch(changeSequence(2, s2, s2Type));
            };
            getData();
        }
        let s2Type = guessSequenceType(s2, 200);
        this.setState({ s2 });
        s2 = formatSeq(s2);
        let isValid = validators.isValidInputSequence(s2, s2Type);
        if (isValid.valid) {
            store.dispatch(changeSequence(2, s2, s2Type));
        } 
        if (!isValid.valid && !validURL(s2)){
            store.dispatch(openToast("Invalid "+ s2Type +" sequence character '"+ isValid.wrongChar +"'"));
        }
    };
    onChangeWindowSize = (e, value) => {
        let isValid = validators.validateWindowSize(value);
        if (isValid) {
            this.setState({ windowSize: value });
            store.dispatch(changeWindowSize(value));
        } else {
            this.setState({ windowSize: this.state.windowSize });
            store.dispatch(openToast("Window size must be a positive integer"));
        }
    };
    onChangeScoringMatrix = (e, index, value) => {
        this.setState({ scoringMatrix: value });
        store.dispatch(changeScoringMatrix(value));
    };
    onPrint() {
        printCanvas(CANVAS_ID);
    }


    render() {
        let seq1type = store.getState().s1Type;
        let seq2type = store.getState().s2Type;
        let commonType = commonSeqType(seq1type, seq2type);  // to know which scoring matrices are available

        return (
        <div className={s.root}>
        <Toolbar>

            {/* Sequences input */}

            <ToolbarGroup>
                <RaisedButton onClick={this.openTextarea.bind(this, 1)}
                    secondary={this.state.open && this.state.activeSequence === 1} label="Sequence&nbsp;1" />
                <RaisedButton onClick={this.openTextarea.bind(this, 2)}
                    secondary={this.state.open && this.state.activeSequence === 2} label="Sequence&nbsp;2" />
            </ToolbarGroup>

            {/* Window size selection */}

            <ToolbarGroup style={{marginTop: '10px'}}>
                <TextField floatingLabelText="Window size" id="windowSize_input"
                           type="number"
                           style={{width: '110px', marginTop: 0}}
                           inputStyle={{marginTop: '2px'}}
                           underlineStyle={{margin: '0.75em 0'}}
                           underlineFocusStyle={{margin: '0.75em 0'}}
                           floatingLabelStyle={{marginTop: '-6px'}}
                           floatingLabelFixed={true}
                           onChange={this.onChangeWindowSize}
                           value={this.state.windowSize}
                />
            </ToolbarGroup>

            {/* Scoring matrix selection */}

            <ToolbarGroup  style={{marginTop: '10px'}}>
                <SelectField floatingLabelText="Scoring matrix"
                             floatingLabelFixed={true}
                             style={{width: '150px', marginTop: 0}}
                             inputStyle={{marginTop: '5px', paddingBottom: '1px'}}
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
                <IconButton onClick={this.onPrint} tooltip="Print canvas" >
                    <FontIcon className="material-icons">print</FontIcon>
                </IconButton>
            </ToolbarGroup>

        </Toolbar>

            {/* Where we enter the sequence */}

            <div className={s.textareaContainer} style={{display: this.state.open ? 'block' : 'none'}}>
                <textarea className={s.textarea} rows={3} ref={(c) => this._textArea = c}
                    value={this.state.activeSequence === 1 ? this.state.s1 : this.state.s2}
                    placeholder={this.state.activeSequence === 1 ? 'Sequence 1:' : 'Sequence 2:'}
                    onChange={this.state.activeSequence === 1 ? this.onChangeSeq1 : this.onChangeSeq2}
                />
            </div>
        </div>);
    }
}



export default InputPanel;
