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
 * inventoryTools
 * Steam个人库存增强
 */
var inventoryTools = {
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
            let inventorySidebar = $(this).parents('.inventory_iteminfo');
            let buttonArea = inventorySidebar.find('.item_actions');
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
            let inventorySidebar = $(this).parents('.inventory_iteminfo');
            let marketSection = inventorySidebar.find('.market_item_action_buyback_at_price');

            // 当前背景图素材原始尺寸URL
            let backgroundUrl = new ImgUrl($(this).attr('data-url')).getFullSize();
            // 当前背景图素材Steam市场URL
            let marketUrl = marketSection.prev().prev().find('a').attr('href');
            // 当前背景图素材Steam市场售价 string
            let marketPrice = _this.priceExtract(marketSection.prev().html());

            let message = {
                backgroundUrl: backgroundUrl,
                marketUrl: marketUrl,
                marketPrice: marketPrice
            }

            // // 往存储中写入数据
            // chrome.storage.sync.set({ 'item_background': message }, function () {
            //     console.log('保存成功');
            // });

            // chrome.storage.sync.get('item_background', function (result) {
            //     console.log('Value currently is ' + result.item_background);
            // });

            chrome.runtime.sendMessage(message, function (response) {
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
        let strResult = str.split('<br>')[0];
        let divSymbol = /：/.test(str) ? '：' : ':';
        return strResult.split(divSymbol)[1].trim();
    }
};

/**
 * DOM READY 注册事件
 */
$(document).ready(function () {
    inventoryTools.init();
});