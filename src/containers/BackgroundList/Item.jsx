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
                        {
                            /\/economy\/profilebackground/.test(backgroundUrl) 
                            ? <img src={backgroundUrl + '?size=96x60'} alt="background-item" />
                            : <img src={backgroundUrl + '96fx96f'} alt="background-item" />
                        }
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
                        <span className="iconfont icon-brush"></span><em>设为背景</em>
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
            // query current tab id
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                // runtime.onMessage in content-scripts/index.js will fired
                chrome.tabs.sendMessage(tabs[0].id, message, response => {
                    if (response) {
                        console.log(response)
                    } else {
                        console.log('Steam Design Tools: error on sendMessage');
                        alert('识别不到 Steam 个人主页，请刷新个人主页，并保持为浏览器当前激活标签页。');
                    }
                });
            });
        }
    }

}
