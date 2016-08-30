
import React from 'react';
import store from '../../core/store';
import SnackBar from 'material-ui/SnackBar';


class Toast extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
            message: "",
        };
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleActionTouchTap = this.handleActionTouchTap.bind(this);
    }

    componentWillMount() {
        store.subscribe(() => {
            this.setState({
                open: store.getState().toast.open,
                message: store.getState().toast.message,
            });
        });
    }

    handleRequestClose() {
        this.setState({ open: false });
    }
    handleActionTouchTap() {
        this.setState({ open: false });
    }

    render() {
        return (
            <SnackBar
                open={this.state.open}
                message={this.state.message}
                autoHideDuration={2500}
                action="Close"
                onRequestClose={this.handleRequestClose}
                onActionTouchTap={this.handleActionTouchTap}
            />
        );
    }
}


export default Toast;
