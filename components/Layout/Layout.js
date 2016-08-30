import React from 'react';
import s from './Layout.css';
import Header from './Header';
import Footer from './Footer';
import Toast from '../utils/Toast';

/* Material-UI, see theme customization below */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as mColors from 'material-ui/styles/colors';
import * as theme from '../constants/theme';


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
                    <Toast />

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
    toolbar: {
        height: 52,
        //color: fade(palette.textColor, 0.54),
        //hoverColor: fade(palette.textColor, 0.87),
        //backgroundColor: theme.primaryColor,
        //titleFontSize: 20,
        //iconColor: fade(palette.textColor, 0.4),
        //separatorColor: fade(palette.textColor, 0.175),
        //menuHoverColor: fade(palette.textColor, 0.1),
    },
    textField: {
        textColor: "black",
        //textColor: palette.textColor,
        //hintColor: palette.disabledColor,
        //floatingLabelColor: palette.textColor,
        //disabledTextColor: palette.disabledColor,
        //errorColor: red500,
        //focusColor: palette.primary1Color,
        //backgroundColor: 'transparent',
        //borderColor: palette.borderColor,
    },
    raisedButton: {
        primaryColor: theme.lighterBlue,
        secondaryTextColor: "black",
        secondaryColor: "#F17076",
        //color: palette.alternateTextColor,
        //textColor: palette.textColor,
        //primaryTextColor: palette.alternateTextColor,
        //disabledColor: darken(palette.alternateTextColor, 0.1),
        //disabledTextColor: fade(palette.textColor, 0.3),
        //fontSize: typography.fontStyleButtonFontSize,
        //fontWeight: typography.fontWeightMedium,
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
