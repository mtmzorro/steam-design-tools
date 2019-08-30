/**
 * APP_CONFIG
 * Chrome extention & React app config
 * Chrome 扩展以及 React 项目中存储、消息等配置
 */
const APP_CONFIG = {
    // Chrome local storage table name
    TABLE_NAME: 'background_data',
    // Data structure
    // @returns {object} 
    getTableStructure() {
        return {
            // background item name
            name: '',
            // background full-size url
            backgroundUrl: '',
            // background item steam market url
            marketUrl: '',
            // background item steam market price
            marketPrice: '',
            // is like
            isLike: false
        }
    },
    // Chrome extention communication message action type
    // 与 background.js&弹出主页 通信相关 action type
    actionType: {
        // send to background.js: Update Badge count.  
        // Chrome 右上角扩展 ICON 数量更新
        BADGE_UPDATE: 'BADGE_UPDATE',
        // send from content-script/index.js: Change Steam profile page's background image
        // 将用户所选择背景图应用至当前 Steam 个人资料页
        SET_BACKGROUND: 'SET_BACKGROUND'
    }
};

// 需要同时兼容在 Chrome 插件中已全局变量方式存在
if (typeof module !== 'undefined') {
    module.exports = APP_CONFIG;
}