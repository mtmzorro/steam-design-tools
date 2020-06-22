import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

export default class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="footer-content">
                    <a className="fc-github" target="_blank" href="https://steamDT.mtmzorro.com" rel="noopener noreferrer">
                        <span className="iconfont icon-github"></span><em>Star</em>
                    </a>
                    <Link to="/about/" className="fc-about">About</Link>
                </div>
            </footer>
        )
    }
}
