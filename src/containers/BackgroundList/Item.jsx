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
        const { name, marketUrl, marketPrice, backgroundUrl, isLike } = this.props.data;
        return (
            <li className="background-item">
                <div className="bi-img">
                    <a href={marketUrl} target="_blank" rel="noopener noreferrer">
                        <img src={backgroundUrl + '96fx96f'} width="92px" height="92px" alt="" />
                    </a>
                </div>
                <div className="bi-name">
                    <a className="bi-n-link" href={marketUrl}>{name}</a>
                </div>
                <div className="bi-operate">
                    <span onClick={() => { this.props.onLike(marketUrl) }}>
                        {isLike ? 'stared' : 'star'}
                    </span>
                    <span className="bi-drap" onClick={() => { this.props.onRemove(marketUrl) }}>删除</span>
                    <span onClick={() => { this.setBackgound(backgroundUrl) }}>设为背景</span>
                </div>
                <div className="bi-price">{marketPrice}</div>
            </li>
        )
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
