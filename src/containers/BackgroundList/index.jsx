/* global chrome */
import React, { Component } from 'react';
import ReactDragListView from 'react-drag-listview';
import APP_CONFIG from '../../config/config';
import _ from 'lodash';
import Item from './Item';
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
        let operateContent;
        // ReactDragListView
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                _this.dragItem(fromIndex, toIndex);
            },
            nodeSelector: 'li',
            handleSelector: '.bi-drag',
            lineClassName: 'drap-line'
        };

        // backgorundList Empty Page 冷启动
        if (backgorundList.length === 0) {
            backgorundListContent = (
                <div className="empty-info">
                    <div className="ei-icon"><span className="iconfont icon-steam"></span></div>
                    <div className="ei-title">在浏览器 Steam 页面中选择需预览的背景图</div>
                    <div className="ei-content">
                        请您用当前浏览器打开 Steam，然后在「Steam 市场」搜索结果列表中点击价格左侧的<strong>「+」</strong>按钮，或者在「物品库存」页背景图详情右侧点击<strong>「在 Steam Design Tools 中预览」</strong>将背景图片缓存至工具中。
                    </div>
                </div>
            );
            operateContent = (
                <div className="bl-operate">
                    <a className="button button-help" href="https://github.com/mtmzorro/steam-design-tools" target="_blank" rel="noopener noreferrer">帮 助</a>
                </div>
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
            operateContent = (
                <div className="bl-operate">
                    <span className="button button-clearUnLike" onClick={() => { this.clearUnLikeItem(); }}>清空未标星</span>
                    <span className="button button-clearall" onClick={() => { this.clearAllItem(); }}>清空全部</span>
                </div>
            );
        }

        return (
            <div className="background-list">
                <div className="bl-wrap">
                    {backgorundListContent}
                </div>
                {operateContent}
            </div>
        )
    }

    componentDidMount() {
        // ENV development 无法运行 Chrome API
        if (process.env.NODE_ENV === 'production') {
            // ENV production get data from Chrome storage
            chrome.storage.local.get([APP_CONFIG.TABLE_NAME], result => {
                let resultData = result[APP_CONFIG.TABLE_NAME] ? result[APP_CONFIG.TABLE_NAME] : [];
                this.setState({ backgorundList: resultData });
            });
        } else {
            // ENV development use mock data
            this.setState({ backgorundList: mockData });
        }
    }

    /**
     * updateChromeStorage
     * Save data into Chrome storage
     * 向 Chrome storage 存储数据
     */
    updateChromeStorage = (data) => {
        if (process.env.NODE_ENV === 'production') {
            let cache = {};
            cache[APP_CONFIG.TABLE_NAME] = data;
            chrome.storage.local.set(cache, () => {
                console.log('Storage saved');
            });
        }
    }

    /**
     * likeItem
     * Like Background item
     * 将喜欢的项目标星
     * @param {string} data unique value in Background item, name is not unique, use marketUrl instead. name 不唯一
     */
    likeItem = data => {
        // Use marketUrl find Background item data
        const index = _.findIndex(this.state.backgorundList, ['marketUrl', data]);
        let cache = this.state.backgorundList.slice();

        cache[index].isLike = cache[index].isLike ? false : true;
        this.setState({ backgorundList: cache });
        this.updateChromeStorage(cache);
    }

    /**
     * removeItem
     * Remove Background item
     * 删除 Background item
     * @param {string} data unique value in Background item, name is not unique, use marketUrl instead. name 不唯一
     */
    removeItem = data => {
        const index = _.findIndex(this.state.backgorundList, ['marketUrl', data]);
        let cache = this.state.backgorundList.slice();

        cache.splice(index, 1);
        this.setState({ backgorundList: cache });
        this.updateChromeStorage(cache);
    }

    /**
     * dragItem
     * Drap to sort Background item
     * 拖拽排序 Background item
     * @param {number} fromIndex original index
     * @param {number} toIndex target index
     */
    dragItem = (fromIndex, toIndex) => {
        const cache = this.state.backgorundList.slice();
        const item = cache.splice(fromIndex, 1)[0];
        cache.splice(toIndex, 0, item);
        this.setState({ backgorundList: cache });
        this.updateChromeStorage(cache);
    }

    /**
     * clearUnLikeItem
     * Remove unlike item in list
     * 删除未标星项目
     */
    clearUnLikeItem = () => {
        let cache = this.state.backgorundList.slice();

        cache = cache.filter(item => item.isLike);
        this.setState({ backgorundList: cache });
        this.updateChromeStorage(cache);
    }

    /**
     * clearAll
     * Remove all item 删除全部
     */
    clearAllItem = () => {
        this.setState({ backgorundList: [] });
        this.updateChromeStorage([]);
    }
}
