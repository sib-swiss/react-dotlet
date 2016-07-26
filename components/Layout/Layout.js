import React from 'react';
import Header from './Header';
import s from './Layout.css';

/* Material-UI, see theme customization below */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


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


const col = "#3F51B5";  // title bar blue

const muiTheme = getMuiTheme({
    palette: {
        textColor: "black",
        primary1Color: col,
        //primary2Color: Colors.cyan700,
        //primary3Color: Colors.lightBlack,
        //accent1Color: Colors.pinkA200,
        //accent2Color: Colors.grey100,
        //accent3Color: Colors.grey500,
        //alternateTextColor: Colors.white,
        //canvasColor: Colors.white,
        //borderColor: Colors.grey300,
        //disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
        //pickerHeaderColor: Colors.cyan500,
    },
    appBar: {
        height: 50,
    },
    textField: {
        textColor: "black",
    },
    raisedButton: {
        primaryColor: "#5E6EC7",   // default rd3 chart blue
    },
});


export default Layout;
