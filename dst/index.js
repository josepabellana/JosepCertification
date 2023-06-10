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
import { chromium } from 'playwright';
var launchOptions = {
    slowMo: 0,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--deny-permission-prompts'],
    firefoxUserPrefs: {
        'media.navigator.streams.fake': true,
        'media.navigator.permission.disabled': true
    }
};
function getManifestURL(url) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var browser, context, page, manifestContent, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, chromium.launch(__assign(__assign({}, launchOptions), { channel: 'chrome' }))];
                            case 1:
                                browser = _a.sent();
                                return [4 /*yield*/, browser.newContext({
                                        viewport: { width: 1200, height: 800 },
                                        ignoreHTTPSErrors: true
                                    })];
                            case 2:
                                context = _a.sent();
                                return [4 /*yield*/, context.newPage()];
                            case 3:
                                page = _a.sent();
                                manifestContent = null;
                                _a.label = 4;
                            case 4:
                                _a.trys.push([4, 6, 7, 9]);
                                page.on('request', function (request) {
                                    if (request.resourceType() === 'xhr' && /manifest.m3u8$/i.test(request.url())) {
                                        console.log('>>', request.resourceType(), request.url());
                                        var manifestURL = request.url();
                                        console.log("Manifest URL: ".concat(manifestURL));
                                        request.response().then(function (res) {
                                            res.text().then(function (text) {
                                                manifestContent = text;
                                            });
                                        });
                                    }
                                    if (request.resourceType() === 'xhr' && /playlist.m3u8$/i.test(request.url())) {
                                        console.log('>>', request.resourceType(), request.url());
                                        var playlistURK = request.url();
                                        console.log("Playlist URL: ".concat(playlistURK));
                                        request.response().then(function (res) {
                                            res.text().then(function (text) {
                                                resolve({ manifestContent: manifestContent, playlistContent: text });
                                                // Close the browser
                                                browser.close();
                                            });
                                        });
                                    }
                                });
                                // const encodedUrl = encodeURIComponent(url);
                                return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle' })];
                            case 5:
                                // const encodedUrl = encodeURIComponent(url);
                                _a.sent();
                                return [3 /*break*/, 9];
                            case 6:
                                error_1 = _a.sent();
                                console.error('Error occurred during request interception:', error_1);
                                reject('');
                                return [3 /*break*/, 9];
                            case 7: return [4 /*yield*/, page.screenshot({ path: 'screenshot.png' })];
                            case 8:
                                _a.sent();
                                return [7 /*endfinally*/];
                            case 9: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
