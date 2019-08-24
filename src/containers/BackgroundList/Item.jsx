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
