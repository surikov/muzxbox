var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
define("core/src/types/data", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EGetLaunchParamsResponsePlatforms = exports.EGetLaunchParamsResponseGroupRole = exports.EGetLaunchParamsResponseLanguages = exports.EGrantedPermission = exports.BannerAdOrientation = exports.BannerAdHeightType = exports.BannerAdAlign = exports.BannerAdLocation = exports.BannerAdLayoutType = exports.EAdsFormats = void 0;
    var EAdsFormats;
    (function (EAdsFormats) {
        EAdsFormats["REWARD"] = "reward";
        EAdsFormats["INTERSTITIAL"] = "interstitial";
    })(EAdsFormats || (exports.EAdsFormats = EAdsFormats = {}));
    var BannerAdLayoutType;
    (function (BannerAdLayoutType) {
        BannerAdLayoutType["RESIZE"] = "resize";
        BannerAdLayoutType["OVERLAY"] = "overlay";
    })(BannerAdLayoutType || (exports.BannerAdLayoutType = BannerAdLayoutType = {}));
    var BannerAdLocation;
    (function (BannerAdLocation) {
        BannerAdLocation["TOP"] = "top";
        BannerAdLocation["BOTTOM"] = "bottom";
    })(BannerAdLocation || (exports.BannerAdLocation = BannerAdLocation = {}));
    var BannerAdAlign;
    (function (BannerAdAlign) {
        BannerAdAlign["LEFT"] = "left";
        BannerAdAlign["RIGHT"] = "right";
        BannerAdAlign["CENTER"] = "center";
    })(BannerAdAlign || (exports.BannerAdAlign = BannerAdAlign = {}));
    var BannerAdHeightType;
    (function (BannerAdHeightType) {
        BannerAdHeightType["COMPACT"] = "compact";
        BannerAdHeightType["REGULAR"] = "regular";
    })(BannerAdHeightType || (exports.BannerAdHeightType = BannerAdHeightType = {}));
    var BannerAdOrientation;
    (function (BannerAdOrientation) {
        BannerAdOrientation["HORIZONTAL"] = "horizontal";
        BannerAdOrientation["VERTICAL"] = "vertical";
    })(BannerAdOrientation || (exports.BannerAdOrientation = BannerAdOrientation = {}));
    var EGrantedPermission;
    (function (EGrantedPermission) {
        EGrantedPermission["CAMERA"] = "camera";
        EGrantedPermission["LOCATION"] = "location";
        EGrantedPermission["PHOTO"] = "photo";
    })(EGrantedPermission || (exports.EGrantedPermission = EGrantedPermission = {}));
    var EGetLaunchParamsResponseLanguages;
    (function (EGetLaunchParamsResponseLanguages) {
        EGetLaunchParamsResponseLanguages["RU"] = "ru";
        EGetLaunchParamsResponseLanguages["UK"] = "uk";
        EGetLaunchParamsResponseLanguages["UA"] = "ua";
        EGetLaunchParamsResponseLanguages["EN"] = "en";
        EGetLaunchParamsResponseLanguages["BE"] = "be";
        EGetLaunchParamsResponseLanguages["KZ"] = "kz";
        EGetLaunchParamsResponseLanguages["PT"] = "pt";
        EGetLaunchParamsResponseLanguages["ES"] = "es";
    })(EGetLaunchParamsResponseLanguages || (exports.EGetLaunchParamsResponseLanguages = EGetLaunchParamsResponseLanguages = {}));
    var EGetLaunchParamsResponseGroupRole;
    (function (EGetLaunchParamsResponseGroupRole) {
        EGetLaunchParamsResponseGroupRole["ADMIN"] = "admin";
        EGetLaunchParamsResponseGroupRole["EDITOR"] = "editor";
        EGetLaunchParamsResponseGroupRole["MEMBER"] = "member";
        EGetLaunchParamsResponseGroupRole["MODER"] = "moder";
        EGetLaunchParamsResponseGroupRole["NONE"] = "none";
    })(EGetLaunchParamsResponseGroupRole || (exports.EGetLaunchParamsResponseGroupRole = EGetLaunchParamsResponseGroupRole = {}));
    var EGetLaunchParamsResponsePlatforms;
    (function (EGetLaunchParamsResponsePlatforms) {
        EGetLaunchParamsResponsePlatforms["DESKTOP_WEB"] = "desktop_web";
        EGetLaunchParamsResponsePlatforms["DESKTOP_WEB_MESSENGER"] = "desktop_web_messenger";
        EGetLaunchParamsResponsePlatforms["DESKTOP_APP_MESSENGER"] = "desktop_app_messenger";
        EGetLaunchParamsResponsePlatforms["MOBILE_WEB"] = "mobile_web";
        EGetLaunchParamsResponsePlatforms["MOBILE_ANDROID"] = "mobile_android";
        EGetLaunchParamsResponsePlatforms["MOBILE_ANDROID_MESSENGER"] = "mobile_android_messenger";
        EGetLaunchParamsResponsePlatforms["MOBILE_IPHONE"] = "mobile_iphone";
        EGetLaunchParamsResponsePlatforms["MOBILE_IPHONE_MESSENGER"] = "mobile_iphone_messenger";
        EGetLaunchParamsResponsePlatforms["MOBILE_IPAD"] = "mobile_ipad";
    })(EGetLaunchParamsResponsePlatforms || (exports.EGetLaunchParamsResponsePlatforms = EGetLaunchParamsResponsePlatforms = {}));
});
define("core/src/types/bridge", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/src/types/middleware", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/src/applyMiddleware", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyMiddleware = applyMiddleware;
    /**
     * Creates the VK Bridge enhancer that applies middleware to the `send`
     * method. This is handy for a variety of task such as logging every sent
     * event.
     *
     * @param middlewares The middleware chain to be applied.
     * @returns The VK Bridge enhancer applying the middleware.
     */
    function applyMiddleware() {
        var middlewares = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middlewares[_i] = arguments[_i];
        }
        if (middlewares.includes(undefined) || middlewares.includes(null)) {
            return applyMiddleware.apply(void 0, middlewares.filter(function (item) { return typeof item === 'function'; }));
        }
        return function (bridge) {
            if (middlewares.length === 0) {
                return bridge;
            }
            var send = function () {
                throw new Error('Sending events while constructing your middleware is not allowed. ' +
                    'Other middleware would not be applied to this send.');
            };
            var middlewareAPI = {
                subscribe: bridge.subscribe,
                send: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return bridge.send.apply(bridge, args);
                },
            };
            var chain = middlewares
                .filter(function (item) { return typeof item === 'function'; })
                .map(function (middleware) { return middleware(middlewareAPI); }) //
                .reduce(function (a, b) { return function (send) { return a(b(send)); }; });
            send = chain(bridge.send);
            return __assign(__assign({}, bridge), { send: send });
        };
    }
});
define("core/src/promisifySend", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.promisifySend = promisifySend;
    /**
     * Creates counter interface.
     */
    function createCounter() {
        return {
            current: 0,
            next: function () {
                return ++this.current;
            },
        };
    }
    /**
     * Creates interface for resolving request promises by request id's (or not).
     *
     * @param instanceId Uniq bridge instance ID.
     */
    function createRequestResolver(instanceId) {
        var counter = createCounter();
        var promiseControllers = {};
        return {
            /**
             * Adds new controller with resolve/reject methods.
             *
             * @param controller Object with `resolve` and `reject` functions
             * @param customId Custom `request_id`
             * @returns New request id of the added controller.
             */
            add: function (controller, customId) {
                var id = customId != null ? customId : "".concat(counter.next(), "_").concat(instanceId);
                promiseControllers[id] = controller;
                return id;
            },
            /**
             * Resolves/rejects an added promise by request id and the `isSuccess`
             * predicate.
             *
             * @param requestId Request ID.
             * @param data Data to pass to the resolve- or reject-function.
             * @param isSuccess Predicate to select the desired function.
             */
            resolve: function (requestId, data, isSuccess) {
                var requestPromise = promiseControllers[requestId];
                if (requestPromise) {
                    if (isSuccess(data)) {
                        requestPromise.resolve(data);
                    }
                    else {
                        requestPromise.reject(data);
                    }
                    promiseControllers[requestId] = null;
                }
            },
        };
    }
    /**
     * Returns send function that returns promises.
     *
     * @param sendEvent Send event function.
     * @param subscribe Subscribe event function.
     * @param instanceId Uniq bridge instance ID.
     * @returns Send function which returns the Promise object.
     */
    function promisifySend(sendEvent, subscribe, instanceId) {
        var requestResolver = createRequestResolver(instanceId);
        // Subscribe to receive a data
        subscribe(function (event) {
            if (!event.detail || !event.detail.data || typeof event.detail.data !== 'object') {
                return;
            }
            // There is no request_id in receive-only events, so we check its existence.
            if ('request_id' in event.detail.data) {
                var _a = event.detail.data, requestId = _a.request_id, data = __rest(_a, ["request_id"]);
                if (requestId) {
                    requestResolver.resolve(requestId, data, function (data) { return !('error_type' in data); });
                }
            }
        });
        return function promisifiedSend(method, props) {
            if (props === void 0) { props = {}; }
            return new Promise(function (resolve, reject) {
                var requestId = requestResolver.add({ resolve: resolve, reject: reject }, props.request_id);
                sendEvent(method, __assign(__assign({}, props), { request_id: requestId }));
            });
        };
    }
});
define("core/src/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createInstanceId = createInstanceId;
    function createInstanceId() {
        var allNumbersAndLetters = 36;
        var positionAfterZeroAnDot = 2;
        var keyLength = 3;
        return Math.random()
            .toString(allNumbersAndLetters)
            .substring(positionAfterZeroAnDot, positionAfterZeroAnDot + keyLength);
    }
});
define("core/src/bridge", ["require", "exports", "core/src/promisifySend", "core/src/utils"], function (require, exports, promisifySend_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DESKTOP_METHODS = exports.EVENT_TYPE = exports.IS_DESKTOP_VK = exports.IS_MVK = exports.IS_WEB = exports.IS_REACT_NATIVE_WEBVIEW = exports.IS_IOS_WEBVIEW = exports.IS_ANDROID_WEBVIEW = exports.IS_CLIENT_SIDE = void 0;
    exports.createVKBridge = createVKBridge;
    /** Is the client side runtime environment */
    exports.IS_CLIENT_SIDE = typeof window !== 'undefined';
    /** Is the runtime environment an Android app */
    exports.IS_ANDROID_WEBVIEW = Boolean(exports.IS_CLIENT_SIDE && window.AndroidBridge);
    /** Is the runtime environment an iOS app */
    exports.IS_IOS_WEBVIEW = Boolean(exports.IS_CLIENT_SIDE &&
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.VKWebAppClose);
    exports.IS_REACT_NATIVE_WEBVIEW = Boolean(exports.IS_CLIENT_SIDE &&
        window.ReactNativeWebView &&
        typeof window.ReactNativeWebView.postMessage === 'function');
    /** Is the runtime environment a browser */
    exports.IS_WEB = exports.IS_CLIENT_SIDE && !exports.IS_ANDROID_WEBVIEW && !exports.IS_IOS_WEBVIEW;
    /** Is the runtime environment m.vk.ru */
    exports.IS_MVK = exports.IS_WEB && /(^\?|&)vk_platform=mobile_web(&|$)/.test(location.search);
    /** Is the runtime environment vk.ru */
    exports.IS_DESKTOP_VK = exports.IS_WEB && !exports.IS_MVK;
    /** Type of subscribe event */
    exports.EVENT_TYPE = exports.IS_WEB ? 'message' : 'VKWebAppEvent';
    /** Methods supported on the desktop */
    exports.DESKTOP_METHODS = __spreadArray([
        'VKWebAppInit',
        'VKWebAppGetCommunityAuthToken',
        'VKWebAppAddToCommunity',
        'VKWebAppAddToHomeScreenInfo',
        'VKWebAppClose',
        'VKWebAppCopyText',
        'VKWebAppCreateHash',
        'VKWebAppGetUserInfo',
        'VKWebAppSetLocation',
        'VKWebAppSendToClient',
        'VKWebAppGetClientVersion',
        'VKWebAppGetPhoneNumber',
        'VKWebAppGetEmail',
        'VKWebAppGetGroupInfo',
        'VKWebAppGetGeodata',
        'VKWebAppGetCommunityToken',
        'VKWebAppGetConfig',
        'VKWebAppGetLaunchParams',
        'VKWebAppSetTitle',
        'VKWebAppGetAuthToken',
        'VKWebAppCallAPIMethod',
        'VKWebAppJoinGroup',
        'VKWebAppLeaveGroup',
        'VKWebAppAllowMessagesFromGroup',
        'VKWebAppDenyNotifications',
        'VKWebAppAllowNotifications',
        'VKWebAppOpenPayForm',
        'VKWebAppOpenApp',
        'VKWebAppShare',
        'VKWebAppShowWallPostBox',
        'VKWebAppScroll',
        'VKWebAppShowOrderBox',
        'VKWebAppShowLeaderBoardBox',
        'VKWebAppShowInviteBox',
        'VKWebAppShowRequestBox',
        'VKWebAppAddToFavorites',
        'VKWebAppShowStoryBox',
        'VKWebAppStorageGet',
        'VKWebAppStorageGetKeys',
        'VKWebAppStorageSet',
        'VKWebAppFlashGetInfo',
        'VKWebAppSubscribeStoryApp',
        'VKWebAppOpenWallPost',
        'VKWebAppCheckAllowedScopes',
        'VKWebAppCheckBannerAd',
        'VKWebAppHideBannerAd',
        'VKWebAppShowBannerAd',
        'VKWebAppCheckNativeAds',
        'VKWebAppShowNativeAds',
        'VKWebAppRetargetingPixel',
        'VKWebAppConversionHit',
        'VKWebAppShowSubscriptionBox',
        'VKWebAppCheckSurvey',
        'VKWebAppShowSurvey',
        'VKWebAppScrollTop',
        'VKWebAppScrollTopStart',
        'VKWebAppScrollTopStop',
        'VKWebAppShowSlidesSheet',
        'VKWebAppTranslate',
        'VKWebAppRecommend',
        'VKWebAppAddToProfile',
        'VKWebAppGetFriends'
    ], (exports.IS_DESKTOP_VK
        ? [
            'VKWebAppResizeWindow',
            'VKWebAppAddToMenu',
            'VKWebAppShowInstallPushBox',
            'VKWebAppShowCommunityWidgetPreviewBox',
            'VKWebAppCallStart',
            'VKWebAppCallJoin',
            'VKWebAppCallGetStatus',
        ]
        : ['VKWebAppShowImages']), true);
    /** Cache for supported methods */
    var supportedHandlers;
    /** Android VK Bridge interface. */
    var androidBridge = exports.IS_CLIENT_SIDE ? window.AndroidBridge : undefined;
    /** iOS VK Bridge interface. */
    var iosBridge = exports.IS_IOS_WEBVIEW ? window.webkit.messageHandlers : undefined;
    /** Web VK Bridge interface. */
    var webBridge = exports.IS_WEB
        ? parent
        : undefined;
    // [Примечание 1] Отключили использование в этом PR https://github.com/VKCOM/vk-bridge/pull/262
    // let webSdkHandlers: string[] | undefined;
    /**
     * Creates a VK Bridge API that holds functions for interact with runtime
     * environment.
     *
     * @param version Version of the package
     */
    function createVKBridge(version) {
        /** Current frame id. */
        var webFrameId = undefined;
        /** List of functions that subscribed on events. */
        var subscribers = [];
        /** Uniq instance ID */
        var instanceId = (0, utils_1.createInstanceId)();
        /**
         * Sends an event to the runtime env. In the case of Android/iOS application
         * env is the application itself. In the case of the browser, the parent
         * frame in which the event handlers is located.
         *
         * @param method The method (event) name to send
         * @param [props] Method properties
         */
        function send(method, props) {
            // Sending data through Android bridge
            if (androidBridge && androidBridge[method]) {
                androidBridge[method](JSON.stringify(props));
            }
            // Sending data through iOS bridge
            else if (iosBridge &&
                iosBridge[method] &&
                typeof iosBridge[method].postMessage === 'function') {
                iosBridge[method].postMessage(props);
            }
            // Sending data through React Native bridge
            else if (exports.IS_REACT_NATIVE_WEBVIEW) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    handler: method,
                    params: props,
                }));
            }
            // Sending data through web bridge
            else if (webBridge && typeof webBridge.postMessage === 'function') {
                webBridge.postMessage({
                    handler: method,
                    params: props,
                    type: 'vk-connect',
                    webFrameId: webFrameId,
                    connectVersion: version,
                }, '*');
            }
        }
        /**
         * Adds an event listener. It will be called any time a data is received.
         *
         * @param listener A callback to be invoked on every event receive.
         */
        function subscribe(listener) {
            subscribers.push(listener);
        }
        /**
         * Removes an event listener which has been subscribed for event listening.
         *
         * @param listener A callback to unsubscribe.
         */
        function unsubscribe(listener) {
            var index = subscribers.indexOf(listener);
            if (index > -1) {
                subscribers.splice(index, 1);
            }
        }
        function supportsInner(method) {
            if (exports.IS_ANDROID_WEBVIEW) {
                // Android support check
                return !!(androidBridge && typeof androidBridge[method] === 'function');
            }
            else if (exports.IS_IOS_WEBVIEW) {
                // iOS support check
                return !!(iosBridge &&
                    iosBridge[method] &&
                    typeof iosBridge[method].postMessage === 'function');
            }
            else if (exports.IS_WEB) {
                // Web support check
                return exports.DESKTOP_METHODS.includes(method);
                // см. Примечание 1
                // if (!webSdkHandlers) {
                //   console.error('You should call bridge.send("VKWebAppInit") first');
                //   return false;
                // }
                // return webSdkHandlers.includes(method);
            }
            return false;
        }
        /**
         * Checks if a method is supported on runtime platform.
         *
         * @param method Method (event) name to check.
         * @returns Result of checking.
         * @deprecated This method is deprecated. Use supportsAsync instead.
         */
        function supports(method) {
            console.warn('bridge.supports method is deprecated. Use bridge.supportsAsync instead.');
            return supportsInner(method);
        }
        /**
         * Checks whether the runtime is a WebView.
         *
         * @returns Result of checking.
         */
        function isWebView() {
            return exports.IS_IOS_WEBVIEW || exports.IS_ANDROID_WEBVIEW;
        }
        /**
         * Checks whether the runtime is an iframe.
         *
         * @returns Result of checking.
         */
        function isIframe() {
            return exports.IS_WEB && window.parent !== window;
        }
        /**
         * Checks whether the runtime is embedded.
         *
         * @returns Result of checking.
         */
        function isEmbedded() {
            return isWebView() || isIframe();
        }
        /**
         * Checks whether the runtime is standalone.
         *
         * @returns Result of checking.
         */
        function isStandalone() {
            return !isEmbedded();
        }
        function handleEvent(event) {
            if (exports.IS_IOS_WEBVIEW || exports.IS_ANDROID_WEBVIEW) {
                // If it's webview
                return __spreadArray([], subscribers, true).map(function (fn) { return fn.call(null, event); });
            }
            var bridgeEventData = event === null || event === void 0 ? void 0 : event.data;
            if (!exports.IS_WEB || !bridgeEventData) {
                return;
            }
            if (exports.IS_REACT_NATIVE_WEBVIEW && typeof bridgeEventData === 'string') {
                try {
                    bridgeEventData = JSON.parse(bridgeEventData);
                }
                catch (_a) { }
            }
            var type = bridgeEventData.type, data = bridgeEventData.data, frameId = bridgeEventData.frameId;
            if (!type) {
                return;
            }
            // см. Примечание 1
            // if (type === 'SetSupportedHandlers') {
            //   webSdkHandlers = data.supportedHandlers;
            //   return;
            // }
            if (type === 'VKWebAppSettings') {
                webFrameId = frameId;
                return;
            }
            __spreadArray([], subscribers, true).map(function (fn) { return fn({ detail: { type: type, data: data } }); });
        }
        // Subscribes to listening messages from a runtime for calling each
        // subscribed event listener.
        if (exports.IS_REACT_NATIVE_WEBVIEW && /(android)/i.test(navigator.userAgent)) {
            document.addEventListener(exports.EVENT_TYPE, handleEvent);
        }
        else if (typeof window !== 'undefined' && 'addEventListener' in window) {
            window.addEventListener(exports.EVENT_TYPE, handleEvent);
        }
        /**
         * Enhanced send functions for the ability to receive response data in
         * the Promise object.
         */
        var sendPromise = (0, promisifySend_1.promisifySend)(send, subscribe, instanceId);
        function supportsAsync(method) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (exports.IS_ANDROID_WEBVIEW || exports.IS_IOS_WEBVIEW) {
                                return [2 /*return*/, supportsInner(method)];
                            }
                            if (supportedHandlers) {
                                return [2 /*return*/, supportedHandlers.has(method)];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, sendPromise('SetSupportedHandlers')];
                        case 2:
                            response = _a.sent();
                            supportedHandlers = new Set(response.supportedHandlers);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            supportedHandlers = new Set(['VKWebAppInit']);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, supportedHandlers.has(method)];
                    }
                });
            });
        }
        subscribe(function (event) {
            if (!event.detail) {
                return;
            }
            switch (event.detail.type) {
                case 'SetSupportedHandlers':
                    supportedHandlers = new Set(event.detail.data.supportedHandlers);
            }
        });
        return {
            send: sendPromise,
            sendPromise: sendPromise,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            supports: supports,
            supportsAsync: supportsAsync,
            isWebView: isWebView,
            isIframe: isIframe,
            isEmbedded: isEmbedded,
            isStandalone: isStandalone,
        };
    }
});
define("core/package", [], {
    "name": "@vkontakte/vk-bridge",
    "version": "2.15.10",
    "description": "Connects a Mini App with VK client",
    "license": "MIT",
    "main": "dist/index.js",
    "browser": "dist/index.umd.js",
    "module": "dist/index.es.js",
    "umdName": "vkBridge",
    "types": "dist/types/src/index.d.ts",
    "typesVersions": {
        "<4.0": {
            "*": [
                "dist/types3.8.3/src/index.d.ts"
            ]
        }
    },
    "files": [
        "dist"
    ],
    "scripts": {
        "watch": "yarn run --top-level rollup -c -w",
        "build": "NODE_ENV=production yarn run --top-level rollup -c && yarn run build:legacy-types",
        "build:legacy-types": "yarn run --top-level rollup -c rollup.config-legacy-types.mjs >/dev/null",
        "prepack": "yarn run build",
        "test": "yarn run --top-level jest --config ../../jest.config.js"
    },
    "author": {
        "name": "VK",
        "url": "https://vk.ru"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/VKCOM/vk-bridge",
        "directory": "packages/core"
    }
});
define("core/src/types/deprecated", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/src/parseURLSearchParamsForGetLaunchParams", ["require", "exports", "core/src/types/data"], function (require, exports, data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseURLSearchParamsForGetLaunchParams = void 0;
    /**
     * @see https://dev.vk.ru/mini-apps/development/launch-params
     */
    var parseURLSearchParamsForGetLaunchParams = function (searchParams) {
        var launchParams = {};
        try {
            var parsedSearchParams = new URLSearchParams(searchParams);
            var convertToggleStateFromStringToNumber_1 = function (value) {
                switch (value) {
                    case '0':
                        return 0;
                    case '1':
                        return 1;
                    default:
                        return undefined;
                }
            };
            parsedSearchParams.forEach(function (value, query) {
                switch (query) {
                    case 'vk_ts':
                    case 'vk_is_recommended':
                    case 'vk_profile_id':
                    case 'vk_has_profile_button':
                    case 'vk_testing_group_id':
                    case 'vk_user_id':
                    case 'vk_app_id':
                    case 'vk_group_id':
                        launchParams[query] = Number(value);
                        break;
                    case 'sign':
                    case 'vk_chat_id':
                    case 'vk_ref':
                    case 'vk_access_token_settings':
                        launchParams[query] = value;
                        break;
                    case 'odr_enabled':
                        launchParams['odr_enabled'] = value === '1' ? 1 : undefined;
                        break;
                    case 'vk_is_app_user':
                    case 'vk_are_notifications_enabled':
                    case 'vk_is_favorite': {
                        launchParams[query] = convertToggleStateFromStringToNumber_1(value);
                        break;
                    }
                    case 'vk_language': {
                        var validateVKLanguage = function (value) {
                            return Object.values(data_1.EGetLaunchParamsResponseLanguages).some(function (i) { return i === value; });
                        };
                        launchParams['vk_language'] = validateVKLanguage(value) ? value : undefined;
                        break;
                    }
                    case 'vk_viewer_group_role': {
                        var validateVKViewerGroupRole = function (value) {
                            return Object.values(data_1.EGetLaunchParamsResponseGroupRole).some(function (i) { return i === value; });
                        };
                        launchParams['vk_viewer_group_role'] = validateVKViewerGroupRole(value)
                            ? value
                            : undefined;
                        break;
                    }
                    case 'vk_platform': {
                        var validateVKPlatform = function (value) {
                            return Object.values(data_1.EGetLaunchParamsResponsePlatforms).some(function (i) { return i === value; });
                        };
                        launchParams['vk_platform'] = validateVKPlatform(value) ? value : undefined;
                        break;
                    }
                }
            });
        }
        catch (e) {
            console.warn(e);
        }
        return launchParams;
    };
    exports.parseURLSearchParamsForGetLaunchParams = parseURLSearchParamsForGetLaunchParams;
});
define("core/src/index", ["require", "exports", "core/src/bridge", "core/package", "core/src/types/data", "core/src/types/bridge", "core/src/types/middleware", "core/src/types/deprecated", "core/src/applyMiddleware", "core/src/parseURLSearchParamsForGetLaunchParams"], function (require, exports, bridge_1, package_json_1, data_2, bridge_2, middleware_1, deprecated_1, applyMiddleware_1, parseURLSearchParamsForGetLaunchParams_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports.parseURLSearchParamsForGetLaunchParams = exports.applyMiddleware = void 0;
    // VK Bridge API
    var bridge = (0, bridge_1.createVKBridge)(package_json_1.version);
    exports.default = bridge;
    // Export typings
    __exportStar(data_2, exports);
    __exportStar(bridge_2, exports);
    __exportStar(middleware_1, exports);
    __exportStar(deprecated_1, exports);
    Object.defineProperty(exports, "applyMiddleware", { enumerable: true, get: function () { return applyMiddleware_1.applyMiddleware; } });
    Object.defineProperty(exports, "parseURLSearchParamsForGetLaunchParams", { enumerable: true, get: function () { return parseURLSearchParamsForGetLaunchParams_1.parseURLSearchParamsForGetLaunchParams; } });
});
define("core/src/browser", ["require", "exports", "core/src/index"], function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    index_1 = __importDefault(index_1);
    // @ts-ignore
    window.vkBridge = window.vkConnect = index_1.default;
});
define("core/src/parseSearchParamsForGetLaunchParams.test", ["require", "exports", "core/src/parseURLSearchParamsForGetLaunchParams"], function (require, exports, parseURLSearchParamsForGetLaunchParams_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('parseLaunchParamsByURL', function () {
        it('should return the vk_language field if it valid', function () {
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('vk_language=ru')).toEqual({
                vk_language: 'ru',
            });
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('vk_language=unknown')).toEqual({
                vk_language: undefined,
            });
        });
        it('should return the vk_viewer_group_role field if it valid', function () {
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('vk_viewer_group_role=admin')).toEqual({
                vk_viewer_group_role: 'admin',
            });
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('vk_viewer_group_role=unknown')).toEqual({
                vk_viewer_group_role: undefined,
            });
        });
        it('should return the vk_platform field if it valid', function () {
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('vk_platform=desktop_web')).toEqual({
                vk_platform: 'desktop_web',
            });
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('vk_platform=unknown')).toEqual({
                vk_platform: undefined,
            });
        });
        it('should return converted toggle state from string to number if it valid', function () {
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('vk_is_app_user=0&vk_are_notifications_enabled=0&vk_is_favorite=0')).toEqual({
                vk_is_app_user: 0,
                vk_are_notifications_enabled: 0,
                vk_is_favorite: 0,
            });
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('vk_is_app_user=1&vk_are_notifications_enabled=1&vk_is_favorite=1')).toEqual({
                vk_is_app_user: 1,
                vk_are_notifications_enabled: 1,
                vk_is_favorite: 1,
            });
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('vk_is_app_user=3&vk_are_notifications_enabled=3&vk_is_favorite=3')).toEqual({
                vk_is_app_user: undefined,
                vk_are_notifications_enabled: undefined,
                vk_is_favorite: undefined,
            });
        });
        it('should return converted to number value', function () {
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('vk_ts=123&vk_is_recommended=456&vk_profile_id=789&vk_has_profile_button=101&vk_testing_group_id=102&vk_user_id=103&vk_app_id=104&vk_group_id=105')).toEqual({
                vk_ts: 123,
                vk_is_recommended: 456,
                vk_profile_id: 789,
                vk_has_profile_button: 101,
                vk_testing_group_id: 102,
                vk_user_id: 103,
                vk_app_id: 104,
                vk_group_id: 105,
            });
        });
        it('should return value as is', function () {
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('sign=some_sign123&vk_chat_id=some_vk_chat_id123&vk_ref=some_vk_ref123&vk_access_token_settings=some_vk_access_token_settings123')).toEqual({
                sign: 'some_sign123',
                vk_chat_id: 'some_vk_chat_id123',
                vk_ref: 'some_vk_ref123',
                vk_access_token_settings: 'some_vk_access_token_settings123',
            });
        });
        // see https://dev.vk.ru/mini-apps/development/launch-params?vk_are_notifications_enabled=1#odr_enabled
        it('should return 1 or undefined', function () {
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('odr_enabled=1')).toEqual({
                odr_enabled: 1,
            });
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('odr_enabled=0')).toEqual({
                odr_enabled: undefined,
            });
            expect((0, parseURLSearchParamsForGetLaunchParams_2.parseURLSearchParamsForGetLaunchParams)('odr_enabled=unknown')).toEqual({
                odr_enabled: undefined,
            });
        });
    });
});
define("core/tests/dist.test", ["require", "exports", "@vkontakte/vk-bridge"], function (require, exports, vk_bridge_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vk_bridge_1 = __importStar(vk_bridge_1);
    var _a = require('../dist/index.umd'), applyMiddlewareUmd = _a.applyMiddleware, bridgeUmd = _a.default;
    var _b = require('../dist/index'), applyMiddlewareCmj = _b.applyMiddleware, bridgeCmj = _b.default;
    test('Valid esm export', function () {
        expect(typeof vk_bridge_1.default.send).toBe('function');
        expect(typeof vk_bridge_1.default.subscribe).toBe('function');
        expect(typeof vk_bridge_1.default.unsubscribe).toBe('function');
        expect(typeof vk_bridge_1.default.supports).toBe('function');
        expect(typeof vk_bridge_1.default.isWebView).toBe('function');
        expect(typeof vk_bridge_1.applyMiddleware).toBe('function');
        expect(typeof (0, vk_bridge_1.applyMiddleware)()(vk_bridge_1.default).send).toBe('function');
    });
    test('Valid umd export', function () {
        expect(typeof bridgeUmd.send).toBe('function');
        expect(typeof bridgeUmd.subscribe).toBe('function');
        expect(typeof bridgeUmd.unsubscribe).toBe('function');
        expect(typeof bridgeUmd.supports).toBe('function');
        expect(typeof bridgeUmd.isWebView).toBe('function');
        expect(typeof applyMiddlewareUmd).toBe('function');
        expect(typeof applyMiddlewareUmd()(bridgeUmd).send).toBe('function');
    });
    test('Valid commonjs export', function () {
        expect(typeof bridgeCmj.send).toBe('function');
        expect(typeof bridgeCmj.subscribe).toBe('function');
        expect(typeof bridgeCmj.unsubscribe).toBe('function');
        expect(typeof bridgeCmj.supports).toBe('function');
        expect(typeof bridgeCmj.isWebView).toBe('function');
        expect(typeof applyMiddlewareCmj).toBe('function');
        expect(typeof applyMiddlewareCmj()(bridgeCmj).send).toBe('function');
    });
});
define("react/src/lib/react/useIsomorphicLayoutEffect", ["require", "exports", "react"], function (require, exports, react_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useIsomorphicLayoutEffect = void 0;
    exports.useIsomorphicLayoutEffect = typeof window !== 'undefined' ? react_1.useLayoutEffect : react_1.useEffect;
});
define("react/src/lib/react/index", ["require", "exports", "react/src/lib/react/useIsomorphicLayoutEffect"], function (require, exports, useIsomorphicLayoutEffect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useIsomorphicLayoutEffect = void 0;
    Object.defineProperty(exports, "useIsomorphicLayoutEffect", { enumerable: true, get: function () { return useIsomorphicLayoutEffect_1.useIsomorphicLayoutEffect; } });
});
define("react/src/hooks/useAdaptivity", ["require", "exports", "react", "@vkontakte/vk-bridge", "react/src/lib/react/index"], function (require, exports, react_2, vk_bridge_2, react_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useAdaptivity = void 0;
    vk_bridge_2 = __importDefault(vk_bridge_2);
    var initialState = {
        type: null,
        viewportWidth: 0,
        viewportHeight: 0,
    };
    var useAdaptivity = function () {
        var _a = (0, react_2.useState)(initialState), bridgeAdaptivity = _a[0], setBridgeAdaptivity = _a[1];
        (0, react_3.useIsomorphicLayoutEffect)(function () {
            var updateAdaptivity = function (data) {
                if (!('viewport_width' in data) || !('viewport_height' in data)) {
                    return;
                }
                var newAdaptivity = resolveAdaptivity(data);
                if (newAdaptivity) {
                    setBridgeAdaptivity(newAdaptivity);
                }
            };
            var handleBridgeEvent = function (event) {
                var _a = event.detail, type = _a.type, data = _a.data;
                if (type !== 'VKWebAppUpdateConfig') {
                    return;
                }
                updateAdaptivity(data);
            };
            vk_bridge_2.default.subscribe(handleBridgeEvent);
            vk_bridge_2.default.send('VKWebAppGetConfig').then(updateAdaptivity).catch(console.error);
            return function () {
                vk_bridge_2.default.unsubscribe(handleBridgeEvent);
            };
        }, []);
        return bridgeAdaptivity;
    };
    exports.useAdaptivity = useAdaptivity;
    function resolveAdaptivity(data) {
        var adaptivity = data.adaptivity, viewport_width = data.viewport_width, viewport_height = data.viewport_height;
        var bridgeAdaptivity = {
            type: null,
            viewportWidth: isFinite(viewport_width) ? Number(viewport_width) : 0,
            viewportHeight: isFinite(viewport_height) ? Number(viewport_height) : 0,
        };
        switch (adaptivity) {
            case 'force_mobile':
            case 'force_mobile_compact':
            case 'adaptive':
                bridgeAdaptivity.type = adaptivity;
        }
        return bridgeAdaptivity;
    }
});
define("react/src/hooks/useApperance", ["require", "exports", "react", "@vkontakte/vk-bridge", "react/src/lib/react/index"], function (require, exports, react_4, vk_bridge_3, react_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useAppearance = void 0;
    vk_bridge_3 = __importDefault(vk_bridge_3);
    /**
     * Note: it works only for "embedded" app mode.
     */
    var useAppearance = function () {
        var _a = (0, react_4.useState)(null), appearance = _a[0], setAppearance = _a[1];
        (0, react_5.useIsomorphicLayoutEffect)(function () {
            if (!vk_bridge_3.default.isEmbedded()) {
                return;
            }
            var updateAppearance = function (data) {
                var initialAppearance = resolveAppearance(data);
                if (initialAppearance) {
                    setAppearance(initialAppearance);
                }
            };
            var handleBridgeEvent = function (event) {
                var _a = event.detail, type = _a.type, data = _a.data;
                if (type !== 'VKWebAppUpdateConfig' || !('appearance' in data) || !('scheme' in data)) {
                    return;
                }
                updateAppearance(data);
            };
            vk_bridge_3.default.subscribe(handleBridgeEvent);
            vk_bridge_3.default.send('VKWebAppGetConfig').then(updateAppearance).catch(console.error);
            return function () { return vk_bridge_3.default.unsubscribe(handleBridgeEvent); };
        }, []);
        return appearance;
    };
    exports.useAppearance = useAppearance;
    function resolveAppearance(_a) {
        var scheme = _a.scheme, appearance = _a.appearance;
        if (appearance) {
            return appearance;
        }
        return scheme === 'space_gray' || scheme === 'vkcom_dark' ? 'dark' : 'light';
    }
});
define("react/src/hooks/useInsets", ["require", "exports", "react", "@vkontakte/vk-bridge", "react/src/lib/react/index"], function (require, exports, react_6, vk_bridge_4, react_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useInsets = void 0;
    vk_bridge_4 = __importDefault(vk_bridge_4);
    var VIRTUAL_KEYBOARD_HEIGHT = 150;
    var BOTTOM_INSET_FOR_VIRTUAL_KEYBOARD = 0;
    var useInsets = function () {
        var _a = (0, react_6.useState)(null), insets = _a[0], setInsets = _a[1];
        (0, react_7.useIsomorphicLayoutEffect)(function () {
            var handleBridgeEvent = function (event) {
                var insets = resolveInsets(event);
                if (insets) {
                    setInsets(insets);
                }
            };
            vk_bridge_4.default.subscribe(handleBridgeEvent);
            return function () {
                vk_bridge_4.default.unsubscribe(handleBridgeEvent);
            };
        }, []);
        return insets;
    };
    exports.useInsets = useInsets;
    function resolveInsets(event) {
        var _a = event.detail, type = _a.type, data = _a.data;
        switch (type) {
            case 'VKWebAppUpdateInsets': // TODO [>=3]: it is legacy, remove it
            case 'VKWebAppUpdateConfig':
                if (!('insets' in data)) {
                    return null;
                }
                var insets = data.insets;
                if (insets) {
                    return __assign(__assign({}, insets), { bottom: insets.bottom > VIRTUAL_KEYBOARD_HEIGHT
                            ? BOTTOM_INSET_FOR_VIRTUAL_KEYBOARD
                            : insets.bottom });
                }
        }
        return null;
    }
});
define("react/src/functions/runTapticImpactOccurred", ["require", "exports", "@vkontakte/vk-bridge"], function (require, exports, vk_bridge_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runTapticImpactOccurredAsync = runTapticImpactOccurredAsync;
    exports.runTapticImpactOccurred = runTapticImpactOccurred;
    vk_bridge_5 = __importDefault(vk_bridge_5);
    /**
     * Dispatch device vibration if supported.
     *
     * @param style - The strength of the vibration feedback.
     * @returns A Promise that resolves to `true` if the vibration was triggered, or `false` if not supported.
     */
    function runTapticImpactOccurredAsync(style) {
        return __awaiter(this, void 0, void 0, function () {
            var supported;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, vk_bridge_5.default.supportsAsync('VKWebAppTapticImpactOccurred')];
                    case 1:
                        supported = _a.sent();
                        if (supported) {
                            vk_bridge_5.default.send('VKWebAppTapticImpactOccurred', { style: style }).catch(function () { return undefined; });
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    }
    /**
     * @deprecated Use {@link runTapticImpactOccurredAsync} instead.
     * Dispatch device vibration if supported.
     *
     * Return `false` if not supported.
     */
    function runTapticImpactOccurred(style) {
        if (vk_bridge_5.default.supports('VKWebAppTapticImpactOccurred')) {
            vk_bridge_5.default.send('VKWebAppTapticImpactOccurred', { style: style }).catch(function () { return undefined; });
            return true;
        }
        return false;
    }
});
define("react/src/index", ["require", "exports", "react/src/hooks/useAdaptivity", "react/src/hooks/useApperance", "react/src/hooks/useInsets", "react/src/functions/runTapticImpactOccurred"], function (require, exports, useAdaptivity_1, useApperance_1, useInsets_1, runTapticImpactOccurred_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runTapticImpactOccurred = exports.useInsets = exports.useAppearance = exports.useAdaptivity = void 0;
    Object.defineProperty(exports, "useAdaptivity", { enumerable: true, get: function () { return useAdaptivity_1.useAdaptivity; } });
    Object.defineProperty(exports, "useAppearance", { enumerable: true, get: function () { return useApperance_1.useAppearance; } });
    Object.defineProperty(exports, "useInsets", { enumerable: true, get: function () { return useInsets_1.useInsets; } });
    Object.defineProperty(exports, "runTapticImpactOccurred", { enumerable: true, get: function () { return runTapticImpactOccurred_1.runTapticImpactOccurred; } });
});
//# sourceMappingURL=vkbridge.js.map