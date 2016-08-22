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
 *
 * Default are set here:
 * https://github.com/callemall/material-ui/blob/master/src/styles/baseThemes/lightBaseTheme.js
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
        color: 'white',
    },
    textField: {
        textColor: "black",
    },
    raisedButton: {
        primaryColor: lighterBlue,
        secondaryTextColor: "black",
        secondaryColor: "#FB4049",
    },
    slider: {
        selectionColor: colors.grey400,   // the part left to handle... and the handle...
        handleColorZero: colors.grey400,  // the handle border when at 0
        handleFillColor: colors.grey400,  // the handle fill when at 0
        rippleColor: colors.grey500,      // the glow when :hover
        trackColor: colors.grey400,       // the base line
        trackColorSelected: colors.grey400,  // the base line, when used
    }
});


export default Layout;
