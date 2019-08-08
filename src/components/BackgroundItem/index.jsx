/* global chrome */
import React, { Component } from 'react';

export default class BackgroundItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            star: false
        }
    }
    render() {
        const { name, marketUrl, marketPrice, backgroundUrl } = this.props.data;
        return (
            <li>
                <div className="bl-img">
                    <a href={marketUrl} target="_blank" rel="noopener noreferrer">
                        <img src={backgroundUrl + '96fx96f'} width="92px" height="92px" alt="" />
                    </a>
                </div>
                <div className="bl-name">
                    <a className="bl-n-link" href={marketUrl}>{name}</a>
                </div>
                <div className="bl-operate">
                    <span onClick={() => { this.starHandle(name) }}>暂存</span>
                    <span className="bl-drap">删除</span>
                    <span onClick={() => { this.setBackgound(backgroundUrl) }}>设为背景</span>
                </div>
                <div className="bl-price">{marketPrice}</div>
            </li>
        )
    }
    /**
     * 
     */
    starHandle = name => {
        this.props.onStar(name);
    }
    /** 
     * setBackgound
     * @param {string} url
     */
    setBackgound = url => {
        // yarn start 开发环境中不含chrome API 跳过
        if (process.env.NODE_ENV !== 'development') {
            const message = {
                action: 'SET_BACKGROUND',
                data: url
            }
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, message, response => {
                    // if(callback) callback(response);
                });
            });
        }
    }

}
