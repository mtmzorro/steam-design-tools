/* global $ chrome */
import APP_CONFIG from '../config/config';
import ChromeStorage from '../utils/chromeAPI';
import {
    SteamImgUrl,
    SteamNotificationSuccess,
    SteamNotificationError,
} from '../utils/steam';

/**
 * ChromeBridge
 * Chrome 扩展 相关数据、消息方法封装
 */
class ChromeBridge {
    /**
     * storageInsert 
     * @param {string} itemName 
     * @param {object} insertData 
     * @param {string} key Used to determine whether insertData is exists
     */
    static storageInsert (itemName, insertData, key) {
        console.log('Steam Design Tools: will add storage', insertData);
        ChromeStorage.insertInto(itemName, insertData, key).then((data) => {
            if (!data.success) {
                console.log('Steam Design Tools: storage insert error', data.result);
                new SteamNotificationError('操作失败，请刷新页面再次尝试。');
                return;
            }
            if (data.isExist) {
                new SteamNotificationError(insertData.name + ' 已存在');
            } else {
                // Set Badge
                this.sendBadgeMsg(data.result.length);
                // Notifications result
                new SteamNotificationSuccess(insertData.name + ' 成功添加');
            }
        })
    }
    /**
     * sendBadgeMsg
     * Send message to background.js to update Badge on Chrome
     * 向 background.js 发送 Chrome 右上角扩展 ICON 数量更新消息
     * @param {number} num Badge 显示数量
     */
    static sendBadgeMsg (num) {
        // 设置 badge 图标当前存储数量
        const message = {
            action: APP_CONFIG.actionType.BADGE_UPDATE,
            data: num.toString()
        }
        // 发送消息给 background.js
        chrome.runtime.sendMessage(message, response => {});
    }
}

/**
 * inventoryTools
 * Steam 个人库存增强
 */
const inventoryTools = {
    init() {
        // Init inventorySidebar
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
            const buttonLink = buttonArea.find('a').first();
            // 判断是否为 背景图项目
            // /public\/images\/items/ 排除优惠券项目
            if (
                buttonLink.length > 0 &&
                /public\/images\/items/.test(buttonLink.attr('href'))
            ) {
                // 定义暂存背景图项目按钮
                const buttonHtml = `<a class="btn_small btn_grey_white_innerfade btn_std" href="javascript:;">
                                        <span>Steam Design Tools 预览</span>
                                    </a>`;
                const button = $(buttonHtml);
                button.attr('data-url', $(this).attr('src'));
        
                // reset 跳转button状态
                inventorySidebar.find('.btn_std').remove();
                button.appendTo(buttonArea);
            }
        });
        // 暂存预览功能触发
        $('.btn_std').live('click', function () {
            // 侧边栏容器
            const inventorySidebar = $(this).parents('.inventory_iteminfo');
            const marketSection = inventorySidebar.find('.market_item_action_buyback_at_price');

            const itemName = inventorySidebar.find('.hover_item_name').text();

            // 背景图素材所有数据
            let backgroundData = APP_CONFIG.getDataStructure();
            backgroundData = { ...backgroundData, ...{
                name: itemName,
                backgroundUrl: new SteamImgUrl($(this).attr('data-url')).getFullSize(),
                // summerSale background without href
                marketUrl: marketSection.length 
                        ? marketSection.prev().prev().find('a').attr('href')
                        : 'https://store.steampowered.com/points/shop/c/backgrounds?background_name=' + itemName,
                marketPrice: _this.priceExtract(marketSection.prev().html()),
            }}

            // 写入 chrome.storage
            ChromeBridge.storageInsert(APP_CONFIG.itemName, backgroundData, 'marketUrl');
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
        if (!str || /login\/throbber.gif/.test(str)) return '??.00';

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
    init() {
        // Init showcase preview
        this.setShowcasePreview();
        // Set message listener wait message from chrome extension 
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('Steam Design Tools: receive message ↓', sender, request);
            sendResponse('Steam Design Tools: received');
            // Set profile background
            if (request.action === APP_CONFIG.actionType.SET_BACKGROUND && request.data) {
                this.setProfileBackground(request.data);
            }
        });
    },
    /**
     * setProfileBackground
     * Set background img 设置个人资料背景
     * @param {string} backgroundUrl 
     */
    setProfileBackground(backgroundUrl) {
        // 资料页容器
        const profilePage = $('.profile_page').eq(1);
        // hide animate background img
        if($('.profile_animated_background').length) {
            $('.profile_animated_background').hide();
        }
        // set background img 
        profilePage.css('background-image', 'url(' + backgroundUrl + ')')
            .find('.profile_background_image_content').css('background-image', 'url(' + backgroundUrl + ')');
        
    },

    /**
     * setShowcasePreview
     * Steam showcase img preview 展柜图片预览
     */
    setShowcasePreview() {
        const showcaseButton = $(`<a class="sdt-showcase-change" href="javascript:;">
                                    <span class="profile_customization_edit_icon"></span>
                                    <input class="sdt-img-cache" title="New image" type="file" accept="image/*"/>
                                </a>`);

        // Append showcaseButton
        $('.screenshot_showcase .showcase_slot').append(showcaseButton);

        // Showcase slot mouseenter event
        $('.screenshot_showcase .showcase_slot').live('mouseenter', function () {
            const thisButton = $(this).find('.sdt-showcase-change');
            const showcaseImg = $(this).find('.screenshot_showcase_screenshot').find('img');
            const showcaseImgSize = showcaseImg.width() + 'px * ' + showcaseImg.height() + 'px';
            // Add current showcase size
            $(this).find('.sdt-img-cache').attr('title', '当前尺寸：' + showcaseImgSize + ' 点击预览新图片');
            thisButton.show();
        }).live('mouseleave', function () {
            const thisButton = $(this).find('.sdt-showcase-change');
            thisButton.hide();
        });

        // Upload and change showcase img 上传预览图片
        $('.sdt-img-cache').live('change', function (event) {
            const showcaseImg = $(this).parents('.showcase_slot').find('.screenshot_showcase_screenshot').find('img');
            const file = $(this)[0].files[0];
            // Use FileReader get Base64 url
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                showcaseImg.attr('src', e.target.result);
            }
        });
    }
};

