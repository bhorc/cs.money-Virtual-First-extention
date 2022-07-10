let ticks_max = 5;
// const socket = io('ws://csmoneypopularapi.herokuapp.com');
const timer = setInterval(async () => {
    console.log('Tick');
    const resp = await fetch('https://csmoneypopularapi.herokuapp.com/popular-skins').then(res => res.json());
    if (resp.length) localStorage.setItem('popularSkins', JSON.stringify(resp));
    if (resp.length || !ticks_max) clearInterval(timer);
    console.log('Tack');
    ticks_max--;
}, 500);

chrome.runtime.onMessage.addListener(({ target, options }, sender, sendResponse) => {
    const { name_id, domain } = options;
    switch (target) {
        case 'getPopularSkins':
            sendResponse(JSON.parse(localStorage.getItem('popularSkins')));
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