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

class HomePage extends React.Component {

    render() {
        return (
            <Layout>
            <div>
                <InputPanel />
                <DotterPanel window_size={10} />
                <DensityPanel />
                <TwoSeqsPanel />
            </div>
            </Layout>
        );
    }

}

export default HomePage;
