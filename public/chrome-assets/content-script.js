/* global $ */
/**
 * ImgUrl
 * Steam CDN图片地址处理
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
 * chrome.storage存储相关API拓展
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
     * 判断当前表内包含某个value的字段项目是否存在
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
            let cache = [];
            if (typeof result[table] !== 'undefined') {
                cache = result[table].slice();
            }
            cache.push(data);
            let storageData = {};
            storageData[table] = cache;
            // 把修改完缓存数据写入存储
            chrome.storage.local.set(storageData, () => {
                callback();
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
 * Steam个人库存增强
 */
const inventoryTools = {
    init() {
        this.inventorySidebar();
    },
    contentTpl: `<a class="btn_small btn_grey_white_innerfade btn_std" href="javascript:;">
                    <span>使用SDT预览</span>
                </a>`,
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
            let button = $(_this.contentTpl);
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

            // 写入chrome扩展存储
            chromeStorageAPI.add('background_data', backgroundData, () => {
                console.log('成功插入')
            });

            // // 往存储中写入数据
            // chrome.storage.sync.set({ 'item_background': message }, function () {
            //     console.log('保存成功');
            // });

            // chrome.storage.sync.get('item_background', function (result) {
            //     console.log('Value currently is ' + result.item_background);
            // });

            chrome.runtime.sendMessage('ADD_UPDATE', function (response) {
                console.log('收到来自后台的回复：' + response);
            });
        });
    },
    /**
     * priceExtract
     * 从价格HTML中解析出价格
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
 * DOM READY 注册事件
 */
$(document).ready(function () {
    inventoryTools.init();
});