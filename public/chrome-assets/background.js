/**
 * chrome.runtime.onMessage.addListener
 * 消息监听器
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse('success');
    // BADGE_UPDATE 更新Badge
    if (request.action === 'BADGE_UPDATE') {
        clearTimeout();
        chrome.browserAction.setBadgeText({ text: request.data });
        chrome.browserAction.setBadgeBackgroundColor({ color: '#666666' });
        setTimeout(() => {
            chrome.browserAction.setBadgeText({ text: '' });
        }, 2000);
    }
});