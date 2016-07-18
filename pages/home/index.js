/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import DotterPanel from '../../components/DotterPanel';
import InputPanel from '../../components/InputPanel';
import DensityPanel from '../../components/DensityPanel';
import TwoSeqsPanel from '../../components/TwoSeqsPanel';

/* Material-UI */
// Dep to be removed in further versions of material-ui
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


const col = "#3F51B5";

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
    }
});


class HomePage extends React.Component {

    componentWillMount() {
        injectTapEventPlugin();
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
            <Layout>
            <div>
                <InputPanel />
                <DotterPanel window_size={10} />
                <DensityPanel />
                <TwoSeqsPanel />
            </div>
            </Layout>
            </MuiThemeProvider>
        );
    }

}

export default HomePage;
