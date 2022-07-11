let ticks_max = 5;
// const socket = io('ws://csmoneypopularapi.herokuapp.com');

(async () => {
    let popularSkins = await fetch('https://csmoneypopularapi.herokuapp.com/popular-skins').then(res => res.json());
    let hiddenSkins = await fetch('https://csmoneypopularapi.herokuapp.com/hiddenSkins').then(res => res.json());
    let limitedSkinsData = await fetch('https://csmoneypopularapi.herokuapp.com/limitedSkinsData').then(res => res.json());
    let skinsBaseList = await fetch('https://csmoneypopularapi.herokuapp.com/loadSkinsBaseList').then(res => res.json());
    if (popularSkins) localStorage.setItem('popularSkins', JSON.stringify(popularSkins));
    if (hiddenSkins) localStorage.setItem('hiddenSkins', JSON.stringify(hiddenSkins));
    if (limitedSkinsData) localStorage.setItem('limitedSkinsData', JSON.stringify(limitedSkinsData));
    if (skinsBaseList) localStorage.setItem('loadSkinsBaseList', JSON.stringify(skinsBaseList));
})();

chrome.runtime.onMessage.addListener(({ target, options }, sender, sendResponse) => {
    const { name_id, domain } = options;
    switch (target) {
        case 'getPopularSkins':
            sendResponse(JSON.parse(localStorage.getItem('popularSkins')));
            break;
        case 'getHiddenSkins':
            sendResponse(JSON.parse(localStorage.getItem('hiddenSkins')));
            break;
        case 'getLimitedSkins':
            sendResponse(JSON.parse(localStorage.getItem('limitedSkinsData')));
            break;
        case 'getSkinsBaseList':
            sendResponse(JSON.parse(localStorage.getItem('loadSkinsBaseList')));
            break;
        // case 'sales':
        //     socket.emit(target, { name_id });
        //     socket.on("answer", (arg) => {
        //         sendResponse(arg);
        //     });
        //     break;
        case 'getCookies':
            chrome.cookies.getAll({ domain }, (cookies) => {
                const domain_cookies = cookies.reduce((acc, cookie) => acc + cookie.name + '=' + cookie.value + '; ', '');
                sendResponse(domain_cookies);
            });
            break;
        default:
            sendResponse({ success: false });
            break;
    }
    return true;
});