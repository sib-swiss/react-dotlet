import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import store from '../../core/store';
import s from './InputPanel.css';
import { changeSequence, changeWindowSize, changeScoringMatrix } from './actions/actionCreators';
//import * as validators from './validators';
import { SCORING_MATRICES } from '../constants/constants';


/* Material-UI */
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';


class InputPanel extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = store.getState().input;
    }

    onChangeSeq1 = (event, value) => {
        this.setState({ s1: value });
        store.dispatch(changeSequence(1, value));
    };
    onChangeSeq2 = (event, value) => {
        this.setState({ s2: value });
        store.dispatch(changeSequence(2, value));
    };
    onChangeWindowSize = (event, value) => {
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
        return (<div className={s.root}>
        <Toolbar style={{paddingBottom: '80px'}}>
            <ToolbarGroup style={{marginTop: '10px'}}>
                <SequencePopover label="Sequence 1" callback={this.onChangeSeq1} sequence={this.state.s1}/>
                <SequencePopover label="Sequence 2" callback={this.onChangeSeq2} sequence={this.state.s2}/>
            </ToolbarGroup>
            <ToolbarGroup>
            <TextField hintText="Window size" floatingLabelText="Window size" id="windowSize_input"
                       type="number"
                       style={{width: '110px'}}
                       floatingLabelFixed={true}
                       onChange={this.onChangeWindowSize}
                       defaultValue={this.state.windowSize}
            />
            </ToolbarGroup>
            <ToolbarGroup>
            <SelectField floatingLabelText="Scoring matrix"
                         floatingLabelFixed={true}
                         onChange={this.onChangeScoringMatrix}
                         value={this.state.scoringMatrix}
                         >
                <MenuItem checked={this.state.scoringMatrix === SCORING_MATRICES.IDENTITY}
                          value={SCORING_MATRICES.IDENTITY} primaryText="Identity" />
                <MenuItem checked={this.state.scoringMatrix === SCORING_MATRICES.BLOSUM45}
                          value={SCORING_MATRICES.BLOSUM45} primaryText="BLOSUM 45" />
                <MenuItem checked={this.state.scoringMatrix === SCORING_MATRICES.BLOSUM62}
                          value={SCORING_MATRICES.BLOSUM62} primaryText="BLOSUM 62" />
                <MenuItem checked={this.state.scoringMatrix === SCORING_MATRICES.BLOSUM80}
                          value={SCORING_MATRICES.BLOSUM80} primaryText="BLOSUM 80" />
                <MenuItem checked={this.state.scoringMatrix === SCORING_MATRICES.PAM30}
                          value={SCORING_MATRICES.PAM30} primaryText="PAM 30" />
                <MenuItem checked={this.state.scoringMatrix === SCORING_MATRICES.PAM70}
                          value={SCORING_MATRICES.PAM70} primaryText="PAM 70" />
            </SelectField>
        </ToolbarGroup>
        </Toolbar>
        </div>);
    }
}


class SequencePopover extends React.Component {
    state = {
        open: false,
        anchorEl: null,
    };

    open = (event) => {
        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    close = () => {
        this.setState({ open: false });
    };

    render() {
        return (<ToolbarGroup>
            <RaisedButton label={this.props.label} onClick={this.open}/>
            <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'middle', vertical: 'top'}}
                onRequestClose={this.close}
                animated={false}
                useLayerForClickAway={false}  // otherwise prevents clicks to the underlying elements
            >
                <TextField
                    name={"input_seq_"+this.props.label.replace(' ','_')}
                    multiLine={true}
                    rowsMax={10}
                    onChange={this.props.callback}
                    defaultValue={this.props.sequence}
                />
            </Popover>
            </ToolbarGroup>
        );
    }
}


export default InputPanel;
