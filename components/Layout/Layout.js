import React from 'react';
import s from './Layout.css';
import Header from './Header';
import Footer from './Footer';

/* Material-UI, see theme customization below */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as mColors from 'material-ui/styles/colors';
import * as theme from './theme';


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
            <div>
                <div className={"mdl-layout mdl-js-layout "+ s.backgroundWrapper}>
                    <div className={s.background} />
                </div>

                <div className={"mdl-layout mdl-js-layout "+s.root} ref="root">
                    <div className={"mdl-layout__inner-container "+s.innerContainer}>

                        <Header />

                        <main className="mdl-layout__content ">
                            <div className={s.content} {...this.props} />
                        </main>
                        <div className={s.filler}/>

                    </div>

                    <Footer />

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

const muiTheme = getMuiTheme({
    //palette: {
    //    textColor: "black",
    //    primary1Color: theme.primaryColor,
    //},
    textField: {
        textColor: "black",
    },
    raisedButton: {
        primaryColor: theme.lighterBlue,
        secondaryTextColor: "black",
        secondaryColor: "#F17076",
    },
    slider: {
        selectionColor: mColors.grey400,   // the part left to handle... and the handle...
        handleColorZero: mColors.grey400,  // the handle border when at 0
        handleFillColor: mColors.grey400,  // the handle fill when at 0
        rippleColor: mColors.grey500,      // the glow when :hover
        trackColor: mColors.grey400,       // the base line
        trackColorSelected: mColors.grey400,  // the base line, when used
    }
});


export default Layout;
