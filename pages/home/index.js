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
                <DotterPanel s1="AAAAAAATTTCCCCCCTTGC" s2="AAAGAAATTTCCCCCCATGC" window_size={10} />
            </div>
            </Layout>
        );
    }

}

export default HomePage;
