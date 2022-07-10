localStorage.csMoneyHelperExtensionID = chrome.runtime.id;

function addJS_Node(textContent, src, funcToRun, runOnLoad) {
	let scriptNode = document.createElement('script');
	scriptNode.type = "text/javascript";
	if (runOnLoad) scriptNode.addEventListener("load", runOnLoad, false);
	if (textContent) scriptNode.textContent = textContent;
	if (src) scriptNode.src = src;
	if (funcToRun) scriptNode.textContent += '(' + funcToRun.toString() + ')()';

	let target = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
	target.insertAdjacentElement('afterBegin', scriptNode);
}

window.addEventListener('message', function(e) {
	if (e.data.csMoneyHelperExtensionID === localStorage.csMoneyHelperExtensionID) {
		chrome.runtime.sendMessage(chrome.runtime.id, e.data, function(body) {
			window.postMessage({
				target: e.data.target + '_answer',
				body
			}, '*');
		});
	}
});

(() => {
	async function init() {
        if (window.location.host === 'old.cs.money') return;
        const offerInventoryEvent = new Event('offerInventoryChange');
        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        function isIterable(value) {
            return Symbol.iterator in Object(value);
        }
        function getTimeRemaining(endTime) {
            let t = Date.parse(endTime) - new Date().getTime();
            let seconds = Math.floor((t / 1000) % 60);
            let minutes = Math.floor((t / 1000 / 60) % 60);
            let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            return {
                'total': t,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }
        function initializeClock(selector, callback) {
            let clock = document.querySelector(selector);
            let hoursSpan = clock.querySelector('.hours');
            let minutesSpan = clock.querySelector('.minutes');
            let secondsSpan = clock.querySelector('.seconds');
            let endTime = new Date(+clock.dataset.deadline);
            function updateClock() {
                let t = getTimeRemaining(endTime);
                if (t.total <= 0 || !hoursSpan || !minutesSpan || !secondsSpan) {
                    clearInterval(timeInterval);
                    callback();
                } else {
                    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
                    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
                    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
                }
            }
            updateClock();
            let timeInterval = setInterval(updateClock, 1000);
        }
        class offerInventory {
            constructor() {
                this.inventory = {};
            }
            add(item){
                this.inventory[item.id] = item;
            }
            set(items){
                this.inventory = items;
            }
            get(){
                return this.inventory;
            }
            getCount() {
                return Object.keys(this.inventory).length;
            }
            remove(id){
                delete this.inventory[id];
            }
            clear(){
                this.inventory = {};
            }
            highlight(type, options){
                switch (type) {
                    case 'disabledSkins':
                        for (let id of options[type]) {
                            this.inventory[id][type] = true;
                            if (document.querySelector('[data-id="' + id + '"]')) {
                                document.querySelector('[data-id="' + id + '"]').classList.add(type);
                            }
                        }
                        break;
                    case 'popularSkins':
                        for (let index in this.inventory) {
                            if (options[type].includes(this.inventory[index].fullName)) {
                                this.inventory[index][type] = true;
                                if (document.querySelector('[data-id="' + id + '"]')) {
                                    document.querySelector('[data-id="' + id + '"]').classList.add(type);
                                }
                            }
                        }
                    default:
                        break;
                }
            }
            assignmentItems(html_items) {
                for (let [index, html_item] of Object.entries(html_items)) {
                    const ids = Object.keys(this.inventory);
                    html_item.dataset.id = ids[index];
                }
            }
        }
        class customInventory {
            constructor() {
                this.inventory = [];
                this.history = {};
                this.loaded = false;
            }
            add(items){
                this.inventory = [...new Set([...this.inventory, ...items])];
            }
            set(data){
                this.loaded = true;
                this.inventory = data;
            }
            get(){
                return this.inventory;
            }
            load(url) {
                if (!this.history[url]) {
                    this.history[url] = {
                        count: 0,
                        spam: false,
                        checkSpamAfterCount: 5,
                        spamClearDelay: 20000,
                        spamRepeatDelay: 2000,
                        time: new Date().getTime(),
                        lastTime: null,
                        timeStamps: [],
                        getAverageTimeStamp: () => {
                            const count = this.history[url].timeStamps.length;
                            const sum = this.history[url].timeStamps.reduce((a, b) => a + b, 0);
                            return sum / count
                        }
                    }
                }
                if (this.history[url].count >= this.history[url].checkSpamAfterCount && this.history[url].getAverageTimeStamp() <= this.history[url].spamRepeatDelay) {
                    console.warn('SPAM SPAM SPAM!!');
                    this.history[url].spam = true;
                    const timer = setTimeout(() => {
                        this.history[url].count = 0;
                        this.history[url].spam = false;
                        this.history[url].timeStamps = [];
                        clearInterval(timer);
                    }, this.history[url].spamClearDelay);
                }
                if (!this.spam) {
                    let xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xhr.getResponseHeader("Set-Cookie", this.cookies);
                    xhr.withCredentials = true;
                    xhr.send(null);
                    this.history[url].count += 1;
                    this.history[url].lastTime = this.history[url].time;
                    this.history[url].time = new Date().getTime();
                    this.history[url].timeStamps.push(Math.abs(this.history[url].time - this.history[url].lastTime));
                }
                return true;
            }
            update(data) {
                if (!this.inventory) {
                    this.set(data);
                } else{
                    this.add(data);
                }
            }
            highlight(type, options){
                for (let item of this.inventory) {
                    try {
                        if (options[type].includes(item.fullName)) {
                            item[type] = true;
                            if (item.element) {
                                item.element.classList.add(type);
                            }
                        }
                    } catch (error) {
                        console.log(type, options);
                    }
                }
            }
            assignmentItems(html_items) {
                try {
                    for (let [index, html_item] of Object.entries(html_items)) {
                        this.inventory[index].element = html_item;
                    }
                } catch (error) {
                    console.log(html_items);
                }

            }
        }
        class pendingInventory extends customInventory {
            constructor() {
                super();
                this.inventory = [];
                this.delay = 10 * 60 * 1000;
            }
            getInventoryName() {
                return this.constructor.name;
            }
            add({items, status = {}, offer_id = null, expiry = new Date().getTime() + this.delay }) {
                const newData = [{ items, status, offer_id, expiry }];
                this.inventory = [...new Set([...this.inventory, ...newData])];
                localStorage.setItem(this.getInventoryName(), JSON.stringify(this.inventory));
            }
            get(){
                const pendingInventory = localStorage.getItem(this.getInventoryName());
                if (pendingInventory && isJson(pendingInventory)) {
                    const parsedValue = JSON.parse(pendingInventory);
                    if (isIterable(parsedValue)) {
                        for (let value of parsedValue) {
                            if (value.expiry < new Date().getTime()) {
                                parsedValue.splice(parsedValue.indexOf(value), 1);
                            }
                        }
                        this.inventory = parsedValue;
                        localStorage.setItem(this.getInventoryName(), JSON.stringify(this.inventory));
                    }
                }
                return this.inventory;
            }
            remove(id){
                const pendingInventory = localStorage.getItem(this.getInventoryName());
                if (pendingInventory && isJson(pendingInventory)) {
                    const parsedValue = JSON.parse(pendingInventory);
                    if (isIterable(parsedValue)) {
                        for (let value of parsedValue) {
                            if (value.offer_id == id) {
                                parsedValue.splice(parsedValue.indexOf(value), 1);
                            }
                        }
                        this.inventory = parsedValue;
                        localStorage.setItem(this.getInventoryName(), JSON.stringify(this.inventory));
                    }
                }
                this.get();
            }
        }
        class Extension {
            constructor() {
                this.botOfferInventory = new offerInventory();
                this.userOfferInventory = new offerInventory();
                this.botInventory = new customInventory();
                this.userInventory = new customInventory();
                this.botLotsInventory = new customInventory();
                this.userLotsInventory = new customInventory();
                this.pendingOffersInventory = new pendingInventory();
                this.requestMap = new Map();
                this.userInfo = {};
                this.pendingTransactions = [];
                this.popularSkins = [];
                this.isModalVisible = false;
                this.isOfferInventoryOpen = false;
                this.lastStatus = null;
                this.cookies = null;
                this.currentPage = {
                    currentUrl: window.location.origin + window.location.pathname,
                    previousUrl: null
                }
            }
            async init(){
                console.log('New cs.money extension Inited!');
                const { props: { initialReduxState: { g_userInfo } } } = await this.loadNextData();
                this.pendingOffersInventory.get();
                this.cookies = await this.backgroundRequest('getCookies', { domain: "old.cs.money" });
                this.popularSkins = await this.backgroundRequest('getPopularSkins');
                this.setCurrentPage();
                this.setUserInfo(g_userInfo);
            }
            async loadNextData(){
                let nextData = window.__NEXT_DATA__;
                if (!nextData) {
                    let ticks_max = 30;
                    nextData = await new Promise((resolve, reject) => {
                        const timer = setInterval(() => {
                            if (window.__NEXT_DATA__) {
                                clearInterval(timer);
                                resolve(window.__NEXT_DATA__);
                            } else if (ticks_max-- <= 0) {
                                clearInterval(timer);
                                reject('Timeout');
                            }
                        }, 50);
                    });
                }
                return nextData;
            }
            async setCurrentPage(){
                if (this.currentPage.currentUrl !== window.location.origin + window.location.pathname) {
                    this.currentPage.previousUrl = this.currentPage.currentUrl;
                    this.botInventory.loaded = false;
                    this.userInventory.loaded = false;
                    this.botLotsInventory.loaded = false;
                    this.userLotsInventory.loaded = false;
                }
                this.currentPage.currentUrl = window.location.origin + window.location.pathname;
                this.initPage();
            }
            async initPage(){
                switch (this.currentPage.currentUrl) {
                    case "https://cs.money/csgo/trade/":
                        this.buildButtons();
                        await this.checkOfferInventoryOpen();
                        this.updateOfferInventory();
                        this.buildBetterAuctionTimers(false);

                        if (!this.botInventory.get().length || !this.userInventory.get().length) {
                            const { query, props: { initialReduxState: { g_userInfo } } } = await this.loadNextData();
                            const onLoadOptions = Object.assign(structuredClone(query), {
                                limit: 60,
                                offset: 0,
                                priceWithBonus: g_userInfo.buyBonus,
                                withStack: true,
                            });
                            if (query.search) { onLoadOptions.name = query.search }
                            if (!query.sort) { onLoadOptions.sort = 'botFirst' }
                            delete onLoadOptions.search;
                            delete onLoadOptions.game;
                            if (!this.botInventory.get().length && !this.botInventory.loaded) {
                                this.botInventory.loaded = this.botInventory.load('https://inventories.cs.money/5.0/load_bots_inventory/730?' + new URLSearchParams(onLoadOptions).toString());
                            }
                            if (!this.userInventory.get().length && !this.userInventory.loaded) {
                                this.userInventory.loaded = this.userInventory.load('https://cs.money/3.0/load_user_inventory/730?isPrime=false&limit=60&noCache=true&offset=0&order=desc&sort=price&withStack=true');
                            }
                        }
                        break;
                    case "https://cs.money/csgo/auction/":
                        this.buildBetterAuctionTimers(true);
                        const auctionOptions = {
                            appId: 730,
                            limit: 200,
                            offset: 0,
                            order: "desc",
                            sort: "betsAmount",
                            status: "running",
                        }
                        if (!this.botLotsInventory.get().length && !this.botLotsInventory.loaded) {
                            this.botLotsInventory.loaded = this.botLotsInventory.load('https://cs.money/1.0/auction/lots?' + new URLSearchParams(auctionOptions).toString());
                        }
                        if (!this.userLotsInventory.get().length && !this.userLotsInventory.loaded) {
                            this.userLotsInventory.loaded = this.userLotsInventory.load('https://cs.money/1.0/auction/my-lots?' + new URLSearchParams(auctionOptions).toString());
                        }
                        break;
                    default:
                        this.buildBetterAuctionTimers(false);
                        break;
                }
            }
            buildBetterAuctionTimers(state){
                const EventAuctionTimers = () => {
                    let lots = document.querySelectorAll('[class^="AuctionListing_lot_"]:not(.active_rate), [class^="AuctionMobile_lot_"]:not(.active_rate)');
                    for (let lot of [...lots]) {
                        let img = lot.querySelector('[class^="CSGOSkinInfo_image"]:not([src$="_large_preview.png"])');
                        if (img?.src.includes('_icon')) {
                            img.src = img.src.replace('_icon', '_large_preview');
                        }
                        if (lot.querySelector('[class*="LotInfoDesktop_bid_"] span, [class*="LotInfoMobile_bid_"] span').innerText > 0) {
                            lot.querySelector('[class^="LotCardDesktop_auction-card"], [class^="LotCardMobile_wrapper_"]').classList.add('active_rate');
                        }
                        let timer = lot.querySelector('[class^="Timer_time_wrapper"]:not([class^="Timer_state"])');
                        let time_str = timer.innerText;
                        if (time_str === 'Time is over') {
                            timer.dataset.state = 'purple';
                        } else {
                            let [hours, minutes, seconds] = time_str.split(':');
                            minutes = Number(hours) * 60 + Number(minutes);
                            switch (minutes) {
                                case 0:
                                case 1:
                                    timer.dataset.state = 'red';
                                    break;
                                case 2:
                                case 3:
                                    timer.dataset.state = 'orange';
                                    break;
                                default:
                                    timer.dataset.state = 'green';
                                    break;
                            }
                        }
                    }
                }
                if (state) {
                    setInterval(EventAuctionTimers, 500);
                } else {
                    clearInterval(EventAuctionTimers);
                }
            }
            buildButtons(){
                if (!document.querySelector('#show-virtual-first-modal')) {
                    document.querySelector('[class^="TradePage_center"]').insertAdjacentHTML('afterbegin', `
                        <button class="TradePage_trade_button__3AwF8 styles_button__303YR styles_main__PiMGk TradeButton_button__1Dt47 styles_disabled__FKMBn TradeButton_disabled__2nLaR" disabled="" type="button" id="trade-virtual-first">
                            <span>Virtual First</span>
                        </button>
                        <button id="show-virtual-first-modal">
                            <span>Show virtual offers</span>
                        </button>
                    `);
                    this.initEvents();
                }
            }
            initClocks(){
                for (let timer of [...document.querySelectorAll('.timer')]) {
                    initializeClock(`[data-deadline='${timer.dataset.deadline}']`, () => {
                        this.pendingOffersInventory.get();
                    });
                }
            }
            showModal(modalType, options) {
                let offers_html = '';
                switch (modalType) {
                    case 'loading':
                        offers_html = `
                        <div class="styles_wrapper__3Mukf">
                            <div class="styles_content__3id0p">
                                <div class="styles_icon__3UorY">
                                    <div class="styles_loader__1PAI3"></div>
                                </div>
                                <div class="styles_title__1vfCM">Start processing</div>
                                <div class="styles_description__3hwVb">Please, wait...</div>
                            </div>
                        </div>`;
                        break;
                    case 'confirm':
                        if (this.pendingOffersInventory.get().length) {
                            document.querySelector(`#offer${options.offer_id} .styles_icon_wrapper__1fs1B`).innerHTML = `
                            <div class="styles_wrapper__1RYBS styles_decline_icon_container__1SYgS styles_unlock__3zpuG">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="styles_icon__3YyMx styles_withdraw__1S_qC">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3271 5.25628C17.6688 5.59799 17.6688 6.15201 17.3271 6.49372L9.16039 14.6604C8.81868 15.0021 8.26466 15.0021 7.92295 14.6604L3.25628 9.99372C2.91457 9.65201 2.91457 9.09799 3.25628 8.75628C3.59799 8.41457 4.15201 8.41457 4.49372 8.75628L8.54167 12.8042L16.0896 5.25628C16.4313 4.91457 16.9853 4.91457 17.3271 5.25628Z" fill="#C0C0C2"/>
                                </svg>
                            </div>`;
                            document.querySelector(`#offer${options.offer_id} .timer`).remove();
                            document.querySelector(`#offer${options.offer_id} .styles_actions__3uEFS`).remove();
                            return;
                        } else {
                            offers_html = `
                            <div class="styles_wrapper__3Mukf">
                                <div class="styles_content__3id0p">
                                    <div class="styles_icon__3UorY">
                                        <img src="/img/success_emoji.png" alt="success emoji">
                                    </div>
                                    <div class="styles_title__1vfCM">Great! Trade was successful confirmed!</div>
                                    <div class="styles_description__3hwVb">You confirmed all offers</div>
                                </div>
                            </div>`;
                        }
                        break;
                    case 'decline':
                        if (this.pendingOffersInventory.get().length) {
                            document.querySelector(`#offer${options.offer_id} .styles_icon_wrapper__1fs1B`).innerHTML = `
                            <div class="styles_wrapper__1RYBS styles_decline_icon_container__1SYgS styles_block__3K0ES">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="styles_icon__3YyMx styles_icon__YYN8A">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.061 12.122l4.055 4.054a.5.5 0 00.707 0l.354-.353a.5.5 0 000-.707l-4.055-4.055-1.06 1.061zM16.177 4.177a.5.5 0 010 .707L4.884 16.177a.5.5 0 01-.707 0l-.354-.354a.5.5 0 010-.707L15.116 3.823a.5.5 0 01.707 0l.354.354z" fill="#C0C0C2"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10 11.06L3.823 4.885a.5.5 0 010-.707l.354-.354a.5.5 0 01.707 0L11.06 10 10 11.06z" fill="#C0C0C2"></path>
                                </svg>
                            </div>`;
                            document.querySelector(`#offer${options.offer_id} .timer`).remove();
                            document.querySelector(`#offer${options.offer_id} .styles_actions__3uEFS`).remove();
                            return;
                        } else {
                            offers_html = `
                            <div class="styles_wrapper__3Mukf">
                                <div class="styles_content__3id0p">
                                    <div class="styles_icon__3UorY">
                                        <img src="/img/success_emoji.png" alt="success emoji">
                                    </div>
                                    <div class="styles_title__1vfCM">Great! Trade was successful declined!</div>
                                    <div class="styles_description__3hwVb">You decline all offers</div>
                                </div>
                            </div>`;
                        }
                        break;
                    case 'error':
                        console.error(options.error)
                        offers_html = `
                        <div class="styles_wrapper__3Mukf">
                            <div class="styles_content__3id0p">
                                <div class="styles_icon__3UorY">
                                    <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/325/dizzy-face_1f635.png" alt="error emoji">
                                </div>
                                <div class="styles_title__1vfCM">Oh no! Trade failed!</div>
                                <div class="styles_description__3hwVb">You didn't confirm all offers</div>
                            </div>
                        </div>`;
                        break;
                    case 'disabledSkins':
                        offers_html += `
                        <div class="modal-offer">
                            <div class="styles_icon_wrapper__1fs1B">
                                <div class="styles_wrapper__1RYBS styles_decline_icon_container__1SYgS styles_block__3K0ES">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="styles_icon__3YyMx styles_icon__YYN8A">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.061 12.122l4.055 4.054a.5.5 0 00.707 0l.354-.353a.5.5 0 000-.707l-4.055-4.055-1.06 1.061zM16.177 4.177a.5.5 0 010 .707L4.884 16.177a.5.5 0 01-.707 0l-.354-.354a.5.5 0 010-.707L15.116 3.823a.5.5 0 01.707 0l.354.354z" fill="#C0C0C2"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10 11.06L3.823 4.885a.5.5 0 010-.707l.354-.354a.5.5 0 01.707 0L11.06 10 10 11.06z" fill="#C0C0C2"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="styles_title__13qTi">
                                <span class="styles_subtitle__3SAy7">Virtual trade</span>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="styles_icon__2K1cb styles_rotate__NPPVg">
                                <path d="M11.65 13.25a.75.75 0 001.12 1l3.539-3.962a.75.75 0 00.01-.987l-3.451-4.038a.75.75 0 00-1.14.975l2.377 2.78H4.75a.75.75 0 100 1.5h9.341l-2.44 2.732z" fill="#C0C0C2"></path>
                            </svg>
                            <div class="items_wrapper" style="width: 450px; max-width: none;">
                                <div class="styles_container__3SsSr">`;
                        for (let [item_index, item] of Object.entries(this.botOfferInventory.get())) {
                            offers_html += `
                                    <div class="bot_skins ${options.disabledSkins.includes(item.assetId) ? 'disabledSkins' : ''}">
                                        <div class="styles_preview__3CQDx">
                                            <div class="styles_container__gSliV styles_container_dark_gray__1WkFc styles_container_small__1Je2M">
                                                <img class="styles_img__FwAe7 styles_img_small__2TjSR" src="${item.img}" alt="item">
                                            </div>
                                        </div>
                                    </div>`;
                        }
                        offers_html += `
                                </div>
                            </div>
                        </div>`;
                        break;
                    case 'notFoundPendingItems':
                        offers_html = `
                        <div class="styles_wrapper__3Mukf">
                            <div class="styles_content__3id0p">
                                <div class="styles_icon__3UorY">
                                    <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/325/thinking-face_1f914.png" alt="nothing happen emoji">
                                </div>
                                <div class="styles_title__1vfCM">Oh no! You have no offers!</div>
                                <div class="styles_description__3hwVb">Nothing happen</div>
                            </div>
                        </div>`;
                        break;
                    case 'pendingItems':
                        for (let offers of this.pendingOffersInventory.get()) {
                            offers_html += `
                            <div class="modal-offer" id="offer${offers.offer_id}">
                                <div class="styles_icon_wrapper__1fs1B">
                                    <div class="styles_wrapper__1RYBS">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="styles_icon__3YyMx styles_icon__p0zW2">
                                            <path clip-rule="evenodd" d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 1.273A5.734 5.734 0 001.273 7 5.734 5.734 0 007 12.727 5.734 5.734 0 0012.727 7 5.734 5.734 0 007 1.273zm-.601 6.37a.614.614 0 01-.036-.207v-3.75A.63.63 0 017 3.06a.63.63 0 01.636.625v3.113h2.107a.63.63 0 01.622.636.63.63 0 01-.622.637H6.987a.624.624 0 01-.588-.43z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="styles_title__13qTi">
                                    <span class="styles_subtitle__3SAy7">Virtual trade</span>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="styles_icon__2K1cb styles_rotate__NPPVg">
                                    <path d="M11.65 13.25a.75.75 0 001.12 1l3.539-3.962a.75.75 0 00.01-.987l-3.451-4.038a.75.75 0 00-1.14.975l2.377 2.78H4.75a.75.75 0 100 1.5h9.341l-2.44 2.732z" fill="#C0C0C2"></path>
                                </svg>
                                <div class="items_wrapper">
                                    <div class="styles_container__3SsSr">`;
                            for (let [item_index, item] of Object.entries(offers.items)) {
                                offers_html += `
                                        <div class="bot_skins">
                                            <div class="styles_preview__3CQDx">
                                                <div class="styles_container__gSliV styles_container_dark_gray__1WkFc styles_container_small__1Je2M">
                                                    <img class="styles_img__FwAe7 styles_img_small__2TjSR" src="${item.img}" alt="item">
                                                </div>
                                            </div>
                                        </div>`;
                            }
                            offers_html += `
                                    </div>
                                </div>
                                <div class="timer" data-deadline="${offers.expiry}">
                                    <span class="hours countdown-time"></span>:<span class="minutes countdown-time"></span>:<span class="seconds countdown-time"></span>
                                </div>
                                <div class="styles_actions__3uEFS">
                                    <div class="styles_actions__3uEFS">
                                        <button type="button" data-action="decline" data-offer_id="${offers.offer_id}" class="offerButton styles_button__3139I styles_white__2fplg">
                                            <span class="styles_no_event__3bE7t">Decline</span>
                                        </button>
                                        <button type="button" data-action="confirm" data-offer_id="${offers.offer_id}" class="offerButton csm_ui__button__24e1f csm_ui__primary_button__2d1f1 csm_ui__medium__2d1f1 csm_ui__confirm_secondary__2d1f1">
                                            <span class="csm_ui__text_overflow_wrapper__2d1f1">
                                                <span class="csm_ui__text__6542e csm_ui__button_12_medium__6542e csm_ui__text_wrapper__2d1f1">Accept</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>`;
                        }
                        break;
                    default:
                        break;
                }
                if (!this.isModalVisible) {
                    this.buildModal(offers_html);
                    this.isModalVisible = true;
                } else {
                    this.changeModal(offers_html);
                }
                this.initClocks();
            }
            buildModal(html){
                document.querySelector('[class^="TradePage_center"]').insertAdjacentHTML('afterbegin', `
                    <div id="myModal">
                        <div class="styles_overlay__3KR4i">
                            <div class="modal">
                                <p class="modal-title">Trade process</p>
                                <div class="modal-body">
                                    <div class="modal-container">${html}</div>
                                </div>
                                <button class="styles_close__2w7q4 close_modal" type="button"></button>
                            </div>
                        </div>
                    </div>
                `);
                const buttonsEvents = ({ target }) => {
                    if (target.closest('.close_modal')) {
                        document.querySelector('#myModal').removeEventListener('click', buttonsEvents, true);
                        document.querySelector('#myModal').remove();
                        this.isModalVisible = false;
                        console.log(extension);
                    } else if (target.closest('.offerButton')) {
                        const { dataset: { offer_id, action } } = target.closest('.offerButton');
                        this.offerAction(action, offer_id, (offerActionError, status) => {
                            if (offerActionError || !status || status.success === false) {
                                this.showModal('error', { error: offerActionError });
                            } else {
                                this.pendingOffersInventory.remove(offer_id);
                                this.showModal(action, { offer_id: offer_id });
                            }
                        });
                    }
                }
                document.querySelector('#myModal').addEventListener('click', buttonsEvents, true);
            }
            changeModal(html){
                document.querySelector('#myModal .modal-container').innerHTML = html;
            }
            async checkOfferInventoryOpen() {
                const offerHeader = document.querySelector('[class^="TradeCart_header"]');
                if (!offerHeader.parentNode.className.includes('TradeCart_open')) {
                    this.isOfferInventoryOpen = await new Promise(resolve => setTimeout(() => {
                        if (offerHeader.nextSibling) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }, 100));
                } else {
                    this.isOfferInventoryOpen = false;
                }
            }
            updateOfferInventory(){
                const html_items_bot = [...document.querySelectorAll(`[class*="bot-listing_cart_"] [class^="List_list__"] > div`)];
                const html_items_user = [...document.querySelectorAll(`[class*="user-listing_cart_"] [class^="List_list__"] > div`)];
                if (this.isOfferInventoryOpen) {
                    this.botOfferInventory.assignmentItems(html_items_bot);
                    this.botOfferInventory.highlight('disabledSkins', { disabledSkins: this.lastStatus.callback.disabledSkins });
                    this.userOfferInventory.assignmentItems(html_items_user);
                }
            }
            initEvents(){
                let virtualFirstButton = document.querySelector('#trade-virtual-first');
                let virtualFirstModalButton = document.querySelector('#show-virtual-first-modal');
                let offerHeaders = document.querySelectorAll('[class^="TradeCart_header"]');
                virtualFirstButton.addEventListener('click', async () => {
                    this.showModal('loading');
                    this.sendVirtualOffer((offerError, offerData) => {
                        this.lastStatus = JSON.parse(offerData);
                        if (offerError || !this.lastStatus || this.lastStatus.success === false) {
                            this.showModal('disabledSkins', { disabledSkins: this.lastStatus.callback.disabledSkins });
                            this.botOfferInventory.highlight('disabledSkins', { disabledSkins: this.lastStatus.callback.disabledSkins });
                        } else {
                            this.getTransactions((transactionError, transactionData) => {
                                if (transactionError || !transactionData || transactionData.success === false) {
                                    console.error(transactionError, transactionData);
                                    this.showModal('error', { error: transactionError });
                                } else {
                                    this.pendingTransactions = transactionData.filter(item => Object.entries(item)[0][1].trades[0].status == 'pending');
                                    this.pendingOffersInventory.add({
                                        status: this.lastStatus,
                                        items: this.botOfferInventory.get(),
                                        offer_id: String(Object.values(this.pendingTransactions.find(item => Object.keys(item) == this.lastStatus.uniqid))[0].trades[0].offer_id)
                                    });
                                    this.showModal('pendingItems');
                                }
                            });
                        }
                    });
                }, false);
                virtualFirstModalButton.addEventListener('click', () => {
                    console.log(extension);
                    if (this.pendingOffersInventory.get().length) {
                        this.showModal('pendingItems');
                    } else {
                        this.showModal('notFoundPendingItems');
                    }
                }, false);
                window.addEventListener('offerInventoryChange', (e) => {
                    if (this.botOfferInventory.getCount() > 0) {
                        virtualFirstButton.removeAttribute('disabled');
                        virtualFirstButton.classList.remove('styles_disabled__FKMBn', 'TradeButton_disabled__2nLaR');
                    } else {
                        virtualFirstButton.setAttribute('disabled', '');
                        virtualFirstButton.classList.add('styles_disabled__FKMBn', 'TradeButton_disabled__2nLaR');
                    }
                }, false);
                offerHeaders.forEach(item => {
                    item.addEventListener('click', async () => {
                        await this.checkOfferInventoryOpen();
                        this.updateOfferInventory();
                    }, false);
                });
            }
            setUserInfo(userInfo) {
                this.userInfo = userInfo;
            }
            async backgroundRequest(target, options = []) {
                window.postMessage({ target, options, csMoneyHelperExtensionID: localStorage.csMoneyHelperExtensionID }, '*');
                let res = await new Promise((resolve) => {
                    window.addEventListener('message', ({ data }) => {
                        if (data.target === target + '_answer') {
                            resolve(data.body);
                        }
                    });
                });
                return res;
            }
            getTransactions(callback) {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://old.cs.money/get_transactions', true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.getResponseHeader("Set-Cookie", this.cookies);
                xhr.withCredentials = true;
                xhr.onload = function () {
                    callback(null, JSON.parse(xhr.response));
                };
                xhr.onerror = function () {
                    callback(xhr.response);
                };
                xhr.send(null);
            }
            offerAction(action, offer_id, callback){
                let xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://old.cs.money/confirm_virtual_offer', true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.getResponseHeader("Set-Cookie", this.cookies);
                xhr.withCredentials = true;
                xhr.onload = function () {
                    let { error, status } = JSON.parse(xhr.response);
                    if (error) callback(error);
                    callback(null, status);
                };
                xhr.onerror = function () {
                    callback(xhr.response);
                };
                xhr.send(JSON.stringify({
                    action,
                    steamid64: this.userInfo.steamId64,
                    offer_id
                }));
            }
            sendVirtualOffer(callback) {
                const botItems = [];
                const items = this.botOfferInventory.get();
                Object.keys(items).forEach(key => {
                    const { assetId, price, tradeLock = null, fullName, steamId, nameId, float } = items[key];
                    const { username } = this.userInfo;
                    botItems.push({
                        "assetid": assetId,
                        "local_price": price,
                        "price": price,
                        "hold_time": tradeLock,
                        "market_hash_name": fullName,
                        "bot": steamId,
                        "reality": "physical",
                        "currency": "USD",
                        "username": username,
                        "appid": 730,
                        "name_id": nameId,
                        "float": float,
                        "stickers_count": 0
                    });
                });
                let xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://old.cs.money/send_offer', true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.getResponseHeader("Set-Cookie", this.cookies);
                xhr.withCredentials = true;
                xhr.onload = function () {
                    callback(null, xhr.response);
                };
                xhr.onerror = function () {
                    callback(xhr.response);
                };
                xhr.send(JSON.stringify({
                    "peopleItems": [],
                    "botItems": botItems,
                    "games": {},
                    "onWallet": -botItems.map(item => item.price).reduce((partialSum, a) => partialSum + a, 0),
                    "forceVirtual": 1,
                    "recommended": false
                }));
            }
        }
        const extension = new Extension();
        extension.init();

        XMLHttpRequest.prototype.originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(value) {
            this.addEventListener("load", function(e){
                const { responseText, responseURL, url = new URL(responseURL), searchParams = new URLSearchParams(url.search) } = this;
                const { error, items } = responseJson = isJson(responseText) ? JSON.parse(responseText) : [];
                if (error || !responseJson || !url.hostname.includes(window.location.hostname)) return;
                const { id, type, createdFrom, offset } = [...searchParams.entries()].reduce((acc, [key, value]) => {
                    acc[key] = isJson(value) ? JSON.parse(value) : value;
                    return acc;
                }, {});
                const postParams = JSON.parse(value);
                const requestKey = url.pathname.split('/').at(-1);
                switch (requestKey) {
                    case 'add_cart':
                    case 'remove_cart_item':
                    case 'clear_cart':
                        let whose_cart = type === 1 ? 'user' : 'bot';
                        let inventory_cart = whose_cart + 'OfferInventory';
                        let method_cart = requestKey.split('_')[0];
                        let item = id || postParams.item;
                        let html_items_cart = [...document.querySelectorAll(`[class*="${whose_cart}-listing_cart_"] [class^="List_list__"] > div`)];

                        extension[inventory_cart][method_cart](item);
                        extension[inventory_cart].assignmentItems(html_items_cart);
                        window.dispatchEvent(offerInventoryEvent);
                        break;
                    case 'my-lots':
                        let html_items_user_lots = [...document.querySelectorAll(`.Auction_listing__ehGey:nth-child(1) [class*="AuctionListing_wrapper__"] [class^="List_wrapper__"] > .list > div`)];
                        extension.userLotsInventory.set(responseJson);
                        extension.botLotsInventory.assignmentItems(html_items_user_lots);
                        break;
                    case 'lots':
                        if (createdFrom) {
                            extension.botLotsInventory.add(responseJson);
                        } else {
                            extension.botLotsInventory.set(responseJson);
                        }
                        let html_items_bot_lots = [...document.querySelectorAll(`.Auction_listing__ehGey:nth-child(2) [class*="AuctionListing_wrapper__"] [class^="List_wrapper__"] > .list > div`)];
                        extension.botLotsInventory.assignmentItems(html_items_bot_lots);
                        extension.botLotsInventory.highlight('popularSkins', { popularSkins: extension.popularSkins });
                        break;
                    case '730':
                        let whose_730 = url.pathname.includes('load_bots_inventory') ? 'bot' : 'user';
                        let inventory_730 = whose_730 + 'Inventory';
                        let method_730 = offset === 0 ? 'set' : 'update';
                        let html_items_730 = [...document.querySelectorAll(`[class*="${whose_730}-listing_body"] [class^="list_list_"] > div`)];

                        extension[inventory_730][method_730](items);
                        extension[inventory_730].assignmentItems(html_items_730);
                        extension[inventory_730].highlight('popularSkins', { popularSkins: extension.popularSkins });
                        break;
                    default:
                        break;
                }
                extension.requestMap.set(url, responseJson);
                extension.setCurrentPage();
                console.log(extension);
            }, false);

            this.originalSend(value);
        }
	}
	addJS_Node(null, null, init);
})();