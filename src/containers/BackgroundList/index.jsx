/* global chrome */
import React, { Component } from 'react';
import _ from 'lodash';
import ReactDragListView from 'react-drag-listview';
import Item from './Item';
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
        let backgorundListContent;
        // ReactDragListView 相关参数
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                const cache = backgorundList.slice();
                const item = cache.splice(fromIndex, 1)[0];
                cache.splice(toIndex, 0, item);
                _this.setState({ backgorundList: cache });
            },
            nodeSelector: 'li',
            handleSelector: '.bi-drag',
            lineClassName: 'drap-line'
        };

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
                                <Item key={item.marketUrl} data={item}
                                    onLike={this.likeItem}
                                    onRemove={this.removeItem}
                                />
                            )
                        }
                    </ul>
                </ReactDragListView>
            );
        }

        return (
            <div className="background-list">
                <div className="bl-wrap">
                    {backgorundListContent}
                </div>
                <div className="bl-operate">
                    <span className="button button-clearUnLike" onClick={() => { this.clearUnLikeItem(); }}>清空未标星</span>
                    <span className="button button-clearall" onClick={() => { this.clearAllItem(); }}>清空全部</span>
                </div>
            </div>
        )
    }

    componentDidMount() {
        // yarn start 开发环境中不含chrome API 跳过
        if (process.env.NODE_ENV !== 'development') {
            // 从存储中获取数据
            chrome.storage.local.get('background_data', result => {
                let resultData = result['background_data'] ? result['background_data'] : [];
                this.setState({ backgorundList: resultData });
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
            this.setState({ backgorundList: mockData });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.state)
    }

    /**
     * likeItem
     * like 当前项目
     * @param {string} data 区分数据项唯一依据，name 会重复故使用 marketUrl
     */
    likeItem = data => {
        // 通过 marketUrl 做唯一区分找到该条数据
        const index = _.findIndex(this.state.backgorundList, ['marketUrl', data]);
        let cache = this.state.backgorundList.slice();

        cache[index].isLike = cache[index].isLike ? false : true;
        this.setState({ backgorundList: cache });
    }

    /**
     * removeItem
     * 删除列表中指定的项目
     * @param {string} data 区分数据项唯一依据，name 会重复故使用 marketUrl
     */
    removeItem = data => {
        const index = _.findIndex(this.state.backgorundList, ['marketUrl', data]);
        let cache = this.state.backgorundList.slice();

        cache.splice(index, 1);
        this.setState({ backgorundList: cache });
    }

    /**
     * clearUnLikeItem
     * 删除列表中未 like 的项目
     * @param {string} data 区分数据项唯一依据，name 会重复故使用 marketUrl
     */
    clearUnLikeItem = data => {
        let cache = this.state.backgorundList.slice();

        cache = cache.filter(item => item.isLike);
        this.setState({ backgorundList: cache });
    }

    /**
     * clearAll
     * 删除列表中全部数据
     */
    clearAllItem = () => {
        this.setState({ backgorundList: [] });
    }
}
