/* global $ */

/**
 * GLOBAL_CONFIG
 * Chrome 注入页面内相关全局配置
 */
const GLOBAL_CONFIG = {
    // Chrome local storage table name
    TABLE_NAME: 'background_data',
    // Data structure
    // @returns {object} 
    GET_TABLE_STRUCTURE() {
        return {
            // 背景图素材name
            name: new String(),
            // 当前背景图素材原始尺寸URL
            backgroundUrl: new String(),
            // 当前背景图素材Steam市场URL
            marketUrl: new String(),
            // 当前背景图素材Steam市场售价 string
            marketPrice: new String(),
            // 是否喜欢
            isLike: false
        }
    },
    // Chrome 扩展中与 background.js&弹出主页 相关 Message Action 类型
    ACTION_TYPE: {
        // 传递至 background.js: Chrome 右上角扩展 ICON 数量更新
        BADGE_UPDATE: 'BADGE_UPDATE',
        // 传递自 插件弹出主页: 将用户所选择背景图应用至当前 Steam 个人资料页
        SET_BACKGROUND: 'SET_BACKGROUND'
    }
};

/**
 * SteamImgUrl
 * Steam CDN 图片地址处理
 * @param {string} url
 * @example https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxH5rd9eDAjcFyv45SRYAFMIcKL_PArgVSL403ulRUWEndVKv0jp6KCw07IVMPs7n9LwU0h6HNcjlBtYvlkteKk_SgNbmIxT8J7JUp2OiYrd-gixq-uxR6VrmHMw/330x192
 */
class SteamImgUrl {
    constructor(url) {
        this.url = url;
        this.defaultUrl = '';
        this.resetUrl();
    }
    resetUrl() {
        let urlArray = this.url.split('/');
        urlArray.pop();
        this.defaultUrl = urlArray.join('/') + '/';
    }
    getFullSize() {
        return this.defaultUrl;
    }
    get96size() {
        return this.defaultUrl + '96fx96f';
    }
    get62size() {
        return this.defaultUrl + '62fx62f';
    }
};

/**
 * chromeHandle
 * chrome API 相关方法
 */
const chromeHandle = {
    /**
     * storageAdd
     * 向 Chrome storage 目标表内增加数据
     * @param {string} table_name
     * @param {object} data 
     * @param {function} callback 回调相关函数
     */
    storageAdd(table, data, callback) {
        chrome.storage.local.get([table], result => {
            // 现有数据缓存 
            let cache = [];
            // 新的待存储对象
            let storageData = {};
            // 当前表已存在则获取其浅拷贝增量增加并判断重复
            if (typeof result[table] !== 'undefined') {
                cache = result[table].slice();
                // 如果当前 data 一存在则 return
                for (const key in cache) {
                    if (cache.hasOwnProperty(key)) {
                        // 经过测试 Steam 背景图物品 name 有相同情况
                        if (cache[key].marketUrl === data.marketUrl) return;
                    }
                }
            }
            // 当前表不存在直接增加新数据
            cache.push(data);
            storageData[table] = cache;
            // 把修改完缓存数据写入存储
            chrome.storage.local.set(storageData, () => {
                // 执行回调函数 并把存储数据作为参数返回
                callback(storageData[table]);
            });
        });
    },
    /**
     * sendBadgeMsg
     * 向 background.js 发送 Chrome 右上角扩展 ICON 数量更新消息
     * @param {number} num Badge 显示数量
     */
    sendBadgeMsg(num) {
        // 设置 badge 图标当前存储数量
        const message = {
            action: GLOBAL_CONFIG.ACTION_TYPE.BADGE_UPDATE,
            data: num.toString()
        }
        // 发送消息给 background.js
        chrome.runtime.sendMessage(message, response => { });
    }
};

/**
 * inventoryTools
 * Steam 个人库存增强
 */
const inventoryTools = {
    init() {
        // 非 Steam 个人库存增强不处理
        // @example https://steamcommunity.com/id/userid/inventory/
        if (!/\/inventory/.test(window.location.href)) return;
        // 初始化 inventorySidebar 增强
        this.inventorySidebar();
    },
    /**
     * inventorySidebar
     * 库存侧边栏增加暂存预览功能
     */
    inventorySidebar() {
        let _this = this;
        // 监听侧边栏缩略图载入并追加按钮
        $('#iteminfo1_item_icon, #iteminfo0_item_icon').on('load', function () {
            // 侧边栏容器
            const inventorySidebar = $(this).parents('.inventory_iteminfo');
            const buttonArea = inventorySidebar.find('.item_actions');
            // 定义暂存背景图项目按钮
            const buttonHtml = `<a class="btn_small btn_grey_white_innerfade btn_std" href="javascript:;">
                                    <span>Steam Design Tools 预览</span>
                                </a>`;
            const button = $(buttonHtml);
            button.attr('data-url', $(this).attr('src'));

            // reset 跳转button状态
            inventorySidebar.find('.btn_std').remove();
            // 仅在背景图类上提供触发按钮
            if (buttonArea.is(':visible')) {
                button.appendTo(buttonArea);
            }
        });
        // 暂存预览功能触发
        $('.btn_std').live('click', function () {
            // 侧边栏容器
            const inventorySidebar = $(this).parents('.inventory_iteminfo');
            const marketSection = inventorySidebar.find('.market_item_action_buyback_at_price');

            // 背景图素材所有数据
            let backgroundData = GLOBAL_CONFIG.GET_TABLE_STRUCTURE();
            backgroundData = {
                name: inventorySidebar.find('.hover_item_name').text(),
                backgroundUrl: new SteamImgUrl($(this).attr('data-url')).getFullSize(),
                marketUrl: marketSection.prev().prev().find('a').attr('href'),
                marketPrice: _this.priceExtract(marketSection.prev().html()),
                isLike: false
            };

            // 写入 chrome.storage
            chromeHandle.storageAdd(GLOBAL_CONFIG.TABLE_NAME, backgroundData, (data) => {
                if (typeof data !== 'undefined' && data.length > 0) {
                    // 设置 badge 图标当前存储数量
                    chromeHandle.sendBadgeMsg(data.length);
                }
            });
        });
    },
    /**
     * priceExtract
     * 从价格 HTML 中解析出价格
     * @param {string} str 
     * @example 開始価格: ¥ 0.23 <br> xadasd
     * @example Starting at: ¥ 0.24 <br> Volume
     * @example 正在加载中异常: //steamcommunity-a.akamaihd.net/public/images/login/throbber.gif" alt="处理中...">
     */
    priceExtract(str) {
        // 解析到加载中异常返回 ??.00
        if (!/login\/throbber.gif/.test(str)) return '??.00';

        const strResult = str.split('<br>')[0];
        const divSymbol = /：/.test(str) ? '：' : ':';
        return strResult.split(divSymbol)[1].trim();
    }
};

