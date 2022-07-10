"use strict";

(function _callee2() {
  var cookie;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // const domain = "csmoneypopularapi.herokuapp.com";
          // const socket = io('ws://' + domain);
          // let ticks = 0;
          // const popularSkins = await new Promise((resolve, reject) => {
          //     let timer = setInterval(async () => {
          //         console.log('Tick');
          //         let resp = await fetch('https://' + domain + '/popular-skins').then(res => res.json());
          //         if (resp.length || ticks > 20) {
          //             clearInterval(timer);
          //             resolve(resp);
          //         }
          //         console.log('Tack')
          //     }, 500);
          // });
          cookie = [];
          chrome.cookies.getAll({
            domain: "old.cs.money"
          }, function (cookies) {
            cookies.forEach(function (c) {
              return cookie.push(c.name + '=' + c.value);
            });
            cookie = cookie.join('; ');
          });
          chrome.runtime.onMessage.addListener(function _callee(_ref, sender, sendResponse) {
            var target, name_id, siteItems, userInfo;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    target = _ref.target, name_id = _ref.name_id, siteItems = _ref.siteItems, userInfo = _ref.userInfo;
                    _context.t0 = target;
                    _context.next = _context.t0 === 'getCookies' ? 4 : 6;
                    break;

                  case 4:
                    sendResponse(cookie);
                    return _context.abrupt("break", 8);

                  case 6:
                    sendResponse({
                      success: false
                    });
                    return _context.abrupt("break", 8);

                  case 8:
                    return _context.abrupt("return", true);

                  case 9:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
})();