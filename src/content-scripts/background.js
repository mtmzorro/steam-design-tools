/**
 * chrome.runtime.onMessage.addListener
 * Background Message Listener
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse('success');
    // BADGE_UPDATE Update Badge
    if (request.action === 'BADGE_UPDATE') {
        clearTimeout();
        chrome.browserAction.setBadgeText({ text: request.data });
        chrome.browserAction.setBadgeBackgroundColor({ color: '#666666' });
        setTimeout(() => {
            chrome.browserAction.setBadgeText({ text: '' });
        }, 2000);
    }
});