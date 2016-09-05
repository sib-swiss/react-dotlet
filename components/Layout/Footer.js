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
import s from './Footer.css'
import * as theme from '../constants/theme';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Github from './Github';


/*
 * Wrapper for a common header layout.
 * Layout.js chooses what to put in it.
 */

class Footer extends React.Component {
    render() {
        return (
            <footer className={"mdl-mini-footer "+s.footer}
                    style={{background: theme.primaryColor}} >

                <div className="mdl-mini-footer__left-section">
                    <div className={"mdl-logo "+s.footerItem +' '+ s.footerLeft}>© Vital-IT 2016</div>
                </div>

                <div className="mdl-mini-footer__right-section">
                    <ul className="mdl-mini-footer__link-list">

                        <li className="mdl-mini-footer--social-btn" style={{ backgroundColor: 'transparent' }}>
                            <div>
                                <a href="https://gitlab.isb-sib.ch/jdelafon/react-dotlet" target="_blank">
                                    <IconButton iconStyle={{color:'white', fontSize: '35px'}}
                                                style={{padding:'8px'}}
                                                tooltip="Source code"
                                                tooltipPosition="top-center"
                                    >
                                        <Github />
                                    </IconButton>
                                </a>
                            </div>
                        </li>

                        <li className="mdl-mini-footer--social-btn" style={{ backgroundColor: 'transparent' }}>
                            <div>
                                <a href="http://myhits.isb-sib.ch/util/dotlet/doc/dotlet_help.html" target="_blank">
                                    <IconButton iconStyle={{color:'white', fontSize: '35px'}}
                                                style={{padding:'8px'}}
                                                tooltip="Documentation"
                                                tooltipPosition="top-center"
                                    >
                                        <FontIcon className="material-icons">help</FontIcon>
                                    </IconButton>
                                </a>
                            </div>
                        </li>

                    </ul>
                </div>

            </footer>
        )
    }
}


export default Footer;
