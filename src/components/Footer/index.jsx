import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

export default class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="footer-content">
                    <a className="github" target="_blank" href="https://github.com/mtmzorro/steam-design-tools" rel="noopener noreferrer">
                        <span className="iconfont icon-github"></span><em>Star</em>
                    </a>
                    <Link to="/about/" className="about">About</Link>
                </div>
            </footer>
        )
    }
}
