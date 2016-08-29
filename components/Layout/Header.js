import React from 'react';
import s from './Layout.css';


class Header extends React.Component {
    render() {
        return (
            <header className={"mdl-layout__header "+s.header} ref="root">
                <div className={"mdl-layout__header-row "+s.headerRow} {...this.props} >
                    <span className="mdl-layout-title">Dotlet Reborn</span>
                    <div className="mdl-layout-spacer"></div>
                    <div className="mdl-logo">
                        <a href="http://www.sib.swiss/">
                            <img src={require("../../public/images/sib_logo_small.png")} height="36"/></a></div>
                    <div className="mdl-logo">
                        <a href="https://www.vital-it.ch/">
                            <img src={require("../../public/images/vitalit_logo_47x36.png")}/></a></div>
                </div>
            </header>
        );
    }

}


export default Header;
