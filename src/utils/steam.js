/* global $ */
/**
 * SteamImgUrl
 * Steam CDN Img resize
 * @param {string} url
 * @example https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxH5rd9eDAjcFyv45SRYAFMIcKL_PArgVSL403ulRUWEndVKv0jp6KCw07IVMPs7n9LwU0h6HNcjlBtYvlkteKk_SgNbmIxT8J7JUp2OiYrd-gixq-uxR6VrmHMw/330x192
 * @example https://steamcommunity.com/economy/profilebackground/items/292030/7dd0b68fe2bca80ecdc62f4a7262353df6ed2c2c.jpg?size=320x200
 */
export class SteamImgUrl {
    constructor(url) {
        this.isShopUrl = false;
        
        if(!url) {
            // empty url return background_preview
            this.url = 'https://store.st.dl.pinyuncloud.com/public/images/applications/store/background_preview.png';
            this.defaultUrl = this.url;
        } else {
            this.url = url;
            this.defaultUrl = '';
            // shop img used in summerSale
            this.isShopUrl = /\/economy\/profilebackground/.test(url);
            this.resetUrl();
        }
    }
    resetUrl() {
        if (this.isShopUrl) {
            // summerSale img
            this.defaultUrl = this.url.split('?')[0];
        } else {
            // steam market img
            let urlArray = this.url.split('/');
            urlArray.pop();
            this.defaultUrl = urlArray.join('/') + '/';
        }
    }
    getFullSize() {
        return this.defaultUrl;
    }
    get96size() {
        return this.isShopUrl ?  this.defaultUrl + '?size=96x96' : this.defaultUrl + '96fx96f';
    }
    get62size() {
        return this.isShopUrl ?  this.defaultUrl + '?size=62x62' : this.defaultUrl + '96fx96f';
    }
}

/**
 * SteamNotifications
 * InventoryTools and marketTools notifications
 * 个人库存和市场相关提示信息
 * @param {string} content notification content
 */
class SteamNotifications {
    constructor(content) {
        this.content = content;
        this.className = '.sdt-notifications';

        this.renderHTML();
        this.showNotifications();
        this.autoHideNotifications();
    }
    /**
     * renderHTML
     */
    renderHTML() {
        // Render once
        if ($(this.className).length === 0) {
            const html = $(`<div class="sdt-notifications" data-timer="0">
                                <h4>Steam Design Tools</h4>
                                <div class="sn-content"></div>
                            </div>`);
            $(html).appendTo('body');
        }
        $(this.className).find('.sn-content').text(this.content);
    }
    showNotifications() {
        $(this.className).fadeIn(200);
    }
    hideNotifications() {
        $(this.className).fadeOut(200);
    }
    autoHideNotifications() {
        clearTimeout(parseInt($(this.className).attr('data-timer'), 10));
        let timer = setTimeout(() => {
            this.hideNotifications();
        }, 3000);
        $(this.className).attr('data-timer', timer);
    }
}

// Success
export class SteamNotificationSuccess extends SteamNotifications {
    constructor(content) {
        content = '\u2714\uFE0F ' + content;
        super(content);
    }
}

// Error
export class SteamNotificationError extends SteamNotifications {
    constructor(content) {
        content = '\u274C ' + content;
        super(content);
    }
}