/**
 * marketTools
 * Steam 市场预览增强
 */
const marketTools = {
    init() {
        this.setAddButton();
    },
    /**
     * setAddButton
     * 增加 background 暂存 button
     */
    setAddButton() {
        if ($('.market_listing_row').length === 0) {
            return;
        }
        // Steam 物品项
        const listItem = $('.market_listing_row')
        // addButton 相关
        const addButton = $('<span class="sdt-add-button" title="使用 Steam Design tools 预览">+</span>');

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
            let backgroundData = APP_CONFIG.getDataStructure();
            backgroundData = { ...backgroundData, ...{
                name: curlistItem.find('.market_listing_item_name').text(),
                backgroundUrl: new SteamImgUrl(backgroundUrlEle.attr('src')).getFullSize(),
                marketUrl: curlistItem.parents('.market_listing_row_link').attr('href'),
                marketPrice: curlistItem.find('.normal_price').eq(1).text(),
            }}

            // 写入 chrome.storage
            ChromeBridge.storageInsert(APP_CONFIG.itemName, backgroundData, 'marketUrl');
        });
    }
};

/**
 * summerSale
 * Steam 夏促增强
 */
const summerSale = {
    init() {
        this.setAddButton();
        console.log('Steam Design Tools: SummerSale worked');
    },
    /**
     * setAddButton
     * 增加 background 暂存 button
     */
    setAddButton() {
        // Steam 物品项
        const listItemClass = '.rewarditem_ItemContainer_skI5t';
        const backgroundUrlClass = 'img.rewarditem_ImageBackground_U-rBC';

        // addButton 
        const addButton = $('<span class="sdt-add-button summersale" title="使用 Steam Design tools 预览">+</span>');
        // add addButton
        $(listItemClass).live('mouseenter', function () {
            // video not support for now
            if (!$(this).find(backgroundUrlClass).length) return;
            // 当前 Steam 物品项
            $(this).append(addButton);
        }).live('mouseleave', function () {
            // video not support for now
            if (!$(this).find(backgroundUrlClass).length) return;
            $(this).find('.sdt-add-button').remove();
        });

        // addButton 暂存预览功能触发
        $('.sdt-add-button').live('click', function (event) {
            event.preventDefault();

            // 当前 Steam 物品项
            const curlistItem = $(this).parents(listItemClass);
            const backgroundUrlEle = curlistItem.find(backgroundUrlClass);

            // 处理 Steam 可能出现的不存背景图的背景图商品异常
            if (backgroundUrlEle.length === 0) return;
            const itemName = curlistItem.find('.rewarditem_Name_EccZY').text();

            let backgroundData = APP_CONFIG.getDataStructure();
            backgroundData = { ...backgroundData, ...{
                name: itemName,
                backgroundUrl: new SteamImgUrl(backgroundUrlEle.attr('src')).getFullSize(),
                marketUrl: 'https://store.steampowered.com/points/shop/c/backgrounds?background_name=' + itemName,
                marketPrice: curlistItem.find('.loyaltypoints_Amount_BqFe2').text() + '点数',
            }}

            // 写入 chrome.storage
            ChromeBridge.storageInsert(APP_CONFIG.itemName, backgroundData, 'marketUrl');
        });
    }
};

/**
 * DOM READY 注册事件
 */
$(document).ready(function () {
    const href = window.location.href;

    /**
     * isProfile 个人资料页
     * @example https://steamcommunity.com/id/userid
     * @example https://steamcommunity.com/profiles/123123123123
     */
    const isProfile = (/\/id\//.test(href) || /\/profiles\//.test(href)) 
        && !/\/inventory/.test(href)
        && !/\/edit/.test(href);
    /**
     * isInventory 个人库存
     * @example https://steamcommunity.com/id/userid/inventory/
     * @example https://steamcommunity.com/id/userid/inventory
     */
    const isInventory = /\/inventory/.test(href);
    /**
     * isMarket Steam 市场
     * @example https://steamcommunity.com/market/
     * @example https://steamcommunity.com/market
     */
    const isMarket = /\/market/.test(href);
    /**
     * isSummerSale 夏促点数商城
     * @example https://store.steampowered.com/points/shop
     * @example https://store.steampowered.com/points?snr=1_4_600__118&snr=1_4_600__118
     */
    const isSummerSale = /\/points/.test(href);
    
    isInventory && inventoryTools.init();
    isProfile && profileTools.init();
    isMarket && marketTools.init();
    isSummerSale && summerSale.init();
});