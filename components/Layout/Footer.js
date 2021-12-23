
import React from 'react';
import s from './Footer.css'
import * as theme from '../constants/theme';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Github from './Github';


class Footer extends React.Component {
    render() {
        return (
            <footer className={"mdl-mini-footer "+s.footer}
                    style={{background: theme.primaryColor}} >

                <div className="mdl-mini-footer__left-section">
                    <div className={"mdl-logo "+s.footerItem +' '+ s.footerLeft}>© SIB Vital-IT 2016-{(new Date()).getFullYear()}</div>
                    <div className={"mdl-logo "+s.footerItem}>v{require("../../package.json").version}</div>
                </div>

                <div className="mdl-mini-footer__right-section">
                    <ul className="mdl-mini-footer__link-list">

                        <li className="mdl-mini-footer--social-btn" style={{ backgroundColor: 'transparent' }}>
                            <div>
                                <a href="https://github.com/sib-swiss/react-dotlet" target="_blank" rel="noopener">
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
                                <a href="https://myhits.sib.swiss/util/dotlet/doc/dotlet_help.html" target="_blank" rel="noopener">
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
