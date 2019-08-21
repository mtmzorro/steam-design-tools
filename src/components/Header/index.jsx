import React, { Component } from 'react';
import './index.scss';
import logoUrl from '../../assets/img/icon-white.png';
import logoTextUrl from '../../assets/img/title-2x.png';

export default class Header extends Component {
    render() {
        return (
            <header className="header">
                <h1>
                    <img className="logo" src={logoUrl} alt="Logo" />
                    <img className="logo-text" src={logoTextUrl} alt="Steam Design Tools" />
                </h1>
                <div className="header-bg"></div>
            </header>
        )
    }
}