/**
 * profileTools
 * Steam 个人资料页预览增强
 */
const profileTools = {
    /**
     * init
     * 初始化
     */
    init() {
        // 非个人资料页不处理
        // @example https://steamcommunity.com/id/userid
        if (!/\/id/.test(window.location.href) || $('.profile_page').length === 0) return;
        // 设置个人资料页消息监听器
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            // 设置替换背景图
            if (request.action === GLOBAL_CONFIG.ACTION_TYPE.SET_BACKGROUND && request.data) {
                this.setBackground(request.data);
            }
        });
    },
    /**
     * setBackground
     * 设置替换背景图
     * @param {string} backgroundUrl 
     */
    setBackground(backgroundUrl) {
        // 资料页容器
        const profilePage = $('.profile_page').eq(1);
        profilePage.css('background-image', 'url(' + backgroundUrl + ')')
            .find('.profile_background_image_content').css('background-image', 'url(' + backgroundUrl + ')');
    }
};

/**
 * marketTools
 * Steam 市场预览增强
 */
const marketTools = {
    /**
     * init
     * 初始化
     */
    init() {
        // 非 Steam 市场不处理
        // @example https://steamcommunity.com/market/search?q=XXX
        if (!/\/market/.test(window.location.href) || $('.market_listing_row').length === 0) return;
        this.setAddButton();
    },
    /**
     * setAddButton
     * 增加 background 暂存 button
     */
    setAddButton() {
        // Steam 物品项
        const listItem = $('.market_listing_row')
        // addButton 相关
        const addButton = $('<span class="sdt-add-button" title="使用 Steam Design tools 预览">+</span>');
        const buttonStyle = `
            position: absolute;
            right: 158px;
            top: 25px;
            display: inline-block;
            height: 24px;
            width: 26px;
            line-height: 24px;
            text-align: center;
            background-color: #68932f;
            border-radius: 2px;
            -moz-border-radius: 2px;
            color: #d2ff96;
            font-size: 20px;
            z-index: 10;
        `;
        addButton.attr('style', buttonStyle);

        // TODO: 国际化时增加繁体中文、日文等判断
        // 是否为 background 类型 Steam 物品字符串
        const backgroundTestSring = /个人资料背景|background/;
        // 列表追加事件
        listItem.live('mouseenter', function () {
            // 只给 background 类型 Steam 物品追加 addButton
            const itemType = $(this).find('.market_listing_game_name').text();
            if (backgroundTestSring.test(itemType)) {
                $(this).append(addButton);
            }
        }).live('mouseleave', function () {
            $(this).find('.sdt-add-button').remove();
        });

        // addButton 暂存预览功能触发
        $('.sdt-add-button').live('click', function (event) {
            event.preventDefault();

            // 当前 Steam 物品项
            const curlistItem = $(this).parents('.market_listing_row');
            const backgroundUrlEle = curlistItem.find('.market_listing_item_img');

            // 处理 Steam 可能出现的不存背景图的背景图商品异常
            if (backgroundUrlEle.length === 0) return;

            // 背景图素材所有数据
            let backgroundData = GLOBAL_CONFIG.GET_TABLE_STRUCTURE();
            backgroundData = {
                name: curlistItem.find('.market_listing_item_name').text(),
                backgroundUrl: new SteamImgUrl(backgroundUrlEle.attr('src')).getFullSize(),
                marketUrl: curlistItem.parents('.market_listing_row_link').attr('href'),
                marketPrice: curlistItem.find('.normal_price').eq(1).text(),
                isLike: false
            };

            // 写入 chrome.storage
            chromeHandle.storageAdd(GLOBAL_CONFIG.TABLE_NAME, backgroundData, (data) => {
                if (typeof data !== 'undefined' && data.length > 0) {
                    // 设置 badge 图标当前存储数量
                    chromeHandle.sendBadgeMsg(data.length);
                }
            });
        }).live('mouseenter', function () {
            $(this).css({ 'background-color': '#8ac33e' });
        }).live('mouseleave', function () {
            $(this).css({ 'background-color': '#68932f' });
        });
    }
};

/**
 * DOM READY 注册事件
 */
$(document).ready(function () {
    inventoryTools.init();
    profileTools.init();
    marketTools.init();
});