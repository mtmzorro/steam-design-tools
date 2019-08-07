/* global $ */
/**
 * ImgUrl
 * Steam CDN 图片地址处理
 * @param {string} url
 * @example https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxH5rd9eDAjcFyv45SRYAFMIcKL_PArgVSL403ulRUWEndVKv0jp6KCw07IVMPs7n9LwU0h6HNcjlBtYvlkteKk_SgNbmIxT8J7JUp2OiYrd-gixq-uxR6VrmHMw/330x192
 */
class ImgUrl {
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
 * chromeStorageAPI
 * chrome.storage 存储相关 API 拓展
 */
const chromeStorageAPI = {
    /**
     * isTableExist
     * 判断目标表是否存在
     * @param {string} table 
     * @returns {boolean} 
     */
    isTableExist(table, callback) {
        if (!table) { return false; }
        chrome.storage.sync.get(table, result => {

        });
    },
    /**
     * isValueExist
     * 判断当前表内包含某个 value 的字段项目是否存在
     * @param {string} table 
     * @param {string} value 
     * @returns {boolean} 
     */
    isValueExist(table, value) {

    },
    /**
     * add
     * 向目标表内增加数据
     * @param {string} table 
     * @param {object} data 
     */
    add(table, data, callback) {
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
                callback(storageData[table]);
            });
        });
    },
    /**
     * remove
     * 删除目标表内包含某个value的字段项目
     * @param {string} table 
     * @param {string} value 
     */
    remove(table, value) {

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
            const backgroundData = {
                // 背景图素材name
                name: inventorySidebar.find('.hover_item_name').text(),
                // 当前背景图素材原始尺寸URL
                backgroundUrl: new ImgUrl($(this).attr('data-url')).getFullSize(),
                // 当前背景图素材Steam市场URL
                marketUrl: marketSection.prev().prev().find('a').attr('href'),
                // 当前背景图素材Steam市场售价 string
                marketPrice: _this.priceExtract(marketSection.prev().html())
            };

            // 写入 chrome.storage
            chromeStorageAPI.add('background_data', backgroundData, (data) => {
                if (typeof data !== 'undefined' && data.length > 0) {
                    // 设置 badge 图标当前存储数量
                    const message = {
                        action: 'BADGE_UPDATE',
                        data: data.length.toString()
                    }
                    // 发送消息给 background.js
                    chrome.runtime.sendMessage(message, response => { });
                }
            });
        });
    },
    /**
     * priceExtract
     * 从价格 HTML 中解析出价格
     * @param {string} str 
     * @example 開始価格： ¥ 0.23 <br> xadasd
     * @example Starting at: ¥ 0.24 <br> Volume
     */
    priceExtract(str) {
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
            if (request.action === 'SET_BACKGROUND' && request.data) {
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
            const backgroundData = {
                // 背景图素材name
                name: curlistItem.find('.market_listing_item_name').text(),
                // 当前背景图素材原始尺寸URL
                backgroundUrl: new ImgUrl(backgroundUrlEle.attr('src')).getFullSize(),
                // 当前背景图素材Steam市场URL
                marketUrl: curlistItem.parents('.market_listing_row_link').attr('href'),
                // 当前背景图素材Steam市场售价 string
                marketPrice: curlistItem.find('.normal_price').eq(1).text()
            };

            // 写入 chrome.storage
            chromeStorageAPI.add('background_data', backgroundData, (data) => {
                if (typeof data !== 'undefined' && data.length > 0) {
                    // 设置 badge 图标当前存储数量
                    const message = {
                        action: 'BADGE_UPDATE',
                        data: data.length.toString()
                    }
                    // 发送消息给 background.js
                    chrome.runtime.sendMessage(message, response => { });
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