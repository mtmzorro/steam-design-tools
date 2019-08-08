/* global chrome */
import React, { Component } from 'react'
import _ from 'lodash';
import ReactDragListView from 'react-drag-listview';
import BackgroundItem from '../BackgroundItem';
// import axios from 'axios';
import './index.scss';
import mockData from '../../mock/backgroundData.json';


export default class BackgroundList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backgorundList: []
        };
    }

    render() {
        const _this = this;
        const backgorundList = this.state.backgorundList;
        // ReactDragListView 相关参数
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                const cache = backgorundList.slice();
                const item = cache.splice(fromIndex, 1)[0];
                cache.splice(toIndex, 0, item);
                _this.setState({ backgorundList: cache });
            },
            nodeSelector: 'li',
            handleSelector: 'span.bl-drap',
            lineClassName: 'drap-line'
        };
        let backgorundListContent;

        if (backgorundList.length === 0) {
            backgorundListContent = (
                <span className="bl-info">暂无数据</span>
            );
        } else {
            backgorundListContent = (
                <ReactDragListView {...dragProps}>
                    <ul>
                        {
                            backgorundList.map((item) =>
                                <BackgroundItem key={item.marketUrl} data={item} onStar={this.starItem} />
                            )
                        }
                    </ul>
                </ReactDragListView>
            );
        }

        return (
            <div className="backgorund-list">
                {backgorundListContent}
            </div>
        )
    }

    componentDidMount() {
        // yarn start 开发环境中不含chrome API 跳过
        if (process.env.NODE_ENV !== 'development') {
            // 从存储中获取数据
            chrome.storage.local.get('background_data', result => {
                let resultData = result['background_data'] ? result['background_data'] : [];
                this.setState({
                    backgorundList: resultData
                });
            });
        } else {
            // 开发环境使用 mock 数据
            // axios.get(mockData)
            //     .then(function (response) {
            //         console.log(response);
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });
            this.setState({
                backgorundList: mockData
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
