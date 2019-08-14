import React, { Component } from 'react';
import './index.scss';

export default class Header extends Component {
    render() {
        return (
            <header className="header">
                <h1>Steam Design Tools</h1>
                <div className="header-bg"></div>
            </header>
        )
    }
}
