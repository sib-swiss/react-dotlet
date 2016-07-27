import React from 'react';
import Header from './Header';
import s from './Layout.css';

/* Material-UI, see theme customization below */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as colors from 'material-ui/styles/colors';


/*
 * All route pages place their content into a
 * <Layout>
 *  ... content ...
 * </Layout>
 * so that all have the header and center column with content.
 * Change this only to change the common layout to all pages.
 * It chooses what to put into <Header>.
 */

class Layout extends React.Component {

    componentDidMount() {
        window.componentHandler.upgradeElement(this.refs.root);
    }
    componentWillUnmount() {
        window.componentHandler.downgradeElements(this.refs.root);
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
            <div className={"mdl-layout mdl-js-layout "+s.root} ref="root">
                <div className="mdl-layout__inner-container">

                    <Header />

                    <main className="mdl-layout__content">
                        <div className={s.content} {...this.props} />
                    </main>

                </div>
            </div>
            </MuiThemeProvider>
        );
    }
}


/*
 * Material-UI theming
 * See all possible properties here:
 * https://github.com/callemall/material-ui/blob/master/src/styles/getMuiTheme.js
 */


const titleBlue = "#3F51B5";  // title bar blue
const lighterBlue = "#5E6EC7";

const muiTheme = getMuiTheme({
    palette: {
        textColor: "black",
        primary1Color: titleBlue,
    },
    appBar: {
        height: 50,
    },
    textField: {
        textColor: "black",
    },
    raisedButton: {
        primaryColor: lighterBlue,
    },
    slider: {
        selectionColor: lighterBlue,
    }
});


export default Layout;
