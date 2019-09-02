/**
 * chrome.runtime.onMessage.addListener
 * Background Message Listener
 */
let backgroundTimer = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse('success');
    // BADGE_UPDATE Update Badge
    if (request.action === 'BADGE_UPDATE') {
        clearTimeout(backgroundTimer);
        chrome.browserAction.setBadgeText({ text: request.data });
        chrome.browserAction.setBadgeBackgroundColor({ color: '#666666' });
        backgroundTimer = setTimeout(() => {
            chrome.browserAction.setBadgeText({ text: '' });
        }, 3000);
    }
});