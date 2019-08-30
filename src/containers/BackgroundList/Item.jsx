/* global chrome */
import React, { Component } from 'react';
import APP_CONFIG from '../../config/config';

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
                <div className="bi-drag"><span className="iconfont icon-drag-vertical"></span></div>
                <div className="bi-img">
                    <a title={name} href={marketUrl} target="_blank" rel="noopener noreferrer">
                        <img src={backgroundUrl + '96fx96f'} width="92px" height="92px" alt="" />
                    </a>
                </div>
                <div className="bi-name">
                    <a className="bi-n-link" title={name} href={marketUrl} target="_blank" rel="noopener noreferrer">{name}</a>
                    <span className="bi-n-price">{marketPrice}</span>
                </div>
                <div className="bi-operate">
                    <span className="bi-o-button" onClick={() => { this.props.onLike(marketUrl) }}>
                        <span className={isLike ? 'iconfont icon-star stared' : 'iconfont icon-star'}></span>
                    </span>
                    <span className="bi-o-button" onClick={() => { this.props.onRemove(marketUrl) }}>
                        <span className="iconfont icon-remove"></span>
                    </span>
                    <span className="bi-o-button" onClick={() => { this.setBackgound(backgroundUrl) }}>
                        <span className="iconfont icon-brush"></span>设为背景
                    </span>
                </div>
            </li>
        )
    }

    /** 
     * setBackgound
     * Change Steam profile page's background image
     * 应用当前背景图至 Steam 个人资料页
     * @param {string} url
     */
    setBackgound = url => {
        // ENV production use Chrome API
        if (process.env.NODE_ENV === 'production') {
            // Send message to content-script/index.js
            const message = {
                action: APP_CONFIG.actionType.SET_BACKGROUND,
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
