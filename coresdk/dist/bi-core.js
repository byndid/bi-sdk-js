(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["coresdk"] = factory();
	else
		root["coresdk"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/backoffController.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-datafile-manager/lib/backoffController.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * Copyright 2019-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var config_1 = __webpack_require__(/*! ./config */ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/config.js");
function randomMilliseconds() {
    return Math.round(Math.random() * 1000);
}
var BackoffController = /** @class */ (function () {
    function BackoffController() {
        this.errorCount = 0;
    }
    BackoffController.prototype.getDelay = function () {
        if (this.errorCount === 0) {
            return 0;
        }
        var baseWaitSeconds = config_1.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT[Math.min(config_1.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT.length - 1, this.errorCount)];
        return baseWaitSeconds * 1000 + randomMilliseconds();
    };
    BackoffController.prototype.countError = function () {
        if (this.errorCount < config_1.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT.length - 1) {
            this.errorCount++;
        }
    };
    BackoffController.prototype.reset = function () {
        this.errorCount = 0;
    };
    return BackoffController;
}());
exports["default"] = BackoffController;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/browserDatafileManager.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-datafile-manager/lib/browserDatafileManager.js ***!
  \****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var browserRequest_1 = __webpack_require__(/*! ./browserRequest */ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/browserRequest.js");
var httpPollingDatafileManager_1 = __importDefault(__webpack_require__(/*! ./httpPollingDatafileManager */ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/httpPollingDatafileManager.js"));
var BrowserDatafileManager = /** @class */ (function (_super) {
    __extends(BrowserDatafileManager, _super);
    function BrowserDatafileManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrowserDatafileManager.prototype.makeGetRequest = function (reqUrl, headers) {
        return browserRequest_1.makeGetRequest(reqUrl, headers);
    };
    BrowserDatafileManager.prototype.getConfigDefaults = function () {
        return {
            autoUpdate: false,
        };
    };
    return BrowserDatafileManager;
}(httpPollingDatafileManager_1.default));
exports["default"] = BrowserDatafileManager;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/browserRequest.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-datafile-manager/lib/browserRequest.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * Copyright 2019-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var config_1 = __webpack_require__(/*! ./config */ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/config.js");
var js_sdk_logging_1 = __webpack_require__(/*! @optimizely/js-sdk-logging */ "./node_modules/@optimizely/js-sdk-logging/lib/index.js");
var logger = js_sdk_logging_1.getLogger('DatafileManager');
var GET_METHOD = 'GET';
var READY_STATE_DONE = 4;
function parseHeadersFromXhr(req) {
    var allHeadersString = req.getAllResponseHeaders();
    if (allHeadersString === null) {
        return {};
    }
    var headerLines = allHeadersString.split('\r\n');
    var headers = {};
    headerLines.forEach(function (headerLine) {
        var separatorIndex = headerLine.indexOf(': ');
        if (separatorIndex > -1) {
            var headerName = headerLine.slice(0, separatorIndex);
            var headerValue = headerLine.slice(separatorIndex + 2);
            if (headerValue.length > 0) {
                headers[headerName] = headerValue;
            }
        }
    });
    return headers;
}
function setHeadersInXhr(headers, req) {
    Object.keys(headers).forEach(function (headerName) {
        var header = headers[headerName];
        req.setRequestHeader(headerName, header);
    });
}
function makeGetRequest(reqUrl, headers) {
    var req = new XMLHttpRequest();
    var responsePromise = new Promise(function (resolve, reject) {
        req.open(GET_METHOD, reqUrl, true);
        setHeadersInXhr(headers, req);
        req.onreadystatechange = function () {
            if (req.readyState === READY_STATE_DONE) {
                var statusCode = req.status;
                if (statusCode === 0) {
                    reject(new Error('Request error'));
                    return;
                }
                var headers_1 = parseHeadersFromXhr(req);
                var resp = {
                    statusCode: req.status,
                    body: req.responseText,
                    headers: headers_1,
                };
                resolve(resp);
            }
        };
        req.timeout = config_1.REQUEST_TIMEOUT_MS;
        req.ontimeout = function () {
            logger.error('Request timed out');
        };
        req.send();
    });
    return {
        responsePromise: responsePromise,
        abort: function () {
            req.abort();
        },
    };
}
exports.makeGetRequest = makeGetRequest;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/config.js":
/*!************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-datafile-manager/lib/config.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Copyright 2019-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
exports.MIN_UPDATE_INTERVAL = 1000;
exports.DEFAULT_URL_TEMPLATE = "https://cdn.optimizely.com/datafiles/%s.json";
exports.DEFAULT_AUTHENTICATED_URL_TEMPLATE = "https://config.optimizely.com/datafiles/auth/%s.json";
exports.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT = [0, 8, 16, 32, 64, 128, 256, 512];
exports.REQUEST_TIMEOUT_MS = 60 * 1000; // 1 minute


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/eventEmitter.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-datafile-manager/lib/eventEmitter.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Copyright 2019-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.listeners = {};
        this.listenerId = 1;
    }
    EventEmitter.prototype.on = function (eventName, listener) {
        var _this = this;
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = {};
        }
        var currentListenerId = String(this.listenerId);
        this.listenerId++;
        this.listeners[eventName][currentListenerId] = listener;
        return function () {
            if (_this.listeners[eventName]) {
                delete _this.listeners[eventName][currentListenerId];
            }
        };
    };
    EventEmitter.prototype.emit = function (eventName, arg) {
        var listeners = this.listeners[eventName];
        if (listeners) {
            Object.keys(listeners).forEach(function (listenerId) {
                var listener = listeners[listenerId];
                listener(arg);
            });
        }
    };
    EventEmitter.prototype.removeAllListeners = function () {
        this.listeners = {};
    };
    return EventEmitter;
}());
exports["default"] = EventEmitter;
// TODO: Create a typed event emitter for use in TS only (not JS)


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/httpPollingDatafileManager.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-datafile-manager/lib/httpPollingDatafileManager.js ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var js_sdk_logging_1 = __webpack_require__(/*! @optimizely/js-sdk-logging */ "./node_modules/@optimizely/js-sdk-logging/lib/index.js");
var js_sdk_utils_1 = __webpack_require__(/*! @optimizely/js-sdk-utils */ "./node_modules/@optimizely/js-sdk-utils/lib/index.js");
var eventEmitter_1 = __importDefault(__webpack_require__(/*! ./eventEmitter */ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/eventEmitter.js"));
var config_1 = __webpack_require__(/*! ./config */ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/config.js");
var backoffController_1 = __importDefault(__webpack_require__(/*! ./backoffController */ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/backoffController.js"));
var logger = js_sdk_logging_1.getLogger('DatafileManager');
var UPDATE_EVT = 'update';
function isValidUpdateInterval(updateInterval) {
    return updateInterval >= config_1.MIN_UPDATE_INTERVAL;
}
function isSuccessStatusCode(statusCode) {
    return statusCode >= 200 && statusCode < 400;
}
var noOpKeyValueCache = {
    get: function () {
        return Promise.resolve('');
    },
    set: function () {
        return Promise.resolve();
    },
    contains: function () {
        return Promise.resolve(false);
    },
    remove: function () {
        return Promise.resolve();
    },
};
var HttpPollingDatafileManager = /** @class */ (function () {
    function HttpPollingDatafileManager(config) {
        var _this = this;
        var configWithDefaultsApplied = __assign(__assign({}, this.getConfigDefaults()), config);
        var datafile = configWithDefaultsApplied.datafile, _a = configWithDefaultsApplied.autoUpdate, autoUpdate = _a === void 0 ? false : _a, sdkKey = configWithDefaultsApplied.sdkKey, _b = configWithDefaultsApplied.updateInterval, updateInterval = _b === void 0 ? config_1.DEFAULT_UPDATE_INTERVAL : _b, _c = configWithDefaultsApplied.urlTemplate, urlTemplate = _c === void 0 ? config_1.DEFAULT_URL_TEMPLATE : _c, _d = configWithDefaultsApplied.cache, cache = _d === void 0 ? noOpKeyValueCache : _d;
        this.cache = cache;
        this.cacheKey = 'opt-datafile-' + sdkKey;
        this.isReadyPromiseSettled = false;
        this.readyPromiseResolver = function () { };
        this.readyPromiseRejecter = function () { };
        this.readyPromise = new Promise(function (resolve, reject) {
            _this.readyPromiseResolver = resolve;
            _this.readyPromiseRejecter = reject;
        });
        if (datafile) {
            this.currentDatafile = datafile;
            if (!sdkKey) {
                this.resolveReadyPromise();
            }
        }
        else {
            this.currentDatafile = '';
        }
        this.isStarted = false;
        this.datafileUrl = js_sdk_utils_1.sprintf(urlTemplate, sdkKey);
        this.emitter = new eventEmitter_1.default();
        this.autoUpdate = autoUpdate;
        if (isValidUpdateInterval(updateInterval)) {
            this.updateInterval = updateInterval;
        }
        else {
            logger.warn('Invalid updateInterval %s, defaulting to %s', updateInterval, config_1.DEFAULT_UPDATE_INTERVAL);
            this.updateInterval = config_1.DEFAULT_UPDATE_INTERVAL;
        }
        this.currentTimeout = null;
        this.currentRequest = null;
        this.backoffController = new backoffController_1.default();
        this.syncOnCurrentRequestComplete = false;
    }
    HttpPollingDatafileManager.prototype.get = function () {
        return this.currentDatafile;
    };
    HttpPollingDatafileManager.prototype.start = function () {
        if (!this.isStarted) {
            logger.debug('Datafile manager started');
            this.isStarted = true;
            this.backoffController.reset();
            this.setDatafileFromCacheIfAvailable();
            this.syncDatafile();
        }
    };
    HttpPollingDatafileManager.prototype.stop = function () {
        logger.debug('Datafile manager stopped');
        this.isStarted = false;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
        this.emitter.removeAllListeners();
        if (this.currentRequest) {
            this.currentRequest.abort();
            this.currentRequest = null;
        }
        return Promise.resolve();
    };
    HttpPollingDatafileManager.prototype.onReady = function () {
        return this.readyPromise;
    };
    HttpPollingDatafileManager.prototype.on = function (eventName, listener) {
        return this.emitter.on(eventName, listener);
    };
    HttpPollingDatafileManager.prototype.onRequestRejected = function (err) {
        if (!this.isStarted) {
            return;
        }
        this.backoffController.countError();
        if (err instanceof Error) {
            logger.error('Error fetching datafile: %s', err.message, err);
        }
        else if (typeof err === 'string') {
            logger.error('Error fetching datafile: %s', err);
        }
        else {
            logger.error('Error fetching datafile');
        }
    };
    HttpPollingDatafileManager.prototype.onRequestResolved = function (response) {
        if (!this.isStarted) {
            return;
        }
        if (typeof response.statusCode !== 'undefined' && isSuccessStatusCode(response.statusCode)) {
            this.backoffController.reset();
        }
        else {
            this.backoffController.countError();
        }
        this.trySavingLastModified(response.headers);
        var datafile = this.getNextDatafileFromResponse(response);
        if (datafile !== '') {
            logger.info('Updating datafile from response');
            this.currentDatafile = datafile;
            this.cache.set(this.cacheKey, datafile);
            if (!this.isReadyPromiseSettled) {
                this.resolveReadyPromise();
            }
            else {
                var datafileUpdate = {
                    datafile: datafile,
                };
                this.emitter.emit(UPDATE_EVT, datafileUpdate);
            }
        }
    };
    HttpPollingDatafileManager.prototype.onRequestComplete = function () {
        if (!this.isStarted) {
            return;
        }
        this.currentRequest = null;
        if (!this.isReadyPromiseSettled && !this.autoUpdate) {
            // We will never resolve ready, so reject it
            this.rejectReadyPromise(new Error('Failed to become ready'));
        }
        if (this.autoUpdate && this.syncOnCurrentRequestComplete) {
            this.syncDatafile();
        }
        this.syncOnCurrentRequestComplete = false;
    };
    HttpPollingDatafileManager.prototype.syncDatafile = function () {
        var _this = this;
        var headers = {};
        if (this.lastResponseLastModified) {
            headers['if-modified-since'] = this.lastResponseLastModified;
        }
        logger.debug('Making datafile request to url %s with headers: %s', this.datafileUrl, function () { return JSON.stringify(headers); });
        this.currentRequest = this.makeGetRequest(this.datafileUrl, headers);
        var onRequestComplete = function () {
            _this.onRequestComplete();
        };
        var onRequestResolved = function (response) {
            _this.onRequestResolved(response);
        };
        var onRequestRejected = function (err) {
            _this.onRequestRejected(err);
        };
        this.currentRequest.responsePromise
            .then(onRequestResolved, onRequestRejected)
            .then(onRequestComplete, onRequestComplete);
        if (this.autoUpdate) {
            this.scheduleNextUpdate();
        }
    };
    HttpPollingDatafileManager.prototype.resolveReadyPromise = function () {
        this.readyPromiseResolver();
        this.isReadyPromiseSettled = true;
    };
    HttpPollingDatafileManager.prototype.rejectReadyPromise = function (err) {
        this.readyPromiseRejecter(err);
        this.isReadyPromiseSettled = true;
    };
    HttpPollingDatafileManager.prototype.scheduleNextUpdate = function () {
        var _this = this;
        var currentBackoffDelay = this.backoffController.getDelay();
        var nextUpdateDelay = Math.max(currentBackoffDelay, this.updateInterval);
        logger.debug('Scheduling sync in %s ms', nextUpdateDelay);
        this.currentTimeout = setTimeout(function () {
            if (_this.currentRequest) {
                _this.syncOnCurrentRequestComplete = true;
            }
            else {
                _this.syncDatafile();
            }
        }, nextUpdateDelay);
    };
    HttpPollingDatafileManager.prototype.getNextDatafileFromResponse = function (response) {
        logger.debug('Response status code: %s', response.statusCode);
        if (typeof response.statusCode === 'undefined') {
            return '';
        }
        if (response.statusCode === 304) {
            return '';
        }
        if (isSuccessStatusCode(response.statusCode)) {
            return response.body;
        }
        return '';
    };
    HttpPollingDatafileManager.prototype.trySavingLastModified = function (headers) {
        var lastModifiedHeader = headers['last-modified'] || headers['Last-Modified'];
        if (typeof lastModifiedHeader !== 'undefined') {
            this.lastResponseLastModified = lastModifiedHeader;
            logger.debug('Saved last modified header value from response: %s', this.lastResponseLastModified);
        }
    };
    HttpPollingDatafileManager.prototype.setDatafileFromCacheIfAvailable = function () {
        var _this = this;
        this.cache.get(this.cacheKey).then(function (datafile) {
            if (_this.isStarted && !_this.isReadyPromiseSettled && datafile !== '') {
                logger.debug('Using datafile from cache');
                _this.currentDatafile = datafile;
                _this.resolveReadyPromise();
            }
        });
    };
    return HttpPollingDatafileManager;
}());
exports["default"] = HttpPollingDatafileManager;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/index.browser.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-datafile-manager/lib/index.browser.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * Copyright 2019-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var browserDatafileManager_1 = __webpack_require__(/*! ./browserDatafileManager */ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/browserDatafileManager.js");
exports.HttpPollingDatafileManager = browserDatafileManager_1.default;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/eventDispatcher.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/eventDispatcher.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/eventProcessor.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/eventProcessor.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendEventNotification = exports.getQueue = exports.validateAndGetBatchSize = exports.validateAndGetFlushInterval = exports.DEFAULT_BATCH_SIZE = exports.DEFAULT_FLUSH_INTERVAL = void 0;
var eventQueue_1 = __webpack_require__(/*! ./eventQueue */ "./node_modules/@optimizely/js-sdk-event-processor/lib/eventQueue.js");
var js_sdk_logging_1 = __webpack_require__(/*! @optimizely/js-sdk-logging */ "./node_modules/@optimizely/js-sdk-logging/lib/index.js");
var js_sdk_utils_1 = __webpack_require__(/*! @optimizely/js-sdk-utils */ "./node_modules/@optimizely/js-sdk-utils/lib/index.js");
exports.DEFAULT_FLUSH_INTERVAL = 30000; // Unit is ms - default flush interval is 30s
exports.DEFAULT_BATCH_SIZE = 10;
var logger = js_sdk_logging_1.getLogger('EventProcessor');
function validateAndGetFlushInterval(flushInterval) {
    if (flushInterval <= 0) {
        logger.warn("Invalid flushInterval " + flushInterval + ", defaulting to " + exports.DEFAULT_FLUSH_INTERVAL);
        flushInterval = exports.DEFAULT_FLUSH_INTERVAL;
    }
    return flushInterval;
}
exports.validateAndGetFlushInterval = validateAndGetFlushInterval;
function validateAndGetBatchSize(batchSize) {
    batchSize = Math.floor(batchSize);
    if (batchSize < 1) {
        logger.warn("Invalid batchSize " + batchSize + ", defaulting to " + exports.DEFAULT_BATCH_SIZE);
        batchSize = exports.DEFAULT_BATCH_SIZE;
    }
    batchSize = Math.max(1, batchSize);
    return batchSize;
}
exports.validateAndGetBatchSize = validateAndGetBatchSize;
function getQueue(batchSize, flushInterval, sink, batchComparator) {
    var queue;
    if (batchSize > 1) {
        queue = new eventQueue_1.DefaultEventQueue({
            flushInterval: flushInterval,
            maxQueueSize: batchSize,
            sink: sink,
            batchComparator: batchComparator,
        });
    }
    else {
        queue = new eventQueue_1.SingleEventQueue({ sink: sink });
    }
    return queue;
}
exports.getQueue = getQueue;
function sendEventNotification(notificationCenter, event) {
    if (notificationCenter) {
        notificationCenter.sendNotifications(js_sdk_utils_1.NOTIFICATION_TYPES.LOG_EVENT, event);
    }
}
exports.sendEventNotification = sendEventNotification;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/eventQueue.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/eventQueue.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultEventQueue = exports.SingleEventQueue = void 0;
var js_sdk_logging_1 = __webpack_require__(/*! @optimizely/js-sdk-logging */ "./node_modules/@optimizely/js-sdk-logging/lib/index.js");
var logger = js_sdk_logging_1.getLogger('EventProcessor');
var Timer = /** @class */ (function () {
    function Timer(_a) {
        var timeout = _a.timeout, callback = _a.callback;
        this.timeout = Math.max(timeout, 0);
        this.callback = callback;
    }
    Timer.prototype.start = function () {
        this.timeoutId = setTimeout(this.callback, this.timeout);
    };
    Timer.prototype.refresh = function () {
        this.stop();
        this.start();
    };
    Timer.prototype.stop = function () {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    };
    return Timer;
}());
var SingleEventQueue = /** @class */ (function () {
    function SingleEventQueue(_a) {
        var sink = _a.sink;
        this.sink = sink;
    }
    SingleEventQueue.prototype.start = function () {
        // no-op
    };
    SingleEventQueue.prototype.stop = function () {
        // no-op
        return Promise.resolve();
    };
    SingleEventQueue.prototype.enqueue = function (event) {
        this.sink([event]);
    };
    return SingleEventQueue;
}());
exports.SingleEventQueue = SingleEventQueue;
var DefaultEventQueue = /** @class */ (function () {
    function DefaultEventQueue(_a) {
        var flushInterval = _a.flushInterval, maxQueueSize = _a.maxQueueSize, sink = _a.sink, batchComparator = _a.batchComparator;
        this.buffer = [];
        this.maxQueueSize = Math.max(maxQueueSize, 1);
        this.sink = sink;
        this.batchComparator = batchComparator;
        this.timer = new Timer({
            callback: this.flush.bind(this),
            timeout: flushInterval,
        });
        this.started = false;
    }
    DefaultEventQueue.prototype.start = function () {
        this.started = true;
        // dont start the timer until the first event is enqueued
    };
    DefaultEventQueue.prototype.stop = function () {
        this.started = false;
        var result = this.sink(this.buffer);
        this.buffer = [];
        this.timer.stop();
        return result;
    };
    DefaultEventQueue.prototype.enqueue = function (event) {
        if (!this.started) {
            logger.warn('Queue is stopped, not accepting event');
            return;
        }
        // If new event cannot be included into the current batch, flush so it can
        // be in its own new batch.
        var bufferedEvent = this.buffer[0];
        if (bufferedEvent && !this.batchComparator(bufferedEvent, event)) {
            this.flush();
        }
        // start the timer when the first event is put in
        if (this.buffer.length === 0) {
            this.timer.refresh();
        }
        this.buffer.push(event);
        if (this.buffer.length >= this.maxQueueSize) {
            this.flush();
        }
    };
    DefaultEventQueue.prototype.flush = function () {
        this.sink(this.buffer);
        this.buffer = [];
        this.timer.stop();
    };
    return DefaultEventQueue;
}());
exports.DefaultEventQueue = DefaultEventQueue;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/events.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/events.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.areEventContextsEqual = void 0;
function areEventContextsEqual(eventA, eventB) {
    var contextA = eventA.context;
    var contextB = eventB.context;
    return (contextA.accountId === contextB.accountId &&
        contextA.projectId === contextB.projectId &&
        contextA.clientName === contextB.clientName &&
        contextA.clientVersion === contextB.clientVersion &&
        contextA.revision === contextB.revision &&
        contextA.anonymizeIP === contextB.anonymizeIP &&
        contextA.botFiltering === contextB.botFiltering);
}
exports.areEventContextsEqual = areEventContextsEqual;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/index.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./events */ "./node_modules/@optimizely/js-sdk-event-processor/lib/events.js"), exports);
__exportStar(__webpack_require__(/*! ./eventProcessor */ "./node_modules/@optimizely/js-sdk-event-processor/lib/eventProcessor.js"), exports);
__exportStar(__webpack_require__(/*! ./eventDispatcher */ "./node_modules/@optimizely/js-sdk-event-processor/lib/eventDispatcher.js"), exports);
__exportStar(__webpack_require__(/*! ./managed */ "./node_modules/@optimizely/js-sdk-event-processor/lib/managed.js"), exports);
__exportStar(__webpack_require__(/*! ./pendingEventsDispatcher */ "./node_modules/@optimizely/js-sdk-event-processor/lib/pendingEventsDispatcher.js"), exports);
__exportStar(__webpack_require__(/*! ./v1/buildEventV1 */ "./node_modules/@optimizely/js-sdk-event-processor/lib/v1/buildEventV1.js"), exports);
__exportStar(__webpack_require__(/*! ./v1/v1EventProcessor */ "./node_modules/@optimizely/js-sdk-event-processor/lib/v1/v1EventProcessor.js"), exports);


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/managed.js":
/*!************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/managed.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/pendingEventsDispatcher.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/pendingEventsDispatcher.js ***!
  \****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStoragePendingEventsDispatcher = exports.PendingEventsDispatcher = void 0;
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var js_sdk_logging_1 = __webpack_require__(/*! @optimizely/js-sdk-logging */ "./node_modules/@optimizely/js-sdk-logging/lib/index.js");
var pendingEventsStore_1 = __webpack_require__(/*! ./pendingEventsStore */ "./node_modules/@optimizely/js-sdk-event-processor/lib/pendingEventsStore.js");
var js_sdk_utils_1 = __webpack_require__(/*! @optimizely/js-sdk-utils */ "./node_modules/@optimizely/js-sdk-utils/lib/index.js");
var logger = js_sdk_logging_1.getLogger('EventProcessor');
var PendingEventsDispatcher = /** @class */ (function () {
    function PendingEventsDispatcher(_a) {
        var eventDispatcher = _a.eventDispatcher, store = _a.store;
        this.dispatcher = eventDispatcher;
        this.store = store;
    }
    PendingEventsDispatcher.prototype.dispatchEvent = function (request, callback) {
        this.send({
            uuid: js_sdk_utils_1.generateUUID(),
            timestamp: js_sdk_utils_1.getTimestamp(),
            request: request,
        }, callback);
    };
    PendingEventsDispatcher.prototype.sendPendingEvents = function () {
        var _this = this;
        var pendingEvents = this.store.values();
        logger.debug('Sending %s pending events from previous page', pendingEvents.length);
        pendingEvents.forEach(function (item) {
            try {
                _this.send(item, function () { });
            }
            catch (e) { }
        });
    };
    PendingEventsDispatcher.prototype.send = function (entry, callback) {
        var _this = this;
        this.store.set(entry.uuid, entry);
        this.dispatcher.dispatchEvent(entry.request, function (response) {
            _this.store.remove(entry.uuid);
            callback(response);
        });
    };
    return PendingEventsDispatcher;
}());
exports.PendingEventsDispatcher = PendingEventsDispatcher;
var LocalStoragePendingEventsDispatcher = /** @class */ (function (_super) {
    __extends(LocalStoragePendingEventsDispatcher, _super);
    function LocalStoragePendingEventsDispatcher(_a) {
        var eventDispatcher = _a.eventDispatcher;
        return _super.call(this, {
            eventDispatcher: eventDispatcher,
            store: new pendingEventsStore_1.LocalStorageStore({
                // TODO make this configurable
                maxValues: 100,
                key: 'fs_optly_pending_events',
            }),
        }) || this;
    }
    return LocalStoragePendingEventsDispatcher;
}(PendingEventsDispatcher));
exports.LocalStoragePendingEventsDispatcher = LocalStoragePendingEventsDispatcher;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/pendingEventsStore.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/pendingEventsStore.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStorageStore = void 0;
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var js_sdk_utils_1 = __webpack_require__(/*! @optimizely/js-sdk-utils */ "./node_modules/@optimizely/js-sdk-utils/lib/index.js");
var js_sdk_logging_1 = __webpack_require__(/*! @optimizely/js-sdk-logging */ "./node_modules/@optimizely/js-sdk-logging/lib/index.js");
var logger = js_sdk_logging_1.getLogger('EventProcessor');
var LocalStorageStore = /** @class */ (function () {
    function LocalStorageStore(_a) {
        var key = _a.key, _b = _a.maxValues, maxValues = _b === void 0 ? 1000 : _b;
        this.LS_KEY = key;
        this.maxValues = maxValues;
    }
    LocalStorageStore.prototype.get = function (key) {
        return this.getMap()[key] || null;
    };
    LocalStorageStore.prototype.set = function (key, value) {
        var map = this.getMap();
        map[key] = value;
        this.replace(map);
    };
    LocalStorageStore.prototype.remove = function (key) {
        var map = this.getMap();
        delete map[key];
        this.replace(map);
    };
    LocalStorageStore.prototype.values = function () {
        return js_sdk_utils_1.objectValues(this.getMap());
    };
    LocalStorageStore.prototype.clear = function () {
        this.replace({});
    };
    LocalStorageStore.prototype.replace = function (map) {
        try {
            // This is a temporary fix to support React Native which does not have localStorage.
            window.localStorage && localStorage.setItem(this.LS_KEY, JSON.stringify(map));
            this.clean();
        }
        catch (e) {
            logger.error(e);
        }
    };
    LocalStorageStore.prototype.clean = function () {
        var map = this.getMap();
        var keys = Object.keys(map);
        var toRemove = keys.length - this.maxValues;
        if (toRemove < 1) {
            return;
        }
        var entries = keys.map(function (key) { return ({
            key: key,
            value: map[key]
        }); });
        entries.sort(function (a, b) { return a.value.timestamp - b.value.timestamp; });
        for (var i = 0; i < toRemove; i++) {
            delete map[entries[i].key];
        }
        this.replace(map);
    };
    LocalStorageStore.prototype.getMap = function () {
        try {
            // This is a temporary fix to support React Native which does not have localStorage.
            var data = window.localStorage && localStorage.getItem(this.LS_KEY);
            if (data) {
                return JSON.parse(data) || {};
            }
        }
        catch (e) {
            logger.error(e);
        }
        return {};
    };
    return LocalStorageStore;
}());
exports.LocalStorageStore = LocalStorageStore;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/requestTracker.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/requestTracker.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Copyright 2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * RequestTracker keeps track of in-flight requests for EventProcessor using
 * an internal counter. It exposes methods for adding a new request to be
 * tracked, and getting a Promise representing the completion of currently
 * tracked requests.
 */
var RequestTracker = /** @class */ (function () {
    function RequestTracker() {
        this.reqsInFlightCount = 0;
        this.reqsCompleteResolvers = [];
    }
    /**
     * Track the argument request (represented by a Promise). reqPromise will feed
     * into the state of Promises returned by onRequestsComplete.
     * @param {Promise<void>} reqPromise
     */
    RequestTracker.prototype.trackRequest = function (reqPromise) {
        var _this = this;
        this.reqsInFlightCount++;
        var onReqComplete = function () {
            _this.reqsInFlightCount--;
            if (_this.reqsInFlightCount === 0) {
                _this.reqsCompleteResolvers.forEach(function (resolver) { return resolver(); });
                _this.reqsCompleteResolvers = [];
            }
        };
        reqPromise.then(onReqComplete, onReqComplete);
    };
    /**
     * Return a Promise that fulfills after all currently-tracked request promises
     * are resolved.
     * @return {Promise<void>}
     */
    RequestTracker.prototype.onRequestsComplete = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.reqsInFlightCount === 0) {
                resolve();
            }
            else {
                _this.reqsCompleteResolvers.push(resolve);
            }
        });
    };
    return RequestTracker;
}());
exports["default"] = RequestTracker;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/v1/buildEventV1.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/v1/buildEventV1.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formatEvents = exports.buildConversionEventV1 = exports.buildImpressionEventV1 = exports.makeBatchedEventV1 = void 0;
var ACTIVATE_EVENT_KEY = 'campaign_activated';
var CUSTOM_ATTRIBUTE_FEATURE_TYPE = 'custom';
var BOT_FILTERING_KEY = '$opt_bot_filtering';
/**
 * Given an array of batchable Decision or ConversionEvent events it returns
 * a single EventV1 with proper batching
 *
 * @param {ProcessableEvent[]} events
 * @returns {EventV1}
 */
function makeBatchedEventV1(events) {
    var visitors = [];
    var data = events[0];
    events.forEach(function (event) {
        if (event.type === 'conversion' || event.type === 'impression') {
            var visitor = makeVisitor(event);
            if (event.type === 'impression') {
                visitor.snapshots.push(makeDecisionSnapshot(event));
            }
            else if (event.type === 'conversion') {
                visitor.snapshots.push(makeConversionSnapshot(event));
            }
            visitors.push(visitor);
        }
    });
    return {
        client_name: data.context.clientName,
        client_version: data.context.clientVersion,
        account_id: data.context.accountId,
        project_id: data.context.projectId,
        revision: data.context.revision,
        anonymize_ip: data.context.anonymizeIP,
        enrich_decisions: true,
        visitors: visitors,
    };
}
exports.makeBatchedEventV1 = makeBatchedEventV1;
function makeConversionSnapshot(conversion) {
    var tags = __assign({}, conversion.tags);
    delete tags['revenue'];
    delete tags['value'];
    var event = {
        entity_id: conversion.event.id,
        key: conversion.event.key,
        timestamp: conversion.timestamp,
        uuid: conversion.uuid,
    };
    if (conversion.tags) {
        event.tags = conversion.tags;
    }
    if (conversion.value != null) {
        event.value = conversion.value;
    }
    if (conversion.revenue != null) {
        event.revenue = conversion.revenue;
    }
    return {
        events: [event],
    };
}
function makeDecisionSnapshot(event) {
    var _a, _b;
    var layer = event.layer, experiment = event.experiment, variation = event.variation, ruleKey = event.ruleKey, flagKey = event.flagKey, ruleType = event.ruleType, enabled = event.enabled;
    var layerId = layer ? layer.id : null;
    var experimentId = (_a = experiment === null || experiment === void 0 ? void 0 : experiment.id) !== null && _a !== void 0 ? _a : '';
    var variationId = (_b = variation === null || variation === void 0 ? void 0 : variation.id) !== null && _b !== void 0 ? _b : '';
    var variationKey = variation ? variation.key : '';
    return {
        decisions: [
            {
                campaign_id: layerId,
                experiment_id: experimentId,
                variation_id: variationId,
                metadata: {
                    flag_key: flagKey,
                    rule_key: ruleKey,
                    rule_type: ruleType,
                    variation_key: variationKey,
                    enabled: enabled,
                },
            },
        ],
        events: [
            {
                entity_id: layerId,
                timestamp: event.timestamp,
                key: ACTIVATE_EVENT_KEY,
                uuid: event.uuid,
            },
        ],
    };
}
function makeVisitor(data) {
    var visitor = {
        snapshots: [],
        visitor_id: data.user.id,
        attributes: [],
    };
    data.user.attributes.forEach(function (attr) {
        visitor.attributes.push({
            entity_id: attr.entityId,
            key: attr.key,
            type: 'custom',
            value: attr.value,
        });
    });
    if (typeof data.context.botFiltering === 'boolean') {
        visitor.attributes.push({
            entity_id: BOT_FILTERING_KEY,
            key: BOT_FILTERING_KEY,
            type: CUSTOM_ATTRIBUTE_FEATURE_TYPE,
            value: data.context.botFiltering,
        });
    }
    return visitor;
}
/**
 * Event for usage with v1 logtier
 *
 * @export
 * @interface EventBuilderV1
 */
function buildImpressionEventV1(data) {
    var visitor = makeVisitor(data);
    visitor.snapshots.push(makeDecisionSnapshot(data));
    return {
        client_name: data.context.clientName,
        client_version: data.context.clientVersion,
        account_id: data.context.accountId,
        project_id: data.context.projectId,
        revision: data.context.revision,
        anonymize_ip: data.context.anonymizeIP,
        enrich_decisions: true,
        visitors: [visitor],
    };
}
exports.buildImpressionEventV1 = buildImpressionEventV1;
function buildConversionEventV1(data) {
    var visitor = makeVisitor(data);
    visitor.snapshots.push(makeConversionSnapshot(data));
    return {
        client_name: data.context.clientName,
        client_version: data.context.clientVersion,
        account_id: data.context.accountId,
        project_id: data.context.projectId,
        revision: data.context.revision,
        anonymize_ip: data.context.anonymizeIP,
        enrich_decisions: true,
        visitors: [visitor],
    };
}
exports.buildConversionEventV1 = buildConversionEventV1;
function formatEvents(events) {
    return {
        url: 'https://logx.optimizely.com/v1/events',
        httpVerb: 'POST',
        params: makeBatchedEventV1(events),
    };
}
exports.formatEvents = formatEvents;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-event-processor/lib/v1/v1EventProcessor.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-event-processor/lib/v1/v1EventProcessor.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogTierV1EventProcessor = void 0;
/**
 * Copyright 2019-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var js_sdk_logging_1 = __webpack_require__(/*! @optimizely/js-sdk-logging */ "./node_modules/@optimizely/js-sdk-logging/lib/index.js");
var eventProcessor_1 = __webpack_require__(/*! ../eventProcessor */ "./node_modules/@optimizely/js-sdk-event-processor/lib/eventProcessor.js");
var requestTracker_1 = __importDefault(__webpack_require__(/*! ../requestTracker */ "./node_modules/@optimizely/js-sdk-event-processor/lib/requestTracker.js"));
var events_1 = __webpack_require__(/*! ../events */ "./node_modules/@optimizely/js-sdk-event-processor/lib/events.js");
var buildEventV1_1 = __webpack_require__(/*! ./buildEventV1 */ "./node_modules/@optimizely/js-sdk-event-processor/lib/v1/buildEventV1.js");
var logger = js_sdk_logging_1.getLogger('LogTierV1EventProcessor');
var LogTierV1EventProcessor = /** @class */ (function () {
    function LogTierV1EventProcessor(_a) {
        var dispatcher = _a.dispatcher, _b = _a.flushInterval, flushInterval = _b === void 0 ? eventProcessor_1.DEFAULT_FLUSH_INTERVAL : _b, _c = _a.batchSize, batchSize = _c === void 0 ? eventProcessor_1.DEFAULT_BATCH_SIZE : _c, notificationCenter = _a.notificationCenter;
        this.dispatcher = dispatcher;
        this.notificationCenter = notificationCenter;
        this.requestTracker = new requestTracker_1.default();
        flushInterval = eventProcessor_1.validateAndGetFlushInterval(flushInterval);
        batchSize = eventProcessor_1.validateAndGetBatchSize(batchSize);
        this.queue = eventProcessor_1.getQueue(batchSize, flushInterval, this.drainQueue.bind(this), events_1.areEventContextsEqual);
    }
    LogTierV1EventProcessor.prototype.drainQueue = function (buffer) {
        var _this = this;
        var reqPromise = new Promise(function (resolve) {
            logger.debug('draining queue with %s events', buffer.length);
            if (buffer.length === 0) {
                resolve();
                return;
            }
            var formattedEvent = buildEventV1_1.formatEvents(buffer);
            _this.dispatcher.dispatchEvent(formattedEvent, function () {
                resolve();
            });
            eventProcessor_1.sendEventNotification(_this.notificationCenter, formattedEvent);
        });
        this.requestTracker.trackRequest(reqPromise);
        return reqPromise;
    };
    LogTierV1EventProcessor.prototype.process = function (event) {
        this.queue.enqueue(event);
    };
    LogTierV1EventProcessor.prototype.stop = function () {
        // swallow - an error stopping this queue shouldn't prevent this from stopping
        try {
            this.queue.stop();
            return this.requestTracker.onRequestsComplete();
        }
        catch (e) {
            logger.error('Error stopping EventProcessor: "%s"', e.message, e);
        }
        return Promise.resolve();
    };
    LogTierV1EventProcessor.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.queue.start();
                return [2 /*return*/];
            });
        });
    };
    return LogTierV1EventProcessor;
}());
exports.LogTierV1EventProcessor = LogTierV1EventProcessor;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-logging/lib/errorHandler.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-logging/lib/errorHandler.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @export
 * @class NoopErrorHandler
 * @implements {ErrorHandler}
 */
var NoopErrorHandler = /** @class */ (function () {
    function NoopErrorHandler() {
    }
    /**
     * @param {Error} exception
     * @memberof NoopErrorHandler
     */
    NoopErrorHandler.prototype.handleError = function (exception) {
        // no-op
        return;
    };
    return NoopErrorHandler;
}());
exports.NoopErrorHandler = NoopErrorHandler;
var globalErrorHandler = new NoopErrorHandler();
/**
 * @export
 * @param {ErrorHandler} handler
 */
function setErrorHandler(handler) {
    globalErrorHandler = handler;
}
exports.setErrorHandler = setErrorHandler;
/**
 * @export
 * @returns {ErrorHandler}
 */
function getErrorHandler() {
    return globalErrorHandler;
}
exports.getErrorHandler = getErrorHandler;
/**
 * @export
 */
function resetErrorHandler() {
    globalErrorHandler = new NoopErrorHandler();
}
exports.resetErrorHandler = resetErrorHandler;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-logging/lib/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-logging/lib/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
__export(__webpack_require__(/*! ./errorHandler */ "./node_modules/@optimizely/js-sdk-logging/lib/errorHandler.js"));
__export(__webpack_require__(/*! ./models */ "./node_modules/@optimizely/js-sdk-logging/lib/models.js"));
__export(__webpack_require__(/*! ./logger */ "./node_modules/@optimizely/js-sdk-logging/lib/logger.js"));


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-logging/lib/logger.js":
/*!***************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-logging/lib/logger.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var errorHandler_1 = __webpack_require__(/*! ./errorHandler */ "./node_modules/@optimizely/js-sdk-logging/lib/errorHandler.js");
var js_sdk_utils_1 = __webpack_require__(/*! @optimizely/js-sdk-utils */ "./node_modules/@optimizely/js-sdk-utils/lib/index.js");
var models_1 = __webpack_require__(/*! ./models */ "./node_modules/@optimizely/js-sdk-logging/lib/models.js");
var stringToLogLevel = {
    NOTSET: 0,
    DEBUG: 1,
    INFO: 2,
    WARNING: 3,
    ERROR: 4,
};
function coerceLogLevel(level) {
    if (typeof level !== 'string') {
        return level;
    }
    level = level.toUpperCase();
    if (level === 'WARN') {
        level = 'WARNING';
    }
    if (!stringToLogLevel[level]) {
        return level;
    }
    return stringToLogLevel[level];
}
var DefaultLogManager = /** @class */ (function () {
    function DefaultLogManager() {
        this.defaultLoggerFacade = new OptimizelyLogger();
        this.loggers = {};
    }
    DefaultLogManager.prototype.getLogger = function (name) {
        if (!name) {
            return this.defaultLoggerFacade;
        }
        if (!this.loggers[name]) {
            this.loggers[name] = new OptimizelyLogger({ messagePrefix: name });
        }
        return this.loggers[name];
    };
    return DefaultLogManager;
}());
var ConsoleLogHandler = /** @class */ (function () {
    /**
     * Creates an instance of ConsoleLogger.
     * @param {ConsoleLogHandlerConfig} config
     * @memberof ConsoleLogger
     */
    function ConsoleLogHandler(config) {
        if (config === void 0) { config = {}; }
        this.logLevel = models_1.LogLevel.NOTSET;
        if (config.logLevel !== undefined && js_sdk_utils_1.isValidEnum(models_1.LogLevel, config.logLevel)) {
            this.setLogLevel(config.logLevel);
        }
        this.logToConsole = config.logToConsole !== undefined ? !!config.logToConsole : true;
        this.prefix = config.prefix !== undefined ? config.prefix : '[OPTIMIZELY]';
    }
    /**
     * @param {LogLevel} level
     * @param {string} message
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.log = function (level, message) {
        if (!this.shouldLog(level) || !this.logToConsole) {
            return;
        }
        var logMessage = this.prefix + " - " + this.getLogLevelName(level) + " " + this.getTime() + " " + message;
        this.consoleLog(level, [logMessage]);
    };
    /**
     * @param {LogLevel} level
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.setLogLevel = function (level) {
        level = coerceLogLevel(level);
        if (!js_sdk_utils_1.isValidEnum(models_1.LogLevel, level) || level === undefined) {
            this.logLevel = models_1.LogLevel.ERROR;
        }
        else {
            this.logLevel = level;
        }
    };
    /**
     * @returns {string}
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.getTime = function () {
        return new Date().toISOString();
    };
    /**
     * @private
     * @param {LogLevel} targetLogLevel
     * @returns {boolean}
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.shouldLog = function (targetLogLevel) {
        return targetLogLevel >= this.logLevel;
    };
    /**
     * @private
     * @param {LogLevel} logLevel
     * @returns {string}
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.getLogLevelName = function (logLevel) {
        switch (logLevel) {
            case models_1.LogLevel.DEBUG:
                return 'DEBUG';
            case models_1.LogLevel.INFO:
                return 'INFO ';
            case models_1.LogLevel.WARNING:
                return 'WARN ';
            case models_1.LogLevel.ERROR:
                return 'ERROR';
            default:
                return 'NOTSET';
        }
    };
    /**
     * @private
     * @param {LogLevel} logLevel
     * @param {string[]} logArguments
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.consoleLog = function (logLevel, logArguments) {
        switch (logLevel) {
            case models_1.LogLevel.DEBUG:
                console.log.apply(console, logArguments);
                break;
            case models_1.LogLevel.INFO:
                console.info.apply(console, logArguments);
                break;
            case models_1.LogLevel.WARNING:
                console.warn.apply(console, logArguments);
                break;
            case models_1.LogLevel.ERROR:
                console.error.apply(console, logArguments);
                break;
            default:
                console.log.apply(console, logArguments);
        }
    };
    return ConsoleLogHandler;
}());
exports.ConsoleLogHandler = ConsoleLogHandler;
var globalLogLevel = models_1.LogLevel.NOTSET;
var globalLogHandler = null;
var OptimizelyLogger = /** @class */ (function () {
    function OptimizelyLogger(opts) {
        if (opts === void 0) { opts = {}; }
        this.messagePrefix = '';
        if (opts.messagePrefix) {
            this.messagePrefix = opts.messagePrefix;
        }
    }
    /**
     * @param {(LogLevel | LogInputObject)} levelOrObj
     * @param {string} [message]
     * @memberof OptimizelyLogger
     */
    OptimizelyLogger.prototype.log = function (level, message) {
        var splat = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            splat[_i - 2] = arguments[_i];
        }
        this.internalLog(coerceLogLevel(level), {
            message: message,
            splat: splat,
        });
    };
    OptimizelyLogger.prototype.info = function (message) {
        var splat = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            splat[_i - 1] = arguments[_i];
        }
        this.namedLog(models_1.LogLevel.INFO, message, splat);
    };
    OptimizelyLogger.prototype.debug = function (message) {
        var splat = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            splat[_i - 1] = arguments[_i];
        }
        this.namedLog(models_1.LogLevel.DEBUG, message, splat);
    };
    OptimizelyLogger.prototype.warn = function (message) {
        var splat = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            splat[_i - 1] = arguments[_i];
        }
        this.namedLog(models_1.LogLevel.WARNING, message, splat);
    };
    OptimizelyLogger.prototype.error = function (message) {
        var splat = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            splat[_i - 1] = arguments[_i];
        }
        this.namedLog(models_1.LogLevel.ERROR, message, splat);
    };
    OptimizelyLogger.prototype.format = function (data) {
        return "" + (this.messagePrefix ? this.messagePrefix + ': ' : '') + js_sdk_utils_1.sprintf.apply(void 0, __spreadArrays([data.message], data.splat));
    };
    OptimizelyLogger.prototype.internalLog = function (level, data) {
        if (!globalLogHandler) {
            return;
        }
        if (level < globalLogLevel) {
            return;
        }
        globalLogHandler.log(level, this.format(data));
        if (data.error && data.error instanceof Error) {
            errorHandler_1.getErrorHandler().handleError(data.error);
        }
    };
    OptimizelyLogger.prototype.namedLog = function (level, message, splat) {
        var error;
        if (message instanceof Error) {
            error = message;
            message = error.message;
            this.internalLog(level, {
                error: error,
                message: message,
                splat: splat,
            });
            return;
        }
        if (splat.length === 0) {
            this.internalLog(level, {
                message: message,
                splat: splat,
            });
            return;
        }
        var last = splat[splat.length - 1];
        if (last instanceof Error) {
            error = last;
            splat.splice(-1);
        }
        this.internalLog(level, { message: message, error: error, splat: splat });
    };
    return OptimizelyLogger;
}());
var globalLogManager = new DefaultLogManager();
function getLogger(name) {
    return globalLogManager.getLogger(name);
}
exports.getLogger = getLogger;
function setLogHandler(logger) {
    globalLogHandler = logger;
}
exports.setLogHandler = setLogHandler;
function setLogLevel(level) {
    level = coerceLogLevel(level);
    if (!js_sdk_utils_1.isValidEnum(models_1.LogLevel, level) || level === undefined) {
        globalLogLevel = models_1.LogLevel.ERROR;
    }
    else {
        globalLogLevel = level;
    }
}
exports.setLogLevel = setLogLevel;
function getLogLevel() {
    return globalLogLevel;
}
exports.getLogLevel = getLogLevel;
/**
 * Resets all global logger state to it's original
 */
function resetLogger() {
    globalLogManager = new DefaultLogManager();
    globalLogLevel = models_1.LogLevel.NOTSET;
}
exports.resetLogger = resetLogger;


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-logging/lib/models.js":
/*!***************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-logging/lib/models.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["NOTSET"] = 0] = "NOTSET";
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARNING"] = 3] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));


/***/ }),

/***/ "./node_modules/@optimizely/js-sdk-utils/lib/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@optimizely/js-sdk-utils/lib/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/index.js");
function generateUUID() {
    return uuid_1.v4();
}
exports.generateUUID = generateUUID;
function getTimestamp() {
    return new Date().getTime();
}
exports.getTimestamp = getTimestamp;
/**
 * Validates a value is a valid TypeScript enum
 *
 * @export
 * @param {object} enumToCheck
 * @param {*} value
 * @returns {boolean}
 */
function isValidEnum(enumToCheck, value) {
    var found = false;
    var keys = Object.keys(enumToCheck);
    for (var index = 0; index < keys.length; index++) {
        if (value === enumToCheck[keys[index]]) {
            found = true;
            break;
        }
    }
    return found;
}
exports.isValidEnum = isValidEnum;
function groupBy(arr, grouperFn) {
    var grouper = {};
    arr.forEach(function (item) {
        var key = grouperFn(item);
        grouper[key] = grouper[key] || [];
        grouper[key].push(item);
    });
    return objectValues(grouper);
}
exports.groupBy = groupBy;
function objectValues(obj) {
    return Object.keys(obj).map(function (key) { return obj[key]; });
}
exports.objectValues = objectValues;
function objectEntries(obj) {
    return Object.keys(obj).map(function (key) { return [key, obj[key]]; });
}
exports.objectEntries = objectEntries;
function find(arr, cond) {
    var found;
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var item = arr_1[_i];
        if (cond(item)) {
            found = item;
            break;
        }
    }
    return found;
}
exports.find = find;
function keyBy(arr, keyByFn) {
    var map = {};
    arr.forEach(function (item) {
        var key = keyByFn(item);
        map[key] = item;
    });
    return map;
}
exports.keyBy = keyBy;
function sprintf(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var i = 0;
    return format.replace(/%s/g, function () {
        var arg = args[i++];
        var type = typeof arg;
        if (type === 'function') {
            return arg();
        }
        else if (type === 'string') {
            return arg;
        }
        else {
            return String(arg);
        }
    });
}
exports.sprintf = sprintf;
/*
 * Notification types for use with NotificationCenter
 * Format is EVENT: <list of parameters to callback>
 *
 * SDK consumers can use these to register callbacks with the notification center.
 *
 *  @deprecated since 3.1.0
 *  ACTIVATE: An impression event will be sent to Optimizely
 *  Callbacks will receive an object argument with the following properties:
 *    - experiment {Object}
 *    - userId {string}
 *    - attributes {Object|undefined}
 *    - variation {Object}
 *    - logEvent {Object}
 *
 *  DECISION: A decision is made in the system. i.e. user activation,
 *  feature access or feature-variable value retrieval
 *  Callbacks will receive an object argument with the following properties:
 *    - type {string}
 *    - userId {string}
 *    - attributes {Object|undefined}
 *    - decisionInfo {Object|undefined}
 *
 *  LOG_EVENT: A batch of events, which could contain impressions and/or conversions,
 *  will be sent to Optimizely
 *  Callbacks will receive an object argument with the following properties:
 *    - url {string}
 *    - httpVerb {string}
 *    - params {Object}
 *
 *  OPTIMIZELY_CONFIG_UPDATE: This Optimizely instance has been updated with a new
 *  config
 *
 *  TRACK: A conversion event will be sent to Optimizely
 *  Callbacks will receive the an object argument with the following properties:
 *    - eventKey {string}
 *    - userId {string}
 *    - attributes {Object|undefined}
 *    - eventTags {Object|undefined}
 *    - logEvent {Object}
 *
 */
var NOTIFICATION_TYPES;
(function (NOTIFICATION_TYPES) {
    NOTIFICATION_TYPES["ACTIVATE"] = "ACTIVATE:experiment, user_id,attributes, variation, event";
    NOTIFICATION_TYPES["DECISION"] = "DECISION:type, userId, attributes, decisionInfo";
    NOTIFICATION_TYPES["LOG_EVENT"] = "LOG_EVENT:logEvent";
    NOTIFICATION_TYPES["OPTIMIZELY_CONFIG_UPDATE"] = "OPTIMIZELY_CONFIG_UPDATE";
    NOTIFICATION_TYPES["TRACK"] = "TRACK:event_key, user_id, attributes, event_tags, event";
})(NOTIFICATION_TYPES = exports.NOTIFICATION_TYPES || (exports.NOTIFICATION_TYPES = {}));


/***/ }),

/***/ "./node_modules/@optimizely/optimizely-sdk/dist/optimizely.browser.min.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@optimizely/optimizely-sdk/dist/optimizely.browser.min.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:!0}));var e,t=__webpack_require__(/*! @optimizely/js-sdk-logging */ "./node_modules/@optimizely/js-sdk-logging/lib/index.js"),r=__webpack_require__(/*! @optimizely/js-sdk-event-processor */ "./node_modules/@optimizely/js-sdk-event-processor/lib/index.js"),i=__webpack_require__(/*! @optimizely/js-sdk-utils */ "./node_modules/@optimizely/js-sdk-utils/lib/index.js"),n=(e=__webpack_require__(/*! murmurhash */ "./node_modules/murmurhash/murmurhash.js"))&&"object"==typeof e&&"default"in e?e.default:e,o=__webpack_require__(/*! @optimizely/js-sdk-datafile-manager */ "./node_modules/@optimizely/js-sdk-datafile-manager/lib/index.browser.js"),a=function(){return(a=Object.assign||function(e){for(var t,r=1,i=arguments.length;r<i;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)};function s(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var i=Array(e),n=0;for(t=0;t<r;t++)for(var o=arguments[t],a=0,s=o.length;a<s;a++,n++)i[n]=o[a];return i}var u={NOTSET:0,DEBUG:1,INFO:2,WARNING:3,ERROR:4},l={CONDITION_EVALUATOR_ERROR:"%s: Error evaluating audience condition of type %s: %s",DATAFILE_AND_SDK_KEY_MISSING:"%s: You must provide at least one of sdkKey or datafile. Cannot start Optimizely",EXPERIMENT_KEY_NOT_IN_DATAFILE:"%s: Experiment key %s is not in datafile.",FEATURE_NOT_IN_DATAFILE:"%s: Feature key %s is not in datafile.",IMPROPERLY_FORMATTED_EXPERIMENT:"%s: Experiment key %s is improperly formatted.",INVALID_ATTRIBUTES:"%s: Provided attributes are in an invalid format.",INVALID_BUCKETING_ID:"%s: Unable to generate hash for bucketing ID %s: %s",INVALID_DATAFILE:"%s: Datafile is invalid - property %s: %s",INVALID_DATAFILE_MALFORMED:"%s: Datafile is invalid because it is malformed.",INVALID_CONFIG:"%s: Provided Optimizely config is in an invalid format.",INVALID_JSON:"%s: JSON object is not valid.",INVALID_ERROR_HANDLER:'%s: Provided "errorHandler" is in an invalid format.',INVALID_EVENT_DISPATCHER:'%s: Provided "eventDispatcher" is in an invalid format.',INVALID_EVENT_TAGS:"%s: Provided event tags are in an invalid format.",INVALID_EXPERIMENT_KEY:"%s: Experiment key %s is not in datafile. It is either invalid, paused, or archived.",INVALID_EXPERIMENT_ID:"%s: Experiment ID %s is not in datafile.",INVALID_GROUP_ID:"%s: Group ID %s is not in datafile.",INVALID_LOGGER:'%s: Provided "logger" is in an invalid format.',INVALID_ROLLOUT_ID:"%s: Invalid rollout ID %s attached to feature %s",INVALID_USER_ID:"%s: Provided user ID is in an invalid format.",INVALID_USER_PROFILE_SERVICE:"%s: Provided user profile service instance is in an invalid format: %s.",NO_DATAFILE_SPECIFIED:"%s: No datafile specified. Cannot start optimizely.",NO_JSON_PROVIDED:"%s: No JSON object to validate against schema.",NO_VARIATION_FOR_EXPERIMENT_KEY:"%s: No variation key %s defined in datafile for experiment %s.",UNDEFINED_ATTRIBUTE:"%s: Provided attribute: %s has an undefined value.",UNRECOGNIZED_ATTRIBUTE:"%s: Unrecognized attribute %s provided. Pruning before sending event to Optimizely.",UNABLE_TO_CAST_VALUE:"%s: Unable to cast value %s to type %s, returning null.",USER_NOT_IN_FORCED_VARIATION:"%s: User %s is not in the forced variation map. Cannot remove their forced variation.",USER_PROFILE_LOOKUP_ERROR:'%s: Error while looking up user profile for user ID "%s": %s.',USER_PROFILE_SAVE_ERROR:'%s: Error while saving user profile for user ID "%s": %s.',VARIABLE_KEY_NOT_IN_DATAFILE:'%s: Variable with key "%s" associated with feature with key "%s" is not in datafile.',VARIATION_ID_NOT_IN_DATAFILE:"%s: No variation ID %s defined in datafile for experiment %s.",VARIATION_ID_NOT_IN_DATAFILE_NO_EXPERIMENT:"%s: Variation ID %s is not in the datafile.",INVALID_INPUT_FORMAT:"%s: Provided %s is in an invalid format.",INVALID_DATAFILE_VERSION:"%s: This version of the JavaScript SDK does not support the given datafile version: %s",INVALID_VARIATION_KEY:"%s: Provided variation key is in an invalid format."},E={ACTIVATE_USER:"%s: Activating user %s in experiment %s.",DISPATCH_CONVERSION_EVENT:"%s: Dispatching conversion event to URL %s with params %s.",DISPATCH_IMPRESSION_EVENT:"%s: Dispatching impression event to URL %s with params %s.",DEPRECATED_EVENT_VALUE:"%s: Event value is deprecated in %s call.",EVENT_KEY_NOT_FOUND:"%s: Event key %s is not in datafile.",EXPERIMENT_NOT_RUNNING:"%s: Experiment %s is not running.",FEATURE_ENABLED_FOR_USER:"%s: Feature %s is enabled for user %s.",FEATURE_NOT_ENABLED_FOR_USER:"%s: Feature %s is not enabled for user %s.",FEATURE_HAS_NO_EXPERIMENTS:"%s: Feature %s is not attached to any experiments.",FAILED_TO_PARSE_VALUE:'%s: Failed to parse event value "%s" from event tags.',FAILED_TO_PARSE_REVENUE:'%s: Failed to parse revenue value "%s" from event tags.',FORCED_BUCKETING_FAILED:"%s: Variation key %s is not in datafile. Not activating user %s.",INVALID_OBJECT:"%s: Optimizely object is not valid. Failing %s.",INVALID_CLIENT_ENGINE:"%s: Invalid client engine passed: %s. Defaulting to node-sdk.",INVALID_DEFAULT_DECIDE_OPTIONS:"%s: Provided default decide options is not an array.",INVALID_DECIDE_OPTIONS:"%s: Provided decide options is not an array. Using default decide options.",INVALID_VARIATION_ID:"%s: Bucketed into an invalid variation ID. Returning null.",NOTIFICATION_LISTENER_EXCEPTION:"%s: Notification listener for (%s) threw exception: %s",NO_ROLLOUT_EXISTS:"%s: There is no rollout of feature %s.",NOT_ACTIVATING_USER:"%s: Not activating user %s for experiment %s.",NOT_TRACKING_USER:"%s: Not tracking user %s.",PARSED_REVENUE_VALUE:'%s: Parsed revenue value "%s" from event tags.',PARSED_NUMERIC_VALUE:'%s: Parsed event value "%s" from event tags.',RETURNING_STORED_VARIATION:'%s: Returning previously activated variation "%s" of experiment "%s" for user "%s" from user profile.',ROLLOUT_HAS_NO_EXPERIMENTS:"%s: Rollout of feature %s has no experiments",SAVED_VARIATION:'%s: Saved variation "%s" of experiment "%s" for user "%s".',SAVED_VARIATION_NOT_FOUND:"%s: User %s was previously bucketed into variation with ID %s for experiment %s, but no matching variation was found.",SHOULD_NOT_DISPATCH_ACTIVATE:'%s: Experiment %s is not in "Running" state. Not activating user.',SKIPPING_JSON_VALIDATION:"%s: Skipping JSON schema validation.",TRACK_EVENT:"%s: Tracking event %s for user %s.",UNRECOGNIZED_DECIDE_OPTION:"%s: Unrecognized decide option %s provided.",USER_ASSIGNED_TO_EXPERIMENT_BUCKET:"%s: Assigned bucket %s to user with bucketing ID %s.",USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP:"%s: User %s is in experiment %s of group %s.",USER_BUCKETED_INTO_TARGETING_RULE:"%s: User %s bucketed into targeting rule %s.",USER_IN_FEATURE_EXPERIMENT:"%s: User %s is in variation %s of experiment %s on the feature %s.",USER_IN_ROLLOUT:"%s: User %s is in rollout of feature %s.",USER_NOT_BUCKETED_INTO_EVERYONE_TARGETING_RULE:"%s: User %s not bucketed into everyone targeting rule due to traffic allocation.",USER_NOT_BUCKETED_INTO_EXPERIMENT_IN_GROUP:"%s: User %s is not in experiment %s of group %s.",USER_NOT_BUCKETED_INTO_ANY_EXPERIMENT_IN_GROUP:"%s: User %s is not in any experiment of group %s.",USER_NOT_BUCKETED_INTO_TARGETING_RULE:"%s User %s not bucketed into targeting rule %s due to traffic allocation. Trying everyone rule.",USER_NOT_IN_FEATURE_EXPERIMENT:"%s: User %s is not in any experiment on the feature %s.",USER_NOT_IN_ROLLOUT:"%s: User %s is not in rollout of feature %s.",USER_FORCED_IN_VARIATION:"%s: User %s is forced in variation %s.",USER_MAPPED_TO_FORCED_VARIATION:"%s: Set variation %s for experiment %s and user %s in the forced variation map.",USER_DOESNT_MEET_CONDITIONS_FOR_TARGETING_RULE:"%s: User %s does not meet conditions for targeting rule %s.",USER_MEETS_CONDITIONS_FOR_TARGETING_RULE:"%s: User %s meets conditions for targeting rule %s.",USER_HAS_VARIATION:"%s: User %s is in variation %s of experiment %s.",USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED:"Variation (%s) is mapped to flag (%s), rule (%s) and user (%s) in the forced decision map.",USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED:"Variation (%s) is mapped to flag (%s) and user (%s) in the forced decision map.",USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED_BUT_INVALID:"Invalid variation is mapped to flag (%s), rule (%s) and user (%s) in the forced decision map.",USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED_BUT_INVALID:"Invalid variation is mapped to flag (%s) and user (%s) in the forced decision map.",USER_HAS_FORCED_VARIATION:"%s: Variation %s is mapped to experiment %s and user %s in the forced variation map.",USER_HAS_NO_VARIATION:"%s: User %s is in no variation of experiment %s.",USER_HAS_NO_FORCED_VARIATION:"%s: User %s is not in the forced variation map.",USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT:"%s: No experiment %s mapped to user %s in the forced variation map.",USER_NOT_IN_ANY_EXPERIMENT:"%s: User %s is not in any experiment of group %s.",USER_NOT_IN_EXPERIMENT:"%s: User %s does not meet conditions to be in experiment %s.",USER_RECEIVED_DEFAULT_VARIABLE_VALUE:'%s: User "%s" is not in any variation or rollout rule. Returning default value for variable "%s" of feature flag "%s".',FEATURE_NOT_ENABLED_RETURN_DEFAULT_VARIABLE_VALUE:'%s: Feature "%s" is not enabled for user %s. Returning the default variable value "%s".',VARIABLE_NOT_USED_RETURN_DEFAULT_VARIABLE_VALUE:'%s: Variable "%s" is not used in variation "%s". Returning default value.',USER_RECEIVED_VARIABLE_VALUE:'%s: Got variable value "%s" for variable "%s" of feature flag "%s"',VALID_DATAFILE:"%s: Datafile is valid.",VALID_USER_PROFILE_SERVICE:"%s: Valid user profile service provided.",VARIATION_REMOVED_FOR_USER:"%s: Variation mapped to experiment %s has been removed for user %s.",VARIABLE_REQUESTED_WITH_WRONG_TYPE:'%s: Requested variable type "%s", but variable is of type "%s". Use correct API to retrieve value. Returning None.',VALID_BUCKETING_ID:'%s: BucketingId is valid: "%s"',BUCKETING_ID_NOT_STRING:"%s: BucketingID attribute is not a string. Defaulted to userId",EVALUATING_AUDIENCE:'%s: Starting to evaluate audience "%s" with conditions: %s.',EVALUATING_AUDIENCES_COMBINED:'%s: Evaluating audiences for %s "%s": %s.',AUDIENCE_EVALUATION_RESULT:'%s: Audience "%s" evaluated to %s.',AUDIENCE_EVALUATION_RESULT_COMBINED:"%s: Audiences for %s %s collectively evaluated to %s.",MISSING_ATTRIBUTE_VALUE:'%s: Audience condition %s evaluated to UNKNOWN because no value was passed for user attribute "%s".',UNEXPECTED_CONDITION_VALUE:"%s: Audience condition %s evaluated to UNKNOWN because the condition value is not supported.",UNEXPECTED_TYPE:'%s: Audience condition %s evaluated to UNKNOWN because a value of type "%s" was passed for user attribute "%s".',UNEXPECTED_TYPE_NULL:'%s: Audience condition %s evaluated to UNKNOWN because a null value was passed for user attribute "%s".',UNKNOWN_CONDITION_TYPE:"%s: Audience condition %s has an unknown condition type. You may need to upgrade to a newer release of the Optimizely SDK.",UNKNOWN_MATCH_TYPE:"%s: Audience condition %s uses an unknown match type. You may need to upgrade to a newer release of the Optimizely SDK.",UPDATED_OPTIMIZELY_CONFIG:"%s: Updated Optimizely config to revision %s (project id %s)",OUT_OF_BOUNDS:'%s: Audience condition %s evaluated to UNKNOWN because the number value for user attribute "%s" is not in the range [-2^53, +2^53].',UNABLE_TO_ATTACH_UNLOAD:'%s: unable to bind optimizely.close() to page unload event: "%s"'},I={BOT_FILTERING:"$opt_bot_filtering",BUCKETING_ID:"$opt_bucketing_id",STICKY_BUCKETING_KEY:"$opt_experiment_bucket_map",USER_AGENT:"$opt_user_agent",FORCED_DECISION_NULL_RULE_KEY:"$opt_null_rule_key"},c=i.NOTIFICATION_TYPES,f={AB_TEST:"ab-test",FEATURE:"feature",FEATURE_TEST:"feature-test",FEATURE_VARIABLE:"feature-variable",ALL_FEATURE_VARIABLES:"all-feature-variables",FLAG:"flag"},_={FEATURE_TEST:"feature-test",ROLLOUT:"rollout",EXPERIMENT:"experiment"},d={RULE:"rule",EXPERIMENT:"experiment"},g={BOOLEAN:"boolean",DOUBLE:"double",INTEGER:"integer",STRING:"string",JSON:"json"},p={V2:"2",V3:"3",V4:"4"},O={SDK_NOT_READY:"Optimizely SDK not configured properly yet.",FLAG_KEY_INVALID:'No flag was found for key "%s".',VARIABLE_VALUE_INVALID:'Variable value for key "%s" is invalid or wrong type.'},N=Object.freeze({__proto__:null,LOG_LEVEL:u,ERROR_MESSAGES:l,LOG_MESSAGES:E,CONTROL_ATTRIBUTES:I,JAVASCRIPT_CLIENT_ENGINE:"javascript-sdk",NODE_CLIENT_ENGINE:"node-sdk",REACT_CLIENT_ENGINE:"react-sdk",REACT_NATIVE_CLIENT_ENGINE:"react-native-sdk",REACT_NATIVE_JS_CLIENT_ENGINE:"react-native-js-sdk",NODE_CLIENT_VERSION:"4.9.1",NOTIFICATION_TYPES:c,DECISION_NOTIFICATION_TYPES:f,DECISION_SOURCES:_,AUDIENCE_EVALUATION_TYPES:d,FEATURE_VARIABLE_TYPES:g,DATAFILE_VERSIONS:p,DECISION_MESSAGES:O}),R="CONFIG_VALIDATOR",T=[p.V2,p.V3,p.V4],v=function(e){if("object"==typeof e&&null!==e){var t=e,r=t.errorHandler,n=t.eventDispatcher,o=t.logger;if(r&&"function"!=typeof r.handleError)throw new Error(i.sprintf(l.INVALID_ERROR_HANDLER,R));if(n&&"function"!=typeof n.dispatchEvent)throw new Error(i.sprintf(l.INVALID_EVENT_DISPATCHER,R));if(o&&"function"!=typeof o.log)throw new Error(i.sprintf(l.INVALID_LOGGER,R));return!0}throw new Error(i.sprintf(l.INVALID_CONFIG,R))},h=function(e){if(!e)throw new Error(i.sprintf(l.NO_DATAFILE_SPECIFIED,R));if("string"==typeof e)try{e=JSON.parse(e)}catch(e){throw new Error(i.sprintf(l.INVALID_DATAFILE_MALFORMED,R))}if("object"==typeof e&&!Array.isArray(e)&&null!==e&&-1===T.indexOf(e.version))throw new Error(i.sprintf(l.INVALID_DATAFILE_VERSION,R,e.version));return e};var y={handleError:function(){}},A=function(e){return Object.keys(e).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&")},U={dispatchEvent:function(e,t){var r,i=e.params,n=e.url;"POST"===e.httpVerb?((r=new XMLHttpRequest).open("POST",n,!0),r.setRequestHeader("Content-Type","application/json"),r.onreadystatechange=function(){if(4===r.readyState&&t&&"function"==typeof t)try{t({statusCode:r.status})}catch(e){}},r.send(JSON.stringify(i))):(n+="?wxhr=true",i&&(n+="&"+A(i)),(r=new XMLHttpRequest).open("GET",n,!0),r.onreadystatechange=function(){if(4===r.readyState&&t&&"function"==typeof t)try{t({statusCode:r.status})}catch(e){}},r.send())}},D=function(){function e(){}return e.prototype.log=function(){},e}();function S(e){return new t.ConsoleLogHandler(e)}var L,m,V=Object.freeze({__proto__:null,NoOpLogger:D,createLogger:S,createNoOpLogger:function(){return new D}});function C(e,t,r){return{variationKey:null,enabled:!1,variables:{},ruleKey:null,flagKey:e,userContext:t,reasons:r}}!function(e){e.BOOLEAN="boolean",e.DOUBLE="double",e.INTEGER="integer",e.STRING="string",e.JSON="json"}(L||(L={})),(m=exports.OptimizelyDecideOption||(exports.OptimizelyDecideOption={})).DISABLE_DECISION_EVENT="DISABLE_DECISION_EVENT",m.ENABLED_FLAGS_ONLY="ENABLED_FLAGS_ONLY",m.IGNORE_USER_PROFILE_SERVICE="IGNORE_USER_PROFILE_SERVICE",m.INCLUDE_REASONS="INCLUDE_REASONS",m.EXCLUDE_VARIABLES="EXCLUDE_VARIABLES";var F=function(){function e(e){var t,r=e.optimizely,i=e.userId,n=e.attributes;this.optimizely=r,this.userId=i,this.attributes=null!==(t=a({},n))&&void 0!==t?t:{},this.forcedDecisionsMap={}}return e.prototype.setAttribute=function(e,t){this.attributes[e]=t},e.prototype.getUserId=function(){return this.userId},e.prototype.getAttributes=function(){return a({},this.attributes)},e.prototype.getOptimizely=function(){return this.optimizely},e.prototype.decide=function(e,t){return void 0===t&&(t=[]),this.optimizely.decide(this.cloneUserContext(),e,t)},e.prototype.decideForKeys=function(e,t){return void 0===t&&(t=[]),this.optimizely.decideForKeys(this.cloneUserContext(),e,t)},e.prototype.decideAll=function(e){return void 0===e&&(e=[]),this.optimizely.decideAll(this.cloneUserContext(),e)},e.prototype.trackEvent=function(e,t){this.optimizely.track(e,this.userId,this.attributes,t)},e.prototype.setForcedDecision=function(e,t){var r,i=e.flagKey,n=null!==(r=e.ruleKey)&&void 0!==r?r:I.FORCED_DECISION_NULL_RULE_KEY,o={variationKey:t.variationKey};return this.forcedDecisionsMap[i]||(this.forcedDecisionsMap[i]={}),this.forcedDecisionsMap[i][n]=o,!0},e.prototype.getForcedDecision=function(e){return this.findForcedDecision(e)},e.prototype.removeForcedDecision=function(e){var t,r=null!==(t=e.ruleKey)&&void 0!==t?t:I.FORCED_DECISION_NULL_RULE_KEY,i=e.flagKey,n=!1;this.forcedDecisionsMap.hasOwnProperty(i)&&(this.forcedDecisionsMap[i].hasOwnProperty(r)&&(delete this.forcedDecisionsMap[i][r],n=!0),0===Object.keys(this.forcedDecisionsMap[i]).length&&delete this.forcedDecisionsMap[i]);return n},e.prototype.removeAllForcedDecisions=function(){return this.forcedDecisionsMap={},!0},e.prototype.findForcedDecision=function(e){var t,r=null!==(t=e.ruleKey)&&void 0!==t?t:I.FORCED_DECISION_NULL_RULE_KEY,i=e.flagKey;if(this.forcedDecisionsMap.hasOwnProperty(e.flagKey)){var n=this.forcedDecisionsMap[i];if(n.hasOwnProperty(r))return{variationKey:n[r].variationKey}}return null},e.prototype.cloneUserContext=function(){var t=new e({optimizely:this.getOptimizely(),userId:this.getUserId(),attributes:this.getAttributes()});return Object.keys(this.forcedDecisionsMap).length>0&&(t.forcedDecisionsMap=a({},this.forcedDecisionsMap)),t},e}(),M=["and","or","not"];function P(e,t){if(Array.isArray(e)){var r=e[0],i=e.slice(1);switch("string"==typeof r&&-1===M.indexOf(r)&&(r="or",i=e),r){case"and":return function(e,t){var r=!1;if(Array.isArray(e)){for(var i=0;i<e.length;i++){var n=P(e[i],t);if(!1===n)return!1;null===n&&(r=!0)}return!r||null}return null}(i,t);case"not":return function(e,t){if(Array.isArray(e)&&e.length>0){var r=P(e[0],t);return null===r?null:!r}return null}(i,t);default:return function(e,t){var r=!1;if(Array.isArray(e)){for(var i=0;i<e.length;i++){var n=P(e[i],t);if(!0===n)return!0;null===n&&(r=!0)}return!!r&&null}return null}(i,t)}}return t(e)}var b=function(){function e(t,r){var i,n;this.sdkKey=null!==(i=t.sdkKey)&&void 0!==i?i:"",this.environmentKey=null!==(n=t.environmentKey)&&void 0!==n?n:"",this.attributes=t.attributes,this.audiences=e.getAudiences(t),this.events=t.events,this.revision=t.revision;var o=(t.featureFlags||[]).reduce((function(e,t){return e[t.id]=t.variables,e}),{}),a=e.getExperimentsMapById(t,o);this.experimentsMap=e.getExperimentsKeyMap(a),this.featuresMap=e.getFeaturesMap(t,o,a),this.datafile=r}return e.prototype.getDatafile=function(){return this.datafile},e.getAudiences=function(e){var t=[],r=[];return(e.typedAudiences||[]).forEach((function(e){t.push({id:e.id,conditions:JSON.stringify(e.conditions),name:e.name}),r.push(e.id)})),(e.audiences||[]).forEach((function(e){-1===r.indexOf(e.id)&&"$opt_dummy_audience"!=e.id&&t.push({id:e.id,conditions:JSON.stringify(e.conditions),name:e.name})})),t},e.getSerializedAudiences=function(t,r){var i="";if(t){var n="";t.forEach((function(t){var o="";if(t instanceof Array)o="("+(o=e.getSerializedAudiences(t,r))+")";else if(M.indexOf(t)>-1)n=t.toUpperCase();else{var a=r[t]?r[t].name:t;i||"NOT"===n?(n=""===n?"OR":n,i=""===i?n+' "'+r[t].name+'"':i.concat(" "+n+' "'+a+'"')):i='"'+a+'"'}""!==o&&(""!==i||"NOT"===n?(n=""===n?"OR":n,i=""===i?n+" "+o:i.concat(" "+n+" "+o)):i=i.concat(o))}))}return i},e.getExperimentAudiences=function(t,r){return t.audienceConditions?e.getSerializedAudiences(t.audienceConditions,r.audiencesById):""},e.mergeFeatureVariables=function(e,t,r,i,n){var o=(e[r]||[]).reduce((function(e,t){return e[t.key]={id:t.id,key:t.key,type:t.type,value:t.defaultValue},e}),{});return(i||[]).forEach((function(e){var r=t[e.id],i={id:e.id,key:r.key,type:r.type,value:n?e.value:r.defaultValue};o[r.key]=i})),o},e.getVariationsMap=function(t,r,i,n){return t.reduce((function(t,o){var a=e.mergeFeatureVariables(r,i,n,o.variables,o.featureEnabled);return t[o.key]={id:o.id,key:o.key,featureEnabled:o.featureEnabled,variablesMap:a},t}),{})},e.getVariableIdMap=function(e){return(e.featureFlags||[]).reduce((function(e,t){return t.variables.forEach((function(t){e[t.id]=t})),e}),{})},e.getDeliveryRules=function(t,r,i,n){var o=e.getVariableIdMap(t);return n.map((function(n){return{id:n.id,key:n.key,audiences:e.getExperimentAudiences(n,t),variationsMap:e.getVariationsMap(n.variations,r,o,i)}}))},e.getRolloutExperimentIds=function(e){var t=[];return(e||[]).forEach((function(e){e.experiments.forEach((function(e){t.push(e.id)}))})),t},e.getExperimentsMapById=function(t,r){var i=e.getVariableIdMap(t),n=this.getRolloutExperimentIds(t.rollouts);return(t.experiments||[]).reduce((function(o,a){if(-1===n.indexOf(a.id)){var s=t.experimentFeatureMap[a.id],u="";s&&s.length>0&&(u=s[0]);var l=e.getVariationsMap(a.variations,r,i,u.toString());o[a.id]={id:a.id,key:a.key,audiences:e.getExperimentAudiences(a,t),variationsMap:l}}return o}),{})},e.getExperimentsKeyMap=function(e){var t={};for(var r in e){var i=e[r];t[i.key]=i}return t},e.getFeaturesMap=function(t,r,i){var n={};return t.featureFlags.forEach((function(o){var a={},s=[];o.experimentIds.forEach((function(e){var t=i[e];t&&(a[t.key]=t),s.push(i[e])}));var u=(o.variables||[]).reduce((function(e,t){return e[t.key]={id:t.id,key:t.key,type:t.type,value:t.defaultValue},e}),{}),l=[],E=t.rolloutIdMap[o.rolloutId];E&&(l=e.getDeliveryRules(t,r,o.id,E.experiments)),n[o.key]={id:o.id,key:o.key,experimentRules:s,deliveryRules:l,experimentsMap:a,variablesMap:u}})),n},e}();var k=Math.pow(2,53);var B={assign:function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];if(!e)return{};if("function"==typeof Object.assign)return Object.assign.apply(Object,s([e],t));for(var i=Object(e),n=0;n<t.length;n++){var o=t[n];if(null!=o)for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(i[a]=o[a])}return i},currentTimestamp:function(){return Math.round((new Date).getTime())},isSafeInteger:function(e){return"number"==typeof e&&Math.abs(e)<=k},keyBy:function(e,t){return e?i.keyBy(e,(function(e){return e[t]})):{}},uuid:i.generateUUID,isNumber:function(e){return"number"==typeof e}},K="PROJECT_CONFIG";var x=function(e,t){void 0===t&&(t=null);var r,n,o,a,s=(r=e,(a=B.assign({},r)).audiences=(r.audiences||[]).map((function(e){return B.assign({},e)})),a.experiments=(r.experiments||[]).map((function(e){return B.assign({},e)})),a.featureFlags=(r.featureFlags||[]).map((function(e){return B.assign({},e)})),a.groups=(r.groups||[]).map((function(e){var t=B.assign({},e);return t.experiments=(e.experiments||[]).map((function(e){return B.assign({},e)})),t})),a.rollouts=(r.rollouts||[]).map((function(e){var t=B.assign({},e);return t.experiments=(e.experiments||[]).map((function(e){return B.assign({},e)})),t})),a.environmentKey=null!==(n=r.environmentKey)&&void 0!==n?n:"",a.sdkKey=null!==(o=r.sdkKey)&&void 0!==o?o:"",a);return s.__datafileStr=null===t?JSON.stringify(e):t,(s.audiences||[]).forEach((function(e){e.conditions=JSON.parse(e.conditions)})),s.audiencesById=B.keyBy(s.audiences,"id"),B.assign(s.audiencesById,B.keyBy(s.typedAudiences,"id")),s.attributeKeyMap=B.keyBy(s.attributes,"key"),s.eventKeyMap=B.keyBy(s.events,"key"),s.groupIdMap=B.keyBy(s.groups,"id"),Object.keys(s.groupIdMap||{}).forEach((function(e){(s.groupIdMap[e].experiments||[]).forEach((function(t){s.experiments.push(B.assign(t,{groupId:e}))}))})),s.rolloutIdMap=B.keyBy(s.rollouts||[],"id"),i.objectValues(s.rolloutIdMap||{}).forEach((function(e){(e.experiments||[]).forEach((function(e){s.experiments.push(e),e.variationKeyMap=B.keyBy(e.variations,"key")}))})),s.experimentKeyMap=B.keyBy(s.experiments,"key"),s.experimentIdMap=B.keyBy(s.experiments,"id"),s.variationIdMap={},s.variationVariableUsageMap={},(s.experiments||[]).forEach((function(e){e.variationKeyMap=B.keyBy(e.variations,"key"),B.assign(s.variationIdMap,B.keyBy(e.variations,"id")),i.objectValues(e.variationKeyMap||{}).forEach((function(e){e.variables&&(s.variationVariableUsageMap[e.id]=B.keyBy(e.variables,"id"))}))})),s.experimentFeatureMap={},s.featureKeyMap=B.keyBy(s.featureFlags||[],"key"),i.objectValues(s.featureKeyMap||{}).forEach((function(e){e.variables.forEach((function(e){e.type===g.STRING&&e.subType===g.JSON&&(e.type=g.JSON,delete e.subType)})),e.variableKeyMap=B.keyBy(e.variables,"key"),(e.experimentIds||[]).forEach((function(t){s.experimentFeatureMap[t]?s.experimentFeatureMap[t].push(e.id):s.experimentFeatureMap[t]=[e.id]}))})),s.flagRulesMap={},(s.featureFlags||[]).forEach((function(e){var t=[];e.experimentIds.forEach((function(e){var r=s.experimentIdMap[e];r&&t.push(r)}));var r=s.rolloutIdMap[e.rolloutId];r&&t.push.apply(t,r.experiments),s.flagRulesMap[e.key]=t})),s.flagVariationsMap={},i.objectEntries(s.flagRulesMap||{}).forEach((function(e){var t=e[0],r=e[1],n=[];r.forEach((function(e){e.variations.forEach((function(e){i.find(n,(function(t){return t.id===e.id}))||n.push(e)}))})),s.flagVariationsMap[t]=n})),s},G=function(e,t){var r=e.experimentIdMap[t];if(!r)throw new Error(i.sprintf(l.INVALID_EXPERIMENT_ID,K,t));return r.layerId},w=function(e,t,r){var i=e.attributeKeyMap[t],n=0===t.indexOf("$opt_");return i?(n&&r.log(u.WARNING,"Attribute %s unexpectedly has reserved prefix %s; using attribute ID instead of reserved attribute name.",t,"$opt_"),i.id):n?t:(r.log(u.DEBUG,l.UNRECOGNIZED_ATTRIBUTE,K,t),null)},j=function(e,t){var r=e.eventKeyMap[t];return r?r.id:null},H=function(e,t){var r=e.experimentKeyMap[t];if(!r)throw new Error(i.sprintf(l.INVALID_EXPERIMENT_KEY,K,t));return r.status},Y=function(e,t){return e.variationIdMap.hasOwnProperty(t)?e.variationIdMap[t].key:null},X=function(e,t){if(e.experimentKeyMap.hasOwnProperty(t)){var r=e.experimentKeyMap[t];if(r)return r}throw new Error(i.sprintf(l.EXPERIMENT_KEY_NOT_IN_DATAFILE,K,t))},z=function(e,t){var r=e.experimentIdMap[t];if(!r)throw new Error(i.sprintf(l.INVALID_EXPERIMENT_ID,K,t));return r.trafficAllocation},J=function(e,t,r){if(e.experimentIdMap.hasOwnProperty(t)){var i=e.experimentIdMap[t];if(i)return i}return r.log(u.ERROR,l.INVALID_EXPERIMENT_ID,K,t),null},Z=function(e,t,r){if(!e)return null;var n=e.flagVariationsMap[t],o=i.find(n,(function(e){return e.key===r}));return o||null},W=function(e,t,r){if(e.featureKeyMap.hasOwnProperty(t)){var i=e.featureKeyMap[t];if(i)return i}return r.log(u.ERROR,l.FEATURE_NOT_IN_DATAFILE,K,t),null},q=function(e){return e.__datafileStr},$=function(e){var t;try{t=h(e.datafile)}catch(e){return{configObj:null,error:e}}if(e.jsonSchemaValidator)try{e.jsonSchemaValidator.validate(t),e.logger.log(u.INFO,E.VALID_DATAFILE,K)}catch(e){return{configObj:null,error:e}}else e.logger.log(u.INFO,E.SKIPPING_JSON_VALIDATION,K);var r=[t];return"string"==typeof e.datafile&&r.push(e.datafile),{configObj:x.apply(void 0,r),error:null}},Q=function(e){return!!e.sendFlagDecisions},ee=t.getLogger();function te(e,t){return e instanceof Error?e.message:t||"Unknown error"}var re=function(){function e(e){this.updateListeners=[],this.configObj=null,this.optimizelyConfigObj=null,this.datafileManager=null;try{if(this.jsonSchemaValidator=e.jsonSchemaValidator,!e.datafile&&!e.sdkKey){var t=new Error(i.sprintf(l.DATAFILE_AND_SDK_KEY_MISSING,"PROJECT_CONFIG_MANAGER"));return this.readyPromise=Promise.resolve({success:!1,reason:te(t)}),void ee.error(t)}var r=null;e.datafile&&(r=this.handleNewDatafile(e.datafile)),e.sdkKey&&e.datafileManager?(this.datafileManager=e.datafileManager,this.datafileManager.start(),this.readyPromise=this.datafileManager.onReady().then(this.onDatafileManagerReadyFulfill.bind(this),this.onDatafileManagerReadyReject.bind(this)),this.datafileManager.on("update",this.onDatafileManagerUpdate.bind(this))):this.configObj?this.readyPromise=Promise.resolve({success:!0}):this.readyPromise=Promise.resolve({success:!1,reason:te(r,"Invalid datafile")})}catch(e){ee.error(e),this.readyPromise=Promise.resolve({success:!1,reason:te(e,"Error in initialize")})}}return e.prototype.onDatafileManagerReadyFulfill=function(){if(this.datafileManager){var e=this.handleNewDatafile(this.datafileManager.get());return e?{success:!1,reason:te(e)}:{success:!0}}return{success:!1,reason:te(null,"Datafile manager is not provided")}},e.prototype.onDatafileManagerReadyReject=function(e){return{success:!1,reason:te(e,"Failed to become ready")}},e.prototype.onDatafileManagerUpdate=function(){this.datafileManager&&this.handleNewDatafile(this.datafileManager.get())},e.prototype.handleNewDatafile=function(e){var t=$({datafile:e,jsonSchemaValidator:this.jsonSchemaValidator,logger:ee}),r=t.configObj,i=t.error;if(i)ee.error(i);else{var n=this.configObj?this.configObj.revision:"null";r&&n!==r.revision&&(this.configObj=r,this.optimizelyConfigObj=null,this.updateListeners.forEach((function(e){return e(r)})))}return i},e.prototype.getConfig=function(){return this.configObj},e.prototype.getOptimizelyConfig=function(){var e,t;return!this.optimizelyConfigObj&&this.configObj&&(this.optimizelyConfigObj=(e=this.configObj,t=q(this.configObj),new b(e,t))),this.optimizelyConfigObj},e.prototype.onReady=function(){return this.readyPromise},e.prototype.onUpdate=function(e){var t=this;return this.updateListeners.push(e),function(){var r=t.updateListeners.indexOf(e);r>-1&&t.updateListeners.splice(r,1)}},e.prototype.stop=function(){this.datafileManager&&this.datafileManager.stop(),this.updateListeners=[]},e}();var ie=Math.pow(2,32),ne=function(e){var t=[],r=e.experimentIdMap[e.experimentId].groupId;if(r){var n=e.groupIdMap[r];if(!n)throw new Error(i.sprintf(l.INVALID_GROUP_ID,"BUCKETER",r));if("random"===n.policy){var o=oe(n,e.bucketingId,e.userId,e.logger);if(null===o)return e.logger.log(u.INFO,E.USER_NOT_IN_ANY_EXPERIMENT,"BUCKETER",e.userId,r),t.push([E.USER_NOT_IN_ANY_EXPERIMENT,"BUCKETER",e.userId,r]),{result:null,reasons:t};if(o!==e.experimentId)return e.logger.log(u.INFO,E.USER_NOT_BUCKETED_INTO_EXPERIMENT_IN_GROUP,"BUCKETER",e.userId,e.experimentKey,r),t.push([E.USER_NOT_BUCKETED_INTO_EXPERIMENT_IN_GROUP,"BUCKETER",e.userId,e.experimentKey,r]),{result:null,reasons:t};e.logger.log(u.INFO,E.USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP,"BUCKETER",e.userId,e.experimentKey,r),t.push([E.USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP,"BUCKETER",e.userId,e.experimentKey,r])}}var a=""+e.bucketingId+e.experimentId,s=se(a);e.logger.log(u.DEBUG,E.USER_ASSIGNED_TO_EXPERIMENT_BUCKET,"BUCKETER",s,e.userId),t.push([E.USER_ASSIGNED_TO_EXPERIMENT_BUCKET,"BUCKETER",s,e.userId]);var I=ae(s,e.trafficAllocationConfig);return null===I||e.variationIdMap[I]?{result:I,reasons:t}:(I&&(e.logger.log(u.WARNING,E.INVALID_VARIATION_ID,"BUCKETER"),t.push([E.INVALID_VARIATION_ID,"BUCKETER"])),{result:null,reasons:t})},oe=function(e,t,r,i){var n=""+t+e.id,o=se(n);i.log(u.DEBUG,E.USER_ASSIGNED_TO_EXPERIMENT_BUCKET,"BUCKETER",o,r);var a=e.trafficAllocation;return ae(o,a)},ae=function(e,t){for(var r=0;r<t.length;r++)if(e<t[r].endOfRange)return t[r].entityId;return null},se=function(e){try{var t=n.v3(e,1)/ie;return Math.floor(1e4*t)}catch(t){throw new Error(i.sprintf(l.INVALID_BUCKETING_ID,"BUCKETER",e,t.message))}},ue=t.getLogger();function le(e){return/^\d+$/.test(e)}function Ee(e){var t=e.indexOf("-"),r=e.indexOf("+");return!(t<0)&&(r<0||t<r)}function Ie(e){var t=e.indexOf("-"),r=e.indexOf("+");return!(r<0)&&(t<0||r<t)}function ce(e){var t=e,r="";if(function(e){return/\s/.test(e)}(e))return ue.warn(E.UNKNOWN_MATCH_TYPE,"SEMANTIC VERSION",e),null;if(Ee(e)?(t=e.substring(0,e.indexOf("-")),r=e.substring(e.indexOf("-")+1)):Ie(e)&&(t=e.substring(0,e.indexOf("+")),r=e.substring(e.indexOf("+")+1)),"string"!=typeof t||"string"!=typeof r)return null;var i=t.split(".").length-1;if(i>2)return ue.warn(E.UNKNOWN_MATCH_TYPE,"SEMANTIC VERSION",e),null;var n=t.split(".");if(n.length!=i+1)return ue.warn(E.UNKNOWN_MATCH_TYPE,"SEMANTIC VERSION",e),null;for(var o=0,a=n;o<a.length;o++){if(!le(a[o]))return ue.warn(E.UNKNOWN_MATCH_TYPE,"SEMANTIC VERSION",e),null}return r&&n.push(r),n}var fe="CUSTOM_ATTRIBUTE_CONDITION_EVALUATOR",_e=t.getLogger(),de=["exact","exists","gt","ge","lt","le","substring","semver_eq","semver_lt","semver_le","semver_gt","semver_ge"],ge={};function pe(e){return"string"==typeof e||"boolean"==typeof e||B.isNumber(e)}function Oe(e,t){var r=e.value,i=typeof r,n=e.name,o=t[n],a=typeof o;return!pe(r)||B.isNumber(r)&&!B.isSafeInteger(r)?(_e.warn(E.UNEXPECTED_CONDITION_VALUE,fe,JSON.stringify(e)),null):null===o?(_e.debug(E.UNEXPECTED_TYPE_NULL,fe,JSON.stringify(e),n),null):pe(o)&&i===a?B.isNumber(o)&&!B.isSafeInteger(o)?(_e.warn(E.OUT_OF_BOUNDS,fe,JSON.stringify(e),n),null):r===o:(_e.warn(E.UNEXPECTED_TYPE,fe,JSON.stringify(e),a,n),null)}function Ne(e,t){var r=e.name,i=t[r],n=typeof i,o=e.value;return null!==o&&B.isSafeInteger(o)?null===i?(_e.debug(E.UNEXPECTED_TYPE_NULL,fe,JSON.stringify(e),r),!1):B.isNumber(i)?!!B.isSafeInteger(i)||(_e.warn(E.OUT_OF_BOUNDS,fe,JSON.stringify(e),r),!1):(_e.warn(E.UNEXPECTED_TYPE,fe,JSON.stringify(e),n,r),!1):(_e.warn(E.UNEXPECTED_CONDITION_VALUE,fe,JSON.stringify(e)),!1)}function Re(e,t){var r=e.name,i=t[r],n=typeof i,o=e.value;return"string"!=typeof o?(_e.warn(E.UNEXPECTED_CONDITION_VALUE,fe,JSON.stringify(e)),null):null===i?(_e.debug(E.UNEXPECTED_TYPE_NULL,fe,JSON.stringify(e),r),null):"string"!=typeof i?(_e.warn(E.UNEXPECTED_TYPE,fe,JSON.stringify(e),n,r),null):function(e,t){var r=ce(t),i=ce(e);if(!r||!i)return null;for(var n=r.length,o=0;o<i.length;o++){if(n<=o)return Ee(e)||Ie(e)?1:-1;if(le(r[o])){var a=parseInt(r[o]),s=parseInt(i[o]);if(a>s)return 1;if(a<s)return-1}else{if(r[o]<i[o])return Ee(e)&&!Ee(t)?1:-1;if(r[o]>i[o])return!Ee(e)&&Ee(t)?-1:1}}return Ee(t)&&!Ee(e)?-1:0}(o,i)}ge.exact=Oe,ge.exists=function(e,t){var r=t[e.name];return null!=r},ge.gt=function(e,t){var r=t[e.name],i=e.value;if(!Ne(e,t)||null===i)return null;return r>i},ge.ge=function(e,t){var r=t[e.name],i=e.value;if(!Ne(e,t)||null===i)return null;return r>=i},ge.lt=function(e,t){var r=t[e.name],i=e.value;if(!Ne(e,t)||null===i)return null;return r<i},ge.le=function(e,t){var r=t[e.name],i=e.value;if(!Ne(e,t)||null===i)return null;return r<=i},ge.substring=function(e,t){var r=e.name,i=t[e.name],n=typeof i,o=e.value;if("string"!=typeof o)return _e.warn(E.UNEXPECTED_CONDITION_VALUE,fe,JSON.stringify(e)),null;if(null===i)return _e.debug(E.UNEXPECTED_TYPE_NULL,fe,JSON.stringify(e),r),null;if("string"!=typeof i)return _e.warn(E.UNEXPECTED_TYPE,fe,JSON.stringify(e),n,r),null;return-1!==i.indexOf(o)},ge.semver_eq=function(e,t){var r=Re(e,t);if(null===r)return null;return 0===r},ge.semver_gt=function(e,t){var r=Re(e,t);if(null===r)return null;return r>0},ge.semver_ge=function(e,t){var r=Re(e,t);if(null===r)return null;return r>=0},ge.semver_lt=function(e,t){var r=Re(e,t);if(null===r)return null;return r<0},ge.semver_le=function(e,t){var r=Re(e,t);if(null===r)return null;return r<=0};var Te=Object.freeze({__proto__:null,evaluate:function(e,t){var r=e.match;if(void 0!==r&&-1===de.indexOf(r))return _e.warn(E.UNKNOWN_MATCH_TYPE,fe,JSON.stringify(e)),null;var i=e.name;return t.hasOwnProperty(i)||"exists"==r?(r&&ge[r]||Oe)(e,t):(_e.debug(E.MISSING_ATTRIBUTE_VALUE,fe,JSON.stringify(e),i),null)}}),ve=t.getLogger(),he=function(){function e(e){this.typeToEvaluatorMap=B.assign({},e,{custom_attribute:Te})}return e.prototype.evaluate=function(e,t,r){var i=this;if(void 0===r&&(r={}),!e||0===e.length)return!0;return!!P(e,(function(e){var n=t[e];if(n){ve.log(u.DEBUG,E.EVALUATING_AUDIENCE,"AUDIENCE_EVALUATOR",e,JSON.stringify(n.conditions));var o=P(n.conditions,i.evaluateConditionWithUserAttributes.bind(i,r)),a=null===o?"UNKNOWN":o.toString().toUpperCase();return ve.log(u.DEBUG,E.AUDIENCE_EVALUATION_RESULT,"AUDIENCE_EVALUATOR",e,a),o}return null}))},e.prototype.evaluateConditionWithUserAttributes=function(e,t){var r=this.typeToEvaluatorMap[t.type];if(!r)return ve.log(u.WARNING,E.UNKNOWN_CONDITION_TYPE,"AUDIENCE_EVALUATOR",JSON.stringify(t)),null;try{return r.evaluate(t,e)}catch(e){ve.log(u.ERROR,l.CONDITION_EVALUATOR_ERROR,"AUDIENCE_EVALUATOR",t.type,e.message)}return null},e}();function ye(e){return"string"==typeof e&&""!==e}var Ae="DECISION_SERVICE",Ue=function(){function e(e){var t;this.audienceEvaluator=(t=e.UNSTABLE_conditionEvaluators,new he(t)),this.forcedVariationMap={},this.logger=e.logger,this.userProfileService=e.userProfileService||null}return e.prototype.getVariation=function(e,t,r,i){void 0===i&&(i={});var n=r.getUserId(),o=r.getAttributes(),a=this.getBucketingId(n,o),s=[],l=t.key;if(!this.checkIfExperimentIsActive(e,l))return this.logger.log(u.INFO,E.EXPERIMENT_NOT_RUNNING,Ae,l),s.push([E.EXPERIMENT_NOT_RUNNING,Ae,l]),{result:null,reasons:s};var I=this.getForcedVariation(e,l,n);s.push.apply(s,I.reasons);var c=I.result;if(c)return{result:c,reasons:s};var f=this.getWhitelistedVariation(t,n);s.push.apply(s,f.reasons);var _=f.result;if(_)return{result:_.key,reasons:s};var g=i[exports.OptimizelyDecideOption.IGNORE_USER_PROFILE_SERVICE],p=this.resolveExperimentBucketMap(n,o);if(!g&&(_=this.getStoredVariation(e,t,n,p)))return this.logger.log(u.INFO,E.RETURNING_STORED_VARIATION,Ae,_.key,l,n),s.push([E.RETURNING_STORED_VARIATION,Ae,_.key,l,n]),{result:_.key,reasons:s};var O=this.checkIfUserIsInAudience(e,t,d.EXPERIMENT,o,"");if(s.push.apply(s,O.reasons),!O.result)return this.logger.log(u.INFO,E.USER_NOT_IN_EXPERIMENT,Ae,n,l),s.push([E.USER_NOT_IN_EXPERIMENT,Ae,n,l]),{result:null,reasons:s};var N=this.buildBucketerParams(e,t,a,n),R=ne(N);s.push.apply(s,R.reasons);var T=R.result;return T&&(_=e.variationIdMap[T]),_?(this.logger.log(u.INFO,E.USER_HAS_VARIATION,Ae,n,_.key,l),s.push([E.USER_HAS_VARIATION,Ae,n,_.key,l]),g||this.saveUserProfile(t,_,n,p),{result:_.key,reasons:s}):(this.logger.log(u.DEBUG,E.USER_HAS_NO_VARIATION,Ae,n,l),s.push([E.USER_HAS_NO_VARIATION,Ae,n,l]),{result:null,reasons:s})},e.prototype.resolveExperimentBucketMap=function(e,t){t=t||{};var r=this.getUserProfile(e)||{},i=t[I.STICKY_BUCKETING_KEY];return B.assign({},r.experiment_bucket_map,i)},e.prototype.checkIfExperimentIsActive=function(e,t){return function(e,t){return"Running"===H(e,t)}(e,t)},e.prototype.getWhitelistedVariation=function(e,t){var r=[];if(e.forcedVariations&&e.forcedVariations.hasOwnProperty(t)){var i=e.forcedVariations[t];return e.variationKeyMap.hasOwnProperty(i)?(this.logger.log(u.INFO,E.USER_FORCED_IN_VARIATION,Ae,t,i),r.push([E.USER_FORCED_IN_VARIATION,Ae,t,i]),{result:e.variationKeyMap[i],reasons:r}):(this.logger.log(u.ERROR,E.FORCED_BUCKETING_FAILED,Ae,i,t),r.push([E.FORCED_BUCKETING_FAILED,Ae,i,t]),{result:null,reasons:r})}return{result:null,reasons:r}},e.prototype.checkIfUserIsInAudience=function(e,t,r,n,o){var a=[],s=function(e,t){var r=e.experimentIdMap[t];if(!r)throw new Error(i.sprintf(l.INVALID_EXPERIMENT_ID,K,t));return r.audienceConditions||r.audienceIds}(e,t.id),I=e.audiencesById;this.logger.log(u.DEBUG,E.EVALUATING_AUDIENCES_COMBINED,Ae,r,o||t.key,JSON.stringify(s)),a.push([E.EVALUATING_AUDIENCES_COMBINED,Ae,r,o||t.key,JSON.stringify(s)]);var c=this.audienceEvaluator.evaluate(s,I,n);return this.logger.log(u.INFO,E.AUDIENCE_EVALUATION_RESULT_COMBINED,Ae,r,o||t.key,c.toString().toUpperCase()),a.push([E.AUDIENCE_EVALUATION_RESULT_COMBINED,Ae,r,o||t.key,c.toString().toUpperCase()]),{result:c,reasons:a}},e.prototype.buildBucketerParams=function(e,t,r,i){return{bucketingId:r,experimentId:t.id,experimentKey:t.key,experimentIdMap:e.experimentIdMap,experimentKeyMap:e.experimentKeyMap,groupIdMap:e.groupIdMap,logger:this.logger,trafficAllocationConfig:z(e,t.id),userId:i,variationIdMap:e.variationIdMap}},e.prototype.getStoredVariation=function(e,t,r,i){if(i.hasOwnProperty(t.id)){var n=i[t.id],o=n.variation_id;if(e.variationIdMap.hasOwnProperty(o))return e.variationIdMap[n.variation_id];this.logger.log(u.INFO,E.SAVED_VARIATION_NOT_FOUND,Ae,r,o,t.key)}return null},e.prototype.getUserProfile=function(e){var t={user_id:e,experiment_bucket_map:{}};if(!this.userProfileService)return t;try{return this.userProfileService.lookup(e)}catch(t){this.logger.log(u.ERROR,l.USER_PROFILE_LOOKUP_ERROR,Ae,e,t.message)}return null},e.prototype.saveUserProfile=function(e,t,r,i){if(this.userProfileService)try{i[e.id]={variation_id:t.id},this.userProfileService.save({user_id:r,experiment_bucket_map:i}),this.logger.log(u.INFO,E.SAVED_VARIATION,Ae,t.key,e.key,r)}catch(e){this.logger.log(u.ERROR,l.USER_PROFILE_SAVE_ERROR,Ae,r,e.message)}},e.prototype.getVariationForFeature=function(e,t,r,i){void 0===i&&(i={});var n=[],o=this.getVariationForFeatureExperiment(e,t,r,i);n.push.apply(n,o.reasons);var a=o.result;if(null!==a.variation)return{result:a,reasons:n};var s=this.getVariationForRollout(e,t,r);n.push.apply(n,s.reasons);var l=s.result,I=r.getUserId();return l.variation?(this.logger.log(u.DEBUG,E.USER_IN_ROLLOUT,Ae,I,t.key),n.push([E.USER_IN_ROLLOUT,Ae,I,t.key]),{result:l,reasons:n}):(this.logger.log(u.DEBUG,E.USER_NOT_IN_ROLLOUT,Ae,I,t.key),n.push([E.USER_NOT_IN_ROLLOUT,Ae,I,t.key]),{result:l,reasons:n})},e.prototype.getVariationForFeatureExperiment=function(e,t,r,i){void 0===i&&(i={});var n,o,a=[],s=null;if(t.experimentIds.length>0)for(o=0;o<t.experimentIds.length;o++){var l=J(e,t.experimentIds[o],this.logger);if(l&&(n=this.getVariationFromExperimentRule(e,t.key,l,r,i),a.push.apply(a,n.reasons),s=n.result)){var I=null;return(I=l.variationKeyMap[s])||(I=Z(e,t.key,s)),{result:{experiment:l,variation:I,decisionSource:_.FEATURE_TEST},reasons:a}}}else this.logger.log(u.DEBUG,E.FEATURE_HAS_NO_EXPERIMENTS,Ae,t.key),a.push([E.FEATURE_HAS_NO_EXPERIMENTS,Ae,t.key]);return{result:{experiment:null,variation:null,decisionSource:_.FEATURE_TEST},reasons:a}},e.prototype.getVariationForRollout=function(e,t,r){var i=[];if(!t.rolloutId)return this.logger.log(u.DEBUG,E.NO_ROLLOUT_EXISTS,Ae,t.key),i.push([E.NO_ROLLOUT_EXISTS,Ae,t.key]),{result:{experiment:null,variation:null,decisionSource:_.ROLLOUT},reasons:i};var n=e.rolloutIdMap[t.rolloutId];if(!n)return this.logger.log(u.ERROR,l.INVALID_ROLLOUT_ID,Ae,t.rolloutId,t.key),i.push([l.INVALID_ROLLOUT_ID,Ae,t.rolloutId,t.key]),{result:{experiment:null,variation:null,decisionSource:_.ROLLOUT},reasons:i};var o,a,s,I=n.experiments;if(0===I.length)return this.logger.log(u.ERROR,E.ROLLOUT_HAS_NO_EXPERIMENTS,Ae,t.rolloutId),i.push([E.ROLLOUT_HAS_NO_EXPERIMENTS,Ae,t.rolloutId]),{result:{experiment:null,variation:null,decisionSource:_.ROLLOUT},reasons:i};for(var c=0;c<I.length;){if(o=this.getVariationFromDeliveryRule(e,t.key,I,c,r),i.push.apply(i,o.reasons),s=o.result,a=o.skipToEveryoneElse,s)return{result:{experiment:e.experimentIdMap[I[c].id],variation:s,decisionSource:_.ROLLOUT},reasons:i};c=a?I.length-1:c+1}return{result:{experiment:null,variation:null,decisionSource:_.ROLLOUT},reasons:i}},e.prototype.getBucketingId=function(e,t){var r=e;return null!=t&&"object"==typeof t&&t.hasOwnProperty(I.BUCKETING_ID)&&("string"==typeof t[I.BUCKETING_ID]?(r=t[I.BUCKETING_ID],this.logger.log(u.DEBUG,E.VALID_BUCKETING_ID,Ae,r)):this.logger.log(u.WARNING,E.BUCKETING_ID_NOT_STRING,Ae)),r},e.prototype.findValidatedForcedDecision=function(e,t,r,i){var n,o=[],a=t.getForcedDecision({flagKey:r,ruleKey:i}),s=null,l=t.getUserId();return e&&a&&(n=a.variationKey,(s=Z(e,r,n))?i?(this.logger.log(u.INFO,E.USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED,n,r,i,l),o.push([E.USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED,n,r,i,l])):(this.logger.log(u.INFO,E.USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED,n,r,l),o.push([E.USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED,n,r,l])):i?(this.logger.log(u.INFO,E.USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED_BUT_INVALID,r,i,l),o.push([E.USER_HAS_FORCED_DECISION_WITH_RULE_SPECIFIED_BUT_INVALID,r,i,l])):(this.logger.log(u.INFO,E.USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED_BUT_INVALID,r,l),o.push([E.USER_HAS_FORCED_DECISION_WITH_NO_RULE_SPECIFIED_BUT_INVALID,r,l]))),{result:s,reasons:o}},e.prototype.removeForcedVariation=function(e,t,r){if(!e)throw new Error(i.sprintf(l.INVALID_USER_ID,Ae));if(!this.forcedVariationMap.hasOwnProperty(e))throw new Error(i.sprintf(l.USER_NOT_IN_FORCED_VARIATION,Ae,e));delete this.forcedVariationMap[e][t],this.logger.log(u.DEBUG,E.VARIATION_REMOVED_FOR_USER,Ae,r,e)},e.prototype.setInForcedVariationMap=function(e,t,r){this.forcedVariationMap.hasOwnProperty(e)||(this.forcedVariationMap[e]={}),this.forcedVariationMap[e][t]=r,this.logger.log(u.DEBUG,E.USER_MAPPED_TO_FORCED_VARIATION,Ae,r,t,e)},e.prototype.getForcedVariation=function(e,t,r){var i,n=[],o=this.forcedVariationMap[r];if(!o)return this.logger.log(u.DEBUG,E.USER_HAS_NO_FORCED_VARIATION,Ae,r),{result:null,reasons:n};try{var a=X(e,t);if(!a.hasOwnProperty("id"))return this.logger.log(u.ERROR,l.IMPROPERLY_FORMATTED_EXPERIMENT,Ae,t),n.push([l.IMPROPERLY_FORMATTED_EXPERIMENT,Ae,t]),{result:null,reasons:n};i=a.id}catch(e){return this.logger.log(u.ERROR,e.message),n.push(e.message),{result:null,reasons:n}}var s=o[i];if(!s)return this.logger.log(u.DEBUG,E.USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT,Ae,t,r),{result:null,reasons:n};var I=Y(e,s);return I?(this.logger.log(u.DEBUG,E.USER_HAS_FORCED_VARIATION,Ae,I,t,r),n.push([E.USER_HAS_FORCED_VARIATION,Ae,I,t,r])):this.logger.log(u.DEBUG,E.USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT,Ae,t,r),{result:I,reasons:n}},e.prototype.setForcedVariation=function(e,t,r,i){if(null!=i&&!ye(i))return this.logger.log(u.ERROR,l.INVALID_VARIATION_KEY,Ae),!1;var n;try{var o=X(e,t);if(!o.hasOwnProperty("id"))return this.logger.log(u.ERROR,l.IMPROPERLY_FORMATTED_EXPERIMENT,Ae,t),!1;n=o.id}catch(e){return this.logger.log(u.ERROR,e.message),!1}if(null==i)try{return this.removeForcedVariation(r,n,t),!0}catch(e){return this.logger.log(u.ERROR,e.message),!1}var a=function(e,t,r){var i=e.experimentKeyMap[t];return i.variationKeyMap.hasOwnProperty(r)?i.variationKeyMap[r].id:null}(e,t,i);if(!a)return this.logger.log(u.ERROR,l.NO_VARIATION_FOR_EXPERIMENT_KEY,Ae,i,t),!1;try{return this.setInForcedVariationMap(r,n,a),!0}catch(e){return this.logger.log(u.ERROR,e.message),!1}},e.prototype.getVariationFromExperimentRule=function(e,t,r,i,n){void 0===n&&(n={});var o=[],a=this.findValidatedForcedDecision(e,i,t,r.key);o.push.apply(o,a.reasons);var s=a.result;if(s)return{result:s.key,reasons:o};var u=this.getVariation(e,r,i,n);return o.push.apply(o,u.reasons),{result:u.result,reasons:o}},e.prototype.getVariationFromDeliveryRule=function(e,t,r,i,n){var o=[],a=!1,s=r[i],l=this.findValidatedForcedDecision(e,n,t,s.key);o.push.apply(o,l.reasons);var I=l.result;if(I)return{result:I,reasons:o,skipToEveryoneElse:a};var c,f,_,g,p,O=n.getUserId(),N=n.getAttributes(),R=this.getBucketingId(O,N),T=i===r.length-1,v=T?"Everyone Else":i+1,h=null,y=this.checkIfUserIsInAudience(e,s,d.RULE,N,v);return o.push.apply(o,y.reasons),y.result?(this.logger.log(u.DEBUG,E.USER_MEETS_CONDITIONS_FOR_TARGETING_RULE,Ae,O,v),o.push([E.USER_MEETS_CONDITIONS_FOR_TARGETING_RULE,Ae,O,v]),f=this.buildBucketerParams(e,s,R,O),_=ne(f),o.push.apply(o,_.reasons),(c=_.result)&&(p=c,h=(g=e).variationIdMap.hasOwnProperty(p)?g.variationIdMap[p]:null),h?(this.logger.log(u.DEBUG,E.USER_BUCKETED_INTO_TARGETING_RULE,Ae,O,v),o.push([E.USER_BUCKETED_INTO_TARGETING_RULE,Ae,O,v])):T||(this.logger.log(u.DEBUG,E.USER_NOT_BUCKETED_INTO_TARGETING_RULE,Ae,O,v),o.push([E.USER_NOT_BUCKETED_INTO_TARGETING_RULE,Ae,O,v]),a=!0)):(this.logger.log(u.DEBUG,E.USER_DOESNT_MEET_CONDITIONS_FOR_TARGETING_RULE,Ae,O,v),o.push([E.USER_DOESNT_MEET_CONDITIONS_FOR_TARGETING_RULE,Ae,O,v])),{result:h,reasons:o,skipToEveryoneElse:a}},e}();function De(e,t){if(e.hasOwnProperty("revenue")){var r=e.revenue,i=void 0;return"string"==typeof r?(i=parseInt(r),isNaN(i)?(t.log(u.INFO,E.FAILED_TO_PARSE_REVENUE,"EVENT_TAG_UTILS",r),null):(t.log(u.INFO,E.PARSED_REVENUE_VALUE,"EVENT_TAG_UTILS",i),i)):"number"==typeof r?(i=r,t.log(u.INFO,E.PARSED_REVENUE_VALUE,"EVENT_TAG_UTILS",i),i):null}return null}function Se(e,t){if(e.hasOwnProperty("value")){var r=e.value,i=void 0;return"string"==typeof r?(i=parseFloat(r),isNaN(i)?(t.log(u.INFO,E.FAILED_TO_PARSE_VALUE,"EVENT_TAG_UTILS",r),null):(t.log(u.INFO,E.PARSED_NUMERIC_VALUE,"EVENT_TAG_UTILS",i),i)):"number"==typeof r?(i=r,t.log(u.INFO,E.PARSED_NUMERIC_VALUE,"EVENT_TAG_UTILS",i),i):null}return null}function Le(e,t){return"string"==typeof e&&("string"==typeof t||"boolean"==typeof t||B.isNumber(t)&&B.isSafeInteger(t))}var me="https://logx.optimizely.com/v1/events";function Ve(e){var t=e.attributes,r=e.userId,i=e.clientEngine,n=e.clientVersion,o=e.configObj,a=e.logger,s=!!o.anonymizeIP&&o.anonymizeIP,u=o.botFiltering,l={snapshots:[],visitor_id:r,attributes:[]},E={account_id:o.accountId,project_id:o.projectId,visitors:[l],revision:o.revision,client_name:i,client_version:n,anonymize_ip:s,enrich_decisions:!0};return t&&Object.keys(t||{}).forEach((function(e){if(Le(e,t[e])){var r=w(o,e,a);r&&E.visitors[0].attributes.push({entity_id:r,key:e,type:"custom",value:t[e]})}})),"boolean"==typeof u&&E.visitors[0].attributes.push({entity_id:I.BOT_FILTERING,key:I.BOT_FILTERING,type:"custom",value:u}),E}function Ce(e){var t,r,i,n,o,a,s,u,l,E=Ve(e),I=(t=e.configObj,r=e.experimentId,i=e.variationId,n=e.ruleKey,o=e.ruleType,a=e.flagKey,s=e.enabled,u=r?G(t,r):null,l=i?Y(t,i):null,{decisions:[{campaign_id:u,experiment_id:r,variation_id:i,metadata:{flag_key:a,rule_key:n,rule_type:o,variation_key:l=l||"",enabled:s}}],events:[{entity_id:u,timestamp:B.currentTimestamp(),key:"campaign_activated",uuid:B.uuid()}]});return E.visitors[0].snapshots.push(I),{httpVerb:"POST",url:me,params:E}}function Fe(e){var t=Ve(e),r=function(e,t,r,i){var n={events:[]},o={entity_id:j(e,t),timestamp:B.currentTimestamp(),uuid:B.uuid(),key:t};if(i){var a=De(i,r);null!==a&&(o.revenue=a);var s=Se(i,r);null!==s&&(o.value=s),o.tags=i}return n.events.push(o),n}(e.configObj,e.eventKey,e.logger,e.eventTags);return t.visitors[0].snapshots=[r],{httpVerb:"POST",url:me,params:t}}function Me(e){var t,r;return null!==(r=null===(t=e.experiment)||void 0===t?void 0:t.key)&&void 0!==r?r:""}function Pe(e){var t,r;return null!==(r=null===(t=e.variation)||void 0===t?void 0:t.key)&&void 0!==r?r:""}function be(e){var t,r;return null!==(r=null===(t=e.variation)||void 0===t?void 0:t.featureEnabled)&&void 0!==r&&r}function ke(e){var t,r;return null!==(r=null===(t=e.experiment)||void 0===t?void 0:t.id)&&void 0!==r?r:null}function Be(e){var t,r;return null!==(r=null===(t=e.variation)||void 0===t?void 0:t.id)&&void 0!==r?r:null}var Ke=t.getLogger("EVENT_BUILDER");function xe(e,t){var r=[];return t&&Object.keys(t||{}).forEach((function(i){if(Le(i,t[i])){var n=w(e,i,Ke);n&&r.push({entityId:n,key:i,value:t[i]})}})),r}var Ge="USER_PROFILE_SERVICE_VALIDATOR";var we=function(){function e(e){var t,r=this,n=e.clientEngine;n||(e.logger.log(u.INFO,E.INVALID_CLIENT_ENGINE,"OPTIMIZELY",n),n="node-sdk"),this.clientEngine=n,this.clientVersion=e.clientVersion||"4.9.1",this.errorHandler=e.errorHandler,this.isOptimizelyConfigValid=e.isValidInstance,this.logger=e.logger;var o=null!==(t=e.defaultDecideOptions)&&void 0!==t?t:[];Array.isArray(o)||(this.logger.log(u.DEBUG,E.INVALID_DEFAULT_DECIDE_OPTIONS,"OPTIMIZELY"),o=[]);var a={};o.forEach((function(e){exports.OptimizelyDecideOption[e]?a[e]=!0:r.logger.log(u.WARNING,E.UNRECOGNIZED_DECIDE_OPTION,"OPTIMIZELY",e)})),this.defaultDecideOptions=a,this.projectConfigManager=function(e){return new re(e)}({datafile:e.datafile,jsonSchemaValidator:e.jsonSchemaValidator,sdkKey:e.sdkKey,datafileManager:e.datafileManager}),this.disposeOnUpdate=this.projectConfigManager.onUpdate((function(e){r.logger.log(u.INFO,E.UPDATED_OPTIMIZELY_CONFIG,"OPTIMIZELY",e.revision,e.projectId),r.notificationCenter.sendNotifications(c.OPTIMIZELY_CONFIG_UPDATE)}));var s,I=this.projectConfigManager.onReady(),f=null;if(e.userProfileService)try{(function(e){if("object"==typeof e&&null!==e){if("function"!=typeof e.lookup)throw new Error(i.sprintf(l.INVALID_USER_PROFILE_SERVICE,Ge,"Missing function 'lookup'"));if("function"!=typeof e.save)throw new Error(i.sprintf(l.INVALID_USER_PROFILE_SERVICE,Ge,"Missing function 'save'"));return!0}throw new Error(i.sprintf(l.INVALID_USER_PROFILE_SERVICE,Ge))})(e.userProfileService)&&(f=e.userProfileService,this.logger.log(u.INFO,E.VALID_USER_PROFILE_SERVICE,"OPTIMIZELY"))}catch(e){this.logger.log(u.WARNING,e.message)}this.decisionService=(s={userProfileService:f,logger:this.logger,UNSTABLE_conditionEvaluators:e.UNSTABLE_conditionEvaluators},new Ue(s)),this.notificationCenter=e.notificationCenter,this.eventProcessor=e.eventProcessor;var _=this.eventProcessor.start();this.readyPromise=Promise.all([I,_]).then((function(e){return e[0]})),this.readyTimeouts={},this.nextReadyTimeoutId=0}return e.prototype.isValidInstance=function(){return this.isOptimizelyConfigValid&&!!this.projectConfigManager.getConfig()},e.prototype.activate=function(e,t,r){try{if(!this.isValidInstance())return this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","activate"),null;if(!this.validateInputs({experiment_key:e,user_id:t},r))return this.notActivatingExperiment(e,t);var i=this.projectConfigManager.getConfig();if(!i)return null;try{var n=this.getVariation(e,t,r);if(null===n)return this.notActivatingExperiment(e,t);if(!function(e,t){return"Running"===H(e,t)}(i,e))return this.logger.log(u.DEBUG,E.SHOULD_NOT_DISPATCH_ACTIVATE,"OPTIMIZELY",e),n;var o=X(i,e),a={experiment:o,variation:o.variationKeyMap[n],decisionSource:_.EXPERIMENT};return this.sendImpressionEvent(a,"",t,!0,r),n}catch(r){return this.logger.log(u.ERROR,r.message),this.logger.log(u.INFO,E.NOT_ACTIVATING_USER,"OPTIMIZELY",t,e),this.errorHandler.handleError(r),null}}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.sendImpressionEvent=function(e,t,r,i,n){var o=this.projectConfigManager.getConfig();if(o){var a=function(e){var t=e.configObj,r=e.decisionObj,i=e.userId,n=e.flagKey,o=e.enabled,a=e.userAttributes,s=e.clientEngine,u=e.clientVersion,l=r.decisionSource,E=Me(r),I=ke(r),c=Pe(r),f=Be(r),_=null!==I?G(t,I):null;return{type:"impression",timestamp:B.currentTimestamp(),uuid:B.uuid(),user:{id:i,attributes:xe(t,a)},context:{accountId:t.accountId,projectId:t.projectId,revision:t.revision,clientName:s,clientVersion:u,anonymizeIP:t.anonymizeIP||!1,botFiltering:t.botFiltering},layer:{id:_},experiment:{id:I,key:E},variation:{id:f,key:c},ruleKey:E,flagKey:n,ruleType:l,enabled:o}}({decisionObj:e,flagKey:t,enabled:i,userId:r,userAttributes:n,clientEngine:this.clientEngine,clientVersion:this.clientVersion,configObj:o});this.eventProcessor.process(a),this.emitNotificationCenterActivate(e,t,r,i,n)}},e.prototype.emitNotificationCenterActivate=function(e,t,r,i,n){var o=this.projectConfigManager.getConfig();if(o){var a,s=e.decisionSource,u=Me(e),l=ke(e),E=Pe(e),I=Be(e);null!==l&&""!==E&&(a=o.experimentIdMap[l]);var f,_=Ce({attributes:n,clientEngine:this.clientEngine,clientVersion:this.clientVersion,configObj:o,experimentId:l,ruleKey:u,flagKey:t,ruleType:s,userId:r,enabled:i,variationId:I,logger:this.logger});a&&a.variationKeyMap&&""!==E&&(f=a.variationKeyMap[E]),this.notificationCenter.sendNotifications(c.ACTIVATE,{experiment:a,userId:r,attributes:n,variation:f,logEvent:_})}},e.prototype.track=function(e,t,r,i){try{if(!this.isValidInstance())return void this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","track");if(!this.validateInputs({user_id:t,event_key:e},r,i))return;var n=this.projectConfigManager.getConfig();if(!n)return;if(!function(e,t){return e.eventKeyMap.hasOwnProperty(t)}(n,e))return this.logger.log(u.WARNING,E.EVENT_KEY_NOT_FOUND,"OPTIMIZELY",e),void this.logger.log(u.WARNING,E.NOT_TRACKING_USER,"OPTIMIZELY",t);var o=function(e){var t=e.configObj,r=e.userId,i=e.userAttributes,n=e.clientEngine,o=e.clientVersion,a=e.eventKey,s=e.eventTags,u=j(t,a),l=s?De(s,Ke):null,E=s?Se(s,Ke):null;return{type:"conversion",timestamp:B.currentTimestamp(),uuid:B.uuid(),user:{id:r,attributes:xe(t,i)},context:{accountId:t.accountId,projectId:t.projectId,revision:t.revision,clientName:n,clientVersion:o,anonymizeIP:t.anonymizeIP||!1,botFiltering:t.botFiltering},event:{id:u,key:a},revenue:l,value:E,tags:s}}({eventKey:e,eventTags:i=this.filterEmptyValues(i),userId:t,userAttributes:r,clientEngine:this.clientEngine,clientVersion:this.clientVersion,configObj:n});this.logger.log(u.INFO,E.TRACK_EVENT,"OPTIMIZELY",e,t),this.eventProcessor.process(o),this.emitNotificationCenterTrack(e,t,r,i)}catch(e){this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),this.logger.log(u.ERROR,E.NOT_TRACKING_USER,"OPTIMIZELY",t)}},e.prototype.emitNotificationCenterTrack=function(e,t,r,i){try{var n=this.projectConfigManager.getConfig();if(!n)return;var o=Fe({attributes:r,clientEngine:this.clientEngine,clientVersion:this.clientVersion,configObj:n,eventKey:e,eventTags:i,logger:this.logger,userId:t});this.notificationCenter.sendNotifications(c.TRACK,{eventKey:e,userId:t,attributes:r,eventTags:i,logEvent:o})}catch(e){this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e)}},e.prototype.getVariation=function(e,t,r){try{if(!this.isValidInstance())return this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","getVariation"),null;try{if(!this.validateInputs({experiment_key:e,user_id:t},r))return null;var i=this.projectConfigManager.getConfig();if(!i)return null;var n=i.experimentKeyMap[e];if(!n)return this.logger.log(u.DEBUG,l.INVALID_EXPERIMENT_KEY,"OPTIMIZELY",e),null;var o=this.decisionService.getVariation(i,n,this.createUserContext(t,r)).result,a=(s=i,I=n.id,s.experimentFeatureMap.hasOwnProperty(I)?f.FEATURE_TEST:f.AB_TEST);return this.notificationCenter.sendNotifications(c.DECISION,{type:a,userId:t,attributes:r||{},decisionInfo:{experimentKey:e,variationKey:o}}),o}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}var s,I},e.prototype.setForcedVariation=function(e,t,r){if(!this.validateInputs({experiment_key:e,user_id:t}))return!1;var i=this.projectConfigManager.getConfig();if(!i)return!1;try{return this.decisionService.setForcedVariation(i,e,t,r)}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),!1}},e.prototype.getForcedVariation=function(e,t){if(!this.validateInputs({experiment_key:e,user_id:t}))return null;var r=this.projectConfigManager.getConfig();if(!r)return null;try{return this.decisionService.getForcedVariation(r,e,t).result}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.validateInputs=function(e,t,r){try{if(e.hasOwnProperty("user_id")){var n=e.user_id;if("string"!=typeof n||null===n||"undefined"===n)throw new Error(i.sprintf(l.INVALID_INPUT_FORMAT,"OPTIMIZELY","user_id"));delete e.user_id}return Object.keys(e).forEach((function(t){if(!ye(e[t]))throw new Error(i.sprintf(l.INVALID_INPUT_FORMAT,"OPTIMIZELY",t))})),t&&function(e){if("object"!=typeof e||Array.isArray(e)||null===e)throw new Error(i.sprintf(l.INVALID_ATTRIBUTES,"ATTRIBUTES_VALIDATOR"));Object.keys(e).forEach((function(t){if(void 0===e[t])throw new Error(i.sprintf(l.UNDEFINED_ATTRIBUTE,"ATTRIBUTES_VALIDATOR",t))}))}(t),r&&function(e){if("object"!=typeof e||Array.isArray(e)||null===e)throw new Error(i.sprintf(l.INVALID_EVENT_TAGS,"EVENT_TAGS_VALIDATOR"))}(r),!0}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),!1}},e.prototype.notActivatingExperiment=function(e,t){return this.logger.log(u.INFO,E.NOT_ACTIVATING_USER,"OPTIMIZELY",t,e),null},e.prototype.filterEmptyValues=function(e){for(var t in e)!e.hasOwnProperty(t)||null!==e[t]&&void 0!==e[t]||delete e[t];return e},e.prototype.isFeatureEnabled=function(e,t,r){try{if(!this.isValidInstance())return this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","isFeatureEnabled"),!1;if(!this.validateInputs({feature_key:e,user_id:t},r))return!1;var i=this.projectConfigManager.getConfig();if(!i)return!1;var n=W(i,e,this.logger);if(!n)return!1;var o={},a=this.createUserContext(t,r),s=this.decisionService.getVariationForFeature(i,n,a).result,l=s.decisionSource,I=Me(s),d=Pe(s),g=be(s);l===_.FEATURE_TEST&&(o={experimentKey:I,variationKey:d}),(l===_.FEATURE_TEST||l===_.ROLLOUT&&Q(i))&&this.sendImpressionEvent(s,n.key,t,g,r),!0===g?this.logger.log(u.INFO,E.FEATURE_ENABLED_FOR_USER,"OPTIMIZELY",e,t):(this.logger.log(u.INFO,E.FEATURE_NOT_ENABLED_FOR_USER,"OPTIMIZELY",e,t),g=!1);var p={featureKey:e,featureEnabled:g,source:s.decisionSource,sourceInfo:o};return this.notificationCenter.sendNotifications(c.DECISION,{type:f.FEATURE,userId:t,attributes:r||{},decisionInfo:p}),g}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),!1}},e.prototype.getEnabledFeatures=function(e,t){var r=this;try{var n=[];if(!this.isValidInstance())return this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","getEnabledFeatures"),n;if(!this.validateInputs({user_id:e}))return n;var o=this.projectConfigManager.getConfig();return o?(i.objectValues(o.featureKeyMap).forEach((function(i){r.isFeatureEnabled(i.key,e,t)&&n.push(i.key)})),n):n}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),[]}},e.prototype.getFeatureVariable=function(e,t,r,i){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,null,r,i):(this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariable"),null)}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getFeatureVariableForType=function(e,t,r,i,n){if(!this.validateInputs({feature_key:e,variable_key:t,user_id:i},n))return null;var o=this.projectConfigManager.getConfig();if(!o)return null;var a=W(o,e,this.logger);if(!a)return null;var s=function(e,t,r,i){var n=e.featureKeyMap[t];if(!n)return i.log(u.ERROR,l.FEATURE_NOT_IN_DATAFILE,K,t),null;var o=n.variableKeyMap[r];return o||(i.log(u.ERROR,l.VARIABLE_KEY_NOT_IN_DATAFILE,K,r,t),null)}(o,e,t,this.logger);if(!s)return null;if(r&&s.type!==r)return this.logger.log(u.WARNING,E.VARIABLE_REQUESTED_WITH_WRONG_TYPE,"OPTIMIZELY",r,s.type),null;var I=this.createUserContext(i,n),d=this.decisionService.getVariationForFeature(o,a,I).result,g=be(d),p=this.getFeatureVariableValueFromVariation(e,g,d.variation,s,i),O={};return d.decisionSource===_.FEATURE_TEST&&null!==d.experiment&&null!==d.variation&&(O={experimentKey:d.experiment.key,variationKey:d.variation.key}),this.notificationCenter.sendNotifications(c.DECISION,{type:f.FEATURE_VARIABLE,userId:i,attributes:n||{},decisionInfo:{featureKey:e,featureEnabled:g,source:d.decisionSource,variableKey:t,variableValue:p,variableType:s.type,sourceInfo:O}}),p},e.prototype.getFeatureVariableValueFromVariation=function(e,t,r,i,n){var o=this.projectConfigManager.getConfig();if(!o)return null;var a=i.defaultValue;if(null!==r){var s=function(e,t,r,i){if(!t||!r)return null;if(!e.variationVariableUsageMap.hasOwnProperty(r.id))return i.log(u.ERROR,l.VARIATION_ID_NOT_IN_DATAFILE_NO_EXPERIMENT,K,r.id),null;var n=e.variationVariableUsageMap[r.id][t.id];return n?n.value:null}(o,i,r,this.logger);null!==s?t?(a=s,this.logger.log(u.INFO,E.USER_RECEIVED_VARIABLE_VALUE,"OPTIMIZELY",a,i.key,e)):this.logger.log(u.INFO,E.FEATURE_NOT_ENABLED_RETURN_DEFAULT_VARIABLE_VALUE,"OPTIMIZELY",e,n,a):this.logger.log(u.INFO,E.VARIABLE_NOT_USED_RETURN_DEFAULT_VARIABLE_VALUE,"OPTIMIZELY",i.key,r.key)}else this.logger.log(u.INFO,E.USER_RECEIVED_DEFAULT_VARIABLE_VALUE,"OPTIMIZELY",n,i.key,e);return function(e,t,r){var i;switch(t){case g.BOOLEAN:"true"!==e&&"false"!==e?(r.log(u.ERROR,l.UNABLE_TO_CAST_VALUE,K,e,t),i=null):i="true"===e;break;case g.INTEGER:i=parseInt(e,10),isNaN(i)&&(r.log(u.ERROR,l.UNABLE_TO_CAST_VALUE,K,e,t),i=null);break;case g.DOUBLE:i=parseFloat(e),isNaN(i)&&(r.log(u.ERROR,l.UNABLE_TO_CAST_VALUE,K,e,t),i=null);break;case g.JSON:try{i=JSON.parse(e)}catch(n){r.log(u.ERROR,l.UNABLE_TO_CAST_VALUE,K,e,t),i=null}break;default:i=e}return i}(a,i.type,this.logger)},e.prototype.getFeatureVariableBoolean=function(e,t,r,i){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,g.BOOLEAN,r,i):(this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariableBoolean"),null)}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getFeatureVariableDouble=function(e,t,r,i){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,g.DOUBLE,r,i):(this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariableDouble"),null)}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getFeatureVariableInteger=function(e,t,r,i){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,g.INTEGER,r,i):(this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariableInteger"),null)}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getFeatureVariableString=function(e,t,r,i){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,g.STRING,r,i):(this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariableString"),null)}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getFeatureVariableJSON=function(e,t,r,i){try{return this.isValidInstance()?this.getFeatureVariableForType(e,t,g.JSON,r,i):(this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","getFeatureVariableJSON"),null)}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getAllFeatureVariables=function(e,t,r){var i=this;try{if(!this.isValidInstance())return this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","getAllFeatureVariables"),null;if(!this.validateInputs({feature_key:e,user_id:t},r))return null;var n=this.projectConfigManager.getConfig();if(!n)return null;var o=W(n,e,this.logger);if(!o)return null;var a=this.createUserContext(t,r),s=this.decisionService.getVariationForFeature(n,o,a).result,l=be(s),I={};o.variables.forEach((function(r){I[r.key]=i.getFeatureVariableValueFromVariation(e,l,s.variation,r,t)}));var d={};return s.decisionSource===_.FEATURE_TEST&&null!==s.experiment&&null!==s.variation&&(d={experimentKey:s.experiment.key,variationKey:s.variation.key}),this.notificationCenter.sendNotifications(c.DECISION,{type:f.ALL_FEATURE_VARIABLES,userId:t,attributes:r||{},decisionInfo:{featureKey:e,featureEnabled:l,source:s.decisionSource,variableValues:I,sourceInfo:d}}),I}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.getOptimizelyConfig=function(){try{return this.projectConfigManager.getConfig()?this.projectConfigManager.getOptimizelyConfig():null}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),null}},e.prototype.close=function(){var e=this;try{var t=this.eventProcessor.stop();return this.disposeOnUpdate&&(this.disposeOnUpdate(),this.disposeOnUpdate=null),this.projectConfigManager&&this.projectConfigManager.stop(),Object.keys(this.readyTimeouts).forEach((function(t){var r=e.readyTimeouts[t];clearTimeout(r.readyTimeout),r.onClose()})),this.readyTimeouts={},t.then((function(){return{success:!0}}),(function(e){return{success:!1,reason:String(e)}}))}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),Promise.resolve({success:!1,reason:String(e)})}},e.prototype.onReady=function(e){var t,r,n=this;"object"==typeof e&&null!==e&&void 0!==e.timeout&&(t=e.timeout),B.isSafeInteger(t)||(t=3e4);var o=new Promise((function(e){r=e})),a=this.nextReadyTimeoutId;this.nextReadyTimeoutId++;var s=setTimeout((function(){delete n.readyTimeouts[a],r({success:!1,reason:i.sprintf("onReady timeout expired after %s ms",t)})}),t);return this.readyTimeouts[a]={readyTimeout:s,onClose:function(){r({success:!1,reason:"Instance closed"})}},this.readyPromise.then((function(){clearTimeout(s),delete n.readyTimeouts[a],r({success:!0})})),Promise.race([this.readyPromise,o])},e.prototype.createUserContext=function(e,t){return this.validateInputs({user_id:e},t)?new F({optimizely:this,userId:e,attributes:t}):null},e.prototype.decide=function(e,t,r){var n,o,a,I,d=this;void 0===r&&(r=[]);var g,p=e.getUserId(),N=e.getAttributes(),R=this.projectConfigManager.getConfig(),T=[];if(!this.isValidInstance()||!R)return this.logger.log(u.INFO,E.INVALID_OBJECT,"OPTIMIZELY","decide"),C(t,e,[O.SDK_NOT_READY]);var v=R.featureKeyMap[t];if(!v)return this.logger.log(u.ERROR,l.FEATURE_NOT_IN_DATAFILE,"OPTIMIZELY",t),C(t,e,[i.sprintf(O.FLAG_KEY_INVALID,t)]);var h=this.getAllDecideOptions(r),y=this.decisionService.findValidatedForcedDecision(R,e,t);T.push.apply(T,y.reasons);var A=y.result;if(A)g={experiment:null,variation:A,decisionSource:_.FEATURE_TEST};else{var U=this.decisionService.getVariationForFeature(R,v,e,h);T.push.apply(T,U.reasons),g=U.result}var D=g.decisionSource,S=null!==(o=null===(n=g.experiment)||void 0===n?void 0:n.key)&&void 0!==o?o:null,L=null!==(I=null===(a=g.variation)||void 0===a?void 0:a.key)&&void 0!==I?I:null,m=be(g);!0===m?this.logger.log(u.INFO,E.FEATURE_ENABLED_FOR_USER,"OPTIMIZELY",t,p):this.logger.log(u.INFO,E.FEATURE_NOT_ENABLED_FOR_USER,"OPTIMIZELY",t,p);var V={},F=!1;h[exports.OptimizelyDecideOption.EXCLUDE_VARIABLES]||v.variables.forEach((function(e){V[e.key]=d.getFeatureVariableValueFromVariation(t,m,g.variation,e,p)})),!h[exports.OptimizelyDecideOption.DISABLE_DECISION_EVENT]&&(D===_.FEATURE_TEST||D===_.ROLLOUT&&Q(R))&&(this.sendImpressionEvent(g,t,p,m,N),F=!0);var M=[];h[exports.OptimizelyDecideOption.INCLUDE_REASONS]&&(M=T.map((function(e){return i.sprintf.apply(void 0,s([e[0]],e.slice(1)))})));var P={flagKey:t,enabled:m,variationKey:L,ruleKey:S,variables:V,reasons:M,decisionEventDispatched:F};return this.notificationCenter.sendNotifications(c.DECISION,{type:f.FLAG,userId:p,attributes:N,decisionInfo:P}),{variationKey:L,enabled:m,variables:V,ruleKey:S,flagKey:t,userContext:e,reasons:M}},e.prototype.getAllDecideOptions=function(e){var t=this,r=a({},this.defaultDecideOptions);return Array.isArray(e)?e.forEach((function(e){exports.OptimizelyDecideOption[e]?r[e]=!0:t.logger.log(u.WARNING,E.UNRECOGNIZED_DECIDE_OPTION,"OPTIMIZELY",e)})):this.logger.log(u.DEBUG,E.INVALID_DECIDE_OPTIONS,"OPTIMIZELY"),r},e.prototype.decideForKeys=function(e,t,r){var i=this;void 0===r&&(r=[]);var n={};if(!this.isValidInstance())return this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","decideForKeys"),n;if(0===t.length)return n;var o=this.getAllDecideOptions(r);return t.forEach((function(t){var a=i.decide(e,t,r);o[exports.OptimizelyDecideOption.ENABLED_FLAGS_ONLY]&&!a.enabled||(n[t]=a)})),n},e.prototype.decideAll=function(e,t){void 0===t&&(t=[]);var r=this.projectConfigManager.getConfig();if(!this.isValidInstance()||!r)return this.logger.log(u.ERROR,E.INVALID_OBJECT,"OPTIMIZELY","decideAll"),{};var i=Object.keys(r.featureKeyMap);return this.decideForKeys(e,i,t)},e}(),je=function(e){return!("number"!=typeof e||!B.isSafeInteger(e))&&e>=1},He=function(e){return!("number"!=typeof e||!B.isSafeInteger(e))&&e>0},Ye=function(){function e(e){var t=this;this.logger=e.logger,this.errorHandler=e.errorHandler,this.notificationListeners={},i.objectValues(c).forEach((function(e){t.notificationListeners[e]=[]})),this.listenerId=1}return e.prototype.addNotificationListener=function(e,t){try{if(!(i.objectValues(c).indexOf(e)>-1))return-1;this.notificationListeners[e]||(this.notificationListeners[e]=[]);var r=!1;if((this.notificationListeners[e]||[]).forEach((function(e){e.callback!==t||(r=!0)})),r)return-1;this.notificationListeners[e].push({id:this.listenerId,callback:t});var n=this.listenerId;return this.listenerId+=1,n}catch(e){return this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e),-1}},e.prototype.removeNotificationListener=function(e){var t=this;try{var r,i;if(Object.keys(this.notificationListeners).some((function(n){return(t.notificationListeners[n]||[]).every((function(t,o){return t.id!==e||(r=o,i=n,!1)})),void 0!==r&&void 0!==i})),void 0!==r&&void 0!==i)return this.notificationListeners[i].splice(r,1),!0}catch(e){this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e)}return!1},e.prototype.clearAllNotificationListeners=function(){var e=this;try{i.objectValues(c).forEach((function(t){e.notificationListeners[t]=[]}))}catch(e){this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e)}},e.prototype.clearNotificationListeners=function(e){try{this.notificationListeners[e]=[]}catch(e){this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e)}},e.prototype.sendNotifications=function(e,t){var r=this;try{(this.notificationListeners[e]||[]).forEach((function(i){var n=i.callback;try{n(t)}catch(t){r.logger.log(u.ERROR,E.NOTIFICATION_LISTENER_EXCEPTION,"NOTIFICATION_CENTER",e,t.message)}}))}catch(e){this.logger.log(u.ERROR,e.message),this.errorHandler.handleError(e)}},e}();var Xe={createEventProcessor:function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return new(r.LogTierV1EventProcessor.bind.apply(r.LogTierV1EventProcessor,s([void 0],e)))},LocalStoragePendingEventsDispatcher:r.LocalStoragePendingEventsDispatcher};function ze(e,t,r,i){var n={sdkKey:e};if((void 0===i||"object"==typeof i&&null!==i)&&B.assign(n,i),r){var a=$({datafile:r,jsonSchemaValidator:void 0,logger:t}),s=a.configObj,u=a.error;u&&t.error(u),s&&(n.datafile=q(s))}return new o.HttpPollingDatafileManager(n)}var Je=t.getLogger();t.setLogHandler(S()),t.setLogLevel(t.LogLevel.INFO);var Ze=!1,We=function(e){try{e.errorHandler&&t.setErrorHandler(e.errorHandler),e.logger&&(t.setLogHandler(e.logger),t.setLogLevel(t.LogLevel.NOTSET)),void 0!==e.logLevel&&t.setLogLevel(e.logLevel);try{v(e),e.isValidInstance=!0}catch(t){Je.error(t),e.isValidInstance=!1}var i=void 0;null==e.eventDispatcher?(i=new r.LocalStoragePendingEventsDispatcher({eventDispatcher:U}),Ze||(i.sendPendingEvents(),Ze=!0)):i=e.eventDispatcher;var n=e.eventBatchSize,o=e.eventFlushInterval;je(e.eventBatchSize)||(Je.warn("Invalid eventBatchSize %s, defaulting to %s",e.eventBatchSize,10),n=10),He(e.eventFlushInterval)||(Je.warn("Invalid eventFlushInterval %s, defaulting to %s",e.eventFlushInterval,1e3),o=1e3);var s=t.getErrorHandler(),u=new Ye({logger:Je,errorHandler:s}),l={dispatcher:i,flushInterval:o,batchSize:n,maxQueueSize:e.eventMaxQueueSize||1e4,notificationCenter:u},I=a(a({clientEngine:"javascript-sdk"},e),{eventProcessor:Xe.createEventProcessor(l),logger:Je,errorHandler:s,datafileManager:e.sdkKey?ze(e.sdkKey,Je,e.datafile,e.datafileOptions):void 0,notificationCenter:u}),c=new we(I);try{if("function"==typeof window.addEventListener){var f="onpagehide"in window?"pagehide":"unload";window.addEventListener(f,(function(){c.close()}),!1)}}catch(e){Je.error(E.UNABLE_TO_ATTACH_UNLOAD,"INDEX_BROWSER",e.message)}return c}catch(e){return Je.error(e),null}},qe=function(){Ze=!1},$e={logging:V,errorHandler:y,eventDispatcher:U,enums:N,setLogger:t.setLogHandler,setLogLevel:t.setLogLevel,createInstance:We,__internalResetRetryState:qe,OptimizelyDecideOption:exports.OptimizelyDecideOption};Object.defineProperty(exports, "setLogLevel", ({enumerable:!0,get:function(){return t.setLogLevel}})),Object.defineProperty(exports, "setLogger", ({enumerable:!0,get:function(){return t.setLogHandler}})),exports.__internalResetRetryState=qe,exports.createInstance=We,exports["default"]=$e,exports.enums=N,exports.errorHandler=y,exports.eventDispatcher=U,exports.logging=V;
//# sourceMappingURL=optimizely.browser.min.js.map


/***/ }),

/***/ "./node_modules/kmc-ffi/kmc.js":
/*!*************************************!*\
  !*** ./node_modules/kmc-ffi/kmc.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "kmc_get_key_type": () => (/* binding */ kmc_get_key_type),
/* harmony export */   "kmc_get_user_agent": () => (/* binding */ kmc_get_user_agent),
/* harmony export */   "kmc_get_app_instance_id": () => (/* binding */ kmc_get_app_instance_id),
/* harmony export */   "kmc_migrate_database": () => (/* binding */ kmc_migrate_database),
/* harmony export */   "kmc_import": () => (/* binding */ kmc_import),
/* harmony export */   "kmc_handle_url": () => (/* binding */ kmc_handle_url),
/* harmony export */   "kmc_embedded_public_oidc": () => (/* binding */ kmc_embedded_public_oidc),
/* harmony export */   "kmc_embedded_confidential_oidc": () => (/* binding */ kmc_embedded_confidential_oidc),
/* harmony export */   "kmc_export": () => (/* binding */ kmc_export),
/* harmony export */   "kmc_delete_profile": () => (/* binding */ kmc_delete_profile),
/* harmony export */   "kmc_create_profile": () => (/* binding */ kmc_create_profile),
/* harmony export */   "kmc_create_pkce": () => (/* binding */ kmc_create_pkce),
/* harmony export */   "kmc_cancel": () => (/* binding */ kmc_cancel),
/* harmony export */   "kmc_all_credentials": () => (/* binding */ kmc_all_credentials),
/* harmony export */   "kmc_delete_credential": () => (/* binding */ kmc_delete_credential),
/* harmony export */   "kmc_list_credentials": () => (/* binding */ kmc_list_credentials),
/* harmony export */   "kmc_url_type": () => (/* binding */ kmc_url_type),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _snippets_authlib_7db35f1893504f15_src_store_credential_db_indexeddb_js_target_credstore_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./snippets/authlib-7db35f1893504f15/src/store/credential/db/indexeddb/js/target/credstore.js */ "./node_modules/kmc-ffi/snippets/authlib-7db35f1893504f15/src/store/credential/db/indexeddb/js/target/credstore.js");
/* harmony import */ var _snippets_common_9958b286e1acf929_inline0_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./snippets/common-9958b286e1acf929/inline0.js */ "./node_modules/kmc-ffi/snippets/common-9958b286e1acf929/inline0.js");
/* harmony import */ var _snippets_crypto_7439096d35d6fc1f_src_ecdsa_wasm_js_crypto_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./snippets/crypto-7439096d35d6fc1f/src/ecdsa_wasm/js/crypto.js */ "./node_modules/kmc-ffi/snippets/crypto-7439096d35d6fc1f/src/ecdsa_wasm/js/crypto.js");
/* harmony import */ var _snippets_hal_bc6192ecc6d6c47e_src_wasm_legacy_js_target_hal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./snippets/hal-bc6192ecc6d6c47e/src/wasm/legacy/js/target/hal.js */ "./node_modules/kmc-ffi/snippets/hal-bc6192ecc6d6c47e/src/wasm/legacy/js/target/hal.js");
/* harmony import */ var _snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./snippets/kmc-js-a8479199104cfb09/src/js/dist/kmc.js */ "./node_modules/kmc-ffi/snippets/kmc-js-a8479199104cfb09/src/js/dist/kmc.js");






let wasm;

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_38(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h27858a87ec431f1e(arg0, arg1, addHeapObject(arg2));
}

/**
* Returns the type of the key, "webauthn" or "subtle" for a specified credential.
* @param {string} handle
* @returns {Promise<any>}
*/
function kmc_get_key_type(handle) {
    const ret = wasm.kmc_get_key_type(addHeapObject(handle));
    return takeObject(ret);
}

/**
* @returns {Promise<any>}
*/
function kmc_get_user_agent() {
    const ret = wasm.kmc_get_user_agent();
    return takeObject(ret);
}

/**
* @returns {Promise<string>}
*/
function kmc_get_app_instance_id() {
    const ret = wasm.kmc_get_app_instance_id();
    return takeObject(ret);
}

/**
* @param {string | undefined} allowed_domains
*/
function kmc_migrate_database(allowed_domains) {
    wasm.kmc_migrate_database(isLikeNone(allowed_domains) ? 0 : addHeapObject(allowed_domains));
}

/**
* @param {string} token
* @param {Function} cb
* @returns {Promise<any>}
*/
function kmc_import(token, cb) {
    const ret = wasm.kmc_import(addHeapObject(token), addHeapObject(cb));
    return takeObject(ret);
}

/**
* @param {string} url
* @param {any} allowed_domains
* @param {string} trusted_source
* @param {Function} cb
* @returns {Promise<any>}
*/
function kmc_handle_url(url, allowed_domains, trusted_source, cb) {
    const ret = wasm.kmc_handle_url(addHeapObject(url), addHeapObject(allowed_domains), addHeapObject(trusted_source), addHeapObject(cb));
    return takeObject(ret);
}

/**
* @param {string} auth_url
* @param {string} token_url
* @param {string} client_id
* @param {string} redirect_uri
* @param {string | undefined} nonce
* @param {Function} cb
* @returns {Promise<any>}
*/
function kmc_embedded_public_oidc(auth_url, token_url, client_id, redirect_uri, nonce, cb) {
    const ret = wasm.kmc_embedded_public_oidc(addHeapObject(auth_url), addHeapObject(token_url), addHeapObject(client_id), addHeapObject(redirect_uri), isLikeNone(nonce) ? 0 : addHeapObject(nonce), addHeapObject(cb));
    return takeObject(ret);
}

/**
* @param {string} auth_url
* @param {string} client_id
* @param {string} redirect_uri
* @param {string} scope
* @param {any} pkce_challenge
* @param {string | undefined} nonce
* @param {Function} cb
* @returns {Promise<any>}
*/
function kmc_embedded_confidential_oidc(auth_url, client_id, redirect_uri, scope, pkce_challenge, nonce, cb) {
    const ret = wasm.kmc_embedded_confidential_oidc(addHeapObject(auth_url), addHeapObject(client_id), addHeapObject(redirect_uri), addHeapObject(scope), addHeapObject(pkce_challenge), isLikeNone(nonce) ? 0 : addHeapObject(nonce), addHeapObject(cb));
    return takeObject(ret);
}

/**
* @param {string} handle
* @param {Function} cb
* @returns {Promise<any>}
*/
function kmc_export(handle, cb) {
    const ret = wasm.kmc_export(addHeapObject(handle), addHeapObject(cb));
    return takeObject(ret);
}

/**
* @param {string} handle
* @param {Function} cb
* @returns {Promise<any>}
*/
function kmc_delete_profile(handle, cb) {
    const ret = wasm.kmc_delete_profile(addHeapObject(handle), addHeapObject(cb));
    return takeObject(ret);
}

/**
* @param {string} handle
* @param {string} name
* @param {string} image_url
* @param {string | undefined} enroll_uri
* @param {string | undefined} login_uri
* @param {string | undefined} desktop_login_url
* @param {string | undefined} device_gateway_url
* @param {string | undefined} migrate_addr
* @param {Function} cb
* @returns {Promise<any>}
*/
function kmc_create_profile(handle, name, image_url, enroll_uri, login_uri, desktop_login_url, device_gateway_url, migrate_addr, cb) {
    const ret = wasm.kmc_create_profile(addHeapObject(handle), addHeapObject(name), addHeapObject(image_url), isLikeNone(enroll_uri) ? 0 : addHeapObject(enroll_uri), isLikeNone(login_uri) ? 0 : addHeapObject(login_uri), isLikeNone(desktop_login_url) ? 0 : addHeapObject(desktop_login_url), isLikeNone(device_gateway_url) ? 0 : addHeapObject(device_gateway_url), isLikeNone(migrate_addr) ? 0 : addHeapObject(migrate_addr), addHeapObject(cb));
    return takeObject(ret);
}

/**
* @returns {Promise<any>}
*/
function kmc_create_pkce() {
    const ret = wasm.kmc_create_pkce();
    return takeObject(ret);
}

/**
* @returns {Promise<any>}
*/
function kmc_cancel() {
    const ret = wasm.kmc_cancel();
    return takeObject(ret);
}

/**
* @param {Function} cb
* @returns {Promise<any>}
*/
function kmc_all_credentials(cb) {
    const ret = wasm.kmc_all_credentials(addHeapObject(cb));
    return takeObject(ret);
}

/**
* @param {string} credential_id
* @param {Function} cb
* @returns {Promise<any>}
*/
function kmc_delete_credential(credential_id, cb) {
    const ret = wasm.kmc_delete_credential(addHeapObject(credential_id), addHeapObject(cb));
    return takeObject(ret);
}

/**
* @param {Function} cb
* @returns {Promise<any>}
*/
function kmc_list_credentials(cb) {
    const ret = wasm.kmc_list_credentials(addHeapObject(cb));
    return takeObject(ret);
}

/**
* @param {string} url
* @returns {any}
*/
function kmc_url_type(url) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.kmc_url_type(retptr, addHeapObject(url));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_258(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h3cc26d5c09b00dcf(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL(/* asset import */ __webpack_require__(/*! kmc_bg.wasm */ "./node_modules/kmc-ffi/kmc_bg.wasm"), __webpack_require__.b);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = JSON.stringify(obj === undefined ? null : obj);
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_falsy = function(arg0) {
        const ret = !getObject(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_kmcopendb_0c15ab508c820158 = function() {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_open_db)();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcgetcert_9d9058e60d2ec288 = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_get_cert)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcputcert_84f499cd9a009fed = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_put_cert)(takeObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcdeletecert_aa441281a012cdb3 = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_delete_cert)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcgeneratekey_511765beae970253 = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_generate_key)(takeObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmciskeywebauthnbacked_84c8f490e60b8e21 = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_is_key_webauthn_backed)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcsign_a1f9b36ba3bf96a1 = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_sign)(takeObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcpublickey_48e7a20de431dd34 = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_public_key)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcencrypt_b47fd84a2dd0d3ac = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_encrypt)(takeObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcdecrypt_850adb9a77b67169 = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_decrypt)(takeObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcdeletekey_7934c88601db8baa = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_delete_key)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcwriteprofile_95e66bc35f3057e8 = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_write_profile)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcwriteprofileid_a1c4524c6e454b4d = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_write_profile_id)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcupdateprofilemetadata_7dd39690d361aac1 = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_update_profile_metadata)(takeObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmchasprofile_f03472fe16f4bc09 = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_has_profile)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcgetprofile_04f002673b484dee = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_get_profile)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcgetallprofiles_0a96be1e897d44de = function(arg0) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_get_all_profiles)(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcdeleteprofile_5baa32b96311cc6b = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_delete_profile)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcaddauthenticatorclientid_3e48bda48cf7a7f9 = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_add_authenticator_client_id)(takeObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcdeleteallauthenticatorclientids_c00ba8cbf9e43629 = function(arg0, arg1) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_delete_all_authenticator_client_ids)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcgetappsettings_2c607c976452a3de = function(arg0) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_get_app_settings)(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcgetdeviceinfo_b4df9bf7e9cd2396 = function(arg0) {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_get_device_info)(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_kmcgetuseragent_49d884f2eefd978a = function() {
        const ret = (0,_snippets_kmc_js_a8479199104cfb09_src_js_dist_kmc_js__WEBPACK_IMPORTED_MODULE_0__.kmc_get_user_agent)();
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        const ret = getObject(arg0) === null;
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbg_get_2d1407dba3452350 = function(arg0, arg1) {
        const ret = getObject(arg0)[takeObject(arg1)];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_f1a4ac8f3a605b11 = function(arg0, arg1, arg2) {
        getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    };
    imports.wbg.__wbg_openCredentialDb_00fc99fb05402cfe = function() {
        const ret = (0,_snippets_authlib_7db35f1893504f15_src_store_credential_db_indexeddb_js_target_credstore_js__WEBPACK_IMPORTED_MODULE_1__.openCredentialDb)();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_closeCredentialDb_cf8f2f7fccc3451c = function(arg0) {
        (0,_snippets_authlib_7db35f1893504f15_src_store_credential_db_indexeddb_js_target_credstore_js__WEBPACK_IMPORTED_MODULE_1__.closeCredentialDb)(getObject(arg0));
    };
    imports.wbg.__wbg_createCredential_ca11169254248c5d = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_authlib_7db35f1893504f15_src_store_credential_db_indexeddb_js_target_credstore_js__WEBPACK_IMPORTED_MODULE_1__.createCredential)(getObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_readCredentials_1abf853d51de9c93 = function(arg0) {
        const ret = (0,_snippets_authlib_7db35f1893504f15_src_store_credential_db_indexeddb_js_target_credstore_js__WEBPACK_IMPORTED_MODULE_1__.readCredentials)(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_updateCredential_f8f0c0ec2be32b61 = function(arg0, arg1) {
        const ret = (0,_snippets_authlib_7db35f1893504f15_src_store_credential_db_indexeddb_js_target_credstore_js__WEBPACK_IMPORTED_MODULE_1__.updateCredential)(getObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_deleteCredential_e7d0faf351edb98b = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_authlib_7db35f1893504f15_src_store_credential_db_indexeddb_js_target_credstore_js__WEBPACK_IMPORTED_MODULE_1__.deleteCredential)(getObject(arg0), getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_654a7797990fb8db = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_fb6b088efb6bead2 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_process_70251ed1291754d5 = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_b23f2588cdb2ddbb = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_61b8c9a82499895d = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_NODE_MODULE_33b45247c55045b0 = function() {
        const ret = module;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_2a93bc09fee45aca = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_crypto_2f56257a38275dbd = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_msCrypto_d07655bf62361f21 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_FfiCreateKeyP256_fd51c7a944133df3 = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_hal_bc6192ecc6d6c47e_src_wasm_legacy_js_target_hal_js__WEBPACK_IMPORTED_MODULE_2__.FfiCreateKeyP256)(takeObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_FfiQueryKeyP256_18c3a6036ad02e98 = function(arg0) {
        const ret = (0,_snippets_hal_bc6192ecc6d6c47e_src_wasm_legacy_js_target_hal_js__WEBPACK_IMPORTED_MODULE_2__.FfiQueryKeyP256)(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_FfiDeleteKeyP256_12d9b5684ba806dc = function(arg0) {
        const ret = (0,_snippets_hal_bc6192ecc6d6c47e_src_wasm_legacy_js_target_hal_js__WEBPACK_IMPORTED_MODULE_2__.FfiDeleteKeyP256)(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_FfiVerifyExistingKeyP256_03379162af85d1f7 = function(arg0) {
        const ret = (0,_snippets_hal_bc6192ecc6d6c47e_src_wasm_legacy_js_target_hal_js__WEBPACK_IMPORTED_MODULE_2__.FfiVerifyExistingKeyP256)(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_FfiSignWithP256_ccf7ebc4df1d428a = function(arg0, arg1) {
        const ret = (0,_snippets_hal_bc6192ecc6d6c47e_src_wasm_legacy_js_target_hal_js__WEBPACK_IMPORTED_MODULE_2__.FfiSignWithP256)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_FfiPublicBitsP256_49d02d819038aa48 = function(arg0) {
        const ret = (0,_snippets_hal_bc6192ecc6d6c47e_src_wasm_legacy_js_target_hal_js__WEBPACK_IMPORTED_MODULE_2__.FfiPublicBitsP256)(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_String_c4052d6424160ac1 = function(arg0, arg1) {
        const ret = String(getObject(arg1));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_get_f7833d6ec572e462 = function(arg0, arg1) {
        const ret = getObject(arg0)[takeObject(arg1)];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_fbb49ad265f9dee8 = function(arg0, arg1, arg2) {
        getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    };
    imports.wbg.__wbg_ecdsageneratekeypair_edaf8ac094978593 = function(arg0) {
        const ret = (0,_snippets_crypto_7439096d35d6fc1f_src_ecdsa_wasm_js_crypto_js__WEBPACK_IMPORTED_MODULE_3__.ecdsa_generate_key_pair)(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_ecdsaimportkey_32ec19de54ff9e22 = function(arg0, arg1, arg2, arg3) {
        const ret = (0,_snippets_crypto_7439096d35d6fc1f_src_ecdsa_wasm_js_crypto_js__WEBPACK_IMPORTED_MODULE_3__.ecdsa_import_key)(takeObject(arg0), takeObject(arg1), takeObject(arg2), takeObject(arg3));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_ecdsasign_0bc4242d048360c0 = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_crypto_7439096d35d6fc1f_src_ecdsa_wasm_js_crypto_js__WEBPACK_IMPORTED_MODULE_3__.ecdsa_sign)(takeObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_ecdsaverify_a91e7aa3ad495d6d = function(arg0, arg1, arg2, arg3) {
        const ret = (0,_snippets_crypto_7439096d35d6fc1f_src_ecdsa_wasm_js_crypto_js__WEBPACK_IMPORTED_MODULE_3__.ecdsa_verify)(takeObject(arg0), takeObject(arg1), takeObject(arg2), takeObject(arg3));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_keyexport_c8a6f2f55abf5481 = function(arg0, arg1) {
        const ret = (0,_snippets_crypto_7439096d35d6fc1f_src_ecdsa_wasm_js_crypto_js__WEBPACK_IMPORTED_MODULE_3__.key_export)(takeObject(arg0), takeObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_rsaimportkey_4b6778ef963f6efc = function(arg0, arg1, arg2, arg3) {
        const ret = (0,_snippets_crypto_7439096d35d6fc1f_src_ecdsa_wasm_js_crypto_js__WEBPACK_IMPORTED_MODULE_3__.rsa_import_key)(takeObject(arg0), takeObject(arg1), takeObject(arg2), takeObject(arg3));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_rsaverify_15a6c31972526405 = function(arg0, arg1, arg2) {
        const ret = (0,_snippets_crypto_7439096d35d6fc1f_src_ecdsa_wasm_js_crypto_js__WEBPACK_IMPORTED_MODULE_3__.rsa_verify)(takeObject(arg0), takeObject(arg1), takeObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_sleep_28a06b11e85af039 = function(arg0) {
        const ret = (0,_snippets_common_9958b286e1acf929_inline0_js__WEBPACK_IMPORTED_MODULE_4__.sleep)(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_fetch_811d43d6bdcad5b1 = function(arg0) {
        const ret = fetch(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Window_0e6c0f1096d66c3c = function(arg0) {
        const ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_crypto_2ea42c2930d26d8d = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_fetch_bf56e2a9f0644e3f = function(arg0, arg1) {
        const ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_89d7f088c1c45353 = function() { return handleError(function () {
        const ret = new Headers();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_append_f4f93bc73c45ee3e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_e68d8462fdaf08a2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getRandomValues(getArrayU8FromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newwithu8arraysequenceandoptions_c4b364ec4473b510 = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Response_ccfeb62399355bcd = function(arg0) {
        const ret = getObject(arg0) instanceof Response;
        return ret;
    };
    imports.wbg.__wbg_url_06c0f822d68d195c = function(arg0, arg1) {
        const ret = getObject(arg1).url;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_status_600fd8b881393898 = function(arg0) {
        const ret = getObject(arg0).status;
        return ret;
    };
    imports.wbg.__wbg_headers_9e7f2c05a9b962ea = function(arg0) {
        const ret = getObject(arg0).headers;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_arrayBuffer_5a99283a3954c850 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).arrayBuffer();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_text_2612fbe0b9d32220 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).text();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newwithstrandinit_fd99688f189f053e = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_22a989bb3c63448e = function() { return handleError(function () {
        const ret = new FormData();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_append_310ac5aa48274952 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).append(getStringFromWasm0(arg1, arg2), getObject(arg3));
    }, arguments) };
    imports.wbg.__wbg_append_69cf6e3e3f8bc319 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).append(getStringFromWasm0(arg1, arg2), getObject(arg3), getStringFromWasm0(arg4, arg5));
    }, arguments) };
    imports.wbg.__wbg_get_590a2cd912f2ae46 = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_2cd798326f2cc4c1 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_new_94fb1279cf6afea5 = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_valueOf_534d8e99d070af85 = function(arg0) {
        const ret = getObject(arg0).valueOf();
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_newnoargs_e23b458e372830de = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_cabb70b365520721 = function(arg0) {
        const ret = getObject(arg0).next;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_bf3d83fc18df496e = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).next();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_done_040f966faa9a72b3 = function(arg0) {
        const ret = getObject(arg0).done;
        return ret;
    };
    imports.wbg.__wbg_value_419afbd9b9574c4c = function(arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_iterator_4832ef1f15b0382b = function() {
        const ret = Symbol.iterator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_a9cab131e3152c49 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_ae78342adc33730a = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_36359baae5a47e27 = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_from_7b9a99a7cd3ef15f = function(arg0) {
        const ret = Array.from(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_isArray_6721f2e508996340 = function(arg0) {
        const ret = Array.isArray(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_push_40c6a90f1805aa90 = function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_b81b40c2ae0ab898 = function(arg0) {
        const ret = getObject(arg0) instanceof ArrayBuffer;
        return ret;
    };
    imports.wbg.__wbg_values_b1b9e8c63dbe01c2 = function(arg0) {
        const ret = getObject(arg0).values();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_3047bf4b4f02b802 = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_message_dcca38fbff239fbf = function(arg0) {
        const ret = getObject(arg0).message;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_name_642dd84602f48d65 = function(arg0) {
        const ret = getObject(arg0).name;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_3ed288a247f13ea5 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_isSafeInteger_c87467ed96815119 = function(arg0) {
        const ret = Number.isSafeInteger(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_getTime_bffb1c09df09618b = function(arg0) {
        const ret = getObject(arg0).getTime();
        return ret;
    };
    imports.wbg.__wbg_new0_0ff7eb5c1486f3ec = function() {
        const ret = new Date();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_entries_aaf7a1fbe90f014a = function(arg0) {
        const ret = Object.entries(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Promise_56353edbaec268c3 = function(arg0) {
        const ret = getObject(arg0) instanceof Promise;
        return ret;
    };
    imports.wbg.__wbg_new_37705eed627d5ed9 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_258(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_reject_36ac21d22ef591b3 = function(arg0) {
        const ret = Promise.reject(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_resolve_a9a87bdd64e9e62c = function(arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_ce526c837d07b68f = function(arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_842e65b843962f56 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_99737b4dcdf6f0d8 = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_9b61fbbf3564c4fb = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_8e275ef40caea3a3 = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_5de1e0f82bddcd27 = function() { return handleError(function () {
        const ret = __webpack_require__.g.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_buffer_7af23f65f6c64548 = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_ce1e75f0ce5f7974 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_cc9018bd6f283b6f = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_f25e869e4565d2a2 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_0acb1cf9bbaf8519 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_edb92795fc0c63b4 = function(arg0) {
        const ret = getObject(arg0) instanceof Uint8Array;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_8f0657faca9f1422 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_da527dbd24eafb6b = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_has_ce995ec88636803d = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.has(getObject(arg0), getObject(arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_93b1c87ee2af852e = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stringify_c760003feffcc1f2 = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper6561 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2390, __wbg_adapter_38);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (init);



/***/ }),

/***/ "./node_modules/kmc-ffi/snippets/authlib-7db35f1893504f15/src/store/credential/db/indexeddb/js/target/credstore.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/kmc-ffi/snippets/authlib-7db35f1893504f15/src/store/credential/db/indexeddb/js/target/credstore.js ***!
  \*************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeCredentialDb": () => (/* binding */ closeCredentialDb),
/* harmony export */   "createCredential": () => (/* binding */ createCredential),
/* harmony export */   "deleteCredential": () => (/* binding */ deleteCredential),
/* harmony export */   "openCredentialDb": () => (/* binding */ openCredentialDb),
/* harmony export */   "readCredentials": () => (/* binding */ readCredentials),
/* harmony export */   "updateCredential": () => (/* binding */ updateCredential)
/* harmony export */ });
// src/err.js
var BadPlatform = class extends Error {
  constructor(facility) {
    super(`${facility} is not supported on this platform`);
    this.name = "BadPlatform";
  }
};
var InvalidArg = class extends Error {
  constructor(arg) {
    super(`invalid arg: ${arg}`);
    this.name = "InvalidArg";
  }
};
var OperationBlocked = class extends Error {
  constructor(op) {
    super(`operation blocked in ${op}`);
    this.name = "OperationBlocked";
  }
};
var KeyNotFound = class extends Error {
  constructor(handle) {
    super(`${handle} not found`);
    this.name = "KeyNotFound";
  }
};

// src/validate.js
function validateDatabase(tx) {
  return tx instanceof IDBDatabase;
}
function validateTransactionMode(mode) {
  return mode === "readonly" || mode === "readwrite";
}
function validateTransactionScope(scope) {
  return typeof scope === "string" || scope instanceof Array && scope.reduce((p, c) => p && typeof c === "string", true);
}
function validateTransaction(tx) {
  return tx instanceof IDBTransaction;
}
function validateObjectStore(store) {
  return typeof store === "string";
}

// src/idb.js
var idbTransaction = {
  readonly: "readonly",
  readwrite: "readwrite"
};
function idbOpenDb(name, version2, runMigrations2) {
  if (!window.indexedDB)
    return Promise.reject(new BadPlatform("indexedDB"));
  if (typeof name !== "string")
    return Promise.reject(new InvalidArg("name"));
  if (typeof version2 !== "number")
    return Promise.reject(new InvalidArg("version"));
  if (typeof runMigrations2 !== "function")
    return Promise.reject(new InvalidArg("runMigrations"));
  return new Promise((resolve, reject) => {
    try {
      const rq = window.indexedDB.open(name, version2);
      rq.onupgradeneeded = (e) => {
        try {
          runMigrations2(e.target.result, e.target.transaction, e.newVersion, e.oldVersion);
        } catch (err) {
          reject(err);
        }
      };
      rq.onblocked = (e) => {
        reject(new OperationBlocked("idbOpenDb"));
      };
      rq.onerror = (e) => {
        reject(e.target.error);
      };
      rq.onsuccess = (e) => {
        const db = e.target.result;
        db.onversionchange = () => {
          db.close();
        };
        resolve(db);
      };
    } catch (err) {
      reject(err);
    }
  });
}
function idbCloseDb(db) {
  if (db instanceof IDBDatabase)
    db.close();
}
function idbBeginTransaction(db, scope, mode) {
  if (!validateDatabase(db))
    throw new InvalidArg("db");
  if (!validateTransactionScope(scope))
    throw new InvalidArg("scope");
  if (!validateTransactionMode(mode))
    throw new InvalidArg("mode");
  const tx = db.transaction(scope, mode);
  tx.result = null;
  tx.promise = new Promise((resolve, reject) => {
    tx.oncomplete = (e) => {
      resolve(tx.result);
    };
    tx.onerror = (e) => {
      reject(tx.error ? tx.error : e.target.error);
    };
    tx.onabort = (e) => {
      reject(tx.result);
    };
  });
  return tx;
}
function idbFinishTransaction(tx) {
  if (!validateTransaction(tx))
    throw new InvalidArg("tx");
  if (tx.error) {
    return Promise.reject(tx.error);
  }
  return tx.promise;
}
function idbAbortTransaction(tx, error) {
  if (!validateTransaction(tx))
    throw new InvalidArg("tx");
  tx.result = error;
  tx.abort();
}
function idbGetAll(tx, store) {
  if (!validateTransaction(tx))
    throw new InvalidArg("tx");
  if (!validateObjectStore(store))
    throw new InvalidArg("store");
  try {
    const os = tx.objectStore(store);
    const rq = os.getAll();
    rq.onsuccess = (e) => {
      tx.result = rq.result;
    };
    rq.onerror = (e) => {
      tx.result = e.target.error;
      tx.abort();
    };
  } catch (err) {
    tx.result = err;
    tx.abort();
  }
}
function idbPut(tx, store, value, key) {
  if (!validateTransaction(tx))
    throw new InvalidArg("tx");
  if (!validateObjectStore(store))
    throw new InvalidArg("store");
  try {
    const os = tx.objectStore(store);
    const rq = os.put(value, key);
    rq.onsuccess = (e) => {
      tx.result = rq.result;
    };
    rq.onerror = (e) => {
      tx.result = e.target.error;
      tx.abort();
    };
  } catch (err) {
    tx.result = err;
    tx.abort();
  }
}
function idbAdd(tx, store, value, key) {
  if (!validateTransaction(tx))
    throw new InvalidArg("tx");
  if (!validateObjectStore(store))
    throw new InvalidArg("store");
  try {
    const os = tx.objectStore(store);
    const rq = os.add(value, key);
    rq.onsuccess = (e) => {
      tx.result = rq.result;
    };
    rq.onerror = (e) => {
      tx.result = e.target.error;
      tx.abort();
    };
  } catch (err) {
    tx.result = err;
    tx.abort();
  }
}
function idbDelete(tx, store, key) {
  if (!validateTransaction(tx))
    throw new InvalidArg("tx");
  if (!validateObjectStore(store))
    throw new InvalidArg("store");
  try {
    const os = tx.objectStore(store);
    const rq = os.delete(key);
    rq.onsuccess = (e) => {
      tx.result = rq.result;
    };
    rq.onerror = (e) => {
      tx.result = e.target.error;
      tx.abort();
    };
  } catch (err) {
    tx.result = err;
    tx.abort();
  }
}

// src/store.js
var version = 1;
var dbName = "credentials";
var credentialStore = "credentials";
function runMigrations(db) {
  db.createObjectStore(credentialStore, {
    keyPath: "id"
  });
}
async function openCredentialDb() {
  return await idbOpenDb(dbName, version, runMigrations);
}
async function closeCredentialDb(db) {
  idbCloseDb(db);
}
async function createCredential(db, cred, deleteId) {
  let tx = idbBeginTransaction(db, credentialStore, idbTransaction.readwrite);
  if (deleteId !== void 0) {
    idbDelete(tx, credentialStore, deleteId);
  }
  idbAdd(tx, credentialStore, cred);
  await idbFinishTransaction(tx);
}
async function readCredentials(db) {
  let tx = idbBeginTransaction(db, credentialStore, idbTransaction.readwrite);
  idbGetAll(tx, credentialStore);
  return await idbFinishTransaction(tx);
}
async function updateCredential(db, update) {
  let tx = idbBeginTransaction(db, credentialStore, idbTransaction.readwrite);
  idbPut(tx, credentialStore, update);
  await idbFinishTransaction(tx);
}
async function deleteCredential(db, id) {
  let tx = idbBeginTransaction(db, credentialStore, idbTransaction.readwrite);
  let store = tx.objectStore(credentialStore);
  store.openCursor().onsuccess = (e) => {
    let cursor = e.target.result;
    if (cursor) {
      if (cursor.value.id === id) {
        cursor.delete();
        id = void 0;
      }
      cursor.continue();
    } else {
      if (id !== void 0) {
        idbAbortTransaction(tx, new KeyNotFound(id));
        return;
      }
    }
  };
  await idbFinishTransaction(tx);
}



/***/ }),

/***/ "./node_modules/kmc-ffi/snippets/common-9958b286e1acf929/inline0.js":
/*!**************************************************************************!*\
  !*** ./node_modules/kmc-ffi/snippets/common-9958b286e1acf929/inline0.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sleep": () => (/* binding */ sleep)
/* harmony export */ });
var sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

/***/ }),

/***/ "./node_modules/kmc-ffi/snippets/crypto-7439096d35d6fc1f/src/ecdsa_wasm/js/crypto.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/kmc-ffi/snippets/crypto-7439096d35d6fc1f/src/ecdsa_wasm/js/crypto.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "key_export": () => (/* binding */ key_export),
/* harmony export */   "ecdsa_generate_key_pair": () => (/* binding */ ecdsa_generate_key_pair),
/* harmony export */   "ecdsa_import_key": () => (/* binding */ ecdsa_import_key),
/* harmony export */   "ecdsa_sign": () => (/* binding */ ecdsa_sign),
/* harmony export */   "ecdsa_verify": () => (/* binding */ ecdsa_verify),
/* harmony export */   "aesgcm_generate_key": () => (/* binding */ aesgcm_generate_key),
/* harmony export */   "rsa_import_key": () => (/* binding */ rsa_import_key),
/* harmony export */   "rsa_verify": () => (/* binding */ rsa_verify)
/* harmony export */ });

function key_export(key, format) {
    return new Promise((resolve, reject) => {
        window.crypto.subtle.exportKey(format, key)
            .then(data => {
                resolve(new Uint8Array(data));
            }, err => {
                reject(err);
            });
    });
}

//can be "P-256", "P-384", or "P-521"
function ecdsa_generate_key_pair(curve) {
    return new Promise((resolve, reject) => {
        let params = {
            name: "ECDSA",
            namedCurve: curve,
        };
        window.crypto.subtle.generateKey(params, true, ["sign", "verify"])
            .then(keyPair => {
                resolve(keyPair);
            }, err => {
                reject(err);
            });
    });
}

function ecdsa_import_key(format, curve, bits, use) {
    return new Promise((resolve, reject) => {
        let params = {
            name: "ECDSA",
            namedCurve: curve,
        };
        window.crypto.subtle.importKey(format, bits, params, true, [use])
            .then(keyPair => {
                resolve(keyPair);
            }, err => {
                reject(err);
            });
    });
}

//can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
function ecdsa_sign(key, hash, data) {
    return new Promise((resolve, reject) => {
        let params = {
            name: "ECDSA",
            hash: hash,
        };
        window.crypto.subtle.sign(params, key, data)
            .then(signature => {
                signature = new Uint8Array(signature);
                resolve(signature);
            }, err => {
                reject(err);
            });
    });
};

// SubtleCrypto requires raw signatures, an (x,y) 
// pair of 32-bit BigInt's.  If the length of 
// the signature is > 64, then assume the signature
// is asn.1 encoded as sequence(int, int). 
function ecdsa_decode_signature(signature) {
    if (signature.length == 64) return signature;

    const err = new Error("Invalid signature");

    if (signature.length < 64) throw err;

    // Expected: asn.1 sequence primitive (0x48)
    if (signature[0] != 48) throw err;

    let rawSignature = new Uint8Array(64);

    let pos = 2;

    // Expected: asn.1 integer primitive (0x48)
    if (signature[pos++] != 2) throw err;

    // Parse x.
    // Expected: integer length, either 32 or 33 bytes
    // If the length begins with a 0, then the int is 
    // positive and we can skip the byte.
    let len = signature[pos++];
    if (len == 33) pos++;
    else if (len != 32) throw err;
    rawSignature.set(signature.slice(pos, pos + 32), 0);

    // Parse y, same as x. 
    pos += 32;
    if (signature[pos++] != 2) throw err;
    len = signature[pos++];
    if (len == 33) pos++;
    else if (len != 32) throw err;
    rawSignature.set(signature.slice(pos, pos + 32), 32);

    return rawSignature;
}

function ecdsa_verify(key, hash, signature, message) {

    return new Promise((resolve, reject) => {
        try {
            signature = ecdsa_decode_signature(signature);
        }
        catch (err) {
            reject(err);
            return;
        }
        let params = {
            name: "ECDSA",
            hash: hash,
        };
        window.crypto.subtle.verify(params, key, signature, message)
            .then(ok => {
                resolve(ok);
            }, err => {
                reject(err);
            });
    });
};

function aesgcm_generate_key() {
    return new Promise((resolve, reject) => {
        let params = {
            name: "AES-GCM",
            length: 256,
        };
        window.crypto.subtle.generateKey(params, false, ["encrypt", "decrypt"])
            .then(key => {
                resolve(key)
            }, err => {
                reject(err)
            });
    });
}

function rsa_import_key(format, bits, use, hash) {
    return new Promise((resolve, reject) => {
        let params = {
            name: "RSASSA-PKCS1-v1_5",
            hash: hash,
        };
        window.crypto.subtle.importKey(format, bits, params, true, [use])
            .then(keyPair => {
                resolve(keyPair);
            }, err => {
                reject(err);
            });
    });
}

function rsa_verify(key, signature, message) {

    return new Promise((resolve, reject) => {
        let params = {
            name: "RSASSA-PKCS1-v1_5",
        };
        window.crypto.subtle.verify(params, key, signature, message)
            .then(ok => {
                resolve(ok);
            }, err => {
                reject(err);
            });
    });
};



/***/ }),

/***/ "./node_modules/kmc-ffi/snippets/hal-bc6192ecc6d6c47e/src/wasm/legacy/js/target/hal.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/kmc-ffi/snippets/hal-bc6192ecc6d6c47e/src/wasm/legacy/js/target/hal.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FfiCreateKeyP256": () => (/* binding */ FfiCreateKeyP256),
/* harmony export */   "FfiDeleteKeyP256": () => (/* binding */ FfiDeleteKeyP256),
/* harmony export */   "FfiPublicBitsP256": () => (/* binding */ FfiPublicBitsP256),
/* harmony export */   "FfiQueryKeyP256": () => (/* binding */ FfiQueryKeyP256),
/* harmony export */   "FfiSignWithP256": () => (/* binding */ FfiSignWithP256),
/* harmony export */   "FfiVerifyExistingKeyP256": () => (/* binding */ FfiVerifyExistingKeyP256),
/* harmony export */   "KeyExists": () => (/* binding */ KeyExists),
/* harmony export */   "KeyNotFound": () => (/* binding */ KeyNotFound),
/* harmony export */   "closeDb": () => (/* binding */ closeDb),
/* harmony export */   "deleteKey": () => (/* binding */ deleteKey),
/* harmony export */   "generateKey": () => (/* binding */ generateKey),
/* harmony export */   "kmcDbVersion": () => (/* binding */ kmcDbVersion),
/* harmony export */   "loadKey": () => (/* binding */ loadKey),
/* harmony export */   "openDb": () => (/* binding */ openDb),
/* harmony export */   "publicKey": () => (/* binding */ publicKey),
/* harmony export */   "resetDb": () => (/* binding */ resetDb),
/* harmony export */   "saveKey": () => (/* binding */ saveKey),
/* harmony export */   "sign": () => (/* binding */ sign),
/* harmony export */   "validateKey": () => (/* binding */ validateKey),
/* harmony export */   "validateKeyHandle": () => (/* binding */ validateKeyHandle)
/* harmony export */ });
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/cbor-web/dist/cbor.js
var require_cbor = __commonJS({
  "node_modules/cbor-web/dist/cbor.js"(exports, module) {
    !function(e, t) {
      typeof exports == "object" && typeof module == "object" ? module.exports = t() : typeof define == "function" && __webpack_require__.amdO ? define([], t) : typeof exports == "object" ? exports.cbor = t() : e.cbor = t();
    }(exports, function() {
      return (() => {
        var e = { 742: (e2, t2) => {
          "use strict";
          t2.byteLength = function(e3) {
            var t3 = u(e3), r3 = t3[0], n3 = t3[1];
            return 3 * (r3 + n3) / 4 - n3;
          }, t2.toByteArray = function(e3) {
            var t3, r3, o2 = u(e3), s2 = o2[0], a2 = o2[1], f2 = new i(function(e4, t4, r4) {
              return 3 * (t4 + r4) / 4 - r4;
            }(0, s2, a2)), h = 0, l = a2 > 0 ? s2 - 4 : s2;
            for (r3 = 0; r3 < l; r3 += 4)
              t3 = n2[e3.charCodeAt(r3)] << 18 | n2[e3.charCodeAt(r3 + 1)] << 12 | n2[e3.charCodeAt(r3 + 2)] << 6 | n2[e3.charCodeAt(r3 + 3)], f2[h++] = t3 >> 16 & 255, f2[h++] = t3 >> 8 & 255, f2[h++] = 255 & t3;
            return a2 === 2 && (t3 = n2[e3.charCodeAt(r3)] << 2 | n2[e3.charCodeAt(r3 + 1)] >> 4, f2[h++] = 255 & t3), a2 === 1 && (t3 = n2[e3.charCodeAt(r3)] << 10 | n2[e3.charCodeAt(r3 + 1)] << 4 | n2[e3.charCodeAt(r3 + 2)] >> 2, f2[h++] = t3 >> 8 & 255, f2[h++] = 255 & t3), f2;
          }, t2.fromByteArray = function(e3) {
            for (var t3, n3 = e3.length, i2 = n3 % 3, o2 = [], s2 = 16383, a2 = 0, u2 = n3 - i2; a2 < u2; a2 += s2)
              o2.push(f(e3, a2, a2 + s2 > u2 ? u2 : a2 + s2));
            return i2 === 1 ? (t3 = e3[n3 - 1], o2.push(r2[t3 >> 2] + r2[t3 << 4 & 63] + "==")) : i2 === 2 && (t3 = (e3[n3 - 2] << 8) + e3[n3 - 1], o2.push(r2[t3 >> 10] + r2[t3 >> 4 & 63] + r2[t3 << 2 & 63] + "=")), o2.join("");
          };
          for (var r2 = [], n2 = [], i = typeof Uint8Array != "undefined" ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, a = o.length; s < a; ++s)
            r2[s] = o[s], n2[o.charCodeAt(s)] = s;
          function u(e3) {
            var t3 = e3.length;
            if (t3 % 4 > 0)
              throw new Error("Invalid string. Length must be a multiple of 4");
            var r3 = e3.indexOf("=");
            return r3 === -1 && (r3 = t3), [r3, r3 === t3 ? 0 : 4 - r3 % 4];
          }
          function f(e3, t3, n3) {
            for (var i2, o2, s2 = [], a2 = t3; a2 < n3; a2 += 3)
              i2 = (e3[a2] << 16 & 16711680) + (e3[a2 + 1] << 8 & 65280) + (255 & e3[a2 + 2]), s2.push(r2[(o2 = i2) >> 18 & 63] + r2[o2 >> 12 & 63] + r2[o2 >> 6 & 63] + r2[63 & o2]);
            return s2.join("");
          }
          n2["-".charCodeAt(0)] = 62, n2["_".charCodeAt(0)] = 63;
        }, 764: (e2, t2, r2) => {
          "use strict";
          const n2 = r2(742), i = r2(645), o = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
          t2.Buffer = u, t2.SlowBuffer = function(e3) {
            return +e3 != e3 && (e3 = 0), u.alloc(+e3);
          }, t2.INSPECT_MAX_BYTES = 50;
          const s = 2147483647;
          function a(e3) {
            if (e3 > s)
              throw new RangeError('The value "' + e3 + '" is invalid for option "size"');
            const t3 = new Uint8Array(e3);
            return Object.setPrototypeOf(t3, u.prototype), t3;
          }
          function u(e3, t3, r3) {
            if (typeof e3 == "number") {
              if (typeof t3 == "string")
                throw new TypeError('The "string" argument must be of type string. Received type number');
              return l(e3);
            }
            return f(e3, t3, r3);
          }
          function f(e3, t3, r3) {
            if (typeof e3 == "string")
              return function(e4, t4) {
                if (typeof t4 == "string" && t4 !== "" || (t4 = "utf8"), !u.isEncoding(t4))
                  throw new TypeError("Unknown encoding: " + t4);
                const r4 = 0 | g(e4, t4);
                let n4 = a(r4);
                const i3 = n4.write(e4, t4);
                return i3 !== r4 && (n4 = n4.slice(0, i3)), n4;
              }(e3, t3);
            if (ArrayBuffer.isView(e3))
              return function(e4) {
                if (z(e4, Uint8Array)) {
                  const t4 = new Uint8Array(e4);
                  return d(t4.buffer, t4.byteOffset, t4.byteLength);
                }
                return c(e4);
              }(e3);
            if (e3 == null)
              throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e3);
            if (z(e3, ArrayBuffer) || e3 && z(e3.buffer, ArrayBuffer))
              return d(e3, t3, r3);
            if (typeof SharedArrayBuffer != "undefined" && (z(e3, SharedArrayBuffer) || e3 && z(e3.buffer, SharedArrayBuffer)))
              return d(e3, t3, r3);
            if (typeof e3 == "number")
              throw new TypeError('The "value" argument must not be of type number. Received type number');
            const n3 = e3.valueOf && e3.valueOf();
            if (n3 != null && n3 !== e3)
              return u.from(n3, t3, r3);
            const i2 = function(e4) {
              if (u.isBuffer(e4)) {
                const t4 = 0 | p(e4.length), r4 = a(t4);
                return r4.length === 0 || e4.copy(r4, 0, 0, t4), r4;
              }
              return e4.length !== void 0 ? typeof e4.length != "number" || J(e4.length) ? a(0) : c(e4) : e4.type === "Buffer" && Array.isArray(e4.data) ? c(e4.data) : void 0;
            }(e3);
            if (i2)
              return i2;
            if (typeof Symbol != "undefined" && Symbol.toPrimitive != null && typeof e3[Symbol.toPrimitive] == "function")
              return u.from(e3[Symbol.toPrimitive]("string"), t3, r3);
            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e3);
          }
          function h(e3) {
            if (typeof e3 != "number")
              throw new TypeError('"size" argument must be of type number');
            if (e3 < 0)
              throw new RangeError('The value "' + e3 + '" is invalid for option "size"');
          }
          function l(e3) {
            return h(e3), a(e3 < 0 ? 0 : 0 | p(e3));
          }
          function c(e3) {
            const t3 = e3.length < 0 ? 0 : 0 | p(e3.length), r3 = a(t3);
            for (let n3 = 0; n3 < t3; n3 += 1)
              r3[n3] = 255 & e3[n3];
            return r3;
          }
          function d(e3, t3, r3) {
            if (t3 < 0 || e3.byteLength < t3)
              throw new RangeError('"offset" is outside of buffer bounds');
            if (e3.byteLength < t3 + (r3 || 0))
              throw new RangeError('"length" is outside of buffer bounds');
            let n3;
            return n3 = t3 === void 0 && r3 === void 0 ? new Uint8Array(e3) : r3 === void 0 ? new Uint8Array(e3, t3) : new Uint8Array(e3, t3, r3), Object.setPrototypeOf(n3, u.prototype), n3;
          }
          function p(e3) {
            if (e3 >= s)
              throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s.toString(16) + " bytes");
            return 0 | e3;
          }
          function g(e3, t3) {
            if (u.isBuffer(e3))
              return e3.length;
            if (ArrayBuffer.isView(e3) || z(e3, ArrayBuffer))
              return e3.byteLength;
            if (typeof e3 != "string")
              throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e3);
            const r3 = e3.length, n3 = arguments.length > 2 && arguments[2] === true;
            if (!n3 && r3 === 0)
              return 0;
            let i2 = false;
            for (; ; )
              switch (t3) {
                case "ascii":
                case "latin1":
                case "binary":
                  return r3;
                case "utf8":
                case "utf-8":
                  return H(e3).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return 2 * r3;
                case "hex":
                  return r3 >>> 1;
                case "base64":
                  return K(e3).length;
                default:
                  if (i2)
                    return n3 ? -1 : H(e3).length;
                  t3 = ("" + t3).toLowerCase(), i2 = true;
              }
          }
          function y(e3, t3, r3) {
            let n3 = false;
            if ((t3 === void 0 || t3 < 0) && (t3 = 0), t3 > this.length)
              return "";
            if ((r3 === void 0 || r3 > this.length) && (r3 = this.length), r3 <= 0)
              return "";
            if ((r3 >>>= 0) <= (t3 >>>= 0))
              return "";
            for (e3 || (e3 = "utf8"); ; )
              switch (e3) {
                case "hex":
                  return L(this, t3, r3);
                case "utf8":
                case "utf-8":
                  return A(this, t3, r3);
                case "ascii":
                  return R(this, t3, r3);
                case "latin1":
                case "binary":
                  return U(this, t3, r3);
                case "base64":
                  return I(this, t3, r3);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return N(this, t3, r3);
                default:
                  if (n3)
                    throw new TypeError("Unknown encoding: " + e3);
                  e3 = (e3 + "").toLowerCase(), n3 = true;
              }
          }
          function b(e3, t3, r3) {
            const n3 = e3[t3];
            e3[t3] = e3[r3], e3[r3] = n3;
          }
          function w(e3, t3, r3, n3, i2) {
            if (e3.length === 0)
              return -1;
            if (typeof r3 == "string" ? (n3 = r3, r3 = 0) : r3 > 2147483647 ? r3 = 2147483647 : r3 < -2147483648 && (r3 = -2147483648), J(r3 = +r3) && (r3 = i2 ? 0 : e3.length - 1), r3 < 0 && (r3 = e3.length + r3), r3 >= e3.length) {
              if (i2)
                return -1;
              r3 = e3.length - 1;
            } else if (r3 < 0) {
              if (!i2)
                return -1;
              r3 = 0;
            }
            if (typeof t3 == "string" && (t3 = u.from(t3, n3)), u.isBuffer(t3))
              return t3.length === 0 ? -1 : _(e3, t3, r3, n3, i2);
            if (typeof t3 == "number")
              return t3 &= 255, typeof Uint8Array.prototype.indexOf == "function" ? i2 ? Uint8Array.prototype.indexOf.call(e3, t3, r3) : Uint8Array.prototype.lastIndexOf.call(e3, t3, r3) : _(e3, [t3], r3, n3, i2);
            throw new TypeError("val must be string, number or Buffer");
          }
          function _(e3, t3, r3, n3, i2) {
            let o2, s2 = 1, a2 = e3.length, u2 = t3.length;
            if (n3 !== void 0 && ((n3 = String(n3).toLowerCase()) === "ucs2" || n3 === "ucs-2" || n3 === "utf16le" || n3 === "utf-16le")) {
              if (e3.length < 2 || t3.length < 2)
                return -1;
              s2 = 2, a2 /= 2, u2 /= 2, r3 /= 2;
            }
            function f2(e4, t4) {
              return s2 === 1 ? e4[t4] : e4.readUInt16BE(t4 * s2);
            }
            if (i2) {
              let n4 = -1;
              for (o2 = r3; o2 < a2; o2++)
                if (f2(e3, o2) === f2(t3, n4 === -1 ? 0 : o2 - n4)) {
                  if (n4 === -1 && (n4 = o2), o2 - n4 + 1 === u2)
                    return n4 * s2;
                } else
                  n4 !== -1 && (o2 -= o2 - n4), n4 = -1;
            } else
              for (r3 + u2 > a2 && (r3 = a2 - u2), o2 = r3; o2 >= 0; o2--) {
                let r4 = true;
                for (let n4 = 0; n4 < u2; n4++)
                  if (f2(e3, o2 + n4) !== f2(t3, n4)) {
                    r4 = false;
                    break;
                  }
                if (r4)
                  return o2;
              }
            return -1;
          }
          function m(e3, t3, r3, n3) {
            r3 = Number(r3) || 0;
            const i2 = e3.length - r3;
            n3 ? (n3 = Number(n3)) > i2 && (n3 = i2) : n3 = i2;
            const o2 = t3.length;
            let s2;
            for (n3 > o2 / 2 && (n3 = o2 / 2), s2 = 0; s2 < n3; ++s2) {
              const n4 = parseInt(t3.substr(2 * s2, 2), 16);
              if (J(n4))
                return s2;
              e3[r3 + s2] = n4;
            }
            return s2;
          }
          function E(e3, t3, r3, n3) {
            return V(H(t3, e3.length - r3), e3, r3, n3);
          }
          function v(e3, t3, r3, n3) {
            return V(function(e4) {
              const t4 = [];
              for (let r4 = 0; r4 < e4.length; ++r4)
                t4.push(255 & e4.charCodeAt(r4));
              return t4;
            }(t3), e3, r3, n3);
          }
          function S(e3, t3, r3, n3) {
            return V(K(t3), e3, r3, n3);
          }
          function T(e3, t3, r3, n3) {
            return V(function(e4, t4) {
              let r4, n4, i2;
              const o2 = [];
              for (let s2 = 0; s2 < e4.length && !((t4 -= 2) < 0); ++s2)
                r4 = e4.charCodeAt(s2), n4 = r4 >> 8, i2 = r4 % 256, o2.push(i2), o2.push(n4);
              return o2;
            }(t3, e3.length - r3), e3, r3, n3);
          }
          function I(e3, t3, r3) {
            return t3 === 0 && r3 === e3.length ? n2.fromByteArray(e3) : n2.fromByteArray(e3.slice(t3, r3));
          }
          function A(e3, t3, r3) {
            r3 = Math.min(e3.length, r3);
            const n3 = [];
            let i2 = t3;
            for (; i2 < r3; ) {
              const t4 = e3[i2];
              let o2 = null, s2 = t4 > 239 ? 4 : t4 > 223 ? 3 : t4 > 191 ? 2 : 1;
              if (i2 + s2 <= r3) {
                let r4, n4, a2, u2;
                switch (s2) {
                  case 1:
                    t4 < 128 && (o2 = t4);
                    break;
                  case 2:
                    r4 = e3[i2 + 1], (192 & r4) == 128 && (u2 = (31 & t4) << 6 | 63 & r4, u2 > 127 && (o2 = u2));
                    break;
                  case 3:
                    r4 = e3[i2 + 1], n4 = e3[i2 + 2], (192 & r4) == 128 && (192 & n4) == 128 && (u2 = (15 & t4) << 12 | (63 & r4) << 6 | 63 & n4, u2 > 2047 && (u2 < 55296 || u2 > 57343) && (o2 = u2));
                    break;
                  case 4:
                    r4 = e3[i2 + 1], n4 = e3[i2 + 2], a2 = e3[i2 + 3], (192 & r4) == 128 && (192 & n4) == 128 && (192 & a2) == 128 && (u2 = (15 & t4) << 18 | (63 & r4) << 12 | (63 & n4) << 6 | 63 & a2, u2 > 65535 && u2 < 1114112 && (o2 = u2));
                }
              }
              o2 === null ? (o2 = 65533, s2 = 1) : o2 > 65535 && (o2 -= 65536, n3.push(o2 >>> 10 & 1023 | 55296), o2 = 56320 | 1023 & o2), n3.push(o2), i2 += s2;
            }
            return function(e4) {
              const t4 = e4.length;
              if (t4 <= B)
                return String.fromCharCode.apply(String, e4);
              let r4 = "", n4 = 0;
              for (; n4 < t4; )
                r4 += String.fromCharCode.apply(String, e4.slice(n4, n4 += B));
              return r4;
            }(n3);
          }
          t2.kMaxLength = s, u.TYPED_ARRAY_SUPPORT = function() {
            try {
              const e3 = new Uint8Array(1), t3 = { foo: function() {
                return 42;
              } };
              return Object.setPrototypeOf(t3, Uint8Array.prototype), Object.setPrototypeOf(e3, t3), e3.foo() === 42;
            } catch (e3) {
              return false;
            }
          }(), u.TYPED_ARRAY_SUPPORT || typeof console == "undefined" || typeof console.error != "function" || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(u.prototype, "parent", { enumerable: true, get: function() {
            if (u.isBuffer(this))
              return this.buffer;
          } }), Object.defineProperty(u.prototype, "offset", { enumerable: true, get: function() {
            if (u.isBuffer(this))
              return this.byteOffset;
          } }), u.poolSize = 8192, u.from = function(e3, t3, r3) {
            return f(e3, t3, r3);
          }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array), u.alloc = function(e3, t3, r3) {
            return function(e4, t4, r4) {
              return h(e4), e4 <= 0 ? a(e4) : t4 !== void 0 ? typeof r4 == "string" ? a(e4).fill(t4, r4) : a(e4).fill(t4) : a(e4);
            }(e3, t3, r3);
          }, u.allocUnsafe = function(e3) {
            return l(e3);
          }, u.allocUnsafeSlow = function(e3) {
            return l(e3);
          }, u.isBuffer = function(e3) {
            return e3 != null && e3._isBuffer === true && e3 !== u.prototype;
          }, u.compare = function(e3, t3) {
            if (z(e3, Uint8Array) && (e3 = u.from(e3, e3.offset, e3.byteLength)), z(t3, Uint8Array) && (t3 = u.from(t3, t3.offset, t3.byteLength)), !u.isBuffer(e3) || !u.isBuffer(t3))
              throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
            if (e3 === t3)
              return 0;
            let r3 = e3.length, n3 = t3.length;
            for (let i2 = 0, o2 = Math.min(r3, n3); i2 < o2; ++i2)
              if (e3[i2] !== t3[i2]) {
                r3 = e3[i2], n3 = t3[i2];
                break;
              }
            return r3 < n3 ? -1 : n3 < r3 ? 1 : 0;
          }, u.isEncoding = function(e3) {
            switch (String(e3).toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "latin1":
              case "binary":
              case "base64":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return true;
              default:
                return false;
            }
          }, u.concat = function(e3, t3) {
            if (!Array.isArray(e3))
              throw new TypeError('"list" argument must be an Array of Buffers');
            if (e3.length === 0)
              return u.alloc(0);
            let r3;
            if (t3 === void 0)
              for (t3 = 0, r3 = 0; r3 < e3.length; ++r3)
                t3 += e3[r3].length;
            const n3 = u.allocUnsafe(t3);
            let i2 = 0;
            for (r3 = 0; r3 < e3.length; ++r3) {
              let t4 = e3[r3];
              if (z(t4, Uint8Array))
                i2 + t4.length > n3.length ? (u.isBuffer(t4) || (t4 = u.from(t4)), t4.copy(n3, i2)) : Uint8Array.prototype.set.call(n3, t4, i2);
              else {
                if (!u.isBuffer(t4))
                  throw new TypeError('"list" argument must be an Array of Buffers');
                t4.copy(n3, i2);
              }
              i2 += t4.length;
            }
            return n3;
          }, u.byteLength = g, u.prototype._isBuffer = true, u.prototype.swap16 = function() {
            const e3 = this.length;
            if (e3 % 2 != 0)
              throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (let t3 = 0; t3 < e3; t3 += 2)
              b(this, t3, t3 + 1);
            return this;
          }, u.prototype.swap32 = function() {
            const e3 = this.length;
            if (e3 % 4 != 0)
              throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (let t3 = 0; t3 < e3; t3 += 4)
              b(this, t3, t3 + 3), b(this, t3 + 1, t3 + 2);
            return this;
          }, u.prototype.swap64 = function() {
            const e3 = this.length;
            if (e3 % 8 != 0)
              throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (let t3 = 0; t3 < e3; t3 += 8)
              b(this, t3, t3 + 7), b(this, t3 + 1, t3 + 6), b(this, t3 + 2, t3 + 5), b(this, t3 + 3, t3 + 4);
            return this;
          }, u.prototype.toString = function() {
            const e3 = this.length;
            return e3 === 0 ? "" : arguments.length === 0 ? A(this, 0, e3) : y.apply(this, arguments);
          }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(e3) {
            if (!u.isBuffer(e3))
              throw new TypeError("Argument must be a Buffer");
            return this === e3 || u.compare(this, e3) === 0;
          }, u.prototype.inspect = function() {
            let e3 = "";
            const r3 = t2.INSPECT_MAX_BYTES;
            return e3 = this.toString("hex", 0, r3).replace(/(.{2})/g, "$1 ").trim(), this.length > r3 && (e3 += " ... "), "<Buffer " + e3 + ">";
          }, o && (u.prototype[o] = u.prototype.inspect), u.prototype.compare = function(e3, t3, r3, n3, i2) {
            if (z(e3, Uint8Array) && (e3 = u.from(e3, e3.offset, e3.byteLength)), !u.isBuffer(e3))
              throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e3);
            if (t3 === void 0 && (t3 = 0), r3 === void 0 && (r3 = e3 ? e3.length : 0), n3 === void 0 && (n3 = 0), i2 === void 0 && (i2 = this.length), t3 < 0 || r3 > e3.length || n3 < 0 || i2 > this.length)
              throw new RangeError("out of range index");
            if (n3 >= i2 && t3 >= r3)
              return 0;
            if (n3 >= i2)
              return -1;
            if (t3 >= r3)
              return 1;
            if (this === e3)
              return 0;
            let o2 = (i2 >>>= 0) - (n3 >>>= 0), s2 = (r3 >>>= 0) - (t3 >>>= 0);
            const a2 = Math.min(o2, s2), f2 = this.slice(n3, i2), h2 = e3.slice(t3, r3);
            for (let e4 = 0; e4 < a2; ++e4)
              if (f2[e4] !== h2[e4]) {
                o2 = f2[e4], s2 = h2[e4];
                break;
              }
            return o2 < s2 ? -1 : s2 < o2 ? 1 : 0;
          }, u.prototype.includes = function(e3, t3, r3) {
            return this.indexOf(e3, t3, r3) !== -1;
          }, u.prototype.indexOf = function(e3, t3, r3) {
            return w(this, e3, t3, r3, true);
          }, u.prototype.lastIndexOf = function(e3, t3, r3) {
            return w(this, e3, t3, r3, false);
          }, u.prototype.write = function(e3, t3, r3, n3) {
            if (t3 === void 0)
              n3 = "utf8", r3 = this.length, t3 = 0;
            else if (r3 === void 0 && typeof t3 == "string")
              n3 = t3, r3 = this.length, t3 = 0;
            else {
              if (!isFinite(t3))
                throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
              t3 >>>= 0, isFinite(r3) ? (r3 >>>= 0, n3 === void 0 && (n3 = "utf8")) : (n3 = r3, r3 = void 0);
            }
            const i2 = this.length - t3;
            if ((r3 === void 0 || r3 > i2) && (r3 = i2), e3.length > 0 && (r3 < 0 || t3 < 0) || t3 > this.length)
              throw new RangeError("Attempt to write outside buffer bounds");
            n3 || (n3 = "utf8");
            let o2 = false;
            for (; ; )
              switch (n3) {
                case "hex":
                  return m(this, e3, t3, r3);
                case "utf8":
                case "utf-8":
                  return E(this, e3, t3, r3);
                case "ascii":
                case "latin1":
                case "binary":
                  return v(this, e3, t3, r3);
                case "base64":
                  return S(this, e3, t3, r3);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return T(this, e3, t3, r3);
                default:
                  if (o2)
                    throw new TypeError("Unknown encoding: " + n3);
                  n3 = ("" + n3).toLowerCase(), o2 = true;
              }
          }, u.prototype.toJSON = function() {
            return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
          };
          const B = 4096;
          function R(e3, t3, r3) {
            let n3 = "";
            r3 = Math.min(e3.length, r3);
            for (let i2 = t3; i2 < r3; ++i2)
              n3 += String.fromCharCode(127 & e3[i2]);
            return n3;
          }
          function U(e3, t3, r3) {
            let n3 = "";
            r3 = Math.min(e3.length, r3);
            for (let i2 = t3; i2 < r3; ++i2)
              n3 += String.fromCharCode(e3[i2]);
            return n3;
          }
          function L(e3, t3, r3) {
            const n3 = e3.length;
            (!t3 || t3 < 0) && (t3 = 0), (!r3 || r3 < 0 || r3 > n3) && (r3 = n3);
            let i2 = "";
            for (let n4 = t3; n4 < r3; ++n4)
              i2 += X[e3[n4]];
            return i2;
          }
          function N(e3, t3, r3) {
            const n3 = e3.slice(t3, r3);
            let i2 = "";
            for (let e4 = 0; e4 < n3.length - 1; e4 += 2)
              i2 += String.fromCharCode(n3[e4] + 256 * n3[e4 + 1]);
            return i2;
          }
          function M(e3, t3, r3) {
            if (e3 % 1 != 0 || e3 < 0)
              throw new RangeError("offset is not uint");
            if (e3 + t3 > r3)
              throw new RangeError("Trying to access beyond buffer length");
          }
          function O(e3, t3, r3, n3, i2, o2) {
            if (!u.isBuffer(e3))
              throw new TypeError('"buffer" argument must be a Buffer instance');
            if (t3 > i2 || t3 < o2)
              throw new RangeError('"value" argument is out of bounds');
            if (r3 + n3 > e3.length)
              throw new RangeError("Index out of range");
          }
          function x(e3, t3, r3, n3, i2) {
            G(t3, n3, i2, e3, r3, 7);
            let o2 = Number(t3 & BigInt(4294967295));
            e3[r3++] = o2, o2 >>= 8, e3[r3++] = o2, o2 >>= 8, e3[r3++] = o2, o2 >>= 8, e3[r3++] = o2;
            let s2 = Number(t3 >> BigInt(32) & BigInt(4294967295));
            return e3[r3++] = s2, s2 >>= 8, e3[r3++] = s2, s2 >>= 8, e3[r3++] = s2, s2 >>= 8, e3[r3++] = s2, r3;
          }
          function k(e3, t3, r3, n3, i2) {
            G(t3, n3, i2, e3, r3, 7);
            let o2 = Number(t3 & BigInt(4294967295));
            e3[r3 + 7] = o2, o2 >>= 8, e3[r3 + 6] = o2, o2 >>= 8, e3[r3 + 5] = o2, o2 >>= 8, e3[r3 + 4] = o2;
            let s2 = Number(t3 >> BigInt(32) & BigInt(4294967295));
            return e3[r3 + 3] = s2, s2 >>= 8, e3[r3 + 2] = s2, s2 >>= 8, e3[r3 + 1] = s2, s2 >>= 8, e3[r3] = s2, r3 + 8;
          }
          function P(e3, t3, r3, n3, i2, o2) {
            if (r3 + n3 > e3.length)
              throw new RangeError("Index out of range");
            if (r3 < 0)
              throw new RangeError("Index out of range");
          }
          function j(e3, t3, r3, n3, o2) {
            return t3 = +t3, r3 >>>= 0, o2 || P(e3, 0, r3, 4), i.write(e3, t3, r3, n3, 23, 4), r3 + 4;
          }
          function C(e3, t3, r3, n3, o2) {
            return t3 = +t3, r3 >>>= 0, o2 || P(e3, 0, r3, 8), i.write(e3, t3, r3, n3, 52, 8), r3 + 8;
          }
          u.prototype.slice = function(e3, t3) {
            const r3 = this.length;
            (e3 = ~~e3) < 0 ? (e3 += r3) < 0 && (e3 = 0) : e3 > r3 && (e3 = r3), (t3 = t3 === void 0 ? r3 : ~~t3) < 0 ? (t3 += r3) < 0 && (t3 = 0) : t3 > r3 && (t3 = r3), t3 < e3 && (t3 = e3);
            const n3 = this.subarray(e3, t3);
            return Object.setPrototypeOf(n3, u.prototype), n3;
          }, u.prototype.readUintLE = u.prototype.readUIntLE = function(e3, t3, r3) {
            e3 >>>= 0, t3 >>>= 0, r3 || M(e3, t3, this.length);
            let n3 = this[e3], i2 = 1, o2 = 0;
            for (; ++o2 < t3 && (i2 *= 256); )
              n3 += this[e3 + o2] * i2;
            return n3;
          }, u.prototype.readUintBE = u.prototype.readUIntBE = function(e3, t3, r3) {
            e3 >>>= 0, t3 >>>= 0, r3 || M(e3, t3, this.length);
            let n3 = this[e3 + --t3], i2 = 1;
            for (; t3 > 0 && (i2 *= 256); )
              n3 += this[e3 + --t3] * i2;
            return n3;
          }, u.prototype.readUint8 = u.prototype.readUInt8 = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 1, this.length), this[e3];
          }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 2, this.length), this[e3] | this[e3 + 1] << 8;
          }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 2, this.length), this[e3] << 8 | this[e3 + 1];
          }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 4, this.length), (this[e3] | this[e3 + 1] << 8 | this[e3 + 2] << 16) + 16777216 * this[e3 + 3];
          }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 4, this.length), 16777216 * this[e3] + (this[e3 + 1] << 16 | this[e3 + 2] << 8 | this[e3 + 3]);
          }, u.prototype.readBigUInt64LE = Q(function(e3) {
            W(e3 >>>= 0, "offset");
            const t3 = this[e3], r3 = this[e3 + 7];
            t3 !== void 0 && r3 !== void 0 || Y(e3, this.length - 8);
            const n3 = t3 + 256 * this[++e3] + 65536 * this[++e3] + this[++e3] * 2 ** 24, i2 = this[++e3] + 256 * this[++e3] + 65536 * this[++e3] + r3 * 2 ** 24;
            return BigInt(n3) + (BigInt(i2) << BigInt(32));
          }), u.prototype.readBigUInt64BE = Q(function(e3) {
            W(e3 >>>= 0, "offset");
            const t3 = this[e3], r3 = this[e3 + 7];
            t3 !== void 0 && r3 !== void 0 || Y(e3, this.length - 8);
            const n3 = t3 * 2 ** 24 + 65536 * this[++e3] + 256 * this[++e3] + this[++e3], i2 = this[++e3] * 2 ** 24 + 65536 * this[++e3] + 256 * this[++e3] + r3;
            return (BigInt(n3) << BigInt(32)) + BigInt(i2);
          }), u.prototype.readIntLE = function(e3, t3, r3) {
            e3 >>>= 0, t3 >>>= 0, r3 || M(e3, t3, this.length);
            let n3 = this[e3], i2 = 1, o2 = 0;
            for (; ++o2 < t3 && (i2 *= 256); )
              n3 += this[e3 + o2] * i2;
            return i2 *= 128, n3 >= i2 && (n3 -= Math.pow(2, 8 * t3)), n3;
          }, u.prototype.readIntBE = function(e3, t3, r3) {
            e3 >>>= 0, t3 >>>= 0, r3 || M(e3, t3, this.length);
            let n3 = t3, i2 = 1, o2 = this[e3 + --n3];
            for (; n3 > 0 && (i2 *= 256); )
              o2 += this[e3 + --n3] * i2;
            return i2 *= 128, o2 >= i2 && (o2 -= Math.pow(2, 8 * t3)), o2;
          }, u.prototype.readInt8 = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 1, this.length), 128 & this[e3] ? -1 * (255 - this[e3] + 1) : this[e3];
          }, u.prototype.readInt16LE = function(e3, t3) {
            e3 >>>= 0, t3 || M(e3, 2, this.length);
            const r3 = this[e3] | this[e3 + 1] << 8;
            return 32768 & r3 ? 4294901760 | r3 : r3;
          }, u.prototype.readInt16BE = function(e3, t3) {
            e3 >>>= 0, t3 || M(e3, 2, this.length);
            const r3 = this[e3 + 1] | this[e3] << 8;
            return 32768 & r3 ? 4294901760 | r3 : r3;
          }, u.prototype.readInt32LE = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 4, this.length), this[e3] | this[e3 + 1] << 8 | this[e3 + 2] << 16 | this[e3 + 3] << 24;
          }, u.prototype.readInt32BE = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 4, this.length), this[e3] << 24 | this[e3 + 1] << 16 | this[e3 + 2] << 8 | this[e3 + 3];
          }, u.prototype.readBigInt64LE = Q(function(e3) {
            W(e3 >>>= 0, "offset");
            const t3 = this[e3], r3 = this[e3 + 7];
            t3 !== void 0 && r3 !== void 0 || Y(e3, this.length - 8);
            const n3 = this[e3 + 4] + 256 * this[e3 + 5] + 65536 * this[e3 + 6] + (r3 << 24);
            return (BigInt(n3) << BigInt(32)) + BigInt(t3 + 256 * this[++e3] + 65536 * this[++e3] + this[++e3] * 2 ** 24);
          }), u.prototype.readBigInt64BE = Q(function(e3) {
            W(e3 >>>= 0, "offset");
            const t3 = this[e3], r3 = this[e3 + 7];
            t3 !== void 0 && r3 !== void 0 || Y(e3, this.length - 8);
            const n3 = (t3 << 24) + 65536 * this[++e3] + 256 * this[++e3] + this[++e3];
            return (BigInt(n3) << BigInt(32)) + BigInt(this[++e3] * 2 ** 24 + 65536 * this[++e3] + 256 * this[++e3] + r3);
          }), u.prototype.readFloatLE = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 4, this.length), i.read(this, e3, true, 23, 4);
          }, u.prototype.readFloatBE = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 4, this.length), i.read(this, e3, false, 23, 4);
          }, u.prototype.readDoubleLE = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 8, this.length), i.read(this, e3, true, 52, 8);
          }, u.prototype.readDoubleBE = function(e3, t3) {
            return e3 >>>= 0, t3 || M(e3, 8, this.length), i.read(this, e3, false, 52, 8);
          }, u.prototype.writeUintLE = u.prototype.writeUIntLE = function(e3, t3, r3, n3) {
            e3 = +e3, t3 >>>= 0, r3 >>>= 0, n3 || O(this, e3, t3, r3, Math.pow(2, 8 * r3) - 1, 0);
            let i2 = 1, o2 = 0;
            for (this[t3] = 255 & e3; ++o2 < r3 && (i2 *= 256); )
              this[t3 + o2] = e3 / i2 & 255;
            return t3 + r3;
          }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(e3, t3, r3, n3) {
            e3 = +e3, t3 >>>= 0, r3 >>>= 0, n3 || O(this, e3, t3, r3, Math.pow(2, 8 * r3) - 1, 0);
            let i2 = r3 - 1, o2 = 1;
            for (this[t3 + i2] = 255 & e3; --i2 >= 0 && (o2 *= 256); )
              this[t3 + i2] = e3 / o2 & 255;
            return t3 + r3;
          }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(e3, t3, r3) {
            return e3 = +e3, t3 >>>= 0, r3 || O(this, e3, t3, 1, 255, 0), this[t3] = 255 & e3, t3 + 1;
          }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(e3, t3, r3) {
            return e3 = +e3, t3 >>>= 0, r3 || O(this, e3, t3, 2, 65535, 0), this[t3] = 255 & e3, this[t3 + 1] = e3 >>> 8, t3 + 2;
          }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(e3, t3, r3) {
            return e3 = +e3, t3 >>>= 0, r3 || O(this, e3, t3, 2, 65535, 0), this[t3] = e3 >>> 8, this[t3 + 1] = 255 & e3, t3 + 2;
          }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(e3, t3, r3) {
            return e3 = +e3, t3 >>>= 0, r3 || O(this, e3, t3, 4, 4294967295, 0), this[t3 + 3] = e3 >>> 24, this[t3 + 2] = e3 >>> 16, this[t3 + 1] = e3 >>> 8, this[t3] = 255 & e3, t3 + 4;
          }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(e3, t3, r3) {
            return e3 = +e3, t3 >>>= 0, r3 || O(this, e3, t3, 4, 4294967295, 0), this[t3] = e3 >>> 24, this[t3 + 1] = e3 >>> 16, this[t3 + 2] = e3 >>> 8, this[t3 + 3] = 255 & e3, t3 + 4;
          }, u.prototype.writeBigUInt64LE = Q(function(e3, t3 = 0) {
            return x(this, e3, t3, BigInt(0), BigInt("0xffffffffffffffff"));
          }), u.prototype.writeBigUInt64BE = Q(function(e3, t3 = 0) {
            return k(this, e3, t3, BigInt(0), BigInt("0xffffffffffffffff"));
          }), u.prototype.writeIntLE = function(e3, t3, r3, n3) {
            if (e3 = +e3, t3 >>>= 0, !n3) {
              const n4 = Math.pow(2, 8 * r3 - 1);
              O(this, e3, t3, r3, n4 - 1, -n4);
            }
            let i2 = 0, o2 = 1, s2 = 0;
            for (this[t3] = 255 & e3; ++i2 < r3 && (o2 *= 256); )
              e3 < 0 && s2 === 0 && this[t3 + i2 - 1] !== 0 && (s2 = 1), this[t3 + i2] = (e3 / o2 >> 0) - s2 & 255;
            return t3 + r3;
          }, u.prototype.writeIntBE = function(e3, t3, r3, n3) {
            if (e3 = +e3, t3 >>>= 0, !n3) {
              const n4 = Math.pow(2, 8 * r3 - 1);
              O(this, e3, t3, r3, n4 - 1, -n4);
            }
            let i2 = r3 - 1, o2 = 1, s2 = 0;
            for (this[t3 + i2] = 255 & e3; --i2 >= 0 && (o2 *= 256); )
              e3 < 0 && s2 === 0 && this[t3 + i2 + 1] !== 0 && (s2 = 1), this[t3 + i2] = (e3 / o2 >> 0) - s2 & 255;
            return t3 + r3;
          }, u.prototype.writeInt8 = function(e3, t3, r3) {
            return e3 = +e3, t3 >>>= 0, r3 || O(this, e3, t3, 1, 127, -128), e3 < 0 && (e3 = 255 + e3 + 1), this[t3] = 255 & e3, t3 + 1;
          }, u.prototype.writeInt16LE = function(e3, t3, r3) {
            return e3 = +e3, t3 >>>= 0, r3 || O(this, e3, t3, 2, 32767, -32768), this[t3] = 255 & e3, this[t3 + 1] = e3 >>> 8, t3 + 2;
          }, u.prototype.writeInt16BE = function(e3, t3, r3) {
            return e3 = +e3, t3 >>>= 0, r3 || O(this, e3, t3, 2, 32767, -32768), this[t3] = e3 >>> 8, this[t3 + 1] = 255 & e3, t3 + 2;
          }, u.prototype.writeInt32LE = function(e3, t3, r3) {
            return e3 = +e3, t3 >>>= 0, r3 || O(this, e3, t3, 4, 2147483647, -2147483648), this[t3] = 255 & e3, this[t3 + 1] = e3 >>> 8, this[t3 + 2] = e3 >>> 16, this[t3 + 3] = e3 >>> 24, t3 + 4;
          }, u.prototype.writeInt32BE = function(e3, t3, r3) {
            return e3 = +e3, t3 >>>= 0, r3 || O(this, e3, t3, 4, 2147483647, -2147483648), e3 < 0 && (e3 = 4294967295 + e3 + 1), this[t3] = e3 >>> 24, this[t3 + 1] = e3 >>> 16, this[t3 + 2] = e3 >>> 8, this[t3 + 3] = 255 & e3, t3 + 4;
          }, u.prototype.writeBigInt64LE = Q(function(e3, t3 = 0) {
            return x(this, e3, t3, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
          }), u.prototype.writeBigInt64BE = Q(function(e3, t3 = 0) {
            return k(this, e3, t3, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
          }), u.prototype.writeFloatLE = function(e3, t3, r3) {
            return j(this, e3, t3, true, r3);
          }, u.prototype.writeFloatBE = function(e3, t3, r3) {
            return j(this, e3, t3, false, r3);
          }, u.prototype.writeDoubleLE = function(e3, t3, r3) {
            return C(this, e3, t3, true, r3);
          }, u.prototype.writeDoubleBE = function(e3, t3, r3) {
            return C(this, e3, t3, false, r3);
          }, u.prototype.copy = function(e3, t3, r3, n3) {
            if (!u.isBuffer(e3))
              throw new TypeError("argument should be a Buffer");
            if (r3 || (r3 = 0), n3 || n3 === 0 || (n3 = this.length), t3 >= e3.length && (t3 = e3.length), t3 || (t3 = 0), n3 > 0 && n3 < r3 && (n3 = r3), n3 === r3)
              return 0;
            if (e3.length === 0 || this.length === 0)
              return 0;
            if (t3 < 0)
              throw new RangeError("targetStart out of bounds");
            if (r3 < 0 || r3 >= this.length)
              throw new RangeError("Index out of range");
            if (n3 < 0)
              throw new RangeError("sourceEnd out of bounds");
            n3 > this.length && (n3 = this.length), e3.length - t3 < n3 - r3 && (n3 = e3.length - t3 + r3);
            const i2 = n3 - r3;
            return this === e3 && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t3, r3, n3) : Uint8Array.prototype.set.call(e3, this.subarray(r3, n3), t3), i2;
          }, u.prototype.fill = function(e3, t3, r3, n3) {
            if (typeof e3 == "string") {
              if (typeof t3 == "string" ? (n3 = t3, t3 = 0, r3 = this.length) : typeof r3 == "string" && (n3 = r3, r3 = this.length), n3 !== void 0 && typeof n3 != "string")
                throw new TypeError("encoding must be a string");
              if (typeof n3 == "string" && !u.isEncoding(n3))
                throw new TypeError("Unknown encoding: " + n3);
              if (e3.length === 1) {
                const t4 = e3.charCodeAt(0);
                (n3 === "utf8" && t4 < 128 || n3 === "latin1") && (e3 = t4);
              }
            } else
              typeof e3 == "number" ? e3 &= 255 : typeof e3 == "boolean" && (e3 = Number(e3));
            if (t3 < 0 || this.length < t3 || this.length < r3)
              throw new RangeError("Out of range index");
            if (r3 <= t3)
              return this;
            let i2;
            if (t3 >>>= 0, r3 = r3 === void 0 ? this.length : r3 >>> 0, e3 || (e3 = 0), typeof e3 == "number")
              for (i2 = t3; i2 < r3; ++i2)
                this[i2] = e3;
            else {
              const o2 = u.isBuffer(e3) ? e3 : u.from(e3, n3), s2 = o2.length;
              if (s2 === 0)
                throw new TypeError('The value "' + e3 + '" is invalid for argument "value"');
              for (i2 = 0; i2 < r3 - t3; ++i2)
                this[i2 + t3] = o2[i2 % s2];
            }
            return this;
          };
          const F = {};
          function D(e3, t3, r3) {
            F[e3] = class extends r3 {
              constructor() {
                super(), Object.defineProperty(this, "message", { value: t3.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${e3}]`, this.stack, delete this.name;
              }
              get code() {
                return e3;
              }
              set code(e4) {
                Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: e4, writable: true });
              }
              toString() {
                return `${this.name} [${e3}]: ${this.message}`;
              }
            };
          }
          function $(e3) {
            let t3 = "", r3 = e3.length;
            const n3 = e3[0] === "-" ? 1 : 0;
            for (; r3 >= n3 + 4; r3 -= 3)
              t3 = `_${e3.slice(r3 - 3, r3)}${t3}`;
            return `${e3.slice(0, r3)}${t3}`;
          }
          function G(e3, t3, r3, n3, i2, o2) {
            if (e3 > r3 || e3 < t3) {
              const n4 = typeof t3 == "bigint" ? "n" : "";
              let i3;
              throw i3 = o2 > 3 ? t3 === 0 || t3 === BigInt(0) ? `>= 0${n4} and < 2${n4} ** ${8 * (o2 + 1)}${n4}` : `>= -(2${n4} ** ${8 * (o2 + 1) - 1}${n4}) and < 2 ** ${8 * (o2 + 1) - 1}${n4}` : `>= ${t3}${n4} and <= ${r3}${n4}`, new F.ERR_OUT_OF_RANGE("value", i3, e3);
            }
            !function(e4, t4, r4) {
              W(t4, "offset"), e4[t4] !== void 0 && e4[t4 + r4] !== void 0 || Y(t4, e4.length - (r4 + 1));
            }(n3, i2, o2);
          }
          function W(e3, t3) {
            if (typeof e3 != "number")
              throw new F.ERR_INVALID_ARG_TYPE(t3, "number", e3);
          }
          function Y(e3, t3, r3) {
            if (Math.floor(e3) !== e3)
              throw W(e3, r3), new F.ERR_OUT_OF_RANGE(r3 || "offset", "an integer", e3);
            if (t3 < 0)
              throw new F.ERR_BUFFER_OUT_OF_BOUNDS();
            throw new F.ERR_OUT_OF_RANGE(r3 || "offset", `>= ${r3 ? 1 : 0} and <= ${t3}`, e3);
          }
          D("ERR_BUFFER_OUT_OF_BOUNDS", function(e3) {
            return e3 ? `${e3} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
          }, RangeError), D("ERR_INVALID_ARG_TYPE", function(e3, t3) {
            return `The "${e3}" argument must be of type number. Received type ${typeof t3}`;
          }, TypeError), D("ERR_OUT_OF_RANGE", function(e3, t3, r3) {
            let n3 = `The value of "${e3}" is out of range.`, i2 = r3;
            return Number.isInteger(r3) && Math.abs(r3) > 2 ** 32 ? i2 = $(String(r3)) : typeof r3 == "bigint" && (i2 = String(r3), (r3 > BigInt(2) ** BigInt(32) || r3 < -(BigInt(2) ** BigInt(32))) && (i2 = $(i2)), i2 += "n"), n3 += ` It must be ${t3}. Received ${i2}`, n3;
          }, RangeError);
          const q = /[^+/0-9A-Za-z-_]/g;
          function H(e3, t3) {
            let r3;
            t3 = t3 || 1 / 0;
            const n3 = e3.length;
            let i2 = null;
            const o2 = [];
            for (let s2 = 0; s2 < n3; ++s2) {
              if (r3 = e3.charCodeAt(s2), r3 > 55295 && r3 < 57344) {
                if (!i2) {
                  if (r3 > 56319) {
                    (t3 -= 3) > -1 && o2.push(239, 191, 189);
                    continue;
                  }
                  if (s2 + 1 === n3) {
                    (t3 -= 3) > -1 && o2.push(239, 191, 189);
                    continue;
                  }
                  i2 = r3;
                  continue;
                }
                if (r3 < 56320) {
                  (t3 -= 3) > -1 && o2.push(239, 191, 189), i2 = r3;
                  continue;
                }
                r3 = 65536 + (i2 - 55296 << 10 | r3 - 56320);
              } else
                i2 && (t3 -= 3) > -1 && o2.push(239, 191, 189);
              if (i2 = null, r3 < 128) {
                if ((t3 -= 1) < 0)
                  break;
                o2.push(r3);
              } else if (r3 < 2048) {
                if ((t3 -= 2) < 0)
                  break;
                o2.push(r3 >> 6 | 192, 63 & r3 | 128);
              } else if (r3 < 65536) {
                if ((t3 -= 3) < 0)
                  break;
                o2.push(r3 >> 12 | 224, r3 >> 6 & 63 | 128, 63 & r3 | 128);
              } else {
                if (!(r3 < 1114112))
                  throw new Error("Invalid code point");
                if ((t3 -= 4) < 0)
                  break;
                o2.push(r3 >> 18 | 240, r3 >> 12 & 63 | 128, r3 >> 6 & 63 | 128, 63 & r3 | 128);
              }
            }
            return o2;
          }
          function K(e3) {
            return n2.toByteArray(function(e4) {
              if ((e4 = (e4 = e4.split("=")[0]).trim().replace(q, "")).length < 2)
                return "";
              for (; e4.length % 4 != 0; )
                e4 += "=";
              return e4;
            }(e3));
          }
          function V(e3, t3, r3, n3) {
            let i2;
            for (i2 = 0; i2 < n3 && !(i2 + r3 >= t3.length || i2 >= e3.length); ++i2)
              t3[i2 + r3] = e3[i2];
            return i2;
          }
          function z(e3, t3) {
            return e3 instanceof t3 || e3 != null && e3.constructor != null && e3.constructor.name != null && e3.constructor.name === t3.name;
          }
          function J(e3) {
            return e3 != e3;
          }
          const X = function() {
            const e3 = "0123456789abcdef", t3 = new Array(256);
            for (let r3 = 0; r3 < 16; ++r3) {
              const n3 = 16 * r3;
              for (let i2 = 0; i2 < 16; ++i2)
                t3[n3 + i2] = e3[r3] + e3[i2];
            }
            return t3;
          }();
          function Q(e3) {
            return typeof BigInt == "undefined" ? Z : e3;
          }
          function Z() {
            throw new Error("BigInt not supported");
          }
        }, 141: (e2, t2, r2) => {
          "use strict";
          t2.Commented = r2(20), t2.Diagnose = r2(694), t2.Decoder = r2(774), t2.Encoder = r2(666), t2.Simple = r2(32), t2.Tagged = r2(785), t2.Map = r2(70), t2.UI = t2.Commented.comment, t2.fI = t2.Decoder.decodeAll, t2.h8 = t2.Decoder.decodeFirst, t2.cc = t2.Decoder.decodeAllSync, t2.$u = t2.Decoder.decodeFirstSync, t2.M = t2.Diagnose.diagnose, t2.cv = t2.Encoder.encode, t2.N2 = t2.Encoder.encodeCanonical, t2.TG = t2.Encoder.encodeOne, t2.WR = t2.Encoder.encodeAsync, t2.Jx = t2.Decoder.decodeFirstSync, t2.ww = { decode: t2.Decoder.decodeFirstSync, encode: t2.Encoder.encode, buffer: true, name: "cbor" }, t2.mc = function() {
            t2.Encoder.reset(), t2.Tagged.reset();
          };
        }, 20: (e2, t2, r2) => {
          "use strict";
          const n2 = r2(830), i = r2(873), o = r2(774), s = r2(202), { MT: a, NUMBYTES: u, SYMS: f } = r2(66), { Buffer: h } = r2(764);
          function l(e3) {
            return e3 > 1 ? "s" : "";
          }
          class c extends n2.Transform {
            constructor(e3 = {}) {
              const { depth: t3 = 1, max_depth: r3 = 10, no_summary: n3 = false, tags: i2 = {}, preferWeb: a2, encoding: u2, ...f2 } = e3;
              super({ ...f2, readableObjectMode: false, writableObjectMode: false }), this.depth = t3, this.max_depth = r3, this.all = new s(), i2[24] || (i2[24] = this._tag_24.bind(this)), this.parser = new o({ tags: i2, max_depth: r3, preferWeb: a2, encoding: u2 }), this.parser.on("value", this._on_value.bind(this)), this.parser.on("start", this._on_start.bind(this)), this.parser.on("start-string", this._on_start_string.bind(this)), this.parser.on("stop", this._on_stop.bind(this)), this.parser.on("more-bytes", this._on_more.bind(this)), this.parser.on("error", this._on_error.bind(this)), n3 || this.parser.on("data", this._on_data.bind(this)), this.parser.bs.on("read", this._on_read.bind(this));
            }
            _tag_24(e3) {
              const t3 = new c({ depth: this.depth + 1, no_summary: true });
              t3.on("data", (e4) => this.push(e4)), t3.on("error", (e4) => this.emit("error", e4)), t3.end(e3);
            }
            _transform(e3, t3, r3) {
              this.parser.write(e3, t3, r3);
            }
            _flush(e3) {
              return this.parser._flush(e3);
            }
            static comment(e3, t3 = {}, r3 = null) {
              if (e3 == null)
                throw new Error("input required");
              ({ options: t3, cb: r3 } = function(e4, t4) {
                switch (typeof e4) {
                  case "function":
                    return { options: {}, cb: e4 };
                  case "string":
                    return { options: { encoding: e4 }, cb: t4 };
                  case "number":
                    return { options: { max_depth: e4 }, cb: t4 };
                  case "object":
                    return { options: e4 || {}, cb: t4 };
                  default:
                    throw new TypeError("Unknown option type");
                }
              }(t3, r3));
              const n3 = new s(), { encoding: o2 = "hex", ...a2 } = t3, u2 = new c(a2);
              let f2 = null;
              return typeof r3 == "function" ? (u2.on("end", () => {
                r3(null, n3.toString("utf8"));
              }), u2.on("error", r3)) : f2 = new Promise((e4, t4) => {
                u2.on("end", () => {
                  e4(n3.toString("utf8"));
                }), u2.on("error", t4);
              }), u2.pipe(n3), i.guessEncoding(e3, o2).pipe(u2), f2;
            }
            _on_error(e3) {
              this.push("ERROR: "), this.push(e3.toString()), this.push("\n");
            }
            _on_read(e3) {
              this.all.write(e3);
              const t3 = e3.toString("hex");
              this.push(new Array(this.depth + 1).join("  ")), this.push(t3);
              let r3 = 2 * (this.max_depth - this.depth) - t3.length;
              r3 < 1 && (r3 = 1), this.push(new Array(r3 + 1).join(" ")), this.push("-- ");
            }
            _on_more(e3, t3, r3, n3) {
              let i2 = "";
              switch (this.depth++, e3) {
                case a.POS_INT:
                  i2 = "Positive number,";
                  break;
                case a.NEG_INT:
                  i2 = "Negative number,";
                  break;
                case a.ARRAY:
                  i2 = "Array, length";
                  break;
                case a.MAP:
                  i2 = "Map, count";
                  break;
                case a.BYTE_STRING:
                  i2 = "Bytes, length";
                  break;
                case a.UTF8_STRING:
                  i2 = "String, length";
                  break;
                case a.SIMPLE_FLOAT:
                  i2 = t3 === 1 ? "Simple value," : "Float,";
              }
              this.push(`${i2} next ${t3} byte${l(t3)}
`);
            }
            _on_start_string(e3, t3, r3, n3) {
              let i2 = "";
              switch (this.depth++, e3) {
                case a.BYTE_STRING:
                  i2 = `Bytes, length: ${t3}`;
                  break;
                case a.UTF8_STRING:
                  i2 = `String, length: ${t3.toString()}`;
              }
              this.push(`${i2}
`);
            }
            _on_start(e3, t3, r3, n3) {
              switch (this.depth++, r3) {
                case a.ARRAY:
                  this.push(`[${n3}], `);
                  break;
                case a.MAP:
                  n3 % 2 ? this.push(`{Val:${Math.floor(n3 / 2)}}, `) : this.push(`{Key:${Math.floor(n3 / 2)}}, `);
              }
              switch (e3) {
                case a.TAG:
                  this.push(`Tag #${t3}`), t3 === 24 && this.push(" Encoded CBOR data item");
                  break;
                case a.ARRAY:
                  t3 === f.STREAM ? this.push("Array (streaming)") : this.push(`Array, ${t3} item${l(t3)}`);
                  break;
                case a.MAP:
                  t3 === f.STREAM ? this.push("Map (streaming)") : this.push(`Map, ${t3} pair${l(t3)}`);
                  break;
                case a.BYTE_STRING:
                  this.push("Bytes (streaming)");
                  break;
                case a.UTF8_STRING:
                  this.push("String (streaming)");
              }
              this.push("\n");
            }
            _on_stop(e3) {
              this.depth--;
            }
            _on_value(e3, t3, r3, n3) {
              if (e3 !== f.BREAK)
                switch (t3) {
                  case a.ARRAY:
                    this.push(`[${r3}], `);
                    break;
                  case a.MAP:
                    r3 % 2 ? this.push(`{Val:${Math.floor(r3 / 2)}}, `) : this.push(`{Key:${Math.floor(r3 / 2)}}, `);
                }
              const o2 = i.cborValueToString(e3, -1 / 0);
              switch (typeof e3 == "string" || h.isBuffer(e3) ? (e3.length > 0 && (this.push(o2), this.push("\n")), this.depth--) : (this.push(o2), this.push("\n")), n3) {
                case u.ONE:
                case u.TWO:
                case u.FOUR:
                case u.EIGHT:
                  this.depth--;
              }
            }
            _on_data() {
              this.push("0x"), this.push(this.all.read().toString("hex")), this.push("\n");
            }
          }
          e2.exports = c;
        }, 66: (e2, t2) => {
          "use strict";
          t2.MT = { POS_INT: 0, NEG_INT: 1, BYTE_STRING: 2, UTF8_STRING: 3, ARRAY: 4, MAP: 5, TAG: 6, SIMPLE_FLOAT: 7 }, t2.TAG = { DATE_STRING: 0, DATE_EPOCH: 1, POS_BIGINT: 2, NEG_BIGINT: 3, DECIMAL_FRAC: 4, BIGFLOAT: 5, BASE64URL_EXPECTED: 21, BASE64_EXPECTED: 22, BASE16_EXPECTED: 23, CBOR: 24, URI: 32, BASE64URL: 33, BASE64: 34, REGEXP: 35, MIME: 36, SET: 258 }, t2.NUMBYTES = { ZERO: 0, ONE: 24, TWO: 25, FOUR: 26, EIGHT: 27, INDEFINITE: 31 }, t2.SIMPLE = { FALSE: 20, TRUE: 21, NULL: 22, UNDEFINED: 23 }, t2.SYMS = { NULL: Symbol.for("github.com/hildjj/node-cbor/null"), UNDEFINED: Symbol.for("github.com/hildjj/node-cbor/undef"), PARENT: Symbol.for("github.com/hildjj/node-cbor/parent"), BREAK: Symbol.for("github.com/hildjj/node-cbor/break"), STREAM: Symbol.for("github.com/hildjj/node-cbor/stream") }, t2.SHIFT32 = 4294967296, t2.BI = { MINUS_ONE: BigInt(-1), NEG_MAX: BigInt(-1) - BigInt(Number.MAX_SAFE_INTEGER), MAXINT32: BigInt("0xffffffff"), MAXINT64: BigInt("0xffffffffffffffff"), SHIFT32: BigInt(t2.SHIFT32) };
        }, 774: (e2, t2, r2) => {
          "use strict";
          const n2 = r2(71), i = r2(785), o = r2(32), s = r2(873), a = r2(202), u = (r2(830), r2(66)), { MT: f, NUMBYTES: h, SYMS: l, BI: c } = u, { Buffer: d } = r2(764), p = Symbol("count"), g = Symbol("major type"), y = Symbol("error"), b = Symbol("not found");
          function w(e3, t3, r3) {
            const n3 = [];
            return n3[p] = r3, n3[l.PARENT] = e3, n3[g] = t3, n3;
          }
          function _(e3, t3) {
            const r3 = new a();
            return r3[p] = -1, r3[l.PARENT] = e3, r3[g] = t3, r3;
          }
          class m extends Error {
            constructor(e3, t3) {
              super(`Unexpected data: 0x${e3.toString(16)}`), this.name = "UnexpectedDataError", this.byte = e3, this.value = t3;
            }
          }
          function E(e3, t3) {
            switch (typeof e3) {
              case "function":
                return { options: {}, cb: e3 };
              case "string":
                return { options: { encoding: e3 }, cb: t3 };
              case "object":
                return { options: e3 || {}, cb: t3 };
              default:
                throw new TypeError("Unknown option type");
            }
          }
          class v extends n2 {
            constructor(e3 = {}) {
              const { tags: t3 = {}, max_depth: r3 = -1, preferWeb: n3 = false, required: i2 = false, encoding: o2 = "hex", extendedResults: s2 = false, preventDuplicateKeys: u2 = false, ...f2 } = e3;
              super({ defaultEncoding: o2, ...f2 }), this.running = true, this.max_depth = r3, this.tags = t3, this.preferWeb = n3, this.extendedResults = s2, this.required = i2, this.preventDuplicateKeys = u2, s2 && (this.bs.on("read", this._onRead.bind(this)), this.valueBytes = new a());
            }
            static nullcheck(e3) {
              switch (e3) {
                case l.NULL:
                  return null;
                case l.UNDEFINED:
                  return;
                case b:
                  throw new Error("Value not found");
                default:
                  return e3;
              }
            }
            static decodeFirstSync(e3, t3 = {}) {
              if (e3 == null)
                throw new TypeError("input required");
              ({ options: t3 } = E(t3));
              const { encoding: r3 = "hex", ...n3 } = t3, i2 = new v(n3), o2 = s.guessEncoding(e3, r3), a2 = i2._parse();
              let u2 = a2.next();
              for (; !u2.done; ) {
                const e4 = o2.read(u2.value);
                if (e4 == null || e4.length !== u2.value)
                  throw new Error("Insufficient data");
                i2.extendedResults && i2.valueBytes.write(e4), u2 = a2.next(e4);
              }
              let f2 = null;
              if (i2.extendedResults)
                f2 = u2.value, f2.unused = o2.read();
              else if (f2 = v.nullcheck(u2.value), o2.length > 0) {
                const e4 = o2.read(1);
                throw o2.unshift(e4), new m(e4[0], f2);
              }
              return f2;
            }
            static decodeAllSync(e3, t3 = {}) {
              if (e3 == null)
                throw new TypeError("input required");
              ({ options: t3 } = E(t3));
              const { encoding: r3 = "hex", ...n3 } = t3, i2 = new v(n3), o2 = s.guessEncoding(e3, r3), a2 = [];
              for (; o2.length > 0; ) {
                const e4 = i2._parse();
                let t4 = e4.next();
                for (; !t4.done; ) {
                  const r4 = o2.read(t4.value);
                  if (r4 == null || r4.length !== t4.value)
                    throw new Error("Insufficient data");
                  i2.extendedResults && i2.valueBytes.write(r4), t4 = e4.next(r4);
                }
                a2.push(v.nullcheck(t4.value));
              }
              return a2;
            }
            static decodeFirst(e3, t3 = {}, r3 = null) {
              if (e3 == null)
                throw new TypeError("input required");
              ({ options: t3, cb: r3 } = E(t3, r3));
              const { encoding: n3 = "hex", required: i2 = false, ...o2 } = t3, a2 = new v(o2);
              let u2 = b;
              const f2 = s.guessEncoding(e3, n3), h2 = new Promise((e4, t4) => {
                a2.on("data", (e5) => {
                  u2 = v.nullcheck(e5), a2.close();
                }), a2.once("error", (r4) => a2.extendedResults && r4 instanceof m ? (u2.unused = a2.bs.slice(), e4(u2)) : (u2 !== b && (r4.value = u2), u2 = y, a2.close(), t4(r4))), a2.once("end", () => {
                  switch (u2) {
                    case b:
                      return i2 ? t4(new Error("No CBOR found")) : e4(u2);
                    case y:
                      return;
                    default:
                      return e4(u2);
                  }
                });
              });
              return typeof r3 == "function" && h2.then((e4) => r3(null, e4), r3), f2.pipe(a2), h2;
            }
            static decodeAll(e3, t3 = {}, r3 = null) {
              if (e3 == null)
                throw new TypeError("input required");
              ({ options: t3, cb: r3 } = E(t3, r3));
              const { encoding: n3 = "hex", ...i2 } = t3, o2 = new v(i2), a2 = [];
              o2.on("data", (e4) => a2.push(v.nullcheck(e4)));
              const u2 = new Promise((e4, t4) => {
                o2.on("error", t4), o2.on("end", () => e4(a2));
              });
              return typeof r3 == "function" && u2.then((e4) => r3(void 0, e4), (e4) => r3(e4, void 0)), s.guessEncoding(e3, n3).pipe(o2), u2;
            }
            close() {
              this.running = false, this.__fresh = true;
            }
            _onRead(e3) {
              this.valueBytes.write(e3);
            }
            *_parse() {
              let e3 = null, t3 = 0, r3 = null;
              for (; ; ) {
                if (this.max_depth >= 0 && t3 > this.max_depth)
                  throw new Error(`Maximum depth ${this.max_depth} exceeded`);
                const [n3] = yield 1;
                if (!this.running)
                  throw this.bs.unshift(d.from([n3])), new m(n3);
                const u2 = n3 >> 5, y2 = 31 & n3, b2 = e3 == null ? void 0 : e3[g], E2 = e3 == null ? void 0 : e3.length;
                switch (y2) {
                  case h.ONE:
                    this.emit("more-bytes", u2, 1, b2, E2), [r3] = yield 1;
                    break;
                  case h.TWO:
                  case h.FOUR:
                  case h.EIGHT: {
                    const e4 = 1 << y2 - 24;
                    this.emit("more-bytes", u2, e4, b2, E2);
                    const t4 = yield e4;
                    r3 = u2 === f.SIMPLE_FLOAT ? t4 : s.parseCBORint(y2, t4);
                    break;
                  }
                  case 28:
                  case 29:
                  case 30:
                    throw this.running = false, new Error(`Additional info not implemented: ${y2}`);
                  case h.INDEFINITE:
                    switch (u2) {
                      case f.POS_INT:
                      case f.NEG_INT:
                      case f.TAG:
                        throw new Error(`Invalid indefinite encoding for MT ${u2}`);
                    }
                    r3 = -1;
                    break;
                  default:
                    r3 = y2;
                }
                switch (u2) {
                  case f.POS_INT:
                    break;
                  case f.NEG_INT:
                    r3 = r3 === Number.MAX_SAFE_INTEGER ? c.NEG_MAX : typeof r3 == "bigint" ? c.MINUS_ONE - r3 : -1 - r3;
                    break;
                  case f.BYTE_STRING:
                  case f.UTF8_STRING:
                    switch (r3) {
                      case 0:
                        this.emit("start-string", u2, r3, b2, E2), r3 = u2 === f.UTF8_STRING ? "" : this.preferWeb ? new Uint8Array(0) : d.allocUnsafe(0);
                        break;
                      case -1:
                        this.emit("start", u2, l.STREAM, b2, E2), e3 = _(e3, u2), t3++;
                        continue;
                      default:
                        this.emit("start-string", u2, r3, b2, E2), r3 = yield r3, u2 === f.UTF8_STRING ? r3 = s.utf8(r3) : this.preferWeb && (r3 = new Uint8Array(r3.buffer, r3.byteOffset, r3.length));
                    }
                    break;
                  case f.ARRAY:
                  case f.MAP:
                    switch (r3) {
                      case 0:
                        r3 = u2 === f.MAP ? {} : [];
                        break;
                      case -1:
                        this.emit("start", u2, l.STREAM, b2, E2), e3 = w(e3, u2, -1), t3++;
                        continue;
                      default:
                        this.emit("start", u2, r3, b2, E2), e3 = w(e3, u2, r3 * (u2 - 3)), t3++;
                        continue;
                    }
                    break;
                  case f.TAG:
                    this.emit("start", u2, r3, b2, E2), e3 = w(e3, u2, 1), e3.push(r3), t3++;
                    continue;
                  case f.SIMPLE_FLOAT:
                    if (typeof r3 == "number") {
                      if (y2 === h.ONE && r3 < 32)
                        throw new Error(`Invalid two-byte encoding of simple value ${r3}`);
                      const t4 = e3 != null;
                      r3 = o.decode(r3, t4, t4 && e3[p] < 0);
                    } else
                      r3 = s.parseCBORfloat(r3);
                }
                this.emit("value", r3, b2, E2, y2);
                let S = false;
                for (; e3 != null; ) {
                  if (r3 === l.BREAK)
                    e3[p] = 1;
                  else if (Array.isArray(e3))
                    e3.push(r3);
                  else {
                    const t4 = e3[g];
                    if (t4 != null && t4 !== u2)
                      throw this.running = false, new Error("Invalid major type in indefinite encoding");
                    e3.write(r3);
                  }
                  if (--e3[p] != 0) {
                    S = true;
                    break;
                  }
                  if (--t3, delete e3[p], Array.isArray(e3))
                    switch (e3[g]) {
                      case f.ARRAY:
                        r3 = e3;
                        break;
                      case f.MAP: {
                        let t4 = true;
                        if (e3.length % 2 != 0)
                          throw new Error(`Invalid map length: ${e3.length}`);
                        for (let r4 = 0, n5 = e3.length; r4 < n5; r4 += 2)
                          if (typeof e3[r4] != "string" || e3[r4] === "__proto__") {
                            t4 = false;
                            break;
                          }
                        if (t4) {
                          r3 = {};
                          for (let t5 = 0, n5 = e3.length; t5 < n5; t5 += 2) {
                            if (this.preventDuplicateKeys && Object.prototype.hasOwnProperty.call(r3, e3[t5]))
                              throw new Error("Duplicate keys in a map");
                            r3[e3[t5]] = e3[t5 + 1];
                          }
                        } else {
                          r3 = /* @__PURE__ */ new Map();
                          for (let t5 = 0, n5 = e3.length; t5 < n5; t5 += 2) {
                            if (this.preventDuplicateKeys && r3.has(e3[t5]))
                              throw new Error("Duplicate keys in a map");
                            r3.set(e3[t5], e3[t5 + 1]);
                          }
                        }
                        break;
                      }
                      case f.TAG:
                        r3 = new i(e3[0], e3[1]).convert(this.tags);
                    }
                  else if (e3 instanceof a)
                    switch (e3[g]) {
                      case f.BYTE_STRING:
                        r3 = e3.slice(), this.preferWeb && (r3 = new Uint8Array(r3.buffer, r3.byteOffset, r3.length));
                        break;
                      case f.UTF8_STRING:
                        r3 = e3.toString("utf-8");
                    }
                  this.emit("stop", e3[g]);
                  const n4 = e3;
                  e3 = e3[l.PARENT], delete n4[l.PARENT], delete n4[g];
                }
                if (!S) {
                  if (this.extendedResults) {
                    const e4 = this.valueBytes.slice(), t4 = { value: v.nullcheck(r3), bytes: e4, length: e4.length };
                    return this.valueBytes = new a(), t4;
                  }
                  return r3;
                }
              }
            }
          }
          v.NOT_FOUND = b, e2.exports = v;
        }, 694: (e2, t2, r2) => {
          "use strict";
          const n2 = r2(830), i = r2(774), o = r2(873), s = r2(202), { MT: a, SYMS: u } = r2(66);
          class f extends n2.Transform {
            constructor(e3 = {}) {
              const { separator: t3 = "\n", stream_errors: r3 = false, tags: n3, max_depth: o2, preferWeb: s2, encoding: a2, ...u2 } = e3;
              super({ ...u2, readableObjectMode: false, writableObjectMode: false }), this.float_bytes = -1, this.separator = t3, this.stream_errors = r3, this.parser = new i({ tags: n3, max_depth: o2, preferWeb: s2, encoding: a2 }), this.parser.on("more-bytes", this._on_more.bind(this)), this.parser.on("value", this._on_value.bind(this)), this.parser.on("start", this._on_start.bind(this)), this.parser.on("stop", this._on_stop.bind(this)), this.parser.on("data", this._on_data.bind(this)), this.parser.on("error", this._on_error.bind(this));
            }
            _transform(e3, t3, r3) {
              return this.parser.write(e3, t3, r3);
            }
            _flush(e3) {
              return this.parser._flush((t3) => this.stream_errors ? (t3 && this._on_error(t3), e3()) : e3(t3));
            }
            static diagnose(e3, t3 = {}, r3 = null) {
              if (e3 == null)
                throw new TypeError("input required");
              ({ options: t3, cb: r3 } = function(e4, t4) {
                switch (typeof e4) {
                  case "function":
                    return { options: {}, cb: e4 };
                  case "string":
                    return { options: { encoding: e4 }, cb: t4 };
                  case "object":
                    return { options: e4 || {}, cb: t4 };
                  default:
                    throw new TypeError("Unknown option type");
                }
              }(t3, r3));
              const { encoding: n3 = "hex", ...i2 } = t3, a2 = new s(), u2 = new f(i2);
              let h = null;
              return typeof r3 == "function" ? (u2.on("end", () => r3(null, a2.toString("utf8"))), u2.on("error", r3)) : h = new Promise((e4, t4) => {
                u2.on("end", () => e4(a2.toString("utf8"))), u2.on("error", t4);
              }), u2.pipe(a2), o.guessEncoding(e3, n3).pipe(u2), h;
            }
            _on_error(e3) {
              this.stream_errors ? this.push(e3.toString()) : this.emit("error", e3);
            }
            _on_more(e3, t3, r3, n3) {
              e3 === a.SIMPLE_FLOAT && (this.float_bytes = { 2: 1, 4: 2, 8: 3 }[t3]);
            }
            _fore(e3, t3) {
              switch (e3) {
                case a.BYTE_STRING:
                case a.UTF8_STRING:
                case a.ARRAY:
                  t3 > 0 && this.push(", ");
                  break;
                case a.MAP:
                  t3 > 0 && (t3 % 2 ? this.push(": ") : this.push(", "));
              }
            }
            _on_value(e3, t3, r3) {
              if (e3 === u.BREAK)
                return;
              this._fore(t3, r3);
              const n3 = this.float_bytes;
              this.float_bytes = -1, this.push(o.cborValueToString(e3, n3));
            }
            _on_start(e3, t3, r3, n3) {
              switch (this._fore(r3, n3), e3) {
                case a.TAG:
                  this.push(`${t3}(`);
                  break;
                case a.ARRAY:
                  this.push("[");
                  break;
                case a.MAP:
                  this.push("{");
                  break;
                case a.BYTE_STRING:
                case a.UTF8_STRING:
                  this.push("(");
              }
              t3 === u.STREAM && this.push("_ ");
            }
            _on_stop(e3) {
              switch (e3) {
                case a.TAG:
                  this.push(")");
                  break;
                case a.ARRAY:
                  this.push("]");
                  break;
                case a.MAP:
                  this.push("}");
                  break;
                case a.BYTE_STRING:
                case a.UTF8_STRING:
                  this.push(")");
              }
            }
            _on_data() {
              this.push(this.separator);
            }
          }
          e2.exports = f;
        }, 666: (e2, t2, r2) => {
          "use strict";
          const n2 = r2(830), i = r2(202), o = r2(873), s = r2(66), { MT: a, NUMBYTES: u, SHIFT32: f, SIMPLE: h, SYMS: l, TAG: c, BI: d } = s, { Buffer: p } = r2(764), g = a.SIMPLE_FLOAT << 5 | u.TWO, y = a.SIMPLE_FLOAT << 5 | u.FOUR, b = a.SIMPLE_FLOAT << 5 | u.EIGHT, w = a.SIMPLE_FLOAT << 5 | h.TRUE, _ = a.SIMPLE_FLOAT << 5 | h.FALSE, m = a.SIMPLE_FLOAT << 5 | h.UNDEFINED, E = a.SIMPLE_FLOAT << 5 | h.NULL, v = p.from([255]), S = p.from("f97e00", "hex"), T = p.from("f9fc00", "hex"), I = p.from("f97c00", "hex"), A = p.from("f98000", "hex"), B = {};
          let R = {};
          class U extends n2.Transform {
            constructor(e3 = {}) {
              const { canonical: t3 = false, encodeUndefined: r3, disallowUndefinedKeys: n3 = false, dateType: i2 = "number", collapseBigIntegers: o2 = false, detectLoops: s2 = false, omitUndefinedProperties: a2 = false, genTypes: u2 = [], ...f2 } = e3;
              if (super({ ...f2, readableObjectMode: false, writableObjectMode: true }), this.canonical = t3, this.encodeUndefined = r3, this.disallowUndefinedKeys = n3, this.dateType = function(e4) {
                if (!e4)
                  return "number";
                switch (e4.toLowerCase()) {
                  case "number":
                    return "number";
                  case "float":
                    return "float";
                  case "int":
                  case "integer":
                    return "int";
                  case "string":
                    return "string";
                }
                throw new TypeError(`dateType invalid, got "${e4}"`);
              }(i2), this.collapseBigIntegers = !!this.canonical || o2, this.detectLoops = void 0, typeof s2 == "boolean")
                s2 && (this.detectLoops = new WeakSet());
              else {
                if (!(s2 instanceof WeakSet))
                  throw new TypeError("detectLoops must be boolean or WeakSet");
                this.detectLoops = s2;
              }
              if (this.omitUndefinedProperties = a2, this.semanticTypes = { ...U.SEMANTIC_TYPES }, Array.isArray(u2))
                for (let e4 = 0, t4 = u2.length; e4 < t4; e4 += 2)
                  this.addSemanticType(u2[e4], u2[e4 + 1]);
              else
                for (const [e4, t4] of Object.entries(u2))
                  this.addSemanticType(e4, t4);
            }
            _transform(e3, t3, r3) {
              return r3(this.pushAny(e3) === false ? new Error("Push Error") : void 0);
            }
            _flush(e3) {
              return e3();
            }
            _pushUInt8(e3) {
              const t3 = p.allocUnsafe(1);
              return t3.writeUInt8(e3, 0), this.push(t3);
            }
            _pushUInt16BE(e3) {
              const t3 = p.allocUnsafe(2);
              return t3.writeUInt16BE(e3, 0), this.push(t3);
            }
            _pushUInt32BE(e3) {
              const t3 = p.allocUnsafe(4);
              return t3.writeUInt32BE(e3, 0), this.push(t3);
            }
            _pushFloatBE(e3) {
              const t3 = p.allocUnsafe(4);
              return t3.writeFloatBE(e3, 0), this.push(t3);
            }
            _pushDoubleBE(e3) {
              const t3 = p.allocUnsafe(8);
              return t3.writeDoubleBE(e3, 0), this.push(t3);
            }
            _pushNaN() {
              return this.push(S);
            }
            _pushInfinity(e3) {
              const t3 = e3 < 0 ? T : I;
              return this.push(t3);
            }
            _pushFloat(e3) {
              if (this.canonical) {
                const t3 = p.allocUnsafe(2);
                if (o.writeHalf(t3, e3))
                  return this._pushUInt8(g) && this.push(t3);
              }
              return Math.fround(e3) === e3 ? this._pushUInt8(y) && this._pushFloatBE(e3) : this._pushUInt8(b) && this._pushDoubleBE(e3);
            }
            _pushInt(e3, t3, r3) {
              const n3 = t3 << 5;
              if (e3 < 24)
                return this._pushUInt8(n3 | e3);
              if (e3 <= 255)
                return this._pushUInt8(n3 | u.ONE) && this._pushUInt8(e3);
              if (e3 <= 65535)
                return this._pushUInt8(n3 | u.TWO) && this._pushUInt16BE(e3);
              if (e3 <= 4294967295)
                return this._pushUInt8(n3 | u.FOUR) && this._pushUInt32BE(e3);
              let i2 = Number.MAX_SAFE_INTEGER;
              return t3 === a.NEG_INT && i2--, e3 <= i2 ? this._pushUInt8(n3 | u.EIGHT) && this._pushUInt32BE(Math.floor(e3 / f)) && this._pushUInt32BE(e3 % f) : t3 === a.NEG_INT ? this._pushFloat(r3) : this._pushFloat(e3);
            }
            _pushIntNum(e3) {
              return Object.is(e3, -0) ? this.push(A) : e3 < 0 ? this._pushInt(-e3 - 1, a.NEG_INT, e3) : this._pushInt(e3, a.POS_INT);
            }
            _pushNumber(e3) {
              return isNaN(e3) ? this._pushNaN() : isFinite(e3) ? Math.round(e3) === e3 ? this._pushIntNum(e3) : this._pushFloat(e3) : this._pushInfinity(e3);
            }
            _pushString(e3) {
              const t3 = p.byteLength(e3, "utf8");
              return this._pushInt(t3, a.UTF8_STRING) && this.push(e3, "utf8");
            }
            _pushBoolean(e3) {
              return this._pushUInt8(e3 ? w : _);
            }
            _pushUndefined(e3) {
              switch (typeof this.encodeUndefined) {
                case "undefined":
                  return this._pushUInt8(m);
                case "function":
                  return this.pushAny(this.encodeUndefined(e3));
                case "object": {
                  const e4 = o.bufferishToBuffer(this.encodeUndefined);
                  if (e4)
                    return this.push(e4);
                }
              }
              return this.pushAny(this.encodeUndefined);
            }
            _pushNull(e3) {
              return this._pushUInt8(E);
            }
            _pushTag(e3) {
              return this._pushInt(e3, a.TAG);
            }
            _pushJSBigint(e3) {
              let t3 = a.POS_INT, r3 = c.POS_BIGINT;
              if (e3 < 0 && (e3 = -e3 + d.MINUS_ONE, t3 = a.NEG_INT, r3 = c.NEG_BIGINT), this.collapseBigIntegers && e3 <= d.MAXINT64)
                return e3 <= 4294967295 ? this._pushInt(Number(e3), t3) : this._pushUInt8(t3 << 5 | u.EIGHT) && this._pushUInt32BE(Number(e3 / d.SHIFT32)) && this._pushUInt32BE(Number(e3 % d.SHIFT32));
              let n3 = e3.toString(16);
              n3.length % 2 && (n3 = `0${n3}`);
              const i2 = p.from(n3, "hex");
              return this._pushTag(r3) && U._pushBuffer(this, i2);
            }
            _pushObject(e3, t3) {
              if (!e3)
                return this._pushNull(e3);
              if (!(t3 = { indefinite: false, skipTypes: false, ...t3 }).indefinite && this.detectLoops) {
                if (this.detectLoops.has(e3))
                  throw new Error("Loop detected while CBOR encoding.\nCall removeLoopDetectors before resuming.");
                this.detectLoops.add(e3);
              }
              if (!t3.skipTypes) {
                const t4 = e3.encodeCBOR;
                if (typeof t4 == "function")
                  return t4.call(e3, this);
                const r4 = this.semanticTypes[e3.constructor.name];
                if (r4)
                  return r4.call(e3, this, e3);
              }
              const r3 = Object.keys(e3).filter((t4) => {
                const r4 = typeof e3[t4];
                return r4 !== "function" && (!this.omitUndefinedProperties || r4 !== "undefined");
              }), n3 = {};
              if (this.canonical && r3.sort((e4, t4) => {
                const r4 = n3[e4] || (n3[e4] = U.encode(e4)), i3 = n3[t4] || (n3[t4] = U.encode(t4));
                return r4.compare(i3);
              }), t3.indefinite) {
                if (!this._pushUInt8(a.MAP << 5 | u.INDEFINITE))
                  return false;
              } else if (!this._pushInt(r3.length, a.MAP))
                return false;
              let i2 = null;
              for (let t4 = 0, o2 = r3.length; t4 < o2; t4++) {
                const o3 = r3[t4];
                if (this.canonical && (i2 = n3[o3])) {
                  if (!this.push(i2))
                    return false;
                } else if (!this._pushString(o3))
                  return false;
                if (!this.pushAny(e3[o3]))
                  return false;
              }
              if (t3.indefinite) {
                if (!this.push(v))
                  return false;
              } else
                this.detectLoops && this.detectLoops.delete(e3);
              return true;
            }
            _encodeAll(e3) {
              const t3 = new i({ highWaterMark: this.readableHighWaterMark });
              this.pipe(t3);
              for (const t4 of e3)
                this.pushAny(t4);
              return this.end(), t3.read();
            }
            addSemanticType(e3, t3) {
              const r3 = typeof e3 == "string" ? e3 : e3.name, n3 = this.semanticTypes[r3];
              if (t3) {
                if (typeof t3 != "function")
                  throw new TypeError("fun must be of type function");
                this.semanticTypes[r3] = t3;
              } else
                n3 && delete this.semanticTypes[r3];
              return n3;
            }
            pushAny(e3) {
              switch (typeof e3) {
                case "number":
                  return this._pushNumber(e3);
                case "bigint":
                  return this._pushJSBigint(e3);
                case "string":
                  return this._pushString(e3);
                case "boolean":
                  return this._pushBoolean(e3);
                case "undefined":
                  return this._pushUndefined(e3);
                case "object":
                  return this._pushObject(e3);
                case "symbol":
                  switch (e3) {
                    case l.NULL:
                      return this._pushNull(null);
                    case l.UNDEFINED:
                      return this._pushUndefined(void 0);
                    default:
                      throw new TypeError(`Unknown symbol: ${e3.toString()}`);
                  }
                default:
                  throw new TypeError(`Unknown type: ${typeof e3}, ${typeof e3.toString == "function" ? e3.toString() : ""}`);
              }
            }
            static pushArray(e3, t3, r3) {
              r3 = { indefinite: false, ...r3 };
              const n3 = t3.length;
              if (r3.indefinite) {
                if (!e3._pushUInt8(a.ARRAY << 5 | u.INDEFINITE))
                  return false;
              } else if (!e3._pushInt(n3, a.ARRAY))
                return false;
              for (let r4 = 0; r4 < n3; r4++)
                if (!e3.pushAny(t3[r4]))
                  return false;
              return !(r3.indefinite && !e3.push(v));
            }
            removeLoopDetectors() {
              return !!this.detectLoops && (this.detectLoops = new WeakSet(), true);
            }
            static _pushDate(e3, t3) {
              switch (e3.dateType) {
                case "string":
                  return e3._pushTag(c.DATE_STRING) && e3._pushString(t3.toISOString());
                case "int":
                  return e3._pushTag(c.DATE_EPOCH) && e3._pushIntNum(Math.round(t3.getTime() / 1e3));
                case "float":
                  return e3._pushTag(c.DATE_EPOCH) && e3._pushFloat(t3.getTime() / 1e3);
                default:
                  return e3._pushTag(c.DATE_EPOCH) && e3.pushAny(t3.getTime() / 1e3);
              }
            }
            static _pushBuffer(e3, t3) {
              return e3._pushInt(t3.length, a.BYTE_STRING) && e3.push(t3);
            }
            static _pushNoFilter(e3, t3) {
              return U._pushBuffer(e3, t3.slice());
            }
            static _pushRegexp(e3, t3) {
              return e3._pushTag(c.REGEXP) && e3.pushAny(t3.source);
            }
            static _pushSet(e3, t3) {
              if (!e3._pushTag(c.SET))
                return false;
              if (!e3._pushInt(t3.size, a.ARRAY))
                return false;
              for (const r3 of t3)
                if (!e3.pushAny(r3))
                  return false;
              return true;
            }
            static _pushURL(e3, t3) {
              return e3._pushTag(c.URI) && e3.pushAny(t3.toString());
            }
            static _pushBoxed(e3, t3) {
              return e3.pushAny(t3.valueOf());
            }
            static _pushMap(e3, t3, r3) {
              r3 = { indefinite: false, ...r3 };
              let n3 = [...t3.entries()];
              if (e3.omitUndefinedProperties && (n3 = n3.filter(([e4, t4]) => t4 !== void 0)), r3.indefinite) {
                if (!e3._pushUInt8(a.MAP << 5 | u.INDEFINITE))
                  return false;
              } else if (!e3._pushInt(n3.length, a.MAP))
                return false;
              if (e3.canonical) {
                const t4 = new U({ genTypes: e3.semanticTypes, canonical: e3.canonical, detectLoops: Boolean(e3.detectLoops), dateType: e3.dateType, disallowUndefinedKeys: e3.disallowUndefinedKeys, collapseBigIntegers: e3.collapseBigIntegers }), r4 = new i({ highWaterMark: e3.readableHighWaterMark });
                t4.pipe(r4), n3.sort(([e4], [n4]) => {
                  t4.pushAny(e4);
                  const i2 = r4.read();
                  t4.pushAny(n4);
                  const o2 = r4.read();
                  return i2.compare(o2);
                });
                for (const [t5, r5] of n3) {
                  if (e3.disallowUndefinedKeys && t5 === void 0)
                    throw new Error("Invalid Map key: undefined");
                  if (!e3.pushAny(t5) || !e3.pushAny(r5))
                    return false;
                }
              } else
                for (const [t4, r4] of n3) {
                  if (e3.disallowUndefinedKeys && t4 === void 0)
                    throw new Error("Invalid Map key: undefined");
                  if (!e3.pushAny(t4) || !e3.pushAny(r4))
                    return false;
                }
              return !(r3.indefinite && !e3.push(v));
            }
            static _pushTypedArray(e3, t3) {
              let r3 = 64, n3 = t3.BYTES_PER_ELEMENT;
              const { name: i2 } = t3.constructor;
              return i2.startsWith("Float") ? (r3 |= 16, n3 /= 2) : i2.includes("U") || (r3 |= 8), (i2.includes("Clamped") || n3 !== 1 && !o.isBigEndian()) && (r3 |= 4), r3 |= { 1: 0, 2: 1, 4: 2, 8: 3 }[n3], !!e3._pushTag(r3) && U._pushBuffer(e3, p.from(t3.buffer, t3.byteOffset, t3.byteLength));
            }
            static _pushArrayBuffer(e3, t3) {
              return U._pushBuffer(e3, p.from(t3));
            }
            static encodeIndefinite(e3, t3, r3 = {}) {
              if (t3 == null) {
                if (this == null)
                  throw new Error("No object to encode");
                t3 = this;
              }
              const { chunkSize: n3 = 4096 } = r3;
              let i2 = true;
              const s2 = typeof t3;
              let f2 = null;
              if (s2 === "string") {
                i2 = i2 && e3._pushUInt8(a.UTF8_STRING << 5 | u.INDEFINITE);
                let r4 = 0;
                for (; r4 < t3.length; ) {
                  const o2 = r4 + n3;
                  i2 = i2 && e3._pushString(t3.slice(r4, o2)), r4 = o2;
                }
                i2 = i2 && e3.push(v);
              } else if (f2 = o.bufferishToBuffer(t3)) {
                i2 = i2 && e3._pushUInt8(a.BYTE_STRING << 5 | u.INDEFINITE);
                let t4 = 0;
                for (; t4 < f2.length; ) {
                  const r4 = t4 + n3;
                  i2 = i2 && U._pushBuffer(e3, f2.slice(t4, r4)), t4 = r4;
                }
                i2 = i2 && e3.push(v);
              } else if (Array.isArray(t3))
                i2 = i2 && U.pushArray(e3, t3, { indefinite: true });
              else if (t3 instanceof Map)
                i2 = i2 && U._pushMap(e3, t3, { indefinite: true });
              else {
                if (s2 !== "object")
                  throw new Error("Invalid indefinite encoding");
                i2 = i2 && e3._pushObject(t3, { indefinite: true, skipTypes: true });
              }
              return i2;
            }
            static encode(...e3) {
              return new U()._encodeAll(e3);
            }
            static encodeCanonical(...e3) {
              return new U({ canonical: true })._encodeAll(e3);
            }
            static encodeOne(e3, t3) {
              return new U(t3)._encodeAll([e3]);
            }
            static encodeAsync(e3, t3) {
              return new Promise((r3, n3) => {
                const i2 = [], o2 = new U(t3);
                o2.on("data", (e4) => i2.push(e4)), o2.on("error", n3), o2.on("finish", () => r3(p.concat(i2))), o2.pushAny(e3), o2.end();
              });
            }
            static get SEMANTIC_TYPES() {
              return R;
            }
            static set SEMANTIC_TYPES(e3) {
              R = e3;
            }
            static reset() {
              U.SEMANTIC_TYPES = { ...B };
            }
          }
          Object.assign(B, { Array: U.pushArray, Date: U._pushDate, Buffer: U._pushBuffer, [p.name]: U._pushBuffer, Map: U._pushMap, NoFilter: U._pushNoFilter, [i.name]: U._pushNoFilter, RegExp: U._pushRegexp, Set: U._pushSet, ArrayBuffer: U._pushArrayBuffer, Uint8ClampedArray: U._pushTypedArray, Uint8Array: U._pushTypedArray, Uint16Array: U._pushTypedArray, Uint32Array: U._pushTypedArray, Int8Array: U._pushTypedArray, Int16Array: U._pushTypedArray, Int32Array: U._pushTypedArray, Float32Array: U._pushTypedArray, Float64Array: U._pushTypedArray, URL: U._pushURL, Boolean: U._pushBoxed, Number: U._pushBoxed, String: U._pushBoxed }), typeof BigUint64Array != "undefined" && (B[BigUint64Array.name] = U._pushTypedArray), typeof BigInt64Array != "undefined" && (B[BigInt64Array.name] = U._pushTypedArray), U.reset(), e2.exports = U;
        }, 70: (e2, t2, r2) => {
          "use strict";
          const { Buffer: n2 } = r2(764), i = r2(666), o = r2(774), { MT: s } = r2(66);
          class a extends Map {
            constructor(e3) {
              super(e3);
            }
            static _encode(e3) {
              return i.encodeCanonical(e3).toString("base64");
            }
            static _decode(e3) {
              return o.decodeFirstSync(e3, "base64");
            }
            get(e3) {
              return super.get(a._encode(e3));
            }
            set(e3, t3) {
              return super.set(a._encode(e3), t3);
            }
            delete(e3) {
              return super.delete(a._encode(e3));
            }
            has(e3) {
              return super.has(a._encode(e3));
            }
            *keys() {
              for (const e3 of super.keys())
                yield a._decode(e3);
            }
            *entries() {
              for (const e3 of super.entries())
                yield [a._decode(e3[0]), e3[1]];
            }
            [Symbol.iterator]() {
              return this.entries();
            }
            forEach(e3, t3) {
              if (typeof e3 != "function")
                throw new TypeError("Must be function");
              for (const t4 of super.entries())
                e3.call(this, t4[1], a._decode(t4[0]), this);
            }
            encodeCBOR(e3) {
              if (!e3._pushInt(this.size, s.MAP))
                return false;
              if (e3.canonical) {
                const t3 = Array.from(super.entries()).map((e4) => [n2.from(e4[0], "base64"), e4[1]]);
                t3.sort((e4, t4) => e4[0].compare(t4[0]));
                for (const r3 of t3)
                  if (!e3.push(r3[0]) || !e3.pushAny(r3[1]))
                    return false;
              } else
                for (const t3 of super.entries())
                  if (!e3.push(n2.from(t3[0], "base64")) || !e3.pushAny(t3[1]))
                    return false;
              return true;
            }
          }
          e2.exports = a;
        }, 32: (e2, t2, r2) => {
          "use strict";
          const { MT: n2, SIMPLE: i, SYMS: o } = r2(66);
          class s {
            constructor(e3) {
              if (typeof e3 != "number")
                throw new Error("Invalid Simple type: " + typeof e3);
              if (e3 < 0 || e3 > 255 || (0 | e3) !== e3)
                throw new Error(`value must be a small positive integer: ${e3}`);
              this.value = e3;
            }
            toString() {
              return `simple(${this.value})`;
            }
            [Symbol.for("nodejs.util.inspect.custom")](e3, t3) {
              return `simple(${this.value})`;
            }
            encodeCBOR(e3) {
              return e3._pushInt(this.value, n2.SIMPLE_FLOAT);
            }
            static isSimple(e3) {
              return e3 instanceof s;
            }
            static decode(e3, t3 = true, r3 = false) {
              switch (e3) {
                case i.FALSE:
                  return false;
                case i.TRUE:
                  return true;
                case i.NULL:
                  return t3 ? null : o.NULL;
                case i.UNDEFINED:
                  if (t3)
                    return;
                  return o.UNDEFINED;
                case -1:
                  if (!t3 || !r3)
                    throw new Error("Invalid BREAK");
                  return o.BREAK;
                default:
                  return new s(e3);
              }
            }
          }
          e2.exports = s;
        }, 785: (e2, t2, r2) => {
          "use strict";
          const n2 = r2(66), i = r2(873), o = Symbol("INTERNAL_JSON");
          function s(e3, t3) {
            if (i.isBufferish(e3))
              e3.toJSON = t3;
            else if (Array.isArray(e3))
              for (const r3 of e3)
                s(r3, t3);
            else if (e3 && typeof e3 == "object" && (!(e3 instanceof p) || e3.tag < 21 || e3.tag > 23))
              for (const r3 of Object.values(e3))
                s(r3, t3);
          }
          function a() {
            return i.base64(this);
          }
          function u() {
            return i.base64url(this);
          }
          function f() {
            return this.toString("hex");
          }
          const h = { 0: (e3) => new Date(e3), 1: (e3) => new Date(1e3 * e3), 2: (e3) => i.bufferToBigInt(e3), 3: (e3) => n2.BI.MINUS_ONE - i.bufferToBigInt(e3), 21: (e3, t3) => (i.isBufferish(e3) ? t3[o] = u : s(e3, u), t3), 22: (e3, t3) => (i.isBufferish(e3) ? t3[o] = a : s(e3, a), t3), 23: (e3, t3) => (i.isBufferish(e3) ? t3[o] = f : s(e3, f), t3), 32: (e3) => new URL(e3), 33: (e3, t3) => {
            if (!e3.match(/^[a-zA-Z0-9_-]+$/))
              throw new Error("Invalid base64url characters");
            const r3 = e3.length % 4;
            if (r3 === 1)
              throw new Error("Invalid base64url length");
            if (r3 === 2) {
              if ("AQgw".indexOf(e3[e3.length - 1]) === -1)
                throw new Error("Invalid base64 padding");
            } else if (r3 === 3 && "AEIMQUYcgkosw048".indexOf(e3[e3.length - 1]) === -1)
              throw new Error("Invalid base64 padding");
            return t3;
          }, 34: (e3, t3) => {
            const r3 = e3.match(/^[a-zA-Z0-9+/]+(?<padding>={0,2})$/);
            if (!r3)
              throw new Error("Invalid base64 characters");
            if (e3.length % 4 != 0)
              throw new Error("Invalid base64 length");
            if (r3.groups.padding === "=") {
              if ("AQgw".indexOf(e3[e3.length - 2]) === -1)
                throw new Error("Invalid base64 padding");
            } else if (r3.groups.padding === "==" && "AEIMQUYcgkosw048".indexOf(e3[e3.length - 3]) === -1)
              throw new Error("Invalid base64 padding");
            return t3;
          }, 35: (e3) => new RegExp(e3), 258: (e3) => new Set(e3) }, l = { 64: Uint8Array, 65: Uint16Array, 66: Uint32Array, 68: Uint8ClampedArray, 69: Uint16Array, 70: Uint32Array, 72: Int8Array, 73: Int16Array, 74: Int32Array, 77: Int16Array, 78: Int32Array, 81: Float32Array, 82: Float64Array, 85: Float32Array, 86: Float64Array };
          function c(e3, t3) {
            if (!i.isBufferish(e3))
              throw new TypeError("val not a buffer");
            const { tag: r3 } = t3, n3 = l[r3];
            if (!n3)
              throw new Error(`Invalid typed array tag: ${r3}`);
            const o2 = 2 ** (((16 & r3) >> 4) + (3 & r3));
            return !(4 & r3) !== i.isBigEndian() && o2 > 1 && function(e4, t4, r4, n4) {
              const i2 = new DataView(e4), [o3, s2] = { 2: [i2.getUint16, i2.setUint16], 4: [i2.getUint32, i2.setUint32], 8: [i2.getBigUint64, i2.setBigUint64] }[t4], a2 = r4 + n4;
              for (let e5 = r4; e5 < a2; e5 += t4)
                s2.call(i2, e5, o3.call(i2, e5, true));
            }(e3.buffer, o2, e3.byteOffset, e3.byteLength), new n3(e3.buffer.slice(e3.byteOffset, e3.byteOffset + e3.byteLength));
          }
          typeof BigUint64Array != "undefined" && (l[67] = BigUint64Array, l[71] = BigUint64Array), typeof BigInt64Array != "undefined" && (l[75] = BigInt64Array, l[79] = BigInt64Array);
          for (const e3 of Object.keys(l))
            h[e3] = c;
          let d = {};
          class p {
            constructor(e3, t3, r3) {
              if (this.tag = e3, this.value = t3, this.err = r3, typeof this.tag != "number")
                throw new Error(`Invalid tag type (${typeof this.tag})`);
              if (this.tag < 0 || (0 | this.tag) !== this.tag)
                throw new Error(`Tag must be a positive integer: ${this.tag}`);
            }
            toJSON() {
              if (this[o])
                return this[o].call(this.value);
              const e3 = { tag: this.tag, value: this.value };
              return this.err && (e3.err = this.err), e3;
            }
            toString() {
              return `${this.tag}(${JSON.stringify(this.value)})`;
            }
            encodeCBOR(e3) {
              return e3._pushTag(this.tag), e3.pushAny(this.value);
            }
            convert(e3) {
              let t3 = e3 == null ? void 0 : e3[this.tag];
              if (typeof t3 != "function" && (t3 = p.TAGS[this.tag], typeof t3 != "function"))
                return this;
              try {
                return t3.call(this, this.value, this);
              } catch (e4) {
                return e4 && e4.message && e4.message.length > 0 ? this.err = e4.message : this.err = e4, this;
              }
            }
            static get TAGS() {
              return d;
            }
            static set TAGS(e3) {
              d = e3;
            }
            static reset() {
              p.TAGS = { ...h };
            }
          }
          p.INTERNAL_JSON = o, p.reset(), e2.exports = p;
        }, 873: (e2, t2, r2) => {
          "use strict";
          const { Buffer: n2 } = r2(764), i = r2(202), o = r2(830), s = r2(66), { NUMBYTES: a, SHIFT32: u, BI: f, SYMS: h } = s, l = new TextDecoder("utf8", { fatal: true, ignoreBOM: true });
          t2.utf8 = (e3) => l.decode(e3), t2.utf8.checksUTF8 = true, t2.isBufferish = function(e3) {
            return e3 && typeof e3 == "object" && (n2.isBuffer(e3) || e3 instanceof Uint8Array || e3 instanceof Uint8ClampedArray || e3 instanceof ArrayBuffer || e3 instanceof DataView);
          }, t2.bufferishToBuffer = function(e3) {
            return n2.isBuffer(e3) ? e3 : ArrayBuffer.isView(e3) ? n2.from(e3.buffer, e3.byteOffset, e3.byteLength) : e3 instanceof ArrayBuffer ? n2.from(e3) : null;
          }, t2.parseCBORint = function(e3, t3) {
            switch (e3) {
              case a.ONE:
                return t3.readUInt8(0);
              case a.TWO:
                return t3.readUInt16BE(0);
              case a.FOUR:
                return t3.readUInt32BE(0);
              case a.EIGHT: {
                const e4 = t3.readUInt32BE(0), r3 = t3.readUInt32BE(4);
                return e4 > 2097151 ? BigInt(e4) * f.SHIFT32 + BigInt(r3) : e4 * u + r3;
              }
              default:
                throw new Error(`Invalid additional info for int: ${e3}`);
            }
          }, t2.writeHalf = function(e3, t3) {
            const r3 = n2.allocUnsafe(4);
            r3.writeFloatBE(t3, 0);
            const i2 = r3.readUInt32BE(0);
            if ((8191 & i2) != 0)
              return false;
            let o2 = i2 >> 16 & 32768;
            const s2 = i2 >> 23 & 255, a2 = 8388607 & i2;
            if (s2 >= 113 && s2 <= 142)
              o2 += (s2 - 112 << 10) + (a2 >> 13);
            else {
              if (!(s2 >= 103 && s2 < 113))
                return false;
              if (a2 & (1 << 126 - s2) - 1)
                return false;
              o2 += a2 + 8388608 >> 126 - s2;
            }
            return e3.writeUInt16BE(o2), true;
          }, t2.parseHalf = function(e3) {
            const t3 = 128 & e3[0] ? -1 : 1, r3 = (124 & e3[0]) >> 2, n3 = (3 & e3[0]) << 8 | e3[1];
            return r3 ? r3 === 31 ? t3 * (n3 ? NaN : 1 / 0) : t3 * 2 ** (r3 - 25) * (1024 + n3) : 5960464477539063e-23 * t3 * n3;
          }, t2.parseCBORfloat = function(e3) {
            switch (e3.length) {
              case 2:
                return t2.parseHalf(e3);
              case 4:
                return e3.readFloatBE(0);
              case 8:
                return e3.readDoubleBE(0);
              default:
                throw new Error(`Invalid float size: ${e3.length}`);
            }
          }, t2.hex = function(e3) {
            return n2.from(e3.replace(/^0x/, ""), "hex");
          }, t2.bin = function(e3) {
            let t3 = 0, r3 = (e3 = e3.replace(/\s/g, "")).length % 8 || 8;
            const i2 = [];
            for (; r3 <= e3.length; )
              i2.push(parseInt(e3.slice(t3, r3), 2)), t3 = r3, r3 += 8;
            return n2.from(i2);
          }, t2.arrayEqual = function(e3, t3) {
            return e3 == null && t3 == null || e3 != null && t3 != null && e3.length === t3.length && e3.every((e4, r3) => e4 === t3[r3]);
          }, t2.bufferToBigInt = function(e3) {
            return BigInt(`0x${e3.toString("hex")}`);
          }, t2.cborValueToString = function(e3, r3 = -1) {
            switch (typeof e3) {
              case "symbol": {
                switch (e3) {
                  case h.NULL:
                    return "null";
                  case h.UNDEFINED:
                    return "undefined";
                  case h.BREAK:
                    return "BREAK";
                }
                if (e3.description)
                  return e3.description;
                const t3 = e3.toString().match(/^Symbol\((?<name>.*)\)/);
                return t3 && t3.groups.name ? t3.groups.name : "Symbol";
              }
              case "string":
                return JSON.stringify(e3);
              case "bigint":
                return e3.toString();
              case "number": {
                const t3 = Object.is(e3, -0) ? "-0" : String(e3);
                return r3 > 0 ? `${t3}_${r3}` : t3;
              }
              case "object": {
                const n3 = t2.bufferishToBuffer(e3);
                if (n3) {
                  const e4 = n3.toString("hex");
                  return r3 === -1 / 0 ? e4 : `h'${e4}'`;
                }
                return typeof e3[Symbol.for("nodejs.util.inspect.custom")] == "function" ? e3[Symbol.for("nodejs.util.inspect.custom")]() : Array.isArray(e3) ? "[]" : "{}";
              }
            }
            return String(e3);
          }, t2.guessEncoding = function(e3, r3) {
            if (typeof e3 == "string")
              return new i(e3, r3 == null ? "hex" : r3);
            const n3 = t2.bufferishToBuffer(e3);
            if (n3)
              return new i(n3);
            if ((s2 = e3) instanceof o.Readable || ["read", "on", "pipe"].every((e4) => typeof s2[e4] == "function"))
              return e3;
            var s2;
            throw new Error("Unknown input type");
          };
          const c = { "=": "", "+": "-", "/": "_" };
          t2.base64url = function(e3) {
            return t2.bufferishToBuffer(e3).toString("base64").replace(/[=+/]/g, (e4) => c[e4]);
          }, t2.base64 = function(e3) {
            return t2.bufferishToBuffer(e3).toString("base64");
          }, t2.isBigEndian = function() {
            const e3 = new Uint8Array(4);
            return !((new Uint32Array(e3.buffer)[0] = 1) & e3[0]);
          };
        }, 202: (e2, t2, r2) => {
          "use strict";
          const n2 = r2(830), { Buffer: i } = r2(764), o = new TextDecoder("utf8", { fatal: true, ignoreBOM: true });
          class s extends n2.Transform {
            constructor(e3, t3, r3 = {}) {
              let n3 = null, o2 = null;
              switch (typeof e3) {
                case "object":
                  i.isBuffer(e3) ? n3 = e3 : e3 && (r3 = e3);
                  break;
                case "string":
                  n3 = e3;
                  break;
                case "undefined":
                  break;
                default:
                  throw new TypeError("Invalid input");
              }
              switch (typeof t3) {
                case "object":
                  t3 && (r3 = t3);
                  break;
                case "string":
                  o2 = t3;
                  break;
                case "undefined":
                  break;
                default:
                  throw new TypeError("Invalid inputEncoding");
              }
              if (!r3 || typeof r3 != "object")
                throw new TypeError("Invalid options");
              n3 == null && (n3 = r3.input), o2 == null && (o2 = r3.inputEncoding), delete r3.input, delete r3.inputEncoding;
              const s2 = r3.watchPipe == null || r3.watchPipe;
              delete r3.watchPipe;
              const a = Boolean(r3.readError);
              delete r3.readError, super(r3), this.readError = a, s2 && this.on("pipe", (e4) => {
                const t4 = e4._readableState.objectMode;
                if (this.length > 0 && t4 !== this._readableState.objectMode)
                  throw new Error("Do not switch objectMode in the middle of the stream");
                this._readableState.objectMode = t4, this._writableState.objectMode = t4;
              }), n3 != null && this.end(n3, o2);
            }
            static isNoFilter(e3) {
              return e3 instanceof this;
            }
            static compare(e3, t3) {
              if (!(e3 instanceof this))
                throw new TypeError("Arguments must be NoFilters");
              return e3 === t3 ? 0 : e3.compare(t3);
            }
            static concat(e3, t3) {
              if (!Array.isArray(e3))
                throw new TypeError("list argument must be an Array of NoFilters");
              if (e3.length === 0 || t3 === 0)
                return i.alloc(0);
              t3 == null && (t3 = e3.reduce((e4, t4) => {
                if (!(t4 instanceof s))
                  throw new TypeError("list argument must be an Array of NoFilters");
                return e4 + t4.length;
              }, 0));
              let r3 = true, n3 = true;
              const o2 = e3.map((e4) => {
                if (!(e4 instanceof s))
                  throw new TypeError("list argument must be an Array of NoFilters");
                const t4 = e4.slice();
                return i.isBuffer(t4) ? n3 = false : r3 = false, t4;
              });
              if (r3)
                return i.concat(o2, t3);
              if (n3)
                return [].concat(...o2).slice(0, t3);
              throw new Error("Concatenating mixed object and byte streams not supported");
            }
            _transform(e3, t3, r3) {
              this._readableState.objectMode || i.isBuffer(e3) || (e3 = i.from(e3, t3)), this.push(e3), r3();
            }
            _bufArray() {
              let e3 = this._readableState.buffer;
              if (!Array.isArray(e3)) {
                let t3 = e3.head;
                for (e3 = []; t3 != null; )
                  e3.push(t3.data), t3 = t3.next;
              }
              return e3;
            }
            read(e3) {
              const t3 = super.read(e3);
              if (t3 != null) {
                if (this.emit("read", t3), this.readError && t3.length < e3)
                  throw new Error(`Read ${t3.length}, wanted ${e3}`);
              } else if (this.readError)
                throw new Error(`No data available, wanted ${e3}`);
              return t3;
            }
            readFull(e3) {
              let t3 = null, r3 = null, n3 = null;
              return new Promise((i2, o2) => {
                this.length >= e3 ? i2(this.read(e3)) : this.writableFinished ? o2(new Error(`Stream finished before ${e3} bytes were available`)) : (t3 = (t4) => {
                  this.length >= e3 && i2(this.read(e3));
                }, r3 = () => {
                  o2(new Error(`Stream finished before ${e3} bytes were available`));
                }, n3 = o2, this.on("readable", t3), this.on("error", n3), this.on("finish", r3));
              }).finally(() => {
                t3 && (this.removeListener("readable", t3), this.removeListener("error", n3), this.removeListener("finish", r3));
              });
            }
            promise(e3) {
              let t3 = false;
              return new Promise((r3, n3) => {
                this.on("finish", () => {
                  const n4 = this.read();
                  e3 == null || t3 || (t3 = true, e3(null, n4)), r3(n4);
                }), this.on("error", (r4) => {
                  e3 == null || t3 || (t3 = true, e3(r4)), n3(r4);
                });
              });
            }
            compare(e3) {
              if (!(e3 instanceof s))
                throw new TypeError("Arguments must be NoFilters");
              if (this === e3)
                return 0;
              const t3 = this.slice(), r3 = e3.slice();
              if (i.isBuffer(t3) && i.isBuffer(r3))
                return t3.compare(r3);
              throw new Error("Cannot compare streams in object mode");
            }
            equals(e3) {
              return this.compare(e3) === 0;
            }
            slice(e3, t3) {
              if (this._readableState.objectMode)
                return this._bufArray().slice(e3, t3);
              const r3 = this._bufArray();
              switch (r3.length) {
                case 0:
                  return i.alloc(0);
                case 1:
                  return r3[0].slice(e3, t3);
                default:
                  return i.concat(r3).slice(e3, t3);
              }
            }
            get(e3) {
              return this.slice()[e3];
            }
            toJSON() {
              const e3 = this.slice();
              return i.isBuffer(e3) ? e3.toJSON() : e3;
            }
            toString(e3, t3, r3) {
              const n3 = this.slice(t3, r3);
              return i.isBuffer(n3) ? e3 && e3 !== "utf8" ? n3.toString(e3) : o.decode(n3) : JSON.stringify(n3);
            }
            [Symbol.for("nodejs.util.inspect.custom")](e3, t3) {
              const r3 = this._bufArray().map((e4) => i.isBuffer(e4) ? t3.stylize(e4.toString("hex"), "string") : JSON.stringify(e4)).join(", ");
              return `${this.constructor.name} [${r3}]`;
            }
            get length() {
              return this._readableState.length;
            }
            writeBigInt(e3) {
              let t3 = e3.toString(16);
              if (e3 < 0) {
                const r3 = BigInt(Math.floor(t3.length / 2));
                t3 = (e3 = (BigInt(1) << r3 * BigInt(8)) + e3).toString(16);
              }
              return t3.length % 2 && (t3 = `0${t3}`), this.push(i.from(t3, "hex"));
            }
            readUBigInt(e3) {
              const t3 = this.read(e3);
              return i.isBuffer(t3) ? BigInt(`0x${t3.toString("hex")}`) : null;
            }
            readBigInt(e3) {
              const t3 = this.read(e3);
              if (!i.isBuffer(t3))
                return null;
              let r3 = BigInt(`0x${t3.toString("hex")}`);
              return 128 & t3[0] && (r3 -= BigInt(1) << BigInt(t3.length) * BigInt(8)), r3;
            }
            writeUInt8(e3) {
              const t3 = i.from([e3]);
              return this.push(t3);
            }
            writeUInt16LE(e3) {
              const t3 = i.alloc(2);
              return t3.writeUInt16LE(e3), this.push(t3);
            }
            writeUInt16BE(e3) {
              const t3 = i.alloc(2);
              return t3.writeUInt16BE(e3), this.push(t3);
            }
            writeUInt32LE(e3) {
              const t3 = i.alloc(4);
              return t3.writeUInt32LE(e3), this.push(t3);
            }
            writeUInt32BE(e3) {
              const t3 = i.alloc(4);
              return t3.writeUInt32BE(e3), this.push(t3);
            }
            writeInt8(e3) {
              const t3 = i.from([e3]);
              return this.push(t3);
            }
            writeInt16LE(e3) {
              const t3 = i.alloc(2);
              return t3.writeUInt16LE(e3), this.push(t3);
            }
            writeInt16BE(e3) {
              const t3 = i.alloc(2);
              return t3.writeUInt16BE(e3), this.push(t3);
            }
            writeInt32LE(e3) {
              const t3 = i.alloc(4);
              return t3.writeUInt32LE(e3), this.push(t3);
            }
            writeInt32BE(e3) {
              const t3 = i.alloc(4);
              return t3.writeUInt32BE(e3), this.push(t3);
            }
            writeFloatLE(e3) {
              const t3 = i.alloc(4);
              return t3.writeFloatLE(e3), this.push(t3);
            }
            writeFloatBE(e3) {
              const t3 = i.alloc(4);
              return t3.writeFloatBE(e3), this.push(t3);
            }
            writeDoubleLE(e3) {
              const t3 = i.alloc(8);
              return t3.writeDoubleLE(e3), this.push(t3);
            }
            writeDoubleBE(e3) {
              const t3 = i.alloc(8);
              return t3.writeDoubleBE(e3), this.push(t3);
            }
            writeBigInt64LE(e3) {
              const t3 = i.alloc(8);
              return t3.writeBigInt64LE(e3), this.push(t3);
            }
            writeBigInt64BE(e3) {
              const t3 = i.alloc(8);
              return t3.writeBigInt64BE(e3), this.push(t3);
            }
            writeBigUInt64LE(e3) {
              const t3 = i.alloc(8);
              return t3.writeBigUInt64LE(e3), this.push(t3);
            }
            writeBigUInt64BE(e3) {
              const t3 = i.alloc(8);
              return t3.writeBigUInt64BE(e3), this.push(t3);
            }
            readUInt8() {
              const e3 = this.read(1);
              return i.isBuffer(e3) ? e3.readUInt8() : null;
            }
            readUInt16LE() {
              const e3 = this.read(2);
              return i.isBuffer(e3) ? e3.readUInt16LE() : null;
            }
            readUInt16BE() {
              const e3 = this.read(2);
              return i.isBuffer(e3) ? e3.readUInt16BE() : null;
            }
            readUInt32LE() {
              const e3 = this.read(4);
              return i.isBuffer(e3) ? e3.readUInt32LE() : null;
            }
            readUInt32BE() {
              const e3 = this.read(4);
              return i.isBuffer(e3) ? e3.readUInt32BE() : null;
            }
            readInt8() {
              const e3 = this.read(1);
              return i.isBuffer(e3) ? e3.readInt8() : null;
            }
            readInt16LE() {
              const e3 = this.read(2);
              return i.isBuffer(e3) ? e3.readInt16LE() : null;
            }
            readInt16BE() {
              const e3 = this.read(2);
              return i.isBuffer(e3) ? e3.readInt16BE() : null;
            }
            readInt32LE() {
              const e3 = this.read(4);
              return i.isBuffer(e3) ? e3.readInt32LE() : null;
            }
            readInt32BE() {
              const e3 = this.read(4);
              return i.isBuffer(e3) ? e3.readInt32BE() : null;
            }
            readFloatLE() {
              const e3 = this.read(4);
              return i.isBuffer(e3) ? e3.readFloatLE() : null;
            }
            readFloatBE() {
              const e3 = this.read(4);
              return i.isBuffer(e3) ? e3.readFloatBE() : null;
            }
            readDoubleLE() {
              const e3 = this.read(8);
              return i.isBuffer(e3) ? e3.readDoubleLE() : null;
            }
            readDoubleBE() {
              const e3 = this.read(8);
              return i.isBuffer(e3) ? e3.readDoubleBE() : null;
            }
            readBigInt64LE() {
              const e3 = this.read(8);
              return i.isBuffer(e3) ? e3.readBigInt64LE() : null;
            }
            readBigInt64BE() {
              const e3 = this.read(8);
              return i.isBuffer(e3) ? e3.readBigInt64BE() : null;
            }
            readBigUInt64LE() {
              const e3 = this.read(8);
              return i.isBuffer(e3) ? e3.readBigUInt64LE() : null;
            }
            readBigUInt64BE() {
              const e3 = this.read(8);
              return i.isBuffer(e3) ? e3.readBigUInt64BE() : null;
            }
          }
          e2.exports = s;
        }, 71: (e2, t2, r2) => {
          "use strict";
          const n2 = r2(830), i = r2(202);
          class o extends n2.Transform {
            constructor(e3) {
              super(e3), this._writableState.objectMode = false, this._readableState.objectMode = true, this.bs = new i(), this.__restart();
            }
            _transform(e3, t3, r3) {
              for (this.bs.write(e3); this.bs.length >= this.__needed; ) {
                let e4 = null;
                const t4 = this.__needed === null ? void 0 : this.bs.read(this.__needed);
                try {
                  e4 = this.__parser.next(t4);
                } catch (e5) {
                  return r3(e5);
                }
                this.__needed && (this.__fresh = false), e4.done ? (this.push(e4.value), this.__restart()) : this.__needed = e4.value || 1 / 0;
              }
              return r3();
            }
            *_parse() {
              throw new Error("Must be implemented in subclass");
            }
            __restart() {
              this.__needed = null, this.__parser = this._parse(), this.__fresh = true;
            }
            _flush(e3) {
              e3(this.__fresh ? null : new Error("unexpected end of input"));
            }
          }
          e2.exports = o;
        }, 187: (e2) => {
          "use strict";
          var t2, r2 = typeof Reflect == "object" ? Reflect : null, n2 = r2 && typeof r2.apply == "function" ? r2.apply : function(e3, t3, r3) {
            return Function.prototype.apply.call(e3, t3, r3);
          };
          t2 = r2 && typeof r2.ownKeys == "function" ? r2.ownKeys : Object.getOwnPropertySymbols ? function(e3) {
            return Object.getOwnPropertyNames(e3).concat(Object.getOwnPropertySymbols(e3));
          } : function(e3) {
            return Object.getOwnPropertyNames(e3);
          };
          var i = Number.isNaN || function(e3) {
            return e3 != e3;
          };
          function o() {
            o.init.call(this);
          }
          e2.exports = o, e2.exports.once = function(e3, t3) {
            return new Promise(function(r3, n3) {
              function i2(r4) {
                e3.removeListener(t3, o2), n3(r4);
              }
              function o2() {
                typeof e3.removeListener == "function" && e3.removeListener("error", i2), r3([].slice.call(arguments));
              }
              g(e3, t3, o2, { once: true }), t3 !== "error" && function(e4, t4, r4) {
                typeof e4.on == "function" && g(e4, "error", t4, { once: true });
              }(e3, i2);
            });
          }, o.EventEmitter = o, o.prototype._events = void 0, o.prototype._eventsCount = 0, o.prototype._maxListeners = void 0;
          var s = 10;
          function a(e3) {
            if (typeof e3 != "function")
              throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e3);
          }
          function u(e3) {
            return e3._maxListeners === void 0 ? o.defaultMaxListeners : e3._maxListeners;
          }
          function f(e3, t3, r3, n3) {
            var i2, o2, s2, f2;
            if (a(r3), (o2 = e3._events) === void 0 ? (o2 = e3._events = Object.create(null), e3._eventsCount = 0) : (o2.newListener !== void 0 && (e3.emit("newListener", t3, r3.listener ? r3.listener : r3), o2 = e3._events), s2 = o2[t3]), s2 === void 0)
              s2 = o2[t3] = r3, ++e3._eventsCount;
            else if (typeof s2 == "function" ? s2 = o2[t3] = n3 ? [r3, s2] : [s2, r3] : n3 ? s2.unshift(r3) : s2.push(r3), (i2 = u(e3)) > 0 && s2.length > i2 && !s2.warned) {
              s2.warned = true;
              var h2 = new Error("Possible EventEmitter memory leak detected. " + s2.length + " " + String(t3) + " listeners added. Use emitter.setMaxListeners() to increase limit");
              h2.name = "MaxListenersExceededWarning", h2.emitter = e3, h2.type = t3, h2.count = s2.length, f2 = h2, console && console.warn && console.warn(f2);
            }
            return e3;
          }
          function h() {
            if (!this.fired)
              return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
          }
          function l(e3, t3, r3) {
            var n3 = { fired: false, wrapFn: void 0, target: e3, type: t3, listener: r3 }, i2 = h.bind(n3);
            return i2.listener = r3, n3.wrapFn = i2, i2;
          }
          function c(e3, t3, r3) {
            var n3 = e3._events;
            if (n3 === void 0)
              return [];
            var i2 = n3[t3];
            return i2 === void 0 ? [] : typeof i2 == "function" ? r3 ? [i2.listener || i2] : [i2] : r3 ? function(e4) {
              for (var t4 = new Array(e4.length), r4 = 0; r4 < t4.length; ++r4)
                t4[r4] = e4[r4].listener || e4[r4];
              return t4;
            }(i2) : p(i2, i2.length);
          }
          function d(e3) {
            var t3 = this._events;
            if (t3 !== void 0) {
              var r3 = t3[e3];
              if (typeof r3 == "function")
                return 1;
              if (r3 !== void 0)
                return r3.length;
            }
            return 0;
          }
          function p(e3, t3) {
            for (var r3 = new Array(t3), n3 = 0; n3 < t3; ++n3)
              r3[n3] = e3[n3];
            return r3;
          }
          function g(e3, t3, r3, n3) {
            if (typeof e3.on == "function")
              n3.once ? e3.once(t3, r3) : e3.on(t3, r3);
            else {
              if (typeof e3.addEventListener != "function")
                throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e3);
              e3.addEventListener(t3, function i2(o2) {
                n3.once && e3.removeEventListener(t3, i2), r3(o2);
              });
            }
          }
          Object.defineProperty(o, "defaultMaxListeners", { enumerable: true, get: function() {
            return s;
          }, set: function(e3) {
            if (typeof e3 != "number" || e3 < 0 || i(e3))
              throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e3 + ".");
            s = e3;
          } }), o.init = function() {
            this._events !== void 0 && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
          }, o.prototype.setMaxListeners = function(e3) {
            if (typeof e3 != "number" || e3 < 0 || i(e3))
              throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e3 + ".");
            return this._maxListeners = e3, this;
          }, o.prototype.getMaxListeners = function() {
            return u(this);
          }, o.prototype.emit = function(e3) {
            for (var t3 = [], r3 = 1; r3 < arguments.length; r3++)
              t3.push(arguments[r3]);
            var i2 = e3 === "error", o2 = this._events;
            if (o2 !== void 0)
              i2 = i2 && o2.error === void 0;
            else if (!i2)
              return false;
            if (i2) {
              var s2;
              if (t3.length > 0 && (s2 = t3[0]), s2 instanceof Error)
                throw s2;
              var a2 = new Error("Unhandled error." + (s2 ? " (" + s2.message + ")" : ""));
              throw a2.context = s2, a2;
            }
            var u2 = o2[e3];
            if (u2 === void 0)
              return false;
            if (typeof u2 == "function")
              n2(u2, this, t3);
            else {
              var f2 = u2.length, h2 = p(u2, f2);
              for (r3 = 0; r3 < f2; ++r3)
                n2(h2[r3], this, t3);
            }
            return true;
          }, o.prototype.addListener = function(e3, t3) {
            return f(this, e3, t3, false);
          }, o.prototype.on = o.prototype.addListener, o.prototype.prependListener = function(e3, t3) {
            return f(this, e3, t3, true);
          }, o.prototype.once = function(e3, t3) {
            return a(t3), this.on(e3, l(this, e3, t3)), this;
          }, o.prototype.prependOnceListener = function(e3, t3) {
            return a(t3), this.prependListener(e3, l(this, e3, t3)), this;
          }, o.prototype.removeListener = function(e3, t3) {
            var r3, n3, i2, o2, s2;
            if (a(t3), (n3 = this._events) === void 0)
              return this;
            if ((r3 = n3[e3]) === void 0)
              return this;
            if (r3 === t3 || r3.listener === t3)
              --this._eventsCount == 0 ? this._events = Object.create(null) : (delete n3[e3], n3.removeListener && this.emit("removeListener", e3, r3.listener || t3));
            else if (typeof r3 != "function") {
              for (i2 = -1, o2 = r3.length - 1; o2 >= 0; o2--)
                if (r3[o2] === t3 || r3[o2].listener === t3) {
                  s2 = r3[o2].listener, i2 = o2;
                  break;
                }
              if (i2 < 0)
                return this;
              i2 === 0 ? r3.shift() : function(e4, t4) {
                for (; t4 + 1 < e4.length; t4++)
                  e4[t4] = e4[t4 + 1];
                e4.pop();
              }(r3, i2), r3.length === 1 && (n3[e3] = r3[0]), n3.removeListener !== void 0 && this.emit("removeListener", e3, s2 || t3);
            }
            return this;
          }, o.prototype.off = o.prototype.removeListener, o.prototype.removeAllListeners = function(e3) {
            var t3, r3, n3;
            if ((r3 = this._events) === void 0)
              return this;
            if (r3.removeListener === void 0)
              return arguments.length === 0 ? (this._events = Object.create(null), this._eventsCount = 0) : r3[e3] !== void 0 && (--this._eventsCount == 0 ? this._events = Object.create(null) : delete r3[e3]), this;
            if (arguments.length === 0) {
              var i2, o2 = Object.keys(r3);
              for (n3 = 0; n3 < o2.length; ++n3)
                (i2 = o2[n3]) !== "removeListener" && this.removeAllListeners(i2);
              return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this;
            }
            if (typeof (t3 = r3[e3]) == "function")
              this.removeListener(e3, t3);
            else if (t3 !== void 0)
              for (n3 = t3.length - 1; n3 >= 0; n3--)
                this.removeListener(e3, t3[n3]);
            return this;
          }, o.prototype.listeners = function(e3) {
            return c(this, e3, true);
          }, o.prototype.rawListeners = function(e3) {
            return c(this, e3, false);
          }, o.listenerCount = function(e3, t3) {
            return typeof e3.listenerCount == "function" ? e3.listenerCount(t3) : d.call(e3, t3);
          }, o.prototype.listenerCount = d, o.prototype.eventNames = function() {
            return this._eventsCount > 0 ? t2(this._events) : [];
          };
        }, 645: (e2, t2) => {
          t2.read = function(e3, t3, r2, n2, i) {
            var o, s, a = 8 * i - n2 - 1, u = (1 << a) - 1, f = u >> 1, h = -7, l = r2 ? i - 1 : 0, c = r2 ? -1 : 1, d = e3[t3 + l];
            for (l += c, o = d & (1 << -h) - 1, d >>= -h, h += a; h > 0; o = 256 * o + e3[t3 + l], l += c, h -= 8)
              ;
            for (s = o & (1 << -h) - 1, o >>= -h, h += n2; h > 0; s = 256 * s + e3[t3 + l], l += c, h -= 8)
              ;
            if (o === 0)
              o = 1 - f;
            else {
              if (o === u)
                return s ? NaN : 1 / 0 * (d ? -1 : 1);
              s += Math.pow(2, n2), o -= f;
            }
            return (d ? -1 : 1) * s * Math.pow(2, o - n2);
          }, t2.write = function(e3, t3, r2, n2, i, o) {
            var s, a, u, f = 8 * o - i - 1, h = (1 << f) - 1, l = h >> 1, c = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = n2 ? 0 : o - 1, p = n2 ? 1 : -1, g = t3 < 0 || t3 === 0 && 1 / t3 < 0 ? 1 : 0;
            for (t3 = Math.abs(t3), isNaN(t3) || t3 === 1 / 0 ? (a = isNaN(t3) ? 1 : 0, s = h) : (s = Math.floor(Math.log(t3) / Math.LN2), t3 * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), (t3 += s + l >= 1 ? c / u : c * Math.pow(2, 1 - l)) * u >= 2 && (s++, u /= 2), s + l >= h ? (a = 0, s = h) : s + l >= 1 ? (a = (t3 * u - 1) * Math.pow(2, i), s += l) : (a = t3 * Math.pow(2, l - 1) * Math.pow(2, i), s = 0)); i >= 8; e3[r2 + d] = 255 & a, d += p, a /= 256, i -= 8)
              ;
            for (s = s << i | a, f += i; f > 0; e3[r2 + d] = 255 & s, d += p, s /= 256, f -= 8)
              ;
            e3[r2 + d - p] |= 128 * g;
          };
        }, 717: (e2) => {
          typeof Object.create == "function" ? e2.exports = function(e3, t2) {
            t2 && (e3.super_ = t2, e3.prototype = Object.create(t2.prototype, { constructor: { value: e3, enumerable: false, writable: true, configurable: true } }));
          } : e2.exports = function(e3, t2) {
            if (t2) {
              e3.super_ = t2;
              var r2 = function() {
              };
              r2.prototype = t2.prototype, e3.prototype = new r2(), e3.prototype.constructor = e3;
            }
          };
        }, 155: (e2) => {
          var t2, r2, n2 = e2.exports = {};
          function i() {
            throw new Error("setTimeout has not been defined");
          }
          function o() {
            throw new Error("clearTimeout has not been defined");
          }
          function s(e3) {
            if (t2 === setTimeout)
              return setTimeout(e3, 0);
            if ((t2 === i || !t2) && setTimeout)
              return t2 = setTimeout, setTimeout(e3, 0);
            try {
              return t2(e3, 0);
            } catch (r3) {
              try {
                return t2.call(null, e3, 0);
              } catch (r4) {
                return t2.call(this, e3, 0);
              }
            }
          }
          !function() {
            try {
              t2 = typeof setTimeout == "function" ? setTimeout : i;
            } catch (e3) {
              t2 = i;
            }
            try {
              r2 = typeof clearTimeout == "function" ? clearTimeout : o;
            } catch (e3) {
              r2 = o;
            }
          }();
          var a, u = [], f = false, h = -1;
          function l() {
            f && a && (f = false, a.length ? u = a.concat(u) : h = -1, u.length && c());
          }
          function c() {
            if (!f) {
              var e3 = s(l);
              f = true;
              for (var t3 = u.length; t3; ) {
                for (a = u, u = []; ++h < t3; )
                  a && a[h].run();
                h = -1, t3 = u.length;
              }
              a = null, f = false, function(e4) {
                if (r2 === clearTimeout)
                  return clearTimeout(e4);
                if ((r2 === o || !r2) && clearTimeout)
                  return r2 = clearTimeout, clearTimeout(e4);
                try {
                  r2(e4);
                } catch (t4) {
                  try {
                    return r2.call(null, e4);
                  } catch (t5) {
                    return r2.call(this, e4);
                  }
                }
              }(e3);
            }
          }
          function d(e3, t3) {
            this.fun = e3, this.array = t3;
          }
          function p() {
          }
          n2.nextTick = function(e3) {
            var t3 = new Array(arguments.length - 1);
            if (arguments.length > 1)
              for (var r3 = 1; r3 < arguments.length; r3++)
                t3[r3 - 1] = arguments[r3];
            u.push(new d(e3, t3)), u.length !== 1 || f || s(c);
          }, d.prototype.run = function() {
            this.fun.apply(null, this.array);
          }, n2.title = "browser", n2.browser = true, n2.env = {}, n2.argv = [], n2.version = "", n2.versions = {}, n2.on = p, n2.addListener = p, n2.once = p, n2.off = p, n2.removeListener = p, n2.removeAllListeners = p, n2.emit = p, n2.prependListener = p, n2.prependOnceListener = p, n2.listeners = function(e3) {
            return [];
          }, n2.binding = function(e3) {
            throw new Error("process.binding is not supported");
          }, n2.cwd = function() {
            return "/";
          }, n2.chdir = function(e3) {
            throw new Error("process.chdir is not supported");
          }, n2.umask = function() {
            return 0;
          };
        }, 281: (e2) => {
          "use strict";
          var t2 = {};
          function r2(e3, r3, n3) {
            n3 || (n3 = Error);
            var i = function(e4) {
              var t3, n4;
              function i2(t4, n5, i3) {
                return e4.call(this, function(e5, t5, n6) {
                  return typeof r3 == "string" ? r3 : r3(e5, t5, n6);
                }(t4, n5, i3)) || this;
              }
              return n4 = e4, (t3 = i2).prototype = Object.create(n4.prototype), t3.prototype.constructor = t3, t3.__proto__ = n4, i2;
            }(n3);
            i.prototype.name = n3.name, i.prototype.code = e3, t2[e3] = i;
          }
          function n2(e3, t3) {
            if (Array.isArray(e3)) {
              var r3 = e3.length;
              return e3 = e3.map(function(e4) {
                return String(e4);
              }), r3 > 2 ? "one of ".concat(t3, " ").concat(e3.slice(0, r3 - 1).join(", "), ", or ") + e3[r3 - 1] : r3 === 2 ? "one of ".concat(t3, " ").concat(e3[0], " or ").concat(e3[1]) : "of ".concat(t3, " ").concat(e3[0]);
            }
            return "of ".concat(t3, " ").concat(String(e3));
          }
          r2("ERR_INVALID_OPT_VALUE", function(e3, t3) {
            return 'The value "' + t3 + '" is invalid for option "' + e3 + '"';
          }, TypeError), r2("ERR_INVALID_ARG_TYPE", function(e3, t3, r3) {
            var i, o, s, a, u;
            if (typeof t3 == "string" && (o = "not ", t3.substr(0, o.length) === o) ? (i = "must not be", t3 = t3.replace(/^not /, "")) : i = "must be", function(e4, t4, r4) {
              return (r4 === void 0 || r4 > e4.length) && (r4 = e4.length), e4.substring(r4 - t4.length, r4) === t4;
            }(e3, " argument"))
              s = "The ".concat(e3, " ").concat(i, " ").concat(n2(t3, "type"));
            else {
              var f = (typeof u != "number" && (u = 0), u + ".".length > (a = e3).length || a.indexOf(".", u) === -1 ? "argument" : "property");
              s = 'The "'.concat(e3, '" ').concat(f, " ").concat(i, " ").concat(n2(t3, "type"));
            }
            return s + ". Received type ".concat(typeof r3);
          }, TypeError), r2("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), r2("ERR_METHOD_NOT_IMPLEMENTED", function(e3) {
            return "The " + e3 + " method is not implemented";
          }), r2("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), r2("ERR_STREAM_DESTROYED", function(e3) {
            return "Cannot call " + e3 + " after a stream was destroyed";
          }), r2("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), r2("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), r2("ERR_STREAM_WRITE_AFTER_END", "write after end"), r2("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), r2("ERR_UNKNOWN_ENCODING", function(e3) {
            return "Unknown encoding: " + e3;
          }, TypeError), r2("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), e2.exports.q = t2;
        }, 753: (e2, t2, r2) => {
          "use strict";
          var n2 = r2(155), i = Object.keys || function(e3) {
            var t3 = [];
            for (var r3 in e3)
              t3.push(r3);
            return t3;
          };
          e2.exports = h;
          var o = r2(481), s = r2(229);
          r2(717)(h, o);
          for (var a = i(s.prototype), u = 0; u < a.length; u++) {
            var f = a[u];
            h.prototype[f] || (h.prototype[f] = s.prototype[f]);
          }
          function h(e3) {
            if (!(this instanceof h))
              return new h(e3);
            o.call(this, e3), s.call(this, e3), this.allowHalfOpen = true, e3 && (e3.readable === false && (this.readable = false), e3.writable === false && (this.writable = false), e3.allowHalfOpen === false && (this.allowHalfOpen = false, this.once("end", l)));
          }
          function l() {
            this._writableState.ended || n2.nextTick(c, this);
          }
          function c(e3) {
            e3.end();
          }
          Object.defineProperty(h.prototype, "writableHighWaterMark", { enumerable: false, get: function() {
            return this._writableState.highWaterMark;
          } }), Object.defineProperty(h.prototype, "writableBuffer", { enumerable: false, get: function() {
            return this._writableState && this._writableState.getBuffer();
          } }), Object.defineProperty(h.prototype, "writableLength", { enumerable: false, get: function() {
            return this._writableState.length;
          } }), Object.defineProperty(h.prototype, "destroyed", { enumerable: false, get: function() {
            return this._readableState !== void 0 && this._writableState !== void 0 && this._readableState.destroyed && this._writableState.destroyed;
          }, set: function(e3) {
            this._readableState !== void 0 && this._writableState !== void 0 && (this._readableState.destroyed = e3, this._writableState.destroyed = e3);
          } });
        }, 725: (e2, t2, r2) => {
          "use strict";
          e2.exports = i;
          var n2 = r2(605);
          function i(e3) {
            if (!(this instanceof i))
              return new i(e3);
            n2.call(this, e3);
          }
          r2(717)(i, n2), i.prototype._transform = function(e3, t3, r3) {
            r3(null, e3);
          };
        }, 481: (e2, t2, r2) => {
          "use strict";
          var n2, i = r2(155);
          e2.exports = I, I.ReadableState = T, r2(187).EventEmitter;
          var o, s = function(e3, t3) {
            return e3.listeners(t3).length;
          }, a = r2(503), u = r2(764).Buffer, f = r2.g.Uint8Array || function() {
          }, h = r2(616);
          o = h && h.debuglog ? h.debuglog("stream") : function() {
          };
          var l, c, d, p = r2(327), g = r2(195), y = r2(457).getHighWaterMark, b = r2(281).q, w = b.ERR_INVALID_ARG_TYPE, _ = b.ERR_STREAM_PUSH_AFTER_EOF, m = b.ERR_METHOD_NOT_IMPLEMENTED, E = b.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
          r2(717)(I, a);
          var v = g.errorOrDestroy, S = ["error", "close", "destroy", "pause", "resume"];
          function T(e3, t3, i2) {
            n2 = n2 || r2(753), e3 = e3 || {}, typeof i2 != "boolean" && (i2 = t3 instanceof n2), this.objectMode = !!e3.objectMode, i2 && (this.objectMode = this.objectMode || !!e3.readableObjectMode), this.highWaterMark = y(this, e3, "readableHighWaterMark", i2), this.buffer = new p(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = false, this.endEmitted = false, this.reading = false, this.sync = true, this.needReadable = false, this.emittedReadable = false, this.readableListening = false, this.resumeScheduled = false, this.paused = true, this.emitClose = e3.emitClose !== false, this.autoDestroy = !!e3.autoDestroy, this.destroyed = false, this.defaultEncoding = e3.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = false, this.decoder = null, this.encoding = null, e3.encoding && (l || (l = r2(553).s), this.decoder = new l(e3.encoding), this.encoding = e3.encoding);
          }
          function I(e3) {
            if (n2 = n2 || r2(753), !(this instanceof I))
              return new I(e3);
            var t3 = this instanceof n2;
            this._readableState = new T(e3, this, t3), this.readable = true, e3 && (typeof e3.read == "function" && (this._read = e3.read), typeof e3.destroy == "function" && (this._destroy = e3.destroy)), a.call(this);
          }
          function A(e3, t3, r3, n3, i2) {
            o("readableAddChunk", t3);
            var s2, a2 = e3._readableState;
            if (t3 === null)
              a2.reading = false, function(e4, t4) {
                if (o("onEofChunk"), !t4.ended) {
                  if (t4.decoder) {
                    var r4 = t4.decoder.end();
                    r4 && r4.length && (t4.buffer.push(r4), t4.length += t4.objectMode ? 1 : r4.length);
                  }
                  t4.ended = true, t4.sync ? L(e4) : (t4.needReadable = false, t4.emittedReadable || (t4.emittedReadable = true, N(e4)));
                }
              }(e3, a2);
            else if (i2 || (s2 = function(e4, t4) {
              var r4, n4;
              return n4 = t4, u.isBuffer(n4) || n4 instanceof f || typeof t4 == "string" || t4 === void 0 || e4.objectMode || (r4 = new w("chunk", ["string", "Buffer", "Uint8Array"], t4)), r4;
            }(a2, t3)), s2)
              v(e3, s2);
            else if (a2.objectMode || t3 && t3.length > 0)
              if (typeof t3 == "string" || a2.objectMode || Object.getPrototypeOf(t3) === u.prototype || (t3 = function(e4) {
                return u.from(e4);
              }(t3)), n3)
                a2.endEmitted ? v(e3, new E()) : B(e3, a2, t3, true);
              else if (a2.ended)
                v(e3, new _());
              else {
                if (a2.destroyed)
                  return false;
                a2.reading = false, a2.decoder && !r3 ? (t3 = a2.decoder.write(t3), a2.objectMode || t3.length !== 0 ? B(e3, a2, t3, false) : M(e3, a2)) : B(e3, a2, t3, false);
              }
            else
              n3 || (a2.reading = false, M(e3, a2));
            return !a2.ended && (a2.length < a2.highWaterMark || a2.length === 0);
          }
          function B(e3, t3, r3, n3) {
            t3.flowing && t3.length === 0 && !t3.sync ? (t3.awaitDrain = 0, e3.emit("data", r3)) : (t3.length += t3.objectMode ? 1 : r3.length, n3 ? t3.buffer.unshift(r3) : t3.buffer.push(r3), t3.needReadable && L(e3)), M(e3, t3);
          }
          Object.defineProperty(I.prototype, "destroyed", { enumerable: false, get: function() {
            return this._readableState !== void 0 && this._readableState.destroyed;
          }, set: function(e3) {
            this._readableState && (this._readableState.destroyed = e3);
          } }), I.prototype.destroy = g.destroy, I.prototype._undestroy = g.undestroy, I.prototype._destroy = function(e3, t3) {
            t3(e3);
          }, I.prototype.push = function(e3, t3) {
            var r3, n3 = this._readableState;
            return n3.objectMode ? r3 = true : typeof e3 == "string" && ((t3 = t3 || n3.defaultEncoding) !== n3.encoding && (e3 = u.from(e3, t3), t3 = ""), r3 = true), A(this, e3, t3, false, r3);
          }, I.prototype.unshift = function(e3) {
            return A(this, e3, null, true, false);
          }, I.prototype.isPaused = function() {
            return this._readableState.flowing === false;
          }, I.prototype.setEncoding = function(e3) {
            l || (l = r2(553).s);
            var t3 = new l(e3);
            this._readableState.decoder = t3, this._readableState.encoding = this._readableState.decoder.encoding;
            for (var n3 = this._readableState.buffer.head, i2 = ""; n3 !== null; )
              i2 += t3.write(n3.data), n3 = n3.next;
            return this._readableState.buffer.clear(), i2 !== "" && this._readableState.buffer.push(i2), this._readableState.length = i2.length, this;
          };
          var R = 1073741824;
          function U(e3, t3) {
            return e3 <= 0 || t3.length === 0 && t3.ended ? 0 : t3.objectMode ? 1 : e3 != e3 ? t3.flowing && t3.length ? t3.buffer.head.data.length : t3.length : (e3 > t3.highWaterMark && (t3.highWaterMark = function(e4) {
              return e4 >= R ? e4 = R : (e4--, e4 |= e4 >>> 1, e4 |= e4 >>> 2, e4 |= e4 >>> 4, e4 |= e4 >>> 8, e4 |= e4 >>> 16, e4++), e4;
            }(e3)), e3 <= t3.length ? e3 : t3.ended ? t3.length : (t3.needReadable = true, 0));
          }
          function L(e3) {
            var t3 = e3._readableState;
            o("emitReadable", t3.needReadable, t3.emittedReadable), t3.needReadable = false, t3.emittedReadable || (o("emitReadable", t3.flowing), t3.emittedReadable = true, i.nextTick(N, e3));
          }
          function N(e3) {
            var t3 = e3._readableState;
            o("emitReadable_", t3.destroyed, t3.length, t3.ended), t3.destroyed || !t3.length && !t3.ended || (e3.emit("readable"), t3.emittedReadable = false), t3.needReadable = !t3.flowing && !t3.ended && t3.length <= t3.highWaterMark, j(e3);
          }
          function M(e3, t3) {
            t3.readingMore || (t3.readingMore = true, i.nextTick(O, e3, t3));
          }
          function O(e3, t3) {
            for (; !t3.reading && !t3.ended && (t3.length < t3.highWaterMark || t3.flowing && t3.length === 0); ) {
              var r3 = t3.length;
              if (o("maybeReadMore read 0"), e3.read(0), r3 === t3.length)
                break;
            }
            t3.readingMore = false;
          }
          function x(e3) {
            var t3 = e3._readableState;
            t3.readableListening = e3.listenerCount("readable") > 0, t3.resumeScheduled && !t3.paused ? t3.flowing = true : e3.listenerCount("data") > 0 && e3.resume();
          }
          function k(e3) {
            o("readable nexttick read 0"), e3.read(0);
          }
          function P(e3, t3) {
            o("resume", t3.reading), t3.reading || e3.read(0), t3.resumeScheduled = false, e3.emit("resume"), j(e3), t3.flowing && !t3.reading && e3.read(0);
          }
          function j(e3) {
            var t3 = e3._readableState;
            for (o("flow", t3.flowing); t3.flowing && e3.read() !== null; )
              ;
          }
          function C(e3, t3) {
            return t3.length === 0 ? null : (t3.objectMode ? r3 = t3.buffer.shift() : !e3 || e3 >= t3.length ? (r3 = t3.decoder ? t3.buffer.join("") : t3.buffer.length === 1 ? t3.buffer.first() : t3.buffer.concat(t3.length), t3.buffer.clear()) : r3 = t3.buffer.consume(e3, t3.decoder), r3);
            var r3;
          }
          function F(e3) {
            var t3 = e3._readableState;
            o("endReadable", t3.endEmitted), t3.endEmitted || (t3.ended = true, i.nextTick(D, t3, e3));
          }
          function D(e3, t3) {
            if (o("endReadableNT", e3.endEmitted, e3.length), !e3.endEmitted && e3.length === 0 && (e3.endEmitted = true, t3.readable = false, t3.emit("end"), e3.autoDestroy)) {
              var r3 = t3._writableState;
              (!r3 || r3.autoDestroy && r3.finished) && t3.destroy();
            }
          }
          function $(e3, t3) {
            for (var r3 = 0, n3 = e3.length; r3 < n3; r3++)
              if (e3[r3] === t3)
                return r3;
            return -1;
          }
          I.prototype.read = function(e3) {
            o("read", e3), e3 = parseInt(e3, 10);
            var t3 = this._readableState, r3 = e3;
            if (e3 !== 0 && (t3.emittedReadable = false), e3 === 0 && t3.needReadable && ((t3.highWaterMark !== 0 ? t3.length >= t3.highWaterMark : t3.length > 0) || t3.ended))
              return o("read: emitReadable", t3.length, t3.ended), t3.length === 0 && t3.ended ? F(this) : L(this), null;
            if ((e3 = U(e3, t3)) === 0 && t3.ended)
              return t3.length === 0 && F(this), null;
            var n3, i2 = t3.needReadable;
            return o("need readable", i2), (t3.length === 0 || t3.length - e3 < t3.highWaterMark) && o("length less than watermark", i2 = true), t3.ended || t3.reading ? o("reading or ended", i2 = false) : i2 && (o("do read"), t3.reading = true, t3.sync = true, t3.length === 0 && (t3.needReadable = true), this._read(t3.highWaterMark), t3.sync = false, t3.reading || (e3 = U(r3, t3))), (n3 = e3 > 0 ? C(e3, t3) : null) === null ? (t3.needReadable = t3.length <= t3.highWaterMark, e3 = 0) : (t3.length -= e3, t3.awaitDrain = 0), t3.length === 0 && (t3.ended || (t3.needReadable = true), r3 !== e3 && t3.ended && F(this)), n3 !== null && this.emit("data", n3), n3;
          }, I.prototype._read = function(e3) {
            v(this, new m("_read()"));
          }, I.prototype.pipe = function(e3, t3) {
            var r3 = this, n3 = this._readableState;
            switch (n3.pipesCount) {
              case 0:
                n3.pipes = e3;
                break;
              case 1:
                n3.pipes = [n3.pipes, e3];
                break;
              default:
                n3.pipes.push(e3);
            }
            n3.pipesCount += 1, o("pipe count=%d opts=%j", n3.pipesCount, t3);
            var a2 = t3 && t3.end === false || e3 === i.stdout || e3 === i.stderr ? g2 : u2;
            function u2() {
              o("onend"), e3.end();
            }
            n3.endEmitted ? i.nextTick(a2) : r3.once("end", a2), e3.on("unpipe", function t4(i2, s2) {
              o("onunpipe"), i2 === r3 && s2 && s2.hasUnpiped === false && (s2.hasUnpiped = true, o("cleanup"), e3.removeListener("close", d2), e3.removeListener("finish", p2), e3.removeListener("drain", f2), e3.removeListener("error", c2), e3.removeListener("unpipe", t4), r3.removeListener("end", u2), r3.removeListener("end", g2), r3.removeListener("data", l2), h2 = true, !n3.awaitDrain || e3._writableState && !e3._writableState.needDrain || f2());
            });
            var f2 = function(e4) {
              return function() {
                var t4 = e4._readableState;
                o("pipeOnDrain", t4.awaitDrain), t4.awaitDrain && t4.awaitDrain--, t4.awaitDrain === 0 && s(e4, "data") && (t4.flowing = true, j(e4));
              };
            }(r3);
            e3.on("drain", f2);
            var h2 = false;
            function l2(t4) {
              o("ondata");
              var i2 = e3.write(t4);
              o("dest.write", i2), i2 === false && ((n3.pipesCount === 1 && n3.pipes === e3 || n3.pipesCount > 1 && $(n3.pipes, e3) !== -1) && !h2 && (o("false write response, pause", n3.awaitDrain), n3.awaitDrain++), r3.pause());
            }
            function c2(t4) {
              o("onerror", t4), g2(), e3.removeListener("error", c2), s(e3, "error") === 0 && v(e3, t4);
            }
            function d2() {
              e3.removeListener("finish", p2), g2();
            }
            function p2() {
              o("onfinish"), e3.removeListener("close", d2), g2();
            }
            function g2() {
              o("unpipe"), r3.unpipe(e3);
            }
            return r3.on("data", l2), function(e4, t4, r4) {
              if (typeof e4.prependListener == "function")
                return e4.prependListener(t4, r4);
              e4._events && e4._events.error ? Array.isArray(e4._events.error) ? e4._events.error.unshift(r4) : e4._events.error = [r4, e4._events.error] : e4.on(t4, r4);
            }(e3, "error", c2), e3.once("close", d2), e3.once("finish", p2), e3.emit("pipe", r3), n3.flowing || (o("pipe resume"), r3.resume()), e3;
          }, I.prototype.unpipe = function(e3) {
            var t3 = this._readableState, r3 = { hasUnpiped: false };
            if (t3.pipesCount === 0)
              return this;
            if (t3.pipesCount === 1)
              return e3 && e3 !== t3.pipes || (e3 || (e3 = t3.pipes), t3.pipes = null, t3.pipesCount = 0, t3.flowing = false, e3 && e3.emit("unpipe", this, r3)), this;
            if (!e3) {
              var n3 = t3.pipes, i2 = t3.pipesCount;
              t3.pipes = null, t3.pipesCount = 0, t3.flowing = false;
              for (var o2 = 0; o2 < i2; o2++)
                n3[o2].emit("unpipe", this, { hasUnpiped: false });
              return this;
            }
            var s2 = $(t3.pipes, e3);
            return s2 === -1 || (t3.pipes.splice(s2, 1), t3.pipesCount -= 1, t3.pipesCount === 1 && (t3.pipes = t3.pipes[0]), e3.emit("unpipe", this, r3)), this;
          }, I.prototype.on = function(e3, t3) {
            var r3 = a.prototype.on.call(this, e3, t3), n3 = this._readableState;
            return e3 === "data" ? (n3.readableListening = this.listenerCount("readable") > 0, n3.flowing !== false && this.resume()) : e3 === "readable" && (n3.endEmitted || n3.readableListening || (n3.readableListening = n3.needReadable = true, n3.flowing = false, n3.emittedReadable = false, o("on readable", n3.length, n3.reading), n3.length ? L(this) : n3.reading || i.nextTick(k, this))), r3;
          }, I.prototype.addListener = I.prototype.on, I.prototype.removeListener = function(e3, t3) {
            var r3 = a.prototype.removeListener.call(this, e3, t3);
            return e3 === "readable" && i.nextTick(x, this), r3;
          }, I.prototype.removeAllListeners = function(e3) {
            var t3 = a.prototype.removeAllListeners.apply(this, arguments);
            return e3 !== "readable" && e3 !== void 0 || i.nextTick(x, this), t3;
          }, I.prototype.resume = function() {
            var e3 = this._readableState;
            return e3.flowing || (o("resume"), e3.flowing = !e3.readableListening, function(e4, t3) {
              t3.resumeScheduled || (t3.resumeScheduled = true, i.nextTick(P, e4, t3));
            }(this, e3)), e3.paused = false, this;
          }, I.prototype.pause = function() {
            return o("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== false && (o("pause"), this._readableState.flowing = false, this.emit("pause")), this._readableState.paused = true, this;
          }, I.prototype.wrap = function(e3) {
            var t3 = this, r3 = this._readableState, n3 = false;
            for (var i2 in e3.on("end", function() {
              if (o("wrapped end"), r3.decoder && !r3.ended) {
                var e4 = r3.decoder.end();
                e4 && e4.length && t3.push(e4);
              }
              t3.push(null);
            }), e3.on("data", function(i3) {
              o("wrapped data"), r3.decoder && (i3 = r3.decoder.write(i3)), r3.objectMode && i3 == null || (r3.objectMode || i3 && i3.length) && (t3.push(i3) || (n3 = true, e3.pause()));
            }), e3)
              this[i2] === void 0 && typeof e3[i2] == "function" && (this[i2] = function(t4) {
                return function() {
                  return e3[t4].apply(e3, arguments);
                };
              }(i2));
            for (var s2 = 0; s2 < S.length; s2++)
              e3.on(S[s2], this.emit.bind(this, S[s2]));
            return this._read = function(t4) {
              o("wrapped _read", t4), n3 && (n3 = false, e3.resume());
            }, this;
          }, typeof Symbol == "function" && (I.prototype[Symbol.asyncIterator] = function() {
            return c === void 0 && (c = r2(850)), c(this);
          }), Object.defineProperty(I.prototype, "readableHighWaterMark", { enumerable: false, get: function() {
            return this._readableState.highWaterMark;
          } }), Object.defineProperty(I.prototype, "readableBuffer", { enumerable: false, get: function() {
            return this._readableState && this._readableState.buffer;
          } }), Object.defineProperty(I.prototype, "readableFlowing", { enumerable: false, get: function() {
            return this._readableState.flowing;
          }, set: function(e3) {
            this._readableState && (this._readableState.flowing = e3);
          } }), I._fromList = C, Object.defineProperty(I.prototype, "readableLength", { enumerable: false, get: function() {
            return this._readableState.length;
          } }), typeof Symbol == "function" && (I.from = function(e3, t3) {
            return d === void 0 && (d = r2(167)), d(I, e3, t3);
          });
        }, 605: (e2, t2, r2) => {
          "use strict";
          e2.exports = h;
          var n2 = r2(281).q, i = n2.ERR_METHOD_NOT_IMPLEMENTED, o = n2.ERR_MULTIPLE_CALLBACK, s = n2.ERR_TRANSFORM_ALREADY_TRANSFORMING, a = n2.ERR_TRANSFORM_WITH_LENGTH_0, u = r2(753);
          function f(e3, t3) {
            var r3 = this._transformState;
            r3.transforming = false;
            var n3 = r3.writecb;
            if (n3 === null)
              return this.emit("error", new o());
            r3.writechunk = null, r3.writecb = null, t3 != null && this.push(t3), n3(e3);
            var i2 = this._readableState;
            i2.reading = false, (i2.needReadable || i2.length < i2.highWaterMark) && this._read(i2.highWaterMark);
          }
          function h(e3) {
            if (!(this instanceof h))
              return new h(e3);
            u.call(this, e3), this._transformState = { afterTransform: f.bind(this), needTransform: false, transforming: false, writecb: null, writechunk: null, writeencoding: null }, this._readableState.needReadable = true, this._readableState.sync = false, e3 && (typeof e3.transform == "function" && (this._transform = e3.transform), typeof e3.flush == "function" && (this._flush = e3.flush)), this.on("prefinish", l);
          }
          function l() {
            var e3 = this;
            typeof this._flush != "function" || this._readableState.destroyed ? c(this, null, null) : this._flush(function(t3, r3) {
              c(e3, t3, r3);
            });
          }
          function c(e3, t3, r3) {
            if (t3)
              return e3.emit("error", t3);
            if (r3 != null && e3.push(r3), e3._writableState.length)
              throw new a();
            if (e3._transformState.transforming)
              throw new s();
            return e3.push(null);
          }
          r2(717)(h, u), h.prototype.push = function(e3, t3) {
            return this._transformState.needTransform = false, u.prototype.push.call(this, e3, t3);
          }, h.prototype._transform = function(e3, t3, r3) {
            r3(new i("_transform()"));
          }, h.prototype._write = function(e3, t3, r3) {
            var n3 = this._transformState;
            if (n3.writecb = r3, n3.writechunk = e3, n3.writeencoding = t3, !n3.transforming) {
              var i2 = this._readableState;
              (n3.needTransform || i2.needReadable || i2.length < i2.highWaterMark) && this._read(i2.highWaterMark);
            }
          }, h.prototype._read = function(e3) {
            var t3 = this._transformState;
            t3.writechunk === null || t3.transforming ? t3.needTransform = true : (t3.transforming = true, this._transform(t3.writechunk, t3.writeencoding, t3.afterTransform));
          }, h.prototype._destroy = function(e3, t3) {
            u.prototype._destroy.call(this, e3, function(e4) {
              t3(e4);
            });
          };
        }, 229: (e2, t2, r2) => {
          "use strict";
          var n2, i = r2(155);
          function o(e3) {
            var t3 = this;
            this.next = null, this.entry = null, this.finish = function() {
              !function(e4, t4, r3) {
                var n3 = e4.entry;
                for (e4.entry = null; n3; ) {
                  var i2 = n3.callback;
                  t4.pendingcb--, i2(void 0), n3 = n3.next;
                }
                t4.corkedRequestsFree.next = e4;
              }(t3, e3);
            };
          }
          e2.exports = I, I.WritableState = T;
          var s, a = { deprecate: r2(927) }, u = r2(503), f = r2(764).Buffer, h = r2.g.Uint8Array || function() {
          }, l = r2(195), c = r2(457).getHighWaterMark, d = r2(281).q, p = d.ERR_INVALID_ARG_TYPE, g = d.ERR_METHOD_NOT_IMPLEMENTED, y = d.ERR_MULTIPLE_CALLBACK, b = d.ERR_STREAM_CANNOT_PIPE, w = d.ERR_STREAM_DESTROYED, _ = d.ERR_STREAM_NULL_VALUES, m = d.ERR_STREAM_WRITE_AFTER_END, E = d.ERR_UNKNOWN_ENCODING, v = l.errorOrDestroy;
          function S() {
          }
          function T(e3, t3, s2) {
            n2 = n2 || r2(753), e3 = e3 || {}, typeof s2 != "boolean" && (s2 = t3 instanceof n2), this.objectMode = !!e3.objectMode, s2 && (this.objectMode = this.objectMode || !!e3.writableObjectMode), this.highWaterMark = c(this, e3, "writableHighWaterMark", s2), this.finalCalled = false, this.needDrain = false, this.ending = false, this.ended = false, this.finished = false, this.destroyed = false;
            var a2 = e3.decodeStrings === false;
            this.decodeStrings = !a2, this.defaultEncoding = e3.defaultEncoding || "utf8", this.length = 0, this.writing = false, this.corked = 0, this.sync = true, this.bufferProcessing = false, this.onwrite = function(e4) {
              !function(e5, t4) {
                var r3 = e5._writableState, n3 = r3.sync, o2 = r3.writecb;
                if (typeof o2 != "function")
                  throw new y();
                if (function(e6) {
                  e6.writing = false, e6.writecb = null, e6.length -= e6.writelen, e6.writelen = 0;
                }(r3), t4)
                  !function(e6, t5, r4, n4, o3) {
                    --t5.pendingcb, r4 ? (i.nextTick(o3, n4), i.nextTick(N, e6, t5), e6._writableState.errorEmitted = true, v(e6, n4)) : (o3(n4), e6._writableState.errorEmitted = true, v(e6, n4), N(e6, t5));
                  }(e5, r3, n3, t4, o2);
                else {
                  var s3 = U(r3) || e5.destroyed;
                  s3 || r3.corked || r3.bufferProcessing || !r3.bufferedRequest || R(e5, r3), n3 ? i.nextTick(B, e5, r3, s3, o2) : B(e5, r3, s3, o2);
                }
              }(t3, e4);
            }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = false, this.errorEmitted = false, this.emitClose = e3.emitClose !== false, this.autoDestroy = !!e3.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new o(this);
          }
          function I(e3) {
            var t3 = this instanceof (n2 = n2 || r2(753));
            if (!t3 && !s.call(I, this))
              return new I(e3);
            this._writableState = new T(e3, this, t3), this.writable = true, e3 && (typeof e3.write == "function" && (this._write = e3.write), typeof e3.writev == "function" && (this._writev = e3.writev), typeof e3.destroy == "function" && (this._destroy = e3.destroy), typeof e3.final == "function" && (this._final = e3.final)), u.call(this);
          }
          function A(e3, t3, r3, n3, i2, o2, s2) {
            t3.writelen = n3, t3.writecb = s2, t3.writing = true, t3.sync = true, t3.destroyed ? t3.onwrite(new w("write")) : r3 ? e3._writev(i2, t3.onwrite) : e3._write(i2, o2, t3.onwrite), t3.sync = false;
          }
          function B(e3, t3, r3, n3) {
            r3 || function(e4, t4) {
              t4.length === 0 && t4.needDrain && (t4.needDrain = false, e4.emit("drain"));
            }(e3, t3), t3.pendingcb--, n3(), N(e3, t3);
          }
          function R(e3, t3) {
            t3.bufferProcessing = true;
            var r3 = t3.bufferedRequest;
            if (e3._writev && r3 && r3.next) {
              var n3 = t3.bufferedRequestCount, i2 = new Array(n3), s2 = t3.corkedRequestsFree;
              s2.entry = r3;
              for (var a2 = 0, u2 = true; r3; )
                i2[a2] = r3, r3.isBuf || (u2 = false), r3 = r3.next, a2 += 1;
              i2.allBuffers = u2, A(e3, t3, true, t3.length, i2, "", s2.finish), t3.pendingcb++, t3.lastBufferedRequest = null, s2.next ? (t3.corkedRequestsFree = s2.next, s2.next = null) : t3.corkedRequestsFree = new o(t3), t3.bufferedRequestCount = 0;
            } else {
              for (; r3; ) {
                var f2 = r3.chunk, h2 = r3.encoding, l2 = r3.callback;
                if (A(e3, t3, false, t3.objectMode ? 1 : f2.length, f2, h2, l2), r3 = r3.next, t3.bufferedRequestCount--, t3.writing)
                  break;
              }
              r3 === null && (t3.lastBufferedRequest = null);
            }
            t3.bufferedRequest = r3, t3.bufferProcessing = false;
          }
          function U(e3) {
            return e3.ending && e3.length === 0 && e3.bufferedRequest === null && !e3.finished && !e3.writing;
          }
          function L(e3, t3) {
            e3._final(function(r3) {
              t3.pendingcb--, r3 && v(e3, r3), t3.prefinished = true, e3.emit("prefinish"), N(e3, t3);
            });
          }
          function N(e3, t3) {
            var r3 = U(t3);
            if (r3 && (function(e4, t4) {
              t4.prefinished || t4.finalCalled || (typeof e4._final != "function" || t4.destroyed ? (t4.prefinished = true, e4.emit("prefinish")) : (t4.pendingcb++, t4.finalCalled = true, i.nextTick(L, e4, t4)));
            }(e3, t3), t3.pendingcb === 0 && (t3.finished = true, e3.emit("finish"), t3.autoDestroy))) {
              var n3 = e3._readableState;
              (!n3 || n3.autoDestroy && n3.endEmitted) && e3.destroy();
            }
            return r3;
          }
          r2(717)(I, u), T.prototype.getBuffer = function() {
            for (var e3 = this.bufferedRequest, t3 = []; e3; )
              t3.push(e3), e3 = e3.next;
            return t3;
          }, function() {
            try {
              Object.defineProperty(T.prototype, "buffer", { get: a.deprecate(function() {
                return this.getBuffer();
              }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003") });
            } catch (e3) {
            }
          }(), typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (s = Function.prototype[Symbol.hasInstance], Object.defineProperty(I, Symbol.hasInstance, { value: function(e3) {
            return !!s.call(this, e3) || this === I && e3 && e3._writableState instanceof T;
          } })) : s = function(e3) {
            return e3 instanceof this;
          }, I.prototype.pipe = function() {
            v(this, new b());
          }, I.prototype.write = function(e3, t3, r3) {
            var n3, o2 = this._writableState, s2 = false, a2 = !o2.objectMode && (n3 = e3, f.isBuffer(n3) || n3 instanceof h);
            return a2 && !f.isBuffer(e3) && (e3 = function(e4) {
              return f.from(e4);
            }(e3)), typeof t3 == "function" && (r3 = t3, t3 = null), a2 ? t3 = "buffer" : t3 || (t3 = o2.defaultEncoding), typeof r3 != "function" && (r3 = S), o2.ending ? function(e4, t4) {
              var r4 = new m();
              v(e4, r4), i.nextTick(t4, r4);
            }(this, r3) : (a2 || function(e4, t4, r4, n4) {
              var o3;
              return r4 === null ? o3 = new _() : typeof r4 == "string" || t4.objectMode || (o3 = new p("chunk", ["string", "Buffer"], r4)), !o3 || (v(e4, o3), i.nextTick(n4, o3), false);
            }(this, o2, e3, r3)) && (o2.pendingcb++, s2 = function(e4, t4, r4, n4, i2, o3) {
              if (!r4) {
                var s3 = function(e5, t5, r5) {
                  return e5.objectMode || e5.decodeStrings === false || typeof t5 != "string" || (t5 = f.from(t5, r5)), t5;
                }(t4, n4, i2);
                n4 !== s3 && (r4 = true, i2 = "buffer", n4 = s3);
              }
              var a3 = t4.objectMode ? 1 : n4.length;
              t4.length += a3;
              var u2 = t4.length < t4.highWaterMark;
              if (u2 || (t4.needDrain = true), t4.writing || t4.corked) {
                var h2 = t4.lastBufferedRequest;
                t4.lastBufferedRequest = { chunk: n4, encoding: i2, isBuf: r4, callback: o3, next: null }, h2 ? h2.next = t4.lastBufferedRequest : t4.bufferedRequest = t4.lastBufferedRequest, t4.bufferedRequestCount += 1;
              } else
                A(e4, t4, false, a3, n4, i2, o3);
              return u2;
            }(this, o2, a2, e3, t3, r3)), s2;
          }, I.prototype.cork = function() {
            this._writableState.corked++;
          }, I.prototype.uncork = function() {
            var e3 = this._writableState;
            e3.corked && (e3.corked--, e3.writing || e3.corked || e3.bufferProcessing || !e3.bufferedRequest || R(this, e3));
          }, I.prototype.setDefaultEncoding = function(e3) {
            if (typeof e3 == "string" && (e3 = e3.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e3 + "").toLowerCase()) > -1))
              throw new E(e3);
            return this._writableState.defaultEncoding = e3, this;
          }, Object.defineProperty(I.prototype, "writableBuffer", { enumerable: false, get: function() {
            return this._writableState && this._writableState.getBuffer();
          } }), Object.defineProperty(I.prototype, "writableHighWaterMark", { enumerable: false, get: function() {
            return this._writableState.highWaterMark;
          } }), I.prototype._write = function(e3, t3, r3) {
            r3(new g("_write()"));
          }, I.prototype._writev = null, I.prototype.end = function(e3, t3, r3) {
            var n3 = this._writableState;
            return typeof e3 == "function" ? (r3 = e3, e3 = null, t3 = null) : typeof t3 == "function" && (r3 = t3, t3 = null), e3 != null && this.write(e3, t3), n3.corked && (n3.corked = 1, this.uncork()), n3.ending || function(e4, t4, r4) {
              t4.ending = true, N(e4, t4), r4 && (t4.finished ? i.nextTick(r4) : e4.once("finish", r4)), t4.ended = true, e4.writable = false;
            }(this, n3, r3), this;
          }, Object.defineProperty(I.prototype, "writableLength", { enumerable: false, get: function() {
            return this._writableState.length;
          } }), Object.defineProperty(I.prototype, "destroyed", { enumerable: false, get: function() {
            return this._writableState !== void 0 && this._writableState.destroyed;
          }, set: function(e3) {
            this._writableState && (this._writableState.destroyed = e3);
          } }), I.prototype.destroy = l.destroy, I.prototype._undestroy = l.undestroy, I.prototype._destroy = function(e3, t3) {
            t3(e3);
          };
        }, 850: (e2, t2, r2) => {
          "use strict";
          var n2, i = r2(155);
          function o(e3, t3, r3) {
            return t3 in e3 ? Object.defineProperty(e3, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e3[t3] = r3, e3;
          }
          var s = r2(610), a = Symbol("lastResolve"), u = Symbol("lastReject"), f = Symbol("error"), h = Symbol("ended"), l = Symbol("lastPromise"), c = Symbol("handlePromise"), d = Symbol("stream");
          function p(e3, t3) {
            return { value: e3, done: t3 };
          }
          function g(e3) {
            var t3 = e3[a];
            if (t3 !== null) {
              var r3 = e3[d].read();
              r3 !== null && (e3[l] = null, e3[a] = null, e3[u] = null, t3(p(r3, false)));
            }
          }
          function y(e3) {
            i.nextTick(g, e3);
          }
          var b = Object.getPrototypeOf(function() {
          }), w = Object.setPrototypeOf((o(n2 = { get stream() {
            return this[d];
          }, next: function() {
            var e3 = this, t3 = this[f];
            if (t3 !== null)
              return Promise.reject(t3);
            if (this[h])
              return Promise.resolve(p(void 0, true));
            if (this[d].destroyed)
              return new Promise(function(t4, r4) {
                i.nextTick(function() {
                  e3[f] ? r4(e3[f]) : t4(p(void 0, true));
                });
              });
            var r3, n3 = this[l];
            if (n3)
              r3 = new Promise(function(e4, t4) {
                return function(r4, n4) {
                  e4.then(function() {
                    t4[h] ? r4(p(void 0, true)) : t4[c](r4, n4);
                  }, n4);
                };
              }(n3, this));
            else {
              var o2 = this[d].read();
              if (o2 !== null)
                return Promise.resolve(p(o2, false));
              r3 = new Promise(this[c]);
            }
            return this[l] = r3, r3;
          } }, Symbol.asyncIterator, function() {
            return this;
          }), o(n2, "return", function() {
            var e3 = this;
            return new Promise(function(t3, r3) {
              e3[d].destroy(null, function(e4) {
                e4 ? r3(e4) : t3(p(void 0, true));
              });
            });
          }), n2), b);
          e2.exports = function(e3) {
            var t3, r3 = Object.create(w, (o(t3 = {}, d, { value: e3, writable: true }), o(t3, a, { value: null, writable: true }), o(t3, u, { value: null, writable: true }), o(t3, f, { value: null, writable: true }), o(t3, h, { value: e3._readableState.endEmitted, writable: true }), o(t3, c, { value: function(e4, t4) {
              var n3 = r3[d].read();
              n3 ? (r3[l] = null, r3[a] = null, r3[u] = null, e4(p(n3, false))) : (r3[a] = e4, r3[u] = t4);
            }, writable: true }), t3));
            return r3[l] = null, s(e3, function(e4) {
              if (e4 && e4.code !== "ERR_STREAM_PREMATURE_CLOSE") {
                var t4 = r3[u];
                return t4 !== null && (r3[l] = null, r3[a] = null, r3[u] = null, t4(e4)), void (r3[f] = e4);
              }
              var n3 = r3[a];
              n3 !== null && (r3[l] = null, r3[a] = null, r3[u] = null, n3(p(void 0, true))), r3[h] = true;
            }), e3.on("readable", y.bind(null, r3)), r3;
          };
        }, 327: (e2, t2, r2) => {
          "use strict";
          function n2(e3, t3) {
            var r3 = Object.keys(e3);
            if (Object.getOwnPropertySymbols) {
              var n3 = Object.getOwnPropertySymbols(e3);
              t3 && (n3 = n3.filter(function(t4) {
                return Object.getOwnPropertyDescriptor(e3, t4).enumerable;
              })), r3.push.apply(r3, n3);
            }
            return r3;
          }
          function i(e3, t3, r3) {
            return t3 in e3 ? Object.defineProperty(e3, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e3[t3] = r3, e3;
          }
          function o(e3, t3) {
            for (var r3 = 0; r3 < t3.length; r3++) {
              var n3 = t3[r3];
              n3.enumerable = n3.enumerable || false, n3.configurable = true, "value" in n3 && (n3.writable = true), Object.defineProperty(e3, n3.key, n3);
            }
          }
          var s = r2(764).Buffer, a = r2(361).inspect, u = a && a.custom || "inspect";
          e2.exports = function() {
            function e3() {
              !function(e4, t4) {
                if (!(e4 instanceof t4))
                  throw new TypeError("Cannot call a class as a function");
              }(this, e3), this.head = null, this.tail = null, this.length = 0;
            }
            var t3, r3;
            return t3 = e3, r3 = [{ key: "push", value: function(e4) {
              var t4 = { data: e4, next: null };
              this.length > 0 ? this.tail.next = t4 : this.head = t4, this.tail = t4, ++this.length;
            } }, { key: "unshift", value: function(e4) {
              var t4 = { data: e4, next: this.head };
              this.length === 0 && (this.tail = t4), this.head = t4, ++this.length;
            } }, { key: "shift", value: function() {
              if (this.length !== 0) {
                var e4 = this.head.data;
                return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, e4;
              }
            } }, { key: "clear", value: function() {
              this.head = this.tail = null, this.length = 0;
            } }, { key: "join", value: function(e4) {
              if (this.length === 0)
                return "";
              for (var t4 = this.head, r4 = "" + t4.data; t4 = t4.next; )
                r4 += e4 + t4.data;
              return r4;
            } }, { key: "concat", value: function(e4) {
              if (this.length === 0)
                return s.alloc(0);
              for (var t4, r4, n3, i2 = s.allocUnsafe(e4 >>> 0), o2 = this.head, a2 = 0; o2; )
                t4 = o2.data, r4 = i2, n3 = a2, s.prototype.copy.call(t4, r4, n3), a2 += o2.data.length, o2 = o2.next;
              return i2;
            } }, { key: "consume", value: function(e4, t4) {
              var r4;
              return e4 < this.head.data.length ? (r4 = this.head.data.slice(0, e4), this.head.data = this.head.data.slice(e4)) : r4 = e4 === this.head.data.length ? this.shift() : t4 ? this._getString(e4) : this._getBuffer(e4), r4;
            } }, { key: "first", value: function() {
              return this.head.data;
            } }, { key: "_getString", value: function(e4) {
              var t4 = this.head, r4 = 1, n3 = t4.data;
              for (e4 -= n3.length; t4 = t4.next; ) {
                var i2 = t4.data, o2 = e4 > i2.length ? i2.length : e4;
                if (o2 === i2.length ? n3 += i2 : n3 += i2.slice(0, e4), (e4 -= o2) == 0) {
                  o2 === i2.length ? (++r4, t4.next ? this.head = t4.next : this.head = this.tail = null) : (this.head = t4, t4.data = i2.slice(o2));
                  break;
                }
                ++r4;
              }
              return this.length -= r4, n3;
            } }, { key: "_getBuffer", value: function(e4) {
              var t4 = s.allocUnsafe(e4), r4 = this.head, n3 = 1;
              for (r4.data.copy(t4), e4 -= r4.data.length; r4 = r4.next; ) {
                var i2 = r4.data, o2 = e4 > i2.length ? i2.length : e4;
                if (i2.copy(t4, t4.length - e4, 0, o2), (e4 -= o2) == 0) {
                  o2 === i2.length ? (++n3, r4.next ? this.head = r4.next : this.head = this.tail = null) : (this.head = r4, r4.data = i2.slice(o2));
                  break;
                }
                ++n3;
              }
              return this.length -= n3, t4;
            } }, { key: u, value: function(e4, t4) {
              return a(this, function(e5) {
                for (var t5 = 1; t5 < arguments.length; t5++) {
                  var r4 = arguments[t5] != null ? arguments[t5] : {};
                  t5 % 2 ? n2(Object(r4), true).forEach(function(t6) {
                    i(e5, t6, r4[t6]);
                  }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e5, Object.getOwnPropertyDescriptors(r4)) : n2(Object(r4)).forEach(function(t6) {
                    Object.defineProperty(e5, t6, Object.getOwnPropertyDescriptor(r4, t6));
                  });
                }
                return e5;
              }({}, t4, { depth: 0, customInspect: false }));
            } }], r3 && o(t3.prototype, r3), e3;
          }();
        }, 195: (e2, t2, r2) => {
          "use strict";
          var n2 = r2(155);
          function i(e3, t3) {
            s(e3, t3), o(e3);
          }
          function o(e3) {
            e3._writableState && !e3._writableState.emitClose || e3._readableState && !e3._readableState.emitClose || e3.emit("close");
          }
          function s(e3, t3) {
            e3.emit("error", t3);
          }
          e2.exports = { destroy: function(e3, t3) {
            var r3 = this, a = this._readableState && this._readableState.destroyed, u = this._writableState && this._writableState.destroyed;
            return a || u ? (t3 ? t3(e3) : e3 && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = true, n2.nextTick(s, this, e3)) : n2.nextTick(s, this, e3)), this) : (this._readableState && (this._readableState.destroyed = true), this._writableState && (this._writableState.destroyed = true), this._destroy(e3 || null, function(e4) {
              !t3 && e4 ? r3._writableState ? r3._writableState.errorEmitted ? n2.nextTick(o, r3) : (r3._writableState.errorEmitted = true, n2.nextTick(i, r3, e4)) : n2.nextTick(i, r3, e4) : t3 ? (n2.nextTick(o, r3), t3(e4)) : n2.nextTick(o, r3);
            }), this);
          }, undestroy: function() {
            this._readableState && (this._readableState.destroyed = false, this._readableState.reading = false, this._readableState.ended = false, this._readableState.endEmitted = false), this._writableState && (this._writableState.destroyed = false, this._writableState.ended = false, this._writableState.ending = false, this._writableState.finalCalled = false, this._writableState.prefinished = false, this._writableState.finished = false, this._writableState.errorEmitted = false);
          }, errorOrDestroy: function(e3, t3) {
            var r3 = e3._readableState, n3 = e3._writableState;
            r3 && r3.autoDestroy || n3 && n3.autoDestroy ? e3.destroy(t3) : e3.emit("error", t3);
          } };
        }, 610: (e2, t2, r2) => {
          "use strict";
          var n2 = r2(281).q.ERR_STREAM_PREMATURE_CLOSE;
          function i() {
          }
          e2.exports = function e3(t3, r3, o) {
            if (typeof r3 == "function")
              return e3(t3, null, r3);
            r3 || (r3 = {}), o = function(e4) {
              var t4 = false;
              return function() {
                if (!t4) {
                  t4 = true;
                  for (var r4 = arguments.length, n3 = new Array(r4), i2 = 0; i2 < r4; i2++)
                    n3[i2] = arguments[i2];
                  e4.apply(this, n3);
                }
              };
            }(o || i);
            var s = r3.readable || r3.readable !== false && t3.readable, a = r3.writable || r3.writable !== false && t3.writable, u = function() {
              t3.writable || h();
            }, f = t3._writableState && t3._writableState.finished, h = function() {
              a = false, f = true, s || o.call(t3);
            }, l = t3._readableState && t3._readableState.endEmitted, c = function() {
              s = false, l = true, a || o.call(t3);
            }, d = function(e4) {
              o.call(t3, e4);
            }, p = function() {
              var e4;
              return s && !l ? (t3._readableState && t3._readableState.ended || (e4 = new n2()), o.call(t3, e4)) : a && !f ? (t3._writableState && t3._writableState.ended || (e4 = new n2()), o.call(t3, e4)) : void 0;
            }, g = function() {
              t3.req.on("finish", h);
            };
            return function(e4) {
              return e4.setHeader && typeof e4.abort == "function";
            }(t3) ? (t3.on("complete", h), t3.on("abort", p), t3.req ? g() : t3.on("request", g)) : a && !t3._writableState && (t3.on("end", u), t3.on("close", u)), t3.on("end", c), t3.on("finish", h), r3.error !== false && t3.on("error", d), t3.on("close", p), function() {
              t3.removeListener("complete", h), t3.removeListener("abort", p), t3.removeListener("request", g), t3.req && t3.req.removeListener("finish", h), t3.removeListener("end", u), t3.removeListener("close", u), t3.removeListener("finish", h), t3.removeListener("end", c), t3.removeListener("error", d), t3.removeListener("close", p);
            };
          };
        }, 167: (e2) => {
          e2.exports = function() {
            throw new Error("Readable.from is not available in the browser");
          };
        }, 946: (e2, t2, r2) => {
          "use strict";
          var n2, i = r2(281).q, o = i.ERR_MISSING_ARGS, s = i.ERR_STREAM_DESTROYED;
          function a(e3) {
            if (e3)
              throw e3;
          }
          function u(e3, t3, i2, o2) {
            o2 = function(e4) {
              var t4 = false;
              return function() {
                t4 || (t4 = true, e4.apply(void 0, arguments));
              };
            }(o2);
            var a2 = false;
            e3.on("close", function() {
              a2 = true;
            }), n2 === void 0 && (n2 = r2(610)), n2(e3, { readable: t3, writable: i2 }, function(e4) {
              if (e4)
                return o2(e4);
              a2 = true, o2();
            });
            var u2 = false;
            return function(t4) {
              if (!a2 && !u2)
                return u2 = true, function(e4) {
                  return e4.setHeader && typeof e4.abort == "function";
                }(e3) ? e3.abort() : typeof e3.destroy == "function" ? e3.destroy() : void o2(t4 || new s("pipe"));
            };
          }
          function f(e3) {
            e3();
          }
          function h(e3, t3) {
            return e3.pipe(t3);
          }
          function l(e3) {
            return e3.length ? typeof e3[e3.length - 1] != "function" ? a : e3.pop() : a;
          }
          e2.exports = function() {
            for (var e3 = arguments.length, t3 = new Array(e3), r3 = 0; r3 < e3; r3++)
              t3[r3] = arguments[r3];
            var n3, i2 = l(t3);
            if (Array.isArray(t3[0]) && (t3 = t3[0]), t3.length < 2)
              throw new o("streams");
            var s2 = t3.map(function(e4, r4) {
              var o2 = r4 < t3.length - 1;
              return u(e4, o2, r4 > 0, function(e5) {
                n3 || (n3 = e5), e5 && s2.forEach(f), o2 || (s2.forEach(f), i2(n3));
              });
            });
            return t3.reduce(h);
          };
        }, 457: (e2, t2, r2) => {
          "use strict";
          var n2 = r2(281).q.ERR_INVALID_OPT_VALUE;
          e2.exports = { getHighWaterMark: function(e3, t3, r3, i) {
            var o = function(e4, t4, r4) {
              return e4.highWaterMark != null ? e4.highWaterMark : t4 ? e4[r4] : null;
            }(t3, i, r3);
            if (o != null) {
              if (!isFinite(o) || Math.floor(o) !== o || o < 0)
                throw new n2(i ? r3 : "highWaterMark", o);
              return Math.floor(o);
            }
            return e3.objectMode ? 16 : 16384;
          } };
        }, 503: (e2, t2, r2) => {
          e2.exports = r2(187).EventEmitter;
        }, 509: (e2, t2, r2) => {
          var n2 = r2(764), i = n2.Buffer;
          function o(e3, t3) {
            for (var r3 in e3)
              t3[r3] = e3[r3];
          }
          function s(e3, t3, r3) {
            return i(e3, t3, r3);
          }
          i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? e2.exports = n2 : (o(n2, t2), t2.Buffer = s), s.prototype = Object.create(i.prototype), o(i, s), s.from = function(e3, t3, r3) {
            if (typeof e3 == "number")
              throw new TypeError("Argument must not be a number");
            return i(e3, t3, r3);
          }, s.alloc = function(e3, t3, r3) {
            if (typeof e3 != "number")
              throw new TypeError("Argument must be a number");
            var n3 = i(e3);
            return t3 !== void 0 ? typeof r3 == "string" ? n3.fill(t3, r3) : n3.fill(t3) : n3.fill(0), n3;
          }, s.allocUnsafe = function(e3) {
            if (typeof e3 != "number")
              throw new TypeError("Argument must be a number");
            return i(e3);
          }, s.allocUnsafeSlow = function(e3) {
            if (typeof e3 != "number")
              throw new TypeError("Argument must be a number");
            return n2.SlowBuffer(e3);
          };
        }, 830: (e2, t2, r2) => {
          e2.exports = i;
          var n2 = r2(187).EventEmitter;
          function i() {
            n2.call(this);
          }
          r2(717)(i, n2), i.Readable = r2(481), i.Writable = r2(229), i.Duplex = r2(753), i.Transform = r2(605), i.PassThrough = r2(725), i.finished = r2(610), i.pipeline = r2(946), i.Stream = i, i.prototype.pipe = function(e3, t3) {
            var r3 = this;
            function i2(t4) {
              e3.writable && e3.write(t4) === false && r3.pause && r3.pause();
            }
            function o() {
              r3.readable && r3.resume && r3.resume();
            }
            r3.on("data", i2), e3.on("drain", o), e3._isStdio || t3 && t3.end === false || (r3.on("end", a), r3.on("close", u));
            var s = false;
            function a() {
              s || (s = true, e3.end());
            }
            function u() {
              s || (s = true, typeof e3.destroy == "function" && e3.destroy());
            }
            function f(e4) {
              if (h(), n2.listenerCount(this, "error") === 0)
                throw e4;
            }
            function h() {
              r3.removeListener("data", i2), e3.removeListener("drain", o), r3.removeListener("end", a), r3.removeListener("close", u), r3.removeListener("error", f), e3.removeListener("error", f), r3.removeListener("end", h), r3.removeListener("close", h), e3.removeListener("close", h);
            }
            return r3.on("error", f), e3.on("error", f), r3.on("end", h), r3.on("close", h), e3.on("close", h), e3.emit("pipe", r3), e3;
          };
        }, 553: (e2, t2, r2) => {
          "use strict";
          var n2 = r2(509).Buffer, i = n2.isEncoding || function(e3) {
            switch ((e3 = "" + e3) && e3.toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "binary":
              case "base64":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
              case "raw":
                return true;
              default:
                return false;
            }
          };
          function o(e3) {
            var t3;
            switch (this.encoding = function(e4) {
              var t4 = function(e5) {
                if (!e5)
                  return "utf8";
                for (var t5; ; )
                  switch (e5) {
                    case "utf8":
                    case "utf-8":
                      return "utf8";
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                      return "utf16le";
                    case "latin1":
                    case "binary":
                      return "latin1";
                    case "base64":
                    case "ascii":
                    case "hex":
                      return e5;
                    default:
                      if (t5)
                        return;
                      e5 = ("" + e5).toLowerCase(), t5 = true;
                  }
              }(e4);
              if (typeof t4 != "string" && (n2.isEncoding === i || !i(e4)))
                throw new Error("Unknown encoding: " + e4);
              return t4 || e4;
            }(e3), this.encoding) {
              case "utf16le":
                this.text = u, this.end = f, t3 = 4;
                break;
              case "utf8":
                this.fillLast = a, t3 = 4;
                break;
              case "base64":
                this.text = h, this.end = l, t3 = 3;
                break;
              default:
                return this.write = c, void (this.end = d);
            }
            this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n2.allocUnsafe(t3);
          }
          function s(e3) {
            return e3 <= 127 ? 0 : e3 >> 5 == 6 ? 2 : e3 >> 4 == 14 ? 3 : e3 >> 3 == 30 ? 4 : e3 >> 6 == 2 ? -1 : -2;
          }
          function a(e3) {
            var t3 = this.lastTotal - this.lastNeed, r3 = function(e4, t4, r4) {
              if ((192 & t4[0]) != 128)
                return e4.lastNeed = 0, "\uFFFD";
              if (e4.lastNeed > 1 && t4.length > 1) {
                if ((192 & t4[1]) != 128)
                  return e4.lastNeed = 1, "\uFFFD";
                if (e4.lastNeed > 2 && t4.length > 2 && (192 & t4[2]) != 128)
                  return e4.lastNeed = 2, "\uFFFD";
              }
            }(this, e3);
            return r3 !== void 0 ? r3 : this.lastNeed <= e3.length ? (e3.copy(this.lastChar, t3, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e3.copy(this.lastChar, t3, 0, e3.length), void (this.lastNeed -= e3.length));
          }
          function u(e3, t3) {
            if ((e3.length - t3) % 2 == 0) {
              var r3 = e3.toString("utf16le", t3);
              if (r3) {
                var n3 = r3.charCodeAt(r3.length - 1);
                if (n3 >= 55296 && n3 <= 56319)
                  return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e3[e3.length - 2], this.lastChar[1] = e3[e3.length - 1], r3.slice(0, -1);
              }
              return r3;
            }
            return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e3[e3.length - 1], e3.toString("utf16le", t3, e3.length - 1);
          }
          function f(e3) {
            var t3 = e3 && e3.length ? this.write(e3) : "";
            if (this.lastNeed) {
              var r3 = this.lastTotal - this.lastNeed;
              return t3 + this.lastChar.toString("utf16le", 0, r3);
            }
            return t3;
          }
          function h(e3, t3) {
            var r3 = (e3.length - t3) % 3;
            return r3 === 0 ? e3.toString("base64", t3) : (this.lastNeed = 3 - r3, this.lastTotal = 3, r3 === 1 ? this.lastChar[0] = e3[e3.length - 1] : (this.lastChar[0] = e3[e3.length - 2], this.lastChar[1] = e3[e3.length - 1]), e3.toString("base64", t3, e3.length - r3));
          }
          function l(e3) {
            var t3 = e3 && e3.length ? this.write(e3) : "";
            return this.lastNeed ? t3 + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t3;
          }
          function c(e3) {
            return e3.toString(this.encoding);
          }
          function d(e3) {
            return e3 && e3.length ? this.write(e3) : "";
          }
          t2.s = o, o.prototype.write = function(e3) {
            if (e3.length === 0)
              return "";
            var t3, r3;
            if (this.lastNeed) {
              if ((t3 = this.fillLast(e3)) === void 0)
                return "";
              r3 = this.lastNeed, this.lastNeed = 0;
            } else
              r3 = 0;
            return r3 < e3.length ? t3 ? t3 + this.text(e3, r3) : this.text(e3, r3) : t3 || "";
          }, o.prototype.end = function(e3) {
            var t3 = e3 && e3.length ? this.write(e3) : "";
            return this.lastNeed ? t3 + "\uFFFD" : t3;
          }, o.prototype.text = function(e3, t3) {
            var r3 = function(e4, t4, r4) {
              var n4 = t4.length - 1;
              if (n4 < r4)
                return 0;
              var i2 = s(t4[n4]);
              return i2 >= 0 ? (i2 > 0 && (e4.lastNeed = i2 - 1), i2) : --n4 < r4 || i2 === -2 ? 0 : (i2 = s(t4[n4])) >= 0 ? (i2 > 0 && (e4.lastNeed = i2 - 2), i2) : --n4 < r4 || i2 === -2 ? 0 : (i2 = s(t4[n4])) >= 0 ? (i2 > 0 && (i2 === 2 ? i2 = 0 : e4.lastNeed = i2 - 3), i2) : 0;
            }(this, e3, t3);
            if (!this.lastNeed)
              return e3.toString("utf8", t3);
            this.lastTotal = r3;
            var n3 = e3.length - (r3 - this.lastNeed);
            return e3.copy(this.lastChar, 0, n3), e3.toString("utf8", t3, n3);
          }, o.prototype.fillLast = function(e3) {
            if (this.lastNeed <= e3.length)
              return e3.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
            e3.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e3.length), this.lastNeed -= e3.length;
          };
        }, 927: (e2, t2, r2) => {
          function n2(e3) {
            try {
              if (!r2.g.localStorage)
                return false;
            } catch (e4) {
              return false;
            }
            var t3 = r2.g.localStorage[e3];
            return t3 != null && String(t3).toLowerCase() === "true";
          }
          e2.exports = function(e3, t3) {
            if (n2("noDeprecation"))
              return e3;
            var r3 = false;
            return function() {
              if (!r3) {
                if (n2("throwDeprecation"))
                  throw new Error(t3);
                n2("traceDeprecation") ? console.trace(t3) : console.warn(t3), r3 = true;
              }
              return e3.apply(this, arguments);
            };
          };
        }, 361: () => {
        }, 616: () => {
        } }, t = {};
        function r(n2) {
          var i = t[n2];
          if (i !== void 0)
            return i.exports;
          var o = t[n2] = { exports: {} };
          return e[n2](o, o.exports, r), o.exports;
        }
        r.d = (e2, t2) => {
          for (var n2 in t2)
            r.o(t2, n2) && !r.o(e2, n2) && Object.defineProperty(e2, n2, { enumerable: true, get: t2[n2] });
        }, r.g = function() {
          if (typeof globalThis == "object")
            return globalThis;
          try {
            return this || new Function("return this")();
          } catch (e2) {
            if (typeof window == "object")
              return window;
          }
        }(), r.o = (e2, t2) => Object.prototype.hasOwnProperty.call(e2, t2), r.r = (e2) => {
          typeof Symbol != "undefined" && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
        };
        var n = {};
        return (() => {
          "use strict";
          r.r(n), r.d(n, { Commented: () => e2.Commented, Decoder: () => e2.Decoder, Diagnose: () => e2.Diagnose, Encoder: () => e2.Encoder, Map: () => e2.Map, Simple: () => e2.Simple, Tagged: () => e2.Tagged, comment: () => e2.UI, decode: () => e2.Jx, decodeAll: () => e2.fI, decodeAllSync: () => e2.cc, decodeFirst: () => e2.h8, decodeFirstSync: () => e2.$u, diagnose: () => e2.M, encode: () => e2.cv, encodeAsync: () => e2.WR, encodeCanonical: () => e2.N2, encodeOne: () => e2.TG, leveldb: () => e2.ww, reset: () => e2.mc });
          var e2 = r(141);
        })(), n;
      })();
    });
  }
});

// node_modules/web-api/src/err.js
var BadPlatform = class extends Error {
  constructor(facility) {
    super(`${facility} is not supported on this platform`);
    this.name = "BadPlatform";
  }
};
var InvalidArg = class extends Error {
  constructor(arg) {
    super(`invalid arg: ${arg}`);
    this.name = "InvalidArg";
  }
};
var UnexpectedError = class extends Error {
  constructor() {
    super(`unexpected error`);
    this.name = "UnexpectedError";
  }
};
var InvalidKey = class extends Error {
  constructor(op) {
    super(`invalid key in ${op}`);
    this.name = "InvalidKey";
  }
};
var OperationBlocked = class extends Error {
  constructor(op) {
    super(`operation blocked in ${op}`);
    this.name = "OperationBlocked";
  }
};
var WebAuthnError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "WebAuthnError";
  }
};

// node_modules/web-api/src/validate.js
function validateDatabase(tx) {
  return tx instanceof IDBDatabase;
}
function validateTransactionMode(mode) {
  return mode === "readonly" || mode === "readwrite";
}
function validateTransactionScope(scope) {
  return typeof scope === "string" || scope instanceof Array && scope.reduce((p, c) => p && typeof c === "string", true);
}
function validateTransaction(tx) {
  return tx instanceof IDBTransaction;
}
function validateObjectStore(store) {
  return typeof store === "string";
}
function validateCryptoKey(key) {
  return key instanceof CryptoKey;
}

// node_modules/web-api/src/idb.js
function idbOpenDb(name, version, runMigrations2) {
  if (!window.indexedDB)
    return Promise.reject(new BadPlatform("indexedDB"));
  if (typeof name !== "string")
    return Promise.reject(new InvalidArg("name"));
  if (typeof version !== "number")
    return Promise.reject(new InvalidArg("version"));
  if (typeof runMigrations2 !== "function")
    return Promise.reject(new InvalidArg("runMigrations"));
  return new Promise((resolve, reject) => {
    try {
      const rq = window.indexedDB.open(name, version);
      rq.onupgradeneeded = (e) => {
        try {
          runMigrations2(e.target.result, e.target.transaction, e.newVersion, e.oldVersion);
        } catch (err) {
          reject(err);
        }
      };
      rq.onblocked = (e) => {
        reject(new OperationBlocked("idbOpenDb"));
      };
      rq.onerror = (e) => {
        reject(e.target.error);
      };
      rq.onsuccess = (e) => {
        const db = e.target.result;
        db.onversionchange = () => {
          db.close();
        };
        resolve(db);
      };
    } catch (err) {
      reject(err);
    }
  });
}
function idbCloseDb(db) {
  if (db instanceof IDBDatabase)
    db.close();
}
function idbDeleteDb(name) {
  if (typeof name !== "string")
    return Promise.reject(new InvalidArg(name));
  return new Promise((resolve, reject) => {
    const rq = window.indexedDB.deleteDatabase(name);
    rq.onerror = (e) => {
      reject(new UnexpectedError());
    };
    rq.onsuccess = (e) => {
      resolve();
    };
    rq.onblocked = (e) => {
      reject(new OperationBlocked("idbDeleteDb"));
    };
  });
}
function idbBeginTransaction(db, scope, mode) {
  if (!validateDatabase(db))
    throw new InvalidArg("db");
  if (!validateTransactionScope(scope))
    throw new InvalidArg("scope");
  if (!validateTransactionMode(mode))
    throw new InvalidArg("mode");
  const tx = db.transaction(scope, mode);
  tx.result = null;
  tx.promise = new Promise((resolve, reject) => {
    tx.oncomplete = (e) => {
      resolve(tx.result);
    };
    tx.onerror = (e) => {
      reject(tx.error ? tx.error : e.target.error);
    };
    tx.onabort = (e) => {
      reject(tx.result);
    };
  });
  return tx;
}
function idbFinishTransaction(tx) {
  if (!validateTransaction(tx))
    throw new InvalidArg("tx");
  if (tx.error) {
    return Promise.reject(tx.error);
  }
  return tx.promise;
}
function idbGet(tx, store, key) {
  if (!validateTransaction(tx))
    throw new InvalidArg("tx");
  if (!validateObjectStore(store))
    throw new InvalidArg("store");
  try {
    const os = tx.objectStore(store);
    const rq = os.get(key);
    rq.onsuccess = (e) => {
      tx.result = rq.result;
    };
    rq.onerror = (e) => {
      tx.result = e.target.error;
      tx.abort();
    };
  } catch (err) {
    tx.result = err;
    tx.abort();
  }
}
function idbAdd(tx, store, value, key) {
  if (!validateTransaction(tx))
    throw new InvalidArg("tx");
  if (!validateObjectStore(store))
    throw new InvalidArg("store");
  try {
    const os = tx.objectStore(store);
    const rq = os.add(value, key);
    rq.onsuccess = (e) => {
      tx.result = rq.result;
    };
    rq.onerror = (e) => {
      tx.result = e.target.error;
      tx.abort();
    };
  } catch (err) {
    tx.result = err;
    tx.abort();
  }
}
function idbDelete(tx, store, key) {
  if (!validateTransaction(tx))
    throw new InvalidArg("tx");
  if (!validateObjectStore(store))
    throw new InvalidArg("store");
  try {
    const os = tx.objectStore(store);
    const rq = os.delete(key);
    rq.onsuccess = (e) => {
      tx.result = rq.result;
    };
    rq.onerror = (e) => {
      tx.result = e.target.error;
      tx.abort();
    };
  } catch (err) {
    tx.result = err;
    tx.abort();
  }
}

// node_modules/web-api/src/subtle.js
function randomBytes(buffer) {
  window.crypto.getRandomValues(buffer);
}
function exportKey(key, format) {
  if (!(key instanceof CryptoKey))
    throw new InvalidArg(key);
  return new Promise((resolve, reject) => {
    window.crypto.subtle.exportKey(format, key).then((data) => {
      if (format === "jwk")
        resolve(data);
      else
        resolve(new Uint8Array(data));
    }, (err) => {
      reject(err);
    });
  });
}
function ecdsaGenerateKeyPair(curve) {
  return new Promise((resolve, reject) => {
    const params = {
      name: "ECDSA",
      namedCurve: curve
    };
    window.crypto.subtle.generateKey(params, false, ["sign", "verify"]).then((keyPair) => {
      resolve(keyPair);
    }, (err) => {
      reject(err);
    });
  });
}
function ecdsaImportKey(format, curve, bits, use) {
  return new Promise((resolve, reject) => {
    const params = {
      name: "ECDSA",
      namedCurve: curve
    };
    window.crypto.subtle.importKey(format, bits, params, true, [use]).then((key) => {
      resolve(key);
    }, (err) => {
      reject(err);
    });
  });
}
function ecdsaSign(key, hash, data) {
  if (!validateCryptoKey(key))
    throw new InvalidArg("key");
  return new Promise((resolve, reject) => {
    const params = {
      name: "ECDSA",
      hash
    };
    window.crypto.subtle.sign(params, key, data).then((signature) => {
      signature = new Uint8Array(signature);
      resolve(signature);
    }, (err) => {
      reject(err);
    });
  });
}

// node_modules/web-api/src/webauthn.js
var cbor = __toModule(require_cbor());
async function webauthnGenerateKeyPair(name, data) {
  const userId = new Uint8Array(16);
  randomBytes(userId);
  let challenge = data !== void 0 ? data : new Uint8Array(0);
  let attestationMethod = data !== void 0 ? "direct" : "none";
  const createOptions = {
    rp: {
      name: "Beyond Identity, Inc.",
      id: location.hostname
    },
    challenge,
    user: {
      id: userId,
      name,
      displayName: name
    },
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7
      }
    ],
    attestation: attestationMethod,
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required"
    }
  };
  let cred;
  try {
    cred = await navigator.credentials.create({
      publicKey: createOptions
    });
  } catch (err) {
    throw new WebAuthnError(err.message);
  }
  if (!cred)
    throw new InvalidArg(createOptions);
  const response = cred.response;
  const attestationObject = await cbor.decodeFirst(response.attestationObject);
  const authenticatorData = attestationObject.authData;
  let publicKey2 = await readPublicKey(response, authenticatorData);
  let transports = readTransports(response);
  let signature = readSignature(attestationObject);
  return {
    rawId: cred.rawId,
    publicKey: publicKey2,
    transports,
    clientDataJSON: response.clientDataJSON,
    attestationObject: response.attestationObject,
    authenticatorData,
    signature
  };
}
async function readPublicKey(response, authenticatorData) {
  if (typeof response.getPublicKey === "function") {
    let spkiPublicKey = response.getPublicKey();
    return await ecdsaImportKey("spki", "P-256", spkiPublicKey, "verify");
  } else {
    const credentialIdLengthView = new DataView(authenticatorData.buffer.slice(authenticatorData.byteOffset + 53, authenticatorData.byteOffset + 55));
    const credentialIdLength = credentialIdLengthView.getUint16();
    const cosePublicKeyCBOR = authenticatorData.slice(55 + credentialIdLength);
    const cosePublicKey = await cbor.decodeFirst(cosePublicKeyCBOR);
    let rawPublicKey = new Uint8Array(65);
    rawPublicKey[0] = 4;
    rawPublicKey.set(cosePublicKey.get(-2), 1);
    rawPublicKey.set(cosePublicKey.get(-3), 33);
    return await ecdsaImportKey("raw", "P-256", rawPublicKey, "verify");
  }
}
function readTransports(response) {
  let transports = [];
  if (typeof response.getTransports === "function") {
    transports = response.getTransports();
  }
  return transports;
}
function readSignature(attestation) {
  if (attestation.fmt === "packed") {
    return attestation.attStmt?.sig;
  }
  return void 0;
}
async function webauthnSign(key, data) {
  const getOptions = {
    challenge: data,
    allowCredentials: [
      {
        id: key.rawId,
        type: "public-key",
        transports: key.transports
      }
    ],
    userVerification: "required",
    timeout: 6e4
  };
  const cred = await navigator.credentials.get({ publicKey: getOptions });
  if (!cred)
    throw new InvalidArg(getOptions);
  let response = cred.response;
  return {
    authenticatorData: response.authenticatorData,
    clientDataJSON: response.clientDataJSON,
    signature: response.signature
  };
}

// src/validate.js
function validateKeyHandle(handle) {
  return typeof handle === "string";
}
function validateProvider(provider) {
  return provider === "subtle" || provider === "webauthn";
}
function validateKey(key) {
  if (key !== void 0 && typeof key === "object") {
    if (key.subtle !== void 0)
      return "subtle";
    else if (key.webauthn !== void 0)
      return "webauthn";
  }
  return void 0;
}

// src/crypto.js
var subtleProvider = "subtle";
var webAuthnProvider = "webauthn";
async function hasWebAuthn() {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  return !!(!isSafari && window.PublicKeyCredential && await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
}
function hasSubtleCrypto() {
  return !!window.crypto.subtle;
}
async function queryCryptoCapabilities(provider) {
  if (!validateProvider(provider))
    throw new InvalidArg("provider");
  if (provider === webAuthnProvider) {
    if (await hasWebAuthn())
      return webauthn;
  }
  if (hasSubtleCrypto())
    return subtle;
  throw new BadPlatform("crypto");
}
async function generateKey(handle, provider, data) {
  if (!validateKeyHandle(handle))
    throw new InvalidArg("handle");
  let api = await queryCryptoCapabilities(provider);
  return await api.generateKey(handle, data);
}
async function sign(key, data) {
  let api = keyProvider(key);
  if (api === void 0)
    throw new InvalidKey("sign");
  return await api.sign(key, data);
}
async function publicKey(key) {
  let api = keyProvider(key);
  if (api === void 0)
    throw new InvalidKey("sign");
  return await api.publicKey(key);
}
function keySanityCheck(key, provider) {
  return provider in key;
}
function keyProvider(key) {
  let provider = validateKey(key);
  if (provider === "subtle")
    return subtle;
  else if (provider === "webauthn")
    return webauthn;
  else
    return void 0;
}
var subtle = new class Subtle {
  extractKeys(key) {
    if (keySanityCheck(key, subtleProvider))
      return key.subtle;
    throw new InvalidKey("");
  }
  async generateKey(handle, data) {
    let signingKey = await ecdsaGenerateKeyPair("P-256");
    let key = {
      subtle: {
        signingKey,
        encryptionKey: void 0
      }
    };
    let signature = data !== void 0 ? sign(key, data) : void 0;
    return [key, signature];
  }
  async publicKey(key) {
    let keys = this.extractKeys(key);
    return await exportKey(keys.signingKey.publicKey, "raw");
  }
  async sign(key, data) {
    let keys = this.extractKeys(key);
    let signature = await ecdsaSign(keys.signingKey.privateKey, "SHA-256", data);
    return {
      subtle: {
        signature
      }
    };
  }
}();
var webauthn = new class WebAuthn {
  extractKeys(key) {
    if (keySanityCheck(key, webAuthnProvider))
      return key.webauthn;
    throw new InvalidKey("");
  }
  async generateKey(handle, data) {
    const cred = await webauthnGenerateKeyPair(handle, data);
    let key = {
      webauthn: {
        signingKey: {
          rawId: cred.rawId,
          transports: cred.transports,
          publicKey: cred.publicKey
        },
        encryptionKey: void 0
      }
    };
    let signature = data !== void 0 ? {
      webauthn: {
        clientDataJSON: cred.clientDataJSON,
        attestationObject: cred.attestationObject
      }
    } : void 0;
    return [key, signature];
  }
  async publicKey(key) {
    let keys = this.extractKeys(key);
    return await exportKey(keys.signingKey.publicKey, "raw");
  }
  async sign(key, data) {
    let keys = this.extractKeys(key);
    const signature = await webauthnSign(keys.signingKey, data);
    return {
      webauthn: {
        authenticatorData: signature.authenticatorData,
        clientDataJSON: signature.clientDataJSON,
        signature: signature.signature
      }
    };
  }
}();

// src/error.js
var KeyNotFound = class extends Error {
  constructor(handle) {
    super(`${handle} not found`);
    this.name = "KeyNotFound";
  }
};
var KeyExists = class extends Error {
  constructor(handle) {
    super(`${handle} exists`);
    this.name = "KeyExists";
  }
};

// src/db.js
var dbKeyStore = "keys";
var kmcDbName = "keymaker";
var kmcCertStore = "certificates";
var kmcKeyStore = "keys";
var kmcProfileStore = "credentials";
var kmcProfileIndex = "id";
var kmcAppSettings = "appSettings";
var kmcDbVersions = [v1, v2, v3, v4, v5, v6];
var kmcDbVersion = kmcDbVersions.length;
function runMigrations(db, tx, version, oldVersion) {
  if (!db)
    throw new InvalidArg("db");
  if (!version)
    throw new InvalidArg("version");
  if (version > kmcDbVersions.length)
    throw new InvalidArg("version");
  for (; oldVersion < version; oldVersion++) {
    kmcDbVersions[oldVersion](db, tx);
  }
}
function v1(db, tx) {
  db.createObjectStore(kmcProfileStore, { keyPath: "handle" });
  db.createObjectStore(kmcCertStore);
  db.createObjectStore(kmcKeyStore);
}
function v2(db, tx) {
  db.createObjectStore(kmcAppSettings, { keyPath: "instanceId" });
}
function v3(db, tx) {
  let store = tx.objectStore(kmcProfileStore);
  let rq = store.openCursor();
  rq.onsuccess = (ev) => {
    let cursor = ev.target.result;
    if (cursor) {
      if (!cursor.value.state) {
        cursor.value.state = "Active";
        cursor.update(cursor.value);
      }
      cursor.continue();
    }
  };
}
function v4(db, tx) {
}
function v5(db, tx) {
  let store = tx.objectStore(kmcProfileStore);
  let rq = store.openCursor();
  rq.onsuccess = (ev) => {
    let cursor = ev.target.result;
    if (cursor) {
      if (!cursor.value.id) {
        cursor.value.id = generateHandle(16, "cr");
        cursor.update(cursor.value);
      }
      cursor.continue();
    }
  };
}
function v6(db, tx) {
  let store = tx.objectStore(kmcProfileStore);
  store.createIndex(kmcProfileIndex, "id", { unique: true });
}
function randomBytes2(len) {
  let buf = new Uint8Array(len);
  window.crypto.getRandomValues(buf);
  return buf;
}
function generateHandle(len, prefix) {
  return (prefix ?? "") + [...randomBytes2(len / 2)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function openDb() {
  return await idbOpenDb(kmcDbName, kmcDbVersions.length, runMigrations);
}
function closeDb(db) {
  if (db !== void 0)
    idbCloseDb(db);
}
async function resetDb() {
  await idbDeleteDb(kmcDbName);
}

// src/keyStore.js
async function loadKey(db, handle) {
  if (!validateDatabase(db))
    throw new InvalidArg("db");
  if (!validateKeyHandle(handle))
    throw new InvalidArg("handle");
  const tx = idbBeginTransaction(db, dbKeyStore, "readonly");
  idbGet(tx, dbKeyStore, handle);
  let obj = await idbFinishTransaction(tx);
  if (obj !== void 0) {
    if (validateKey === void 0)
      throw new InvalidKey("loadKey");
    return obj;
  }
  return void 0;
}
async function saveKey(db, handle, key) {
  if (!validateDatabase(db))
    throw new InvalidArg("db");
  if (!validateKeyHandle(handle))
    throw new InvalidArg("handle");
  if (validateKey(key) === void 0)
    throw new InvalidKey("saveKey");
  const tx = idbBeginTransaction(db, dbKeyStore, "readwrite");
  idbAdd(tx, dbKeyStore, key, handle);
  await idbFinishTransaction(tx);
}
async function deleteKey(db, handle) {
  if (!validateDatabase(db))
    throw new InvalidArg("db");
  if (!validateKeyHandle(handle))
    throw new InvalidArg("handle");
  const tx = idbBeginTransaction(db, dbKeyStore, "readwrite");
  idbDelete(tx, dbKeyStore, handle);
  await idbFinishTransaction(tx);
}

// src/index.js
function FfiCreateKeyP256(handle, provider, data) {
  return new Promise(async (resolve, reject) => {
    let db;
    try {
      db = await openDb();
      let key = await loadKey(db, handle);
      if (key)
        throw new KeyExists(handle);
      let signature;
      try {
        [key, signature] = await generateKey(handle, provider, data);
      } catch (err) {
        if (provider === "webauthn" && err instanceof WebAuthnError) {
          console.warn(err);
          [key, signature] = await generateKey(handle, "subtle", data);
        } else {
          throw err;
        }
      }
      await saveKey(db, handle, key);
      resolve(signature);
    } catch (err) {
      reject(err);
    } finally {
      closeDb(db);
    }
  });
}
function FfiQueryKeyP256(handle) {
  return new Promise(async (resolve, reject) => {
    let db;
    try {
      db = await openDb();
      const key = await loadKey(db, handle);
      if (key === void 0)
        throw new KeyNotFound(handle);
      const type = validateKey(key);
      if (type === void 0) {
        throw new InvalidKey("FfiQueryKeyP256");
      } else {
        resolve(type);
      }
    } catch (err) {
      reject(err);
    } finally {
      closeDb(db);
    }
  });
}
function FfiDeleteKeyP256(handle) {
  return new Promise(async (resolve, reject) => {
    let db;
    try {
      db = await openDb();
      const key = await loadKey(db, handle);
      if (key === void 0)
        throw new KeyNotFound(handle);
      await deleteKey(db, handle);
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      closeDb(db);
    }
  });
}
function FfiVerifyExistingKeyP256(handle) {
  return new Promise(async (resolve, reject) => {
    let db;
    try {
      db = await openDb();
      const key = await loadKey(db, handle);
      if (key === void 0) {
        resolve(void 0);
      }
      if (validateKey(key) === void 0)
        throw new InvalidKey(handle);
      resolve(handle);
    } catch (err) {
      reject(err);
    } finally {
      closeDb(db);
    }
  });
}
function FfiSignWithP256(handle, data) {
  return new Promise(async (resolve, reject) => {
    let db;
    try {
      db = await openDb();
      const key = await loadKey(db, handle);
      if (key === void 0)
        throw new KeyNotFound(handle);
      const signature = await sign(key, data);
      resolve(signature);
    } catch (err) {
      reject(err);
    } finally {
      closeDb(db);
    }
  });
}
function FfiPublicBitsP256(handle) {
  return new Promise(async (resolve, reject) => {
    let db;
    try {
      db = await openDb();
      const key = await loadKey(db, handle);
      if (key === void 0)
        throw new KeyNotFound(handle);
      const bits = await publicKey(key);
      resolve(bits);
    } catch (err) {
      reject(err);
    } finally {
      closeDb(db);
    }
  });
}

/*! For license information please see cbor.js.LICENSE.txt */


/***/ }),

/***/ "./node_modules/kmc-ffi/snippets/kmc-js-a8479199104cfb09/src/js/dist/kmc.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/kmc-ffi/snippets/kmc-js-a8479199104cfb09/src/js/dist/kmc.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "kmc_add_authenticator_client_id": () => (/* binding */ Zi),
/* harmony export */   "kmc_close_db": () => (/* binding */ Er),
/* harmony export */   "kmc_decode_device_info": () => (/* binding */ _o),
/* harmony export */   "kmc_decrypt": () => (/* binding */ Di),
/* harmony export */   "kmc_delete_all_authenticator_client_ids": () => (/* binding */ Qi),
/* harmony export */   "kmc_delete_cert": () => (/* binding */ fi),
/* harmony export */   "kmc_delete_key": () => (/* binding */ yi),
/* harmony export */   "kmc_delete_profile": () => (/* binding */ Xi),
/* harmony export */   "kmc_encode_device_info": () => (/* binding */ Zr),
/* harmony export */   "kmc_encrypt": () => (/* binding */ gi),
/* harmony export */   "kmc_generate_key": () => (/* binding */ Ai),
/* harmony export */   "kmc_get_all_profiles": () => (/* binding */ Hr),
/* harmony export */   "kmc_get_app_settings": () => (/* binding */ yn),
/* harmony export */   "kmc_get_cert": () => (/* binding */ ai),
/* harmony export */   "kmc_get_device_info": () => (/* binding */ Eo),
/* harmony export */   "kmc_get_key": () => (/* binding */ Ze),
/* harmony export */   "kmc_get_profile": () => (/* binding */ Fr),
/* harmony export */   "kmc_get_profile_by_id": () => (/* binding */ Yi),
/* harmony export */   "kmc_get_user_agent": () => (/* binding */ Ao),
/* harmony export */   "kmc_has_profile": () => (/* binding */ zi),
/* harmony export */   "kmc_is_key_webauthn_backed": () => (/* binding */ Ei),
/* harmony export */   "kmc_open_db": () => (/* binding */ Ar),
/* harmony export */   "kmc_public_key": () => (/* binding */ Rr),
/* harmony export */   "kmc_put_app_settings": () => (/* binding */ eo),
/* harmony export */   "kmc_put_cert": () => (/* binding */ ui),
/* harmony export */   "kmc_reset_db": () => (/* binding */ _r),
/* harmony export */   "kmc_save_key": () => (/* binding */ en),
/* harmony export */   "kmc_sign": () => (/* binding */ _i),
/* harmony export */   "kmc_update_profile_metadata": () => (/* binding */ Gi),
/* harmony export */   "kmc_verify": () => (/* binding */ ki),
/* harmony export */   "kmc_write_profile": () => (/* binding */ Ji),
/* harmony export */   "kmc_write_profile_id": () => (/* binding */ qi)
/* harmony export */ });
var vr=Object.create;var Ot=Object.defineProperty;var br=Object.getOwnPropertyDescriptor;var wr=Object.getOwnPropertyNames;var Or=Object.getPrototypeOf,Sr=Object.prototype.hasOwnProperty;var mr=d=>Ot(d,"__esModule",{value:!0});var _e=(d,c)=>()=>(c||d((c={exports:{}}).exports,c),c.exports);var Ir=(d,c,l)=>{if(c&&typeof c=="object"||typeof c=="function")for(let r of wr(c))!Sr.call(d,r)&&r!=="default"&&Ot(d,r,{get:()=>c[r],enumerable:!(l=br(c,r))||l.enumerable});return d},St=d=>Ir(mr(Ot(d!=null?vr(Or(d)):{},"default",d&&d.__esModule&&"default"in d?{get:()=>d.default,enumerable:!0}:{value:d,enumerable:!0})),d);var on=_e((tt,Mt)=>{(function(d,c){typeof tt=="object"&&typeof Mt=="object"?Mt.exports=c():typeof define=="function"&&__webpack_require__.amdO?define([],c):typeof tt=="object"?tt.cbor=c():d.cbor=c()})(tt,function(){return(()=>{var d={742:(e,t)=>{"use strict";t.byteLength=function(I){var P=u(I),g=P[0],w=P[1];return 3*(g+w)/4-w},t.toByteArray=function(I){var P,g,w=u(I),v=w[0],m=w[1],S=new f(function(R,$,F){return 3*($+F)/4-F}(0,v,m)),_=0,B=m>0?v-4:v;for(g=0;g<B;g+=4)P=o[I.charCodeAt(g)]<<18|o[I.charCodeAt(g+1)]<<12|o[I.charCodeAt(g+2)]<<6|o[I.charCodeAt(g+3)],S[_++]=P>>16&255,S[_++]=P>>8&255,S[_++]=255&P;return m===2&&(P=o[I.charCodeAt(g)]<<2|o[I.charCodeAt(g+1)]>>4,S[_++]=255&P),m===1&&(P=o[I.charCodeAt(g)]<<10|o[I.charCodeAt(g+1)]<<4|o[I.charCodeAt(g+2)]>>2,S[_++]=P>>8&255,S[_++]=255&P),S},t.fromByteArray=function(I){for(var P,g=I.length,w=g%3,v=[],m=16383,S=0,_=g-w;S<_;S+=m)v.push(p(I,S,S+m>_?_:S+m));return w===1?(P=I[g-1],v.push(n[P>>2]+n[P<<4&63]+"==")):w===2&&(P=(I[g-2]<<8)+I[g-1],v.push(n[P>>10]+n[P>>4&63]+n[P<<2&63]+"=")),v.join("")};for(var n=[],o=[],f=typeof Uint8Array!="undefined"?Uint8Array:Array,y="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",O=0,b=y.length;O<b;++O)n[O]=y[O],o[y.charCodeAt(O)]=O;function u(I){var P=I.length;if(P%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var g=I.indexOf("=");return g===-1&&(g=P),[g,g===P?0:4-g%4]}function p(I,P,g){for(var w,v,m=[],S=P;S<g;S+=3)w=(I[S]<<16&16711680)+(I[S+1]<<8&65280)+(255&I[S+2]),m.push(n[(v=w)>>18&63]+n[v>>12&63]+n[v>>6&63]+n[63&v]);return m.join("")}o["-".charCodeAt(0)]=62,o["_".charCodeAt(0)]=63},764:(e,t,n)=>{"use strict";let o=n(742),f=n(645),y=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;t.Buffer=u,t.SlowBuffer=function(a){return+a!=a&&(a=0),u.alloc(+a)},t.INSPECT_MAX_BYTES=50;let O=2147483647;function b(a){if(a>O)throw new RangeError('The value "'+a+'" is invalid for option "size"');let s=new Uint8Array(a);return Object.setPrototypeOf(s,u.prototype),s}function u(a,s,h){if(typeof a=="number"){if(typeof s=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return P(a)}return p(a,s,h)}function p(a,s,h){if(typeof a=="string")return function(x,V){if(typeof V=="string"&&V!==""||(V="utf8"),!u.isEncoding(V))throw new TypeError("Unknown encoding: "+V);let ie=0|m(x,V),se=b(ie),me=se.write(x,V);return me!==ie&&(se=se.slice(0,me)),se}(a,s);if(ArrayBuffer.isView(a))return function(x){if(fe(x,Uint8Array)){let V=new Uint8Array(x);return w(V.buffer,V.byteOffset,V.byteLength)}return g(x)}(a);if(a==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof a);if(fe(a,ArrayBuffer)||a&&fe(a.buffer,ArrayBuffer)||typeof SharedArrayBuffer!="undefined"&&(fe(a,SharedArrayBuffer)||a&&fe(a.buffer,SharedArrayBuffer)))return w(a,s,h);if(typeof a=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');let M=a.valueOf&&a.valueOf();if(M!=null&&M!==a)return u.from(M,s,h);let T=function(x){if(u.isBuffer(x)){let V=0|v(x.length),ie=b(V);return ie.length===0||x.copy(ie,0,0,V),ie}return x.length!==void 0?typeof x.length!="number"||de(x.length)?b(0):g(x):x.type==="Buffer"&&Array.isArray(x.data)?g(x.data):void 0}(a);if(T)return T;if(typeof Symbol!="undefined"&&Symbol.toPrimitive!=null&&typeof a[Symbol.toPrimitive]=="function")return u.from(a[Symbol.toPrimitive]("string"),s,h);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof a)}function I(a){if(typeof a!="number")throw new TypeError('"size" argument must be of type number');if(a<0)throw new RangeError('The value "'+a+'" is invalid for option "size"')}function P(a){return I(a),b(a<0?0:0|v(a))}function g(a){let s=a.length<0?0:0|v(a.length),h=b(s);for(let M=0;M<s;M+=1)h[M]=255&a[M];return h}function w(a,s,h){if(s<0||a.byteLength<s)throw new RangeError('"offset" is outside of buffer bounds');if(a.byteLength<s+(h||0))throw new RangeError('"length" is outside of buffer bounds');let M;return M=s===void 0&&h===void 0?new Uint8Array(a):h===void 0?new Uint8Array(a,s):new Uint8Array(a,s,h),Object.setPrototypeOf(M,u.prototype),M}function v(a){if(a>=O)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+O.toString(16)+" bytes");return 0|a}function m(a,s){if(u.isBuffer(a))return a.length;if(ArrayBuffer.isView(a)||fe(a,ArrayBuffer))return a.byteLength;if(typeof a!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof a);let h=a.length,M=arguments.length>2&&arguments[2]===!0;if(!M&&h===0)return 0;let T=!1;for(;;)switch(s){case"ascii":case"latin1":case"binary":return h;case"utf8":case"utf-8":return ve(a).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*h;case"hex":return h>>>1;case"base64":return Oe(a).length;default:if(T)return M?-1:ve(a).length;s=(""+s).toLowerCase(),T=!0}}function S(a,s,h){let M=!1;if((s===void 0||s<0)&&(s=0),s>this.length||((h===void 0||h>this.length)&&(h=this.length),h<=0)||(h>>>=0)<=(s>>>=0))return"";for(a||(a="utf8");;)switch(a){case"hex":return oe(this,s,h);case"utf8":case"utf-8":return J(this,s,h);case"ascii":return Q(this,s,h);case"latin1":case"binary":return q(this,s,h);case"base64":return H(this,s,h);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return k(this,s,h);default:if(M)throw new TypeError("Unknown encoding: "+a);a=(a+"").toLowerCase(),M=!0}}function _(a,s,h){let M=a[s];a[s]=a[h],a[h]=M}function B(a,s,h,M,T){if(a.length===0)return-1;if(typeof h=="string"?(M=h,h=0):h>2147483647?h=2147483647:h<-2147483648&&(h=-2147483648),de(h=+h)&&(h=T?0:a.length-1),h<0&&(h=a.length+h),h>=a.length){if(T)return-1;h=a.length-1}else if(h<0){if(!T)return-1;h=0}if(typeof s=="string"&&(s=u.from(s,M)),u.isBuffer(s))return s.length===0?-1:R(a,s,h,M,T);if(typeof s=="number")return s&=255,typeof Uint8Array.prototype.indexOf=="function"?T?Uint8Array.prototype.indexOf.call(a,s,h):Uint8Array.prototype.lastIndexOf.call(a,s,h):R(a,[s],h,M,T);throw new TypeError("val must be string, number or Buffer")}function R(a,s,h,M,T){let x,V=1,ie=a.length,se=s.length;if(M!==void 0&&((M=String(M).toLowerCase())==="ucs2"||M==="ucs-2"||M==="utf16le"||M==="utf-16le")){if(a.length<2||s.length<2)return-1;V=2,ie/=2,se/=2,h/=2}function me(be,Ee){return V===1?be[Ee]:be.readUInt16BE(Ee*V)}if(T){let be=-1;for(x=h;x<ie;x++)if(me(a,x)===me(s,be===-1?0:x-be)){if(be===-1&&(be=x),x-be+1===se)return be*V}else be!==-1&&(x-=x-be),be=-1}else for(h+se>ie&&(h=ie-se),x=h;x>=0;x--){let be=!0;for(let Ee=0;Ee<se;Ee++)if(me(a,x+Ee)!==me(s,Ee)){be=!1;break}if(be)return x}return-1}function $(a,s,h,M){h=Number(h)||0;let T=a.length-h;M?(M=Number(M))>T&&(M=T):M=T;let x=s.length,V;for(M>x/2&&(M=x/2),V=0;V<M;++V){let ie=parseInt(s.substr(2*V,2),16);if(de(ie))return V;a[h+V]=ie}return V}function F(a,s,h,M){return ee(ve(s,a.length-h),a,h,M)}function C(a,s,h,M){return ee(function(T){let x=[];for(let V=0;V<T.length;++V)x.push(255&T.charCodeAt(V));return x}(s),a,h,M)}function Y(a,s,h,M){return ee(Oe(s),a,h,M)}function N(a,s,h,M){return ee(function(T,x){let V,ie,se,me=[];for(let be=0;be<T.length&&!((x-=2)<0);++be)V=T.charCodeAt(be),ie=V>>8,se=V%256,me.push(se),me.push(ie);return me}(s,a.length-h),a,h,M)}function H(a,s,h){return s===0&&h===a.length?o.fromByteArray(a):o.fromByteArray(a.slice(s,h))}function J(a,s,h){h=Math.min(a.length,h);let M=[],T=s;for(;T<h;){let x=a[T],V=null,ie=x>239?4:x>223?3:x>191?2:1;if(T+ie<=h){let se,me,be,Ee;switch(ie){case 1:x<128&&(V=x);break;case 2:se=a[T+1],(192&se)==128&&(Ee=(31&x)<<6|63&se,Ee>127&&(V=Ee));break;case 3:se=a[T+1],me=a[T+2],(192&se)==128&&(192&me)==128&&(Ee=(15&x)<<12|(63&se)<<6|63&me,Ee>2047&&(Ee<55296||Ee>57343)&&(V=Ee));break;case 4:se=a[T+1],me=a[T+2],be=a[T+3],(192&se)==128&&(192&me)==128&&(192&be)==128&&(Ee=(15&x)<<18|(63&se)<<12|(63&me)<<6|63&be,Ee>65535&&Ee<1114112&&(V=Ee))}}V===null?(V=65533,ie=1):V>65535&&(V-=65536,M.push(V>>>10&1023|55296),V=56320|1023&V),M.push(V),T+=ie}return function(x){let V=x.length;if(V<=ce)return String.fromCharCode.apply(String,x);let ie="",se=0;for(;se<V;)ie+=String.fromCharCode.apply(String,x.slice(se,se+=ce));return ie}(M)}t.kMaxLength=O,u.TYPED_ARRAY_SUPPORT=function(){try{let a=new Uint8Array(1),s={foo:function(){return 42}};return Object.setPrototypeOf(s,Uint8Array.prototype),Object.setPrototypeOf(a,s),a.foo()===42}catch{return!1}}(),u.TYPED_ARRAY_SUPPORT||typeof console=="undefined"||typeof console.error!="function"||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(u.prototype,"parent",{enumerable:!0,get:function(){if(u.isBuffer(this))return this.buffer}}),Object.defineProperty(u.prototype,"offset",{enumerable:!0,get:function(){if(u.isBuffer(this))return this.byteOffset}}),u.poolSize=8192,u.from=function(a,s,h){return p(a,s,h)},Object.setPrototypeOf(u.prototype,Uint8Array.prototype),Object.setPrototypeOf(u,Uint8Array),u.alloc=function(a,s,h){return function(M,T,x){return I(M),M<=0?b(M):T!==void 0?typeof x=="string"?b(M).fill(T,x):b(M).fill(T):b(M)}(a,s,h)},u.allocUnsafe=function(a){return P(a)},u.allocUnsafeSlow=function(a){return P(a)},u.isBuffer=function(a){return a!=null&&a._isBuffer===!0&&a!==u.prototype},u.compare=function(a,s){if(fe(a,Uint8Array)&&(a=u.from(a,a.offset,a.byteLength)),fe(s,Uint8Array)&&(s=u.from(s,s.offset,s.byteLength)),!u.isBuffer(a)||!u.isBuffer(s))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(a===s)return 0;let h=a.length,M=s.length;for(let T=0,x=Math.min(h,M);T<x;++T)if(a[T]!==s[T]){h=a[T],M=s[T];break}return h<M?-1:M<h?1:0},u.isEncoding=function(a){switch(String(a).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},u.concat=function(a,s){if(!Array.isArray(a))throw new TypeError('"list" argument must be an Array of Buffers');if(a.length===0)return u.alloc(0);let h;if(s===void 0)for(s=0,h=0;h<a.length;++h)s+=a[h].length;let M=u.allocUnsafe(s),T=0;for(h=0;h<a.length;++h){let x=a[h];if(fe(x,Uint8Array))T+x.length>M.length?(u.isBuffer(x)||(x=u.from(x)),x.copy(M,T)):Uint8Array.prototype.set.call(M,x,T);else{if(!u.isBuffer(x))throw new TypeError('"list" argument must be an Array of Buffers');x.copy(M,T)}T+=x.length}return M},u.byteLength=m,u.prototype._isBuffer=!0,u.prototype.swap16=function(){let a=this.length;if(a%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let s=0;s<a;s+=2)_(this,s,s+1);return this},u.prototype.swap32=function(){let a=this.length;if(a%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let s=0;s<a;s+=4)_(this,s,s+3),_(this,s+1,s+2);return this},u.prototype.swap64=function(){let a=this.length;if(a%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let s=0;s<a;s+=8)_(this,s,s+7),_(this,s+1,s+6),_(this,s+2,s+5),_(this,s+3,s+4);return this},u.prototype.toString=function(){let a=this.length;return a===0?"":arguments.length===0?J(this,0,a):S.apply(this,arguments)},u.prototype.toLocaleString=u.prototype.toString,u.prototype.equals=function(a){if(!u.isBuffer(a))throw new TypeError("Argument must be a Buffer");return this===a||u.compare(this,a)===0},u.prototype.inspect=function(){let a="",s=t.INSPECT_MAX_BYTES;return a=this.toString("hex",0,s).replace(/(.{2})/g,"$1 ").trim(),this.length>s&&(a+=" ... "),"<Buffer "+a+">"},y&&(u.prototype[y]=u.prototype.inspect),u.prototype.compare=function(a,s,h,M,T){if(fe(a,Uint8Array)&&(a=u.from(a,a.offset,a.byteLength)),!u.isBuffer(a))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof a);if(s===void 0&&(s=0),h===void 0&&(h=a?a.length:0),M===void 0&&(M=0),T===void 0&&(T=this.length),s<0||h>a.length||M<0||T>this.length)throw new RangeError("out of range index");if(M>=T&&s>=h)return 0;if(M>=T)return-1;if(s>=h)return 1;if(this===a)return 0;let x=(T>>>=0)-(M>>>=0),V=(h>>>=0)-(s>>>=0),ie=Math.min(x,V),se=this.slice(M,T),me=a.slice(s,h);for(let be=0;be<ie;++be)if(se[be]!==me[be]){x=se[be],V=me[be];break}return x<V?-1:V<x?1:0},u.prototype.includes=function(a,s,h){return this.indexOf(a,s,h)!==-1},u.prototype.indexOf=function(a,s,h){return B(this,a,s,h,!0)},u.prototype.lastIndexOf=function(a,s,h){return B(this,a,s,h,!1)},u.prototype.write=function(a,s,h,M){if(s===void 0)M="utf8",h=this.length,s=0;else if(h===void 0&&typeof s=="string")M=s,h=this.length,s=0;else{if(!isFinite(s))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");s>>>=0,isFinite(h)?(h>>>=0,M===void 0&&(M="utf8")):(M=h,h=void 0)}let T=this.length-s;if((h===void 0||h>T)&&(h=T),a.length>0&&(h<0||s<0)||s>this.length)throw new RangeError("Attempt to write outside buffer bounds");M||(M="utf8");let x=!1;for(;;)switch(M){case"hex":return $(this,a,s,h);case"utf8":case"utf-8":return F(this,a,s,h);case"ascii":case"latin1":case"binary":return C(this,a,s,h);case"base64":return Y(this,a,s,h);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return N(this,a,s,h);default:if(x)throw new TypeError("Unknown encoding: "+M);M=(""+M).toLowerCase(),x=!0}},u.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};let ce=4096;function Q(a,s,h){let M="";h=Math.min(a.length,h);for(let T=s;T<h;++T)M+=String.fromCharCode(127&a[T]);return M}function q(a,s,h){let M="";h=Math.min(a.length,h);for(let T=s;T<h;++T)M+=String.fromCharCode(a[T]);return M}function oe(a,s,h){let M=a.length;(!s||s<0)&&(s=0),(!h||h<0||h>M)&&(h=M);let T="";for(let x=s;x<h;++x)T+=Ae[a[x]];return T}function k(a,s,h){let M=a.slice(s,h),T="";for(let x=0;x<M.length-1;x+=2)T+=String.fromCharCode(M[x]+256*M[x+1]);return T}function A(a,s,h){if(a%1!=0||a<0)throw new RangeError("offset is not uint");if(a+s>h)throw new RangeError("Trying to access beyond buffer length")}function j(a,s,h,M,T,x){if(!u.isBuffer(a))throw new TypeError('"buffer" argument must be a Buffer instance');if(s>T||s<x)throw new RangeError('"value" argument is out of bounds');if(h+M>a.length)throw new RangeError("Index out of range")}function L(a,s,h,M,T){D(s,M,T,a,h,7);let x=Number(s&BigInt(4294967295));a[h++]=x,x>>=8,a[h++]=x,x>>=8,a[h++]=x,x>>=8,a[h++]=x;let V=Number(s>>BigInt(32)&BigInt(4294967295));return a[h++]=V,V>>=8,a[h++]=V,V>>=8,a[h++]=V,V>>=8,a[h++]=V,h}function K(a,s,h,M,T){D(s,M,T,a,h,7);let x=Number(s&BigInt(4294967295));a[h+7]=x,x>>=8,a[h+6]=x,x>>=8,a[h+5]=x,x>>=8,a[h+4]=x;let V=Number(s>>BigInt(32)&BigInt(4294967295));return a[h+3]=V,V>>=8,a[h+2]=V,V>>=8,a[h+1]=V,V>>=8,a[h]=V,h+8}function G(a,s,h,M,T,x){if(h+M>a.length)throw new RangeError("Index out of range");if(h<0)throw new RangeError("Index out of range")}function z(a,s,h,M,T){return s=+s,h>>>=0,T||G(a,0,h,4),f.write(a,s,h,M,23,4),h+4}function re(a,s,h,M,T){return s=+s,h>>>=0,T||G(a,0,h,8),f.write(a,s,h,M,52,8),h+8}u.prototype.slice=function(a,s){let h=this.length;(a=~~a)<0?(a+=h)<0&&(a=0):a>h&&(a=h),(s=s===void 0?h:~~s)<0?(s+=h)<0&&(s=0):s>h&&(s=h),s<a&&(s=a);let M=this.subarray(a,s);return Object.setPrototypeOf(M,u.prototype),M},u.prototype.readUintLE=u.prototype.readUIntLE=function(a,s,h){a>>>=0,s>>>=0,h||A(a,s,this.length);let M=this[a],T=1,x=0;for(;++x<s&&(T*=256);)M+=this[a+x]*T;return M},u.prototype.readUintBE=u.prototype.readUIntBE=function(a,s,h){a>>>=0,s>>>=0,h||A(a,s,this.length);let M=this[a+--s],T=1;for(;s>0&&(T*=256);)M+=this[a+--s]*T;return M},u.prototype.readUint8=u.prototype.readUInt8=function(a,s){return a>>>=0,s||A(a,1,this.length),this[a]},u.prototype.readUint16LE=u.prototype.readUInt16LE=function(a,s){return a>>>=0,s||A(a,2,this.length),this[a]|this[a+1]<<8},u.prototype.readUint16BE=u.prototype.readUInt16BE=function(a,s){return a>>>=0,s||A(a,2,this.length),this[a]<<8|this[a+1]},u.prototype.readUint32LE=u.prototype.readUInt32LE=function(a,s){return a>>>=0,s||A(a,4,this.length),(this[a]|this[a+1]<<8|this[a+2]<<16)+16777216*this[a+3]},u.prototype.readUint32BE=u.prototype.readUInt32BE=function(a,s){return a>>>=0,s||A(a,4,this.length),16777216*this[a]+(this[a+1]<<16|this[a+2]<<8|this[a+3])},u.prototype.readBigUInt64LE=ne(function(a){E(a>>>=0,"offset");let s=this[a],h=this[a+7];s!==void 0&&h!==void 0||W(a,this.length-8);let M=s+256*this[++a]+65536*this[++a]+this[++a]*2**24,T=this[++a]+256*this[++a]+65536*this[++a]+h*2**24;return BigInt(M)+(BigInt(T)<<BigInt(32))}),u.prototype.readBigUInt64BE=ne(function(a){E(a>>>=0,"offset");let s=this[a],h=this[a+7];s!==void 0&&h!==void 0||W(a,this.length-8);let M=s*2**24+65536*this[++a]+256*this[++a]+this[++a],T=this[++a]*2**24+65536*this[++a]+256*this[++a]+h;return(BigInt(M)<<BigInt(32))+BigInt(T)}),u.prototype.readIntLE=function(a,s,h){a>>>=0,s>>>=0,h||A(a,s,this.length);let M=this[a],T=1,x=0;for(;++x<s&&(T*=256);)M+=this[a+x]*T;return T*=128,M>=T&&(M-=Math.pow(2,8*s)),M},u.prototype.readIntBE=function(a,s,h){a>>>=0,s>>>=0,h||A(a,s,this.length);let M=s,T=1,x=this[a+--M];for(;M>0&&(T*=256);)x+=this[a+--M]*T;return T*=128,x>=T&&(x-=Math.pow(2,8*s)),x},u.prototype.readInt8=function(a,s){return a>>>=0,s||A(a,1,this.length),128&this[a]?-1*(255-this[a]+1):this[a]},u.prototype.readInt16LE=function(a,s){a>>>=0,s||A(a,2,this.length);let h=this[a]|this[a+1]<<8;return 32768&h?4294901760|h:h},u.prototype.readInt16BE=function(a,s){a>>>=0,s||A(a,2,this.length);let h=this[a+1]|this[a]<<8;return 32768&h?4294901760|h:h},u.prototype.readInt32LE=function(a,s){return a>>>=0,s||A(a,4,this.length),this[a]|this[a+1]<<8|this[a+2]<<16|this[a+3]<<24},u.prototype.readInt32BE=function(a,s){return a>>>=0,s||A(a,4,this.length),this[a]<<24|this[a+1]<<16|this[a+2]<<8|this[a+3]},u.prototype.readBigInt64LE=ne(function(a){E(a>>>=0,"offset");let s=this[a],h=this[a+7];s!==void 0&&h!==void 0||W(a,this.length-8);let M=this[a+4]+256*this[a+5]+65536*this[a+6]+(h<<24);return(BigInt(M)<<BigInt(32))+BigInt(s+256*this[++a]+65536*this[++a]+this[++a]*2**24)}),u.prototype.readBigInt64BE=ne(function(a){E(a>>>=0,"offset");let s=this[a],h=this[a+7];s!==void 0&&h!==void 0||W(a,this.length-8);let M=(s<<24)+65536*this[++a]+256*this[++a]+this[++a];return(BigInt(M)<<BigInt(32))+BigInt(this[++a]*2**24+65536*this[++a]+256*this[++a]+h)}),u.prototype.readFloatLE=function(a,s){return a>>>=0,s||A(a,4,this.length),f.read(this,a,!0,23,4)},u.prototype.readFloatBE=function(a,s){return a>>>=0,s||A(a,4,this.length),f.read(this,a,!1,23,4)},u.prototype.readDoubleLE=function(a,s){return a>>>=0,s||A(a,8,this.length),f.read(this,a,!0,52,8)},u.prototype.readDoubleBE=function(a,s){return a>>>=0,s||A(a,8,this.length),f.read(this,a,!1,52,8)},u.prototype.writeUintLE=u.prototype.writeUIntLE=function(a,s,h,M){a=+a,s>>>=0,h>>>=0,M||j(this,a,s,h,Math.pow(2,8*h)-1,0);let T=1,x=0;for(this[s]=255&a;++x<h&&(T*=256);)this[s+x]=a/T&255;return s+h},u.prototype.writeUintBE=u.prototype.writeUIntBE=function(a,s,h,M){a=+a,s>>>=0,h>>>=0,M||j(this,a,s,h,Math.pow(2,8*h)-1,0);let T=h-1,x=1;for(this[s+T]=255&a;--T>=0&&(x*=256);)this[s+T]=a/x&255;return s+h},u.prototype.writeUint8=u.prototype.writeUInt8=function(a,s,h){return a=+a,s>>>=0,h||j(this,a,s,1,255,0),this[s]=255&a,s+1},u.prototype.writeUint16LE=u.prototype.writeUInt16LE=function(a,s,h){return a=+a,s>>>=0,h||j(this,a,s,2,65535,0),this[s]=255&a,this[s+1]=a>>>8,s+2},u.prototype.writeUint16BE=u.prototype.writeUInt16BE=function(a,s,h){return a=+a,s>>>=0,h||j(this,a,s,2,65535,0),this[s]=a>>>8,this[s+1]=255&a,s+2},u.prototype.writeUint32LE=u.prototype.writeUInt32LE=function(a,s,h){return a=+a,s>>>=0,h||j(this,a,s,4,4294967295,0),this[s+3]=a>>>24,this[s+2]=a>>>16,this[s+1]=a>>>8,this[s]=255&a,s+4},u.prototype.writeUint32BE=u.prototype.writeUInt32BE=function(a,s,h){return a=+a,s>>>=0,h||j(this,a,s,4,4294967295,0),this[s]=a>>>24,this[s+1]=a>>>16,this[s+2]=a>>>8,this[s+3]=255&a,s+4},u.prototype.writeBigUInt64LE=ne(function(a,s=0){return L(this,a,s,BigInt(0),BigInt("0xffffffffffffffff"))}),u.prototype.writeBigUInt64BE=ne(function(a,s=0){return K(this,a,s,BigInt(0),BigInt("0xffffffffffffffff"))}),u.prototype.writeIntLE=function(a,s,h,M){if(a=+a,s>>>=0,!M){let ie=Math.pow(2,8*h-1);j(this,a,s,h,ie-1,-ie)}let T=0,x=1,V=0;for(this[s]=255&a;++T<h&&(x*=256);)a<0&&V===0&&this[s+T-1]!==0&&(V=1),this[s+T]=(a/x>>0)-V&255;return s+h},u.prototype.writeIntBE=function(a,s,h,M){if(a=+a,s>>>=0,!M){let ie=Math.pow(2,8*h-1);j(this,a,s,h,ie-1,-ie)}let T=h-1,x=1,V=0;for(this[s+T]=255&a;--T>=0&&(x*=256);)a<0&&V===0&&this[s+T+1]!==0&&(V=1),this[s+T]=(a/x>>0)-V&255;return s+h},u.prototype.writeInt8=function(a,s,h){return a=+a,s>>>=0,h||j(this,a,s,1,127,-128),a<0&&(a=255+a+1),this[s]=255&a,s+1},u.prototype.writeInt16LE=function(a,s,h){return a=+a,s>>>=0,h||j(this,a,s,2,32767,-32768),this[s]=255&a,this[s+1]=a>>>8,s+2},u.prototype.writeInt16BE=function(a,s,h){return a=+a,s>>>=0,h||j(this,a,s,2,32767,-32768),this[s]=a>>>8,this[s+1]=255&a,s+2},u.prototype.writeInt32LE=function(a,s,h){return a=+a,s>>>=0,h||j(this,a,s,4,2147483647,-2147483648),this[s]=255&a,this[s+1]=a>>>8,this[s+2]=a>>>16,this[s+3]=a>>>24,s+4},u.prototype.writeInt32BE=function(a,s,h){return a=+a,s>>>=0,h||j(this,a,s,4,2147483647,-2147483648),a<0&&(a=4294967295+a+1),this[s]=a>>>24,this[s+1]=a>>>16,this[s+2]=a>>>8,this[s+3]=255&a,s+4},u.prototype.writeBigInt64LE=ne(function(a,s=0){return L(this,a,s,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),u.prototype.writeBigInt64BE=ne(function(a,s=0){return K(this,a,s,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),u.prototype.writeFloatLE=function(a,s,h){return z(this,a,s,!0,h)},u.prototype.writeFloatBE=function(a,s,h){return z(this,a,s,!1,h)},u.prototype.writeDoubleLE=function(a,s,h){return re(this,a,s,!0,h)},u.prototype.writeDoubleBE=function(a,s,h){return re(this,a,s,!1,h)},u.prototype.copy=function(a,s,h,M){if(!u.isBuffer(a))throw new TypeError("argument should be a Buffer");if(h||(h=0),M||M===0||(M=this.length),s>=a.length&&(s=a.length),s||(s=0),M>0&&M<h&&(M=h),M===h||a.length===0||this.length===0)return 0;if(s<0)throw new RangeError("targetStart out of bounds");if(h<0||h>=this.length)throw new RangeError("Index out of range");if(M<0)throw new RangeError("sourceEnd out of bounds");M>this.length&&(M=this.length),a.length-s<M-h&&(M=a.length-s+h);let T=M-h;return this===a&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(s,h,M):Uint8Array.prototype.set.call(a,this.subarray(h,M),s),T},u.prototype.fill=function(a,s,h,M){if(typeof a=="string"){if(typeof s=="string"?(M=s,s=0,h=this.length):typeof h=="string"&&(M=h,h=this.length),M!==void 0&&typeof M!="string")throw new TypeError("encoding must be a string");if(typeof M=="string"&&!u.isEncoding(M))throw new TypeError("Unknown encoding: "+M);if(a.length===1){let x=a.charCodeAt(0);(M==="utf8"&&x<128||M==="latin1")&&(a=x)}}else typeof a=="number"?a&=255:typeof a=="boolean"&&(a=Number(a));if(s<0||this.length<s||this.length<h)throw new RangeError("Out of range index");if(h<=s)return this;let T;if(s>>>=0,h=h===void 0?this.length:h>>>0,a||(a=0),typeof a=="number")for(T=s;T<h;++T)this[T]=a;else{let x=u.isBuffer(a)?a:u.from(a,M),V=x.length;if(V===0)throw new TypeError('The value "'+a+'" is invalid for argument "value"');for(T=0;T<h-s;++T)this[T+s]=x[T%V]}return this};let te={};function ue(a,s,h){te[a]=class extends h{constructor(){super(),Object.defineProperty(this,"message",{value:s.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${a}]`,this.stack,delete this.name}get code(){return a}set code(M){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:M,writable:!0})}toString(){return`${this.name} [${a}]: ${this.message}`}}}function le(a){let s="",h=a.length,M=a[0]==="-"?1:0;for(;h>=M+4;h-=3)s=`_${a.slice(h-3,h)}${s}`;return`${a.slice(0,h)}${s}`}function D(a,s,h,M,T,x){if(a>h||a<s){let V=typeof s=="bigint"?"n":"",ie;throw ie=x>3?s===0||s===BigInt(0)?`>= 0${V} and < 2${V} ** ${8*(x+1)}${V}`:`>= -(2${V} ** ${8*(x+1)-1}${V}) and < 2 ** ${8*(x+1)-1}${V}`:`>= ${s}${V} and <= ${h}${V}`,new te.ERR_OUT_OF_RANGE("value",ie,a)}(function(V,ie,se){E(ie,"offset"),V[ie]!==void 0&&V[ie+se]!==void 0||W(ie,V.length-(se+1))})(M,T,x)}function E(a,s){if(typeof a!="number")throw new te.ERR_INVALID_ARG_TYPE(s,"number",a)}function W(a,s,h){throw Math.floor(a)!==a?(E(a,h),new te.ERR_OUT_OF_RANGE(h||"offset","an integer",a)):s<0?new te.ERR_BUFFER_OUT_OF_BOUNDS:new te.ERR_OUT_OF_RANGE(h||"offset",`>= ${h?1:0} and <= ${s}`,a)}ue("ERR_BUFFER_OUT_OF_BOUNDS",function(a){return a?`${a} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),ue("ERR_INVALID_ARG_TYPE",function(a,s){return`The "${a}" argument must be of type number. Received type ${typeof s}`},TypeError),ue("ERR_OUT_OF_RANGE",function(a,s,h){let M=`The value of "${a}" is out of range.`,T=h;return Number.isInteger(h)&&Math.abs(h)>2**32?T=le(String(h)):typeof h=="bigint"&&(T=String(h),(h>BigInt(2)**BigInt(32)||h<-(BigInt(2)**BigInt(32)))&&(T=le(T)),T+="n"),M+=` It must be ${s}. Received ${T}`,M},RangeError);let X=/[^+/0-9A-Za-z-_]/g;function ve(a,s){let h;s=s||1/0;let M=a.length,T=null,x=[];for(let V=0;V<M;++V){if(h=a.charCodeAt(V),h>55295&&h<57344){if(!T){if(h>56319){(s-=3)>-1&&x.push(239,191,189);continue}if(V+1===M){(s-=3)>-1&&x.push(239,191,189);continue}T=h;continue}if(h<56320){(s-=3)>-1&&x.push(239,191,189),T=h;continue}h=65536+(T-55296<<10|h-56320)}else T&&(s-=3)>-1&&x.push(239,191,189);if(T=null,h<128){if((s-=1)<0)break;x.push(h)}else if(h<2048){if((s-=2)<0)break;x.push(h>>6|192,63&h|128)}else if(h<65536){if((s-=3)<0)break;x.push(h>>12|224,h>>6&63|128,63&h|128)}else{if(!(h<1114112))throw new Error("Invalid code point");if((s-=4)<0)break;x.push(h>>18|240,h>>12&63|128,h>>6&63|128,63&h|128)}}return x}function Oe(a){return o.toByteArray(function(s){if((s=(s=s.split("=")[0]).trim().replace(X,"")).length<2)return"";for(;s.length%4!=0;)s+="=";return s}(a))}function ee(a,s,h,M){let T;for(T=0;T<M&&!(T+h>=s.length||T>=a.length);++T)s[T+h]=a[T];return T}function fe(a,s){return a instanceof s||a!=null&&a.constructor!=null&&a.constructor.name!=null&&a.constructor.name===s.name}function de(a){return a!=a}let Ae=function(){let a="0123456789abcdef",s=new Array(256);for(let h=0;h<16;++h){let M=16*h;for(let T=0;T<16;++T)s[M+T]=a[h]+a[T]}return s}();function ne(a){return typeof BigInt=="undefined"?he:a}function he(){throw new Error("BigInt not supported")}},141:(e,t,n)=>{"use strict";t.Commented=n(20),t.Diagnose=n(694),t.Decoder=n(774),t.Encoder=n(666),t.Simple=n(32),t.Tagged=n(785),t.Map=n(70),t.UI=t.Commented.comment,t.fI=t.Decoder.decodeAll,t.h8=t.Decoder.decodeFirst,t.cc=t.Decoder.decodeAllSync,t.$u=t.Decoder.decodeFirstSync,t.M=t.Diagnose.diagnose,t.cv=t.Encoder.encode,t.N2=t.Encoder.encodeCanonical,t.TG=t.Encoder.encodeOne,t.WR=t.Encoder.encodeAsync,t.Jx=t.Decoder.decodeFirstSync,t.ww={decode:t.Decoder.decodeFirstSync,encode:t.Encoder.encode,buffer:!0,name:"cbor"},t.mc=function(){t.Encoder.reset(),t.Tagged.reset()}},20:(e,t,n)=>{"use strict";let o=n(830),f=n(873),y=n(774),O=n(202),{MT:b,NUMBYTES:u,SYMS:p}=n(66),{Buffer:I}=n(764);function P(w){return w>1?"s":""}class g extends o.Transform{constructor(v={}){let{depth:m=1,max_depth:S=10,no_summary:_=!1,tags:B={},preferWeb:R,encoding:$,...F}=v;super({...F,readableObjectMode:!1,writableObjectMode:!1}),this.depth=m,this.max_depth=S,this.all=new O,B[24]||(B[24]=this._tag_24.bind(this)),this.parser=new y({tags:B,max_depth:S,preferWeb:R,encoding:$}),this.parser.on("value",this._on_value.bind(this)),this.parser.on("start",this._on_start.bind(this)),this.parser.on("start-string",this._on_start_string.bind(this)),this.parser.on("stop",this._on_stop.bind(this)),this.parser.on("more-bytes",this._on_more.bind(this)),this.parser.on("error",this._on_error.bind(this)),_||this.parser.on("data",this._on_data.bind(this)),this.parser.bs.on("read",this._on_read.bind(this))}_tag_24(v){let m=new g({depth:this.depth+1,no_summary:!0});m.on("data",S=>this.push(S)),m.on("error",S=>this.emit("error",S)),m.end(v)}_transform(v,m,S){this.parser.write(v,m,S)}_flush(v){return this.parser._flush(v)}static comment(v,m={},S=null){if(v==null)throw new Error("input required");({options:m,cb:S}=function(C,Y){switch(typeof C){case"function":return{options:{},cb:C};case"string":return{options:{encoding:C},cb:Y};case"number":return{options:{max_depth:C},cb:Y};case"object":return{options:C||{},cb:Y};default:throw new TypeError("Unknown option type")}}(m,S));let _=new O,{encoding:B="hex",...R}=m,$=new g(R),F=null;return typeof S=="function"?($.on("end",()=>{S(null,_.toString("utf8"))}),$.on("error",S)):F=new Promise((C,Y)=>{$.on("end",()=>{C(_.toString("utf8"))}),$.on("error",Y)}),$.pipe(_),f.guessEncoding(v,B).pipe($),F}_on_error(v){this.push("ERROR: "),this.push(v.toString()),this.push(`
`)}_on_read(v){this.all.write(v);let m=v.toString("hex");this.push(new Array(this.depth+1).join("  ")),this.push(m);let S=2*(this.max_depth-this.depth)-m.length;S<1&&(S=1),this.push(new Array(S+1).join(" ")),this.push("-- ")}_on_more(v,m,S,_){let B="";switch(this.depth++,v){case b.POS_INT:B="Positive number,";break;case b.NEG_INT:B="Negative number,";break;case b.ARRAY:B="Array, length";break;case b.MAP:B="Map, count";break;case b.BYTE_STRING:B="Bytes, length";break;case b.UTF8_STRING:B="String, length";break;case b.SIMPLE_FLOAT:B=m===1?"Simple value,":"Float,"}this.push(`${B} next ${m} byte${P(m)}
`)}_on_start_string(v,m,S,_){let B="";switch(this.depth++,v){case b.BYTE_STRING:B=`Bytes, length: ${m}`;break;case b.UTF8_STRING:B=`String, length: ${m.toString()}`}this.push(`${B}
`)}_on_start(v,m,S,_){switch(this.depth++,S){case b.ARRAY:this.push(`[${_}], `);break;case b.MAP:_%2?this.push(`{Val:${Math.floor(_/2)}}, `):this.push(`{Key:${Math.floor(_/2)}}, `)}switch(v){case b.TAG:this.push(`Tag #${m}`),m===24&&this.push(" Encoded CBOR data item");break;case b.ARRAY:m===p.STREAM?this.push("Array (streaming)"):this.push(`Array, ${m} item${P(m)}`);break;case b.MAP:m===p.STREAM?this.push("Map (streaming)"):this.push(`Map, ${m} pair${P(m)}`);break;case b.BYTE_STRING:this.push("Bytes (streaming)");break;case b.UTF8_STRING:this.push("String (streaming)")}this.push(`
`)}_on_stop(v){this.depth--}_on_value(v,m,S,_){if(v!==p.BREAK)switch(m){case b.ARRAY:this.push(`[${S}], `);break;case b.MAP:S%2?this.push(`{Val:${Math.floor(S/2)}}, `):this.push(`{Key:${Math.floor(S/2)}}, `)}let B=f.cborValueToString(v,-1/0);switch(typeof v=="string"||I.isBuffer(v)?(v.length>0&&(this.push(B),this.push(`
`)),this.depth--):(this.push(B),this.push(`
`)),_){case u.ONE:case u.TWO:case u.FOUR:case u.EIGHT:this.depth--}}_on_data(){this.push("0x"),this.push(this.all.read().toString("hex")),this.push(`
`)}}e.exports=g},66:(e,t)=>{"use strict";t.MT={POS_INT:0,NEG_INT:1,BYTE_STRING:2,UTF8_STRING:3,ARRAY:4,MAP:5,TAG:6,SIMPLE_FLOAT:7},t.TAG={DATE_STRING:0,DATE_EPOCH:1,POS_BIGINT:2,NEG_BIGINT:3,DECIMAL_FRAC:4,BIGFLOAT:5,BASE64URL_EXPECTED:21,BASE64_EXPECTED:22,BASE16_EXPECTED:23,CBOR:24,URI:32,BASE64URL:33,BASE64:34,REGEXP:35,MIME:36,SET:258},t.NUMBYTES={ZERO:0,ONE:24,TWO:25,FOUR:26,EIGHT:27,INDEFINITE:31},t.SIMPLE={FALSE:20,TRUE:21,NULL:22,UNDEFINED:23},t.SYMS={NULL:Symbol.for("github.com/hildjj/node-cbor/null"),UNDEFINED:Symbol.for("github.com/hildjj/node-cbor/undef"),PARENT:Symbol.for("github.com/hildjj/node-cbor/parent"),BREAK:Symbol.for("github.com/hildjj/node-cbor/break"),STREAM:Symbol.for("github.com/hildjj/node-cbor/stream")},t.SHIFT32=4294967296,t.BI={MINUS_ONE:BigInt(-1),NEG_MAX:BigInt(-1)-BigInt(Number.MAX_SAFE_INTEGER),MAXINT32:BigInt("0xffffffff"),MAXINT64:BigInt("0xffffffffffffffff"),SHIFT32:BigInt(t.SHIFT32)}},774:(e,t,n)=>{"use strict";let o=n(71),f=n(785),y=n(32),O=n(873),b=n(202),u=(n(830),n(66)),{MT:p,NUMBYTES:I,SYMS:P,BI:g}=u,{Buffer:w}=n(764),v=Symbol("count"),m=Symbol("major type"),S=Symbol("error"),_=Symbol("not found");function B(Y,N,H){let J=[];return J[v]=H,J[P.PARENT]=Y,J[m]=N,J}function R(Y,N){let H=new b;return H[v]=-1,H[P.PARENT]=Y,H[m]=N,H}class $ extends Error{constructor(N,H){super(`Unexpected data: 0x${N.toString(16)}`),this.name="UnexpectedDataError",this.byte=N,this.value=H}}function F(Y,N){switch(typeof Y){case"function":return{options:{},cb:Y};case"string":return{options:{encoding:Y},cb:N};case"object":return{options:Y||{},cb:N};default:throw new TypeError("Unknown option type")}}class C extends o{constructor(N={}){let{tags:H={},max_depth:J=-1,preferWeb:ce=!1,required:Q=!1,encoding:q="hex",extendedResults:oe=!1,preventDuplicateKeys:k=!1,...A}=N;super({defaultEncoding:q,...A}),this.running=!0,this.max_depth=J,this.tags=H,this.preferWeb=ce,this.extendedResults=oe,this.required=Q,this.preventDuplicateKeys=k,oe&&(this.bs.on("read",this._onRead.bind(this)),this.valueBytes=new b)}static nullcheck(N){switch(N){case P.NULL:return null;case P.UNDEFINED:return;case _:throw new Error("Value not found");default:return N}}static decodeFirstSync(N,H={}){if(N==null)throw new TypeError("input required");({options:H}=F(H));let{encoding:J="hex",...ce}=H,Q=new C(ce),q=O.guessEncoding(N,J),oe=Q._parse(),k=oe.next();for(;!k.done;){let j=q.read(k.value);if(j==null||j.length!==k.value)throw new Error("Insufficient data");Q.extendedResults&&Q.valueBytes.write(j),k=oe.next(j)}let A=null;if(Q.extendedResults)A=k.value,A.unused=q.read();else if(A=C.nullcheck(k.value),q.length>0){let j=q.read(1);throw q.unshift(j),new $(j[0],A)}return A}static decodeAllSync(N,H={}){if(N==null)throw new TypeError("input required");({options:H}=F(H));let{encoding:J="hex",...ce}=H,Q=new C(ce),q=O.guessEncoding(N,J),oe=[];for(;q.length>0;){let k=Q._parse(),A=k.next();for(;!A.done;){let j=q.read(A.value);if(j==null||j.length!==A.value)throw new Error("Insufficient data");Q.extendedResults&&Q.valueBytes.write(j),A=k.next(j)}oe.push(C.nullcheck(A.value))}return oe}static decodeFirst(N,H={},J=null){if(N==null)throw new TypeError("input required");({options:H,cb:J}=F(H,J));let{encoding:ce="hex",required:Q=!1,...q}=H,oe=new C(q),k=_,A=O.guessEncoding(N,ce),j=new Promise((L,K)=>{oe.on("data",G=>{k=C.nullcheck(G),oe.close()}),oe.once("error",G=>oe.extendedResults&&G instanceof $?(k.unused=oe.bs.slice(),L(k)):(k!==_&&(G.value=k),k=S,oe.close(),K(G))),oe.once("end",()=>{switch(k){case _:return Q?K(new Error("No CBOR found")):L(k);case S:return;default:return L(k)}})});return typeof J=="function"&&j.then(L=>J(null,L),J),A.pipe(oe),j}static decodeAll(N,H={},J=null){if(N==null)throw new TypeError("input required");({options:H,cb:J}=F(H,J));let{encoding:ce="hex",...Q}=H,q=new C(Q),oe=[];q.on("data",A=>oe.push(C.nullcheck(A)));let k=new Promise((A,j)=>{q.on("error",j),q.on("end",()=>A(oe))});return typeof J=="function"&&k.then(A=>J(void 0,A),A=>J(A,void 0)),O.guessEncoding(N,ce).pipe(q),k}close(){this.running=!1,this.__fresh=!0}_onRead(N){this.valueBytes.write(N)}*_parse(){let N=null,H=0,J=null;for(;;){if(this.max_depth>=0&&H>this.max_depth)throw new Error(`Maximum depth ${this.max_depth} exceeded`);let[ce]=yield 1;if(!this.running)throw this.bs.unshift(w.from([ce])),new $(ce);let Q=ce>>5,q=31&ce,oe=N==null?void 0:N[m],k=N==null?void 0:N.length;switch(q){case I.ONE:this.emit("more-bytes",Q,1,oe,k),[J]=yield 1;break;case I.TWO:case I.FOUR:case I.EIGHT:{let j=1<<q-24;this.emit("more-bytes",Q,j,oe,k);let L=yield j;J=Q===p.SIMPLE_FLOAT?L:O.parseCBORint(q,L);break}case 28:case 29:case 30:throw this.running=!1,new Error(`Additional info not implemented: ${q}`);case I.INDEFINITE:switch(Q){case p.POS_INT:case p.NEG_INT:case p.TAG:throw new Error(`Invalid indefinite encoding for MT ${Q}`)}J=-1;break;default:J=q}switch(Q){case p.POS_INT:break;case p.NEG_INT:J=J===Number.MAX_SAFE_INTEGER?g.NEG_MAX:typeof J=="bigint"?g.MINUS_ONE-J:-1-J;break;case p.BYTE_STRING:case p.UTF8_STRING:switch(J){case 0:this.emit("start-string",Q,J,oe,k),J=Q===p.UTF8_STRING?"":this.preferWeb?new Uint8Array(0):w.allocUnsafe(0);break;case-1:this.emit("start",Q,P.STREAM,oe,k),N=R(N,Q),H++;continue;default:this.emit("start-string",Q,J,oe,k),J=yield J,Q===p.UTF8_STRING?J=O.utf8(J):this.preferWeb&&(J=new Uint8Array(J.buffer,J.byteOffset,J.length))}break;case p.ARRAY:case p.MAP:switch(J){case 0:J=Q===p.MAP?{}:[];break;case-1:this.emit("start",Q,P.STREAM,oe,k),N=B(N,Q,-1),H++;continue;default:this.emit("start",Q,J,oe,k),N=B(N,Q,J*(Q-3)),H++;continue}break;case p.TAG:this.emit("start",Q,J,oe,k),N=B(N,Q,1),N.push(J),H++;continue;case p.SIMPLE_FLOAT:if(typeof J=="number"){if(q===I.ONE&&J<32)throw new Error(`Invalid two-byte encoding of simple value ${J}`);let j=N!=null;J=y.decode(J,j,j&&N[v]<0)}else J=O.parseCBORfloat(J)}this.emit("value",J,oe,k,q);let A=!1;for(;N!=null;){if(J===P.BREAK)N[v]=1;else if(Array.isArray(N))N.push(J);else{let L=N[m];if(L!=null&&L!==Q)throw this.running=!1,new Error("Invalid major type in indefinite encoding");N.write(J)}if(--N[v]!=0){A=!0;break}if(--H,delete N[v],Array.isArray(N))switch(N[m]){case p.ARRAY:J=N;break;case p.MAP:{let L=!0;if(N.length%2!=0)throw new Error(`Invalid map length: ${N.length}`);for(let K=0,G=N.length;K<G;K+=2)if(typeof N[K]!="string"||N[K]==="__proto__"){L=!1;break}if(L){J={};for(let K=0,G=N.length;K<G;K+=2){if(this.preventDuplicateKeys&&Object.prototype.hasOwnProperty.call(J,N[K]))throw new Error("Duplicate keys in a map");J[N[K]]=N[K+1]}}else{J=new Map;for(let K=0,G=N.length;K<G;K+=2){if(this.preventDuplicateKeys&&J.has(N[K]))throw new Error("Duplicate keys in a map");J.set(N[K],N[K+1])}}break}case p.TAG:J=new f(N[0],N[1]).convert(this.tags)}else if(N instanceof b)switch(N[m]){case p.BYTE_STRING:J=N.slice(),this.preferWeb&&(J=new Uint8Array(J.buffer,J.byteOffset,J.length));break;case p.UTF8_STRING:J=N.toString("utf-8")}this.emit("stop",N[m]);let j=N;N=N[P.PARENT],delete j[P.PARENT],delete j[m]}if(!A){if(this.extendedResults){let j=this.valueBytes.slice(),L={value:C.nullcheck(J),bytes:j,length:j.length};return this.valueBytes=new b,L}return J}}}}C.NOT_FOUND=_,e.exports=C},694:(e,t,n)=>{"use strict";let o=n(830),f=n(774),y=n(873),O=n(202),{MT:b,SYMS:u}=n(66);class p extends o.Transform{constructor(P={}){let{separator:g=`
`,stream_errors:w=!1,tags:v,max_depth:m,preferWeb:S,encoding:_,...B}=P;super({...B,readableObjectMode:!1,writableObjectMode:!1}),this.float_bytes=-1,this.separator=g,this.stream_errors=w,this.parser=new f({tags:v,max_depth:m,preferWeb:S,encoding:_}),this.parser.on("more-bytes",this._on_more.bind(this)),this.parser.on("value",this._on_value.bind(this)),this.parser.on("start",this._on_start.bind(this)),this.parser.on("stop",this._on_stop.bind(this)),this.parser.on("data",this._on_data.bind(this)),this.parser.on("error",this._on_error.bind(this))}_transform(P,g,w){return this.parser.write(P,g,w)}_flush(P){return this.parser._flush(g=>this.stream_errors?(g&&this._on_error(g),P()):P(g))}static diagnose(P,g={},w=null){if(P==null)throw new TypeError("input required");({options:g,cb:w}=function(R,$){switch(typeof R){case"function":return{options:{},cb:R};case"string":return{options:{encoding:R},cb:$};case"object":return{options:R||{},cb:$};default:throw new TypeError("Unknown option type")}}(g,w));let{encoding:v="hex",...m}=g,S=new O,_=new p(m),B=null;return typeof w=="function"?(_.on("end",()=>w(null,S.toString("utf8"))),_.on("error",w)):B=new Promise((R,$)=>{_.on("end",()=>R(S.toString("utf8"))),_.on("error",$)}),_.pipe(S),y.guessEncoding(P,v).pipe(_),B}_on_error(P){this.stream_errors?this.push(P.toString()):this.emit("error",P)}_on_more(P,g,w,v){P===b.SIMPLE_FLOAT&&(this.float_bytes={2:1,4:2,8:3}[g])}_fore(P,g){switch(P){case b.BYTE_STRING:case b.UTF8_STRING:case b.ARRAY:g>0&&this.push(", ");break;case b.MAP:g>0&&(g%2?this.push(": "):this.push(", "))}}_on_value(P,g,w){if(P===u.BREAK)return;this._fore(g,w);let v=this.float_bytes;this.float_bytes=-1,this.push(y.cborValueToString(P,v))}_on_start(P,g,w,v){switch(this._fore(w,v),P){case b.TAG:this.push(`${g}(`);break;case b.ARRAY:this.push("[");break;case b.MAP:this.push("{");break;case b.BYTE_STRING:case b.UTF8_STRING:this.push("(")}g===u.STREAM&&this.push("_ ")}_on_stop(P){switch(P){case b.TAG:this.push(")");break;case b.ARRAY:this.push("]");break;case b.MAP:this.push("}");break;case b.BYTE_STRING:case b.UTF8_STRING:this.push(")")}}_on_data(){this.push(this.separator)}}e.exports=p},666:(e,t,n)=>{"use strict";let o=n(830),f=n(202),y=n(873),O=n(66),{MT:b,NUMBYTES:u,SHIFT32:p,SIMPLE:I,SYMS:P,TAG:g,BI:w}=O,{Buffer:v}=n(764),m=b.SIMPLE_FLOAT<<5|u.TWO,S=b.SIMPLE_FLOAT<<5|u.FOUR,_=b.SIMPLE_FLOAT<<5|u.EIGHT,B=b.SIMPLE_FLOAT<<5|I.TRUE,R=b.SIMPLE_FLOAT<<5|I.FALSE,$=b.SIMPLE_FLOAT<<5|I.UNDEFINED,F=b.SIMPLE_FLOAT<<5|I.NULL,C=v.from([255]),Y=v.from("f97e00","hex"),N=v.from("f9fc00","hex"),H=v.from("f97c00","hex"),J=v.from("f98000","hex"),ce={},Q={};class q extends o.Transform{constructor(k={}){let{canonical:A=!1,encodeUndefined:j,disallowUndefinedKeys:L=!1,dateType:K="number",collapseBigIntegers:G=!1,detectLoops:z=!1,omitUndefinedProperties:re=!1,genTypes:te=[],...ue}=k;if(super({...ue,readableObjectMode:!1,writableObjectMode:!0}),this.canonical=A,this.encodeUndefined=j,this.disallowUndefinedKeys=L,this.dateType=function(le){if(!le)return"number";switch(le.toLowerCase()){case"number":return"number";case"float":return"float";case"int":case"integer":return"int";case"string":return"string"}throw new TypeError(`dateType invalid, got "${le}"`)}(K),this.collapseBigIntegers=!!this.canonical||G,this.detectLoops=void 0,typeof z=="boolean")z&&(this.detectLoops=new WeakSet);else{if(!(z instanceof WeakSet))throw new TypeError("detectLoops must be boolean or WeakSet");this.detectLoops=z}if(this.omitUndefinedProperties=re,this.semanticTypes={...q.SEMANTIC_TYPES},Array.isArray(te))for(let le=0,D=te.length;le<D;le+=2)this.addSemanticType(te[le],te[le+1]);else for(let[le,D]of Object.entries(te))this.addSemanticType(le,D)}_transform(k,A,j){return j(this.pushAny(k)===!1?new Error("Push Error"):void 0)}_flush(k){return k()}_pushUInt8(k){let A=v.allocUnsafe(1);return A.writeUInt8(k,0),this.push(A)}_pushUInt16BE(k){let A=v.allocUnsafe(2);return A.writeUInt16BE(k,0),this.push(A)}_pushUInt32BE(k){let A=v.allocUnsafe(4);return A.writeUInt32BE(k,0),this.push(A)}_pushFloatBE(k){let A=v.allocUnsafe(4);return A.writeFloatBE(k,0),this.push(A)}_pushDoubleBE(k){let A=v.allocUnsafe(8);return A.writeDoubleBE(k,0),this.push(A)}_pushNaN(){return this.push(Y)}_pushInfinity(k){let A=k<0?N:H;return this.push(A)}_pushFloat(k){if(this.canonical){let A=v.allocUnsafe(2);if(y.writeHalf(A,k))return this._pushUInt8(m)&&this.push(A)}return Math.fround(k)===k?this._pushUInt8(S)&&this._pushFloatBE(k):this._pushUInt8(_)&&this._pushDoubleBE(k)}_pushInt(k,A,j){let L=A<<5;if(k<24)return this._pushUInt8(L|k);if(k<=255)return this._pushUInt8(L|u.ONE)&&this._pushUInt8(k);if(k<=65535)return this._pushUInt8(L|u.TWO)&&this._pushUInt16BE(k);if(k<=4294967295)return this._pushUInt8(L|u.FOUR)&&this._pushUInt32BE(k);let K=Number.MAX_SAFE_INTEGER;return A===b.NEG_INT&&K--,k<=K?this._pushUInt8(L|u.EIGHT)&&this._pushUInt32BE(Math.floor(k/p))&&this._pushUInt32BE(k%p):A===b.NEG_INT?this._pushFloat(j):this._pushFloat(k)}_pushIntNum(k){return Object.is(k,-0)?this.push(J):k<0?this._pushInt(-k-1,b.NEG_INT,k):this._pushInt(k,b.POS_INT)}_pushNumber(k){return isNaN(k)?this._pushNaN():isFinite(k)?Math.round(k)===k?this._pushIntNum(k):this._pushFloat(k):this._pushInfinity(k)}_pushString(k){let A=v.byteLength(k,"utf8");return this._pushInt(A,b.UTF8_STRING)&&this.push(k,"utf8")}_pushBoolean(k){return this._pushUInt8(k?B:R)}_pushUndefined(k){switch(typeof this.encodeUndefined){case"undefined":return this._pushUInt8($);case"function":return this.pushAny(this.encodeUndefined(k));case"object":{let A=y.bufferishToBuffer(this.encodeUndefined);if(A)return this.push(A)}}return this.pushAny(this.encodeUndefined)}_pushNull(k){return this._pushUInt8(F)}_pushTag(k){return this._pushInt(k,b.TAG)}_pushJSBigint(k){let A=b.POS_INT,j=g.POS_BIGINT;if(k<0&&(k=-k+w.MINUS_ONE,A=b.NEG_INT,j=g.NEG_BIGINT),this.collapseBigIntegers&&k<=w.MAXINT64)return k<=4294967295?this._pushInt(Number(k),A):this._pushUInt8(A<<5|u.EIGHT)&&this._pushUInt32BE(Number(k/w.SHIFT32))&&this._pushUInt32BE(Number(k%w.SHIFT32));let L=k.toString(16);L.length%2&&(L=`0${L}`);let K=v.from(L,"hex");return this._pushTag(j)&&q._pushBuffer(this,K)}_pushObject(k,A){if(!k)return this._pushNull(k);if(!(A={indefinite:!1,skipTypes:!1,...A}).indefinite&&this.detectLoops){if(this.detectLoops.has(k))throw new Error(`Loop detected while CBOR encoding.
Call removeLoopDetectors before resuming.`);this.detectLoops.add(k)}if(!A.skipTypes){let G=k.encodeCBOR;if(typeof G=="function")return G.call(k,this);let z=this.semanticTypes[k.constructor.name];if(z)return z.call(k,this,k)}let j=Object.keys(k).filter(G=>{let z=typeof k[G];return z!=="function"&&(!this.omitUndefinedProperties||z!=="undefined")}),L={};if(this.canonical&&j.sort((G,z)=>{let re=L[G]||(L[G]=q.encode(G)),te=L[z]||(L[z]=q.encode(z));return re.compare(te)}),A.indefinite){if(!this._pushUInt8(b.MAP<<5|u.INDEFINITE))return!1}else if(!this._pushInt(j.length,b.MAP))return!1;let K=null;for(let G=0,z=j.length;G<z;G++){let re=j[G];if(this.canonical&&(K=L[re])){if(!this.push(K))return!1}else if(!this._pushString(re))return!1;if(!this.pushAny(k[re]))return!1}if(A.indefinite){if(!this.push(C))return!1}else this.detectLoops&&this.detectLoops.delete(k);return!0}_encodeAll(k){let A=new f({highWaterMark:this.readableHighWaterMark});this.pipe(A);for(let j of k)this.pushAny(j);return this.end(),A.read()}addSemanticType(k,A){let j=typeof k=="string"?k:k.name,L=this.semanticTypes[j];if(A){if(typeof A!="function")throw new TypeError("fun must be of type function");this.semanticTypes[j]=A}else L&&delete this.semanticTypes[j];return L}pushAny(k){switch(typeof k){case"number":return this._pushNumber(k);case"bigint":return this._pushJSBigint(k);case"string":return this._pushString(k);case"boolean":return this._pushBoolean(k);case"undefined":return this._pushUndefined(k);case"object":return this._pushObject(k);case"symbol":switch(k){case P.NULL:return this._pushNull(null);case P.UNDEFINED:return this._pushUndefined(void 0);default:throw new TypeError(`Unknown symbol: ${k.toString()}`)}default:throw new TypeError(`Unknown type: ${typeof k}, ${typeof k.toString=="function"?k.toString():""}`)}}static pushArray(k,A,j){j={indefinite:!1,...j};let L=A.length;if(j.indefinite){if(!k._pushUInt8(b.ARRAY<<5|u.INDEFINITE))return!1}else if(!k._pushInt(L,b.ARRAY))return!1;for(let K=0;K<L;K++)if(!k.pushAny(A[K]))return!1;return!(j.indefinite&&!k.push(C))}removeLoopDetectors(){return!!this.detectLoops&&(this.detectLoops=new WeakSet,!0)}static _pushDate(k,A){switch(k.dateType){case"string":return k._pushTag(g.DATE_STRING)&&k._pushString(A.toISOString());case"int":return k._pushTag(g.DATE_EPOCH)&&k._pushIntNum(Math.round(A.getTime()/1e3));case"float":return k._pushTag(g.DATE_EPOCH)&&k._pushFloat(A.getTime()/1e3);default:return k._pushTag(g.DATE_EPOCH)&&k.pushAny(A.getTime()/1e3)}}static _pushBuffer(k,A){return k._pushInt(A.length,b.BYTE_STRING)&&k.push(A)}static _pushNoFilter(k,A){return q._pushBuffer(k,A.slice())}static _pushRegexp(k,A){return k._pushTag(g.REGEXP)&&k.pushAny(A.source)}static _pushSet(k,A){if(!k._pushTag(g.SET)||!k._pushInt(A.size,b.ARRAY))return!1;for(let j of A)if(!k.pushAny(j))return!1;return!0}static _pushURL(k,A){return k._pushTag(g.URI)&&k.pushAny(A.toString())}static _pushBoxed(k,A){return k.pushAny(A.valueOf())}static _pushMap(k,A,j){j={indefinite:!1,...j};let L=[...A.entries()];if(k.omitUndefinedProperties&&(L=L.filter(([K,G])=>G!==void 0)),j.indefinite){if(!k._pushUInt8(b.MAP<<5|u.INDEFINITE))return!1}else if(!k._pushInt(L.length,b.MAP))return!1;if(k.canonical){let K=new q({genTypes:k.semanticTypes,canonical:k.canonical,detectLoops:Boolean(k.detectLoops),dateType:k.dateType,disallowUndefinedKeys:k.disallowUndefinedKeys,collapseBigIntegers:k.collapseBigIntegers}),G=new f({highWaterMark:k.readableHighWaterMark});K.pipe(G),L.sort(([z],[re])=>{K.pushAny(z);let te=G.read();K.pushAny(re);let ue=G.read();return te.compare(ue)});for(let[z,re]of L){if(k.disallowUndefinedKeys&&z===void 0)throw new Error("Invalid Map key: undefined");if(!k.pushAny(z)||!k.pushAny(re))return!1}}else for(let[K,G]of L){if(k.disallowUndefinedKeys&&K===void 0)throw new Error("Invalid Map key: undefined");if(!k.pushAny(K)||!k.pushAny(G))return!1}return!(j.indefinite&&!k.push(C))}static _pushTypedArray(k,A){let j=64,L=A.BYTES_PER_ELEMENT,{name:K}=A.constructor;return K.startsWith("Float")?(j|=16,L/=2):K.includes("U")||(j|=8),(K.includes("Clamped")||L!==1&&!y.isBigEndian())&&(j|=4),j|={1:0,2:1,4:2,8:3}[L],!!k._pushTag(j)&&q._pushBuffer(k,v.from(A.buffer,A.byteOffset,A.byteLength))}static _pushArrayBuffer(k,A){return q._pushBuffer(k,v.from(A))}static encodeIndefinite(k,A,j={}){if(A==null){if(this==null)throw new Error("No object to encode");A=this}let{chunkSize:L=4096}=j,K=!0,G=typeof A,z=null;if(G==="string"){K=K&&k._pushUInt8(b.UTF8_STRING<<5|u.INDEFINITE);let re=0;for(;re<A.length;){let te=re+L;K=K&&k._pushString(A.slice(re,te)),re=te}K=K&&k.push(C)}else if(z=y.bufferishToBuffer(A)){K=K&&k._pushUInt8(b.BYTE_STRING<<5|u.INDEFINITE);let re=0;for(;re<z.length;){let te=re+L;K=K&&q._pushBuffer(k,z.slice(re,te)),re=te}K=K&&k.push(C)}else if(Array.isArray(A))K=K&&q.pushArray(k,A,{indefinite:!0});else if(A instanceof Map)K=K&&q._pushMap(k,A,{indefinite:!0});else{if(G!=="object")throw new Error("Invalid indefinite encoding");K=K&&k._pushObject(A,{indefinite:!0,skipTypes:!0})}return K}static encode(...k){return new q()._encodeAll(k)}static encodeCanonical(...k){return new q({canonical:!0})._encodeAll(k)}static encodeOne(k,A){return new q(A)._encodeAll([k])}static encodeAsync(k,A){return new Promise((j,L)=>{let K=[],G=new q(A);G.on("data",z=>K.push(z)),G.on("error",L),G.on("finish",()=>j(v.concat(K))),G.pushAny(k),G.end()})}static get SEMANTIC_TYPES(){return Q}static set SEMANTIC_TYPES(k){Q=k}static reset(){q.SEMANTIC_TYPES={...ce}}}Object.assign(ce,{Array:q.pushArray,Date:q._pushDate,Buffer:q._pushBuffer,[v.name]:q._pushBuffer,Map:q._pushMap,NoFilter:q._pushNoFilter,[f.name]:q._pushNoFilter,RegExp:q._pushRegexp,Set:q._pushSet,ArrayBuffer:q._pushArrayBuffer,Uint8ClampedArray:q._pushTypedArray,Uint8Array:q._pushTypedArray,Uint16Array:q._pushTypedArray,Uint32Array:q._pushTypedArray,Int8Array:q._pushTypedArray,Int16Array:q._pushTypedArray,Int32Array:q._pushTypedArray,Float32Array:q._pushTypedArray,Float64Array:q._pushTypedArray,URL:q._pushURL,Boolean:q._pushBoxed,Number:q._pushBoxed,String:q._pushBoxed}),typeof BigUint64Array!="undefined"&&(ce[BigUint64Array.name]=q._pushTypedArray),typeof BigInt64Array!="undefined"&&(ce[BigInt64Array.name]=q._pushTypedArray),q.reset(),e.exports=q},70:(e,t,n)=>{"use strict";let{Buffer:o}=n(764),f=n(666),y=n(774),{MT:O}=n(66);class b extends Map{constructor(p){super(p)}static _encode(p){return f.encodeCanonical(p).toString("base64")}static _decode(p){return y.decodeFirstSync(p,"base64")}get(p){return super.get(b._encode(p))}set(p,I){return super.set(b._encode(p),I)}delete(p){return super.delete(b._encode(p))}has(p){return super.has(b._encode(p))}*keys(){for(let p of super.keys())yield b._decode(p)}*entries(){for(let p of super.entries())yield[b._decode(p[0]),p[1]]}[Symbol.iterator](){return this.entries()}forEach(p,I){if(typeof p!="function")throw new TypeError("Must be function");for(let P of super.entries())p.call(this,P[1],b._decode(P[0]),this)}encodeCBOR(p){if(!p._pushInt(this.size,O.MAP))return!1;if(p.canonical){let I=Array.from(super.entries()).map(P=>[o.from(P[0],"base64"),P[1]]);I.sort((P,g)=>P[0].compare(g[0]));for(let P of I)if(!p.push(P[0])||!p.pushAny(P[1]))return!1}else for(let I of super.entries())if(!p.push(o.from(I[0],"base64"))||!p.pushAny(I[1]))return!1;return!0}}e.exports=b},32:(e,t,n)=>{"use strict";let{MT:o,SIMPLE:f,SYMS:y}=n(66);class O{constructor(u){if(typeof u!="number")throw new Error("Invalid Simple type: "+typeof u);if(u<0||u>255||(0|u)!==u)throw new Error(`value must be a small positive integer: ${u}`);this.value=u}toString(){return`simple(${this.value})`}[Symbol.for("nodejs.util.inspect.custom")](u,p){return`simple(${this.value})`}encodeCBOR(u){return u._pushInt(this.value,o.SIMPLE_FLOAT)}static isSimple(u){return u instanceof O}static decode(u,p=!0,I=!1){switch(u){case f.FALSE:return!1;case f.TRUE:return!0;case f.NULL:return p?null:y.NULL;case f.UNDEFINED:return p?void 0:y.UNDEFINED;case-1:if(!p||!I)throw new Error("Invalid BREAK");return y.BREAK;default:return new O(u)}}}e.exports=O},785:(e,t,n)=>{"use strict";let o=n(66),f=n(873),y=Symbol("INTERNAL_JSON");function O(m,S){if(f.isBufferish(m))m.toJSON=S;else if(Array.isArray(m))for(let _ of m)O(_,S);else if(m&&typeof m=="object"&&(!(m instanceof v)||m.tag<21||m.tag>23))for(let _ of Object.values(m))O(_,S)}function b(){return f.base64(this)}function u(){return f.base64url(this)}function p(){return this.toString("hex")}let I={0:m=>new Date(m),1:m=>new Date(1e3*m),2:m=>f.bufferToBigInt(m),3:m=>o.BI.MINUS_ONE-f.bufferToBigInt(m),21:(m,S)=>(f.isBufferish(m)?S[y]=u:O(m,u),S),22:(m,S)=>(f.isBufferish(m)?S[y]=b:O(m,b),S),23:(m,S)=>(f.isBufferish(m)?S[y]=p:O(m,p),S),32:m=>new URL(m),33:(m,S)=>{if(!m.match(/^[a-zA-Z0-9_-]+$/))throw new Error("Invalid base64url characters");let _=m.length%4;if(_===1)throw new Error("Invalid base64url length");if(_===2){if("AQgw".indexOf(m[m.length-1])===-1)throw new Error("Invalid base64 padding")}else if(_===3&&"AEIMQUYcgkosw048".indexOf(m[m.length-1])===-1)throw new Error("Invalid base64 padding");return S},34:(m,S)=>{let _=m.match(/^[a-zA-Z0-9+/]+(?<padding>={0,2})$/);if(!_)throw new Error("Invalid base64 characters");if(m.length%4!=0)throw new Error("Invalid base64 length");if(_.groups.padding==="="){if("AQgw".indexOf(m[m.length-2])===-1)throw new Error("Invalid base64 padding")}else if(_.groups.padding==="=="&&"AEIMQUYcgkosw048".indexOf(m[m.length-3])===-1)throw new Error("Invalid base64 padding");return S},35:m=>new RegExp(m),258:m=>new Set(m)},P={64:Uint8Array,65:Uint16Array,66:Uint32Array,68:Uint8ClampedArray,69:Uint16Array,70:Uint32Array,72:Int8Array,73:Int16Array,74:Int32Array,77:Int16Array,78:Int32Array,81:Float32Array,82:Float64Array,85:Float32Array,86:Float64Array};function g(m,S){if(!f.isBufferish(m))throw new TypeError("val not a buffer");let{tag:_}=S,B=P[_];if(!B)throw new Error(`Invalid typed array tag: ${_}`);let R=2**(((16&_)>>4)+(3&_));return!(4&_)!==f.isBigEndian()&&R>1&&function($,F,C,Y){let N=new DataView($),[H,J]={2:[N.getUint16,N.setUint16],4:[N.getUint32,N.setUint32],8:[N.getBigUint64,N.setBigUint64]}[F],ce=C+Y;for(let Q=C;Q<ce;Q+=F)J.call(N,Q,H.call(N,Q,!0))}(m.buffer,R,m.byteOffset,m.byteLength),new B(m.buffer.slice(m.byteOffset,m.byteOffset+m.byteLength))}typeof BigUint64Array!="undefined"&&(P[67]=BigUint64Array,P[71]=BigUint64Array),typeof BigInt64Array!="undefined"&&(P[75]=BigInt64Array,P[79]=BigInt64Array);for(let m of Object.keys(P))I[m]=g;let w={};class v{constructor(S,_,B){if(this.tag=S,this.value=_,this.err=B,typeof this.tag!="number")throw new Error(`Invalid tag type (${typeof this.tag})`);if(this.tag<0||(0|this.tag)!==this.tag)throw new Error(`Tag must be a positive integer: ${this.tag}`)}toJSON(){if(this[y])return this[y].call(this.value);let S={tag:this.tag,value:this.value};return this.err&&(S.err=this.err),S}toString(){return`${this.tag}(${JSON.stringify(this.value)})`}encodeCBOR(S){return S._pushTag(this.tag),S.pushAny(this.value)}convert(S){let _=S==null?void 0:S[this.tag];if(typeof _!="function"&&(_=v.TAGS[this.tag],typeof _!="function"))return this;try{return _.call(this,this.value,this)}catch(B){return B&&B.message&&B.message.length>0?this.err=B.message:this.err=B,this}}static get TAGS(){return w}static set TAGS(S){w=S}static reset(){v.TAGS={...I}}}v.INTERNAL_JSON=y,v.reset(),e.exports=v},873:(e,t,n)=>{"use strict";let{Buffer:o}=n(764),f=n(202),y=n(830),O=n(66),{NUMBYTES:b,SHIFT32:u,BI:p,SYMS:I}=O,P=new TextDecoder("utf8",{fatal:!0,ignoreBOM:!0});t.utf8=w=>P.decode(w),t.utf8.checksUTF8=!0,t.isBufferish=function(w){return w&&typeof w=="object"&&(o.isBuffer(w)||w instanceof Uint8Array||w instanceof Uint8ClampedArray||w instanceof ArrayBuffer||w instanceof DataView)},t.bufferishToBuffer=function(w){return o.isBuffer(w)?w:ArrayBuffer.isView(w)?o.from(w.buffer,w.byteOffset,w.byteLength):w instanceof ArrayBuffer?o.from(w):null},t.parseCBORint=function(w,v){switch(w){case b.ONE:return v.readUInt8(0);case b.TWO:return v.readUInt16BE(0);case b.FOUR:return v.readUInt32BE(0);case b.EIGHT:{let m=v.readUInt32BE(0),S=v.readUInt32BE(4);return m>2097151?BigInt(m)*p.SHIFT32+BigInt(S):m*u+S}default:throw new Error(`Invalid additional info for int: ${w}`)}},t.writeHalf=function(w,v){let m=o.allocUnsafe(4);m.writeFloatBE(v,0);let S=m.readUInt32BE(0);if((8191&S)!=0)return!1;let _=S>>16&32768,B=S>>23&255,R=8388607&S;if(B>=113&&B<=142)_+=(B-112<<10)+(R>>13);else{if(!(B>=103&&B<113)||R&(1<<126-B)-1)return!1;_+=R+8388608>>126-B}return w.writeUInt16BE(_),!0},t.parseHalf=function(w){let v=128&w[0]?-1:1,m=(124&w[0])>>2,S=(3&w[0])<<8|w[1];return m?m===31?v*(S?NaN:1/0):v*2**(m-25)*(1024+S):5960464477539063e-23*v*S},t.parseCBORfloat=function(w){switch(w.length){case 2:return t.parseHalf(w);case 4:return w.readFloatBE(0);case 8:return w.readDoubleBE(0);default:throw new Error(`Invalid float size: ${w.length}`)}},t.hex=function(w){return o.from(w.replace(/^0x/,""),"hex")},t.bin=function(w){let v=0,m=(w=w.replace(/\s/g,"")).length%8||8,S=[];for(;m<=w.length;)S.push(parseInt(w.slice(v,m),2)),v=m,m+=8;return o.from(S)},t.arrayEqual=function(w,v){return w==null&&v==null||w!=null&&v!=null&&w.length===v.length&&w.every((m,S)=>m===v[S])},t.bufferToBigInt=function(w){return BigInt(`0x${w.toString("hex")}`)},t.cborValueToString=function(w,v=-1){switch(typeof w){case"symbol":{switch(w){case I.NULL:return"null";case I.UNDEFINED:return"undefined";case I.BREAK:return"BREAK"}if(w.description)return w.description;let m=w.toString().match(/^Symbol\((?<name>.*)\)/);return m&&m.groups.name?m.groups.name:"Symbol"}case"string":return JSON.stringify(w);case"bigint":return w.toString();case"number":{let m=Object.is(w,-0)?"-0":String(w);return v>0?`${m}_${v}`:m}case"object":{let m=t.bufferishToBuffer(w);if(m){let S=m.toString("hex");return v===-1/0?S:`h'${S}'`}return typeof w[Symbol.for("nodejs.util.inspect.custom")]=="function"?w[Symbol.for("nodejs.util.inspect.custom")]():Array.isArray(w)?"[]":"{}"}}return String(w)},t.guessEncoding=function(w,v){if(typeof w=="string")return new f(w,v??"hex");let m=t.bufferishToBuffer(w);if(m)return new f(m);if((S=w)instanceof y.Readable||["read","on","pipe"].every(_=>typeof S[_]=="function"))return w;var S;throw new Error("Unknown input type")};let g={"=":"","+":"-","/":"_"};t.base64url=function(w){return t.bufferishToBuffer(w).toString("base64").replace(/[=+/]/g,v=>g[v])},t.base64=function(w){return t.bufferishToBuffer(w).toString("base64")},t.isBigEndian=function(){let w=new Uint8Array(4);return!((new Uint32Array(w.buffer)[0]=1)&w[0])}},202:(e,t,n)=>{"use strict";let o=n(830),{Buffer:f}=n(764),y=new TextDecoder("utf8",{fatal:!0,ignoreBOM:!0});class O extends o.Transform{constructor(u,p,I={}){let P=null,g=null;switch(typeof u){case"object":f.isBuffer(u)?P=u:u&&(I=u);break;case"string":P=u;break;case"undefined":break;default:throw new TypeError("Invalid input")}switch(typeof p){case"object":p&&(I=p);break;case"string":g=p;break;case"undefined":break;default:throw new TypeError("Invalid inputEncoding")}if(!I||typeof I!="object")throw new TypeError("Invalid options");P==null&&(P=I.input),g==null&&(g=I.inputEncoding),delete I.input,delete I.inputEncoding;let w=I.watchPipe==null||I.watchPipe;delete I.watchPipe;let v=Boolean(I.readError);delete I.readError,super(I),this.readError=v,w&&this.on("pipe",m=>{let S=m._readableState.objectMode;if(this.length>0&&S!==this._readableState.objectMode)throw new Error("Do not switch objectMode in the middle of the stream");this._readableState.objectMode=S,this._writableState.objectMode=S}),P!=null&&this.end(P,g)}static isNoFilter(u){return u instanceof this}static compare(u,p){if(!(u instanceof this))throw new TypeError("Arguments must be NoFilters");return u===p?0:u.compare(p)}static concat(u,p){if(!Array.isArray(u))throw new TypeError("list argument must be an Array of NoFilters");if(u.length===0||p===0)return f.alloc(0);p==null&&(p=u.reduce((w,v)=>{if(!(v instanceof O))throw new TypeError("list argument must be an Array of NoFilters");return w+v.length},0));let I=!0,P=!0,g=u.map(w=>{if(!(w instanceof O))throw new TypeError("list argument must be an Array of NoFilters");let v=w.slice();return f.isBuffer(v)?P=!1:I=!1,v});if(I)return f.concat(g,p);if(P)return[].concat(...g).slice(0,p);throw new Error("Concatenating mixed object and byte streams not supported")}_transform(u,p,I){this._readableState.objectMode||f.isBuffer(u)||(u=f.from(u,p)),this.push(u),I()}_bufArray(){let u=this._readableState.buffer;if(!Array.isArray(u)){let p=u.head;for(u=[];p!=null;)u.push(p.data),p=p.next}return u}read(u){let p=super.read(u);if(p!=null){if(this.emit("read",p),this.readError&&p.length<u)throw new Error(`Read ${p.length}, wanted ${u}`)}else if(this.readError)throw new Error(`No data available, wanted ${u}`);return p}readFull(u){let p=null,I=null,P=null;return new Promise((g,w)=>{this.length>=u?g(this.read(u)):this.writableFinished?w(new Error(`Stream finished before ${u} bytes were available`)):(p=v=>{this.length>=u&&g(this.read(u))},I=()=>{w(new Error(`Stream finished before ${u} bytes were available`))},P=w,this.on("readable",p),this.on("error",P),this.on("finish",I))}).finally(()=>{p&&(this.removeListener("readable",p),this.removeListener("error",P),this.removeListener("finish",I))})}promise(u){let p=!1;return new Promise((I,P)=>{this.on("finish",()=>{let g=this.read();u==null||p||(p=!0,u(null,g)),I(g)}),this.on("error",g=>{u==null||p||(p=!0,u(g)),P(g)})})}compare(u){if(!(u instanceof O))throw new TypeError("Arguments must be NoFilters");if(this===u)return 0;let p=this.slice(),I=u.slice();if(f.isBuffer(p)&&f.isBuffer(I))return p.compare(I);throw new Error("Cannot compare streams in object mode")}equals(u){return this.compare(u)===0}slice(u,p){if(this._readableState.objectMode)return this._bufArray().slice(u,p);let I=this._bufArray();switch(I.length){case 0:return f.alloc(0);case 1:return I[0].slice(u,p);default:return f.concat(I).slice(u,p)}}get(u){return this.slice()[u]}toJSON(){let u=this.slice();return f.isBuffer(u)?u.toJSON():u}toString(u,p,I){let P=this.slice(p,I);return f.isBuffer(P)?u&&u!=="utf8"?P.toString(u):y.decode(P):JSON.stringify(P)}[Symbol.for("nodejs.util.inspect.custom")](u,p){let I=this._bufArray().map(P=>f.isBuffer(P)?p.stylize(P.toString("hex"),"string"):JSON.stringify(P)).join(", ");return`${this.constructor.name} [${I}]`}get length(){return this._readableState.length}writeBigInt(u){let p=u.toString(16);if(u<0){let I=BigInt(Math.floor(p.length/2));p=(u=(BigInt(1)<<I*BigInt(8))+u).toString(16)}return p.length%2&&(p=`0${p}`),this.push(f.from(p,"hex"))}readUBigInt(u){let p=this.read(u);return f.isBuffer(p)?BigInt(`0x${p.toString("hex")}`):null}readBigInt(u){let p=this.read(u);if(!f.isBuffer(p))return null;let I=BigInt(`0x${p.toString("hex")}`);return 128&p[0]&&(I-=BigInt(1)<<BigInt(p.length)*BigInt(8)),I}writeUInt8(u){let p=f.from([u]);return this.push(p)}writeUInt16LE(u){let p=f.alloc(2);return p.writeUInt16LE(u),this.push(p)}writeUInt16BE(u){let p=f.alloc(2);return p.writeUInt16BE(u),this.push(p)}writeUInt32LE(u){let p=f.alloc(4);return p.writeUInt32LE(u),this.push(p)}writeUInt32BE(u){let p=f.alloc(4);return p.writeUInt32BE(u),this.push(p)}writeInt8(u){let p=f.from([u]);return this.push(p)}writeInt16LE(u){let p=f.alloc(2);return p.writeUInt16LE(u),this.push(p)}writeInt16BE(u){let p=f.alloc(2);return p.writeUInt16BE(u),this.push(p)}writeInt32LE(u){let p=f.alloc(4);return p.writeUInt32LE(u),this.push(p)}writeInt32BE(u){let p=f.alloc(4);return p.writeUInt32BE(u),this.push(p)}writeFloatLE(u){let p=f.alloc(4);return p.writeFloatLE(u),this.push(p)}writeFloatBE(u){let p=f.alloc(4);return p.writeFloatBE(u),this.push(p)}writeDoubleLE(u){let p=f.alloc(8);return p.writeDoubleLE(u),this.push(p)}writeDoubleBE(u){let p=f.alloc(8);return p.writeDoubleBE(u),this.push(p)}writeBigInt64LE(u){let p=f.alloc(8);return p.writeBigInt64LE(u),this.push(p)}writeBigInt64BE(u){let p=f.alloc(8);return p.writeBigInt64BE(u),this.push(p)}writeBigUInt64LE(u){let p=f.alloc(8);return p.writeBigUInt64LE(u),this.push(p)}writeBigUInt64BE(u){let p=f.alloc(8);return p.writeBigUInt64BE(u),this.push(p)}readUInt8(){let u=this.read(1);return f.isBuffer(u)?u.readUInt8():null}readUInt16LE(){let u=this.read(2);return f.isBuffer(u)?u.readUInt16LE():null}readUInt16BE(){let u=this.read(2);return f.isBuffer(u)?u.readUInt16BE():null}readUInt32LE(){let u=this.read(4);return f.isBuffer(u)?u.readUInt32LE():null}readUInt32BE(){let u=this.read(4);return f.isBuffer(u)?u.readUInt32BE():null}readInt8(){let u=this.read(1);return f.isBuffer(u)?u.readInt8():null}readInt16LE(){let u=this.read(2);return f.isBuffer(u)?u.readInt16LE():null}readInt16BE(){let u=this.read(2);return f.isBuffer(u)?u.readInt16BE():null}readInt32LE(){let u=this.read(4);return f.isBuffer(u)?u.readInt32LE():null}readInt32BE(){let u=this.read(4);return f.isBuffer(u)?u.readInt32BE():null}readFloatLE(){let u=this.read(4);return f.isBuffer(u)?u.readFloatLE():null}readFloatBE(){let u=this.read(4);return f.isBuffer(u)?u.readFloatBE():null}readDoubleLE(){let u=this.read(8);return f.isBuffer(u)?u.readDoubleLE():null}readDoubleBE(){let u=this.read(8);return f.isBuffer(u)?u.readDoubleBE():null}readBigInt64LE(){let u=this.read(8);return f.isBuffer(u)?u.readBigInt64LE():null}readBigInt64BE(){let u=this.read(8);return f.isBuffer(u)?u.readBigInt64BE():null}readBigUInt64LE(){let u=this.read(8);return f.isBuffer(u)?u.readBigUInt64LE():null}readBigUInt64BE(){let u=this.read(8);return f.isBuffer(u)?u.readBigUInt64BE():null}}e.exports=O},71:(e,t,n)=>{"use strict";let o=n(830),f=n(202);class y extends o.Transform{constructor(b){super(b),this._writableState.objectMode=!1,this._readableState.objectMode=!0,this.bs=new f,this.__restart()}_transform(b,u,p){for(this.bs.write(b);this.bs.length>=this.__needed;){let I=null,P=this.__needed===null?void 0:this.bs.read(this.__needed);try{I=this.__parser.next(P)}catch(g){return p(g)}this.__needed&&(this.__fresh=!1),I.done?(this.push(I.value),this.__restart()):this.__needed=I.value||1/0}return p()}*_parse(){throw new Error("Must be implemented in subclass")}__restart(){this.__needed=null,this.__parser=this._parse(),this.__fresh=!0}_flush(b){b(this.__fresh?null:new Error("unexpected end of input"))}}e.exports=y},187:e=>{"use strict";var t,n=typeof Reflect=="object"?Reflect:null,o=n&&typeof n.apply=="function"?n.apply:function(S,_,B){return Function.prototype.apply.call(S,_,B)};t=n&&typeof n.ownKeys=="function"?n.ownKeys:Object.getOwnPropertySymbols?function(S){return Object.getOwnPropertyNames(S).concat(Object.getOwnPropertySymbols(S))}:function(S){return Object.getOwnPropertyNames(S)};var f=Number.isNaN||function(S){return S!=S};function y(){y.init.call(this)}e.exports=y,e.exports.once=function(S,_){return new Promise(function(B,R){function $(C){S.removeListener(_,F),R(C)}function F(){typeof S.removeListener=="function"&&S.removeListener("error",$),B([].slice.call(arguments))}m(S,_,F,{once:!0}),_!=="error"&&function(C,Y,N){typeof C.on=="function"&&m(C,"error",Y,{once:!0})}(S,$)})},y.EventEmitter=y,y.prototype._events=void 0,y.prototype._eventsCount=0,y.prototype._maxListeners=void 0;var O=10;function b(S){if(typeof S!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof S)}function u(S){return S._maxListeners===void 0?y.defaultMaxListeners:S._maxListeners}function p(S,_,B,R){var $,F,C,Y;if(b(B),(F=S._events)===void 0?(F=S._events=Object.create(null),S._eventsCount=0):(F.newListener!==void 0&&(S.emit("newListener",_,B.listener?B.listener:B),F=S._events),C=F[_]),C===void 0)C=F[_]=B,++S._eventsCount;else if(typeof C=="function"?C=F[_]=R?[B,C]:[C,B]:R?C.unshift(B):C.push(B),($=u(S))>0&&C.length>$&&!C.warned){C.warned=!0;var N=new Error("Possible EventEmitter memory leak detected. "+C.length+" "+String(_)+" listeners added. Use emitter.setMaxListeners() to increase limit");N.name="MaxListenersExceededWarning",N.emitter=S,N.type=_,N.count=C.length,Y=N,console&&console.warn&&console.warn(Y)}return S}function I(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function P(S,_,B){var R={fired:!1,wrapFn:void 0,target:S,type:_,listener:B},$=I.bind(R);return $.listener=B,R.wrapFn=$,$}function g(S,_,B){var R=S._events;if(R===void 0)return[];var $=R[_];return $===void 0?[]:typeof $=="function"?B?[$.listener||$]:[$]:B?function(F){for(var C=new Array(F.length),Y=0;Y<C.length;++Y)C[Y]=F[Y].listener||F[Y];return C}($):v($,$.length)}function w(S){var _=this._events;if(_!==void 0){var B=_[S];if(typeof B=="function")return 1;if(B!==void 0)return B.length}return 0}function v(S,_){for(var B=new Array(_),R=0;R<_;++R)B[R]=S[R];return B}function m(S,_,B,R){if(typeof S.on=="function")R.once?S.once(_,B):S.on(_,B);else{if(typeof S.addEventListener!="function")throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof S);S.addEventListener(_,function $(F){R.once&&S.removeEventListener(_,$),B(F)})}}Object.defineProperty(y,"defaultMaxListeners",{enumerable:!0,get:function(){return O},set:function(S){if(typeof S!="number"||S<0||f(S))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+S+".");O=S}}),y.init=function(){this._events!==void 0&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},y.prototype.setMaxListeners=function(S){if(typeof S!="number"||S<0||f(S))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+S+".");return this._maxListeners=S,this},y.prototype.getMaxListeners=function(){return u(this)},y.prototype.emit=function(S){for(var _=[],B=1;B<arguments.length;B++)_.push(arguments[B]);var R=S==="error",$=this._events;if($!==void 0)R=R&&$.error===void 0;else if(!R)return!1;if(R){var F;if(_.length>0&&(F=_[0]),F instanceof Error)throw F;var C=new Error("Unhandled error."+(F?" ("+F.message+")":""));throw C.context=F,C}var Y=$[S];if(Y===void 0)return!1;if(typeof Y=="function")o(Y,this,_);else{var N=Y.length,H=v(Y,N);for(B=0;B<N;++B)o(H[B],this,_)}return!0},y.prototype.addListener=function(S,_){return p(this,S,_,!1)},y.prototype.on=y.prototype.addListener,y.prototype.prependListener=function(S,_){return p(this,S,_,!0)},y.prototype.once=function(S,_){return b(_),this.on(S,P(this,S,_)),this},y.prototype.prependOnceListener=function(S,_){return b(_),this.prependListener(S,P(this,S,_)),this},y.prototype.removeListener=function(S,_){var B,R,$,F,C;if(b(_),(R=this._events)===void 0)return this;if((B=R[S])===void 0)return this;if(B===_||B.listener===_)--this._eventsCount==0?this._events=Object.create(null):(delete R[S],R.removeListener&&this.emit("removeListener",S,B.listener||_));else if(typeof B!="function"){for($=-1,F=B.length-1;F>=0;F--)if(B[F]===_||B[F].listener===_){C=B[F].listener,$=F;break}if($<0)return this;$===0?B.shift():function(Y,N){for(;N+1<Y.length;N++)Y[N]=Y[N+1];Y.pop()}(B,$),B.length===1&&(R[S]=B[0]),R.removeListener!==void 0&&this.emit("removeListener",S,C||_)}return this},y.prototype.off=y.prototype.removeListener,y.prototype.removeAllListeners=function(S){var _,B,R;if((B=this._events)===void 0)return this;if(B.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):B[S]!==void 0&&(--this._eventsCount==0?this._events=Object.create(null):delete B[S]),this;if(arguments.length===0){var $,F=Object.keys(B);for(R=0;R<F.length;++R)($=F[R])!=="removeListener"&&this.removeAllListeners($);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(typeof(_=B[S])=="function")this.removeListener(S,_);else if(_!==void 0)for(R=_.length-1;R>=0;R--)this.removeListener(S,_[R]);return this},y.prototype.listeners=function(S){return g(this,S,!0)},y.prototype.rawListeners=function(S){return g(this,S,!1)},y.listenerCount=function(S,_){return typeof S.listenerCount=="function"?S.listenerCount(_):w.call(S,_)},y.prototype.listenerCount=w,y.prototype.eventNames=function(){return this._eventsCount>0?t(this._events):[]}},645:(e,t)=>{t.read=function(n,o,f,y,O){var b,u,p=8*O-y-1,I=(1<<p)-1,P=I>>1,g=-7,w=f?O-1:0,v=f?-1:1,m=n[o+w];for(w+=v,b=m&(1<<-g)-1,m>>=-g,g+=p;g>0;b=256*b+n[o+w],w+=v,g-=8);for(u=b&(1<<-g)-1,b>>=-g,g+=y;g>0;u=256*u+n[o+w],w+=v,g-=8);if(b===0)b=1-P;else{if(b===I)return u?NaN:1/0*(m?-1:1);u+=Math.pow(2,y),b-=P}return(m?-1:1)*u*Math.pow(2,b-y)},t.write=function(n,o,f,y,O,b){var u,p,I,P=8*b-O-1,g=(1<<P)-1,w=g>>1,v=O===23?Math.pow(2,-24)-Math.pow(2,-77):0,m=y?0:b-1,S=y?1:-1,_=o<0||o===0&&1/o<0?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(p=isNaN(o)?1:0,u=g):(u=Math.floor(Math.log(o)/Math.LN2),o*(I=Math.pow(2,-u))<1&&(u--,I*=2),(o+=u+w>=1?v/I:v*Math.pow(2,1-w))*I>=2&&(u++,I/=2),u+w>=g?(p=0,u=g):u+w>=1?(p=(o*I-1)*Math.pow(2,O),u+=w):(p=o*Math.pow(2,w-1)*Math.pow(2,O),u=0));O>=8;n[f+m]=255&p,m+=S,p/=256,O-=8);for(u=u<<O|p,P+=O;P>0;n[f+m]=255&u,m+=S,u/=256,P-=8);n[f+m-S]|=128*_}},717:e=>{typeof Object.create=="function"?e.exports=function(t,n){n&&(t.super_=n,t.prototype=Object.create(n.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}))}:e.exports=function(t,n){if(n){t.super_=n;var o=function(){};o.prototype=n.prototype,t.prototype=new o,t.prototype.constructor=t}}},155:e=>{var t,n,o=e.exports={};function f(){throw new Error("setTimeout has not been defined")}function y(){throw new Error("clearTimeout has not been defined")}function O(m){if(t===setTimeout)return setTimeout(m,0);if((t===f||!t)&&setTimeout)return t=setTimeout,setTimeout(m,0);try{return t(m,0)}catch{try{return t.call(null,m,0)}catch{return t.call(this,m,0)}}}(function(){try{t=typeof setTimeout=="function"?setTimeout:f}catch{t=f}try{n=typeof clearTimeout=="function"?clearTimeout:y}catch{n=y}})();var b,u=[],p=!1,I=-1;function P(){p&&b&&(p=!1,b.length?u=b.concat(u):I=-1,u.length&&g())}function g(){if(!p){var m=O(P);p=!0;for(var S=u.length;S;){for(b=u,u=[];++I<S;)b&&b[I].run();I=-1,S=u.length}b=null,p=!1,function(_){if(n===clearTimeout)return clearTimeout(_);if((n===y||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(_);try{n(_)}catch{try{return n.call(null,_)}catch{return n.call(this,_)}}}(m)}}function w(m,S){this.fun=m,this.array=S}function v(){}o.nextTick=function(m){var S=new Array(arguments.length-1);if(arguments.length>1)for(var _=1;_<arguments.length;_++)S[_-1]=arguments[_];u.push(new w(m,S)),u.length!==1||p||O(g)},w.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=v,o.addListener=v,o.once=v,o.off=v,o.removeListener=v,o.removeAllListeners=v,o.emit=v,o.prependListener=v,o.prependOnceListener=v,o.listeners=function(m){return[]},o.binding=function(m){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(m){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},281:e=>{"use strict";var t={};function n(f,y,O){O||(O=Error);var b=function(u){var p,I;function P(g,w,v){return u.call(this,function(m,S,_){return typeof y=="string"?y:y(m,S,_)}(g,w,v))||this}return I=u,(p=P).prototype=Object.create(I.prototype),p.prototype.constructor=p,p.__proto__=I,P}(O);b.prototype.name=O.name,b.prototype.code=f,t[f]=b}function o(f,y){if(Array.isArray(f)){var O=f.length;return f=f.map(function(b){return String(b)}),O>2?"one of ".concat(y," ").concat(f.slice(0,O-1).join(", "),", or ")+f[O-1]:O===2?"one of ".concat(y," ").concat(f[0]," or ").concat(f[1]):"of ".concat(y," ").concat(f[0])}return"of ".concat(y," ").concat(String(f))}n("ERR_INVALID_OPT_VALUE",function(f,y){return'The value "'+y+'" is invalid for option "'+f+'"'},TypeError),n("ERR_INVALID_ARG_TYPE",function(f,y,O){var b,u,p,I,P;if(typeof y=="string"&&(u="not ",y.substr(0,u.length)===u)?(b="must not be",y=y.replace(/^not /,"")):b="must be",function(w,v,m){return(m===void 0||m>w.length)&&(m=w.length),w.substring(m-v.length,m)===v}(f," argument"))p="The ".concat(f," ").concat(b," ").concat(o(y,"type"));else{var g=(typeof P!="number"&&(P=0),P+".".length>(I=f).length||I.indexOf(".",P)===-1?"argument":"property");p='The "'.concat(f,'" ').concat(g," ").concat(b," ").concat(o(y,"type"))}return p+". Received type ".concat(typeof O)},TypeError),n("ERR_STREAM_PUSH_AFTER_EOF","stream.push() after EOF"),n("ERR_METHOD_NOT_IMPLEMENTED",function(f){return"The "+f+" method is not implemented"}),n("ERR_STREAM_PREMATURE_CLOSE","Premature close"),n("ERR_STREAM_DESTROYED",function(f){return"Cannot call "+f+" after a stream was destroyed"}),n("ERR_MULTIPLE_CALLBACK","Callback called multiple times"),n("ERR_STREAM_CANNOT_PIPE","Cannot pipe, not readable"),n("ERR_STREAM_WRITE_AFTER_END","write after end"),n("ERR_STREAM_NULL_VALUES","May not write null values to stream",TypeError),n("ERR_UNKNOWN_ENCODING",function(f){return"Unknown encoding: "+f},TypeError),n("ERR_STREAM_UNSHIFT_AFTER_END_EVENT","stream.unshift() after end event"),e.exports.q=t},753:(e,t,n)=>{"use strict";var o=n(155),f=Object.keys||function(w){var v=[];for(var m in w)v.push(m);return v};e.exports=I;var y=n(481),O=n(229);n(717)(I,y);for(var b=f(O.prototype),u=0;u<b.length;u++){var p=b[u];I.prototype[p]||(I.prototype[p]=O.prototype[p])}function I(w){if(!(this instanceof I))return new I(w);y.call(this,w),O.call(this,w),this.allowHalfOpen=!0,w&&(w.readable===!1&&(this.readable=!1),w.writable===!1&&(this.writable=!1),w.allowHalfOpen===!1&&(this.allowHalfOpen=!1,this.once("end",P)))}function P(){this._writableState.ended||o.nextTick(g,this)}function g(w){w.end()}Object.defineProperty(I.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(I.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}}),Object.defineProperty(I.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}}),Object.defineProperty(I.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState!==void 0&&this._writableState!==void 0&&this._readableState.destroyed&&this._writableState.destroyed},set:function(w){this._readableState!==void 0&&this._writableState!==void 0&&(this._readableState.destroyed=w,this._writableState.destroyed=w)}})},725:(e,t,n)=>{"use strict";e.exports=f;var o=n(605);function f(y){if(!(this instanceof f))return new f(y);o.call(this,y)}n(717)(f,o),f.prototype._transform=function(y,O,b){b(null,y)}},481:(e,t,n)=>{"use strict";var o,f=n(155);e.exports=H,H.ReadableState=N,n(187).EventEmitter;var y,O=function(D,E){return D.listeners(E).length},b=n(503),u=n(764).Buffer,p=n.g.Uint8Array||function(){},I=n(616);y=I&&I.debuglog?I.debuglog("stream"):function(){};var P,g,w,v=n(327),m=n(195),S=n(457).getHighWaterMark,_=n(281).q,B=_.ERR_INVALID_ARG_TYPE,R=_.ERR_STREAM_PUSH_AFTER_EOF,$=_.ERR_METHOD_NOT_IMPLEMENTED,F=_.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;n(717)(H,b);var C=m.errorOrDestroy,Y=["error","close","destroy","pause","resume"];function N(D,E,W){o=o||n(753),D=D||{},typeof W!="boolean"&&(W=E instanceof o),this.objectMode=!!D.objectMode,W&&(this.objectMode=this.objectMode||!!D.readableObjectMode),this.highWaterMark=S(this,D,"readableHighWaterMark",W),this.buffer=new v,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.paused=!0,this.emitClose=D.emitClose!==!1,this.autoDestroy=!!D.autoDestroy,this.destroyed=!1,this.defaultEncoding=D.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,D.encoding&&(P||(P=n(553).s),this.decoder=new P(D.encoding),this.encoding=D.encoding)}function H(D){if(o=o||n(753),!(this instanceof H))return new H(D);var E=this instanceof o;this._readableState=new N(D,this,E),this.readable=!0,D&&(typeof D.read=="function"&&(this._read=D.read),typeof D.destroy=="function"&&(this._destroy=D.destroy)),b.call(this)}function J(D,E,W,X,ve){y("readableAddChunk",E);var Oe,ee=D._readableState;if(E===null)ee.reading=!1,function(fe,de){if(y("onEofChunk"),!de.ended){if(de.decoder){var Ae=de.decoder.end();Ae&&Ae.length&&(de.buffer.push(Ae),de.length+=de.objectMode?1:Ae.length)}de.ended=!0,de.sync?oe(fe):(de.needReadable=!1,de.emittedReadable||(de.emittedReadable=!0,k(fe)))}}(D,ee);else if(ve||(Oe=function(fe,de){var Ae,ne;return ne=de,u.isBuffer(ne)||ne instanceof p||typeof de=="string"||de===void 0||fe.objectMode||(Ae=new B("chunk",["string","Buffer","Uint8Array"],de)),Ae}(ee,E)),Oe)C(D,Oe);else if(ee.objectMode||E&&E.length>0)if(typeof E=="string"||ee.objectMode||Object.getPrototypeOf(E)===u.prototype||(E=function(fe){return u.from(fe)}(E)),X)ee.endEmitted?C(D,new F):ce(D,ee,E,!0);else if(ee.ended)C(D,new R);else{if(ee.destroyed)return!1;ee.reading=!1,ee.decoder&&!W?(E=ee.decoder.write(E),ee.objectMode||E.length!==0?ce(D,ee,E,!1):A(D,ee)):ce(D,ee,E,!1)}else X||(ee.reading=!1,A(D,ee));return!ee.ended&&(ee.length<ee.highWaterMark||ee.length===0)}function ce(D,E,W,X){E.flowing&&E.length===0&&!E.sync?(E.awaitDrain=0,D.emit("data",W)):(E.length+=E.objectMode?1:W.length,X?E.buffer.unshift(W):E.buffer.push(W),E.needReadable&&oe(D)),A(D,E)}Object.defineProperty(H.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState!==void 0&&this._readableState.destroyed},set:function(D){this._readableState&&(this._readableState.destroyed=D)}}),H.prototype.destroy=m.destroy,H.prototype._undestroy=m.undestroy,H.prototype._destroy=function(D,E){E(D)},H.prototype.push=function(D,E){var W,X=this._readableState;return X.objectMode?W=!0:typeof D=="string"&&((E=E||X.defaultEncoding)!==X.encoding&&(D=u.from(D,E),E=""),W=!0),J(this,D,E,!1,W)},H.prototype.unshift=function(D){return J(this,D,null,!0,!1)},H.prototype.isPaused=function(){return this._readableState.flowing===!1},H.prototype.setEncoding=function(D){P||(P=n(553).s);var E=new P(D);this._readableState.decoder=E,this._readableState.encoding=this._readableState.decoder.encoding;for(var W=this._readableState.buffer.head,X="";W!==null;)X+=E.write(W.data),W=W.next;return this._readableState.buffer.clear(),X!==""&&this._readableState.buffer.push(X),this._readableState.length=X.length,this};var Q=1073741824;function q(D,E){return D<=0||E.length===0&&E.ended?0:E.objectMode?1:D!=D?E.flowing&&E.length?E.buffer.head.data.length:E.length:(D>E.highWaterMark&&(E.highWaterMark=function(W){return W>=Q?W=Q:(W--,W|=W>>>1,W|=W>>>2,W|=W>>>4,W|=W>>>8,W|=W>>>16,W++),W}(D)),D<=E.length?D:E.ended?E.length:(E.needReadable=!0,0))}function oe(D){var E=D._readableState;y("emitReadable",E.needReadable,E.emittedReadable),E.needReadable=!1,E.emittedReadable||(y("emitReadable",E.flowing),E.emittedReadable=!0,f.nextTick(k,D))}function k(D){var E=D._readableState;y("emitReadable_",E.destroyed,E.length,E.ended),E.destroyed||!E.length&&!E.ended||(D.emit("readable"),E.emittedReadable=!1),E.needReadable=!E.flowing&&!E.ended&&E.length<=E.highWaterMark,z(D)}function A(D,E){E.readingMore||(E.readingMore=!0,f.nextTick(j,D,E))}function j(D,E){for(;!E.reading&&!E.ended&&(E.length<E.highWaterMark||E.flowing&&E.length===0);){var W=E.length;if(y("maybeReadMore read 0"),D.read(0),W===E.length)break}E.readingMore=!1}function L(D){var E=D._readableState;E.readableListening=D.listenerCount("readable")>0,E.resumeScheduled&&!E.paused?E.flowing=!0:D.listenerCount("data")>0&&D.resume()}function K(D){y("readable nexttick read 0"),D.read(0)}function G(D,E){y("resume",E.reading),E.reading||D.read(0),E.resumeScheduled=!1,D.emit("resume"),z(D),E.flowing&&!E.reading&&D.read(0)}function z(D){var E=D._readableState;for(y("flow",E.flowing);E.flowing&&D.read()!==null;);}function re(D,E){return E.length===0?null:(E.objectMode?W=E.buffer.shift():!D||D>=E.length?(W=E.decoder?E.buffer.join(""):E.buffer.length===1?E.buffer.first():E.buffer.concat(E.length),E.buffer.clear()):W=E.buffer.consume(D,E.decoder),W);var W}function te(D){var E=D._readableState;y("endReadable",E.endEmitted),E.endEmitted||(E.ended=!0,f.nextTick(ue,E,D))}function ue(D,E){if(y("endReadableNT",D.endEmitted,D.length),!D.endEmitted&&D.length===0&&(D.endEmitted=!0,E.readable=!1,E.emit("end"),D.autoDestroy)){var W=E._writableState;(!W||W.autoDestroy&&W.finished)&&E.destroy()}}function le(D,E){for(var W=0,X=D.length;W<X;W++)if(D[W]===E)return W;return-1}H.prototype.read=function(D){y("read",D),D=parseInt(D,10);var E=this._readableState,W=D;if(D!==0&&(E.emittedReadable=!1),D===0&&E.needReadable&&((E.highWaterMark!==0?E.length>=E.highWaterMark:E.length>0)||E.ended))return y("read: emitReadable",E.length,E.ended),E.length===0&&E.ended?te(this):oe(this),null;if((D=q(D,E))===0&&E.ended)return E.length===0&&te(this),null;var X,ve=E.needReadable;return y("need readable",ve),(E.length===0||E.length-D<E.highWaterMark)&&y("length less than watermark",ve=!0),E.ended||E.reading?y("reading or ended",ve=!1):ve&&(y("do read"),E.reading=!0,E.sync=!0,E.length===0&&(E.needReadable=!0),this._read(E.highWaterMark),E.sync=!1,E.reading||(D=q(W,E))),(X=D>0?re(D,E):null)===null?(E.needReadable=E.length<=E.highWaterMark,D=0):(E.length-=D,E.awaitDrain=0),E.length===0&&(E.ended||(E.needReadable=!0),W!==D&&E.ended&&te(this)),X!==null&&this.emit("data",X),X},H.prototype._read=function(D){C(this,new $("_read()"))},H.prototype.pipe=function(D,E){var W=this,X=this._readableState;switch(X.pipesCount){case 0:X.pipes=D;break;case 1:X.pipes=[X.pipes,D];break;default:X.pipes.push(D)}X.pipesCount+=1,y("pipe count=%d opts=%j",X.pipesCount,E);var ve=E&&E.end===!1||D===f.stdout||D===f.stderr?a:Oe;function Oe(){y("onend"),D.end()}X.endEmitted?f.nextTick(ve):W.once("end",ve),D.on("unpipe",function s(h,M){y("onunpipe"),h===W&&M&&M.hasUnpiped===!1&&(M.hasUnpiped=!0,y("cleanup"),D.removeListener("close",ne),D.removeListener("finish",he),D.removeListener("drain",ee),D.removeListener("error",Ae),D.removeListener("unpipe",s),W.removeListener("end",Oe),W.removeListener("end",a),W.removeListener("data",de),fe=!0,!X.awaitDrain||D._writableState&&!D._writableState.needDrain||ee())});var ee=function(s){return function(){var h=s._readableState;y("pipeOnDrain",h.awaitDrain),h.awaitDrain&&h.awaitDrain--,h.awaitDrain===0&&O(s,"data")&&(h.flowing=!0,z(s))}}(W);D.on("drain",ee);var fe=!1;function de(s){y("ondata");var h=D.write(s);y("dest.write",h),h===!1&&((X.pipesCount===1&&X.pipes===D||X.pipesCount>1&&le(X.pipes,D)!==-1)&&!fe&&(y("false write response, pause",X.awaitDrain),X.awaitDrain++),W.pause())}function Ae(s){y("onerror",s),a(),D.removeListener("error",Ae),O(D,"error")===0&&C(D,s)}function ne(){D.removeListener("finish",he),a()}function he(){y("onfinish"),D.removeListener("close",ne),a()}function a(){y("unpipe"),W.unpipe(D)}return W.on("data",de),function(s,h,M){if(typeof s.prependListener=="function")return s.prependListener(h,M);s._events&&s._events.error?Array.isArray(s._events.error)?s._events.error.unshift(M):s._events.error=[M,s._events.error]:s.on(h,M)}(D,"error",Ae),D.once("close",ne),D.once("finish",he),D.emit("pipe",W),X.flowing||(y("pipe resume"),W.resume()),D},H.prototype.unpipe=function(D){var E=this._readableState,W={hasUnpiped:!1};if(E.pipesCount===0)return this;if(E.pipesCount===1)return D&&D!==E.pipes||(D||(D=E.pipes),E.pipes=null,E.pipesCount=0,E.flowing=!1,D&&D.emit("unpipe",this,W)),this;if(!D){var X=E.pipes,ve=E.pipesCount;E.pipes=null,E.pipesCount=0,E.flowing=!1;for(var Oe=0;Oe<ve;Oe++)X[Oe].emit("unpipe",this,{hasUnpiped:!1});return this}var ee=le(E.pipes,D);return ee===-1||(E.pipes.splice(ee,1),E.pipesCount-=1,E.pipesCount===1&&(E.pipes=E.pipes[0]),D.emit("unpipe",this,W)),this},H.prototype.on=function(D,E){var W=b.prototype.on.call(this,D,E),X=this._readableState;return D==="data"?(X.readableListening=this.listenerCount("readable")>0,X.flowing!==!1&&this.resume()):D==="readable"&&(X.endEmitted||X.readableListening||(X.readableListening=X.needReadable=!0,X.flowing=!1,X.emittedReadable=!1,y("on readable",X.length,X.reading),X.length?oe(this):X.reading||f.nextTick(K,this))),W},H.prototype.addListener=H.prototype.on,H.prototype.removeListener=function(D,E){var W=b.prototype.removeListener.call(this,D,E);return D==="readable"&&f.nextTick(L,this),W},H.prototype.removeAllListeners=function(D){var E=b.prototype.removeAllListeners.apply(this,arguments);return D!=="readable"&&D!==void 0||f.nextTick(L,this),E},H.prototype.resume=function(){var D=this._readableState;return D.flowing||(y("resume"),D.flowing=!D.readableListening,function(E,W){W.resumeScheduled||(W.resumeScheduled=!0,f.nextTick(G,E,W))}(this,D)),D.paused=!1,this},H.prototype.pause=function(){return y("call pause flowing=%j",this._readableState.flowing),this._readableState.flowing!==!1&&(y("pause"),this._readableState.flowing=!1,this.emit("pause")),this._readableState.paused=!0,this},H.prototype.wrap=function(D){var E=this,W=this._readableState,X=!1;for(var ve in D.on("end",function(){if(y("wrapped end"),W.decoder&&!W.ended){var ee=W.decoder.end();ee&&ee.length&&E.push(ee)}E.push(null)}),D.on("data",function(ee){y("wrapped data"),W.decoder&&(ee=W.decoder.write(ee)),W.objectMode&&ee==null||(W.objectMode||ee&&ee.length)&&(E.push(ee)||(X=!0,D.pause()))}),D)this[ve]===void 0&&typeof D[ve]=="function"&&(this[ve]=function(ee){return function(){return D[ee].apply(D,arguments)}}(ve));for(var Oe=0;Oe<Y.length;Oe++)D.on(Y[Oe],this.emit.bind(this,Y[Oe]));return this._read=function(ee){y("wrapped _read",ee),X&&(X=!1,D.resume())},this},typeof Symbol=="function"&&(H.prototype[Symbol.asyncIterator]=function(){return g===void 0&&(g=n(850)),g(this)}),Object.defineProperty(H.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),Object.defineProperty(H.prototype,"readableBuffer",{enumerable:!1,get:function(){return this._readableState&&this._readableState.buffer}}),Object.defineProperty(H.prototype,"readableFlowing",{enumerable:!1,get:function(){return this._readableState.flowing},set:function(D){this._readableState&&(this._readableState.flowing=D)}}),H._fromList=re,Object.defineProperty(H.prototype,"readableLength",{enumerable:!1,get:function(){return this._readableState.length}}),typeof Symbol=="function"&&(H.from=function(D,E){return w===void 0&&(w=n(167)),w(H,D,E)})},605:(e,t,n)=>{"use strict";e.exports=I;var o=n(281).q,f=o.ERR_METHOD_NOT_IMPLEMENTED,y=o.ERR_MULTIPLE_CALLBACK,O=o.ERR_TRANSFORM_ALREADY_TRANSFORMING,b=o.ERR_TRANSFORM_WITH_LENGTH_0,u=n(753);function p(w,v){var m=this._transformState;m.transforming=!1;var S=m.writecb;if(S===null)return this.emit("error",new y);m.writechunk=null,m.writecb=null,v!=null&&this.push(v),S(w);var _=this._readableState;_.reading=!1,(_.needReadable||_.length<_.highWaterMark)&&this._read(_.highWaterMark)}function I(w){if(!(this instanceof I))return new I(w);u.call(this,w),this._transformState={afterTransform:p.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,w&&(typeof w.transform=="function"&&(this._transform=w.transform),typeof w.flush=="function"&&(this._flush=w.flush)),this.on("prefinish",P)}function P(){var w=this;typeof this._flush!="function"||this._readableState.destroyed?g(this,null,null):this._flush(function(v,m){g(w,v,m)})}function g(w,v,m){if(v)return w.emit("error",v);if(m!=null&&w.push(m),w._writableState.length)throw new b;if(w._transformState.transforming)throw new O;return w.push(null)}n(717)(I,u),I.prototype.push=function(w,v){return this._transformState.needTransform=!1,u.prototype.push.call(this,w,v)},I.prototype._transform=function(w,v,m){m(new f("_transform()"))},I.prototype._write=function(w,v,m){var S=this._transformState;if(S.writecb=m,S.writechunk=w,S.writeencoding=v,!S.transforming){var _=this._readableState;(S.needTransform||_.needReadable||_.length<_.highWaterMark)&&this._read(_.highWaterMark)}},I.prototype._read=function(w){var v=this._transformState;v.writechunk===null||v.transforming?v.needTransform=!0:(v.transforming=!0,this._transform(v.writechunk,v.writeencoding,v.afterTransform))},I.prototype._destroy=function(w,v){u.prototype._destroy.call(this,w,function(m){v(m)})}},229:(e,t,n)=>{"use strict";var o,f=n(155);function y(A){var j=this;this.next=null,this.entry=null,this.finish=function(){(function(L,K,G){var z=L.entry;for(L.entry=null;z;){var re=z.callback;K.pendingcb--,re(void 0),z=z.next}K.corkedRequestsFree.next=L})(j,A)}}e.exports=H,H.WritableState=N;var O,b={deprecate:n(927)},u=n(503),p=n(764).Buffer,I=n.g.Uint8Array||function(){},P=n(195),g=n(457).getHighWaterMark,w=n(281).q,v=w.ERR_INVALID_ARG_TYPE,m=w.ERR_METHOD_NOT_IMPLEMENTED,S=w.ERR_MULTIPLE_CALLBACK,_=w.ERR_STREAM_CANNOT_PIPE,B=w.ERR_STREAM_DESTROYED,R=w.ERR_STREAM_NULL_VALUES,$=w.ERR_STREAM_WRITE_AFTER_END,F=w.ERR_UNKNOWN_ENCODING,C=P.errorOrDestroy;function Y(){}function N(A,j,L){o=o||n(753),A=A||{},typeof L!="boolean"&&(L=j instanceof o),this.objectMode=!!A.objectMode,L&&(this.objectMode=this.objectMode||!!A.writableObjectMode),this.highWaterMark=g(this,A,"writableHighWaterMark",L),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var K=A.decodeStrings===!1;this.decodeStrings=!K,this.defaultEncoding=A.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(G){(function(z,re){var te=z._writableState,ue=te.sync,le=te.writecb;if(typeof le!="function")throw new S;if(function(E){E.writing=!1,E.writecb=null,E.length-=E.writelen,E.writelen=0}(te),re)(function(E,W,X,ve,Oe){--W.pendingcb,X?(f.nextTick(Oe,ve),f.nextTick(k,E,W),E._writableState.errorEmitted=!0,C(E,ve)):(Oe(ve),E._writableState.errorEmitted=!0,C(E,ve),k(E,W))})(z,te,ue,re,le);else{var D=q(te)||z.destroyed;D||te.corked||te.bufferProcessing||!te.bufferedRequest||Q(z,te),ue?f.nextTick(ce,z,te,D,le):ce(z,te,D,le)}})(j,G)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.emitClose=A.emitClose!==!1,this.autoDestroy=!!A.autoDestroy,this.bufferedRequestCount=0,this.corkedRequestsFree=new y(this)}function H(A){var j=this instanceof(o=o||n(753));if(!j&&!O.call(H,this))return new H(A);this._writableState=new N(A,this,j),this.writable=!0,A&&(typeof A.write=="function"&&(this._write=A.write),typeof A.writev=="function"&&(this._writev=A.writev),typeof A.destroy=="function"&&(this._destroy=A.destroy),typeof A.final=="function"&&(this._final=A.final)),u.call(this)}function J(A,j,L,K,G,z,re){j.writelen=K,j.writecb=re,j.writing=!0,j.sync=!0,j.destroyed?j.onwrite(new B("write")):L?A._writev(G,j.onwrite):A._write(G,z,j.onwrite),j.sync=!1}function ce(A,j,L,K){L||function(G,z){z.length===0&&z.needDrain&&(z.needDrain=!1,G.emit("drain"))}(A,j),j.pendingcb--,K(),k(A,j)}function Q(A,j){j.bufferProcessing=!0;var L=j.bufferedRequest;if(A._writev&&L&&L.next){var K=j.bufferedRequestCount,G=new Array(K),z=j.corkedRequestsFree;z.entry=L;for(var re=0,te=!0;L;)G[re]=L,L.isBuf||(te=!1),L=L.next,re+=1;G.allBuffers=te,J(A,j,!0,j.length,G,"",z.finish),j.pendingcb++,j.lastBufferedRequest=null,z.next?(j.corkedRequestsFree=z.next,z.next=null):j.corkedRequestsFree=new y(j),j.bufferedRequestCount=0}else{for(;L;){var ue=L.chunk,le=L.encoding,D=L.callback;if(J(A,j,!1,j.objectMode?1:ue.length,ue,le,D),L=L.next,j.bufferedRequestCount--,j.writing)break}L===null&&(j.lastBufferedRequest=null)}j.bufferedRequest=L,j.bufferProcessing=!1}function q(A){return A.ending&&A.length===0&&A.bufferedRequest===null&&!A.finished&&!A.writing}function oe(A,j){A._final(function(L){j.pendingcb--,L&&C(A,L),j.prefinished=!0,A.emit("prefinish"),k(A,j)})}function k(A,j){var L=q(j);if(L&&(function(G,z){z.prefinished||z.finalCalled||(typeof G._final!="function"||z.destroyed?(z.prefinished=!0,G.emit("prefinish")):(z.pendingcb++,z.finalCalled=!0,f.nextTick(oe,G,z)))}(A,j),j.pendingcb===0&&(j.finished=!0,A.emit("finish"),j.autoDestroy))){var K=A._readableState;(!K||K.autoDestroy&&K.endEmitted)&&A.destroy()}return L}n(717)(H,u),N.prototype.getBuffer=function(){for(var A=this.bufferedRequest,j=[];A;)j.push(A),A=A.next;return j},function(){try{Object.defineProperty(N.prototype,"buffer",{get:b.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch{}}(),typeof Symbol=="function"&&Symbol.hasInstance&&typeof Function.prototype[Symbol.hasInstance]=="function"?(O=Function.prototype[Symbol.hasInstance],Object.defineProperty(H,Symbol.hasInstance,{value:function(A){return!!O.call(this,A)||this===H&&A&&A._writableState instanceof N}})):O=function(A){return A instanceof this},H.prototype.pipe=function(){C(this,new _)},H.prototype.write=function(A,j,L){var K,G=this._writableState,z=!1,re=!G.objectMode&&(K=A,p.isBuffer(K)||K instanceof I);return re&&!p.isBuffer(A)&&(A=function(te){return p.from(te)}(A)),typeof j=="function"&&(L=j,j=null),re?j="buffer":j||(j=G.defaultEncoding),typeof L!="function"&&(L=Y),G.ending?function(te,ue){var le=new $;C(te,le),f.nextTick(ue,le)}(this,L):(re||function(te,ue,le,D){var E;return le===null?E=new R:typeof le=="string"||ue.objectMode||(E=new v("chunk",["string","Buffer"],le)),!E||(C(te,E),f.nextTick(D,E),!1)}(this,G,A,L))&&(G.pendingcb++,z=function(te,ue,le,D,E,W){if(!le){var X=function(fe,de,Ae){return fe.objectMode||fe.decodeStrings===!1||typeof de!="string"||(de=p.from(de,Ae)),de}(ue,D,E);D!==X&&(le=!0,E="buffer",D=X)}var ve=ue.objectMode?1:D.length;ue.length+=ve;var Oe=ue.length<ue.highWaterMark;if(Oe||(ue.needDrain=!0),ue.writing||ue.corked){var ee=ue.lastBufferedRequest;ue.lastBufferedRequest={chunk:D,encoding:E,isBuf:le,callback:W,next:null},ee?ee.next=ue.lastBufferedRequest:ue.bufferedRequest=ue.lastBufferedRequest,ue.bufferedRequestCount+=1}else J(te,ue,!1,ve,D,E,W);return Oe}(this,G,re,A,j,L)),z},H.prototype.cork=function(){this._writableState.corked++},H.prototype.uncork=function(){var A=this._writableState;A.corked&&(A.corked--,A.writing||A.corked||A.bufferProcessing||!A.bufferedRequest||Q(this,A))},H.prototype.setDefaultEncoding=function(A){if(typeof A=="string"&&(A=A.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((A+"").toLowerCase())>-1))throw new F(A);return this._writableState.defaultEncoding=A,this},Object.defineProperty(H.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}}),Object.defineProperty(H.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),H.prototype._write=function(A,j,L){L(new m("_write()"))},H.prototype._writev=null,H.prototype.end=function(A,j,L){var K=this._writableState;return typeof A=="function"?(L=A,A=null,j=null):typeof j=="function"&&(L=j,j=null),A!=null&&this.write(A,j),K.corked&&(K.corked=1,this.uncork()),K.ending||function(G,z,re){z.ending=!0,k(G,z),re&&(z.finished?f.nextTick(re):G.once("finish",re)),z.ended=!0,G.writable=!1}(this,K,L),this},Object.defineProperty(H.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}}),Object.defineProperty(H.prototype,"destroyed",{enumerable:!1,get:function(){return this._writableState!==void 0&&this._writableState.destroyed},set:function(A){this._writableState&&(this._writableState.destroyed=A)}}),H.prototype.destroy=P.destroy,H.prototype._undestroy=P.undestroy,H.prototype._destroy=function(A,j){j(A)}},850:(e,t,n)=>{"use strict";var o,f=n(155);function y(R,$,F){return $ in R?Object.defineProperty(R,$,{value:F,enumerable:!0,configurable:!0,writable:!0}):R[$]=F,R}var O=n(610),b=Symbol("lastResolve"),u=Symbol("lastReject"),p=Symbol("error"),I=Symbol("ended"),P=Symbol("lastPromise"),g=Symbol("handlePromise"),w=Symbol("stream");function v(R,$){return{value:R,done:$}}function m(R){var $=R[b];if($!==null){var F=R[w].read();F!==null&&(R[P]=null,R[b]=null,R[u]=null,$(v(F,!1)))}}function S(R){f.nextTick(m,R)}var _=Object.getPrototypeOf(function(){}),B=Object.setPrototypeOf((y(o={get stream(){return this[w]},next:function(){var R=this,$=this[p];if($!==null)return Promise.reject($);if(this[I])return Promise.resolve(v(void 0,!0));if(this[w].destroyed)return new Promise(function(N,H){f.nextTick(function(){R[p]?H(R[p]):N(v(void 0,!0))})});var F,C=this[P];if(C)F=new Promise(function(N,H){return function(J,ce){N.then(function(){H[I]?J(v(void 0,!0)):H[g](J,ce)},ce)}}(C,this));else{var Y=this[w].read();if(Y!==null)return Promise.resolve(v(Y,!1));F=new Promise(this[g])}return this[P]=F,F}},Symbol.asyncIterator,function(){return this}),y(o,"return",function(){var R=this;return new Promise(function($,F){R[w].destroy(null,function(C){C?F(C):$(v(void 0,!0))})})}),o),_);e.exports=function(R){var $,F=Object.create(B,(y($={},w,{value:R,writable:!0}),y($,b,{value:null,writable:!0}),y($,u,{value:null,writable:!0}),y($,p,{value:null,writable:!0}),y($,I,{value:R._readableState.endEmitted,writable:!0}),y($,g,{value:function(C,Y){var N=F[w].read();N?(F[P]=null,F[b]=null,F[u]=null,C(v(N,!1))):(F[b]=C,F[u]=Y)},writable:!0}),$));return F[P]=null,O(R,function(C){if(C&&C.code!=="ERR_STREAM_PREMATURE_CLOSE"){var Y=F[u];return Y!==null&&(F[P]=null,F[b]=null,F[u]=null,Y(C)),void(F[p]=C)}var N=F[b];N!==null&&(F[P]=null,F[b]=null,F[u]=null,N(v(void 0,!0))),F[I]=!0}),R.on("readable",S.bind(null,F)),F}},327:(e,t,n)=>{"use strict";function o(p,I){var P=Object.keys(p);if(Object.getOwnPropertySymbols){var g=Object.getOwnPropertySymbols(p);I&&(g=g.filter(function(w){return Object.getOwnPropertyDescriptor(p,w).enumerable})),P.push.apply(P,g)}return P}function f(p,I,P){return I in p?Object.defineProperty(p,I,{value:P,enumerable:!0,configurable:!0,writable:!0}):p[I]=P,p}function y(p,I){for(var P=0;P<I.length;P++){var g=I[P];g.enumerable=g.enumerable||!1,g.configurable=!0,"value"in g&&(g.writable=!0),Object.defineProperty(p,g.key,g)}}var O=n(764).Buffer,b=n(361).inspect,u=b&&b.custom||"inspect";e.exports=function(){function p(){(function(g,w){if(!(g instanceof w))throw new TypeError("Cannot call a class as a function")})(this,p),this.head=null,this.tail=null,this.length=0}var I,P;return I=p,P=[{key:"push",value:function(g){var w={data:g,next:null};this.length>0?this.tail.next=w:this.head=w,this.tail=w,++this.length}},{key:"unshift",value:function(g){var w={data:g,next:this.head};this.length===0&&(this.tail=w),this.head=w,++this.length}},{key:"shift",value:function(){if(this.length!==0){var g=this.head.data;return this.length===1?this.head=this.tail=null:this.head=this.head.next,--this.length,g}}},{key:"clear",value:function(){this.head=this.tail=null,this.length=0}},{key:"join",value:function(g){if(this.length===0)return"";for(var w=this.head,v=""+w.data;w=w.next;)v+=g+w.data;return v}},{key:"concat",value:function(g){if(this.length===0)return O.alloc(0);for(var w,v,m,S=O.allocUnsafe(g>>>0),_=this.head,B=0;_;)w=_.data,v=S,m=B,O.prototype.copy.call(w,v,m),B+=_.data.length,_=_.next;return S}},{key:"consume",value:function(g,w){var v;return g<this.head.data.length?(v=this.head.data.slice(0,g),this.head.data=this.head.data.slice(g)):v=g===this.head.data.length?this.shift():w?this._getString(g):this._getBuffer(g),v}},{key:"first",value:function(){return this.head.data}},{key:"_getString",value:function(g){var w=this.head,v=1,m=w.data;for(g-=m.length;w=w.next;){var S=w.data,_=g>S.length?S.length:g;if(_===S.length?m+=S:m+=S.slice(0,g),(g-=_)==0){_===S.length?(++v,w.next?this.head=w.next:this.head=this.tail=null):(this.head=w,w.data=S.slice(_));break}++v}return this.length-=v,m}},{key:"_getBuffer",value:function(g){var w=O.allocUnsafe(g),v=this.head,m=1;for(v.data.copy(w),g-=v.data.length;v=v.next;){var S=v.data,_=g>S.length?S.length:g;if(S.copy(w,w.length-g,0,_),(g-=_)==0){_===S.length?(++m,v.next?this.head=v.next:this.head=this.tail=null):(this.head=v,v.data=S.slice(_));break}++m}return this.length-=m,w}},{key:u,value:function(g,w){return b(this,function(v){for(var m=1;m<arguments.length;m++){var S=arguments[m]!=null?arguments[m]:{};m%2?o(Object(S),!0).forEach(function(_){f(v,_,S[_])}):Object.getOwnPropertyDescriptors?Object.defineProperties(v,Object.getOwnPropertyDescriptors(S)):o(Object(S)).forEach(function(_){Object.defineProperty(v,_,Object.getOwnPropertyDescriptor(S,_))})}return v}({},w,{depth:0,customInspect:!1}))}}],P&&y(I.prototype,P),p}()},195:(e,t,n)=>{"use strict";var o=n(155);function f(b,u){O(b,u),y(b)}function y(b){b._writableState&&!b._writableState.emitClose||b._readableState&&!b._readableState.emitClose||b.emit("close")}function O(b,u){b.emit("error",u)}e.exports={destroy:function(b,u){var p=this,I=this._readableState&&this._readableState.destroyed,P=this._writableState&&this._writableState.destroyed;return I||P?(u?u(b):b&&(this._writableState?this._writableState.errorEmitted||(this._writableState.errorEmitted=!0,o.nextTick(O,this,b)):o.nextTick(O,this,b)),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(b||null,function(g){!u&&g?p._writableState?p._writableState.errorEmitted?o.nextTick(y,p):(p._writableState.errorEmitted=!0,o.nextTick(f,p,g)):o.nextTick(f,p,g):u?(o.nextTick(y,p),u(g)):o.nextTick(y,p)}),this)},undestroy:function(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finalCalled=!1,this._writableState.prefinished=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)},errorOrDestroy:function(b,u){var p=b._readableState,I=b._writableState;p&&p.autoDestroy||I&&I.autoDestroy?b.destroy(u):b.emit("error",u)}}},610:(e,t,n)=>{"use strict";var o=n(281).q.ERR_STREAM_PREMATURE_CLOSE;function f(){}e.exports=function y(O,b,u){if(typeof b=="function")return y(O,null,b);b||(b={}),u=function(R){var $=!1;return function(){if(!$){$=!0;for(var F=arguments.length,C=new Array(F),Y=0;Y<F;Y++)C[Y]=arguments[Y];R.apply(this,C)}}}(u||f);var p=b.readable||b.readable!==!1&&O.readable,I=b.writable||b.writable!==!1&&O.writable,P=function(){O.writable||w()},g=O._writableState&&O._writableState.finished,w=function(){I=!1,g=!0,p||u.call(O)},v=O._readableState&&O._readableState.endEmitted,m=function(){p=!1,v=!0,I||u.call(O)},S=function(R){u.call(O,R)},_=function(){var R;return p&&!v?(O._readableState&&O._readableState.ended||(R=new o),u.call(O,R)):I&&!g?(O._writableState&&O._writableState.ended||(R=new o),u.call(O,R)):void 0},B=function(){O.req.on("finish",w)};return function(R){return R.setHeader&&typeof R.abort=="function"}(O)?(O.on("complete",w),O.on("abort",_),O.req?B():O.on("request",B)):I&&!O._writableState&&(O.on("end",P),O.on("close",P)),O.on("end",m),O.on("finish",w),b.error!==!1&&O.on("error",S),O.on("close",_),function(){O.removeListener("complete",w),O.removeListener("abort",_),O.removeListener("request",B),O.req&&O.req.removeListener("finish",w),O.removeListener("end",P),O.removeListener("close",P),O.removeListener("finish",w),O.removeListener("end",m),O.removeListener("error",S),O.removeListener("close",_)}}},167:e=>{e.exports=function(){throw new Error("Readable.from is not available in the browser")}},946:(e,t,n)=>{"use strict";var o,f=n(281).q,y=f.ERR_MISSING_ARGS,O=f.ERR_STREAM_DESTROYED;function b(g){if(g)throw g}function u(g,w,v,m){m=function(B){var R=!1;return function(){R||(R=!0,B.apply(void 0,arguments))}}(m);var S=!1;g.on("close",function(){S=!0}),o===void 0&&(o=n(610)),o(g,{readable:w,writable:v},function(B){if(B)return m(B);S=!0,m()});var _=!1;return function(B){if(!S&&!_)return _=!0,function(R){return R.setHeader&&typeof R.abort=="function"}(g)?g.abort():typeof g.destroy=="function"?g.destroy():void m(B||new O("pipe"))}}function p(g){g()}function I(g,w){return g.pipe(w)}function P(g){return g.length?typeof g[g.length-1]!="function"?b:g.pop():b}e.exports=function(){for(var g=arguments.length,w=new Array(g),v=0;v<g;v++)w[v]=arguments[v];var m,S=P(w);if(Array.isArray(w[0])&&(w=w[0]),w.length<2)throw new y("streams");var _=w.map(function(B,R){var $=R<w.length-1;return u(B,$,R>0,function(F){m||(m=F),F&&_.forEach(p),$||(_.forEach(p),S(m))})});return w.reduce(I)}},457:(e,t,n)=>{"use strict";var o=n(281).q.ERR_INVALID_OPT_VALUE;e.exports={getHighWaterMark:function(f,y,O,b){var u=function(p,I,P){return p.highWaterMark!=null?p.highWaterMark:I?p[P]:null}(y,b,O);if(u!=null){if(!isFinite(u)||Math.floor(u)!==u||u<0)throw new o(b?O:"highWaterMark",u);return Math.floor(u)}return f.objectMode?16:16384}}},503:(e,t,n)=>{e.exports=n(187).EventEmitter},509:(e,t,n)=>{var o=n(764),f=o.Buffer;function y(b,u){for(var p in b)u[p]=b[p]}function O(b,u,p){return f(b,u,p)}f.from&&f.alloc&&f.allocUnsafe&&f.allocUnsafeSlow?e.exports=o:(y(o,t),t.Buffer=O),O.prototype=Object.create(f.prototype),y(f,O),O.from=function(b,u,p){if(typeof b=="number")throw new TypeError("Argument must not be a number");return f(b,u,p)},O.alloc=function(b,u,p){if(typeof b!="number")throw new TypeError("Argument must be a number");var I=f(b);return u!==void 0?typeof p=="string"?I.fill(u,p):I.fill(u):I.fill(0),I},O.allocUnsafe=function(b){if(typeof b!="number")throw new TypeError("Argument must be a number");return f(b)},O.allocUnsafeSlow=function(b){if(typeof b!="number")throw new TypeError("Argument must be a number");return o.SlowBuffer(b)}},830:(e,t,n)=>{e.exports=f;var o=n(187).EventEmitter;function f(){o.call(this)}n(717)(f,o),f.Readable=n(481),f.Writable=n(229),f.Duplex=n(753),f.Transform=n(605),f.PassThrough=n(725),f.finished=n(610),f.pipeline=n(946),f.Stream=f,f.prototype.pipe=function(y,O){var b=this;function u(m){y.writable&&y.write(m)===!1&&b.pause&&b.pause()}function p(){b.readable&&b.resume&&b.resume()}b.on("data",u),y.on("drain",p),y._isStdio||O&&O.end===!1||(b.on("end",P),b.on("close",g));var I=!1;function P(){I||(I=!0,y.end())}function g(){I||(I=!0,typeof y.destroy=="function"&&y.destroy())}function w(m){if(v(),o.listenerCount(this,"error")===0)throw m}function v(){b.removeListener("data",u),y.removeListener("drain",p),b.removeListener("end",P),b.removeListener("close",g),b.removeListener("error",w),y.removeListener("error",w),b.removeListener("end",v),b.removeListener("close",v),y.removeListener("close",v)}return b.on("error",w),y.on("error",w),b.on("end",v),b.on("close",v),y.on("close",v),y.emit("pipe",b),y}},553:(e,t,n)=>{"use strict";var o=n(509).Buffer,f=o.isEncoding||function(v){switch((v=""+v)&&v.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function y(v){var m;switch(this.encoding=function(S){var _=function(B){if(!B)return"utf8";for(var R;;)switch(B){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return B;default:if(R)return;B=(""+B).toLowerCase(),R=!0}}(S);if(typeof _!="string"&&(o.isEncoding===f||!f(S)))throw new Error("Unknown encoding: "+S);return _||S}(v),this.encoding){case"utf16le":this.text=u,this.end=p,m=4;break;case"utf8":this.fillLast=b,m=4;break;case"base64":this.text=I,this.end=P,m=3;break;default:return this.write=g,void(this.end=w)}this.lastNeed=0,this.lastTotal=0,this.lastChar=o.allocUnsafe(m)}function O(v){return v<=127?0:v>>5==6?2:v>>4==14?3:v>>3==30?4:v>>6==2?-1:-2}function b(v){var m=this.lastTotal-this.lastNeed,S=function(_,B,R){if((192&B[0])!=128)return _.lastNeed=0,"\uFFFD";if(_.lastNeed>1&&B.length>1){if((192&B[1])!=128)return _.lastNeed=1,"\uFFFD";if(_.lastNeed>2&&B.length>2&&(192&B[2])!=128)return _.lastNeed=2,"\uFFFD"}}(this,v);return S!==void 0?S:this.lastNeed<=v.length?(v.copy(this.lastChar,m,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(v.copy(this.lastChar,m,0,v.length),void(this.lastNeed-=v.length))}function u(v,m){if((v.length-m)%2==0){var S=v.toString("utf16le",m);if(S){var _=S.charCodeAt(S.length-1);if(_>=55296&&_<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=v[v.length-2],this.lastChar[1]=v[v.length-1],S.slice(0,-1)}return S}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=v[v.length-1],v.toString("utf16le",m,v.length-1)}function p(v){var m=v&&v.length?this.write(v):"";if(this.lastNeed){var S=this.lastTotal-this.lastNeed;return m+this.lastChar.toString("utf16le",0,S)}return m}function I(v,m){var S=(v.length-m)%3;return S===0?v.toString("base64",m):(this.lastNeed=3-S,this.lastTotal=3,S===1?this.lastChar[0]=v[v.length-1]:(this.lastChar[0]=v[v.length-2],this.lastChar[1]=v[v.length-1]),v.toString("base64",m,v.length-S))}function P(v){var m=v&&v.length?this.write(v):"";return this.lastNeed?m+this.lastChar.toString("base64",0,3-this.lastNeed):m}function g(v){return v.toString(this.encoding)}function w(v){return v&&v.length?this.write(v):""}t.s=y,y.prototype.write=function(v){if(v.length===0)return"";var m,S;if(this.lastNeed){if((m=this.fillLast(v))===void 0)return"";S=this.lastNeed,this.lastNeed=0}else S=0;return S<v.length?m?m+this.text(v,S):this.text(v,S):m||""},y.prototype.end=function(v){var m=v&&v.length?this.write(v):"";return this.lastNeed?m+"\uFFFD":m},y.prototype.text=function(v,m){var S=function(B,R,$){var F=R.length-1;if(F<$)return 0;var C=O(R[F]);return C>=0?(C>0&&(B.lastNeed=C-1),C):--F<$||C===-2?0:(C=O(R[F]))>=0?(C>0&&(B.lastNeed=C-2),C):--F<$||C===-2?0:(C=O(R[F]))>=0?(C>0&&(C===2?C=0:B.lastNeed=C-3),C):0}(this,v,m);if(!this.lastNeed)return v.toString("utf8",m);this.lastTotal=S;var _=v.length-(S-this.lastNeed);return v.copy(this.lastChar,0,_),v.toString("utf8",m,_)},y.prototype.fillLast=function(v){if(this.lastNeed<=v.length)return v.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);v.copy(this.lastChar,this.lastTotal-this.lastNeed,0,v.length),this.lastNeed-=v.length}},927:(e,t,n)=>{function o(f){try{if(!n.g.localStorage)return!1}catch{return!1}var y=n.g.localStorage[f];return y!=null&&String(y).toLowerCase()==="true"}e.exports=function(f,y){if(o("noDeprecation"))return f;var O=!1;return function(){if(!O){if(o("throwDeprecation"))throw new Error(y);o("traceDeprecation")?console.trace(y):console.warn(y),O=!0}return f.apply(this,arguments)}}},361:()=>{},616:()=>{}},c={};function l(e){var t=c[e];if(t!==void 0)return t.exports;var n=c[e]={exports:{}};return d[e](n,n.exports,l),n.exports}l.d=(e,t)=>{for(var n in t)l.o(t,n)&&!l.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},l.g=function(){if(typeof globalThis=="object")return globalThis;try{return this||new Function("return this")()}catch{if(typeof window=="object")return window}}(),l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),l.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};return(()=>{"use strict";l.r(r),l.d(r,{Commented:()=>e.Commented,Decoder:()=>e.Decoder,Diagnose:()=>e.Diagnose,Encoder:()=>e.Encoder,Map:()=>e.Map,Simple:()=>e.Simple,Tagged:()=>e.Tagged,comment:()=>e.UI,decode:()=>e.Jx,decodeAll:()=>e.fI,decodeAllSync:()=>e.cc,decodeFirst:()=>e.h8,decodeFirstSync:()=>e.$u,diagnose:()=>e.M,encode:()=>e.cv,encodeAsync:()=>e.WR,encodeCanonical:()=>e.N2,encodeOne:()=>e.TG,leveldb:()=>e.ww,reset:()=>e.mc});var e=l(141)})(),r})()})});var wn=_e((no,bn)=>{"use strict";bn.exports=Wr;function Wr(d,c){for(var l=new Array(arguments.length-1),r=0,e=2,t=!0;e<arguments.length;)l[r++]=arguments[e++];return new Promise(function(o,f){l[r]=function(O){if(t)if(t=!1,O)f(O);else{for(var b=new Array(arguments.length-1),u=0;u<b.length;)b[u++]=arguments[u];o.apply(null,b)}};try{d.apply(c||null,l)}catch(y){t&&(t=!1,f(y))}})}});var In=_e(mn=>{"use strict";var pt=mn;pt.length=function(c){var l=c.length;if(!l)return 0;for(var r=0;--l%4>1&&c.charAt(l)==="=";)++r;return Math.ceil(c.length*3)/4-r};var Qe=new Array(64),On=new Array(123);for(Ne=0;Ne<64;)On[Qe[Ne]=Ne<26?Ne+65:Ne<52?Ne+71:Ne<62?Ne-4:Ne-59|43]=Ne++;var Ne;pt.encode=function(c,l,r){for(var e=null,t=[],n=0,o=0,f;l<r;){var y=c[l++];switch(o){case 0:t[n++]=Qe[y>>2],f=(y&3)<<4,o=1;break;case 1:t[n++]=Qe[f|y>>4],f=(y&15)<<2,o=2;break;case 2:t[n++]=Qe[f|y>>6],t[n++]=Qe[y&63],o=0;break}n>8191&&((e||(e=[])).push(String.fromCharCode.apply(String,t)),n=0)}return o&&(t[n++]=Qe[f],t[n++]=61,o===1&&(t[n++]=61)),e?(n&&e.push(String.fromCharCode.apply(String,t.slice(0,n))),e.join("")):String.fromCharCode.apply(String,t.slice(0,n))};var Sn="invalid encoding";pt.decode=function(c,l,r){for(var e=r,t=0,n,o=0;o<c.length;){var f=c.charCodeAt(o++);if(f===61&&t>1)break;if((f=On[f])===void 0)throw Error(Sn);switch(t){case 0:n=f,t=1;break;case 1:l[r++]=n<<2|(f&48)>>4,n=f,t=2;break;case 2:l[r++]=(n&15)<<4|(f&60)>>2,n=f,t=3;break;case 3:l[r++]=(n&3)<<6|f,t=0;break}}if(t===1)throw Error(Sn);return r-e};pt.test=function(c){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(c)}});var En=_e((io,An)=>{"use strict";An.exports=yt;function yt(){this._listeners={}}yt.prototype.on=function(c,l,r){return(this._listeners[c]||(this._listeners[c]=[])).push({fn:l,ctx:r||this}),this};yt.prototype.off=function(c,l){if(c===void 0)this._listeners={};else if(l===void 0)this._listeners[c]=[];else for(var r=this._listeners[c],e=0;e<r.length;)r[e].fn===l?r.splice(e,1):++e;return this};yt.prototype.emit=function(c){var l=this._listeners[c];if(l){for(var r=[],e=1;e<arguments.length;)r.push(arguments[e++]);for(e=0;e<l.length;)l[e].fn.apply(l[e++].ctx,r)}return this}});var Tn=_e((oo,Mn)=>{"use strict";Mn.exports=_n(_n);function _n(d){return typeof Float32Array!="undefined"?function(){var c=new Float32Array([-0]),l=new Uint8Array(c.buffer),r=l[3]===128;function e(f,y,O){c[0]=f,y[O]=l[0],y[O+1]=l[1],y[O+2]=l[2],y[O+3]=l[3]}function t(f,y,O){c[0]=f,y[O]=l[3],y[O+1]=l[2],y[O+2]=l[1],y[O+3]=l[0]}d.writeFloatLE=r?e:t,d.writeFloatBE=r?t:e;function n(f,y){return l[0]=f[y],l[1]=f[y+1],l[2]=f[y+2],l[3]=f[y+3],c[0]}function o(f,y){return l[3]=f[y],l[2]=f[y+1],l[1]=f[y+2],l[0]=f[y+3],c[0]}d.readFloatLE=r?n:o,d.readFloatBE=r?o:n}():function(){function c(r,e,t,n){var o=e<0?1:0;if(o&&(e=-e),e===0)r(1/e>0?0:2147483648,t,n);else if(isNaN(e))r(2143289344,t,n);else if(e>34028234663852886e22)r((o<<31|2139095040)>>>0,t,n);else if(e<11754943508222875e-54)r((o<<31|Math.round(e/1401298464324817e-60))>>>0,t,n);else{var f=Math.floor(Math.log(e)/Math.LN2),y=Math.round(e*Math.pow(2,-f)*8388608)&8388607;r((o<<31|f+127<<23|y)>>>0,t,n)}}d.writeFloatLE=c.bind(null,kn),d.writeFloatBE=c.bind(null,gn);function l(r,e,t){var n=r(e,t),o=(n>>31)*2+1,f=n>>>23&255,y=n&8388607;return f===255?y?NaN:o*(1/0):f===0?o*1401298464324817e-60*y:o*Math.pow(2,f-150)*(y+8388608)}d.readFloatLE=l.bind(null,Dn),d.readFloatBE=l.bind(null,Pn)}(),typeof Float64Array!="undefined"?function(){var c=new Float64Array([-0]),l=new Uint8Array(c.buffer),r=l[7]===128;function e(f,y,O){c[0]=f,y[O]=l[0],y[O+1]=l[1],y[O+2]=l[2],y[O+3]=l[3],y[O+4]=l[4],y[O+5]=l[5],y[O+6]=l[6],y[O+7]=l[7]}function t(f,y,O){c[0]=f,y[O]=l[7],y[O+1]=l[6],y[O+2]=l[5],y[O+3]=l[4],y[O+4]=l[3],y[O+5]=l[2],y[O+6]=l[1],y[O+7]=l[0]}d.writeDoubleLE=r?e:t,d.writeDoubleBE=r?t:e;function n(f,y){return l[0]=f[y],l[1]=f[y+1],l[2]=f[y+2],l[3]=f[y+3],l[4]=f[y+4],l[5]=f[y+5],l[6]=f[y+6],l[7]=f[y+7],c[0]}function o(f,y){return l[7]=f[y],l[6]=f[y+1],l[5]=f[y+2],l[4]=f[y+3],l[3]=f[y+4],l[2]=f[y+5],l[1]=f[y+6],l[0]=f[y+7],c[0]}d.readDoubleLE=r?n:o,d.readDoubleBE=r?o:n}():function(){function c(r,e,t,n,o,f){var y=n<0?1:0;if(y&&(n=-n),n===0)r(0,o,f+e),r(1/n>0?0:2147483648,o,f+t);else if(isNaN(n))r(0,o,f+e),r(2146959360,o,f+t);else if(n>17976931348623157e292)r(0,o,f+e),r((y<<31|2146435072)>>>0,o,f+t);else{var O;if(n<22250738585072014e-324)O=n/5e-324,r(O>>>0,o,f+e),r((y<<31|O/4294967296)>>>0,o,f+t);else{var b=Math.floor(Math.log(n)/Math.LN2);b===1024&&(b=1023),O=n*Math.pow(2,-b),r(O*4503599627370496>>>0,o,f+e),r((y<<31|b+1023<<20|O*1048576&1048575)>>>0,o,f+t)}}}d.writeDoubleLE=c.bind(null,kn,0,4),d.writeDoubleBE=c.bind(null,gn,4,0);function l(r,e,t,n,o){var f=r(n,o+e),y=r(n,o+t),O=(y>>31)*2+1,b=y>>>20&2047,u=4294967296*(y&1048575)+f;return b===2047?u?NaN:O*(1/0):b===0?O*5e-324*u:O*Math.pow(2,b-1075)*(u+4503599627370496)}d.readDoubleLE=l.bind(null,Dn,0,4),d.readDoubleBE=l.bind(null,Pn,4,0)}(),d}function kn(d,c,l){c[l]=d&255,c[l+1]=d>>>8&255,c[l+2]=d>>>16&255,c[l+3]=d>>>24}function gn(d,c,l){c[l]=d>>>24,c[l+1]=d>>>16&255,c[l+2]=d>>>8&255,c[l+3]=d&255}function Dn(d,c){return(d[c]|d[c+1]<<8|d[c+2]<<16|d[c+3]<<24)>>>0}function Pn(d,c){return(d[c]<<24|d[c+1]<<16|d[c+2]<<8|d[c+3])>>>0}});var jn=_e((exports,module)=>{"use strict";module.exports=inquire;function inquire(moduleName){try{var mod=eval("quire".replace(/^/,"re"))(moduleName);if(mod&&(mod.length||Object.keys(mod).length))return mod}catch(d){}return null}});var xn=_e(Bn=>{"use strict";var Nt=Bn;Nt.length=function(c){for(var l=0,r=0,e=0;e<c.length;++e)r=c.charCodeAt(e),r<128?l+=1:r<2048?l+=2:(r&64512)==55296&&(c.charCodeAt(e+1)&64512)==56320?(++e,l+=4):l+=3;return l};Nt.read=function(c,l,r){var e=r-l;if(e<1)return"";for(var t=null,n=[],o=0,f;l<r;)f=c[l++],f<128?n[o++]=f:f>191&&f<224?n[o++]=(f&31)<<6|c[l++]&63:f>239&&f<365?(f=((f&7)<<18|(c[l++]&63)<<12|(c[l++]&63)<<6|c[l++]&63)-65536,n[o++]=55296+(f>>10),n[o++]=56320+(f&1023)):n[o++]=(f&15)<<12|(c[l++]&63)<<6|c[l++]&63,o>8191&&((t||(t=[])).push(String.fromCharCode.apply(String,n)),o=0);return t?(o&&t.push(String.fromCharCode.apply(String,n.slice(0,o))),t.join("")):String.fromCharCode.apply(String,n.slice(0,o))};Nt.write=function(c,l,r){for(var e=r,t,n,o=0;o<c.length;++o)t=c.charCodeAt(o),t<128?l[r++]=t:t<2048?(l[r++]=t>>6|192,l[r++]=t&63|128):(t&64512)==55296&&((n=c.charCodeAt(o+1))&64512)==56320?(t=65536+((t&1023)<<10)+(n&1023),++o,l[r++]=t>>18|240,l[r++]=t>>12&63|128,l[r++]=t>>6&63|128,l[r++]=t&63|128):(l[r++]=t>>12|224,l[r++]=t>>6&63|128,l[r++]=t&63|128);return r-e}});var Rn=_e((co,Nn)=>{"use strict";Nn.exports=Kr;function Kr(d,c,l){var r=l||8192,e=r>>>1,t=null,n=r;return function(f){if(f<1||f>e)return d(f);n+f>r&&(t=d(r),n=0);var y=c.call(t,n,n+=f);return n&7&&(n=(n|7)+1),y}}});var Ln=_e((ao,Un)=>{"use strict";Un.exports=Me;var rt=$e();function Me(d,c){this.lo=d>>>0,this.hi=c>>>0}var qe=Me.zero=new Me(0,0);qe.toNumber=function(){return 0};qe.zzEncode=qe.zzDecode=function(){return this};qe.length=function(){return 1};var $r=Me.zeroHash="\0\0\0\0\0\0\0\0";Me.fromNumber=function(c){if(c===0)return qe;var l=c<0;l&&(c=-c);var r=c>>>0,e=(c-r)/4294967296>>>0;return l&&(e=~e>>>0,r=~r>>>0,++r>4294967295&&(r=0,++e>4294967295&&(e=0))),new Me(r,e)};Me.from=function(c){if(typeof c=="number")return Me.fromNumber(c);if(rt.isString(c))if(rt.Long)c=rt.Long.fromString(c);else return Me.fromNumber(parseInt(c,10));return c.low||c.high?new Me(c.low>>>0,c.high>>>0):qe};Me.prototype.toNumber=function(c){if(!c&&this.hi>>>31){var l=~this.lo+1>>>0,r=~this.hi>>>0;return l||(r=r+1>>>0),-(l+r*4294967296)}return this.lo+this.hi*4294967296};Me.prototype.toLong=function(c){return rt.Long?new rt.Long(this.lo|0,this.hi|0,Boolean(c)):{low:this.lo|0,high:this.hi|0,unsigned:Boolean(c)}};var Ke=String.prototype.charCodeAt;Me.fromHash=function(c){return c===$r?qe:new Me((Ke.call(c,0)|Ke.call(c,1)<<8|Ke.call(c,2)<<16|Ke.call(c,3)<<24)>>>0,(Ke.call(c,4)|Ke.call(c,5)<<8|Ke.call(c,6)<<16|Ke.call(c,7)<<24)>>>0)};Me.prototype.toHash=function(){return String.fromCharCode(this.lo&255,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,this.hi&255,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)};Me.prototype.zzEncode=function(){var c=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^c)>>>0,this.lo=(this.lo<<1^c)>>>0,this};Me.prototype.zzDecode=function(){var c=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^c)>>>0,this.hi=(this.hi>>>1^c)>>>0,this};Me.prototype.length=function(){var c=this.lo,l=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return r===0?l===0?c<16384?c<128?1:2:c<2097152?3:4:l<16384?l<128?5:6:l<2097152?7:8:r<128?9:10}});var $e=_e(Rt=>{"use strict";var Z=Rt;Z.asPromise=wn();Z.base64=In();Z.EventEmitter=En();Z.float=Tn();Z.inquire=jn();Z.utf8=xn();Z.pool=Rn();Z.LongBits=Ln();Z.isNode=Boolean(typeof __webpack_require__.g!="undefined"&&__webpack_require__.g&&__webpack_require__.g.process&&__webpack_require__.g.process.versions&&__webpack_require__.g.process.versions.node);Z.global=Z.isNode&&__webpack_require__.g||typeof window!="undefined"&&window||typeof self!="undefined"&&self||Rt;Z.emptyArray=Object.freeze?Object.freeze([]):[];Z.emptyObject=Object.freeze?Object.freeze({}):{};Z.isInteger=Number.isInteger||function(c){return typeof c=="number"&&isFinite(c)&&Math.floor(c)===c};Z.isString=function(c){return typeof c=="string"||c instanceof String};Z.isObject=function(c){return c&&typeof c=="object"};Z.isset=Z.isSet=function(c,l){var r=c[l];return r!=null&&c.hasOwnProperty(l)?typeof r!="object"||(Array.isArray(r)?r.length:Object.keys(r).length)>0:!1};Z.Buffer=function(){try{var d=Z.inquire("buffer").Buffer;return d.prototype.utf8Write?d:null}catch{return null}}();Z._Buffer_from=null;Z._Buffer_allocUnsafe=null;Z.newBuffer=function(c){return typeof c=="number"?Z.Buffer?Z._Buffer_allocUnsafe(c):new Z.Array(c):Z.Buffer?Z._Buffer_from(c):typeof Uint8Array=="undefined"?c:new Uint8Array(c)};Z.Array=typeof Uint8Array!="undefined"?Uint8Array:Array;Z.Long=Z.global.dcodeIO&&Z.global.dcodeIO.Long||Z.global.Long||Z.inquire("long");Z.key2Re=/^true|false|0|1$/;Z.key32Re=/^-?(?:0|[1-9][0-9]*)$/;Z.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;Z.longToHash=function(c){return c?Z.LongBits.from(c).toHash():Z.LongBits.zeroHash};Z.longFromHash=function(c,l){var r=Z.LongBits.fromHash(c);return Z.Long?Z.Long.fromBits(r.lo,r.hi,l):r.toNumber(Boolean(l))};function Vn(d,c,l){for(var r=Object.keys(c),e=0;e<r.length;++e)(d[r[e]]===void 0||!l)&&(d[r[e]]=c[r[e]]);return d}Z.merge=Vn;Z.lcFirst=function(c){return c.charAt(0).toLowerCase()+c.substring(1)};function Cn(d){function c(l,r){if(!(this instanceof c))return new c(l,r);Object.defineProperty(this,"message",{get:function(){return l}}),Error.captureStackTrace?Error.captureStackTrace(this,c):Object.defineProperty(this,"stack",{value:new Error().stack||""}),r&&Vn(this,r)}return(c.prototype=Object.create(Error.prototype)).constructor=c,Object.defineProperty(c.prototype,"name",{get:function(){return d}}),c.prototype.toString=function(){return this.name+": "+this.message},c}Z.newError=Cn;Z.ProtocolError=Cn("ProtocolError");Z.oneOfGetter=function(c){for(var l={},r=0;r<c.length;++r)l[c[r]]=1;return function(){for(var e=Object.keys(this),t=e.length-1;t>-1;--t)if(l[e[t]]===1&&this[e[t]]!==void 0&&this[e[t]]!==null)return e[t]}};Z.oneOfSetter=function(c){return function(l){for(var r=0;r<c.length;++r)c[r]!==l&&delete this[c[r]]}};Z.toJSONOptions={longs:String,enums:String,bytes:String,json:!0};Z._configure=function(){var d=Z.Buffer;if(!d){Z._Buffer_from=Z._Buffer_allocUnsafe=null;return}Z._Buffer_from=d.from!==Uint8Array.from&&d.from||function(l,r){return new d(l,r)},Z._Buffer_allocUnsafe=d.allocUnsafe||function(l){return new d(l)}}});var Wt=_e((fo,Kn)=>{"use strict";Kn.exports=pe;var xe=$e(),Ut,vt=xe.LongBits,Fn=xe.base64,Hn=xe.utf8;function it(d,c,l){this.fn=d,this.len=c,this.next=void 0,this.val=l}function Lt(){}function Jr(d){this.head=d.head,this.tail=d.tail,this.len=d.len,this.next=d.states}function pe(){this.len=0,this.head=new it(Lt,0,0),this.tail=this.head,this.states=null}var Wn=function(){return xe.Buffer?function(){return(pe.create=function(){return new Ut})()}:function(){return new pe}};pe.create=Wn();pe.alloc=function(c){return new xe.Array(c)};xe.Array!==Array&&(pe.alloc=xe.pool(pe.alloc,xe.Array.prototype.subarray));pe.prototype._push=function(c,l,r){return this.tail=this.tail.next=new it(c,l,r),this.len+=l,this};function Vt(d,c,l){c[l]=d&255}function qr(d,c,l){for(;d>127;)c[l++]=d&127|128,d>>>=7;c[l]=d}function Ct(d,c){this.len=d,this.next=void 0,this.val=c}Ct.prototype=Object.create(it.prototype);Ct.prototype.fn=qr;pe.prototype.uint32=function(c){return this.len+=(this.tail=this.tail.next=new Ct((c=c>>>0)<128?1:c<16384?2:c<2097152?3:c<268435456?4:5,c)).len,this};pe.prototype.int32=function(c){return c<0?this._push(Ft,10,vt.fromNumber(c)):this.uint32(c)};pe.prototype.sint32=function(c){return this.uint32((c<<1^c>>31)>>>0)};function Ft(d,c,l){for(;d.hi;)c[l++]=d.lo&127|128,d.lo=(d.lo>>>7|d.hi<<25)>>>0,d.hi>>>=7;for(;d.lo>127;)c[l++]=d.lo&127|128,d.lo=d.lo>>>7;c[l++]=d.lo}pe.prototype.uint64=function(c){var l=vt.from(c);return this._push(Ft,l.length(),l)};pe.prototype.int64=pe.prototype.uint64;pe.prototype.sint64=function(c){var l=vt.from(c).zzEncode();return this._push(Ft,l.length(),l)};pe.prototype.bool=function(c){return this._push(Vt,1,c?1:0)};function Ht(d,c,l){c[l]=d&255,c[l+1]=d>>>8&255,c[l+2]=d>>>16&255,c[l+3]=d>>>24}pe.prototype.fixed32=function(c){return this._push(Ht,4,c>>>0)};pe.prototype.sfixed32=pe.prototype.fixed32;pe.prototype.fixed64=function(c){var l=vt.from(c);return this._push(Ht,4,l.lo)._push(Ht,4,l.hi)};pe.prototype.sfixed64=pe.prototype.fixed64;pe.prototype.float=function(c){return this._push(xe.float.writeFloatLE,4,c)};pe.prototype.double=function(c){return this._push(xe.float.writeDoubleLE,8,c)};var Gr=xe.Array.prototype.set?function(c,l,r){l.set(c,r)}:function(c,l,r){for(var e=0;e<c.length;++e)l[r+e]=c[e]};pe.prototype.bytes=function(c){var l=c.length>>>0;if(!l)return this._push(Vt,1,0);if(xe.isString(c)){var r=pe.alloc(l=Fn.length(c));Fn.decode(c,r,0),c=r}return this.uint32(l)._push(Gr,l,c)};pe.prototype.string=function(c){var l=Hn.length(c);return l?this.uint32(l)._push(Hn.write,l,c):this._push(Vt,1,0)};pe.prototype.fork=function(){return this.states=new Jr(this),this.head=this.tail=new it(Lt,0,0),this.len=0,this};pe.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new it(Lt,0,0),this.len=0),this};pe.prototype.ldelim=function(){var c=this.head,l=this.tail,r=this.len;return this.reset().uint32(r),r&&(this.tail.next=c.next,this.tail=l,this.len+=r),this};pe.prototype.finish=function(){for(var c=this.head.next,l=this.constructor.alloc(this.len),r=0;c;)c.fn(c.val,l,r),r+=c.len,c=c.next;return l};pe._configure=function(d){Ut=d,pe.create=Wn(),Ut._configure()}});var qn=_e((so,Jn)=>{"use strict";Jn.exports=Ue;var $n=Wt();(Ue.prototype=Object.create($n.prototype)).constructor=Ue;var Je=$e();function Ue(){$n.call(this)}Ue._configure=function(){Ue.alloc=Je._Buffer_allocUnsafe,Ue.writeBytesBuffer=Je.Buffer&&Je.Buffer.prototype instanceof Uint8Array&&Je.Buffer.prototype.set.name==="set"?function(c,l,r){l.set(c,r)}:function(c,l,r){if(c.copy)c.copy(l,r,0,c.length);else for(var e=0;e<c.length;)l[r++]=c[e++]}};Ue.prototype.bytes=function(c){Je.isString(c)&&(c=Je._Buffer_from(c,"base64"));var l=c.length>>>0;return this.uint32(l),l&&this._push(Ue.writeBytesBuffer,l,c),this};function zr(d,c,l){d.length<40?Je.utf8.write(d,c,l):c.utf8Write?c.utf8Write(d,l):c.write(d,l)}Ue.prototype.string=function(c){var l=Je.Buffer.byteLength(c);return this.uint32(l),l&&this._push(zr,l,c),this};Ue._configure()});var Jt=_e((ho,Zn)=>{"use strict";Zn.exports=Ie;var Le=$e(),Kt,Gn=Le.LongBits,Yr=Le.utf8;function Re(d,c){return RangeError("index out of range: "+d.pos+" + "+(c||1)+" > "+d.len)}function Ie(d){this.buf=d,this.pos=0,this.len=d.length}var zn=typeof Uint8Array!="undefined"?function(c){if(c instanceof Uint8Array||Array.isArray(c))return new Ie(c);throw Error("illegal buffer")}:function(c){if(Array.isArray(c))return new Ie(c);throw Error("illegal buffer")},Yn=function(){return Le.Buffer?function(l){return(Ie.create=function(e){return Le.Buffer.isBuffer(e)?new Kt(e):zn(e)})(l)}:zn};Ie.create=Yn();Ie.prototype._slice=Le.Array.prototype.subarray||Le.Array.prototype.slice;Ie.prototype.uint32=function(){var c=4294967295;return function(){if(c=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(c=(c|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(c=(c|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(c=(c|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(c=(c|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return c;if((this.pos+=5)>this.len)throw this.pos=this.len,Re(this,10);return c}}();Ie.prototype.int32=function(){return this.uint32()|0};Ie.prototype.sint32=function(){var c=this.uint32();return c>>>1^-(c&1)|0};function $t(){var d=new Gn(0,0),c=0;if(this.len-this.pos>4){for(;c<4;++c)if(d.lo=(d.lo|(this.buf[this.pos]&127)<<c*7)>>>0,this.buf[this.pos++]<128)return d;if(d.lo=(d.lo|(this.buf[this.pos]&127)<<28)>>>0,d.hi=(d.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return d;c=0}else{for(;c<3;++c){if(this.pos>=this.len)throw Re(this);if(d.lo=(d.lo|(this.buf[this.pos]&127)<<c*7)>>>0,this.buf[this.pos++]<128)return d}return d.lo=(d.lo|(this.buf[this.pos++]&127)<<c*7)>>>0,d}if(this.len-this.pos>4){for(;c<5;++c)if(d.hi=(d.hi|(this.buf[this.pos]&127)<<c*7+3)>>>0,this.buf[this.pos++]<128)return d}else for(;c<5;++c){if(this.pos>=this.len)throw Re(this);if(d.hi=(d.hi|(this.buf[this.pos]&127)<<c*7+3)>>>0,this.buf[this.pos++]<128)return d}throw Error("invalid varint encoding")}Ie.prototype.bool=function(){return this.uint32()!==0};function bt(d,c){return(d[c-4]|d[c-3]<<8|d[c-2]<<16|d[c-1]<<24)>>>0}Ie.prototype.fixed32=function(){if(this.pos+4>this.len)throw Re(this,4);return bt(this.buf,this.pos+=4)};Ie.prototype.sfixed32=function(){if(this.pos+4>this.len)throw Re(this,4);return bt(this.buf,this.pos+=4)|0};function Xn(){if(this.pos+8>this.len)throw Re(this,8);return new Gn(bt(this.buf,this.pos+=4),bt(this.buf,this.pos+=4))}Ie.prototype.float=function(){if(this.pos+4>this.len)throw Re(this,4);var c=Le.float.readFloatLE(this.buf,this.pos);return this.pos+=4,c};Ie.prototype.double=function(){if(this.pos+8>this.len)throw Re(this,4);var c=Le.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,c};Ie.prototype.bytes=function(){var c=this.uint32(),l=this.pos,r=this.pos+c;if(r>this.len)throw Re(this,c);return this.pos+=c,Array.isArray(this.buf)?this.buf.slice(l,r):l===r?new this.buf.constructor(0):this._slice.call(this.buf,l,r)};Ie.prototype.string=function(){var c=this.bytes();return Yr.read(c,0,c.length)};Ie.prototype.skip=function(c){if(typeof c=="number"){if(this.pos+c>this.len)throw Re(this,c);this.pos+=c}else do if(this.pos>=this.len)throw Re(this);while(this.buf[this.pos++]&128);return this};Ie.prototype.skipType=function(d){switch(d){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(d=this.uint32()&7)!=4;)this.skipType(d);break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+d+" at offset "+this.pos)}return this};Ie._configure=function(d){Kt=d,Ie.create=Yn(),Kt._configure();var c=Le.Long?"toLong":"toNumber";Le.merge(Ie.prototype,{int64:function(){return $t.call(this)[c](!1)},uint64:function(){return $t.call(this)[c](!0)},sint64:function(){return $t.call(this).zzDecode()[c](!1)},fixed64:function(){return Xn.call(this)[c](!0)},sfixed64:function(){return Xn.call(this)[c](!1)}})}});var nr=_e((po,tr)=>{"use strict";tr.exports=Ge;var Qn=Jt();(Ge.prototype=Object.create(Qn.prototype)).constructor=Ge;var er=$e();function Ge(d){Qn.call(this,d)}Ge._configure=function(){er.Buffer&&(Ge.prototype._slice=er.Buffer.prototype.slice)};Ge.prototype.string=function(){var c=this.uint32();return this.buf.utf8Slice?this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+c,this.len)):this.buf.toString("utf-8",this.pos,this.pos=Math.min(this.pos+c,this.len))};Ge._configure()});var ir=_e((yo,rr)=>{"use strict";rr.exports=ot;var qt=$e();(ot.prototype=Object.create(qt.EventEmitter.prototype)).constructor=ot;function ot(d,c,l){if(typeof d!="function")throw TypeError("rpcImpl must be a function");qt.EventEmitter.call(this),this.rpcImpl=d,this.requestDelimited=Boolean(c),this.responseDelimited=Boolean(l)}ot.prototype.rpcCall=function d(c,l,r,e,t){if(!e)throw TypeError("request must be specified");var n=this;if(!t)return qt.asPromise(d,n,c,l,r,e);if(!n.rpcImpl){setTimeout(function(){t(Error("already ended"))},0);return}try{return n.rpcImpl(c,l[n.requestDelimited?"encodeDelimited":"encode"](e).finish(),function(f,y){if(f)return n.emit("error",f,c),t(f);if(y===null){n.end(!0);return}if(!(y instanceof r))try{y=r[n.responseDelimited?"decodeDelimited":"decode"](y)}catch(O){return n.emit("error",O,c),t(O)}return n.emit("data",y,c),t(null,y)})}catch(o){n.emit("error",o,c),setTimeout(function(){t(o)},0);return}};ot.prototype.end=function(c){return this.rpcImpl&&(c||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}});var lr=_e(or=>{"use strict";var Xr=or;Xr.Service=ir()});var ar=_e((bo,cr)=>{"use strict";cr.exports={}});var sr=_e(fr=>{"use strict";var je=fr;je.build="minimal";je.Writer=Wt();je.BufferWriter=qn();je.Reader=Jt();je.BufferReader=nr();je.util=$e();je.rpc=lr();je.roots=ar();je.configure=ur;function ur(){je.util._configure(),je.Writer._configure(je.BufferWriter),je.Reader._configure(je.BufferReader)}ur()});var hr=_e((Oo,dr)=>{"use strict";dr.exports=sr()});var pr=_e((lt,wt)=>{(function(d,c){"use strict";var l="1.0.2",r="",e="?",t="function",n="undefined",o="object",f="string",y="major",O="model",b="name",u="type",p="vendor",I="version",P="architecture",g="console",w="mobile",v="tablet",m="smarttv",S="wearable",_="embedded",B=255,R="Amazon",$="Apple",F="ASUS",C="BlackBerry",Y="Browser",N="Chrome",H="Edge",J="Firefox",ce="Google",Q="Huawei",q="LG",oe="Microsoft",k="Motorola",A="Opera",j="Samsung",L="Sony",K="Xiaomi",G="Zebra",z="Facebook",re=function(ne,he){var a={};for(var s in ne)he[s]&&he[s].length%2==0?a[s]=he[s].concat(ne[s]):a[s]=ne[s];return a},te=function(ne){for(var he={},a=0;a<ne.length;a++)he[ne[a].toUpperCase()]=ne[a];return he},ue=function(ne,he){return typeof ne===f?le(he).indexOf(le(ne))!==-1:!1},le=function(ne){return ne.toLowerCase()},D=function(ne){return typeof ne===f?ne.replace(/[^\d\.]/g,r).split(".")[0]:c},E=function(ne,he){if(typeof ne===f)return ne=ne.replace(/^\s\s*/,r).replace(/\s\s*$/,r),typeof he===n?ne:ne.substring(0,B)},W=function(ne,he){for(var a=0,s,h,M,T,x,V;a<he.length&&!x;){var ie=he[a],se=he[a+1];for(s=h=0;s<ie.length&&!x;)if(x=ie[s++].exec(ne),x)for(M=0;M<se.length;M++)V=x[++h],T=se[M],typeof T===o&&T.length>0?T.length===2?typeof T[1]==t?this[T[0]]=T[1].call(this,V):this[T[0]]=T[1]:T.length===3?typeof T[1]===t&&!(T[1].exec&&T[1].test)?this[T[0]]=V?T[1].call(this,V,T[2]):c:this[T[0]]=V?V.replace(T[1],T[2]):c:T.length===4&&(this[T[0]]=V?T[3].call(this,V.replace(T[1],T[2])):c):this[T]=V||c;a+=2}},X=function(ne,he){for(var a in he)if(typeof he[a]===o&&he[a].length>0){for(var s=0;s<he[a].length;s++)if(ue(he[a][s],ne))return a===e?c:a}else if(ue(he[a],ne))return a===e?c:a;return ne},ve={"1.0":"/8","1.2":"/1","1.3":"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"},Oe={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0","2000":"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0","7":"NT 6.1","8":"NT 6.2","8.1":"NT 6.3","10":["NT 6.4","NT 10.0"],RT:"ARM"},ee={browser:[[/\b(?:crmo|crios)\/([\w\.]+)/i],[I,[b,"Chrome"]],[/edg(?:e|ios|a)?\/([\w\.]+)/i],[I,[b,"Edge"]],[/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],[b,I],[/opios[\/ ]+([\w\.]+)/i],[I,[b,A+" Mini"]],[/\bopr\/([\w\.]+)/i],[I,[b,A]],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,/(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,/(ba?idubrowser)[\/ ]?([\w\.]+)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([-\w\.]+)/i,/(weibo)__([\d\.]+)/i],[b,I],[/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],[I,[b,"UC"+Y]],[/\bqbcore\/([\w\.]+)/i],[I,[b,"WeChat(Win) Desktop"]],[/micromessenger\/([\w\.]+)/i],[I,[b,"WeChat"]],[/konqueror\/([\w\.]+)/i],[I,[b,"Konqueror"]],[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],[I,[b,"IE"]],[/yabrowser\/([\w\.]+)/i],[I,[b,"Yandex"]],[/(avast|avg)\/([\w\.]+)/i],[[b,/(.+)/,"$1 Secure "+Y],I],[/\bfocus\/([\w\.]+)/i],[I,[b,J+" Focus"]],[/\bopt\/([\w\.]+)/i],[I,[b,A+" Touch"]],[/coc_coc\w+\/([\w\.]+)/i],[I,[b,"Coc Coc"]],[/dolfin\/([\w\.]+)/i],[I,[b,"Dolphin"]],[/coast\/([\w\.]+)/i],[I,[b,A+" Coast"]],[/miuibrowser\/([\w\.]+)/i],[I,[b,"MIUI "+Y]],[/fxios\/([-\w\.]+)/i],[I,[b,J]],[/\bqihu|(qi?ho?o?|360)browser/i],[[b,"360 "+Y]],[/(oculus|samsung|sailfish)browser\/([\w\.]+)/i],[[b,/(.+)/,"$1 "+Y],I],[/(comodo_dragon)\/([\w\.]+)/i],[[b,/_/g," "],I],[/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i],[b,I],[/(metasr)[\/ ]?([\w\.]+)/i,/(lbbrowser)/i],[b],[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],[[b,z],I],[/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(chromium|instagram)[\/ ]([-\w\.]+)/i],[b,I],[/\bgsa\/([\w\.]+) .*safari\//i],[I,[b,"GSA"]],[/headlesschrome(?:\/([\w\.]+)| )/i],[I,[b,N+" Headless"]],[/ wv\).+(chrome)\/([\w\.]+)/i],[[b,N+" WebView"],I],[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],[I,[b,"Android "+Y]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],[b,I],[/version\/([\w\.]+) .*mobile\/\w+ (safari)/i],[I,[b,"Mobile Safari"]],[/version\/([\w\.]+) .*(mobile ?safari|safari)/i],[I,b],[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],[b,[I,X,ve]],[/(webkit|khtml)\/([\w\.]+)/i],[b,I],[/(navigator|netscape\d?)\/([-\w\.]+)/i],[[b,"Netscape"],I],[/mobile vr; rv:([\w\.]+)\).+firefox/i],[I,[b,J+" Reality"]],[/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/(links) \(([\w\.]+)/i],[b,I]],cpu:[[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],[[P,"amd64"]],[/(ia32(?=;))/i],[[P,le]],[/((?:i[346]|x)86)[;\)]/i],[[P,"ia32"]],[/\b(aarch64|arm(v?8e?l?|_?64))\b/i],[[P,"arm64"]],[/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],[[P,"armhf"]],[/windows (ce|mobile); ppc;/i],[[P,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],[[P,/ower/,r,le]],[/(sun4\w)[;\)]/i],[[P,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],[[P,le]]],device:[[/\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],[O,[p,j],[u,v]],[/\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,/samsung[- ]([-\w]+)/i,/sec-(sgh\w+)/i],[O,[p,j],[u,w]],[/\((ip(?:hone|od)[\w ]*);/i],[O,[p,$],[u,w]],[/\((ipad);[-\w\),; ]+apple/i,/applecoremedia\/[\w\.]+ \((ipad)/i,/\b(ipad)\d\d?,\d\d?[;\]].+ios/i],[O,[p,$],[u,v]],[/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],[O,[p,Q],[u,v]],[/(?:huawei|honor)([-\w ]+)[;\)]/i,/\b(nexus 6p|\w{2,4}-[atu]?[ln][01259x][012359][an]?)\b(?!.+d\/s)/i],[O,[p,Q],[u,w]],[/\b(poco[\w ]+)(?: bui|\))/i,/\b; (\w+) build\/hm\1/i,/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,/\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i],[[O,/_/g," "],[p,K],[u,w]],[/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],[[O,/_/g," "],[p,K],[u,v]],[/; (\w+) bui.+ oppo/i,/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],[O,[p,"OPPO"],[u,w]],[/vivo (\w+)(?: bui|\))/i,/\b(v[12]\d{3}\w?[at])(?: bui|;)/i],[O,[p,"Vivo"],[u,w]],[/\b(rmx[12]\d{3})(?: bui|;|\))/i],[O,[p,"Realme"],[u,w]],[/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,/\bmot(?:orola)?[- ](\w*)/i,/((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],[O,[p,k],[u,w]],[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],[O,[p,k],[u,v]],[/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],[O,[p,q],[u,v]],[/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,/\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,/\blg-?([\d\w]+) bui/i],[O,[p,q],[u,w]],[/(ideatab[-\w ]+)/i,/lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i],[O,[p,"Lenovo"],[u,v]],[/(?:maemo|nokia).*(n900|lumia \d+)/i,/nokia[-_ ]?([-\w\.]*)/i],[[O,/_/g," "],[p,"Nokia"],[u,w]],[/(pixel c)\b/i],[O,[p,ce],[u,v]],[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],[O,[p,ce],[u,w]],[/droid.+ ([c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[O,[p,L],[u,w]],[/sony tablet [ps]/i,/\b(?:sony)?sgp\w+(?: bui|\))/i],[[O,"Xperia Tablet"],[p,L],[u,v]],[/ (kb2005|in20[12]5|be20[12][59])\b/i,/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],[O,[p,"OnePlus"],[u,w]],[/(alexa)webm/i,/(kf[a-z]{2}wi)( bui|\))/i,/(kf[a-z]+)( bui|\)).+silk\//i],[O,[p,R],[u,v]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],[[O,/(.+)/g,"Fire Phone $1"],[p,R],[u,w]],[/(playbook);[-\w\),; ]+(rim)/i],[O,p,[u,v]],[/\b((?:bb[a-f]|st[hv])100-\d)/i,/\(bb10; (\w+)/i],[O,[p,C],[u,w]],[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],[O,[p,F],[u,v]],[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],[O,[p,F],[u,w]],[/(nexus 9)/i],[O,[p,"HTC"],[u,v]],[/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,/(alcatel|geeksphone|nexian|panasonic|sony)[-_ ]?([-\w]*)/i],[p,[O,/_/g," "],[u,w]],[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],[O,[p,"Acer"],[u,v]],[/droid.+; (m[1-5] note) bui/i,/\bmz-([-\w]{2,})/i],[O,[p,"Meizu"],[u,w]],[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],[O,[p,"Sharp"],[u,w]],[/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,/(hp) ([\w ]+\w)/i,/(asus)-?(\w+)/i,/(microsoft); (lumia[\w ]+)/i,/(lenovo)[-_ ]?([-\w]+)/i,/(jolla)/i,/(oppo) ?([\w ]+) bui/i],[p,O,[u,w]],[/(archos) (gamepad2?)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\/([\w\.]+)/i,/(nook)[\w ]+build\/(\w+)/i,/(dell) (strea[kpr\d ]*[\dko])/i,/(le[- ]+pan)[- ]+(\w{1,9}) bui/i,/(trinity)[- ]*(t\d{3}) bui/i,/(gigaset)[- ]+(q\w{1,9}) bui/i,/(vodafone) ([\w ]+)(?:\)| bui)/i],[p,O,[u,v]],[/(surface duo)/i],[O,[p,oe],[u,v]],[/droid [\d\.]+; (fp\du?)(?: b|\))/i],[O,[p,"Fairphone"],[u,w]],[/(u304aa)/i],[O,[p,"AT&T"],[u,w]],[/\bsie-(\w*)/i],[O,[p,"Siemens"],[u,w]],[/\b(rct\w+) b/i],[O,[p,"RCA"],[u,v]],[/\b(venue[\d ]{2,7}) b/i],[O,[p,"Dell"],[u,v]],[/\b(q(?:mv|ta)\w+) b/i],[O,[p,"Verizon"],[u,v]],[/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],[O,[p,"Barnes & Noble"],[u,v]],[/\b(tm\d{3}\w+) b/i],[O,[p,"NuVision"],[u,v]],[/\b(k88) b/i],[O,[p,"ZTE"],[u,v]],[/\b(nx\d{3}j) b/i],[O,[p,"ZTE"],[u,w]],[/\b(gen\d{3}) b.+49h/i],[O,[p,"Swiss"],[u,w]],[/\b(zur\d{3}) b/i],[O,[p,"Swiss"],[u,v]],[/\b((zeki)?tb.*\b) b/i],[O,[p,"Zeki"],[u,v]],[/\b([yr]\d{2}) b/i,/\b(dragon[- ]+touch |dt)(\w{5}) b/i],[[p,"Dragon Touch"],O,[u,v]],[/\b(ns-?\w{0,9}) b/i],[O,[p,"Insignia"],[u,v]],[/\b((nxa|next)-?\w{0,9}) b/i],[O,[p,"NextBook"],[u,v]],[/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],[[p,"Voice"],O,[u,w]],[/\b(lvtel\-)?(v1[12]) b/i],[[p,"LvTel"],O,[u,w]],[/\b(ph-1) /i],[O,[p,"Essential"],[u,w]],[/\b(v(100md|700na|7011|917g).*\b) b/i],[O,[p,"Envizen"],[u,v]],[/\b(trio[-\w\. ]+) b/i],[O,[p,"MachSpeed"],[u,v]],[/\btu_(1491) b/i],[O,[p,"Rotor"],[u,v]],[/(shield[\w ]+) b/i],[O,[p,"Nvidia"],[u,v]],[/(sprint) (\w+)/i],[p,O,[u,w]],[/(kin\.[onetw]{3})/i],[[O,/\./g," "],[p,oe],[u,w]],[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],[O,[p,G],[u,v]],[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],[O,[p,G],[u,w]],[/(ouya)/i,/(nintendo) ([wids3utch]+)/i],[p,O,[u,g]],[/droid.+; (shield) bui/i],[O,[p,"Nvidia"],[u,g]],[/(playstation [345portablevi]+)/i],[O,[p,L],[u,g]],[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],[O,[p,oe],[u,g]],[/smart-tv.+(samsung)/i],[p,[u,m]],[/hbbtv.+maple;(\d+)/i],[[O,/^/,"SmartTV"],[p,j],[u,m]],[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],[[p,q],[u,m]],[/(apple) ?tv/i],[p,[O,$+" TV"],[u,m]],[/crkey/i],[[O,N+"cast"],[p,ce],[u,m]],[/droid.+aft(\w)( bui|\))/i],[O,[p,R],[u,m]],[/\(dtv[\);].+(aquos)/i],[O,[p,"Sharp"],[u,m]],[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,/hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i],[[p,E],[O,E],[u,m]],[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],[[u,m]],[/((pebble))app/i],[p,O,[u,S]],[/droid.+; (glass) \d/i],[O,[p,ce],[u,S]],[/droid.+; (wt63?0{2,3})\)/i],[O,[p,G],[u,S]],[/(quest( 2)?)/i],[O,[p,z],[u,S]],[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],[p,[u,_]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i],[O,[u,w]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],[O,[u,v]],[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],[[u,v]],[/(phone|mobile(?:[;\/]| safari)|pda(?=.+windows ce))/i],[[u,w]],[/(android[-\w\. ]{0,9});.+buil/i],[O,[p,"Generic"]]],engine:[[/windows.+ edge\/([\w\.]+)/i],[I,[b,H+"HTML"]],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[I,[b,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/ekioh(flow)\/([\w\.]+)/i,/(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,/(icab)[\/ ]([23]\.[\d\.]+)/i],[b,I],[/rv\:([\w\.]{1,9})\b.+(gecko)/i],[I,b]],os:[[/microsoft (windows) (vista|xp)/i],[b,I],[/(windows) nt 6\.2; (arm)/i,/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,/(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i],[b,[I,X,Oe]],[/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],[[b,"Windows"],[I,X,Oe]],[/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,/cfnetwork\/.+darwin/i],[[I,/_/g,"."],[b,"iOS"]],[/(mac os x) ?([\w\. ]*)/i,/(macintosh|mac_powerpc\b)(?!.+haiku)/i],[[b,"Mac OS"],[I,/_/g,"."]],[/droid ([\w\.]+)\b.+(android[- ]x86)/i],[I,b],[/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,/(blackberry)\w*\/([\w\.]*)/i,/(tizen|kaios)[\/ ]([\w\.]+)/i,/\((series40);/i],[b,I],[/\(bb(10);/i],[I,[b,C]],[/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],[I,[b,"Symbian"]],[/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],[I,[b,J+" OS"]],[/web0s;.+rt(tv)/i,/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],[I,[b,"webOS"]],[/crkey\/([\d\.]+)/i],[I,[b,N+"cast"]],[/(cros) [\w]+ ([\w\.]+\w)/i],[[b,"Chromium OS"],I],[/(nintendo|playstation) ([wids345portablevuch]+)/i,/(xbox); +xbox ([^\);]+)/i,/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,/(mint)[\/\(\) ]?(\w*)/i,/(mageia|vectorlinux)[; ]/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,/(hurd|linux) ?([\w\.]*)/i,/(gnu) ?([\w\.]*)/i,/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,/(haiku) (\w+)/i],[b,I],[/(sunos) ?([\w\.\d]*)/i],[[b,"Solaris"],I],[/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,/(aix) ((\d)(?=\.|\)| )[\w\.])*/i,/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,/(unix) ?([\w\.]*)/i],[b,I]]},fe=function(ne,he){if(typeof ne===o&&(he=ne,ne=c),!(this instanceof fe))return new fe(ne,he).getResult();var a=ne||(typeof d!==n&&d.navigator&&d.navigator.userAgent?d.navigator.userAgent:r),s=he?re(ee,he):ee;return this.getBrowser=function(){var h={};return h[b]=c,h[I]=c,W.call(h,a,s.browser),h.major=D(h.version),h},this.getCPU=function(){var h={};return h[P]=c,W.call(h,a,s.cpu),h},this.getDevice=function(){var h={};return h[p]=c,h[O]=c,h[u]=c,W.call(h,a,s.device),h},this.getEngine=function(){var h={};return h[b]=c,h[I]=c,W.call(h,a,s.engine),h},this.getOS=function(){var h={};return h[b]=c,h[I]=c,W.call(h,a,s.os),h},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return a},this.setUA=function(h){return a=typeof h===f&&h.length>B?E(h,B):h,this},this.setUA(a),this};fe.VERSION=l,fe.BROWSER=te([b,I,y]),fe.CPU=te([P]),fe.DEVICE=te([O,p,u,g,w,m,v,S,_]),fe.ENGINE=fe.OS=te([b,I]),typeof lt!==n?(typeof wt!==n&&wt.exports&&(lt=wt.exports=fe),lt.UAParser=fe):typeof define===t&&__webpack_require__.amdO?define(function(){return fe}):typeof d!==n&&(d.UAParser=fe);var de=typeof d!==n&&(d.jQuery||d.Zepto);if(de&&!de.ua){var Ae=new fe;de.ua=Ae.getResult(),de.ua.get=function(){return Ae.getUA()},de.ua.set=function(ne){Ae.setUA(ne);var he=Ae.getResult();for(var a in he)de.ua[a]=he[a]}}})(typeof window=="object"?window:lt)});var ze=new Error("Unsupported platform"),Ce=new Error("Invalid argument"),Gt=new Error("Unexpected error"),et=new Error("Invalid key"),Fe=new Error("Invalid signature"),mt=new Error("Operation blocked");var ge={readonly:"readonly",readwrite:"readwrite"};function zt(d,c,l){return window.indexedDB||Promise.reject(ze),new Promise((r,e)=>{try{let t=!1,n=f=>{t||(t=!0,e(f))},o=window.indexedDB.open(d,c);o.onupgradeneeded=f=>{try{l(f.target.result,f.target.transaction,f.newVersion,f.oldVersion)}catch(y){n(y)}},o.onblocked=f=>{n(mt)},o.onerror=f=>{n(f.target.error)},o.onsuccess=f=>{if(!t){let y=f.target.result;y.onversionchange=O=>{y.close()},r(y)}}}catch(t){reject_once(t)}})}function Yt(d){d.close()}function Xt(d){return new Promise((c,l)=>{let r=window.indexedDB.deleteDatabase(d);r.onerror=e=>{l(Gt)},r.onsuccess=e=>{c()},r.onblocked=e=>{l(mt)}})}function De(d,c,l){let r=d.transaction(c,l);return r.result=null,r.promise=new Promise((e,t)=>{r.oncomplete=n=>{e(r.result)},r.onerror=n=>{t(r.error?r.error:n.target.error)},r.onabort=n=>{t(r.result)}}),r}function Pe(d){return d.error?Promise.reject(d.error):d.promise}function Ye(d,c,l){try{let e=d.objectStore(c).get(l);e.onsuccess=t=>{d.result=e.result},e.onerror=t=>{d.result=t.target.error,d.abort()}}catch(r){d.result=r,d.abort()}}function at(d,c,l){return new Promise((r,e)=>{try{let n=d.objectStore(c).get(l);n.onsuccess=o=>{r(n.result)},n.onerror=o=>{d.result=o.target.error,e(o.error)}}catch(t){d.result=t,e(t)}})}function It(d,c){try{let r=d.objectStore(c).getAll();r.onsuccess=e=>{d.result=r.result},r.onerror=e=>{d.result=e.target.error,d.abort()}}catch(l){d.result=l,d.abort()}}function Zt(d,c){return new Promise((l,r)=>{try{let t=d.objectStore(c).getAll();t.onsuccess=n=>{l(t.result)},t.onerror=n=>{d.result=n.target.error,r(n.error)}}catch(e){d.result=e,r(e)}})}function Be(d,c,l,r){try{let t=d.objectStore(c).put(l,r);t.onsuccess=n=>{d.result=t.result},t.onerror=n=>{d.result=n.target.error,d.abort()}}catch(e){d.result=e,d.abort()}}function Xe(d,c,l){try{let e=d.objectStore(c).delete(l);e.onsuccess=t=>{d.result=e.result},e.onerror=t=>{d.result=t.target.error,d.abort()}}catch(r){d.result=r,d.abort()}}function At(d,c){try{let r=d.objectStore(c).clear();r.onsuccess=e=>{d.result=r.result},r.onerror=e=>{d.result=e.target.error,d.abort()}}catch(l){d.result=l,d.abort()}}var Qt="keymaker",Et=[gr,Dr,Pr,Mr,Tr,jr],He="certificates",We="keys",Se="credentials",_t="id",Ve="appSettings";function Ar(d){return new Promise(async(c,l)=>{d===void 0&&(d=Et.length);try{let r=await zt(Qt,d,kr);c(r)}catch(r){l(r)}})}function Er(d){return new Promise(async(c,l)=>{try{Yt(d),c()}catch(r){l(r)}})}function _r(){return new Promise(async(d,c)=>{try{await Xt(Qt),d()}catch(l){c(l)}})}function kr(d,c,l,r){if(!d||!l)throw Ce;if(l>Et.length)throw Ce;for(;r<l;r++)Et[r](d,c)}function gr(d,c){d.createObjectStore(Se,{keyPath:"handle"}),d.createObjectStore(He),d.createObjectStore(We)}function Dr(d,c){d.createObjectStore(Ve,{keyPath:"instanceId"})}function Pr(d,c){let r=c.objectStore(Se).openCursor();r.onsuccess=e=>{let t=e.target.result;t&&(t.value.state||(t.value.state="Active",t.update(t.value)),t.continue())}}function Mr(d,c){}function Tr(d,c){let r=c.objectStore(Se).openCursor();r.onsuccess=e=>{let t=e.target.result;t&&(t.value.id||(t.value.id=xr(16,"cr"),t.update(t.value)),t.continue())}}function jr(d,c){c.objectStore(Se).createIndex(_t,"id",{unique:!0})}function Br(d){let c=new Uint8Array(d);return window.crypto.getRandomValues(c),c}function xr(d,c){return(c??"")+[...Br(d/2)].map(l=>l.toString(16).padStart(2,"0")).join("")}function ai(d,c){return new Promise(async(l,r)=>{try{let e=De(d,He,ge.readonly);Ye(e,He,c);let t=await Pe(e);l(new Uint8Array(t))}catch(e){r(e)}})}function ui(d,c,l){return new Promise(async(r,e)=>{try{let t=De(d,He,ge.readwrite);Be(t,He,l,c),await Pe(t),r()}catch(t){e(t)}})}function fi(d,c){return new Promise(async(l,r)=>{try{let e=De(d,He,ge.readwrite);Xe(e,He,c),await Pe(e),l()}catch(e){r(e)}})}function en(d,c,l){return new Promise(async(r,e)=>{try{let t=De(d,We,ge.readwrite);Be(t,We,l,c),await Pe(t),r()}catch(t){e(t)}})}function Ze(d,c){return new Promise(async(l,r)=>{try{let e=De(d,We,ge.readonly);Ye(e,We,c);let t=await Pe(e);t?l(t):r(et)}catch(e){r(e)}})}function yi(d,c){return new Promise(async(l,r)=>{try{let e=De(d,We,ge.readwrite);Xe(e,We,c),await Pe(e),l()}catch(e){r(e)}})}function ut(d){window.crypto.getRandomValues(d)}function kt(d,c){return new Promise((l,r)=>{window.crypto.subtle.exportKey(c,d).then(e=>{l(new Uint8Array(e))},e=>{r(e)})})}function tn(d){return new Promise((c,l)=>{let r={name:"ECDSA",namedCurve:d};window.crypto.subtle.generateKey(r,!1,["sign","verify"]).then(e=>{c(e)},e=>{l(e)})})}function ft(d,c,l,r){return new Promise((e,t)=>{let n={name:"ECDSA",namedCurve:c};window.crypto.subtle.importKey(d,l,n,!0,[r]).then(o=>{e(o)},o=>{t(o)})})}function nn(d,c,l){return new Promise((r,e)=>{let t={name:"ECDSA",hash:c};window.crypto.subtle.sign(t,d,l).then(n=>{n=new Uint8Array(n),r(n)},n=>{e(n)})})}function rn(d,c,l,r){return new Promise((e,t)=>{let n={name:"ECDSA",hash:c};window.crypto.subtle.verify(n,d,l,r).then(o=>{e(o)},o=>{t(o)})})}function gt(){return new Promise((d,c)=>{let l={name:"AES-GCM",length:256};window.crypto.subtle.generateKey(l,!1,["encrypt","decrypt"]).then(r=>{d(r)},r=>{c(r)})})}function Dt(d,c,l){return new Promise((r,e)=>{let t={name:"AES-GCM",iv:c};window.crypto.subtle.encrypt(t,d,l).then(n=>{r(new Uint8Array(n))},n=>{e(n)})})}function Pt(d,c,l){return new Promise((r,e)=>{let t={name:"AES-GCM",iv:c};window.crypto.subtle.decrypt(t,d,l).then(n=>{r(new Uint8Array(n))},n=>{e(n)})})}var Tt=St(on()),ln="subtle",cn="webauthn";function Ai(d,c,l){return new Promise(async(r,e)=>{try{let n=await(await fn(d)).generateKey(l);await en(c,l,n),r()}catch(t){e(t)}})}function Ei(d,c){return new Promise(async(l,r)=>{try{let e=await Ze(d,c),t=nt(e);l(t===st)}catch(e){r(e)}})}function _i(d,c,l){return new Promise(async(r,e)=>{try{let t=await Ze(d,c),o=await nt(t).sign(t,l);r(o)}catch(t){e(t)}})}function Nr(d){if(d.subtle!==void 0){if(d=d.subtle.signature,d.length==64)return d;if(d.length<64)throw Fe;if(d[0]!=48)throw Fe;let c=new Uint8Array(64),l=2;if(d[l++]!=2)throw Fe;let r=d[l++];if(r==33)l++;else if(r!=32)throw Fe;if(c.set(d.slice(l,l+32),0),l+=32,d[l++]!=2)throw Fe;if(r=d[l++],r==33)l++;else if(r!=32)throw Fe;return c.set(d.slice(l,l+32),32),c}else throw d.webauthn!==void 0?new Error("Not implemented"):Fe}function ki(d,c,l,r){return new Promise(async(e,t)=>{try{let n=await Rr(d,c),o=await ft("raw","P-256",n,"verify");l=Nr(l);let f=await rn(o,"SHA-256",l,r);e(f)}catch(n){t(n)}})}function Rr(d,c){return new Promise(async(l,r)=>{try{let e=await Ze(d,c),n=await nt(e).publicKey(e);l(new Uint8Array(n))}catch(e){r(e)}})}function gi(d,c,l){return new Promise(async(r,e)=>{try{let t=await Ze(d,c),o=await nt(t).encrypt(t,l);r(o)}catch(t){e(t)}})}function Di(d,c,l){return new Promise(async(r,e)=>{try{let t=await Ze(d,c),o=await nt(t).decrypt(t,data);r(o)}catch(t){e(t)}})}async function an(){let d=/^((?!chrome|android).)*safari/i.test(navigator.userAgent),c=window.localStorage?.getItem("EnableWebAuthn")==="true";return!!(!d&&window.PublicKeyCredential&&await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()&&c)}function un(){return!!window.crypto.subtle}async function fn(d){switch(d){case void 0:{if(await an())return st;if(un())return jt;throw ze}case ln:if(un())return jt;throw ze;case cn:if(await an())return st;throw ze;default:throw Ce}}function sn(d,c){return c in d}function nt(d){if("subtle"in d)return jt;if("webauthn"in d)return st;throw Ce}var jt=new class{extractKeys(c){if(sn(c,ln))return c.subtle;throw et}async generateKey(c){let l=await tn("P-256"),r=await gt();return{subtle:{signingKey:l,encryptionKey:r}}}async publicKey(c){let l=this.extractKeys(c);return await kt(l.signingKey.publicKey,"raw")}async sign(c,l){let r=this.extractKeys(c);return{subtle:{signature:await nn(r.signingKey.privateKey,"SHA-256",l)}}}async encrypt(c,l){let r=this.extractKeys(c),e=new Uint8Array(12);ut(e);let t=await Dt(r.encryptionKey,e,l),n=new Uint8Array(e.length+t.length);return n.set(e),n.set(t,e.length),n}async decrypt(c,l){let r=this.extractKeys(c),e=l.slice(0,12);return l=l.slice(12),await Pt(r.encryptionKey,e,l)}},st=new class{extractKeys(c){if(sn(c,cn))return c.webauthn;throw et}async generateKey(c){await fn("subtle");let l=new Uint8Array(16);ut(l);let r={rp:{name:"Beyond Identity, Inc.",id:location.hostname},challenge:new Uint8Array(0),user:{id:l,name:c,displayName:c},pubKeyCredParams:[{type:"public-key",alg:-7}],attestation:"none",authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required"}},e;try{e=await navigator.credentials.create({publicKey:r})}catch(b){let u=new Error(b.message);throw u.name="WebAuthnError",u}if(!e)return Promise.reject(Ce);let t=e.response,o=(await(0,Tt.decodeFirst)(t.attestationObject)).authData;if(typeof t.getPublicKey=="function"){let b=t.getPublicKey();var f=await ft("spki","P-256",b,"verify")}else{let u=new DataView(o.buffer.slice(o.byteOffset+53,o.byteOffset+55)).getUint16(),p=o.slice(55+u),I=await(0,Tt.decodeFirst)(p),P=new Uint8Array(65);P[0]=4,P.set(I.get(-2),1),P.set(I.get(-3),33);var f=await ft("raw","P-256",P,"verify")}let y=[];typeof t.getTransports=="function"&&(y=t.getTransports());let O=await gt();return{webauthn:{signingKey:{rawId:e.rawId,transports:y,publicKey:f,authenticatorData:o},encryptionKey:O}}}async publicKey(c){let l=this.extractKeys(c);return await kt(l.signingKey.publicKey,"raw")}async sign(c,l){let r=this.extractKeys(c),e={challenge:l,allowCredentials:[{id:r.signingKey.rawId,type:"public-key",transports:r.signingKey.transports}],userVerification:"required",timeout:6e4},t=await navigator.credentials.get({publicKey:e});if(!t)return Promise.reject(Ce);let n=t.response;return{webauthn:{authenticatorData:n.authenticatorData,clientDataJSON:n.clientDataJSON,signature:n.signature}}}async encrypt(c,l){let r=this.extractKeys(c),e=new Uint8Array(12);ut(e);let t=await Dt(r.encryptionKey,e,l),n=new Uint8Array(e.length+t.length);return n.set(e),n.set(t,e.length),n}async decrypt(c,l){let r=this.extractKeys(c),e=l.slice(0,12);return l=l.slice(12),await Pt(r.encryptionKey,e,l)}};var dt,Ur=new Uint8Array(16);function Bt(){if(!dt&&(dt=typeof crypto!="undefined"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||typeof msCrypto!="undefined"&&typeof msCrypto.getRandomValues=="function"&&msCrypto.getRandomValues.bind(msCrypto),!dt))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return dt(Ur)}var dn=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function Lr(d){return typeof d=="string"&&dn.test(d)}var hn=Lr;var Te=[];for(ht=0;ht<256;++ht)Te.push((ht+256).toString(16).substr(1));var ht;function Vr(d){var c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,l=(Te[d[c+0]]+Te[d[c+1]]+Te[d[c+2]]+Te[d[c+3]]+"-"+Te[d[c+4]]+Te[d[c+5]]+"-"+Te[d[c+6]]+Te[d[c+7]]+"-"+Te[d[c+8]]+Te[d[c+9]]+"-"+Te[d[c+10]]+Te[d[c+11]]+Te[d[c+12]]+Te[d[c+13]]+Te[d[c+14]]+Te[d[c+15]]).toLowerCase();if(!hn(l))throw TypeError("Stringified UUID is invalid");return l}var pn=Vr;function Cr(d,c,l){d=d||{};var r=d.random||(d.rng||Bt)();if(r[6]=r[6]&15|64,r[8]=r[8]&63|128,c){l=l||0;for(var e=0;e<16;++e)c[l+e]=r[e];return c}return pn(r)}var xt=Cr;function Ji(d,c){return new Promise(async(l,r)=>{try{let e=De(d,Se,ge.readwrite);Be(e,Se,c),await Pe(e),l()}catch(e){r(e)}})}function qi(d,c){return new Promise(async(l,r)=>{try{let e=De(d,Se,ge.readwrite),t=e.objectStore(Se),n=t.index(_t),o=!1,f=n.openCursor().on_success=y=>{f&&(!update&&f.value.id==c.id&&(f.update(c),o=!0),f.continue())};o||t.put(c),await Pe(e),l()}catch(e){r(e)}})}function Gi(d,c,l){return new Promise(async(r,e)=>{try{let t=De(d,Se,ge.readwrite),n=await at(t,Se,c);n.name=l.name,n.image_url=l.image_url,n.enroll_uri=l.enroll_uri,n.login_uri=l.login_uri,n.desktop_login_url=l.desktop_login_url,n.device_gateway_url=l.device_gateway_url,n.migrate_addr=l.migrate_addr,Be(t,Se,n),await Pe(t),r()}catch(t){e(t)}})}function zi(d,c){return new Promise(async(l,r)=>{try{l(!!await Fr(d,c))}catch(e){r(e)}})}function Fr(d,c){return new Promise(async(l,r)=>{try{let e=De(d,Se,ge.readonly);Ye(e,Se,c);let t=await Pe(e);l(t)}catch(e){r(e)}})}function Yi(d,c){return new Promise(async(l,r)=>{try{let t=(await Hr(d)).find(n=>n.id===c);l(t)}catch(e){r(e)}})}function Hr(d){return new Promise(async(c,l)=>{try{let r=De(d,Se,ge.readonly);It(r,Se);let e=await Pe(r);c(e)}catch(r){l(r)}})}function Xi(d,c){return new Promise(async(l,r)=>{try{let e=De(d,Se,ge.readwrite);Xe(e,Se,c),await Pe(e),l()}catch(e){r(e)}})}function Zi(d,c,l){return new Promise(async(r,e)=>{try{let t=De(d,Se,ge.readwrite),n=await at(t,Se,c);n.auth_client_ids.push(l),Be(t,Se,n),await Pe(t),r()}catch(t){e(t)}})}function Qi(d,c){return new Promise(async(l,r)=>{try{let e=De(d,Se,ge.readwrite),t=await at(e,Se,c);t.auth_client_ids=[],Be(e,Se,t),await Pe(e),l()}catch(e){r(e)}})}async function yn(d){return await vn(d,void 0)}async function eo(d,c){await vn(d,c)}async function vn(d,c){let l=De(d,Ve,ge.readwrite),r=()=>(c===void 0&&(c={instanceId:xt()}),c),e=await Zt(l,Ve);if(e.length===0?Be(l,Ve,r()):e.length>1?(At(l,Ve),Be(l,Ve,r())):c!==void 0&&(c.instanceId!==e[0].instanceId&&At(),Be(l,Ve,r())),It(l,Ve),e=await Pe(l),e.length!==1)throw new Error("Transaction failure");return e[0]}var ae=St(hr()),U=ae.Reader,we=ae.Writer,ke=ae.util,i=ae.roots.default||(ae.roots.default={}),ye=i.device=(()=>{let d={};return d.Platform=function(){let c={},l=Object.create(c);return l[c[0]="UNSPECIFIED"]=0,l[c[1]="MACOS"]=1,l[c[2]="IOS"]=2,l[c[3]="ANDROID"]=3,l[c[4]="WINDOWS"]=4,l[c[5]="LINUX"]=5,l[c[6]="WEB"]=6,l}(),d.Core=function(){let c={},l=Object.create(c);return l[c[0]="GO"]=0,l[c[1]="RUST"]=1,l}(),d.AnswerType=function(){let c={},l=Object.create(c);return l[c[0]="UNSUPPORTED"]=0,l[c[1]="UNKNOWN"]=1,l[c[2]="ERROR"]=2,l[c[3]="VALUE"]=3,l}(),d.Answer=function(){function c(l){if(l)for(let r=Object.keys(l),e=0;e<r.length;++e)l[r[e]]!=null&&(this[r[e]]=l[r[e]])}return c.prototype.type=0,c.prototype.error="",c.create=function(r){return new c(r)},c.encode=function(r,e){return e||(e=we.create()),r.type!=null&&Object.hasOwnProperty.call(r,"type")&&e.uint32(8).int32(r.type),r.error!=null&&Object.hasOwnProperty.call(r,"error")&&e.uint32(18).string(r.error),e},c.encodeDelimited=function(r,e){return this.encode(r,e).ldelim()},c.decode=function(r,e){r instanceof U||(r=U.create(r));let t=e===void 0?r.len:r.pos+e,n=new i.device.Answer;for(;r.pos<t;){let o=r.uint32();switch(o>>>3){case 1:n.type=r.int32();break;case 2:n.error=r.string();break;default:r.skipType(o&7);break}}return n},c.decodeDelimited=function(r){return r instanceof U||(r=new U(r)),this.decode(r,r.uint32())},c.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.type!=null&&r.hasOwnProperty("type"))switch(r.type){default:return"type: enum value expected";case 0:case 1:case 2:case 3:break}return r.error!=null&&r.hasOwnProperty("error")&&!ke.isString(r.error)?"error: string expected":null},c.fromObject=function(r){if(r instanceof i.device.Answer)return r;let e=new i.device.Answer;switch(r.type){case"UNSUPPORTED":case 0:e.type=0;break;case"UNKNOWN":case 1:e.type=1;break;case"ERROR":case 2:e.type=2;break;case"VALUE":case 3:e.type=3;break}return r.error!=null&&(e.error=String(r.error)),e},c.toObject=function(r,e){e||(e={});let t={};return e.defaults&&(t.type=e.enums===String?"UNSUPPORTED":0,t.error=""),r.type!=null&&r.hasOwnProperty("type")&&(t.type=e.enums===String?i.device.AnswerType[r.type]:r.type),r.error!=null&&r.hasOwnProperty("error")&&(t.error=r.error),t},c.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},c}(),d.StringMaybe=function(){function c(l){if(l)for(let r=Object.keys(l),e=0;e<r.length;++e)l[r[e]]!=null&&(this[r[e]]=l[r[e]])}return c.prototype.answer=null,c.prototype.value="",c.create=function(r){return new c(r)},c.encode=function(r,e){return e||(e=we.create()),r.answer!=null&&Object.hasOwnProperty.call(r,"answer")&&i.device.Answer.encode(r.answer,e.uint32(10).fork()).ldelim(),r.value!=null&&Object.hasOwnProperty.call(r,"value")&&e.uint32(18).string(r.value),e},c.encodeDelimited=function(r,e){return this.encode(r,e).ldelim()},c.decode=function(r,e){r instanceof U||(r=U.create(r));let t=e===void 0?r.len:r.pos+e,n=new i.device.StringMaybe;for(;r.pos<t;){let o=r.uint32();switch(o>>>3){case 1:n.answer=i.device.Answer.decode(r,r.uint32());break;case 2:n.value=r.string();break;default:r.skipType(o&7);break}}return n},c.decodeDelimited=function(r){return r instanceof U||(r=new U(r)),this.decode(r,r.uint32())},c.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.answer!=null&&r.hasOwnProperty("answer")){let e=i.device.Answer.verify(r.answer);if(e)return"answer."+e}return r.value!=null&&r.hasOwnProperty("value")&&!ke.isString(r.value)?"value: string expected":null},c.fromObject=function(r){if(r instanceof i.device.StringMaybe)return r;let e=new i.device.StringMaybe;if(r.answer!=null){if(typeof r.answer!="object")throw TypeError(".device.StringMaybe.answer: object expected");e.answer=i.device.Answer.fromObject(r.answer)}return r.value!=null&&(e.value=String(r.value)),e},c.toObject=function(r,e){e||(e={});let t={};return e.defaults&&(t.answer=null,t.value=""),r.answer!=null&&r.hasOwnProperty("answer")&&(t.answer=i.device.Answer.toObject(r.answer,e)),r.value!=null&&r.hasOwnProperty("value")&&(t.value=r.value),t},c.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},c}(),d.Int32Maybe=function(){function c(l){if(l)for(let r=Object.keys(l),e=0;e<r.length;++e)l[r[e]]!=null&&(this[r[e]]=l[r[e]])}return c.prototype.answer=null,c.prototype.value=0,c.create=function(r){return new c(r)},c.encode=function(r,e){return e||(e=we.create()),r.answer!=null&&Object.hasOwnProperty.call(r,"answer")&&i.device.Answer.encode(r.answer,e.uint32(10).fork()).ldelim(),r.value!=null&&Object.hasOwnProperty.call(r,"value")&&e.uint32(16).int32(r.value),e},c.encodeDelimited=function(r,e){return this.encode(r,e).ldelim()},c.decode=function(r,e){r instanceof U||(r=U.create(r));let t=e===void 0?r.len:r.pos+e,n=new i.device.Int32Maybe;for(;r.pos<t;){let o=r.uint32();switch(o>>>3){case 1:n.answer=i.device.Answer.decode(r,r.uint32());break;case 2:n.value=r.int32();break;default:r.skipType(o&7);break}}return n},c.decodeDelimited=function(r){return r instanceof U||(r=new U(r)),this.decode(r,r.uint32())},c.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.answer!=null&&r.hasOwnProperty("answer")){let e=i.device.Answer.verify(r.answer);if(e)return"answer."+e}return r.value!=null&&r.hasOwnProperty("value")&&!ke.isInteger(r.value)?"value: integer expected":null},c.fromObject=function(r){if(r instanceof i.device.Int32Maybe)return r;let e=new i.device.Int32Maybe;if(r.answer!=null){if(typeof r.answer!="object")throw TypeError(".device.Int32Maybe.answer: object expected");e.answer=i.device.Answer.fromObject(r.answer)}return r.value!=null&&(e.value=r.value|0),e},c.toObject=function(r,e){e||(e={});let t={};return e.defaults&&(t.answer=null,t.value=0),r.answer!=null&&r.hasOwnProperty("answer")&&(t.answer=i.device.Answer.toObject(r.answer,e)),r.value!=null&&r.hasOwnProperty("value")&&(t.value=r.value),t},c.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},c}(),d.Int64Maybe=function(){function c(l){if(l)for(let r=Object.keys(l),e=0;e<r.length;++e)l[r[e]]!=null&&(this[r[e]]=l[r[e]])}return c.prototype.answer=null,c.prototype.value=ke.Long?ke.Long.fromBits(0,0,!1):0,c.create=function(r){return new c(r)},c.encode=function(r,e){return e||(e=we.create()),r.answer!=null&&Object.hasOwnProperty.call(r,"answer")&&i.device.Answer.encode(r.answer,e.uint32(10).fork()).ldelim(),r.value!=null&&Object.hasOwnProperty.call(r,"value")&&e.uint32(16).int64(r.value),e},c.encodeDelimited=function(r,e){return this.encode(r,e).ldelim()},c.decode=function(r,e){r instanceof U||(r=U.create(r));let t=e===void 0?r.len:r.pos+e,n=new i.device.Int64Maybe;for(;r.pos<t;){let o=r.uint32();switch(o>>>3){case 1:n.answer=i.device.Answer.decode(r,r.uint32());break;case 2:n.value=r.int64();break;default:r.skipType(o&7);break}}return n},c.decodeDelimited=function(r){return r instanceof U||(r=new U(r)),this.decode(r,r.uint32())},c.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.answer!=null&&r.hasOwnProperty("answer")){let e=i.device.Answer.verify(r.answer);if(e)return"answer."+e}return r.value!=null&&r.hasOwnProperty("value")&&!ke.isInteger(r.value)&&!(r.value&&ke.isInteger(r.value.low)&&ke.isInteger(r.value.high))?"value: integer|Long expected":null},c.fromObject=function(r){if(r instanceof i.device.Int64Maybe)return r;let e=new i.device.Int64Maybe;if(r.answer!=null){if(typeof r.answer!="object")throw TypeError(".device.Int64Maybe.answer: object expected");e.answer=i.device.Answer.fromObject(r.answer)}return r.value!=null&&(ke.Long?(e.value=ke.Long.fromValue(r.value)).unsigned=!1:typeof r.value=="string"?e.value=parseInt(r.value,10):typeof r.value=="number"?e.value=r.value:typeof r.value=="object"&&(e.value=new ke.LongBits(r.value.low>>>0,r.value.high>>>0).toNumber())),e},c.toObject=function(r,e){e||(e={});let t={};if(e.defaults)if(t.answer=null,ke.Long){let n=new ke.Long(0,0,!1);t.value=e.longs===String?n.toString():e.longs===Number?n.toNumber():n}else t.value=e.longs===String?"0":0;return r.answer!=null&&r.hasOwnProperty("answer")&&(t.answer=i.device.Answer.toObject(r.answer,e)),r.value!=null&&r.hasOwnProperty("value")&&(typeof r.value=="number"?t.value=e.longs===String?String(r.value):r.value:t.value=e.longs===String?ke.Long.prototype.toString.call(r.value):e.longs===Number?new ke.LongBits(r.value.low>>>0,r.value.high>>>0).toNumber():r.value),t},c.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},c}(),d.BoolMaybe=function(){function c(l){if(l)for(let r=Object.keys(l),e=0;e<r.length;++e)l[r[e]]!=null&&(this[r[e]]=l[r[e]])}return c.prototype.answer=null,c.prototype.value=!1,c.create=function(r){return new c(r)},c.encode=function(r,e){return e||(e=we.create()),r.answer!=null&&Object.hasOwnProperty.call(r,"answer")&&i.device.Answer.encode(r.answer,e.uint32(10).fork()).ldelim(),r.value!=null&&Object.hasOwnProperty.call(r,"value")&&e.uint32(16).bool(r.value),e},c.encodeDelimited=function(r,e){return this.encode(r,e).ldelim()},c.decode=function(r,e){r instanceof U||(r=U.create(r));let t=e===void 0?r.len:r.pos+e,n=new i.device.BoolMaybe;for(;r.pos<t;){let o=r.uint32();switch(o>>>3){case 1:n.answer=i.device.Answer.decode(r,r.uint32());break;case 2:n.value=r.bool();break;default:r.skipType(o&7);break}}return n},c.decodeDelimited=function(r){return r instanceof U||(r=new U(r)),this.decode(r,r.uint32())},c.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.answer!=null&&r.hasOwnProperty("answer")){let e=i.device.Answer.verify(r.answer);if(e)return"answer."+e}return r.value!=null&&r.hasOwnProperty("value")&&typeof r.value!="boolean"?"value: boolean expected":null},c.fromObject=function(r){if(r instanceof i.device.BoolMaybe)return r;let e=new i.device.BoolMaybe;if(r.answer!=null){if(typeof r.answer!="object")throw TypeError(".device.BoolMaybe.answer: object expected");e.answer=i.device.Answer.fromObject(r.answer)}return r.value!=null&&(e.value=Boolean(r.value)),e},c.toObject=function(r,e){e||(e={});let t={};return e.defaults&&(t.answer=null,t.value=!1),r.answer!=null&&r.hasOwnProperty("answer")&&(t.answer=i.device.Answer.toObject(r.answer,e)),r.value!=null&&r.hasOwnProperty("value")&&(t.value=r.value),t},c.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},c}(),d.DeviceInfo=function(){function c(l){if(l)for(let r=Object.keys(l),e=0;e<r.length;++e)l[r[e]]!=null&&(this[r[e]]=l[r[e]])}return c.prototype.answer=null,c.prototype.platform=0,c.prototype.appVersion=null,c.prototype.core=0,c.prototype.osVersion=null,c.prototype.deviceType=null,c.prototype.authentication=null,c.prototype.volumes=null,c.prototype.securitySoftware=null,c.prototype.authorizationSettings=null,c.prototype.applications=null,c.prototype.appInstanceId=null,c.prototype.hardwareUuid=null,c.prototype.intuneManagedDeviceId=null,c.prototype.osDomainName=null,c.prototype.hostname=null,c.prototype.hardwareSerialNum=null,c.prototype.tpmInfo=null,c.prototype.crowdstrikeAgentId=null,c.prototype.biSdkInfo=null,c.prototype.keyProvenances=null,c.prototype.isHalEnabled=null,c.prototype.locale=null,c.create=function(r){return new c(r)},c.encode=function(r,e){return e||(e=we.create()),r.answer!=null&&Object.hasOwnProperty.call(r,"answer")&&i.device.Answer.encode(r.answer,e.uint32(10).fork()).ldelim(),r.platform!=null&&Object.hasOwnProperty.call(r,"platform")&&e.uint32(16).int32(r.platform),r.appVersion!=null&&Object.hasOwnProperty.call(r,"appVersion")&&i.device.StringMaybe.encode(r.appVersion,e.uint32(26).fork()).ldelim(),r.osVersion!=null&&Object.hasOwnProperty.call(r,"osVersion")&&i.device.DeviceInfo.OSVersion.encode(r.osVersion,e.uint32(34).fork()).ldelim(),r.deviceType!=null&&Object.hasOwnProperty.call(r,"deviceType")&&i.device.DeviceInfo.DeviceType.encode(r.deviceType,e.uint32(42).fork()).ldelim(),r.authentication!=null&&Object.hasOwnProperty.call(r,"authentication")&&i.device.DeviceInfo.Authentication.encode(r.authentication,e.uint32(50).fork()).ldelim(),r.volumes!=null&&Object.hasOwnProperty.call(r,"volumes")&&i.device.DeviceInfo.Volumes.encode(r.volumes,e.uint32(58).fork()).ldelim(),r.securitySoftware!=null&&Object.hasOwnProperty.call(r,"securitySoftware")&&i.device.DeviceInfo.SecuritySoftware.encode(r.securitySoftware,e.uint32(66).fork()).ldelim(),r.authorizationSettings!=null&&Object.hasOwnProperty.call(r,"authorizationSettings")&&i.device.DeviceInfo.AuthorizationSettings.encode(r.authorizationSettings,e.uint32(74).fork()).ldelim(),r.applications!=null&&Object.hasOwnProperty.call(r,"applications")&&i.device.DeviceInfo.Applications.encode(r.applications,e.uint32(82).fork()).ldelim(),r.appInstanceId!=null&&Object.hasOwnProperty.call(r,"appInstanceId")&&i.device.StringMaybe.encode(r.appInstanceId,e.uint32(90).fork()).ldelim(),r.hardwareUuid!=null&&Object.hasOwnProperty.call(r,"hardwareUuid")&&i.device.StringMaybe.encode(r.hardwareUuid,e.uint32(98).fork()).ldelim(),r.core!=null&&Object.hasOwnProperty.call(r,"core")&&e.uint32(104).int32(r.core),r.intuneManagedDeviceId!=null&&Object.hasOwnProperty.call(r,"intuneManagedDeviceId")&&i.device.StringMaybe.encode(r.intuneManagedDeviceId,e.uint32(114).fork()).ldelim(),r.osDomainName!=null&&Object.hasOwnProperty.call(r,"osDomainName")&&i.device.StringMaybe.encode(r.osDomainName,e.uint32(122).fork()).ldelim(),r.hostname!=null&&Object.hasOwnProperty.call(r,"hostname")&&i.device.StringMaybe.encode(r.hostname,e.uint32(130).fork()).ldelim(),r.hardwareSerialNum!=null&&Object.hasOwnProperty.call(r,"hardwareSerialNum")&&i.device.StringMaybe.encode(r.hardwareSerialNum,e.uint32(138).fork()).ldelim(),r.tpmInfo!=null&&Object.hasOwnProperty.call(r,"tpmInfo")&&i.device.DeviceInfo.TPMInfo.encode(r.tpmInfo,e.uint32(146).fork()).ldelim(),r.crowdstrikeAgentId!=null&&Object.hasOwnProperty.call(r,"crowdstrikeAgentId")&&i.device.StringMaybe.encode(r.crowdstrikeAgentId,e.uint32(154).fork()).ldelim(),r.biSdkInfo!=null&&Object.hasOwnProperty.call(r,"biSdkInfo")&&i.device.DeviceInfo.BiSdkInfo.encode(r.biSdkInfo,e.uint32(162).fork()).ldelim(),r.keyProvenances!=null&&Object.hasOwnProperty.call(r,"keyProvenances")&&i.device.DeviceInfo.KeyProvenances.encode(r.keyProvenances,e.uint32(170).fork()).ldelim(),r.isHalEnabled!=null&&Object.hasOwnProperty.call(r,"isHalEnabled")&&i.device.BoolMaybe.encode(r.isHalEnabled,e.uint32(178).fork()).ldelim(),r.locale!=null&&Object.hasOwnProperty.call(r,"locale")&&i.device.DeviceInfo.Locale.encode(r.locale,e.uint32(186).fork()).ldelim(),e},c.encodeDelimited=function(r,e){return this.encode(r,e).ldelim()},c.decode=function(r,e){r instanceof U||(r=U.create(r));let t=e===void 0?r.len:r.pos+e,n=new i.device.DeviceInfo;for(;r.pos<t;){let o=r.uint32();switch(o>>>3){case 1:n.answer=i.device.Answer.decode(r,r.uint32());break;case 2:n.platform=r.int32();break;case 3:n.appVersion=i.device.StringMaybe.decode(r,r.uint32());break;case 13:n.core=r.int32();break;case 4:n.osVersion=i.device.DeviceInfo.OSVersion.decode(r,r.uint32());break;case 5:n.deviceType=i.device.DeviceInfo.DeviceType.decode(r,r.uint32());break;case 6:n.authentication=i.device.DeviceInfo.Authentication.decode(r,r.uint32());break;case 7:n.volumes=i.device.DeviceInfo.Volumes.decode(r,r.uint32());break;case 8:n.securitySoftware=i.device.DeviceInfo.SecuritySoftware.decode(r,r.uint32());break;case 9:n.authorizationSettings=i.device.DeviceInfo.AuthorizationSettings.decode(r,r.uint32());break;case 10:n.applications=i.device.DeviceInfo.Applications.decode(r,r.uint32());break;case 11:n.appInstanceId=i.device.StringMaybe.decode(r,r.uint32());break;case 12:n.hardwareUuid=i.device.StringMaybe.decode(r,r.uint32());break;case 14:n.intuneManagedDeviceId=i.device.StringMaybe.decode(r,r.uint32());break;case 15:n.osDomainName=i.device.StringMaybe.decode(r,r.uint32());break;case 16:n.hostname=i.device.StringMaybe.decode(r,r.uint32());break;case 17:n.hardwareSerialNum=i.device.StringMaybe.decode(r,r.uint32());break;case 18:n.tpmInfo=i.device.DeviceInfo.TPMInfo.decode(r,r.uint32());break;case 19:n.crowdstrikeAgentId=i.device.StringMaybe.decode(r,r.uint32());break;case 20:n.biSdkInfo=i.device.DeviceInfo.BiSdkInfo.decode(r,r.uint32());break;case 21:n.keyProvenances=i.device.DeviceInfo.KeyProvenances.decode(r,r.uint32());break;case 22:n.isHalEnabled=i.device.BoolMaybe.decode(r,r.uint32());break;case 23:n.locale=i.device.DeviceInfo.Locale.decode(r,r.uint32());break;default:r.skipType(o&7);break}}return n},c.decodeDelimited=function(r){return r instanceof U||(r=new U(r)),this.decode(r,r.uint32())},c.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.answer!=null&&r.hasOwnProperty("answer")){let e=i.device.Answer.verify(r.answer);if(e)return"answer."+e}if(r.platform!=null&&r.hasOwnProperty("platform"))switch(r.platform){default:return"platform: enum value expected";case 0:case 1:case 2:case 3:case 4:case 5:case 6:break}if(r.appVersion!=null&&r.hasOwnProperty("appVersion")){let e=i.device.StringMaybe.verify(r.appVersion);if(e)return"appVersion."+e}if(r.core!=null&&r.hasOwnProperty("core"))switch(r.core){default:return"core: enum value expected";case 0:case 1:break}if(r.osVersion!=null&&r.hasOwnProperty("osVersion")){let e=i.device.DeviceInfo.OSVersion.verify(r.osVersion);if(e)return"osVersion."+e}if(r.deviceType!=null&&r.hasOwnProperty("deviceType")){let e=i.device.DeviceInfo.DeviceType.verify(r.deviceType);if(e)return"deviceType."+e}if(r.authentication!=null&&r.hasOwnProperty("authentication")){let e=i.device.DeviceInfo.Authentication.verify(r.authentication);if(e)return"authentication."+e}if(r.volumes!=null&&r.hasOwnProperty("volumes")){let e=i.device.DeviceInfo.Volumes.verify(r.volumes);if(e)return"volumes."+e}if(r.securitySoftware!=null&&r.hasOwnProperty("securitySoftware")){let e=i.device.DeviceInfo.SecuritySoftware.verify(r.securitySoftware);if(e)return"securitySoftware."+e}if(r.authorizationSettings!=null&&r.hasOwnProperty("authorizationSettings")){let e=i.device.DeviceInfo.AuthorizationSettings.verify(r.authorizationSettings);if(e)return"authorizationSettings."+e}if(r.applications!=null&&r.hasOwnProperty("applications")){let e=i.device.DeviceInfo.Applications.verify(r.applications);if(e)return"applications."+e}if(r.appInstanceId!=null&&r.hasOwnProperty("appInstanceId")){let e=i.device.StringMaybe.verify(r.appInstanceId);if(e)return"appInstanceId."+e}if(r.hardwareUuid!=null&&r.hasOwnProperty("hardwareUuid")){let e=i.device.StringMaybe.verify(r.hardwareUuid);if(e)return"hardwareUuid."+e}if(r.intuneManagedDeviceId!=null&&r.hasOwnProperty("intuneManagedDeviceId")){let e=i.device.StringMaybe.verify(r.intuneManagedDeviceId);if(e)return"intuneManagedDeviceId."+e}if(r.osDomainName!=null&&r.hasOwnProperty("osDomainName")){let e=i.device.StringMaybe.verify(r.osDomainName);if(e)return"osDomainName."+e}if(r.hostname!=null&&r.hasOwnProperty("hostname")){let e=i.device.StringMaybe.verify(r.hostname);if(e)return"hostname."+e}if(r.hardwareSerialNum!=null&&r.hasOwnProperty("hardwareSerialNum")){let e=i.device.StringMaybe.verify(r.hardwareSerialNum);if(e)return"hardwareSerialNum."+e}if(r.tpmInfo!=null&&r.hasOwnProperty("tpmInfo")){let e=i.device.DeviceInfo.TPMInfo.verify(r.tpmInfo);if(e)return"tpmInfo."+e}if(r.crowdstrikeAgentId!=null&&r.hasOwnProperty("crowdstrikeAgentId")){let e=i.device.StringMaybe.verify(r.crowdstrikeAgentId);if(e)return"crowdstrikeAgentId."+e}if(r.biSdkInfo!=null&&r.hasOwnProperty("biSdkInfo")){let e=i.device.DeviceInfo.BiSdkInfo.verify(r.biSdkInfo);if(e)return"biSdkInfo."+e}if(r.keyProvenances!=null&&r.hasOwnProperty("keyProvenances")){let e=i.device.DeviceInfo.KeyProvenances.verify(r.keyProvenances);if(e)return"keyProvenances."+e}if(r.isHalEnabled!=null&&r.hasOwnProperty("isHalEnabled")){let e=i.device.BoolMaybe.verify(r.isHalEnabled);if(e)return"isHalEnabled."+e}if(r.locale!=null&&r.hasOwnProperty("locale")){let e=i.device.DeviceInfo.Locale.verify(r.locale);if(e)return"locale."+e}return null},c.fromObject=function(r){if(r instanceof i.device.DeviceInfo)return r;let e=new i.device.DeviceInfo;if(r.answer!=null){if(typeof r.answer!="object")throw TypeError(".device.DeviceInfo.answer: object expected");e.answer=i.device.Answer.fromObject(r.answer)}switch(r.platform){case"UNSPECIFIED":case 0:e.platform=0;break;case"MACOS":case 1:e.platform=1;break;case"IOS":case 2:e.platform=2;break;case"ANDROID":case 3:e.platform=3;break;case"WINDOWS":case 4:e.platform=4;break;case"LINUX":case 5:e.platform=5;break;case"WEB":case 6:e.platform=6;break}if(r.appVersion!=null){if(typeof r.appVersion!="object")throw TypeError(".device.DeviceInfo.appVersion: object expected");e.appVersion=i.device.StringMaybe.fromObject(r.appVersion)}switch(r.core){case"GO":case 0:e.core=0;break;case"RUST":case 1:e.core=1;break}if(r.osVersion!=null){if(typeof r.osVersion!="object")throw TypeError(".device.DeviceInfo.osVersion: object expected");e.osVersion=i.device.DeviceInfo.OSVersion.fromObject(r.osVersion)}if(r.deviceType!=null){if(typeof r.deviceType!="object")throw TypeError(".device.DeviceInfo.deviceType: object expected");e.deviceType=i.device.DeviceInfo.DeviceType.fromObject(r.deviceType)}if(r.authentication!=null){if(typeof r.authentication!="object")throw TypeError(".device.DeviceInfo.authentication: object expected");e.authentication=i.device.DeviceInfo.Authentication.fromObject(r.authentication)}if(r.volumes!=null){if(typeof r.volumes!="object")throw TypeError(".device.DeviceInfo.volumes: object expected");e.volumes=i.device.DeviceInfo.Volumes.fromObject(r.volumes)}if(r.securitySoftware!=null){if(typeof r.securitySoftware!="object")throw TypeError(".device.DeviceInfo.securitySoftware: object expected");e.securitySoftware=i.device.DeviceInfo.SecuritySoftware.fromObject(r.securitySoftware)}if(r.authorizationSettings!=null){if(typeof r.authorizationSettings!="object")throw TypeError(".device.DeviceInfo.authorizationSettings: object expected");e.authorizationSettings=i.device.DeviceInfo.AuthorizationSettings.fromObject(r.authorizationSettings)}if(r.applications!=null){if(typeof r.applications!="object")throw TypeError(".device.DeviceInfo.applications: object expected");e.applications=i.device.DeviceInfo.Applications.fromObject(r.applications)}if(r.appInstanceId!=null){if(typeof r.appInstanceId!="object")throw TypeError(".device.DeviceInfo.appInstanceId: object expected");e.appInstanceId=i.device.StringMaybe.fromObject(r.appInstanceId)}if(r.hardwareUuid!=null){if(typeof r.hardwareUuid!="object")throw TypeError(".device.DeviceInfo.hardwareUuid: object expected");e.hardwareUuid=i.device.StringMaybe.fromObject(r.hardwareUuid)}if(r.intuneManagedDeviceId!=null){if(typeof r.intuneManagedDeviceId!="object")throw TypeError(".device.DeviceInfo.intuneManagedDeviceId: object expected");e.intuneManagedDeviceId=i.device.StringMaybe.fromObject(r.intuneManagedDeviceId)}if(r.osDomainName!=null){if(typeof r.osDomainName!="object")throw TypeError(".device.DeviceInfo.osDomainName: object expected");e.osDomainName=i.device.StringMaybe.fromObject(r.osDomainName)}if(r.hostname!=null){if(typeof r.hostname!="object")throw TypeError(".device.DeviceInfo.hostname: object expected");e.hostname=i.device.StringMaybe.fromObject(r.hostname)}if(r.hardwareSerialNum!=null){if(typeof r.hardwareSerialNum!="object")throw TypeError(".device.DeviceInfo.hardwareSerialNum: object expected");e.hardwareSerialNum=i.device.StringMaybe.fromObject(r.hardwareSerialNum)}if(r.tpmInfo!=null){if(typeof r.tpmInfo!="object")throw TypeError(".device.DeviceInfo.tpmInfo: object expected");e.tpmInfo=i.device.DeviceInfo.TPMInfo.fromObject(r.tpmInfo)}if(r.crowdstrikeAgentId!=null){if(typeof r.crowdstrikeAgentId!="object")throw TypeError(".device.DeviceInfo.crowdstrikeAgentId: object expected");e.crowdstrikeAgentId=i.device.StringMaybe.fromObject(r.crowdstrikeAgentId)}if(r.biSdkInfo!=null){if(typeof r.biSdkInfo!="object")throw TypeError(".device.DeviceInfo.biSdkInfo: object expected");e.biSdkInfo=i.device.DeviceInfo.BiSdkInfo.fromObject(r.biSdkInfo)}if(r.keyProvenances!=null){if(typeof r.keyProvenances!="object")throw TypeError(".device.DeviceInfo.keyProvenances: object expected");e.keyProvenances=i.device.DeviceInfo.KeyProvenances.fromObject(r.keyProvenances)}if(r.isHalEnabled!=null){if(typeof r.isHalEnabled!="object")throw TypeError(".device.DeviceInfo.isHalEnabled: object expected");e.isHalEnabled=i.device.BoolMaybe.fromObject(r.isHalEnabled)}if(r.locale!=null){if(typeof r.locale!="object")throw TypeError(".device.DeviceInfo.locale: object expected");e.locale=i.device.DeviceInfo.Locale.fromObject(r.locale)}return e},c.toObject=function(r,e){e||(e={});let t={};return e.defaults&&(t.answer=null,t.platform=e.enums===String?"UNSPECIFIED":0,t.appVersion=null,t.osVersion=null,t.deviceType=null,t.authentication=null,t.volumes=null,t.securitySoftware=null,t.authorizationSettings=null,t.applications=null,t.appInstanceId=null,t.hardwareUuid=null,t.core=e.enums===String?"GO":0,t.intuneManagedDeviceId=null,t.osDomainName=null,t.hostname=null,t.hardwareSerialNum=null,t.tpmInfo=null,t.crowdstrikeAgentId=null,t.biSdkInfo=null,t.keyProvenances=null,t.isHalEnabled=null,t.locale=null),r.answer!=null&&r.hasOwnProperty("answer")&&(t.answer=i.device.Answer.toObject(r.answer,e)),r.platform!=null&&r.hasOwnProperty("platform")&&(t.platform=e.enums===String?i.device.Platform[r.platform]:r.platform),r.appVersion!=null&&r.hasOwnProperty("appVersion")&&(t.appVersion=i.device.StringMaybe.toObject(r.appVersion,e)),r.osVersion!=null&&r.hasOwnProperty("osVersion")&&(t.osVersion=i.device.DeviceInfo.OSVersion.toObject(r.osVersion,e)),r.deviceType!=null&&r.hasOwnProperty("deviceType")&&(t.deviceType=i.device.DeviceInfo.DeviceType.toObject(r.deviceType,e)),r.authentication!=null&&r.hasOwnProperty("authentication")&&(t.authentication=i.device.DeviceInfo.Authentication.toObject(r.authentication,e)),r.volumes!=null&&r.hasOwnProperty("volumes")&&(t.volumes=i.device.DeviceInfo.Volumes.toObject(r.volumes,e)),r.securitySoftware!=null&&r.hasOwnProperty("securitySoftware")&&(t.securitySoftware=i.device.DeviceInfo.SecuritySoftware.toObject(r.securitySoftware,e)),r.authorizationSettings!=null&&r.hasOwnProperty("authorizationSettings")&&(t.authorizationSettings=i.device.DeviceInfo.AuthorizationSettings.toObject(r.authorizationSettings,e)),r.applications!=null&&r.hasOwnProperty("applications")&&(t.applications=i.device.DeviceInfo.Applications.toObject(r.applications,e)),r.appInstanceId!=null&&r.hasOwnProperty("appInstanceId")&&(t.appInstanceId=i.device.StringMaybe.toObject(r.appInstanceId,e)),r.hardwareUuid!=null&&r.hasOwnProperty("hardwareUuid")&&(t.hardwareUuid=i.device.StringMaybe.toObject(r.hardwareUuid,e)),r.core!=null&&r.hasOwnProperty("core")&&(t.core=e.enums===String?i.device.Core[r.core]:r.core),r.intuneManagedDeviceId!=null&&r.hasOwnProperty("intuneManagedDeviceId")&&(t.intuneManagedDeviceId=i.device.StringMaybe.toObject(r.intuneManagedDeviceId,e)),r.osDomainName!=null&&r.hasOwnProperty("osDomainName")&&(t.osDomainName=i.device.StringMaybe.toObject(r.osDomainName,e)),r.hostname!=null&&r.hasOwnProperty("hostname")&&(t.hostname=i.device.StringMaybe.toObject(r.hostname,e)),r.hardwareSerialNum!=null&&r.hasOwnProperty("hardwareSerialNum")&&(t.hardwareSerialNum=i.device.StringMaybe.toObject(r.hardwareSerialNum,e)),r.tpmInfo!=null&&r.hasOwnProperty("tpmInfo")&&(t.tpmInfo=i.device.DeviceInfo.TPMInfo.toObject(r.tpmInfo,e)),r.crowdstrikeAgentId!=null&&r.hasOwnProperty("crowdstrikeAgentId")&&(t.crowdstrikeAgentId=i.device.StringMaybe.toObject(r.crowdstrikeAgentId,e)),r.biSdkInfo!=null&&r.hasOwnProperty("biSdkInfo")&&(t.biSdkInfo=i.device.DeviceInfo.BiSdkInfo.toObject(r.biSdkInfo,e)),r.keyProvenances!=null&&r.hasOwnProperty("keyProvenances")&&(t.keyProvenances=i.device.DeviceInfo.KeyProvenances.toObject(r.keyProvenances,e)),r.isHalEnabled!=null&&r.hasOwnProperty("isHalEnabled")&&(t.isHalEnabled=i.device.BoolMaybe.toObject(r.isHalEnabled,e)),r.locale!=null&&r.hasOwnProperty("locale")&&(t.locale=i.device.DeviceInfo.Locale.toObject(r.locale,e)),t},c.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},c.Applications=function(){function l(r){if(this.software=[],r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.software=ke.emptyArray,l.create=function(e){return new l(e)},l.encode=function(e,t){if(t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.software!=null&&e.software.length)for(let n=0;n<e.software.length;++n)i.device.DeviceInfo.Applications.Software.encode(e.software[n],t.uint32(18).fork()).ldelim();return t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.Applications;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.software&&o.software.length||(o.software=[]),o.software.push(i.device.DeviceInfo.Applications.Software.decode(e,e.uint32()));break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.software!=null&&e.hasOwnProperty("software")){if(!Array.isArray(e.software))return"software: array expected";for(let t=0;t<e.software.length;++t){let n=i.device.DeviceInfo.Applications.Software.verify(e.software[t]);if(n)return"software."+n}}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.Applications)return e;let t=new i.device.DeviceInfo.Applications;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.Applications.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.software){if(!Array.isArray(e.software))throw TypeError(".device.DeviceInfo.Applications.software: array expected");t.software=[];for(let n=0;n<e.software.length;++n){if(typeof e.software[n]!="object")throw TypeError(".device.DeviceInfo.Applications.software: object expected");t.software[n]=i.device.DeviceInfo.Applications.Software.fromObject(e.software[n])}}return t},l.toObject=function(e,t){t||(t={});let n={};if((t.arrays||t.defaults)&&(n.software=[]),t.defaults&&(n.answer=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.software&&e.software.length){n.software=[];for(let o=0;o<e.software.length;++o)n.software[o]=i.device.DeviceInfo.Applications.Software.toObject(e.software[o],t)}return n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l.Software=function(){function r(e){if(e)for(let t=Object.keys(e),n=0;n<t.length;++n)e[t[n]]!=null&&(this[t[n]]=e[t[n]])}return r.prototype.answer=null,r.prototype.architecture=0,r.prototype.installDomain=0,r.prototype.identifier=null,r.prototype.name=null,r.prototype.version=null,r.prototype.publisher=null,r.prototype.installLocation=null,r.prototype.installDate=null,r.prototype.language=null,r.create=function(t){return new r(t)},r.encode=function(t,n){return n||(n=we.create()),t.answer!=null&&Object.hasOwnProperty.call(t,"answer")&&i.device.Answer.encode(t.answer,n.uint32(10).fork()).ldelim(),t.architecture!=null&&Object.hasOwnProperty.call(t,"architecture")&&n.uint32(16).int32(t.architecture),t.installDomain!=null&&Object.hasOwnProperty.call(t,"installDomain")&&n.uint32(24).int32(t.installDomain),t.identifier!=null&&Object.hasOwnProperty.call(t,"identifier")&&i.device.StringMaybe.encode(t.identifier,n.uint32(34).fork()).ldelim(),t.name!=null&&Object.hasOwnProperty.call(t,"name")&&i.device.StringMaybe.encode(t.name,n.uint32(42).fork()).ldelim(),t.version!=null&&Object.hasOwnProperty.call(t,"version")&&i.device.StringMaybe.encode(t.version,n.uint32(50).fork()).ldelim(),t.publisher!=null&&Object.hasOwnProperty.call(t,"publisher")&&i.device.StringMaybe.encode(t.publisher,n.uint32(58).fork()).ldelim(),t.installLocation!=null&&Object.hasOwnProperty.call(t,"installLocation")&&i.device.StringMaybe.encode(t.installLocation,n.uint32(66).fork()).ldelim(),t.installDate!=null&&Object.hasOwnProperty.call(t,"installDate")&&i.device.StringMaybe.encode(t.installDate,n.uint32(74).fork()).ldelim(),t.language!=null&&Object.hasOwnProperty.call(t,"language")&&i.device.StringMaybe.encode(t.language,n.uint32(82).fork()).ldelim(),n},r.encodeDelimited=function(t,n){return this.encode(t,n).ldelim()},r.decode=function(t,n){t instanceof U||(t=U.create(t));let o=n===void 0?t.len:t.pos+n,f=new i.device.DeviceInfo.Applications.Software;for(;t.pos<o;){let y=t.uint32();switch(y>>>3){case 1:f.answer=i.device.Answer.decode(t,t.uint32());break;case 2:f.architecture=t.int32();break;case 3:f.installDomain=t.int32();break;case 4:f.identifier=i.device.StringMaybe.decode(t,t.uint32());break;case 5:f.name=i.device.StringMaybe.decode(t,t.uint32());break;case 6:f.version=i.device.StringMaybe.decode(t,t.uint32());break;case 7:f.publisher=i.device.StringMaybe.decode(t,t.uint32());break;case 8:f.installLocation=i.device.StringMaybe.decode(t,t.uint32());break;case 9:f.installDate=i.device.StringMaybe.decode(t,t.uint32());break;case 10:f.language=i.device.StringMaybe.decode(t,t.uint32());break;default:t.skipType(y&7);break}}return f},r.decodeDelimited=function(t){return t instanceof U||(t=new U(t)),this.decode(t,t.uint32())},r.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.answer!=null&&t.hasOwnProperty("answer")){let n=i.device.Answer.verify(t.answer);if(n)return"answer."+n}if(t.architecture!=null&&t.hasOwnProperty("architecture"))switch(t.architecture){default:return"architecture: enum value expected";case 0:case 1:case 2:case 3:break}if(t.installDomain!=null&&t.hasOwnProperty("installDomain"))switch(t.installDomain){default:return"installDomain: enum value expected";case 0:case 1:case 2:case 3:break}if(t.identifier!=null&&t.hasOwnProperty("identifier")){let n=i.device.StringMaybe.verify(t.identifier);if(n)return"identifier."+n}if(t.name!=null&&t.hasOwnProperty("name")){let n=i.device.StringMaybe.verify(t.name);if(n)return"name."+n}if(t.version!=null&&t.hasOwnProperty("version")){let n=i.device.StringMaybe.verify(t.version);if(n)return"version."+n}if(t.publisher!=null&&t.hasOwnProperty("publisher")){let n=i.device.StringMaybe.verify(t.publisher);if(n)return"publisher."+n}if(t.installLocation!=null&&t.hasOwnProperty("installLocation")){let n=i.device.StringMaybe.verify(t.installLocation);if(n)return"installLocation."+n}if(t.installDate!=null&&t.hasOwnProperty("installDate")){let n=i.device.StringMaybe.verify(t.installDate);if(n)return"installDate."+n}if(t.language!=null&&t.hasOwnProperty("language")){let n=i.device.StringMaybe.verify(t.language);if(n)return"language."+n}return null},r.fromObject=function(t){if(t instanceof i.device.DeviceInfo.Applications.Software)return t;let n=new i.device.DeviceInfo.Applications.Software;if(t.answer!=null){if(typeof t.answer!="object")throw TypeError(".device.DeviceInfo.Applications.Software.answer: object expected");n.answer=i.device.Answer.fromObject(t.answer)}switch(t.architecture){case"ARCH_UNSUPPORTED":case 0:n.architecture=0;break;case"ARCH_UNKNOWN":case 1:n.architecture=1;break;case"ARCH_BIT32":case 2:n.architecture=2;break;case"ARCH_BIT64":case 3:n.architecture=3;break}switch(t.installDomain){case"DOMAIN_UNSUPPORTED":case 0:n.installDomain=0;break;case"DOMAIN_UNKNOWN":case 1:n.installDomain=1;break;case"DOMAIN_USER":case 2:n.installDomain=2;break;case"DOMAIN_MACHINE":case 3:n.installDomain=3;break}if(t.identifier!=null){if(typeof t.identifier!="object")throw TypeError(".device.DeviceInfo.Applications.Software.identifier: object expected");n.identifier=i.device.StringMaybe.fromObject(t.identifier)}if(t.name!=null){if(typeof t.name!="object")throw TypeError(".device.DeviceInfo.Applications.Software.name: object expected");n.name=i.device.StringMaybe.fromObject(t.name)}if(t.version!=null){if(typeof t.version!="object")throw TypeError(".device.DeviceInfo.Applications.Software.version: object expected");n.version=i.device.StringMaybe.fromObject(t.version)}if(t.publisher!=null){if(typeof t.publisher!="object")throw TypeError(".device.DeviceInfo.Applications.Software.publisher: object expected");n.publisher=i.device.StringMaybe.fromObject(t.publisher)}if(t.installLocation!=null){if(typeof t.installLocation!="object")throw TypeError(".device.DeviceInfo.Applications.Software.installLocation: object expected");n.installLocation=i.device.StringMaybe.fromObject(t.installLocation)}if(t.installDate!=null){if(typeof t.installDate!="object")throw TypeError(".device.DeviceInfo.Applications.Software.installDate: object expected");n.installDate=i.device.StringMaybe.fromObject(t.installDate)}if(t.language!=null){if(typeof t.language!="object")throw TypeError(".device.DeviceInfo.Applications.Software.language: object expected");n.language=i.device.StringMaybe.fromObject(t.language)}return n},r.toObject=function(t,n){n||(n={});let o={};return n.defaults&&(o.answer=null,o.architecture=n.enums===String?"ARCH_UNSUPPORTED":0,o.installDomain=n.enums===String?"DOMAIN_UNSUPPORTED":0,o.identifier=null,o.name=null,o.version=null,o.publisher=null,o.installLocation=null,o.installDate=null,o.language=null),t.answer!=null&&t.hasOwnProperty("answer")&&(o.answer=i.device.Answer.toObject(t.answer,n)),t.architecture!=null&&t.hasOwnProperty("architecture")&&(o.architecture=n.enums===String?i.device.DeviceInfo.Applications.Arch[t.architecture]:t.architecture),t.installDomain!=null&&t.hasOwnProperty("installDomain")&&(o.installDomain=n.enums===String?i.device.DeviceInfo.Applications.InstallDomain[t.installDomain]:t.installDomain),t.identifier!=null&&t.hasOwnProperty("identifier")&&(o.identifier=i.device.StringMaybe.toObject(t.identifier,n)),t.name!=null&&t.hasOwnProperty("name")&&(o.name=i.device.StringMaybe.toObject(t.name,n)),t.version!=null&&t.hasOwnProperty("version")&&(o.version=i.device.StringMaybe.toObject(t.version,n)),t.publisher!=null&&t.hasOwnProperty("publisher")&&(o.publisher=i.device.StringMaybe.toObject(t.publisher,n)),t.installLocation!=null&&t.hasOwnProperty("installLocation")&&(o.installLocation=i.device.StringMaybe.toObject(t.installLocation,n)),t.installDate!=null&&t.hasOwnProperty("installDate")&&(o.installDate=i.device.StringMaybe.toObject(t.installDate,n)),t.language!=null&&t.hasOwnProperty("language")&&(o.language=i.device.StringMaybe.toObject(t.language,n)),o},r.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},r}(),l.InstallDomain=function(){let r={},e=Object.create(r);return e[r[0]="DOMAIN_UNSUPPORTED"]=0,e[r[1]="DOMAIN_UNKNOWN"]=1,e[r[2]="DOMAIN_USER"]=2,e[r[3]="DOMAIN_MACHINE"]=3,e}(),l.Arch=function(){let r={},e=Object.create(r);return e[r[0]="ARCH_UNSUPPORTED"]=0,e[r[1]="ARCH_UNKNOWN"]=1,e[r[2]="ARCH_BIT32"]=2,e[r[3]="ARCH_BIT64"]=3,e}(),l}(),c.OSVersion=function(){function l(r){if(r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.major=null,l.prototype.minor=null,l.prototype.build=null,l.prototype.patch=null,l.prototype.revision=null,l.prototype.servicePack=null,l.prototype.isServer=null,l.prototype.sdk=null,l.prototype.previewSdk=null,l.prototype.incremental=null,l.prototype.securityPatch=null,l.prototype.userAgent=null,l.prototype.userAgentData=null,l.create=function(e){return new l(e)},l.encode=function(e,t){return t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.major!=null&&Object.hasOwnProperty.call(e,"major")&&i.device.Int32Maybe.encode(e.major,t.uint32(18).fork()).ldelim(),e.minor!=null&&Object.hasOwnProperty.call(e,"minor")&&i.device.Int32Maybe.encode(e.minor,t.uint32(26).fork()).ldelim(),e.build!=null&&Object.hasOwnProperty.call(e,"build")&&i.device.StringMaybe.encode(e.build,t.uint32(34).fork()).ldelim(),e.patch!=null&&Object.hasOwnProperty.call(e,"patch")&&i.device.Int32Maybe.encode(e.patch,t.uint32(42).fork()).ldelim(),e.revision!=null&&Object.hasOwnProperty.call(e,"revision")&&i.device.Int32Maybe.encode(e.revision,t.uint32(50).fork()).ldelim(),e.servicePack!=null&&Object.hasOwnProperty.call(e,"servicePack")&&i.device.StringMaybe.encode(e.servicePack,t.uint32(58).fork()).ldelim(),e.isServer!=null&&Object.hasOwnProperty.call(e,"isServer")&&i.device.BoolMaybe.encode(e.isServer,t.uint32(66).fork()).ldelim(),e.sdk!=null&&Object.hasOwnProperty.call(e,"sdk")&&i.device.Int32Maybe.encode(e.sdk,t.uint32(74).fork()).ldelim(),e.previewSdk!=null&&Object.hasOwnProperty.call(e,"previewSdk")&&i.device.Int32Maybe.encode(e.previewSdk,t.uint32(82).fork()).ldelim(),e.incremental!=null&&Object.hasOwnProperty.call(e,"incremental")&&i.device.StringMaybe.encode(e.incremental,t.uint32(90).fork()).ldelim(),e.securityPatch!=null&&Object.hasOwnProperty.call(e,"securityPatch")&&i.device.StringMaybe.encode(e.securityPatch,t.uint32(98).fork()).ldelim(),e.userAgent!=null&&Object.hasOwnProperty.call(e,"userAgent")&&i.device.StringMaybe.encode(e.userAgent,t.uint32(106).fork()).ldelim(),e.userAgentData!=null&&Object.hasOwnProperty.call(e,"userAgentData")&&i.device.DeviceInfo.OSVersion.UserAgentData.encode(e.userAgentData,t.uint32(114).fork()).ldelim(),t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.OSVersion;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.major=i.device.Int32Maybe.decode(e,e.uint32());break;case 3:o.minor=i.device.Int32Maybe.decode(e,e.uint32());break;case 4:o.build=i.device.StringMaybe.decode(e,e.uint32());break;case 5:o.patch=i.device.Int32Maybe.decode(e,e.uint32());break;case 6:o.revision=i.device.Int32Maybe.decode(e,e.uint32());break;case 7:o.servicePack=i.device.StringMaybe.decode(e,e.uint32());break;case 8:o.isServer=i.device.BoolMaybe.decode(e,e.uint32());break;case 9:o.sdk=i.device.Int32Maybe.decode(e,e.uint32());break;case 10:o.previewSdk=i.device.Int32Maybe.decode(e,e.uint32());break;case 11:o.incremental=i.device.StringMaybe.decode(e,e.uint32());break;case 12:o.securityPatch=i.device.StringMaybe.decode(e,e.uint32());break;case 13:o.userAgent=i.device.StringMaybe.decode(e,e.uint32());break;case 14:o.userAgentData=i.device.DeviceInfo.OSVersion.UserAgentData.decode(e,e.uint32());break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.major!=null&&e.hasOwnProperty("major")){let t=i.device.Int32Maybe.verify(e.major);if(t)return"major."+t}if(e.minor!=null&&e.hasOwnProperty("minor")){let t=i.device.Int32Maybe.verify(e.minor);if(t)return"minor."+t}if(e.build!=null&&e.hasOwnProperty("build")){let t=i.device.StringMaybe.verify(e.build);if(t)return"build."+t}if(e.patch!=null&&e.hasOwnProperty("patch")){let t=i.device.Int32Maybe.verify(e.patch);if(t)return"patch."+t}if(e.revision!=null&&e.hasOwnProperty("revision")){let t=i.device.Int32Maybe.verify(e.revision);if(t)return"revision."+t}if(e.servicePack!=null&&e.hasOwnProperty("servicePack")){let t=i.device.StringMaybe.verify(e.servicePack);if(t)return"servicePack."+t}if(e.isServer!=null&&e.hasOwnProperty("isServer")){let t=i.device.BoolMaybe.verify(e.isServer);if(t)return"isServer."+t}if(e.sdk!=null&&e.hasOwnProperty("sdk")){let t=i.device.Int32Maybe.verify(e.sdk);if(t)return"sdk."+t}if(e.previewSdk!=null&&e.hasOwnProperty("previewSdk")){let t=i.device.Int32Maybe.verify(e.previewSdk);if(t)return"previewSdk."+t}if(e.incremental!=null&&e.hasOwnProperty("incremental")){let t=i.device.StringMaybe.verify(e.incremental);if(t)return"incremental."+t}if(e.securityPatch!=null&&e.hasOwnProperty("securityPatch")){let t=i.device.StringMaybe.verify(e.securityPatch);if(t)return"securityPatch."+t}if(e.userAgent!=null&&e.hasOwnProperty("userAgent")){let t=i.device.StringMaybe.verify(e.userAgent);if(t)return"userAgent."+t}if(e.userAgentData!=null&&e.hasOwnProperty("userAgentData")){let t=i.device.DeviceInfo.OSVersion.UserAgentData.verify(e.userAgentData);if(t)return"userAgentData."+t}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.OSVersion)return e;let t=new i.device.DeviceInfo.OSVersion;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.OSVersion.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.major!=null){if(typeof e.major!="object")throw TypeError(".device.DeviceInfo.OSVersion.major: object expected");t.major=i.device.Int32Maybe.fromObject(e.major)}if(e.minor!=null){if(typeof e.minor!="object")throw TypeError(".device.DeviceInfo.OSVersion.minor: object expected");t.minor=i.device.Int32Maybe.fromObject(e.minor)}if(e.build!=null){if(typeof e.build!="object")throw TypeError(".device.DeviceInfo.OSVersion.build: object expected");t.build=i.device.StringMaybe.fromObject(e.build)}if(e.patch!=null){if(typeof e.patch!="object")throw TypeError(".device.DeviceInfo.OSVersion.patch: object expected");t.patch=i.device.Int32Maybe.fromObject(e.patch)}if(e.revision!=null){if(typeof e.revision!="object")throw TypeError(".device.DeviceInfo.OSVersion.revision: object expected");t.revision=i.device.Int32Maybe.fromObject(e.revision)}if(e.servicePack!=null){if(typeof e.servicePack!="object")throw TypeError(".device.DeviceInfo.OSVersion.servicePack: object expected");t.servicePack=i.device.StringMaybe.fromObject(e.servicePack)}if(e.isServer!=null){if(typeof e.isServer!="object")throw TypeError(".device.DeviceInfo.OSVersion.isServer: object expected");t.isServer=i.device.BoolMaybe.fromObject(e.isServer)}if(e.sdk!=null){if(typeof e.sdk!="object")throw TypeError(".device.DeviceInfo.OSVersion.sdk: object expected");t.sdk=i.device.Int32Maybe.fromObject(e.sdk)}if(e.previewSdk!=null){if(typeof e.previewSdk!="object")throw TypeError(".device.DeviceInfo.OSVersion.previewSdk: object expected");t.previewSdk=i.device.Int32Maybe.fromObject(e.previewSdk)}if(e.incremental!=null){if(typeof e.incremental!="object")throw TypeError(".device.DeviceInfo.OSVersion.incremental: object expected");t.incremental=i.device.StringMaybe.fromObject(e.incremental)}if(e.securityPatch!=null){if(typeof e.securityPatch!="object")throw TypeError(".device.DeviceInfo.OSVersion.securityPatch: object expected");t.securityPatch=i.device.StringMaybe.fromObject(e.securityPatch)}if(e.userAgent!=null){if(typeof e.userAgent!="object")throw TypeError(".device.DeviceInfo.OSVersion.userAgent: object expected");t.userAgent=i.device.StringMaybe.fromObject(e.userAgent)}if(e.userAgentData!=null){if(typeof e.userAgentData!="object")throw TypeError(".device.DeviceInfo.OSVersion.userAgentData: object expected");t.userAgentData=i.device.DeviceInfo.OSVersion.UserAgentData.fromObject(e.userAgentData)}return t},l.toObject=function(e,t){t||(t={});let n={};return t.defaults&&(n.answer=null,n.major=null,n.minor=null,n.build=null,n.patch=null,n.revision=null,n.servicePack=null,n.isServer=null,n.sdk=null,n.previewSdk=null,n.incremental=null,n.securityPatch=null,n.userAgent=null,n.userAgentData=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.major!=null&&e.hasOwnProperty("major")&&(n.major=i.device.Int32Maybe.toObject(e.major,t)),e.minor!=null&&e.hasOwnProperty("minor")&&(n.minor=i.device.Int32Maybe.toObject(e.minor,t)),e.build!=null&&e.hasOwnProperty("build")&&(n.build=i.device.StringMaybe.toObject(e.build,t)),e.patch!=null&&e.hasOwnProperty("patch")&&(n.patch=i.device.Int32Maybe.toObject(e.patch,t)),e.revision!=null&&e.hasOwnProperty("revision")&&(n.revision=i.device.Int32Maybe.toObject(e.revision,t)),e.servicePack!=null&&e.hasOwnProperty("servicePack")&&(n.servicePack=i.device.StringMaybe.toObject(e.servicePack,t)),e.isServer!=null&&e.hasOwnProperty("isServer")&&(n.isServer=i.device.BoolMaybe.toObject(e.isServer,t)),e.sdk!=null&&e.hasOwnProperty("sdk")&&(n.sdk=i.device.Int32Maybe.toObject(e.sdk,t)),e.previewSdk!=null&&e.hasOwnProperty("previewSdk")&&(n.previewSdk=i.device.Int32Maybe.toObject(e.previewSdk,t)),e.incremental!=null&&e.hasOwnProperty("incremental")&&(n.incremental=i.device.StringMaybe.toObject(e.incremental,t)),e.securityPatch!=null&&e.hasOwnProperty("securityPatch")&&(n.securityPatch=i.device.StringMaybe.toObject(e.securityPatch,t)),e.userAgent!=null&&e.hasOwnProperty("userAgent")&&(n.userAgent=i.device.StringMaybe.toObject(e.userAgent,t)),e.userAgentData!=null&&e.hasOwnProperty("userAgentData")&&(n.userAgentData=i.device.DeviceInfo.OSVersion.UserAgentData.toObject(e.userAgentData,t)),n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l.UserAgentData=function(){function r(e){if(e)for(let t=Object.keys(e),n=0;n<t.length;++n)e[t[n]]!=null&&(this[t[n]]=e[t[n]])}return r.prototype.answer=null,r.prototype.browser=null,r.prototype.platform=null,r.prototype.hostPlatform=null,r.prototype.device=null,r.prototype.clientData=null,r.create=function(t){return new r(t)},r.encode=function(t,n){return n||(n=we.create()),t.answer!=null&&Object.hasOwnProperty.call(t,"answer")&&i.device.Answer.encode(t.answer,n.uint32(10).fork()).ldelim(),t.browser!=null&&Object.hasOwnProperty.call(t,"browser")&&i.device.DeviceInfo.OSVersion.UserAgentData.Browser.encode(t.browser,n.uint32(18).fork()).ldelim(),t.platform!=null&&Object.hasOwnProperty.call(t,"platform")&&i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.encode(t.platform,n.uint32(26).fork()).ldelim(),t.device!=null&&Object.hasOwnProperty.call(t,"device")&&i.device.DeviceInfo.OSVersion.UserAgentData.Device.encode(t.device,n.uint32(34).fork()).ldelim(),t.clientData!=null&&Object.hasOwnProperty.call(t,"clientData")&&i.device.DeviceInfo.OSVersion.UserAgentData.ClientData.encode(t.clientData,n.uint32(42).fork()).ldelim(),t.hostPlatform!=null&&Object.hasOwnProperty.call(t,"hostPlatform")&&i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.encode(t.hostPlatform,n.uint32(50).fork()).ldelim(),n},r.encodeDelimited=function(t,n){return this.encode(t,n).ldelim()},r.decode=function(t,n){t instanceof U||(t=U.create(t));let o=n===void 0?t.len:t.pos+n,f=new i.device.DeviceInfo.OSVersion.UserAgentData;for(;t.pos<o;){let y=t.uint32();switch(y>>>3){case 1:f.answer=i.device.Answer.decode(t,t.uint32());break;case 2:f.browser=i.device.DeviceInfo.OSVersion.UserAgentData.Browser.decode(t,t.uint32());break;case 3:f.platform=i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.decode(t,t.uint32());break;case 6:f.hostPlatform=i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.decode(t,t.uint32());break;case 4:f.device=i.device.DeviceInfo.OSVersion.UserAgentData.Device.decode(t,t.uint32());break;case 5:f.clientData=i.device.DeviceInfo.OSVersion.UserAgentData.ClientData.decode(t,t.uint32());break;default:t.skipType(y&7);break}}return f},r.decodeDelimited=function(t){return t instanceof U||(t=new U(t)),this.decode(t,t.uint32())},r.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.answer!=null&&t.hasOwnProperty("answer")){let n=i.device.Answer.verify(t.answer);if(n)return"answer."+n}if(t.browser!=null&&t.hasOwnProperty("browser")){let n=i.device.DeviceInfo.OSVersion.UserAgentData.Browser.verify(t.browser);if(n)return"browser."+n}if(t.platform!=null&&t.hasOwnProperty("platform")){let n=i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.verify(t.platform);if(n)return"platform."+n}if(t.hostPlatform!=null&&t.hasOwnProperty("hostPlatform")){let n=i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.verify(t.hostPlatform);if(n)return"hostPlatform."+n}if(t.device!=null&&t.hasOwnProperty("device")){let n=i.device.DeviceInfo.OSVersion.UserAgentData.Device.verify(t.device);if(n)return"device."+n}if(t.clientData!=null&&t.hasOwnProperty("clientData")){let n=i.device.DeviceInfo.OSVersion.UserAgentData.ClientData.verify(t.clientData);if(n)return"clientData."+n}return null},r.fromObject=function(t){if(t instanceof i.device.DeviceInfo.OSVersion.UserAgentData)return t;let n=new i.device.DeviceInfo.OSVersion.UserAgentData;if(t.answer!=null){if(typeof t.answer!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.answer: object expected");n.answer=i.device.Answer.fromObject(t.answer)}if(t.browser!=null){if(typeof t.browser!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.browser: object expected");n.browser=i.device.DeviceInfo.OSVersion.UserAgentData.Browser.fromObject(t.browser)}if(t.platform!=null){if(typeof t.platform!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.platform: object expected");n.platform=i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.fromObject(t.platform)}if(t.hostPlatform!=null){if(typeof t.hostPlatform!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.hostPlatform: object expected");n.hostPlatform=i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.fromObject(t.hostPlatform)}if(t.device!=null){if(typeof t.device!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.device: object expected");n.device=i.device.DeviceInfo.OSVersion.UserAgentData.Device.fromObject(t.device)}if(t.clientData!=null){if(typeof t.clientData!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.clientData: object expected");n.clientData=i.device.DeviceInfo.OSVersion.UserAgentData.ClientData.fromObject(t.clientData)}return n},r.toObject=function(t,n){n||(n={});let o={};return n.defaults&&(o.answer=null,o.browser=null,o.platform=null,o.device=null,o.clientData=null,o.hostPlatform=null),t.answer!=null&&t.hasOwnProperty("answer")&&(o.answer=i.device.Answer.toObject(t.answer,n)),t.browser!=null&&t.hasOwnProperty("browser")&&(o.browser=i.device.DeviceInfo.OSVersion.UserAgentData.Browser.toObject(t.browser,n)),t.platform!=null&&t.hasOwnProperty("platform")&&(o.platform=i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.toObject(t.platform,n)),t.device!=null&&t.hasOwnProperty("device")&&(o.device=i.device.DeviceInfo.OSVersion.UserAgentData.Device.toObject(t.device,n)),t.clientData!=null&&t.hasOwnProperty("clientData")&&(o.clientData=i.device.DeviceInfo.OSVersion.UserAgentData.ClientData.toObject(t.clientData,n)),t.hostPlatform!=null&&t.hasOwnProperty("hostPlatform")&&(o.hostPlatform=i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.toObject(t.hostPlatform,n)),o},r.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},r.Browser=function(){function e(t){if(t)for(let n=Object.keys(t),o=0;o<n.length;++o)t[n[o]]!=null&&(this[n[o]]=t[n[o]])}return e.prototype.answer=null,e.prototype.name=null,e.prototype.version=null,e.prototype.engineName=null,e.prototype.engineVersion=null,e.create=function(n){return new e(n)},e.encode=function(n,o){return o||(o=we.create()),n.answer!=null&&Object.hasOwnProperty.call(n,"answer")&&i.device.Answer.encode(n.answer,o.uint32(10).fork()).ldelim(),n.name!=null&&Object.hasOwnProperty.call(n,"name")&&i.device.StringMaybe.encode(n.name,o.uint32(18).fork()).ldelim(),n.version!=null&&Object.hasOwnProperty.call(n,"version")&&i.device.StringMaybe.encode(n.version,o.uint32(26).fork()).ldelim(),n.engineName!=null&&Object.hasOwnProperty.call(n,"engineName")&&i.device.StringMaybe.encode(n.engineName,o.uint32(34).fork()).ldelim(),n.engineVersion!=null&&Object.hasOwnProperty.call(n,"engineVersion")&&i.device.StringMaybe.encode(n.engineVersion,o.uint32(42).fork()).ldelim(),o},e.encodeDelimited=function(n,o){return this.encode(n,o).ldelim()},e.decode=function(n,o){n instanceof U||(n=U.create(n));let f=o===void 0?n.len:n.pos+o,y=new i.device.DeviceInfo.OSVersion.UserAgentData.Browser;for(;n.pos<f;){let O=n.uint32();switch(O>>>3){case 1:y.answer=i.device.Answer.decode(n,n.uint32());break;case 2:y.name=i.device.StringMaybe.decode(n,n.uint32());break;case 3:y.version=i.device.StringMaybe.decode(n,n.uint32());break;case 4:y.engineName=i.device.StringMaybe.decode(n,n.uint32());break;case 5:y.engineVersion=i.device.StringMaybe.decode(n,n.uint32());break;default:n.skipType(O&7);break}}return y},e.decodeDelimited=function(n){return n instanceof U||(n=new U(n)),this.decode(n,n.uint32())},e.verify=function(n){if(typeof n!="object"||n===null)return"object expected";if(n.answer!=null&&n.hasOwnProperty("answer")){let o=i.device.Answer.verify(n.answer);if(o)return"answer."+o}if(n.name!=null&&n.hasOwnProperty("name")){let o=i.device.StringMaybe.verify(n.name);if(o)return"name."+o}if(n.version!=null&&n.hasOwnProperty("version")){let o=i.device.StringMaybe.verify(n.version);if(o)return"version."+o}if(n.engineName!=null&&n.hasOwnProperty("engineName")){let o=i.device.StringMaybe.verify(n.engineName);if(o)return"engineName."+o}if(n.engineVersion!=null&&n.hasOwnProperty("engineVersion")){let o=i.device.StringMaybe.verify(n.engineVersion);if(o)return"engineVersion."+o}return null},e.fromObject=function(n){if(n instanceof i.device.DeviceInfo.OSVersion.UserAgentData.Browser)return n;let o=new i.device.DeviceInfo.OSVersion.UserAgentData.Browser;if(n.answer!=null){if(typeof n.answer!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.Browser.answer: object expected");o.answer=i.device.Answer.fromObject(n.answer)}if(n.name!=null){if(typeof n.name!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.Browser.name: object expected");o.name=i.device.StringMaybe.fromObject(n.name)}if(n.version!=null){if(typeof n.version!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.Browser.version: object expected");o.version=i.device.StringMaybe.fromObject(n.version)}if(n.engineName!=null){if(typeof n.engineName!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.Browser.engineName: object expected");o.engineName=i.device.StringMaybe.fromObject(n.engineName)}if(n.engineVersion!=null){if(typeof n.engineVersion!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.Browser.engineVersion: object expected");o.engineVersion=i.device.StringMaybe.fromObject(n.engineVersion)}return o},e.toObject=function(n,o){o||(o={});let f={};return o.defaults&&(f.answer=null,f.name=null,f.version=null,f.engineName=null,f.engineVersion=null),n.answer!=null&&n.hasOwnProperty("answer")&&(f.answer=i.device.Answer.toObject(n.answer,o)),n.name!=null&&n.hasOwnProperty("name")&&(f.name=i.device.StringMaybe.toObject(n.name,o)),n.version!=null&&n.hasOwnProperty("version")&&(f.version=i.device.StringMaybe.toObject(n.version,o)),n.engineName!=null&&n.hasOwnProperty("engineName")&&(f.engineName=i.device.StringMaybe.toObject(n.engineName,o)),n.engineVersion!=null&&n.hasOwnProperty("engineVersion")&&(f.engineVersion=i.device.StringMaybe.toObject(n.engineVersion,o)),f},e.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},e}(),r.HostPlatform=function(){function e(t){if(t)for(let n=Object.keys(t),o=0;o<n.length;++o)t[n[o]]!=null&&(this[n[o]]=t[n[o]])}return e.prototype.answer=null,e.prototype.name=null,e.prototype.version=null,e.create=function(n){return new e(n)},e.encode=function(n,o){return o||(o=we.create()),n.answer!=null&&Object.hasOwnProperty.call(n,"answer")&&i.device.Answer.encode(n.answer,o.uint32(10).fork()).ldelim(),n.name!=null&&Object.hasOwnProperty.call(n,"name")&&i.device.StringMaybe.encode(n.name,o.uint32(18).fork()).ldelim(),n.version!=null&&Object.hasOwnProperty.call(n,"version")&&i.device.StringMaybe.encode(n.version,o.uint32(26).fork()).ldelim(),o},e.encodeDelimited=function(n,o){return this.encode(n,o).ldelim()},e.decode=function(n,o){n instanceof U||(n=U.create(n));let f=o===void 0?n.len:n.pos+o,y=new i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform;for(;n.pos<f;){let O=n.uint32();switch(O>>>3){case 1:y.answer=i.device.Answer.decode(n,n.uint32());break;case 2:y.name=i.device.StringMaybe.decode(n,n.uint32());break;case 3:y.version=i.device.StringMaybe.decode(n,n.uint32());break;default:n.skipType(O&7);break}}return y},e.decodeDelimited=function(n){return n instanceof U||(n=new U(n)),this.decode(n,n.uint32())},e.verify=function(n){if(typeof n!="object"||n===null)return"object expected";if(n.answer!=null&&n.hasOwnProperty("answer")){let o=i.device.Answer.verify(n.answer);if(o)return"answer."+o}if(n.name!=null&&n.hasOwnProperty("name")){let o=i.device.StringMaybe.verify(n.name);if(o)return"name."+o}if(n.version!=null&&n.hasOwnProperty("version")){let o=i.device.StringMaybe.verify(n.version);if(o)return"version."+o}return null},e.fromObject=function(n){if(n instanceof i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform)return n;let o=new i.device.DeviceInfo.OSVersion.UserAgentData.HostPlatform;if(n.answer!=null){if(typeof n.answer!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.answer: object expected");o.answer=i.device.Answer.fromObject(n.answer)}if(n.name!=null){if(typeof n.name!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.name: object expected");o.name=i.device.StringMaybe.fromObject(n.name)}if(n.version!=null){if(typeof n.version!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.HostPlatform.version: object expected");o.version=i.device.StringMaybe.fromObject(n.version)}return o},e.toObject=function(n,o){o||(o={});let f={};return o.defaults&&(f.answer=null,f.name=null,f.version=null),n.answer!=null&&n.hasOwnProperty("answer")&&(f.answer=i.device.Answer.toObject(n.answer,o)),n.name!=null&&n.hasOwnProperty("name")&&(f.name=i.device.StringMaybe.toObject(n.name,o)),n.version!=null&&n.hasOwnProperty("version")&&(f.version=i.device.StringMaybe.toObject(n.version,o)),f},e.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},e}(),r.Device=function(){function e(t){if(t)for(let n=Object.keys(t),o=0;o<n.length;++o)t[n[o]]!=null&&(this[n[o]]=t[n[o]])}return e.prototype.answer=null,e.prototype.architecture=null,e.prototype.model=null,e.prototype.type=null,e.prototype.vendor=null,e.create=function(n){return new e(n)},e.encode=function(n,o){return o||(o=we.create()),n.answer!=null&&Object.hasOwnProperty.call(n,"answer")&&i.device.Answer.encode(n.answer,o.uint32(10).fork()).ldelim(),n.architecture!=null&&Object.hasOwnProperty.call(n,"architecture")&&i.device.StringMaybe.encode(n.architecture,o.uint32(18).fork()).ldelim(),n.model!=null&&Object.hasOwnProperty.call(n,"model")&&i.device.StringMaybe.encode(n.model,o.uint32(26).fork()).ldelim(),n.type!=null&&Object.hasOwnProperty.call(n,"type")&&i.device.StringMaybe.encode(n.type,o.uint32(34).fork()).ldelim(),n.vendor!=null&&Object.hasOwnProperty.call(n,"vendor")&&i.device.StringMaybe.encode(n.vendor,o.uint32(42).fork()).ldelim(),o},e.encodeDelimited=function(n,o){return this.encode(n,o).ldelim()},e.decode=function(n,o){n instanceof U||(n=U.create(n));let f=o===void 0?n.len:n.pos+o,y=new i.device.DeviceInfo.OSVersion.UserAgentData.Device;for(;n.pos<f;){let O=n.uint32();switch(O>>>3){case 1:y.answer=i.device.Answer.decode(n,n.uint32());break;case 2:y.architecture=i.device.StringMaybe.decode(n,n.uint32());break;case 3:y.model=i.device.StringMaybe.decode(n,n.uint32());break;case 4:y.type=i.device.StringMaybe.decode(n,n.uint32());break;case 5:y.vendor=i.device.StringMaybe.decode(n,n.uint32());break;default:n.skipType(O&7);break}}return y},e.decodeDelimited=function(n){return n instanceof U||(n=new U(n)),this.decode(n,n.uint32())},e.verify=function(n){if(typeof n!="object"||n===null)return"object expected";if(n.answer!=null&&n.hasOwnProperty("answer")){let o=i.device.Answer.verify(n.answer);if(o)return"answer."+o}if(n.architecture!=null&&n.hasOwnProperty("architecture")){let o=i.device.StringMaybe.verify(n.architecture);if(o)return"architecture."+o}if(n.model!=null&&n.hasOwnProperty("model")){let o=i.device.StringMaybe.verify(n.model);if(o)return"model."+o}if(n.type!=null&&n.hasOwnProperty("type")){let o=i.device.StringMaybe.verify(n.type);if(o)return"type."+o}if(n.vendor!=null&&n.hasOwnProperty("vendor")){let o=i.device.StringMaybe.verify(n.vendor);if(o)return"vendor."+o}return null},e.fromObject=function(n){if(n instanceof i.device.DeviceInfo.OSVersion.UserAgentData.Device)return n;let o=new i.device.DeviceInfo.OSVersion.UserAgentData.Device;if(n.answer!=null){if(typeof n.answer!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.Device.answer: object expected");o.answer=i.device.Answer.fromObject(n.answer)}if(n.architecture!=null){if(typeof n.architecture!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.Device.architecture: object expected");o.architecture=i.device.StringMaybe.fromObject(n.architecture)}if(n.model!=null){if(typeof n.model!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.Device.model: object expected");o.model=i.device.StringMaybe.fromObject(n.model)}if(n.type!=null){if(typeof n.type!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.Device.type: object expected");o.type=i.device.StringMaybe.fromObject(n.type)}if(n.vendor!=null){if(typeof n.vendor!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.Device.vendor: object expected");o.vendor=i.device.StringMaybe.fromObject(n.vendor)}return o},e.toObject=function(n,o){o||(o={});let f={};return o.defaults&&(f.answer=null,f.architecture=null,f.model=null,f.type=null,f.vendor=null),n.answer!=null&&n.hasOwnProperty("answer")&&(f.answer=i.device.Answer.toObject(n.answer,o)),n.architecture!=null&&n.hasOwnProperty("architecture")&&(f.architecture=i.device.StringMaybe.toObject(n.architecture,o)),n.model!=null&&n.hasOwnProperty("model")&&(f.model=i.device.StringMaybe.toObject(n.model,o)),n.type!=null&&n.hasOwnProperty("type")&&(f.type=i.device.StringMaybe.toObject(n.type,o)),n.vendor!=null&&n.hasOwnProperty("vendor")&&(f.vendor=i.device.StringMaybe.toObject(n.vendor,o)),f},e.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},e}(),r.ClientData=function(){function e(t){if(t)for(let n=Object.keys(t),o=0;o<n.length;++o)t[n[o]]!=null&&(this[n[o]]=t[n[o]])}return e.prototype.answer=null,e.prototype.platform=null,e.prototype.mobile=null,e.prototype.architecture=null,e.prototype.bitness=null,e.prototype.model=null,e.prototype.platformVersion=null,e.prototype.uaFullVerson=null,e.create=function(n){return new e(n)},e.encode=function(n,o){return o||(o=we.create()),n.answer!=null&&Object.hasOwnProperty.call(n,"answer")&&i.device.Answer.encode(n.answer,o.uint32(10).fork()).ldelim(),n.platform!=null&&Object.hasOwnProperty.call(n,"platform")&&i.device.StringMaybe.encode(n.platform,o.uint32(18).fork()).ldelim(),n.mobile!=null&&Object.hasOwnProperty.call(n,"mobile")&&i.device.BoolMaybe.encode(n.mobile,o.uint32(26).fork()).ldelim(),n.architecture!=null&&Object.hasOwnProperty.call(n,"architecture")&&i.device.StringMaybe.encode(n.architecture,o.uint32(34).fork()).ldelim(),n.bitness!=null&&Object.hasOwnProperty.call(n,"bitness")&&i.device.StringMaybe.encode(n.bitness,o.uint32(42).fork()).ldelim(),n.model!=null&&Object.hasOwnProperty.call(n,"model")&&i.device.StringMaybe.encode(n.model,o.uint32(50).fork()).ldelim(),n.platformVersion!=null&&Object.hasOwnProperty.call(n,"platformVersion")&&i.device.StringMaybe.encode(n.platformVersion,o.uint32(58).fork()).ldelim(),n.uaFullVerson!=null&&Object.hasOwnProperty.call(n,"uaFullVerson")&&i.device.StringMaybe.encode(n.uaFullVerson,o.uint32(66).fork()).ldelim(),o},e.encodeDelimited=function(n,o){return this.encode(n,o).ldelim()},e.decode=function(n,o){n instanceof U||(n=U.create(n));let f=o===void 0?n.len:n.pos+o,y=new i.device.DeviceInfo.OSVersion.UserAgentData.ClientData;for(;n.pos<f;){let O=n.uint32();switch(O>>>3){case 1:y.answer=i.device.Answer.decode(n,n.uint32());break;case 2:y.platform=i.device.StringMaybe.decode(n,n.uint32());break;case 3:y.mobile=i.device.BoolMaybe.decode(n,n.uint32());break;case 4:y.architecture=i.device.StringMaybe.decode(n,n.uint32());break;case 5:y.bitness=i.device.StringMaybe.decode(n,n.uint32());break;case 6:y.model=i.device.StringMaybe.decode(n,n.uint32());break;case 7:y.platformVersion=i.device.StringMaybe.decode(n,n.uint32());break;case 8:y.uaFullVerson=i.device.StringMaybe.decode(n,n.uint32());break;default:n.skipType(O&7);break}}return y},e.decodeDelimited=function(n){return n instanceof U||(n=new U(n)),this.decode(n,n.uint32())},e.verify=function(n){if(typeof n!="object"||n===null)return"object expected";if(n.answer!=null&&n.hasOwnProperty("answer")){let o=i.device.Answer.verify(n.answer);if(o)return"answer."+o}if(n.platform!=null&&n.hasOwnProperty("platform")){let o=i.device.StringMaybe.verify(n.platform);if(o)return"platform."+o}if(n.mobile!=null&&n.hasOwnProperty("mobile")){let o=i.device.BoolMaybe.verify(n.mobile);if(o)return"mobile."+o}if(n.architecture!=null&&n.hasOwnProperty("architecture")){let o=i.device.StringMaybe.verify(n.architecture);if(o)return"architecture."+o}if(n.bitness!=null&&n.hasOwnProperty("bitness")){let o=i.device.StringMaybe.verify(n.bitness);if(o)return"bitness."+o}if(n.model!=null&&n.hasOwnProperty("model")){let o=i.device.StringMaybe.verify(n.model);if(o)return"model."+o}if(n.platformVersion!=null&&n.hasOwnProperty("platformVersion")){let o=i.device.StringMaybe.verify(n.platformVersion);if(o)return"platformVersion."+o}if(n.uaFullVerson!=null&&n.hasOwnProperty("uaFullVerson")){let o=i.device.StringMaybe.verify(n.uaFullVerson);if(o)return"uaFullVerson."+o}return null},e.fromObject=function(n){if(n instanceof i.device.DeviceInfo.OSVersion.UserAgentData.ClientData)return n;let o=new i.device.DeviceInfo.OSVersion.UserAgentData.ClientData;if(n.answer!=null){if(typeof n.answer!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.ClientData.answer: object expected");o.answer=i.device.Answer.fromObject(n.answer)}if(n.platform!=null){if(typeof n.platform!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.ClientData.platform: object expected");o.platform=i.device.StringMaybe.fromObject(n.platform)}if(n.mobile!=null){if(typeof n.mobile!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.ClientData.mobile: object expected");o.mobile=i.device.BoolMaybe.fromObject(n.mobile)}if(n.architecture!=null){if(typeof n.architecture!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.ClientData.architecture: object expected");o.architecture=i.device.StringMaybe.fromObject(n.architecture)}if(n.bitness!=null){if(typeof n.bitness!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.ClientData.bitness: object expected");o.bitness=i.device.StringMaybe.fromObject(n.bitness)}if(n.model!=null){if(typeof n.model!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.ClientData.model: object expected");o.model=i.device.StringMaybe.fromObject(n.model)}if(n.platformVersion!=null){if(typeof n.platformVersion!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.ClientData.platformVersion: object expected");o.platformVersion=i.device.StringMaybe.fromObject(n.platformVersion)}if(n.uaFullVerson!=null){if(typeof n.uaFullVerson!="object")throw TypeError(".device.DeviceInfo.OSVersion.UserAgentData.ClientData.uaFullVerson: object expected");o.uaFullVerson=i.device.StringMaybe.fromObject(n.uaFullVerson)}return o},e.toObject=function(n,o){o||(o={});let f={};return o.defaults&&(f.answer=null,f.platform=null,f.mobile=null,f.architecture=null,f.bitness=null,f.model=null,f.platformVersion=null,f.uaFullVerson=null),n.answer!=null&&n.hasOwnProperty("answer")&&(f.answer=i.device.Answer.toObject(n.answer,o)),n.platform!=null&&n.hasOwnProperty("platform")&&(f.platform=i.device.StringMaybe.toObject(n.platform,o)),n.mobile!=null&&n.hasOwnProperty("mobile")&&(f.mobile=i.device.BoolMaybe.toObject(n.mobile,o)),n.architecture!=null&&n.hasOwnProperty("architecture")&&(f.architecture=i.device.StringMaybe.toObject(n.architecture,o)),n.bitness!=null&&n.hasOwnProperty("bitness")&&(f.bitness=i.device.StringMaybe.toObject(n.bitness,o)),n.model!=null&&n.hasOwnProperty("model")&&(f.model=i.device.StringMaybe.toObject(n.model,o)),n.platformVersion!=null&&n.hasOwnProperty("platformVersion")&&(f.platformVersion=i.device.StringMaybe.toObject(n.platformVersion,o)),n.uaFullVerson!=null&&n.hasOwnProperty("uaFullVerson")&&(f.uaFullVerson=i.device.StringMaybe.toObject(n.uaFullVerson,o)),f},e.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},e}(),r}(),l}(),c.BiSdkInfo=function(){function l(r){if(r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.sdkVersion=null,l.prototype.appVersion=null,l.prototype.clientId=null,l.create=function(e){return new l(e)},l.encode=function(e,t){return t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.sdkVersion!=null&&Object.hasOwnProperty.call(e,"sdkVersion")&&i.device.StringMaybe.encode(e.sdkVersion,t.uint32(18).fork()).ldelim(),e.appVersion!=null&&Object.hasOwnProperty.call(e,"appVersion")&&i.device.StringMaybe.encode(e.appVersion,t.uint32(26).fork()).ldelim(),e.clientId!=null&&Object.hasOwnProperty.call(e,"clientId")&&i.device.StringMaybe.encode(e.clientId,t.uint32(34).fork()).ldelim(),t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.BiSdkInfo;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.sdkVersion=i.device.StringMaybe.decode(e,e.uint32());break;case 3:o.appVersion=i.device.StringMaybe.decode(e,e.uint32());break;case 4:o.clientId=i.device.StringMaybe.decode(e,e.uint32());break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.sdkVersion!=null&&e.hasOwnProperty("sdkVersion")){let t=i.device.StringMaybe.verify(e.sdkVersion);if(t)return"sdkVersion."+t}if(e.appVersion!=null&&e.hasOwnProperty("appVersion")){let t=i.device.StringMaybe.verify(e.appVersion);if(t)return"appVersion."+t}if(e.clientId!=null&&e.hasOwnProperty("clientId")){let t=i.device.StringMaybe.verify(e.clientId);if(t)return"clientId."+t}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.BiSdkInfo)return e;let t=new i.device.DeviceInfo.BiSdkInfo;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.BiSdkInfo.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.sdkVersion!=null){if(typeof e.sdkVersion!="object")throw TypeError(".device.DeviceInfo.BiSdkInfo.sdkVersion: object expected");t.sdkVersion=i.device.StringMaybe.fromObject(e.sdkVersion)}if(e.appVersion!=null){if(typeof e.appVersion!="object")throw TypeError(".device.DeviceInfo.BiSdkInfo.appVersion: object expected");t.appVersion=i.device.StringMaybe.fromObject(e.appVersion)}if(e.clientId!=null){if(typeof e.clientId!="object")throw TypeError(".device.DeviceInfo.BiSdkInfo.clientId: object expected");t.clientId=i.device.StringMaybe.fromObject(e.clientId)}return t},l.toObject=function(e,t){t||(t={});let n={};return t.defaults&&(n.answer=null,n.sdkVersion=null,n.appVersion=null,n.clientId=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.sdkVersion!=null&&e.hasOwnProperty("sdkVersion")&&(n.sdkVersion=i.device.StringMaybe.toObject(e.sdkVersion,t)),e.appVersion!=null&&e.hasOwnProperty("appVersion")&&(n.appVersion=i.device.StringMaybe.toObject(e.appVersion,t)),e.clientId!=null&&e.hasOwnProperty("clientId")&&(n.clientId=i.device.StringMaybe.toObject(e.clientId,t)),n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l}(),c.DeviceType=function(){function l(r){if(r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.model=null,l.prototype.isJailbroken=null,l.prototype.manufacturer=null,l.prototype.isRooted=null,l.create=function(e){return new l(e)},l.encode=function(e,t){return t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.model!=null&&Object.hasOwnProperty.call(e,"model")&&i.device.StringMaybe.encode(e.model,t.uint32(18).fork()).ldelim(),e.isJailbroken!=null&&Object.hasOwnProperty.call(e,"isJailbroken")&&i.device.BoolMaybe.encode(e.isJailbroken,t.uint32(26).fork()).ldelim(),e.manufacturer!=null&&Object.hasOwnProperty.call(e,"manufacturer")&&i.device.StringMaybe.encode(e.manufacturer,t.uint32(34).fork()).ldelim(),e.isRooted!=null&&Object.hasOwnProperty.call(e,"isRooted")&&i.device.BoolMaybe.encode(e.isRooted,t.uint32(42).fork()).ldelim(),t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.DeviceType;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.model=i.device.StringMaybe.decode(e,e.uint32());break;case 3:o.isJailbroken=i.device.BoolMaybe.decode(e,e.uint32());break;case 4:o.manufacturer=i.device.StringMaybe.decode(e,e.uint32());break;case 5:o.isRooted=i.device.BoolMaybe.decode(e,e.uint32());break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.model!=null&&e.hasOwnProperty("model")){let t=i.device.StringMaybe.verify(e.model);if(t)return"model."+t}if(e.isJailbroken!=null&&e.hasOwnProperty("isJailbroken")){let t=i.device.BoolMaybe.verify(e.isJailbroken);if(t)return"isJailbroken."+t}if(e.manufacturer!=null&&e.hasOwnProperty("manufacturer")){let t=i.device.StringMaybe.verify(e.manufacturer);if(t)return"manufacturer."+t}if(e.isRooted!=null&&e.hasOwnProperty("isRooted")){let t=i.device.BoolMaybe.verify(e.isRooted);if(t)return"isRooted."+t}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.DeviceType)return e;let t=new i.device.DeviceInfo.DeviceType;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.DeviceType.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.model!=null){if(typeof e.model!="object")throw TypeError(".device.DeviceInfo.DeviceType.model: object expected");t.model=i.device.StringMaybe.fromObject(e.model)}if(e.isJailbroken!=null){if(typeof e.isJailbroken!="object")throw TypeError(".device.DeviceInfo.DeviceType.isJailbroken: object expected");t.isJailbroken=i.device.BoolMaybe.fromObject(e.isJailbroken)}if(e.manufacturer!=null){if(typeof e.manufacturer!="object")throw TypeError(".device.DeviceInfo.DeviceType.manufacturer: object expected");t.manufacturer=i.device.StringMaybe.fromObject(e.manufacturer)}if(e.isRooted!=null){if(typeof e.isRooted!="object")throw TypeError(".device.DeviceInfo.DeviceType.isRooted: object expected");t.isRooted=i.device.BoolMaybe.fromObject(e.isRooted)}return t},l.toObject=function(e,t){t||(t={});let n={};return t.defaults&&(n.answer=null,n.model=null,n.isJailbroken=null,n.manufacturer=null,n.isRooted=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.model!=null&&e.hasOwnProperty("model")&&(n.model=i.device.StringMaybe.toObject(e.model,t)),e.isJailbroken!=null&&e.hasOwnProperty("isJailbroken")&&(n.isJailbroken=i.device.BoolMaybe.toObject(e.isJailbroken,t)),e.manufacturer!=null&&e.hasOwnProperty("manufacturer")&&(n.manufacturer=i.device.StringMaybe.toObject(e.manufacturer,t)),e.isRooted!=null&&e.hasOwnProperty("isRooted")&&(n.isRooted=i.device.BoolMaybe.toObject(e.isRooted,t)),n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l}(),c.Authentication=function(){function l(r){if(r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.loginProviderName=null,l.prototype.loginProviderGuid=null,l.prototype.isTpmAvailable=null,l.prototype.isPasswordSet=null,l.prototype.isBiometricsSet=null,l.prototype.isWatchAuthenticationEnabled=null,l.prototype.isSecureEnclaveAvailable=null,l.prototype.isWebauthnAvailable=null,l.prototype.isPlatformAuthenticatorAvailable=null,l.create=function(e){return new l(e)},l.encode=function(e,t){return t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.loginProviderName!=null&&Object.hasOwnProperty.call(e,"loginProviderName")&&i.device.StringMaybe.encode(e.loginProviderName,t.uint32(18).fork()).ldelim(),e.loginProviderGuid!=null&&Object.hasOwnProperty.call(e,"loginProviderGuid")&&i.device.StringMaybe.encode(e.loginProviderGuid,t.uint32(26).fork()).ldelim(),e.isTpmAvailable!=null&&Object.hasOwnProperty.call(e,"isTpmAvailable")&&i.device.BoolMaybe.encode(e.isTpmAvailable,t.uint32(34).fork()).ldelim(),e.isPasswordSet!=null&&Object.hasOwnProperty.call(e,"isPasswordSet")&&i.device.BoolMaybe.encode(e.isPasswordSet,t.uint32(42).fork()).ldelim(),e.isBiometricsSet!=null&&Object.hasOwnProperty.call(e,"isBiometricsSet")&&i.device.BoolMaybe.encode(e.isBiometricsSet,t.uint32(50).fork()).ldelim(),e.isWatchAuthenticationEnabled!=null&&Object.hasOwnProperty.call(e,"isWatchAuthenticationEnabled")&&i.device.BoolMaybe.encode(e.isWatchAuthenticationEnabled,t.uint32(58).fork()).ldelim(),e.isSecureEnclaveAvailable!=null&&Object.hasOwnProperty.call(e,"isSecureEnclaveAvailable")&&i.device.BoolMaybe.encode(e.isSecureEnclaveAvailable,t.uint32(66).fork()).ldelim(),e.isWebauthnAvailable!=null&&Object.hasOwnProperty.call(e,"isWebauthnAvailable")&&i.device.BoolMaybe.encode(e.isWebauthnAvailable,t.uint32(74).fork()).ldelim(),e.isPlatformAuthenticatorAvailable!=null&&Object.hasOwnProperty.call(e,"isPlatformAuthenticatorAvailable")&&i.device.BoolMaybe.encode(e.isPlatformAuthenticatorAvailable,t.uint32(82).fork()).ldelim(),t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.Authentication;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.loginProviderName=i.device.StringMaybe.decode(e,e.uint32());break;case 3:o.loginProviderGuid=i.device.StringMaybe.decode(e,e.uint32());break;case 4:o.isTpmAvailable=i.device.BoolMaybe.decode(e,e.uint32());break;case 5:o.isPasswordSet=i.device.BoolMaybe.decode(e,e.uint32());break;case 6:o.isBiometricsSet=i.device.BoolMaybe.decode(e,e.uint32());break;case 7:o.isWatchAuthenticationEnabled=i.device.BoolMaybe.decode(e,e.uint32());break;case 8:o.isSecureEnclaveAvailable=i.device.BoolMaybe.decode(e,e.uint32());break;case 9:o.isWebauthnAvailable=i.device.BoolMaybe.decode(e,e.uint32());break;case 10:o.isPlatformAuthenticatorAvailable=i.device.BoolMaybe.decode(e,e.uint32());break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.loginProviderName!=null&&e.hasOwnProperty("loginProviderName")){let t=i.device.StringMaybe.verify(e.loginProviderName);if(t)return"loginProviderName."+t}if(e.loginProviderGuid!=null&&e.hasOwnProperty("loginProviderGuid")){let t=i.device.StringMaybe.verify(e.loginProviderGuid);if(t)return"loginProviderGuid."+t}if(e.isTpmAvailable!=null&&e.hasOwnProperty("isTpmAvailable")){let t=i.device.BoolMaybe.verify(e.isTpmAvailable);if(t)return"isTpmAvailable."+t}if(e.isPasswordSet!=null&&e.hasOwnProperty("isPasswordSet")){let t=i.device.BoolMaybe.verify(e.isPasswordSet);if(t)return"isPasswordSet."+t}if(e.isBiometricsSet!=null&&e.hasOwnProperty("isBiometricsSet")){let t=i.device.BoolMaybe.verify(e.isBiometricsSet);if(t)return"isBiometricsSet."+t}if(e.isWatchAuthenticationEnabled!=null&&e.hasOwnProperty("isWatchAuthenticationEnabled")){let t=i.device.BoolMaybe.verify(e.isWatchAuthenticationEnabled);if(t)return"isWatchAuthenticationEnabled."+t}if(e.isSecureEnclaveAvailable!=null&&e.hasOwnProperty("isSecureEnclaveAvailable")){let t=i.device.BoolMaybe.verify(e.isSecureEnclaveAvailable);if(t)return"isSecureEnclaveAvailable."+t}if(e.isWebauthnAvailable!=null&&e.hasOwnProperty("isWebauthnAvailable")){let t=i.device.BoolMaybe.verify(e.isWebauthnAvailable);if(t)return"isWebauthnAvailable."+t}if(e.isPlatformAuthenticatorAvailable!=null&&e.hasOwnProperty("isPlatformAuthenticatorAvailable")){let t=i.device.BoolMaybe.verify(e.isPlatformAuthenticatorAvailable);if(t)return"isPlatformAuthenticatorAvailable."+t}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.Authentication)return e;let t=new i.device.DeviceInfo.Authentication;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.Authentication.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.loginProviderName!=null){if(typeof e.loginProviderName!="object")throw TypeError(".device.DeviceInfo.Authentication.loginProviderName: object expected");t.loginProviderName=i.device.StringMaybe.fromObject(e.loginProviderName)}if(e.loginProviderGuid!=null){if(typeof e.loginProviderGuid!="object")throw TypeError(".device.DeviceInfo.Authentication.loginProviderGuid: object expected");t.loginProviderGuid=i.device.StringMaybe.fromObject(e.loginProviderGuid)}if(e.isTpmAvailable!=null){if(typeof e.isTpmAvailable!="object")throw TypeError(".device.DeviceInfo.Authentication.isTpmAvailable: object expected");t.isTpmAvailable=i.device.BoolMaybe.fromObject(e.isTpmAvailable)}if(e.isPasswordSet!=null){if(typeof e.isPasswordSet!="object")throw TypeError(".device.DeviceInfo.Authentication.isPasswordSet: object expected");t.isPasswordSet=i.device.BoolMaybe.fromObject(e.isPasswordSet)}if(e.isBiometricsSet!=null){if(typeof e.isBiometricsSet!="object")throw TypeError(".device.DeviceInfo.Authentication.isBiometricsSet: object expected");t.isBiometricsSet=i.device.BoolMaybe.fromObject(e.isBiometricsSet)}if(e.isWatchAuthenticationEnabled!=null){if(typeof e.isWatchAuthenticationEnabled!="object")throw TypeError(".device.DeviceInfo.Authentication.isWatchAuthenticationEnabled: object expected");t.isWatchAuthenticationEnabled=i.device.BoolMaybe.fromObject(e.isWatchAuthenticationEnabled)}if(e.isSecureEnclaveAvailable!=null){if(typeof e.isSecureEnclaveAvailable!="object")throw TypeError(".device.DeviceInfo.Authentication.isSecureEnclaveAvailable: object expected");t.isSecureEnclaveAvailable=i.device.BoolMaybe.fromObject(e.isSecureEnclaveAvailable)}if(e.isWebauthnAvailable!=null){if(typeof e.isWebauthnAvailable!="object")throw TypeError(".device.DeviceInfo.Authentication.isWebauthnAvailable: object expected");t.isWebauthnAvailable=i.device.BoolMaybe.fromObject(e.isWebauthnAvailable)}if(e.isPlatformAuthenticatorAvailable!=null){if(typeof e.isPlatformAuthenticatorAvailable!="object")throw TypeError(".device.DeviceInfo.Authentication.isPlatformAuthenticatorAvailable: object expected");t.isPlatformAuthenticatorAvailable=i.device.BoolMaybe.fromObject(e.isPlatformAuthenticatorAvailable)}return t},l.toObject=function(e,t){t||(t={});let n={};return t.defaults&&(n.answer=null,n.loginProviderName=null,n.loginProviderGuid=null,n.isTpmAvailable=null,n.isPasswordSet=null,n.isBiometricsSet=null,n.isWatchAuthenticationEnabled=null,n.isSecureEnclaveAvailable=null,n.isWebauthnAvailable=null,n.isPlatformAuthenticatorAvailable=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.loginProviderName!=null&&e.hasOwnProperty("loginProviderName")&&(n.loginProviderName=i.device.StringMaybe.toObject(e.loginProviderName,t)),e.loginProviderGuid!=null&&e.hasOwnProperty("loginProviderGuid")&&(n.loginProviderGuid=i.device.StringMaybe.toObject(e.loginProviderGuid,t)),e.isTpmAvailable!=null&&e.hasOwnProperty("isTpmAvailable")&&(n.isTpmAvailable=i.device.BoolMaybe.toObject(e.isTpmAvailable,t)),e.isPasswordSet!=null&&e.hasOwnProperty("isPasswordSet")&&(n.isPasswordSet=i.device.BoolMaybe.toObject(e.isPasswordSet,t)),e.isBiometricsSet!=null&&e.hasOwnProperty("isBiometricsSet")&&(n.isBiometricsSet=i.device.BoolMaybe.toObject(e.isBiometricsSet,t)),e.isWatchAuthenticationEnabled!=null&&e.hasOwnProperty("isWatchAuthenticationEnabled")&&(n.isWatchAuthenticationEnabled=i.device.BoolMaybe.toObject(e.isWatchAuthenticationEnabled,t)),e.isSecureEnclaveAvailable!=null&&e.hasOwnProperty("isSecureEnclaveAvailable")&&(n.isSecureEnclaveAvailable=i.device.BoolMaybe.toObject(e.isSecureEnclaveAvailable,t)),e.isWebauthnAvailable!=null&&e.hasOwnProperty("isWebauthnAvailable")&&(n.isWebauthnAvailable=i.device.BoolMaybe.toObject(e.isWebauthnAvailable,t)),e.isPlatformAuthenticatorAvailable!=null&&e.hasOwnProperty("isPlatformAuthenticatorAvailable")&&(n.isPlatformAuthenticatorAvailable=i.device.BoolMaybe.toObject(e.isPlatformAuthenticatorAvailable,t)),n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l}(),c.SecuritySoftware=function(){function l(r){if(this.software=[],r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.software=ke.emptyArray,l.create=function(e){return new l(e)},l.encode=function(e,t){if(t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.software!=null&&e.software.length)for(let n=0;n<e.software.length;++n)i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.encode(e.software[n],t.uint32(18).fork()).ldelim();return t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.SecuritySoftware;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.software&&o.software.length||(o.software=[]),o.software.push(i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.decode(e,e.uint32()));break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.software!=null&&e.hasOwnProperty("software")){if(!Array.isArray(e.software))return"software: array expected";for(let t=0;t<e.software.length;++t){let n=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.verify(e.software[t]);if(n)return"software."+n}}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.SecuritySoftware)return e;let t=new i.device.DeviceInfo.SecuritySoftware;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.SecuritySoftware.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.software){if(!Array.isArray(e.software))throw TypeError(".device.DeviceInfo.SecuritySoftware.software: array expected");t.software=[];for(let n=0;n<e.software.length;++n){if(typeof e.software[n]!="object")throw TypeError(".device.DeviceInfo.SecuritySoftware.software: object expected");t.software[n]=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.fromObject(e.software[n])}}return t},l.toObject=function(e,t){t||(t={});let n={};if((t.arrays||t.defaults)&&(n.software=[]),t.defaults&&(n.answer=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.software&&e.software.length){n.software=[];for(let o=0;o<e.software.length;++o)n.software[o]=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.toObject(e.software[o],t)}return n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l.SoftwareInfo=function(){function r(e){if(e)for(let t=Object.keys(e),n=0;n<t.length;++n)e[t[n]]!=null&&(this[t[n]]=e[t[n]])}return r.prototype.answer=null,r.prototype.category=null,r.prototype.name=null,r.prototype.version=null,r.prototype.enabled=null,r.prototype.status=null,r.create=function(t){return new r(t)},r.encode=function(t,n){return n||(n=we.create()),t.answer!=null&&Object.hasOwnProperty.call(t,"answer")&&i.device.Answer.encode(t.answer,n.uint32(10).fork()).ldelim(),t.category!=null&&Object.hasOwnProperty.call(t,"category")&&i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.CategoryMaybe.encode(t.category,n.uint32(18).fork()).ldelim(),t.name!=null&&Object.hasOwnProperty.call(t,"name")&&i.device.StringMaybe.encode(t.name,n.uint32(26).fork()).ldelim(),t.version!=null&&Object.hasOwnProperty.call(t,"version")&&i.device.StringMaybe.encode(t.version,n.uint32(34).fork()).ldelim(),t.enabled!=null&&Object.hasOwnProperty.call(t,"enabled")&&i.device.BoolMaybe.encode(t.enabled,n.uint32(42).fork()).ldelim(),t.status!=null&&Object.hasOwnProperty.call(t,"status")&&i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.StatusMaybe.encode(t.status,n.uint32(50).fork()).ldelim(),n},r.encodeDelimited=function(t,n){return this.encode(t,n).ldelim()},r.decode=function(t,n){t instanceof U||(t=U.create(t));let o=n===void 0?t.len:t.pos+n,f=new i.device.DeviceInfo.SecuritySoftware.SoftwareInfo;for(;t.pos<o;){let y=t.uint32();switch(y>>>3){case 1:f.answer=i.device.Answer.decode(t,t.uint32());break;case 2:f.category=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.CategoryMaybe.decode(t,t.uint32());break;case 3:f.name=i.device.StringMaybe.decode(t,t.uint32());break;case 4:f.version=i.device.StringMaybe.decode(t,t.uint32());break;case 5:f.enabled=i.device.BoolMaybe.decode(t,t.uint32());break;case 6:f.status=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.StatusMaybe.decode(t,t.uint32());break;default:t.skipType(y&7);break}}return f},r.decodeDelimited=function(t){return t instanceof U||(t=new U(t)),this.decode(t,t.uint32())},r.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.answer!=null&&t.hasOwnProperty("answer")){let n=i.device.Answer.verify(t.answer);if(n)return"answer."+n}if(t.category!=null&&t.hasOwnProperty("category")){let n=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.CategoryMaybe.verify(t.category);if(n)return"category."+n}if(t.name!=null&&t.hasOwnProperty("name")){let n=i.device.StringMaybe.verify(t.name);if(n)return"name."+n}if(t.version!=null&&t.hasOwnProperty("version")){let n=i.device.StringMaybe.verify(t.version);if(n)return"version."+n}if(t.enabled!=null&&t.hasOwnProperty("enabled")){let n=i.device.BoolMaybe.verify(t.enabled);if(n)return"enabled."+n}if(t.status!=null&&t.hasOwnProperty("status")){let n=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.StatusMaybe.verify(t.status);if(n)return"status."+n}return null},r.fromObject=function(t){if(t instanceof i.device.DeviceInfo.SecuritySoftware.SoftwareInfo)return t;let n=new i.device.DeviceInfo.SecuritySoftware.SoftwareInfo;if(t.answer!=null){if(typeof t.answer!="object")throw TypeError(".device.DeviceInfo.SecuritySoftware.SoftwareInfo.answer: object expected");n.answer=i.device.Answer.fromObject(t.answer)}if(t.category!=null){if(typeof t.category!="object")throw TypeError(".device.DeviceInfo.SecuritySoftware.SoftwareInfo.category: object expected");n.category=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.CategoryMaybe.fromObject(t.category)}if(t.name!=null){if(typeof t.name!="object")throw TypeError(".device.DeviceInfo.SecuritySoftware.SoftwareInfo.name: object expected");n.name=i.device.StringMaybe.fromObject(t.name)}if(t.version!=null){if(typeof t.version!="object")throw TypeError(".device.DeviceInfo.SecuritySoftware.SoftwareInfo.version: object expected");n.version=i.device.StringMaybe.fromObject(t.version)}if(t.enabled!=null){if(typeof t.enabled!="object")throw TypeError(".device.DeviceInfo.SecuritySoftware.SoftwareInfo.enabled: object expected");n.enabled=i.device.BoolMaybe.fromObject(t.enabled)}if(t.status!=null){if(typeof t.status!="object")throw TypeError(".device.DeviceInfo.SecuritySoftware.SoftwareInfo.status: object expected");n.status=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.StatusMaybe.fromObject(t.status)}return n},r.toObject=function(t,n){n||(n={});let o={};return n.defaults&&(o.answer=null,o.category=null,o.name=null,o.version=null,o.enabled=null,o.status=null),t.answer!=null&&t.hasOwnProperty("answer")&&(o.answer=i.device.Answer.toObject(t.answer,n)),t.category!=null&&t.hasOwnProperty("category")&&(o.category=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.CategoryMaybe.toObject(t.category,n)),t.name!=null&&t.hasOwnProperty("name")&&(o.name=i.device.StringMaybe.toObject(t.name,n)),t.version!=null&&t.hasOwnProperty("version")&&(o.version=i.device.StringMaybe.toObject(t.version,n)),t.enabled!=null&&t.hasOwnProperty("enabled")&&(o.enabled=i.device.BoolMaybe.toObject(t.enabled,n)),t.status!=null&&t.hasOwnProperty("status")&&(o.status=i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.StatusMaybe.toObject(t.status,n)),o},r.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},r.Category=function(){let e={},t=Object.create(e);return t[e[0]="FIREWALL"]=0,t[e[1]="ANTIMALWARE"]=1,t[e[2]="ANTISPYWARE"]=2,t[e[3]="ANTIVIRUS"]=3,t}(),r.CategoryMaybe=function(){function e(t){if(t)for(let n=Object.keys(t),o=0;o<n.length;++o)t[n[o]]!=null&&(this[n[o]]=t[n[o]])}return e.prototype.answer=null,e.prototype.value=0,e.create=function(n){return new e(n)},e.encode=function(n,o){return o||(o=we.create()),n.answer!=null&&Object.hasOwnProperty.call(n,"answer")&&i.device.Answer.encode(n.answer,o.uint32(10).fork()).ldelim(),n.value!=null&&Object.hasOwnProperty.call(n,"value")&&o.uint32(16).int32(n.value),o},e.encodeDelimited=function(n,o){return this.encode(n,o).ldelim()},e.decode=function(n,o){n instanceof U||(n=U.create(n));let f=o===void 0?n.len:n.pos+o,y=new i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.CategoryMaybe;for(;n.pos<f;){let O=n.uint32();switch(O>>>3){case 1:y.answer=i.device.Answer.decode(n,n.uint32());break;case 2:y.value=n.int32();break;default:n.skipType(O&7);break}}return y},e.decodeDelimited=function(n){return n instanceof U||(n=new U(n)),this.decode(n,n.uint32())},e.verify=function(n){if(typeof n!="object"||n===null)return"object expected";if(n.answer!=null&&n.hasOwnProperty("answer")){let o=i.device.Answer.verify(n.answer);if(o)return"answer."+o}if(n.value!=null&&n.hasOwnProperty("value"))switch(n.value){default:return"value: enum value expected";case 0:case 1:case 2:case 3:break}return null},e.fromObject=function(n){if(n instanceof i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.CategoryMaybe)return n;let o=new i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.CategoryMaybe;if(n.answer!=null){if(typeof n.answer!="object")throw TypeError(".device.DeviceInfo.SecuritySoftware.SoftwareInfo.CategoryMaybe.answer: object expected");o.answer=i.device.Answer.fromObject(n.answer)}switch(n.value){case"FIREWALL":case 0:o.value=0;break;case"ANTIMALWARE":case 1:o.value=1;break;case"ANTISPYWARE":case 2:o.value=2;break;case"ANTIVIRUS":case 3:o.value=3;break}return o},e.toObject=function(n,o){o||(o={});let f={};return o.defaults&&(f.answer=null,f.value=o.enums===String?"FIREWALL":0),n.answer!=null&&n.hasOwnProperty("answer")&&(f.answer=i.device.Answer.toObject(n.answer,o)),n.value!=null&&n.hasOwnProperty("value")&&(f.value=o.enums===String?i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.Category[n.value]:n.value),f},e.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},e}(),r.Status=function(){let e={},t=Object.create(e);return t[e[0]="OFF"]=0,t[e[1]="ON"]=1,t[e[2]="SNOOZED"]=2,t[e[3]="EXPIRED"]=3,t}(),r.StatusMaybe=function(){function e(t){if(t)for(let n=Object.keys(t),o=0;o<n.length;++o)t[n[o]]!=null&&(this[n[o]]=t[n[o]])}return e.prototype.answer=null,e.prototype.value=0,e.create=function(n){return new e(n)},e.encode=function(n,o){return o||(o=we.create()),n.answer!=null&&Object.hasOwnProperty.call(n,"answer")&&i.device.Answer.encode(n.answer,o.uint32(10).fork()).ldelim(),n.value!=null&&Object.hasOwnProperty.call(n,"value")&&o.uint32(16).int32(n.value),o},e.encodeDelimited=function(n,o){return this.encode(n,o).ldelim()},e.decode=function(n,o){n instanceof U||(n=U.create(n));let f=o===void 0?n.len:n.pos+o,y=new i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.StatusMaybe;for(;n.pos<f;){let O=n.uint32();switch(O>>>3){case 1:y.answer=i.device.Answer.decode(n,n.uint32());break;case 2:y.value=n.int32();break;default:n.skipType(O&7);break}}return y},e.decodeDelimited=function(n){return n instanceof U||(n=new U(n)),this.decode(n,n.uint32())},e.verify=function(n){if(typeof n!="object"||n===null)return"object expected";if(n.answer!=null&&n.hasOwnProperty("answer")){let o=i.device.Answer.verify(n.answer);if(o)return"answer."+o}if(n.value!=null&&n.hasOwnProperty("value"))switch(n.value){default:return"value: enum value expected";case 0:case 1:case 2:case 3:break}return null},e.fromObject=function(n){if(n instanceof i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.StatusMaybe)return n;let o=new i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.StatusMaybe;if(n.answer!=null){if(typeof n.answer!="object")throw TypeError(".device.DeviceInfo.SecuritySoftware.SoftwareInfo.StatusMaybe.answer: object expected");o.answer=i.device.Answer.fromObject(n.answer)}switch(n.value){case"OFF":case 0:o.value=0;break;case"ON":case 1:o.value=1;break;case"SNOOZED":case 2:o.value=2;break;case"EXPIRED":case 3:o.value=3;break}return o},e.toObject=function(n,o){o||(o={});let f={};return o.defaults&&(f.answer=null,f.value=o.enums===String?"OFF":0),n.answer!=null&&n.hasOwnProperty("answer")&&(f.answer=i.device.Answer.toObject(n.answer,o)),n.value!=null&&n.hasOwnProperty("value")&&(f.value=o.enums===String?i.device.DeviceInfo.SecuritySoftware.SoftwareInfo.Status[n.value]:n.value),f},e.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},e}(),r}(),l}(),c.Volumes=function(){function l(r){if(this.volumes=[],r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.volumes=ke.emptyArray,l.prototype.filevault=null,l.create=function(e){return new l(e)},l.encode=function(e,t){if(t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.volumes!=null&&e.volumes.length)for(let n=0;n<e.volumes.length;++n)i.device.DeviceInfo.Volumes.VolumeInfo.encode(e.volumes[n],t.uint32(18).fork()).ldelim();return e.filevault!=null&&Object.hasOwnProperty.call(e,"filevault")&&i.device.DeviceInfo.Volumes.FileVaultStatusMaybe.encode(e.filevault,t.uint32(26).fork()).ldelim(),t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.Volumes;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.volumes&&o.volumes.length||(o.volumes=[]),o.volumes.push(i.device.DeviceInfo.Volumes.VolumeInfo.decode(e,e.uint32()));break;case 3:o.filevault=i.device.DeviceInfo.Volumes.FileVaultStatusMaybe.decode(e,e.uint32());break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.volumes!=null&&e.hasOwnProperty("volumes")){if(!Array.isArray(e.volumes))return"volumes: array expected";for(let t=0;t<e.volumes.length;++t){let n=i.device.DeviceInfo.Volumes.VolumeInfo.verify(e.volumes[t]);if(n)return"volumes."+n}}if(e.filevault!=null&&e.hasOwnProperty("filevault")){let t=i.device.DeviceInfo.Volumes.FileVaultStatusMaybe.verify(e.filevault);if(t)return"filevault."+t}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.Volumes)return e;let t=new i.device.DeviceInfo.Volumes;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.Volumes.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.volumes){if(!Array.isArray(e.volumes))throw TypeError(".device.DeviceInfo.Volumes.volumes: array expected");t.volumes=[];for(let n=0;n<e.volumes.length;++n){if(typeof e.volumes[n]!="object")throw TypeError(".device.DeviceInfo.Volumes.volumes: object expected");t.volumes[n]=i.device.DeviceInfo.Volumes.VolumeInfo.fromObject(e.volumes[n])}}if(e.filevault!=null){if(typeof e.filevault!="object")throw TypeError(".device.DeviceInfo.Volumes.filevault: object expected");t.filevault=i.device.DeviceInfo.Volumes.FileVaultStatusMaybe.fromObject(e.filevault)}return t},l.toObject=function(e,t){t||(t={});let n={};if((t.arrays||t.defaults)&&(n.volumes=[]),t.defaults&&(n.answer=null,n.filevault=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.volumes&&e.volumes.length){n.volumes=[];for(let o=0;o<e.volumes.length;++o)n.volumes[o]=i.device.DeviceInfo.Volumes.VolumeInfo.toObject(e.volumes[o],t)}return e.filevault!=null&&e.hasOwnProperty("filevault")&&(n.filevault=i.device.DeviceInfo.Volumes.FileVaultStatusMaybe.toObject(e.filevault,t)),n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l.VolumeInfo=function(){function r(e){if(e)for(let t=Object.keys(e),n=0;n<t.length;++n)e[t[n]]!=null&&(this[t[n]]=e[t[n]])}return r.prototype.answer=null,r.prototype.name=null,r.prototype.isBitlockerEnabled=null,r.prototype.isSystemDrive=null,r.prototype.isEncrypted=null,r.prototype.isRemovable=null,r.create=function(t){return new r(t)},r.encode=function(t,n){return n||(n=we.create()),t.answer!=null&&Object.hasOwnProperty.call(t,"answer")&&i.device.Answer.encode(t.answer,n.uint32(10).fork()).ldelim(),t.name!=null&&Object.hasOwnProperty.call(t,"name")&&i.device.StringMaybe.encode(t.name,n.uint32(18).fork()).ldelim(),t.isBitlockerEnabled!=null&&Object.hasOwnProperty.call(t,"isBitlockerEnabled")&&i.device.BoolMaybe.encode(t.isBitlockerEnabled,n.uint32(26).fork()).ldelim(),t.isSystemDrive!=null&&Object.hasOwnProperty.call(t,"isSystemDrive")&&i.device.BoolMaybe.encode(t.isSystemDrive,n.uint32(34).fork()).ldelim(),t.isEncrypted!=null&&Object.hasOwnProperty.call(t,"isEncrypted")&&i.device.BoolMaybe.encode(t.isEncrypted,n.uint32(42).fork()).ldelim(),t.isRemovable!=null&&Object.hasOwnProperty.call(t,"isRemovable")&&i.device.BoolMaybe.encode(t.isRemovable,n.uint32(50).fork()).ldelim(),n},r.encodeDelimited=function(t,n){return this.encode(t,n).ldelim()},r.decode=function(t,n){t instanceof U||(t=U.create(t));let o=n===void 0?t.len:t.pos+n,f=new i.device.DeviceInfo.Volumes.VolumeInfo;for(;t.pos<o;){let y=t.uint32();switch(y>>>3){case 1:f.answer=i.device.Answer.decode(t,t.uint32());break;case 2:f.name=i.device.StringMaybe.decode(t,t.uint32());break;case 3:f.isBitlockerEnabled=i.device.BoolMaybe.decode(t,t.uint32());break;case 4:f.isSystemDrive=i.device.BoolMaybe.decode(t,t.uint32());break;case 5:f.isEncrypted=i.device.BoolMaybe.decode(t,t.uint32());break;case 6:f.isRemovable=i.device.BoolMaybe.decode(t,t.uint32());break;default:t.skipType(y&7);break}}return f},r.decodeDelimited=function(t){return t instanceof U||(t=new U(t)),this.decode(t,t.uint32())},r.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.answer!=null&&t.hasOwnProperty("answer")){let n=i.device.Answer.verify(t.answer);if(n)return"answer."+n}if(t.name!=null&&t.hasOwnProperty("name")){let n=i.device.StringMaybe.verify(t.name);if(n)return"name."+n}if(t.isBitlockerEnabled!=null&&t.hasOwnProperty("isBitlockerEnabled")){let n=i.device.BoolMaybe.verify(t.isBitlockerEnabled);if(n)return"isBitlockerEnabled."+n}if(t.isSystemDrive!=null&&t.hasOwnProperty("isSystemDrive")){let n=i.device.BoolMaybe.verify(t.isSystemDrive);if(n)return"isSystemDrive."+n}if(t.isEncrypted!=null&&t.hasOwnProperty("isEncrypted")){let n=i.device.BoolMaybe.verify(t.isEncrypted);if(n)return"isEncrypted."+n}if(t.isRemovable!=null&&t.hasOwnProperty("isRemovable")){let n=i.device.BoolMaybe.verify(t.isRemovable);if(n)return"isRemovable."+n}return null},r.fromObject=function(t){if(t instanceof i.device.DeviceInfo.Volumes.VolumeInfo)return t;let n=new i.device.DeviceInfo.Volumes.VolumeInfo;if(t.answer!=null){if(typeof t.answer!="object")throw TypeError(".device.DeviceInfo.Volumes.VolumeInfo.answer: object expected");n.answer=i.device.Answer.fromObject(t.answer)}if(t.name!=null){if(typeof t.name!="object")throw TypeError(".device.DeviceInfo.Volumes.VolumeInfo.name: object expected");n.name=i.device.StringMaybe.fromObject(t.name)}if(t.isBitlockerEnabled!=null){if(typeof t.isBitlockerEnabled!="object")throw TypeError(".device.DeviceInfo.Volumes.VolumeInfo.isBitlockerEnabled: object expected");n.isBitlockerEnabled=i.device.BoolMaybe.fromObject(t.isBitlockerEnabled)}if(t.isSystemDrive!=null){if(typeof t.isSystemDrive!="object")throw TypeError(".device.DeviceInfo.Volumes.VolumeInfo.isSystemDrive: object expected");n.isSystemDrive=i.device.BoolMaybe.fromObject(t.isSystemDrive)}if(t.isEncrypted!=null){if(typeof t.isEncrypted!="object")throw TypeError(".device.DeviceInfo.Volumes.VolumeInfo.isEncrypted: object expected");n.isEncrypted=i.device.BoolMaybe.fromObject(t.isEncrypted)}if(t.isRemovable!=null){if(typeof t.isRemovable!="object")throw TypeError(".device.DeviceInfo.Volumes.VolumeInfo.isRemovable: object expected");n.isRemovable=i.device.BoolMaybe.fromObject(t.isRemovable)}return n},r.toObject=function(t,n){n||(n={});let o={};return n.defaults&&(o.answer=null,o.name=null,o.isBitlockerEnabled=null,o.isSystemDrive=null,o.isEncrypted=null,o.isRemovable=null),t.answer!=null&&t.hasOwnProperty("answer")&&(o.answer=i.device.Answer.toObject(t.answer,n)),t.name!=null&&t.hasOwnProperty("name")&&(o.name=i.device.StringMaybe.toObject(t.name,n)),t.isBitlockerEnabled!=null&&t.hasOwnProperty("isBitlockerEnabled")&&(o.isBitlockerEnabled=i.device.BoolMaybe.toObject(t.isBitlockerEnabled,n)),t.isSystemDrive!=null&&t.hasOwnProperty("isSystemDrive")&&(o.isSystemDrive=i.device.BoolMaybe.toObject(t.isSystemDrive,n)),t.isEncrypted!=null&&t.hasOwnProperty("isEncrypted")&&(o.isEncrypted=i.device.BoolMaybe.toObject(t.isEncrypted,n)),t.isRemovable!=null&&t.hasOwnProperty("isRemovable")&&(o.isRemovable=i.device.BoolMaybe.toObject(t.isRemovable,n)),o},r.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},r}(),l.FileVaultStatus=function(){let r={},e=Object.create(r);return e[r[0]="FILE_VAULT_ON"]=0,e[r[1]="FILE_VAULT_OFF"]=1,e}(),l.FileVaultStatusMaybe=function(){function r(e){if(e)for(let t=Object.keys(e),n=0;n<t.length;++n)e[t[n]]!=null&&(this[t[n]]=e[t[n]])}return r.prototype.answer=null,r.prototype.value=0,r.create=function(t){return new r(t)},r.encode=function(t,n){return n||(n=we.create()),t.answer!=null&&Object.hasOwnProperty.call(t,"answer")&&i.device.Answer.encode(t.answer,n.uint32(10).fork()).ldelim(),t.value!=null&&Object.hasOwnProperty.call(t,"value")&&n.uint32(16).int32(t.value),n},r.encodeDelimited=function(t,n){return this.encode(t,n).ldelim()},r.decode=function(t,n){t instanceof U||(t=U.create(t));let o=n===void 0?t.len:t.pos+n,f=new i.device.DeviceInfo.Volumes.FileVaultStatusMaybe;for(;t.pos<o;){let y=t.uint32();switch(y>>>3){case 1:f.answer=i.device.Answer.decode(t,t.uint32());break;case 2:f.value=t.int32();break;default:t.skipType(y&7);break}}return f},r.decodeDelimited=function(t){return t instanceof U||(t=new U(t)),this.decode(t,t.uint32())},r.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.answer!=null&&t.hasOwnProperty("answer")){let n=i.device.Answer.verify(t.answer);if(n)return"answer."+n}if(t.value!=null&&t.hasOwnProperty("value"))switch(t.value){default:return"value: enum value expected";case 0:case 1:break}return null},r.fromObject=function(t){if(t instanceof i.device.DeviceInfo.Volumes.FileVaultStatusMaybe)return t;let n=new i.device.DeviceInfo.Volumes.FileVaultStatusMaybe;if(t.answer!=null){if(typeof t.answer!="object")throw TypeError(".device.DeviceInfo.Volumes.FileVaultStatusMaybe.answer: object expected");n.answer=i.device.Answer.fromObject(t.answer)}switch(t.value){case"FILE_VAULT_ON":case 0:n.value=0;break;case"FILE_VAULT_OFF":case 1:n.value=1;break}return n},r.toObject=function(t,n){n||(n={});let o={};return n.defaults&&(o.answer=null,o.value=n.enums===String?"FILE_VAULT_ON":0),t.answer!=null&&t.hasOwnProperty("answer")&&(o.answer=i.device.Answer.toObject(t.answer,n)),t.value!=null&&t.hasOwnProperty("value")&&(o.value=n.enums===String?i.device.DeviceInfo.Volumes.FileVaultStatus[t.value]:t.value),o},r.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},r}(),l}(),c.AuthorizationSettings=function(){function l(r){if(r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.isLocalhostServiceEnabled=null,l.prototype.isAccessibilityServiceEnabled=null,l.create=function(e){return new l(e)},l.encode=function(e,t){return t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.isLocalhostServiceEnabled!=null&&Object.hasOwnProperty.call(e,"isLocalhostServiceEnabled")&&i.device.BoolMaybe.encode(e.isLocalhostServiceEnabled,t.uint32(18).fork()).ldelim(),e.isAccessibilityServiceEnabled!=null&&Object.hasOwnProperty.call(e,"isAccessibilityServiceEnabled")&&i.device.BoolMaybe.encode(e.isAccessibilityServiceEnabled,t.uint32(26).fork()).ldelim(),t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.AuthorizationSettings;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.isLocalhostServiceEnabled=i.device.BoolMaybe.decode(e,e.uint32());break;case 3:o.isAccessibilityServiceEnabled=i.device.BoolMaybe.decode(e,e.uint32());break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.isLocalhostServiceEnabled!=null&&e.hasOwnProperty("isLocalhostServiceEnabled")){let t=i.device.BoolMaybe.verify(e.isLocalhostServiceEnabled);if(t)return"isLocalhostServiceEnabled."+t}if(e.isAccessibilityServiceEnabled!=null&&e.hasOwnProperty("isAccessibilityServiceEnabled")){let t=i.device.BoolMaybe.verify(e.isAccessibilityServiceEnabled);if(t)return"isAccessibilityServiceEnabled."+t}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.AuthorizationSettings)return e;let t=new i.device.DeviceInfo.AuthorizationSettings;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.AuthorizationSettings.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.isLocalhostServiceEnabled!=null){if(typeof e.isLocalhostServiceEnabled!="object")throw TypeError(".device.DeviceInfo.AuthorizationSettings.isLocalhostServiceEnabled: object expected");t.isLocalhostServiceEnabled=i.device.BoolMaybe.fromObject(e.isLocalhostServiceEnabled)}if(e.isAccessibilityServiceEnabled!=null){if(typeof e.isAccessibilityServiceEnabled!="object")throw TypeError(".device.DeviceInfo.AuthorizationSettings.isAccessibilityServiceEnabled: object expected");t.isAccessibilityServiceEnabled=i.device.BoolMaybe.fromObject(e.isAccessibilityServiceEnabled)}return t},l.toObject=function(e,t){t||(t={});let n={};return t.defaults&&(n.answer=null,n.isLocalhostServiceEnabled=null,n.isAccessibilityServiceEnabled=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.isLocalhostServiceEnabled!=null&&e.hasOwnProperty("isLocalhostServiceEnabled")&&(n.isLocalhostServiceEnabled=i.device.BoolMaybe.toObject(e.isLocalhostServiceEnabled,t)),e.isAccessibilityServiceEnabled!=null&&e.hasOwnProperty("isAccessibilityServiceEnabled")&&(n.isAccessibilityServiceEnabled=i.device.BoolMaybe.toObject(e.isAccessibilityServiceEnabled,t)),n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l}(),c.TPMInfo=function(){function l(r){if(r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.Version=null,l.prototype.Level=null,l.prototype.Revision=null,l.prototype.VendorID=null,l.prototype.Firmware=null,l.create=function(e){return new l(e)},l.encode=function(e,t){return t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.Version!=null&&Object.hasOwnProperty.call(e,"Version")&&i.device.StringMaybe.encode(e.Version,t.uint32(18).fork()).ldelim(),e.Level!=null&&Object.hasOwnProperty.call(e,"Level")&&i.device.StringMaybe.encode(e.Level,t.uint32(26).fork()).ldelim(),e.Revision!=null&&Object.hasOwnProperty.call(e,"Revision")&&i.device.StringMaybe.encode(e.Revision,t.uint32(34).fork()).ldelim(),e.VendorID!=null&&Object.hasOwnProperty.call(e,"VendorID")&&i.device.StringMaybe.encode(e.VendorID,t.uint32(42).fork()).ldelim(),e.Firmware!=null&&Object.hasOwnProperty.call(e,"Firmware")&&i.device.StringMaybe.encode(e.Firmware,t.uint32(50).fork()).ldelim(),t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.TPMInfo;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.Version=i.device.StringMaybe.decode(e,e.uint32());break;case 3:o.Level=i.device.StringMaybe.decode(e,e.uint32());break;case 4:o.Revision=i.device.StringMaybe.decode(e,e.uint32());break;case 5:o.VendorID=i.device.StringMaybe.decode(e,e.uint32());break;case 6:o.Firmware=i.device.StringMaybe.decode(e,e.uint32());break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.Version!=null&&e.hasOwnProperty("Version")){let t=i.device.StringMaybe.verify(e.Version);if(t)return"Version."+t}if(e.Level!=null&&e.hasOwnProperty("Level")){let t=i.device.StringMaybe.verify(e.Level);if(t)return"Level."+t}if(e.Revision!=null&&e.hasOwnProperty("Revision")){let t=i.device.StringMaybe.verify(e.Revision);if(t)return"Revision."+t}if(e.VendorID!=null&&e.hasOwnProperty("VendorID")){let t=i.device.StringMaybe.verify(e.VendorID);if(t)return"VendorID."+t}if(e.Firmware!=null&&e.hasOwnProperty("Firmware")){let t=i.device.StringMaybe.verify(e.Firmware);if(t)return"Firmware."+t}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.TPMInfo)return e;let t=new i.device.DeviceInfo.TPMInfo;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.TPMInfo.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.Version!=null){if(typeof e.Version!="object")throw TypeError(".device.DeviceInfo.TPMInfo.Version: object expected");t.Version=i.device.StringMaybe.fromObject(e.Version)}if(e.Level!=null){if(typeof e.Level!="object")throw TypeError(".device.DeviceInfo.TPMInfo.Level: object expected");t.Level=i.device.StringMaybe.fromObject(e.Level)}if(e.Revision!=null){if(typeof e.Revision!="object")throw TypeError(".device.DeviceInfo.TPMInfo.Revision: object expected");t.Revision=i.device.StringMaybe.fromObject(e.Revision)}if(e.VendorID!=null){if(typeof e.VendorID!="object")throw TypeError(".device.DeviceInfo.TPMInfo.VendorID: object expected");t.VendorID=i.device.StringMaybe.fromObject(e.VendorID)}if(e.Firmware!=null){if(typeof e.Firmware!="object")throw TypeError(".device.DeviceInfo.TPMInfo.Firmware: object expected");t.Firmware=i.device.StringMaybe.fromObject(e.Firmware)}return t},l.toObject=function(e,t){t||(t={});let n={};return t.defaults&&(n.answer=null,n.Version=null,n.Level=null,n.Revision=null,n.VendorID=null,n.Firmware=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.Version!=null&&e.hasOwnProperty("Version")&&(n.Version=i.device.StringMaybe.toObject(e.Version,t)),e.Level!=null&&e.hasOwnProperty("Level")&&(n.Level=i.device.StringMaybe.toObject(e.Level,t)),e.Revision!=null&&e.hasOwnProperty("Revision")&&(n.Revision=i.device.StringMaybe.toObject(e.Revision,t)),e.VendorID!=null&&e.hasOwnProperty("VendorID")&&(n.VendorID=i.device.StringMaybe.toObject(e.VendorID,t)),e.Firmware!=null&&e.hasOwnProperty("Firmware")&&(n.Firmware=i.device.StringMaybe.toObject(e.Firmware,t)),n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l}(),c.KeyProvenances=function(){function l(r){if(this.info=[],r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.info=ke.emptyArray,l.create=function(e){return new l(e)},l.encode=function(e,t){if(t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.info!=null&&e.info.length)for(let n=0;n<e.info.length;++n)i.device.DeviceInfo.KeyProvenances.Info.encode(e.info[n],t.uint32(18).fork()).ldelim();return t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.KeyProvenances;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.info&&o.info.length||(o.info=[]),o.info.push(i.device.DeviceInfo.KeyProvenances.Info.decode(e,e.uint32()));break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.info!=null&&e.hasOwnProperty("info")){if(!Array.isArray(e.info))return"info: array expected";for(let t=0;t<e.info.length;++t){let n=i.device.DeviceInfo.KeyProvenances.Info.verify(e.info[t]);if(n)return"info."+n}}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.KeyProvenances)return e;let t=new i.device.DeviceInfo.KeyProvenances;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.KeyProvenances.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.info){if(!Array.isArray(e.info))throw TypeError(".device.DeviceInfo.KeyProvenances.info: array expected");t.info=[];for(let n=0;n<e.info.length;++n){if(typeof e.info[n]!="object")throw TypeError(".device.DeviceInfo.KeyProvenances.info: object expected");t.info[n]=i.device.DeviceInfo.KeyProvenances.Info.fromObject(e.info[n])}}return t},l.toObject=function(e,t){t||(t={});let n={};if((t.arrays||t.defaults)&&(n.info=[]),t.defaults&&(n.answer=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.info&&e.info.length){n.info=[];for(let o=0;o<e.info.length;++o)n.info[o]=i.device.DeviceInfo.KeyProvenances.Info.toObject(e.info[o],t)}return n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l.KeyProvenance=function(){let r={},e=Object.create(r);return e[r[0]="UNKNOWN"]=0,e[r[1]="TEE"]=1,e[r[2]="FILE"]=2,e}(),l.KeyProvenanceMaybe=function(){function r(e){if(e)for(let t=Object.keys(e),n=0;n<t.length;++n)e[t[n]]!=null&&(this[t[n]]=e[t[n]])}return r.prototype.answer=null,r.prototype.value=0,r.create=function(t){return new r(t)},r.encode=function(t,n){return n||(n=we.create()),t.answer!=null&&Object.hasOwnProperty.call(t,"answer")&&i.device.Answer.encode(t.answer,n.uint32(10).fork()).ldelim(),t.value!=null&&Object.hasOwnProperty.call(t,"value")&&n.uint32(16).int32(t.value),n},r.encodeDelimited=function(t,n){return this.encode(t,n).ldelim()},r.decode=function(t,n){t instanceof U||(t=U.create(t));let o=n===void 0?t.len:t.pos+n,f=new i.device.DeviceInfo.KeyProvenances.KeyProvenanceMaybe;for(;t.pos<o;){let y=t.uint32();switch(y>>>3){case 1:f.answer=i.device.Answer.decode(t,t.uint32());break;case 2:f.value=t.int32();break;default:t.skipType(y&7);break}}return f},r.decodeDelimited=function(t){return t instanceof U||(t=new U(t)),this.decode(t,t.uint32())},r.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.answer!=null&&t.hasOwnProperty("answer")){let n=i.device.Answer.verify(t.answer);if(n)return"answer."+n}if(t.value!=null&&t.hasOwnProperty("value"))switch(t.value){default:return"value: enum value expected";case 0:case 1:case 2:break}return null},r.fromObject=function(t){if(t instanceof i.device.DeviceInfo.KeyProvenances.KeyProvenanceMaybe)return t;let n=new i.device.DeviceInfo.KeyProvenances.KeyProvenanceMaybe;if(t.answer!=null){if(typeof t.answer!="object")throw TypeError(".device.DeviceInfo.KeyProvenances.KeyProvenanceMaybe.answer: object expected");n.answer=i.device.Answer.fromObject(t.answer)}switch(t.value){case"UNKNOWN":case 0:n.value=0;break;case"TEE":case 1:n.value=1;break;case"FILE":case 2:n.value=2;break}return n},r.toObject=function(t,n){n||(n={});let o={};return n.defaults&&(o.answer=null,o.value=n.enums===String?"UNKNOWN":0),t.answer!=null&&t.hasOwnProperty("answer")&&(o.answer=i.device.Answer.toObject(t.answer,n)),t.value!=null&&t.hasOwnProperty("value")&&(o.value=n.enums===String?i.device.DeviceInfo.KeyProvenances.KeyProvenance[t.value]:t.value),o},r.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},r}(),l.Info=function(){function r(e){if(e)for(let t=Object.keys(e),n=0;n<t.length;++n)e[t[n]]!=null&&(this[t[n]]=e[t[n]])}return r.prototype.profileHandle=null,r.prototype.keyHandle=null,r.prototype.keyProvenance=null,r.create=function(t){return new r(t)},r.encode=function(t,n){return n||(n=we.create()),t.profileHandle!=null&&Object.hasOwnProperty.call(t,"profileHandle")&&i.device.StringMaybe.encode(t.profileHandle,n.uint32(10).fork()).ldelim(),t.keyHandle!=null&&Object.hasOwnProperty.call(t,"keyHandle")&&i.device.StringMaybe.encode(t.keyHandle,n.uint32(18).fork()).ldelim(),t.keyProvenance!=null&&Object.hasOwnProperty.call(t,"keyProvenance")&&i.device.DeviceInfo.KeyProvenances.KeyProvenanceMaybe.encode(t.keyProvenance,n.uint32(26).fork()).ldelim(),n},r.encodeDelimited=function(t,n){return this.encode(t,n).ldelim()},r.decode=function(t,n){t instanceof U||(t=U.create(t));let o=n===void 0?t.len:t.pos+n,f=new i.device.DeviceInfo.KeyProvenances.Info;for(;t.pos<o;){let y=t.uint32();switch(y>>>3){case 1:f.profileHandle=i.device.StringMaybe.decode(t,t.uint32());break;case 2:f.keyHandle=i.device.StringMaybe.decode(t,t.uint32());break;case 3:f.keyProvenance=i.device.DeviceInfo.KeyProvenances.KeyProvenanceMaybe.decode(t,t.uint32());break;default:t.skipType(y&7);break}}return f},r.decodeDelimited=function(t){return t instanceof U||(t=new U(t)),this.decode(t,t.uint32())},r.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.profileHandle!=null&&t.hasOwnProperty("profileHandle")){let n=i.device.StringMaybe.verify(t.profileHandle);if(n)return"profileHandle."+n}if(t.keyHandle!=null&&t.hasOwnProperty("keyHandle")){let n=i.device.StringMaybe.verify(t.keyHandle);if(n)return"keyHandle."+n}if(t.keyProvenance!=null&&t.hasOwnProperty("keyProvenance")){let n=i.device.DeviceInfo.KeyProvenances.KeyProvenanceMaybe.verify(t.keyProvenance);if(n)return"keyProvenance."+n}return null},r.fromObject=function(t){if(t instanceof i.device.DeviceInfo.KeyProvenances.Info)return t;let n=new i.device.DeviceInfo.KeyProvenances.Info;if(t.profileHandle!=null){if(typeof t.profileHandle!="object")throw TypeError(".device.DeviceInfo.KeyProvenances.Info.profileHandle: object expected");n.profileHandle=i.device.StringMaybe.fromObject(t.profileHandle)}if(t.keyHandle!=null){if(typeof t.keyHandle!="object")throw TypeError(".device.DeviceInfo.KeyProvenances.Info.keyHandle: object expected");n.keyHandle=i.device.StringMaybe.fromObject(t.keyHandle)}if(t.keyProvenance!=null){if(typeof t.keyProvenance!="object")throw TypeError(".device.DeviceInfo.KeyProvenances.Info.keyProvenance: object expected");n.keyProvenance=i.device.DeviceInfo.KeyProvenances.KeyProvenanceMaybe.fromObject(t.keyProvenance)}return n},r.toObject=function(t,n){n||(n={});let o={};return n.defaults&&(o.profileHandle=null,o.keyHandle=null,o.keyProvenance=null),t.profileHandle!=null&&t.hasOwnProperty("profileHandle")&&(o.profileHandle=i.device.StringMaybe.toObject(t.profileHandle,n)),t.keyHandle!=null&&t.hasOwnProperty("keyHandle")&&(o.keyHandle=i.device.StringMaybe.toObject(t.keyHandle,n)),t.keyProvenance!=null&&t.hasOwnProperty("keyProvenance")&&(o.keyProvenance=i.device.DeviceInfo.KeyProvenances.KeyProvenanceMaybe.toObject(t.keyProvenance,n)),o},r.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},r}(),l}(),c.Locale=function(){function l(r){if(r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return l.prototype.answer=null,l.prototype.current=null,l.create=function(e){return new l(e)},l.encode=function(e,t){return t||(t=we.create()),e.answer!=null&&Object.hasOwnProperty.call(e,"answer")&&i.device.Answer.encode(e.answer,t.uint32(10).fork()).ldelim(),e.current!=null&&Object.hasOwnProperty.call(e,"current")&&i.device.StringMaybe.encode(e.current,t.uint32(18).fork()).ldelim(),t},l.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},l.decode=function(e,t){e instanceof U||(e=U.create(e));let n=t===void 0?e.len:e.pos+t,o=new i.device.DeviceInfo.Locale;for(;e.pos<n;){let f=e.uint32();switch(f>>>3){case 1:o.answer=i.device.Answer.decode(e,e.uint32());break;case 2:o.current=i.device.StringMaybe.decode(e,e.uint32());break;default:e.skipType(f&7);break}}return o},l.decodeDelimited=function(e){return e instanceof U||(e=new U(e)),this.decode(e,e.uint32())},l.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.answer!=null&&e.hasOwnProperty("answer")){let t=i.device.Answer.verify(e.answer);if(t)return"answer."+t}if(e.current!=null&&e.hasOwnProperty("current")){let t=i.device.StringMaybe.verify(e.current);if(t)return"current."+t}return null},l.fromObject=function(e){if(e instanceof i.device.DeviceInfo.Locale)return e;let t=new i.device.DeviceInfo.Locale;if(e.answer!=null){if(typeof e.answer!="object")throw TypeError(".device.DeviceInfo.Locale.answer: object expected");t.answer=i.device.Answer.fromObject(e.answer)}if(e.current!=null){if(typeof e.current!="object")throw TypeError(".device.DeviceInfo.Locale.current: object expected");t.current=i.device.StringMaybe.fromObject(e.current)}return t},l.toObject=function(e,t){t||(t={});let n={};return t.defaults&&(n.answer=null,n.current=null),e.answer!=null&&e.hasOwnProperty("answer")&&(n.answer=i.device.Answer.toObject(e.answer,t)),e.current!=null&&e.hasOwnProperty("current")&&(n.current=i.device.StringMaybe.toObject(e.current,t)),n},l.prototype.toJSON=function(){return this.constructor.toObject(this,ae.util.toJSONOptions)},l}(),c}(),d})();var yr=St(pr()),ct=class{constructor(c,l,r){this.ua=c,this.ch=l,this.appSettings=r}static async collect(c){let l=new yr.UAParser().getResult(),r={};if(navigator.userAgentData){let t={brands:navigator.userAgentData.brands,mobile:navigator.userAgentData.mobile,platform:navigator.userAgentData.platform},n=await navigator.userAgentData.getHighEntropyValues(["architecture","bitness","model","platformVersion","uaFullVersion"]);r={...t,...n}}let e={};return c&&(e=await yn(c)),new ct(l,r,e)}getUserAgent(){return{browser:{name:this.ua.browser.name,version:this.ua.browser.version,engineName:this.ua.engine.name,engineVersion:this.ua.engine.version},platform:{name:this.ua.os.name,version:this.ua.os.version},device:{architecture:this.ua.cpu.architecture,model:this.ua.device.model,type:this.ua.device.type,vendor:this.ua.device.vendor},clientData:{...this.ch}}}getClientHints(){return this.ch}async getAppInstanceId(){return this.appSettings?{answer:{type:ye.AnswerType.VALUE},value:this.appSettings.instanceId}:void 0}getOsVersion(){let c=this.getUserAgent(),l={};if(c.clientData){l.answer={type:ye.AnswerType.VALUE};for(let r in c.clientData)r!=="brands"&&(l[r]={value:c.clientData[r]})}else l.answer={type:ye.AnswerType.UNSUPPORTED};return{answer:{type:ye.AnswerType.VALUE},userAgent:{type:ye.AnswerType.VALUE,value:navigator.userAgent},userAgentData:{answer:{type:ye.AnswerType.VALUE},browser:{answer:{type:ye.AnswerType.VALUE},name:{answer:{type:ye.AnswerType.VALUE},value:this.ua.browser.name},version:{answer:{type:ye.AnswerType.VALUE},value:this.ua.browser.version},engineName:{answer:{type:ye.AnswerType.VALUE},value:this.ua.engine.name},engineVersion:{answer:{type:ye.AnswerType.VALUE},value:this.ua.engine.version}},platform:{answer:{type:ye.AnswerType.VALUE},name:{answer:{type:ye.AnswerType.VALUE},value:this.ua.os.name},version:{answer:{type:ye.AnswerType.VALUE},value:this.ua.os.version}},hostPlatform:{answer:{type:ye.AnswerType.VALUE},name:{answer:{type:ye.AnswerType.VALUE},value:this.ua.os.name},version:{answer:{type:ye.AnswerType.VALUE},value:this.ua.os.version}},device:{answer:{type:ye.AnswerType.VALUE},architecture:{answer:{type:ye.AnswerType.VALUE},value:this.ua.cpu.architecture},model:{answer:{type:ye.AnswerType.VALUE},value:this.ua.device.model},type:{answer:{type:ye.AnswerType.VALUE},value:this.ua.device.type},vendor:{answer:{type:ye.AnswerType.VALUE},value:this.ua.device.vendor}},clientData:l}}}async getAuthentication(){let c=!!window.PublicKeyCredential,l=c&&await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();return{answer:{type:ye.AnswerType.VALUE},isWebauthnAvailable:{answer:{type:ye.AnswerType.VALUE},value:c},isPlatformAuthenticatorAvailable:{answer:{type:ye.AnswerType.VALUE},value:l}}}};async function Ao(){return(await ct.collect()).getUserAgent()}async function Eo(d){let c=new ye.DeviceInfo,l=await ct.collect(d);c.answer={type:ye.AnswerType.VALUE},c.platform=ye.Platform.WEB,c.osVersion=l.getOsVersion(),c.core=ye.Core.RUST;let r="1.0.0",e="1.0.0";return c.appVersion={answer:{type:ye.AnswerType.VALUE},value:r},c.appInstanceId=await l.getAppInstanceId(),c.authentication=await l.getAuthentication(),Zr(c)}function Zr(d){return ye.DeviceInfo.encode(d).finish()}function _o(d){return ye.DeviceInfo.decode(d)}
/*! For license information please see cbor.js.LICENSE.txt */


/***/ }),

/***/ "./node_modules/murmurhash/murmurhash.js":
/*!***********************************************!*\
  !*** ./node_modules/murmurhash/murmurhash.js ***!
  \***********************************************/
/***/ ((module) => {

(function(){
  var _global = this;

  /**
   * JS Implementation of MurmurHash2
   *
   * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
   * @see http://github.com/garycourt/murmurhash-js
   * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
   * @see http://sites.google.com/site/murmurhash/
   *
   * @param {string} str ASCII only
   * @param {number} seed Positive integer only
   * @return {number} 32-bit positive integer hash
   */
  function MurmurHashV2(str, seed) {
    var
      l = str.length,
      h = seed ^ l,
      i = 0,
      k;

    while (l >= 4) {
      k =
        ((str.charCodeAt(i) & 0xff)) |
        ((str.charCodeAt(++i) & 0xff) << 8) |
        ((str.charCodeAt(++i) & 0xff) << 16) |
        ((str.charCodeAt(++i) & 0xff) << 24);

      k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
      k ^= k >>> 24;
      k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

      l -= 4;
      ++i;
    }

    switch (l) {
    case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
    case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
    case 1: h ^= (str.charCodeAt(i) & 0xff);
            h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    }

    h ^= h >>> 13;
    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    h ^= h >>> 15;

    return h >>> 0;
  };

  /**
   * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
   *
   * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
   * @see http://github.com/garycourt/murmurhash-js
   * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
   * @see http://sites.google.com/site/murmurhash/
   *
   * @param {string} key ASCII only
   * @param {number} seed Positive integer only
   * @return {number} 32-bit positive integer hash
   */
  function MurmurHashV3(key, seed) {
    var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 =
          ((key.charCodeAt(i) & 0xff)) |
          ((key.charCodeAt(++i) & 0xff) << 8) |
          ((key.charCodeAt(++i) & 0xff) << 16) |
          ((key.charCodeAt(++i) & 0xff) << 24);
      ++i;

      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

      h1 ^= k1;
          h1 = (h1 << 13) | (h1 >>> 19);
      h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
      h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
      case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      case 1: k1 ^= (key.charCodeAt(i) & 0xff);

      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
  }

  var murmur = MurmurHashV3;
  murmur.v2 = MurmurHashV2;
  murmur.v3 = MurmurHashV3;

  if (true) {
    module.exports = murmur;
  } else { var _previousRoot; }
}());


/***/ }),

/***/ "./src/configuration.ts":
/*!******************************!*\
  !*** ./src/configuration.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Configuration": () => (/* binding */ Configuration)
/* harmony export */ });
/**
 * TODO: Doc
 */
class Configuration {
}


/***/ }),

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CoreBuilder": () => (/* binding */ CoreBuilder),
/* harmony export */   "Core": () => (/* binding */ Core)
/* harmony export */ });
/* harmony import */ var _configuration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./configuration */ "./src/configuration.ts");
/* harmony import */ var _coreDispatch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./coreDispatch */ "./src/coreDispatch.ts");
/* harmony import */ var kmc_ffi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! kmc-ffi */ "./node_modules/kmc-ffi/kmc.js");
/* harmony import */ var _util_optimizely__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/optimizely */ "./src/util/optimizely.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;




/**
 * CoreBuilder is a wrapper around `CoreConfig` with a "fluent" interface.
 */
class CoreBuilder {
    constructor() {
        this.config = new _configuration__WEBPACK_IMPORTED_MODULE_0__.Configuration();
    }
    mock(data) {
        this.config.mock = data;
        return this;
    }
    log(log) {
        this.config.log = log;
        return this;
    }
    allowedDomains(allowedDomains) {
        this.config.allowedDomains = allowedDomains;
        return this;
    }
    /**
     * Construct the `Core`.
     * @returns `Core`
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.mock) {
                yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_3__["default"])();
            }
            let core = new Core((0,_coreDispatch__WEBPACK_IMPORTED_MODULE_1__.createDispatch)(this.config));
            yield core.init(this.config);
            return core;
        });
    }
}
/**
 * The only thing you need!
 * Wraps the core dispatch so it can be configured with a Mock interface.
 */
class Core {
    constructor(dispatch) {
        /**
         * Perform one-time initialization; specifically,
         * this is done to initially populate appSettings objectStore
         * with an appInstanceId, which is required for the import flow.
         */
        this.init = (config) => __awaiter(this, void 0, void 0, function* () {
            this.dispatch.migrateDatabase(config.allowedDomains);
            // Get the appInstanceID to pass into the
            // queryFeatureFlag closure
            let instanceId = yield this.dispatch.getAppInstanceId();
            try {
                this.optimizely = yield _util_optimizely__WEBPACK_IMPORTED_MODULE_2__.Optimizely.init();
                this.dispatch.host.queryFeatureFlag = (flag) => {
                    return this.optimizely
                        ? this.optimizely.queryFeatureFlag(flag, instanceId || "")
                        : false;
                };
            }
            catch (err) {
                console.error("Optimizely initialization failure: ", err);
            }
        });
        this.bindCredentialUrl = (url) => __awaiter(this, void 0, void 0, function* () { return yield this.dispatch.bindCredentialUrl(url); });
        this.getUrlType = (url) => this.dispatch.getUrlType(url);
        this.cancel = () => __awaiter(this, void 0, void 0, function* () { return this.dispatch.cancel(); });
        this.createPKCE = () => __awaiter(this, void 0, void 0, function* () { return this.dispatch.createPkce(); });
        this.createCredential = (handle, name, imageUrl, loginUri, enrollUri) => __awaiter(this, void 0, void 0, function* () { return this.dispatch.createCredential(handle, name, imageUrl, loginUri, enrollUri); });
        this.deleteCredential = (handle) => __awaiter(this, void 0, void 0, function* () { return this.dispatch.deleteCredential(handle); });
        this.deleteCredentialV1 = (id) => __awaiter(this, void 0, void 0, function* () { return this.dispatch.deleteCredentialV1(id); });
        this.authenticateConfidential = (authURL, clientId, redirectURI, scope, PKCECodeChallenge, nonce) => __awaiter(this, void 0, void 0, function* () {
            return this.dispatch.authenticateConfidential(authURL, clientId, redirectURI, scope, PKCECodeChallenge, nonce);
        });
        /**
         * Authenticates a credential.
         */
        this.authenticate = (url, trusted, onSelectCredential) => __awaiter(this, void 0, void 0, function* () {
            this.dispatch.host.events.onSelectCredentialV1 = onSelectCredential
                ? (credentials) => __awaiter(this, void 0, void 0, function* () { return onSelectCredential === null || onSelectCredential === void 0 ? void 0 : onSelectCredential(credentials); })
                : undefined; // use default credential selection handling defined by the host
            try {
                return yield this.dispatch.authenticate(url, trusted, onSelectCredential);
            }
            finally {
                // reset select credential callback
                this.dispatch.host.events.onSelectCredentialV1 = undefined;
            }
        });
        this.authenticatePublic = (authURL, tokenURL, clientId, redirectURI, nonce) => __awaiter(this, void 0, void 0, function* () {
            return this.dispatch.authenticatePublic(authURL, tokenURL, clientId, redirectURI, nonce);
        });
        /**
         * Begins an export of the specified credential.
         * @param handle
         * @param url
         * @returns A promise that resolves to a rendezvous token
         * that is the result of an export "started" event.
         * This does not indicate that the operation has completed.
         * The caller must then periodically poll the `core's`
         * `exportStatus` member to check for an updated token in
         * the event of a timeout.
         *
         * If the operation fails for any reason, then the promise
         * will be rejected.
         */
        this.export = (handle, onExport) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.dispatch.host.events.onexport = (ev) => {
                    // We don't expect failed or cancelled events from the Host.
                    if (ev.type == "started") {
                        // Return the rendezvous token.
                        resolve(ev.data);
                    }
                    onExport(ev);
                };
                // Kick off the operation.
                // This promise resolves when the "started" event is
                // received. Any failures from export (including cancellation)
                // will reject the promise. The return value of export upon
                // success is ignored.
                try {
                    yield this.dispatch.export(handle);
                }
                catch (err) {
                    reject(err);
                }
                finally {
                    this.dispatch.host.events.onexport = undefined;
                }
            }));
        });
        this.getCredentials = () => __awaiter(this, void 0, void 0, function* () { return this.dispatch.getCredentials(); });
        this.listCredentials = () => __awaiter(this, void 0, void 0, function* () { return this.dispatch.listCredentials(); });
        this.handleURL = (url, trusted) => __awaiter(this, void 0, void 0, function* () { return this.dispatch.handleURL(url, trusted); });
        /**
         * TODO: whn should this promise be resolved?
         * @param token
         * @param address
         * @returns
         */
        this.import = (token, onImport) => __awaiter(this, void 0, void 0, function* () {
            this.dispatch.host.events.onimport = onImport;
            try {
                return yield this.dispatch.import(token);
            }
            finally {
                this.dispatch.host.events.onimport = undefined;
            }
        });
        this.register = (url, trusted) => __awaiter(this, void 0, void 0, function* () { return this.dispatch.register(url, trusted); });
        this.getAppInstanceId = () => __awaiter(this, void 0, void 0, function* () {
            let halVersion;
            if (this.dispatch.host.queryFeatureFlag("crypto_provider_hal")) {
                halVersion = "H";
            }
            else {
                halVersion = "L";
            }
            return (yield this.dispatch.getAppInstanceId()) + `[${halVersion}]`;
        });
        this.getBrowserInfo = () => __awaiter(this, void 0, void 0, function* () { return yield this.dispatch.getBrowserInfo(); });
        this.dispatch = dispatch;
    }
    get events() {
        return this.dispatch.host.events;
    }
}
_a = Core;
/**
 * TESTING ONLY!
 * Deletes the keymaker database.
 */
Core.reset = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let rq = window.indexedDB.deleteDatabase("keymaker");
        rq.onerror = (e) => {
            reject("unexpected error");
        };
        rq.onsuccess = (e) => {
            resolve();
        };
    });
});


/***/ }),

/***/ "./src/coreDispatch.ts":
/*!*****************************!*\
  !*** ./src/coreDispatch.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createDispatch": () => (/* binding */ createDispatch)
/* harmony export */ });
/* harmony import */ var _messaging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./messaging */ "./src/messaging/index.ts");
/* harmony import */ var _host__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./host */ "./src/host/index.ts");
/* harmony import */ var kmc_ffi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! kmc-ffi */ "./node_modules/kmc-ffi/kmc.js");
/* harmony import */ var _host_webHost__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./host/webHost */ "./src/host/webHost.ts");
/* harmony import */ var _mock_mockDispatch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mock/mockDispatch */ "./src/mock/mockDispatch.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class KmcDispatch {
    constructor(config) {
        this.bindCredentialUrl = (url) => __awaiter(this, void 0, void 0, function* () {
            const rawUrlType = (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_url_type)(url);
            if (_messaging__WEBPACK_IMPORTED_MODULE_0__.Types.toUrlType(rawUrlType).type !== "Bind") {
                return Promise.reject(new Error("Invalid Url Type. Expected a Bind Credential Url."));
            }
            // TODO: modify the trusted source
            const rsp = yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_handle_url)(url, undefined, "EmbeddedSource", (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            });
            const urlResponse = _messaging__WEBPACK_IMPORTED_MODULE_0__.Types.toUrlResponse(rsp);
            switch (urlResponse.type) {
                case "bindCredential": {
                    return urlResponse.bindCredential;
                }
                default: {
                    return Promise.reject(new Error("Invalid response type"));
                }
            }
        });
        this.getUrlType = (url) => {
            const rawUrlType = (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_url_type)(url);
            return _messaging__WEBPACK_IMPORTED_MODULE_0__.Types.toUrlType(rawUrlType);
        };
        this.migrateDatabase = (allowedDomains) => {
            (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_migrate_database)(allowedDomains);
        };
        this.auth = (url, trusted) => __awaiter(this, void 0, void 0, function* () { return Promise.reject("Not implemented"); });
        this.cancel = () => __awaiter(this, void 0, void 0, function* () { return yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_cancel)(); });
        this.createPkce = () => __awaiter(this, void 0, void 0, function* () {
            let pkce = yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_create_pkce)();
            return {
                codeVerifier: pkce.code_verifier,
                codeChallenge: {
                    challenge: pkce.code_challenge.challenge,
                    method: pkce.code_challenge.method,
                },
            };
        });
        this.createCredential = (handle, name, imageUrl, loginUri, enrollUri) => __awaiter(this, void 0, void 0, function* () {
            let profile = yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_create_profile)(handle, name, imageUrl, enrollUri, loginUri, undefined, undefined, undefined, (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            });
            let credential = _messaging__WEBPACK_IMPORTED_MODULE_0__.Types.credentialFromProfile(profile);
            yield this.updateCredentialInfo(credential);
            return credential;
        });
        this.deleteCredential = (handle) => __awaiter(this, void 0, void 0, function* () {
            return yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_delete_profile)(handle, (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            });
        });
        this.deleteCredentialV1 = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_delete_credential)(id, (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            });
        });
        this.authenticate = (url, trusted) => __awaiter(this, void 0, void 0, function* () {
            const rsp = yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_handle_url)(url, undefined, trusted, (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            });
            let urlResponse = _messaging__WEBPACK_IMPORTED_MODULE_0__.Types.toUrlResponse(rsp);
            switch (urlResponse.type) {
                case "biAuthenticate": {
                    return urlResponse.biAuthenticate;
                }
                default: {
                    return Promise.reject(new Error("Invalid response type"));
                }
            }
        });
        this.authenticateConfidential = (authURL, clientId, redirectURI, scope, challenge, nonce) => __awaiter(this, void 0, void 0, function* () {
            let code = (yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_embedded_confidential_oidc)(authURL, clientId, redirectURI, scope, challenge, nonce, (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            }));
            return code;
        });
        this.authenticatePublic = (authURL, tokenURL, clientId, redirectURI, nonce) => __awaiter(this, void 0, void 0, function* () {
            let token = (yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_embedded_public_oidc)(authURL, tokenURL, clientId, redirectURI, nonce, (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            }));
            return {
                accessToken: token.access_token,
                idToken: token.id_token,
                tokenType: token.token_type,
                expiresIn: token.expires_in,
            };
        });
        this.export = (handle) => __awaiter(this, void 0, void 0, function* () {
            return yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_export)(handle, (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            });
        });
        this.getCredentials = () => __awaiter(this, void 0, void 0, function* () {
            // Retrieve the credentials from the database.
            let creds = (yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_all_credentials)((msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            }));
            // Convert the raw credentials into a more friendly type.
            let credentials = creds.map((cred) => _messaging__WEBPACK_IMPORTED_MODULE_0__.Types.credentialFromCore(cred));
            // Supply the key type for each credential.
            for (let cred of credentials) {
                yield this.updateCredentialInfo(cred);
            }
            return credentials;
        });
        this.listCredentials = () => __awaiter(this, void 0, void 0, function* () {
            let creds = (yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_list_credentials)((msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            }));
            let credentials = creds.map((cred) => _messaging__WEBPACK_IMPORTED_MODULE_0__.Types.credentialV1FromCredential(cred));
            for (let credential of credentials) {
                credential.keyType = yield this.getKeyType(credential.keyHandle);
            }
            return credentials;
        });
        this.getKeyType = (keyHandle) => __awaiter(this, void 0, void 0, function* () {
            let rsp = yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_get_key_type)(keyHandle);
            return rsp;
        });
        this.handleURL = (url, trusted) => __awaiter(this, void 0, void 0, function* () {
            // FIXME: get allowed domains from somewhere
            let rsp = yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_handle_url)(url, undefined, trusted, (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            });
            return _messaging__WEBPACK_IMPORTED_MODULE_0__.Types.toUrlResponse(rsp);
        });
        this.import = (token) => __awaiter(this, void 0, void 0, function* () {
            let profile = yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_import)(token, (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            });
            if (profile === undefined)
                return undefined;
            let credential = _messaging__WEBPACK_IMPORTED_MODULE_0__.Types.credentialFromProfile(profile);
            yield this.updateCredentialInfo(credential);
            return credential;
        });
        this.register = (url, trusted) => __awaiter(this, void 0, void 0, function* () {
            /// FIXME Allowed domains?
            let rsp = yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_handle_url)(url, undefined, trusted, (msg) => {
                return (0,_host__WEBPACK_IMPORTED_MODULE_1__.hostCall)(this.host, msg);
            });
            return _messaging__WEBPACK_IMPORTED_MODULE_0__.Types.toUrlResponse(rsp);
        });
        this.getAppInstanceId = () => __awaiter(this, void 0, void 0, function* () { return yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_get_app_instance_id)(); });
        this.getBrowserInfo = () => __awaiter(this, void 0, void 0, function* () { return yield (0,kmc_ffi__WEBPACK_IMPORTED_MODULE_4__.kmc_get_user_agent)(); });
        this.updateCredentialInfo = (cred) => __awaiter(this, void 0, void 0, function* () {
            try {
                cred.keyType = yield this.getKeyType(cred.keyHandle);
            }
            catch (err) {
                // Update the integrity failure map as needed.
                if (cred.integrityFailures === undefined) {
                    cred.integrityFailures = {};
                }
                cred.integrityFailures["keyType"] = {
                    KeyType: err instanceof Error ? err.message : JSON.stringify(err),
                };
            }
        });
        this.host = new _host_webHost__WEBPACK_IMPORTED_MODULE_2__.WebHost(config);
    }
}
/**
 * Creates the CoreDispatch that Core uses.
 *
 * @param config Configuration data
 * @returns a new CoreDispatch object: `KmcDispatch | `MockDispatch`
 */
function createDispatch(config) {
    if (config.mock) {
        if (config.mock.dispatch) {
            if (config.mock.dispatch instanceof Function)
                return config.mock.dispatch();
            else
                return new _mock_mockDispatch__WEBPACK_IMPORTED_MODULE_3__.MockDispatch(config);
        }
    }
    return new KmcDispatch(config);
}


/***/ }),

/***/ "./src/env.ts":
/*!********************!*\
  !*** ./src/env.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Environment": () => (/* binding */ Environment)
/* harmony export */ });
/**
 * Environmental parameters defined at build time
 */
const Environment = new (class {
    constructor() {
        this.channel = undefined !== null && undefined !== void 0 ? undefined : "devel";
        this.deviceGatewayUrl = undefined !== null && undefined !== void 0 ? undefined : "http://dockerhost:8008";
        this.optimizelySdkKey = undefined !== null && undefined !== void 0 ? undefined : "";
    }
})();


/***/ }),

/***/ "./src/host/host.ts":
/*!**************************!*\
  !*** ./src/host/host.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hostCall": () => (/* binding */ hostCall)
/* harmony export */ });
/* harmony import */ var _messaging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../messaging */ "./src/messaging/index.ts");
/* harmony import */ var _util_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/error */ "./src/util/error.ts");
/* harmony import */ var _messaging_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../messaging/types */ "./src/messaging/types.ts");



/**
 * Dispatches the HostRequest to a Host function. host function is
 * only ever called from Kmc, so we can assume that host will be
 * the WebHost (aka us).
 *
 * Note that this function is not asynchronous. If a Host receives
 * a request that begins an asynchronous operation (like `newKey`) then
 * the host will return a `Pending(token)` primitive to Core.
 * Core will then continually poll for the result until the async
 * operation completes successfully or fails. (see `AsyncDispatch`.)
 *
 * @param host The host that will respond to the request.
 * @param msg The JSON request received from KMC
 * @returns A JSON serialized CoreResult
 */
function hostCall(host, msg) {
    let rsp;
    try {
        let rq = (0,_messaging__WEBPACK_IMPORTED_MODULE_0__.readRequest)(msg);
        let result = dispatch(host, rq);
        if (typeof result.then === "function") {
            rsp = result.then((result) => (0,_messaging__WEBPACK_IMPORTED_MODULE_0__.writeResponse)(result));
        }
        else {
            rsp = (0,_messaging__WEBPACK_IMPORTED_MODULE_0__.writeResponse)(result);
        }
    }
    catch (err) {
        // Hand-crafted Error indication (JSON.stringify may throw)
        rsp = `{Err:${(0,_util_error__WEBPACK_IMPORTED_MODULE_1__.makeError)(err).message}}`;
    }
    return rsp;
}
/**
 * Unpacks the hostRequest and calls the appropriate handler.
 * Only called from hostCall, which manages exception handling,
 * so implementors need not worry about catching exceptions here.
 *
 * Note that the MockDispatch can make calls directly to the
 * handlers & does not need to call `dispatch`.
 *
 * TODO: make a host dispatch table.
 * @param rq
 */
function dispatch(host, rq) {
    try {
        if (typeof rq === "string") {
            if (rq == "GetDeviceGatewayUrl") {
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.deviceGatewayUrl(host.getDeviceGatewayUrl());
            }
            else if (rq == "ClientEnvironment") {
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.clientEnvironment(host.getClientEnvironment());
            }
        }
        else {
            if ("Ask" in rq) {
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.bool(host.ask(rq.Ask));
            }
            else if ("AuthenticationPrompt" in rq) {
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.bool(host.authenticationPrompt(rq.AuthenticationPrompt.appName, rq.AuthenticationPrompt.detailList));
            }
            else if ("CheckFeatureFlags" in rq) {
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.featureFlagResponse(host.checkFeatureFlags(rq.CheckFeatureFlags));
            }
            else if ("ExportRequestReceived" in rq) {
                host.exportRequestReceived(rq.ExportRequestReceived);
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.ok();
            }
            else if ("ExportStarted" in rq) {
                host.exportStarted(rq.ExportStarted);
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.ok();
            }
            else if ("ExportTokenTimeout" in rq) {
                host.exportTokenTimeout(rq.ExportTokenTimeout);
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.ok();
            }
            else if ("GetFilePath" in rq) {
                let path = host.getFilePath(rq.GetFilePath);
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.filePath({
                    path_type: path.type,
                    path: path.path,
                });
            }
            else if ("ImportManifestReceived" in rq) {
                host.importManifestReceived(rq.ImportManifestReceived);
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.ok();
            }
            else if ("ImportReceivedSigned" in rq) {
                host.importReceivedSigned(rq.ImportReceivedSigned);
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.ok();
            }
            else if ("ImportRequestsToSign" in rq) {
                host.importRequestsToSign(rq.ImportRequestsToSign);
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.ok();
            }
            else if ("ImportStarted" in rq) {
                host.importStarted(rq.ImportStarted);
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.ok();
            }
            else if ("Log" in rq) {
                host.log(rq.Log);
                return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.ok();
            }
            else if ("SelectAuthNCredential" in rq) {
                return host
                    .selectCredentialV1(rq.SelectAuthNCredential.map((cred) => (0,_messaging_types__WEBPACK_IMPORTED_MODULE_2__.credentialV1FromCredential)(cred)))
                    .then((id) => _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.selectedAuthNCredential(id));
            }
        }
    }
    catch (err) {
        return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.error(err);
    }
    return _messaging__WEBPACK_IMPORTED_MODULE_0__.CoreMessage.error("Not implemented");
}


/***/ }),

/***/ "./src/host/index.ts":
/*!***************************!*\
  !*** ./src/host/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hostCall": () => (/* reexport safe */ _host__WEBPACK_IMPORTED_MODULE_0__.hostCall),
/* harmony export */   "createHost": () => (/* binding */ createHost)
/* harmony export */ });
/* harmony import */ var _host__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./host */ "./src/host/host.ts");
/* harmony import */ var _webHost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./webHost */ "./src/host/webHost.ts");
/* harmony import */ var _mock_mockHost__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mock/mockHost */ "./src/mock/mockHost.ts");



function createHost(config) {
    if (config.mock) {
        if (config.mock.host) {
            if (config.mock.host instanceof Function)
                return config.mock.host();
            else
                return new _mock_mockHost__WEBPACK_IMPORTED_MODULE_2__.MockHost(config);
        }
    }
    return new _webHost__WEBPACK_IMPORTED_MODULE_1__.WebHost(config);
}


/***/ }),

/***/ "./src/host/webHost.ts":
/*!*****************************!*\
  !*** ./src/host/webHost.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebHost": () => (/* binding */ WebHost)
/* harmony export */ });
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../log */ "./src/log.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../env */ "./src/env.ts");


/**
 * The WebHost is the live implementation of the Host interface.
 * It is responsible for dispatching messages from Core to the
 * Enclave, or DeviceQuery, or the UI.
 */
class WebHost {
    constructor(config) {
        // Install a default feature flag provider.
        this.queryFeatureFlag = (string) => {
            return false;
        };
        this.logger = config.log ? config.log : new _log__WEBPACK_IMPORTED_MODULE_0__.ConsoleLog();
    }
    get events() {
        return this;
    }
    checkFeatureFlags(feature_flags) {
        return [];
    }
    exportStarted(token) {
        if (this.onexport)
            this.onexport({ type: "started", data: token });
    }
    exportTokenTimeout(rendezvous_token) {
        if (this.onexport)
            this.onexport({ type: "timeout", data: rendezvous_token });
    }
    exportRequestReceived(requests) {
        if (this.onexport)
            this.onexport({ type: "requestReceived", data: requests });
    }
    getClientEnvironment() {
        // cryptoSource shall be set to "Host" so that Workforce flows 
        // (register, import, export, oidcPublic, oidcConfidential, ...) 
        // will only ever use the Host-based CryptoProvider and never the 
        // HAL-based Crypto Provider; that is, HAL shall *only* be constructed 
        // for PLG flows (bindCredential, authenticate).
        // The Host-based Crypto provider examines the value of 
        // `window.localStorage.EnableWebauthn`:
        // * if "true", then the CryptoProvider will try to use WebAuthn for 
        // key generation. 
        // * otherwise, the CryptoProvider will use Subtle Crypto for key
        // generation.
        // `window.localStorage.EnableWebauthn` is undefined by default, and 
        // can only be set manually per browser, effectively restricting 
        // Workforce to use Subtle Crypto keys. This is consistent with 
        // current Workforce deployments.
        // keyStorageStrategy shall be set to "TeeIfAvailable" so that HAL 
        // will always try to use WebAuthn for key generation. As HAL is 
        // only constructed for PLG flows, this value only affects the key 
        // generation during PLG's bindCredential function.
        // HAL does not examine `window.localStorage.EnableWebauthn` to 
        // determine key generation strategy.
        return {
            cryptoSource: "Host",
            keyStorageStrategy: "TeeIfAvailable",
        };
    }
    getDeviceGatewayUrl() {
        return _env__WEBPACK_IMPORTED_MODULE_1__.Environment.deviceGatewayUrl;
    }
    getFilePath(path_type) {
        return {
            type: path_type,
            path: "",
        };
    }
    importStarted(token) {
        if (this.onimport) {
            this.onimport({ type: "started", data: token });
        }
    }
    importManifestReceived(manifests) {
        if (this.onimport) {
            this.onimport({ type: "manifestsReceived", data: manifests });
        }
    }
    importRequestsToSign(requests) {
        if (this.onimport) {
            this.onimport({ type: "requestsToSign", data: requests });
        }
    }
    importReceivedSigned(signed) {
        if (this.onimport) {
            this.onimport({ type: "receivedSigned", data: signed });
        }
    }
    ask(profile_handle) {
        return true;
    }
    authenticationPrompt(app_name, detail_list) {
        return true;
    }
    log(msg) {
        this.logger.write(msg);
        return;
    }
    selectCredentialV1(credentials) {
        if (this.onSelectCredentialV1) {
            return this.onSelectCredentialV1(credentials);
        }
        return Promise.resolve(credentials[0].id);
    }
}


/***/ }),

/***/ "./src/log.ts":
/*!********************!*\
  !*** ./src/log.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConsoleLog": () => (/* binding */ ConsoleLog)
/* harmony export */ });
/**
 * The default implementatino of the Log interface.
 * Data is logged to the debug console.
 */
class ConsoleLog {
    write(...data) {
        console.log(data);
    }
}


/***/ }),

/***/ "./src/messaging/coreMessage.ts":
/*!**************************************!*\
  !*** ./src/messaging/coreMessage.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ok": () => (/* binding */ ok),
/* harmony export */   "error": () => (/* binding */ error),
/* harmony export */   "featureFlagResponse": () => (/* binding */ featureFlagResponse),
/* harmony export */   "deviceGatewayUrl": () => (/* binding */ deviceGatewayUrl),
/* harmony export */   "clientEnvironment": () => (/* binding */ clientEnvironment),
/* harmony export */   "deviceInfo": () => (/* binding */ deviceInfo),
/* harmony export */   "filePath": () => (/* binding */ filePath),
/* harmony export */   "bool": () => (/* binding */ bool),
/* harmony export */   "bytes": () => (/* binding */ bytes),
/* harmony export */   "selectedAuthNCredential": () => (/* binding */ selectedAuthNCredential)
/* harmony export */ });
function makeError(err) {
    if (typeof err === "string")
        return new Error(err);
    else if ("message" in err)
        return err;
    else
        return new Error(err);
}
function ok(rsp) {
    return { Ok: rsp ? rsp : "Unit" };
}
function error(err) {
    return { Err: makeError(err).message };
}
function featureFlagResponse(flags) {
    return ok({ FeatureFlags: flags });
}
function deviceGatewayUrl(url) {
    return ok({ DeviceGatewayUrl: url });
}
function clientEnvironment(clientEnvironment) {
    return ok({
        ClientEnvironment: {
            crypto_source: clientEnvironment.cryptoSource,
            key_storage_strategy: clientEnvironment.keyStorageStrategy,
        },
    });
}
function deviceInfo(info) {
    return ok({ DeviceInfo: info });
}
function filePath(path) {
    return ok({ FilePath: path });
}
function bool(value) {
    return ok({ Bool: value });
}
function bytes(data) {
    return ok({ Bytes: Array.from(data) });
}
function selectedAuthNCredential(id) {
    return ok({ SelectedAuthNCredentialId: id });
}


/***/ }),

/***/ "./src/messaging/hostMessage.ts":
/*!**************************************!*\
  !*** ./src/messaging/hostMessage.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/messaging/index.ts":
/*!********************************!*\
  !*** ./src/messaging/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Types": () => (/* reexport module object */ _types__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "CoreMessage": () => (/* reexport module object */ _coreMessage__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "HostMessage": () => (/* reexport module object */ _hostMessage__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   "messageType": () => (/* binding */ messageType),
/* harmony export */   "writeResponse": () => (/* binding */ writeResponse),
/* harmony export */   "readRequest": () => (/* binding */ readRequest)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/messaging/types.ts");
/* harmony import */ var _coreMessage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./coreMessage */ "./src/messaging/coreMessage.ts");
/* harmony import */ var _hostMessage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hostMessage */ "./src/messaging/hostMessage.ts");



/**
 * Returns the type the request/response type from the interface.
*/
function messageType(msg) {
    if (typeof msg === "string")
        return msg;
    else
        return Object.keys(msg)[0];
}
function ok(res) {
    return messageType(res) == "Ok";
}
/**
 * Writes a core result as a JSON string.
 * @param res The result to be serialized.
 * @returns
 */
function writeResponse(res) {
    return JSON.stringify(res);
}
/**
 * Parses a host request from a JSON string
 * @param req the request to parse.
 */
function readRequest(req) {
    return JSON.parse(req);
}


/***/ }),

/***/ "./src/messaging/types.ts":
/*!********************************!*\
  !*** ./src/messaging/types.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PathType": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_0__.PathType),
/* harmony export */   "credentialFromProfile": () => (/* binding */ credentialFromProfile),
/* harmony export */   "credentialFromCore": () => (/* binding */ credentialFromCore),
/* harmony export */   "toUrlResponse": () => (/* binding */ toUrlResponse),
/* harmony export */   "credentialV1FromCredential": () => (/* binding */ credentialV1FromCredential),
/* harmony export */   "toUrlType": () => (/* binding */ toUrlType)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types */ "./src/types/index.ts");
/**
 * These messaging types are duplicates of the application types
 * with the exception that they have snake_case spellings
 * so that they are properly serialized into/out of Core.
 *
 * Some types have the same spelling, so they are re-exports
 * of the application types.
 */

/** Helper method for constructing Credentials from rust Profile objects. */
function credentialFromProfile(profile) {
    return {
        state: profile.state,
        created: profile.created,
        handle: profile.handle,
        keyHandle: profile.key_handle,
        keyType: profile.key_type,
        name: profile.name,
        imageURL: profile.image_url,
        loginURI: profile.login_uri,
        enrollURI: profile.enroll_uri,
        chain: profile.chain,
        rootFingerprint: profile.root_fingerprint,
        userId: profile.user_id,
    };
}
function unwrapString(result, name, errors) {
    var _a;
    if ("Ok" in result) {
        return result["Ok"];
    }
    else {
        errors[name] = (_a = result["Err"]) !== null && _a !== void 0 ? _a : "ResultParse";
        return "";
    }
}
function unwrapStringArray(results, name, errors) {
    return results.map((result) => {
        return unwrapString(result, name, errors);
    });
}
function credentialFromCore(cred) {
    let errors = {};
    let newCred = {
        state: cred.state,
        created: unwrapString(cred.created, "created", errors),
        handle: unwrapString(cred.handle, "handle", errors),
        keyHandle: unwrapString(cred.key_handle, "keyHandle", errors),
        keyType: undefined,
        name: cred.name,
        imageURL: cred.image_url,
        loginURI: cred.login_uri,
        enrollURI: cred.enroll_uri,
        chain: unwrapStringArray(cred.chain_handles, "chain", errors),
        rootFingerprint: unwrapString(cred.root_fingerprint, "rootFingerprint", errors),
        userId: undefined,
        user: {},
        deviceCredential: {},
        integrityFailures: Object.keys(errors).length ? errors : undefined,
    };
    return newCred;
}
/** Helper method for constructing UrlResponse from rust HandleUrlRespone objects. */
function toUrlResponse(rsp) {
    if ("SelfIssue" in rsp) {
        return {
            type: "selfIssue",
            selfIssue: {
                credential: credentialFromProfile(rsp["SelfIssue"].profile),
                redirectURL: rsp["SelfIssue"].redirect_url,
                handledRedirectExternally: rsp["SelfIssue"].handled_redirect_externally,
            },
        };
    }
    else if ("Registration" in rsp) {
        return {
            type: "registration",
            registration: {
                credential: credentialFromProfile(rsp["Registration"].profile),
            },
        };
    }
    else if ("BiAuthenticate" in rsp) {
        return {
            type: "biAuthenticate",
            biAuthenticate: {
                redirectURL: rsp["BiAuthenticate"].redirect_url,
                message: rsp["BiAuthenticate"].message,
            },
        };
    }
    else if ("BindCredential" in rsp) {
        return {
            type: "bindCredential",
            bindCredential: {
                credential: rsp["BindCredential"].credential,
                postBindRedirect: rsp["BindCredential"].post_binding_redirect_uri,
            },
        };
    }
    else {
        throw new Error("Unexpected error");
    }
}
function credentialV1FromCredential(coreCred) {
    let cred = {
        id: coreCred.id,
        localCreated: coreCred.local_created,
        localUpdated: coreCred.local_updated,
        apiBaseUrl: coreCred.api_base_url,
        tenantId: coreCred.tenant_id,
        realmId: coreCred.realm_id,
        identityId: coreCred.identity_id,
        keyHandle: coreCred.key_handle,
        state: coreCred.state,
        created: coreCred.created,
        updated: coreCred.updated,
        realm: {
            displayName: coreCred.realm.display_name,
        },
        identity: {
            displayName: coreCred.identity.display_name,
            username: coreCred.identity.username,
            emailAddress: "", // FIXME: email is missing from CoreIdentityV1
        },
        theme: {
            logoUrlLight: coreCred.theme.logo_url_light,
            logoUrlDark: coreCred.theme.logo_url_dark,
            supportUrl: coreCred.theme.support_url,
        },
    };
    return cred;
}
/** Helper method for constructing UrlType from string. */
function toUrlType(rawUrlType) {
    switch (rawUrlType) {
        case "Authenticate": {
            return { type: "Authenticate" };
        }
        case "Bind": {
            return { type: "Bind" };
        }
        default: {
            throw new Error("Unexpected Url Type");
        }
    }
}


/***/ }),

/***/ "./src/mock/mockData.ts":
/*!******************************!*\
  !*** ./src/mock/mockData.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "resolve": () => (/* binding */ resolve)
/* harmony export */ });
function get(x) {
    if (x instanceof Function) {
        return x();
    }
    else {
        return x;
    }
}
function resolve(x) {
    if (x instanceof Function) {
        return Promise.resolve(x());
    }
    else {
        return Promise.resolve(x);
    }
}


/***/ }),

/***/ "./src/mock/mockDispatch.ts":
/*!**********************************!*\
  !*** ./src/mock/mockDispatch.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MockDispatch": () => (/* binding */ MockDispatch)
/* harmony export */ });
/* harmony import */ var _host__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../host */ "./src/host/index.ts");
/* harmony import */ var _mockData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mockData */ "./src/mock/mockData.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class MockDispatch {
    // FIXME: supply default config data
    constructor(config) {
        this.getAppInstanceId = () => __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve("123");
        });
        this.getBrowserInfo = () => __awaiter(this, void 0, void 0, function* () {
            return {};
        });
        this.mock = config.mock ? config.mock.dispatch : {};
        this.host = (0,_host__WEBPACK_IMPORTED_MODULE_0__.createHost)(config);
    }
    bindCredentialUrl(url) {
        if (this.mock.bindCredential)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.bindCredential);
        return Promise.resolve({
            credential: {
                id: "123-456",
                localCreated: new Date().toISOString(),
                localUpdated: new Date().toISOString(),
                apiBaseUrl: "www.example.com",
                tenantId: "tenant-id",
                realmId: "realm-id",
                identityId: "identity-id",
                credentialId: "abc",
                keyHandle: "abc",
                state: "Active",
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                realm: {
                    name: "realm",
                    displayName: "My First Realm",
                },
                identity: {
                    displayName: "First User",
                    username: "FirstUser",
                    emailAddress: "",
                },
                theme: {
                    logoUrlLight: "https://app.rolling.byndid.run/static/img/logo.eada4aebc845fb4514b5.png",
                    logoUrlDark: "https://app.rolling.byndid.run/static/img/logo.eada4aebc845fb4514b5.png",
                    primaryColorLight: "#4673D3",
                    primaryColorDark: "#FFFFFF",
                    supportUrl: "https://beyondidentity.atlassian.net/wiki/spaces/CS/overview",
                },
            },
            postBindRedirect: "https://google.com",
        });
    }
    getUrlType(url) {
        return { type: "Authenticate" };
    }
    updateCredential(credentialId) {
        return Promise.resolve({
            id: "123-456",
            localCreated: new Date().toISOString(),
            localUpdated: new Date().toISOString(),
            apiBaseUrl: "www.example.com",
            tenantId: "tenant-id",
            realmId: "realm-id",
            identityId: "identity-id",
            credentialId: "abc",
            keyHandle: "abc",
            state: "Revoked",
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            realm: {
                name: "realm",
                displayName: "My First Realm",
            },
            identity: {
                displayName: "First User",
                username: "FirstUser",
                emailAddress: "",
            },
            theme: {
                logoUrlLight: "https://app.rolling.byndid.run/static/img/logo.eada4aebc845fb4514b5.png",
                logoUrlDark: "https://app.rolling.byndid.run/static/img/logo.eada4aebc845fb4514b5.png",
                primaryColorLight: "#4673D3",
                primaryColorDark: "#FFFFFF",
                supportUrl: "https://beyondidentity.atlassian.net/wiki/spaces/CS/overview",
            },
        });
    }
    migrateDatabase(allowedDomains) { }
    cancel() {
        if (this.mock.cancel)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.cancel);
        return Promise.resolve();
    }
    createPkce() {
        if (this.mock.createPkce)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.createPkce);
        let response = {
            codeVerifier: "",
            codeChallenge: {
                challenge: "123",
                method: "",
            },
        };
        return Promise.resolve(response);
    }
    createCredential(handle, name, imageUrl, loginUri, enrollUri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mock.createCredential)
                return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.createCredential);
            // return the profile.
            let profile = {
                state: "Active",
                created: new Date().toISOString(),
                handle: "abcde",
                keyHandle: "12345",
                name: "Carl Hungus",
                imageURL: "www.example.com",
                chain: ["qwerty", "asdfg"],
                rootFingerprint: "3",
            };
            return profile;
        });
    }
    deleteCredential(handle) {
        if (this.mock.deleteCredential)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.deleteCredential);
        return Promise.resolve();
    }
    deleteCredentialV1(id) {
        return Promise.resolve();
    }
    authenticate(url, trusted, onSelectCredential) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = (_a = (yield (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.listCredentials))) !== null && _a !== void 0 ? _a : [
                {
                    id: "456-123",
                    localCreated: new Date().toISOString(),
                    localUpdated: new Date().toISOString(),
                    apiBaseUrl: "www.example.com",
                    tenantId: "tenant-id",
                    realmId: "realm-id",
                    identityId: "identity-id-1",
                    keyHandle: "abc",
                    state: "Active",
                    created: new Date().toISOString(),
                    updated: new Date().toISOString(),
                    realm: {
                        name: "realm",
                        displayName: "My First Realm",
                    },
                    identity: {
                        displayName: "First User",
                        username: "FirstUser",
                        emailAddress: "",
                    },
                    theme: {
                        logoUrlLight: "https://app.rolling.byndid.run/static/img/logo.eada4aebc845fb4514b5.png",
                        logoUrlDark: "https://app.rolling.byndid.run/static/img/logo.eada4aebc845fb4514b5.png",
                        primaryColorLight: "#4673D3",
                        primaryColorDark: "#FFFFFF",
                        supportUrl: "https://beyondidentity.atlassian.net/wiki/spaces/CS/overview",
                    },
                },
                {
                    id: "123-456",
                    localCreated: new Date().toISOString(),
                    localUpdated: new Date().toISOString(),
                    apiBaseUrl: "www.example.com",
                    tenantId: "tenant-id",
                    realmId: "realm-id",
                    identityId: "identity-id-2",
                    keyHandle: "def",
                    state: "Active",
                    created: new Date().toISOString(),
                    updated: new Date().toISOString(),
                    realm: {
                        name: "realm",
                        displayName: "My First Realm",
                    },
                    identity: {
                        displayName: "Second User",
                        username: "SecondUser",
                        emailAddress: "",
                    },
                    theme: {
                        logoUrlLight: "https://app.rolling.byndid.run/static/img/logo.eada4aebc845fb4514b5.png",
                        logoUrlDark: "https://app.rolling.byndid.run/static/img/logo.eada4aebc845fb4514b5.png",
                        primaryColorLight: "#4673D3",
                        primaryColorDark: "#FFFFFF",
                        supportUrl: "https://beyondidentity.atlassian.net/wiki/spaces/CS/overview",
                    },
                },
            ];
            const selectedCredentialId = yield (onSelectCredential
                ? onSelectCredential(credentials)
                : this.host.selectCredentialV1(credentials));
            if (this.mock.authenticate) {
                let response = yield (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.authenticate);
                if (response.type == "biAuthenticate")
                    return response.biAuthenticate;
                else
                    throw new Error("Invalid response type");
            }
            return Promise.resolve({
                redirectURL: "https://example.com/bi-authenticate-done",
                message: "ok",
            });
        });
    }
    authenticateConfidential(authURL, clientId, redirectURI, scope, PKCECodeChallenge, nonce) {
        if (this.mock.authenticateConfidential)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.authenticateConfidential);
        let response = {
            code: "lmnop",
        };
        return Promise.resolve(response);
    }
    authenticatePublic(authURL, tokenURL, clientId, redirectURI, nonce) {
        if (this.mock.authenticatePublic)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.authenticatePublic);
        let response = {
            accessToken: "123",
            idToken: "abc",
            tokenType: "bearer",
            expiresIn: 5,
        };
        return Promise.resolve(response);
    }
    export(handle) {
        if (this.mock.export)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.export);
        return Promise.resolve();
    }
    getCredentials() {
        if (this.mock.getCredentials)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.getCredentials);
        let response = {
            state: "Active",
            created: new Date().toISOString(),
            handle: "abcde",
            keyHandle: "12345",
            name: "Carl Hungus",
            imageURL: "www.example.com",
            chain: ["qwerty", "asdfg"],
            rootFingerprint: "3",
        };
        return Promise.resolve([response]);
    }
    listCredentials() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let response = {
                id: "abc",
                localCreated: new Date().toISOString(),
                localUpdated: new Date().toISOString(),
                apiBaseUrl: "www.example.com",
                tenantId: "tenant-id",
                realmId: "realm-id",
                identityId: "identity-id",
                keyHandle: "abc",
                state: "Active",
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                realm: {
                    displayName: "My First Realm",
                },
                identity: {
                    displayName: "First User",
                    username: "FirstUser",
                    emailAddress: "",
                },
                theme: {
                    logoUrlLight: "https://app.rolling.byndid.run/static/img/logo.eada4aebc845fb4514b5.png",
                    logoUrlDark: "https://app.rolling.byndid.run/static/img/logo.eada4aebc845fb4514b5.png",
                    supportUrl: "https://beyondidentity.atlassian.net/wiki/spaces/CS/overview",
                },
            };
            return ((_a = (yield (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.listCredentials))) !== null && _a !== void 0 ? _a : Promise.resolve([response]));
        });
    }
    getKeyType(keyHandle) {
        return Promise.resolve("subtle");
    }
    handleURL(url, trusted) {
        if (this.mock.handleURL)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.handleURL);
        return Promise.reject("Not sure what to return here...");
    }
    import(token) {
        if (this.mock.import)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.import);
        let response = {
            state: "Active",
            created: new Date().toISOString(),
            handle: "abcde",
            keyHandle: "12345",
            name: "Carl Hungus",
            imageURL: "www.example.com",
            chain: ["qwerty", "asdfg"],
            rootFingerprint: "3",
        };
        return Promise.resolve(response);
    }
    register(url, trusted) {
        if (this.mock.register)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_1__.resolve)(this.mock.register);
        let credential = {
            state: "Active",
            created: new Date().toISOString(),
            handle: "abcde",
            keyHandle: "12345",
            name: "Carl Hungus",
            imageURL: "www.example.com",
            chain: ["qwerty", "asdfg"],
            rootFingerprint: "3",
        };
        let response = {
            type: "registration",
            registration: {
                credential: credential,
            },
        };
        return Promise.resolve(response);
    }
}


/***/ }),

/***/ "./src/mock/mockHost.ts":
/*!******************************!*\
  !*** ./src/mock/mockHost.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MockHost": () => (/* binding */ MockHost)
/* harmony export */ });
/* harmony import */ var _mockData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mockData */ "./src/mock/mockData.ts");

class MockHost {
    constructor(config) {
        this.queryFeatureFlag = (string) => {
            return false;
        };
        this.mock = config.mock ? config.mock.host : {};
    }
    get events() {
        return this;
    }
    checkFeatureFlags(feature_flags) {
        if (this.mock.checkFeatureFlags)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.checkFeatureFlags);
        throw new Error("unimplemented");
    }
    getClientEnvironment() {
        return {
            cryptoSource: "Hal",
            keyStorageStrategy: "ForceSoftware",
        };
    }
    exportStarted(rendezvous_token) {
        if (this.mock.exportStarted)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.exportStarted);
    }
    exportTokenTimeout(rendezvous_token) {
        if (this.mock.exportTokenTimeout)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.exportTokenTimeout);
    }
    exportRequestReceived(requests) {
        if (this.mock.exportRequestReceived)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.exportRequestReceived);
    }
    getDeviceGatewayUrl() {
        if (this.mock.getDeviceGatewayUrl)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.getDeviceGatewayUrl);
        throw new Error("unimplemented");
    }
    getFilePath(path_type) {
        if (this.mock.getFilePath)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.getFilePath);
        throw new Error("unimplemented");
    }
    importStarted(token) {
        if (this.mock.importStarted)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.importStarted);
    }
    importManifestReceived(manifests) {
        if (this.mock.importManifestReceived)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.importManifestReceived);
    }
    importRequestsToSign(requests) {
        if (this.mock.importRequestsToSign)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.importRequestsToSign);
    }
    importReceivedSigned(signed) {
        if (this.mock.importReceivedSigned)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.importReceivedSigned);
    }
    ask(profile_handle) {
        if (this.mock.ask)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.ask);
        throw new Error("unimplemented");
    }
    authenticationPrompt(app_name, detail_list) {
        if (this.mock.authenticationPrompt)
            return (0,_mockData__WEBPACK_IMPORTED_MODULE_0__.get)(this.mock.authenticationPrompt);
        throw new Error("unimplemented");
    }
    log(msg) {
        console.log(msg);
    }
    selectCredentialV1(credentials) {
        if (this.onSelectCredentialV1) {
            return this.onSelectCredentialV1(credentials);
        }
        return Promise.resolve(credentials[0].id);
    }
}


/***/ }),

/***/ "./src/types/index.ts":
/*!****************************!*\
  !*** ./src/types/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PathType": () => (/* binding */ PathType)
/* harmony export */ });
var PathType;
(function (PathType) {
    PathType[PathType["osQuery"] = 0] = "osQuery";
})(PathType || (PathType = {}));


/***/ }),

/***/ "./src/util/error.ts":
/*!***************************!*\
  !*** ./src/util/error.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makeError": () => (/* binding */ makeError)
/* harmony export */ });
function makeError(err) {
    if (typeof err === "string")
        return new Error(err);
    else if ("message" in err)
        return err;
    else
        return new Error(err);
}


/***/ }),

/***/ "./src/util/optimizely.ts":
/*!********************************!*\
  !*** ./src/util/optimizely.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Optimizely": () => (/* binding */ Optimizely)
/* harmony export */ });
/* harmony import */ var _optimizely_optimizely_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @optimizely/optimizely-sdk */ "./node_modules/@optimizely/optimizely-sdk/dist/optimizely.browser.min.js");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../env */ "./src/env.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class Optimizely {
    constructor(client) {
        this.client = client;
    }
    static init() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const client = _optimizely_optimizely_sdk__WEBPACK_IMPORTED_MODULE_0__.createInstance({
                sdkKey: _env__WEBPACK_IMPORTED_MODULE_1__.Environment.optimizelySdkKey,
            });
            const ready = yield client.onReady();
            if (!ready.success) {
                throw new Error((_a = ready.reason) !== null && _a !== void 0 ? _a : "Optimizely error");
            }
            return new Optimizely(client);
        });
    }
    queryFeatureFlag(flag, appInstanceId) {
        switch (flag) {
            case "crypto_provider_hal":
                return this.client.isFeatureEnabled(flag, appInstanceId);
            default:
                return false;
        }
    }
}
/**
 * Global opimizely instance.
 *
 * We read optimizely data in response to a synchronous host
 * callback, so we can't init optimizely & get the app instance
 * id at the point of the call (both async). So we init once at
 * startup and save the data globally.
 */
var optimizely = undefined;


/***/ }),

/***/ "./node_modules/uuid/index.js":
/*!************************************!*\
  !*** ./node_modules/uuid/index.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var v1 = __webpack_require__(/*! ./v1 */ "./node_modules/uuid/v1.js");
var v4 = __webpack_require__(/*! ./v4 */ "./node_modules/uuid/v4.js");

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ "./node_modules/uuid/lib/rng-browser.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/rng-browser.js ***!
  \**********************************************/
/***/ ((module) => {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),

/***/ "./node_modules/uuid/v1.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v1.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/uuidjs/uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ "./node_modules/kmc-ffi/kmc_bg.wasm":
/*!******************************************!*\
  !*** ./node_modules/kmc-ffi/kmc_bg.wasm ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "kmc_bg.271d789a518e9d633100.wasm";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Configuration": () => (/* reexport safe */ _configuration__WEBPACK_IMPORTED_MODULE_0__.Configuration),
/* harmony export */   "Core": () => (/* reexport safe */ _core__WEBPACK_IMPORTED_MODULE_1__.Core),
/* harmony export */   "CoreBuilder": () => (/* reexport safe */ _core__WEBPACK_IMPORTED_MODULE_1__.CoreBuilder),
/* harmony export */   "PathType": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.PathType),
/* harmony export */   "Environment": () => (/* reexport safe */ _env__WEBPACK_IMPORTED_MODULE_3__.Environment)
/* harmony export */ });
/* harmony import */ var _configuration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./configuration */ "./src/configuration.ts");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core */ "./src/core.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types */ "./src/types/index.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./env */ "./src/env.ts");





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});