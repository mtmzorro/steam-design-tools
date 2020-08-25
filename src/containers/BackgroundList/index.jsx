/* global chrome */
import React, { Component } from 'react';
import ReactDragListView from 'react-drag-listview';
import APP_CONFIG from '../../config/config';
import ChromeStorage from '../../utils/chromeAPI';
import Item from './item';
import './index.scss';
import mockData from '../../mock/backgroundData.json';

export default class BackgroundList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backgorundList: []
        };
    }

    componentDidMount() {
        // ENV development 无法运行 Chrome API
        if (process.env.NODE_ENV === 'production') {
            // ENV production get data from Chrome storage
            ChromeStorage.get(APP_CONFIG.itemName).then((data) => {
                const resultData = data.result[APP_CONFIG.itemName] ? data.result[APP_CONFIG.itemName] : [];
                this.setState({ backgorundList: resultData })
            });
        } else {
            // ENV development use mock data
            this.setState({ backgorundList: mockData });
        }
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

    /**
     * updateChromeStorage
     * Save data into Chrome storage
     * 向 Chrome storage 存储数据
     */
    updateChromeStorage = (data) => {
        if (process.env.NODE_ENV === 'production') {
            ChromeStorage.set(APP_CONFIG.itemName, data).then((data) => {
                if (data.success) {
                    console.log('Storage saved');
                }
            })
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
        const { backgorundList } = this.state;
        const cache = backgorundList.map((item, index) => {
            if (item.marketUrl === data) {
                item.isLike = !item.isLike;
            }
            return item;
        })
        
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
        const { backgorundList } = this.state;
        const cache = backgorundList.filter((item) => {
            return item.marketUrl !== data;
        })

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
        const cache = [ ...this.state.backgorundList ];
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
        const { backgorundList } = this.state;
        const cache = backgorundList.filter(item => item.isLike);

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

    render() {
        const _this = this;
        const { backgorundList } = this.state;

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
        const generateBackgoundList = () => {
            return (
                <>
                    {backgorundList && backgorundList.length > 0 ? (
                        <ReactDragListView {...dragProps}>
                            <ul>
                                {backgorundList.map((item) => (
                                    <Item
                                        key={item.marketUrl}
                                        item={item}
                                        onLike={this.likeItem}
                                        onRemove={this.removeItem}
                                        setBackgound={this.setBackgound}
                                    />
                                ))}
                            </ul>
                        </ReactDragListView>
                    ) : (
                        <div className="empty-info">
                            <div className="ei-icon">
                                <span className="iconfont icon-steam"></span>
                            </div>
                            <div className="ei-title">
                                在浏览器 Steam 页面中选择需预览的背景图
                            </div>
                            <div className="ei-content">
                                请您用当前浏览器打开 Steam，然后在「Steam 市场」搜索结果列表中点击价格左侧的<strong>「+」</strong>按钮，或者在「物品库存」页背景图详情右侧点击<strong>「在 Steam Design Tools 中预览」</strong>将背景图片缓存至工具中。
                            </div>
                        </div>
                    )}
                </>
            );
        }
        // Bottom operate
        const generateOperate = () => {
            return (
                <>
                    {backgorundList && backgorundList.length > 0 ? (
                        <div className="bl-operate">
                            <span className="button button-clearUnLike" onClick={this.clearUnLikeItem}>清空未标星</span>
                            <span className="button button-clearall" onClick={this.clearAllItem}>清空全部</span>
                        </div>
                    ) : (
                        <div className="bl-operate">
                            <a className="button button-help" href="https://steamdt.mtmzorro.com/" target="_blank" rel="noopener noreferrer">帮 助</a>
                        </div>
                    )}
                </>
            )
        }

        return (
            <div className="background-list">
                <div className="bl-wrap">
                    {generateBackgoundList()}
                </div>
                {generateOperate()}
            </div>
        )
    }
}
