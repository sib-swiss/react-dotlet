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

class HomePage extends React.Component {


    render() {
        return (
            <Layout>
            <div>
                <InputPanel />
                <DotterPanel window_size={10} />

                {/*<htmlForm action="#">
                    <div className="mdl-textfield mdl-js-textfield">
                        <textarea className="mdl-textfield__input" type="text" rows= "3" id="sample5" ></textarea>
                        <label className="mdl-textfield__label" htmlFor="sample5">Text lines...</label>
                    </div>
                </htmlForm>
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                    <i className="material-icons">search</i>
                </button>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
                    <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="sample6">
                        <i className="material-icons">search</i>
                    </label>
                    <div className="mdl-textfield__expandable-holder">
                        <input className="mdl-textfield__input" type="text" id="sample6"/>
                            <label className="mdl-textfield__label" htmlFor="sample-expandable">Expandable Input</label>
                    </div>
                </div>*/}

            </div>
            </Layout>
        );
    }

}

export default HomePage;
