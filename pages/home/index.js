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
import s from './styles.css';
import Layout from '../../components/Layout';
import DotterPanel from '../../components/DotterPanel';
import InputPanel from '../../components/InputPanel';
import DensityPanel from '../../components/DensityPanel';
import TwoSeqsPanel from '../../components/TwoSeqsPanel';
import InfoPanel from '../../components/InfoPanel';
import Minimap from '../../components/DotterPanel/Minimap';


/*
 * Route page to '/'.
 */

class HomePage extends React.Component {
    render() {
        return (
            <Layout>
            <div ref="root" className={s.root}>
                <InputPanel />
                <div className={s.midPanel}>
                    <div className={s.dotterPanelContainer}>
                        <DotterPanel />
                        <InfoPanel />
                    </div>
                    <div className={s.densityPanelContainer}>
                        <Minimap />
                        <DensityPanel />
                    </div>
                </div>
                <div className={s.twoSeqsPanelContainer}>
                    <TwoSeqsPanel />
                </div>
            </div>
            </Layout>
        );
    }

}

export default HomePage;
