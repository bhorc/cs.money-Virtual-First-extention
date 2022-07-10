"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

localStorage.csMoneyHelperExtensionID = chrome.runtime.id;

function addJS_Node(textContent, src, funcToRun, runOnLoad) {
  var scriptNode = document.createElement('script');
  scriptNode.type = "text/javascript";
  if (runOnLoad) scriptNode.addEventListener("load", runOnLoad, false);
  if (textContent) scriptNode.textContent = textContent;
  if (src) scriptNode.src = src;
  if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';
  var target = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
  target.appendChild(scriptNode);
}

window.addEventListener('message', function (e) {
  if (e.data.csMoneyHelperExtensionID === localStorage.csMoneyHelperExtensionID) {
    chrome.runtime.sendMessage(chrome.runtime.id, e.data, function (body) {
      window.postMessage({
        target: e.data.target + '_answer',
        body: body
      }, '*');
    });
  }
});

(function () {
  function init() {
    var event, isJson, isIterable, getTimeRemaining, initializeClock, offerInventory, customInventory, pendingInventory, RequestMap, Extension, extension;
    return regeneratorRuntime.async(function init$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            initializeClock = function _ref8(selector, callback) {
              var clock = document.querySelector(selector);
              var hoursSpan = clock.querySelector('.hours');
              var minutesSpan = clock.querySelector('.minutes');
              var secondsSpan = clock.querySelector('.seconds');
              var endTime = new Date(+clock.dataset.deadline);

              function updateClock() {
                var t = getTimeRemaining(endTime);

                if (t.total <= 0) {
                  clearInterval(timeInterval);
                  callback();
                } else {
                  hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
                  minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
                  secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
                }
              }

              updateClock();
              var timeInterval = setInterval(updateClock, 1000);
            };

            getTimeRemaining = function _ref7(endTime) {
              var t = Date.parse(endTime) - new Date().getTime();
              var seconds = Math.floor(t / 1000 % 60);
              var minutes = Math.floor(t / 1000 / 60 % 60);
              var hours = Math.floor(t / (1000 * 60 * 60) % 24);
              return {
                'total': t,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
              };
            };

            isIterable = function _ref6(value) {
              return Symbol.iterator in Object(value);
            };

            isJson = function _ref5(str) {
              try {
                JSON.parse(str);
              } catch (e) {
                return false;
              }

              return true;
            };

            if (!(window.location.host === 'old.cs.money')) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return");

          case 6:
            event = new Event('offerInventoryChange');

            offerInventory =
            /*#__PURE__*/
            function () {
              function offerInventory() {
                _classCallCheck(this, offerInventory);

                this.inventory = {};
              }

              _createClass(offerInventory, [{
                key: "add",
                value: function add(item) {
                  this.inventory[item.id] = item;
                }
              }, {
                key: "set",
                value: function set(items) {
                  this.inventory = items;
                }
              }, {
                key: "get",
                value: function get() {
                  return this.inventory;
                }
              }, {
                key: "getCount",
                value: function getCount() {
                  return Object.keys(this.inventory).length;
                }
              }, {
                key: "remove",
                value: function remove(id) {
                  delete this.inventory[id];
                }
              }, {
                key: "clear",
                value: function clear() {
                  this.inventory = {};
                }
              }]);

              return offerInventory;
            }();

            customInventory =
            /*#__PURE__*/
            function () {
              function customInventory() {
                _classCallCheck(this, customInventory);

                this.inventory = [];
              }

              _createClass(customInventory, [{
                key: "add",
                value: function add(items) {
                  this.inventory = _toConsumableArray(new Set([].concat(_toConsumableArray(this.inventory), _toConsumableArray(items))));
                }
              }, {
                key: "set",
                value: function set(data) {
                  this.inventory = data;
                }
              }, {
                key: "get",
                value: function get() {
                  return this.inventory;
                }
              }, {
                key: "update",
                value: function update(data) {
                  if (!this.inventory) {
                    this.set(data);
                  } else {
                    this.add(data);
                  }
                }
              }, {
                key: "assignmentItems",
                value: function assignmentItems(html_items) {
                  for (var _i = 0, _Object$entries = Object.entries(html_items); _i < _Object$entries.length; _i++) {
                    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                        index = _Object$entries$_i[0],
                        html_item = _Object$entries$_i[1];

                    this.inventory[index].element = html_item;
                  }
                }
              }]);

              return customInventory;
            }();

            pendingInventory =
            /*#__PURE__*/
            function (_customInventory) {
              _inherits(pendingInventory, _customInventory);

              function pendingInventory(name) {
                var _this;

                _classCallCheck(this, pendingInventory);

                _this = _possibleConstructorReturn(this, _getPrototypeOf(pendingInventory).call(this));
                _this.pendingInventoryName = name;
                _this.inventory = [];
                return _this;
              }

              _createClass(pendingInventory, [{
                key: "add",
                value: function add(_ref) {
                  var items = _ref.items,
                      _ref$status = _ref.status,
                      status = _ref$status === void 0 ? {} : _ref$status,
                      _ref$offer_id = _ref.offer_id,
                      offer_id = _ref$offer_id === void 0 ? null : _ref$offer_id,
                      _ref$expiry = _ref.expiry,
                      expiry = _ref$expiry === void 0 ? null : _ref$expiry;
                  var delay = 10 * 60 * 1000;
                  var newData = [{
                    items: items,
                    status: status,
                    offer_id: offer_id,
                    expiry: expiry || new Date().getTime() + delay
                  }];
                  this.inventory = _toConsumableArray(new Set([].concat(_toConsumableArray(this.inventory), newData)));
                  localStorage.setItem(this.pendingInventoryName, JSON.stringify(this.inventory));
                }
              }, {
                key: "get",
                value: function get() {
                  var pendingInventory = localStorage.getItem(this.pendingInventoryName);

                  if (pendingInventory && isJson(pendingInventory)) {
                    var parsedValue = JSON.parse(pendingInventory);

                    if (isIterable(parsedValue)) {
                      var _iteratorNormalCompletion = true;
                      var _didIteratorError = false;
                      var _iteratorError = undefined;

                      try {
                        for (var _iterator = parsedValue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                          var value = _step.value;

                          if (value.expiry < new Date().getTime()) {
                            parsedValue.splice(parsedValue.indexOf(value), 1);
                          }
                        }
                      } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                            _iterator["return"]();
                          }
                        } finally {
                          if (_didIteratorError) {
                            throw _iteratorError;
                          }
                        }
                      }

                      this.inventory = parsedValue;
                      localStorage.setItem(this.pendingInventoryName, JSON.stringify(this.inventory));
                    }
                  }

                  return this.inventory;
                }
              }, {
                key: "remove",
                value: function remove(id) {
                  var pendingInventory = localStorage.getItem(this.pendingInventoryName);

                  if (pendingInventory && isJson(pendingInventory)) {
                    var parsedValue = JSON.parse(pendingInventory);

                    if (isIterable(parsedValue)) {
                      var _iteratorNormalCompletion2 = true;
                      var _didIteratorError2 = false;
                      var _iteratorError2 = undefined;

                      try {
                        for (var _iterator2 = parsedValue[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                          var value = _step2.value;

                          if (value.offer_id == id) {
                            parsedValue.splice(parsedValue.indexOf(value), 1);
                          }
                        }
                      } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                            _iterator2["return"]();
                          }
                        } finally {
                          if (_didIteratorError2) {
                            throw _iteratorError2;
                          }
                        }
                      }

                      this.inventory = parsedValue;
                      localStorage.setItem(this.pendingInventoryName, JSON.stringify(this.inventory));
                    }
                  }

                  this.get();
                }
              }]);

              return pendingInventory;
            }(customInventory);

            RequestMap =
            /*#__PURE__*/
            function () {
              function RequestMap() {
                _classCallCheck(this, RequestMap);
              }

              _createClass(RequestMap, [{
                key: "set",
                value: function set(key, items) {
                  this[key] = items;
                }
              }]);

              return RequestMap;
            }();

            Extension =
            /*#__PURE__*/
            function () {
              function Extension() {
                _classCallCheck(this, Extension);

                this.botOfferInventory = new offerInventory();
                this.userOfferInventory = new offerInventory();
                this.botInventory = new customInventory();
                this.userInventory = new customInventory();
                this.lotsInventory = new customInventory();
                this.pendingOffersInventory = new pendingInventory('pendingInventory');
                this.requestMap = new RequestMap();
                this.userInfo = {};
                this.pendingTransactions = [];
                this.cookies = null;
              }

              _createClass(Extension, [{
                key: "init",
                value: function init() {
                  return regeneratorRuntime.async(function init$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          console.log('New cs.money extension Inited!');
                          this.pendingOffersInventory.get();
                          _context.next = 4;
                          return regeneratorRuntime.awrap(this.getCookies());

                        case 4:
                          this.cookies = _context.sent;
                          this.setUserInfo(__NEXT_DATA__.props.initialReduxState.g_userInfo);
                          this.buildDesign();
                          this.initEvents();

                        case 8:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, null, this);
                }
              }, {
                key: "buildDesign",
                value: function buildDesign() {
                  document.querySelector('[class^="TradePage_center"]').insertAdjacentHTML('afterbegin', "\n                    <button class=\"TradePage_trade_button__3AwF8 styles_button__303YR styles_main__PiMGk TradeButton_button__1Dt47 styles_disabled__FKMBn TradeButton_disabled__2nLaR\" disabled=\"\" type=\"button\" id=\"trade-virtual-first\">\n                        <span>Virtual First</span>\n                    </button>\n                    <button id=\"show-virtual-first-modal\">\n                        <span>Show virtual offers</span>\n                    </button>\n                ");
                }
              }, {
                key: "buildModal",
                value: function buildModal() {
                  var _this2 = this;

                  var offers_html = '';
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = this.pendingOffersInventory.get()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var offers = _step3.value;
                      offers_html += "\n                    <div class=\"modal-offer\">\n                        <div class=\"styles_icon_wrapper__1fs1B\">\n                            <div class=\"styles_wrapper__1RYBS\">\n                                <svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" class=\"styles_icon__3YyMx styles_icon__p0zW2\">\n                                    <path clip-rule=\"evenodd\" d=\"M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 1.273A5.734 5.734 0 001.273 7 5.734 5.734 0 007 12.727 5.734 5.734 0 0012.727 7 5.734 5.734 0 007 1.273zm-.601 6.37a.614.614 0 01-.036-.207v-3.75A.63.63 0 017 3.06a.63.63 0 01.636.625v3.113h2.107a.63.63 0 01.622.636.63.63 0 01-.622.637H6.987a.624.624 0 01-.588-.43z\"></path>\n                                </svg>\n                            </div>\n                        </div>\n                        <div class=\"styles_title__13qTi\">\n                            <span class=\"styles_subtitle__3SAy7\">Virtual trade</span>\n                        </div>\n                        <svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" class=\"styles_icon__2K1cb styles_rotate__NPPVg\">\n                            <path d=\"M11.65 13.25a.75.75 0 001.12 1l3.539-3.962a.75.75 0 00.01-.987l-3.451-4.038a.75.75 0 00-1.14.975l2.377 2.78H4.75a.75.75 0 100 1.5h9.341l-2.44 2.732z\" fill=\"#C0C0C2\"></path>\n                        </svg>\n                        <div class=\"items_wrapper\">\n                            <div class=\"styles_container__3SsSr\">";

                      for (var _i3 = 0, _Object$entries2 = Object.entries(offers.items); _i3 < _Object$entries2.length; _i3++) {
                        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2),
                            item_index = _Object$entries2$_i[0],
                            item = _Object$entries2$_i[1];

                        offers_html += "\n                                <div class=\"bot_skins\">\n                                    <div class=\"styles_preview__3CQDx\">\n                                        <div class=\"styles_container__gSliV styles_container_dark_gray__1WkFc styles_container_small__1Je2M\">\n                                            <img class=\"styles_img__FwAe7 styles_img_small__2TjSR\" src=\"".concat(item.img, "\" alt=\"item\">\n                                        </div>\n                                    </div>\n                                </div>");
                      }

                      offers_html += "\n                            </div>\n                        </div>\n                        <div class=\"timer\" data-deadline=\"".concat(offers.expiry, "\">\n                            <span class=\"hours countdown-time\"></span>:<span class=\"minutes countdown-time\"></span>:<span class=\"seconds countdown-time\"></span>\n                        </div>\n                        <div class=\"styles_actions__3uEFS\">\n                            <div class=\"styles_actions__3uEFS\">\n                                <button type=\"button\" data-action=\"decline\" data-offer_id=\"").concat(offers.offer_id, "\" class=\"offerButton styles_button__3139I styles_white__2fplg\">\n                                    <span class=\"styles_no_event__3bE7t\">Decline</span>\n                                </button>\n                                <button type=\"button\" data-action=\"confirm\" data-offer_id=\"").concat(offers.offer_id, "\" class=\"offerButton csm_ui__button__24e1f csm_ui__primary_button__2d1f1 csm_ui__medium__2d1f1 csm_ui__confirm_secondary__2d1f1\">\n                                    <span class=\"csm_ui__text_overflow_wrapper__2d1f1\">\n                                        <span class=\"csm_ui__text__6542e csm_ui__button_12_medium__6542e csm_ui__text_wrapper__2d1f1\">Accept</span>\n                                    </span>\n                                </button>\n                            </div>\n                        </div>\n                    </div>");
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                        _iterator3["return"]();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }

                  document.querySelector('[class^="TradePage_center"]').insertAdjacentHTML('afterbegin', "\n                    <div id=\"myModal\">\n                        <div class=\"styles_overlay__3KR4i\">\n                            <div class=\"modal\">\n                                <p class=\"modal-title\">Trade process</p>\n                                <div class=\"modal-body\">\n                                    <div class=\"modal-container\">\n                                        ".concat(offers_html, "\n                                    </div>\n                                </div>\n                                <button class=\"styles_close__2w7q4 close_modal\" type=\"button\"></button>\n                            </div>\n                        </div>\n                    </div>\n                "));
                  document.querySelector('#myModal').addEventListener('click', function (_ref2) {
                    var target = _ref2.target;

                    if (target.closest('.close_modal')) {
                      document.querySelector('#myModal').remove();
                    }

                    if (target.closest('.offerButton')) {
                      var _target$closest = target.closest('.offerButton'),
                          _target$closest$datas = _target$closest.dataset,
                          offer_id = _target$closest$datas.offer_id,
                          action = _target$closest$datas.action;

                      _this2.offerAction(action, offer_id, function (err, status) {
                        console.log(err, status);

                        if (err) {
                          console.log('Error: ' + err);
                        }

                        if (status) {
                          _this2.pendingOffersInventory.remove(offer_id);
                        }
                      });
                    }
                  }, true);

                  for (var _i2 = 0, _arr2 = _toConsumableArray(document.querySelectorAll('.timer')); _i2 < _arr2.length; _i2++) {
                    var timer = _arr2[_i2];
                    initializeClock("[data-deadline='".concat(timer.dataset.deadline, "']"), function () {
                      _this2.pendingOffersInventory.get();
                    });
                  }
                }
              }, {
                key: "initEvents",
                value: function initEvents() {
                  var _this3 = this;

                  var virtualFirstButton = document.querySelector('#trade-virtual-first');
                  var virtualFirstModalButton = document.querySelector('#show-virtual-first-modal');
                  virtualFirstButton.addEventListener('click', function _callee() {
                    return regeneratorRuntime.async(function _callee$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _this3.sendVirtualOffer(function (err, data) {
                              var status = JSON.parse(data);

                              if (err) {
                                console.error(err);
                              } else {
                                _this3.getTransactions(function (err, data) {
                                  if (err) {
                                    console.error(err);
                                  } else {
                                    _this3.pendingTransactions = JSON.parse(data).filter(function (item) {
                                      return Object.entries(item)[0][1].trades[0].status == 'pending';
                                    });

                                    _this3.pendingOffersInventory.add({
                                      status: status,
                                      items: _this3.botOfferInventory.get(),
                                      offer_id: String(Object.values(_this3.pendingTransactions.find(function (item) {
                                        return Object.keys(item) == status.uniqid;
                                      }))[0].trades[0].offer_id)
                                    });

                                    _this3.buildModal();
                                  }
                                });
                              }
                            });

                          case 1:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    });
                  }, false);
                  virtualFirstModalButton.addEventListener('click', function () {
                    _this3.buildModal();
                  }, false);
                  window.addEventListener('offerInventoryChange', function (e) {
                    if (_this3.botOfferInventory.getCount() > 0) {
                      virtualFirstButton.removeAttribute('disabled');
                      virtualFirstButton.classList.remove('styles_disabled__FKMBn', 'TradeButton_disabled__2nLaR');
                    } else {
                      virtualFirstButton.setAttribute('disabled', '');
                      virtualFirstButton.classList.add('styles_disabled__FKMBn', 'TradeButton_disabled__2nLaR');
                    }
                  }, false);
                }
              }, {
                key: "setUserInfo",
                value: function setUserInfo(userInfo) {
                  this.userInfo = userInfo;
                }
              }, {
                key: "getCookies",
                value: function getCookies() {
                  var cookie;
                  return regeneratorRuntime.async(function getCookies$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          window.postMessage({
                            target: 'getCookies',
                            csMoneyHelperExtensionID: localStorage.csMoneyHelperExtensionID
                          }, '*');
                          _context3.next = 3;
                          return regeneratorRuntime.awrap(new Promise(function (resolve) {
                            window.addEventListener('message', function (e) {
                              if (e.data.target === 'getCookies_answer') {
                                resolve(e.data.body);
                              }
                            });
                          }));

                        case 3:
                          cookie = _context3.sent;
                          return _context3.abrupt("return", cookie);

                        case 5:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  });
                }
              }, {
                key: "getTransactions",
                value: function getTransactions(callback) {
                  var xhr = new XMLHttpRequest();
                  xhr.open('GET', 'https://old.cs.money/get_transactions', true);
                  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                  xhr.getResponseHeader("Set-Cookie", this.cookies);
                  xhr.withCredentials = true;

                  xhr.onload = function () {
                    callback(null, xhr.response);
                  };

                  xhr.onerror = function () {
                    callback(xhr.response);
                  };

                  xhr.send(null);
                }
              }, {
                key: "offerAction",
                value: function offerAction(action, offer_id, callback) {
                  var xhr = new XMLHttpRequest();
                  xhr.open('POST', 'https://old.cs.money/confirm_virtual_offer', true);
                  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                  xhr.getResponseHeader("Set-Cookie", this.cookies);
                  xhr.withCredentials = true;

                  xhr.onload = function () {
                    var _JSON$parse = JSON.parse(xhr.response),
                        error = _JSON$parse.error,
                        status = _JSON$parse.status;

                    if (error) callback(error);
                    callback(null, status);
                  };

                  xhr.onerror = function () {
                    callback(JSON.parse(xhr.response));
                  };

                  xhr.send(JSON.stringify({
                    action: action,
                    steamid64: this.userInfo.steamId64,
                    offer_id: offer_id
                  }));
                }
              }, {
                key: "sendVirtualOffer",
                value: function sendVirtualOffer(callback) {
                  var _this4 = this;

                  var botItems = [];
                  var items = this.botOfferInventory.get();
                  Object.keys(items).forEach(function (key) {
                    var _items$key = items[key],
                        assetId = _items$key.assetId,
                        price = _items$key.price,
                        _items$key$tradeLock = _items$key.tradeLock,
                        tradeLock = _items$key$tradeLock === void 0 ? null : _items$key$tradeLock,
                        fullName = _items$key.fullName,
                        steamId = _items$key.steamId,
                        nameId = _items$key.nameId,
                        _float = _items$key["float"];
                    var username = _this4.userInfo.username;
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
                      "float": _float,
                      "stickers_count": 0
                    });
                  });
                  var xhr = new XMLHttpRequest();
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
                    "onWallet": -botItems.map(function (item) {
                      return item.price;
                    }).reduce(function (partialSum, a) {
                      return partialSum + a;
                    }, 0),
                    "forceVirtual": 1,
                    "recommended": false
                  }));
                }
              }]);

              return Extension;
            }();

            extension = new Extension();
            extension.init();
            XMLHttpRequest.prototype.originalSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.send = function (value) {
              this.addEventListener("load", function (e) {
                var responseText = this.responseText,
                    responseURL = this.responseURL,
                    url = new URL(responseURL);

                var _data = data = JSON.parse(responseText),
                    error = _data.error,
                    items = _data.items;

                if (error) return;
                var searchParams = new URLSearchParams(url.search);

                var getParams = _toConsumableArray(searchParams.entries()).reduce(function (acc, _ref3) {
                  var _ref4 = _slicedToArray(_ref3, 2),
                      key = _ref4[0],
                      value = _ref4[1];

                  acc[key] = isJson(value) ? JSON.parse(value) : value;
                  return acc;
                }, {});

                var postParams = JSON.parse(value);
                var requestKey = url.pathname.split('/').at(-1);

                switch (requestKey) {
                  case 'add_cart':
                    if (postParams.type == 1) {
                      extension.userOfferInventory.add(postParams.item);
                    } else {
                      extension.botOfferInventory.add(postParams.item);
                    }

                    window.dispatchEvent(event);
                    break;

                  case 'remove_cart_item':
                    if (getParams.type == 1) {
                      extension.userOfferInventory.remove(getParams.id);
                    } else {
                      extension.botOfferInventory.remove(getParams.id);
                    }

                    window.dispatchEvent(event);
                    break;

                  case 'clear_cart':
                    if (getParams.type == 1) {
                      extension.userOfferInventory.clear();
                    } else {
                      extension.botOfferInventory.clear();
                    }

                    window.dispatchEvent(event);
                    break;

                  case 'lots':
                    if (getParams.createdFrom) {
                      extension.lotsInventory.add(data);
                    } else {
                      extension.lotsInventory.set(data);
                    }

                    break;

                  case '730':
                    var whose = url.pathname.includes('load_bots_inventory') ? 'bot' : 'user';
                    var inventory = whose + 'Inventory';
                    var method = getParams.offset === 0 ? 'set' : 'update';

                    var html_items = _toConsumableArray(document.querySelectorAll("[class*=\"".concat(whose, "-listing_body\"] [class^=\"list_list_\"] > div")));

                    extension[inventory][method](items);
                    extension[inventory].assignmentItems(html_items);
                    break;

                  default:
                    break;
                }

                extension.requestMap.set(requestKey, data);
                console.log(extension);
              }, false);
              this.originalSend(value);
            };

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    });
  }

  addJS_Node(init);
  addJS_Node("init();");
})();