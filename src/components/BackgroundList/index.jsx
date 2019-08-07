/* global chrome */
import React, { Component } from 'react'
import Item from './Item';
import _ from 'lodash';
import './index.scss';

/* eslint-disable no-undef */
// 监听来自content-script的消息
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     console.log('收到来自content-script的消息：');
//     console.log(request, sender, sendResponse);
//     sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
// });
/* eslint-enable no-undef */

export default class BackgroundList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backgorundList: [
                {
                    "name": "Cozy Cottage - Yu-Gi-Oh! Duel Links - Judai",
                    "backgroundUrl": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxH5rd9eDAjcFyv45SRYAFMIcKL_PArgVSL403ulRUWEndVKv0jp6KCw07d1cD7-6jKgFmhaeaJWlBu4znl9WIlaDxZLnSkGgA7MZ307GT9oml0Rq-uxReufJCCw/",
                    "marketPrice": "¥ 0.23",
                    "marketUrl": "https://steamcommunity.com/market/listings/753/991980-Cozy%20Cottage%20-%20Yu-Gi-Oh!%20Duel%20Links%20-%20Judai"
                },
                {
                    "name": "Cozy Cottage - Dead by Daylight Winter",
                    "backgroundUrl": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxH5rd9eDAjcFyv45SRYAFMIcKL_PArgVSL403ulRUWEndVKv0jp6KCw07fQAG4rigelYyhaecImoatYriwdCJwKanZ-OCkmoD6p0gj-iQ9tr2iRq-uxR2ZPwKaQ/",
                    "marketPrice": "¥ 0.23",
                    "marketUrl": "https://steamcommunity.com/market/listings/753/991980-Cozy%20Cottage%20-%20Dead%20by%20Daylight%20Winter"
                }
            ]

        };
    }

    render() {
        const backgorundList = this.state.backgorundList;

        return (
            <div className="backgorund-list">
                <ul>
                    {
                        backgorundList.map((item) =>
                            <Item key={item.name} data={item} onStar={this.starItem} />
                        )
                    }

                </ul>
            </div>
        )
    }

    componentDidMount() {
        // yarn start 开发环境中不含chrome API 跳过
        if (process.env.NODE_ENV !== 'development') {
            // 从存储中获取数据
            chrome.storage.local.get('background_data', result => {
                this.setState({
                    backgorundList: result['background_data']
                });
            });
        }
    }
    /**
     * starHandle
     * 暂存当前项目
     */
    starItem = name => {
        let index = _.findIndex(this.state.backgorundList, ['name', name]);
        let cache = this.state.backgorundList.slice();
        let itemCache = cache[index];
        cache.splice(index, 1);
        cache.unshift(itemCache);
        this.setState({
            backgorundList: cache
        });
    }
}
