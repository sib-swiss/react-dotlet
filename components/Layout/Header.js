import React from 'react';
import s from './Header.css';


class Header extends React.Component {
    render() {
        return (
            <header className={"mdl-layout__header "+s.header} ref="root">
                <div className={"mdl-layout__header-row "+s.headerRow} {...this.props} >
                    <span className="mdl-layout-title">
                        Dotlet JS <span className={s.beta}>beta</span>
                    </span>
                    <div className="mdl-layout-spacer"></div>
                    <div className="mdl-logo">
                        <a href="http://www.sib.swiss/">
                            <img src={require("../../public/images/sib_logo_small.png")} height="36"/></a></div>
                    <div className="mdl-logo">
                        <a href="https://www.vital-it.ch/">
                            <img src={require("../../public/images/vital-it_small.png")} height="36"/></a></div>
                </div>
            </header>
        );
    }
}


export default Header;
