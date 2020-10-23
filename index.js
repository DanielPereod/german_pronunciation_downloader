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
exports.__esModule = true;
var axios_1 = require("axios");
var cheerio = require("cheerio");
var fs = require("fs");
var https = require("https");
var chrome = require("chrome-cookies-secure");
var readline = require("readline");
var Downloader = /** @class */ (function () {
    function Downloader() {
        var _this = this;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.saveCookieOnDatabase = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chrome.getCookies("https://es.forvo.com/", function (err, cookies) { return __awaiter(_this, void 0, void 0, function () {
                            var cookie;
                            return __generator(this, function (_a) {
                                cookie = "__cfduid=" + cookies["__cfduid"] + "; PHPSESSID=" + cookies["PHPSESSID"] + ";";
                                fs.writeFileSync("cookies", cookie);
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.cookieLoader = function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = fs.readFileSync("cookies", { encoding: "utf8", flag: "r" });
                return [2 /*return*/, data];
            });
        }); };
        this.downloadLinks = function (link, cookie) { return __awaiter(_this, void 0, void 0, function () {
            var filename, file_1, request;
            return __generator(this, function (_a) {
                try {
                    filename = link.split("/")[5];
                    file_1 = fs.createWriteStream("./audios/" + filename + ".mp3");
                    request = https.get(link, {
                        headers: {
                            cookie: cookie
                        }
                    }, function (response) {
                        response.pipe(file_1);
                    });
                }
                catch (error) {
                    return [2 /*return*/];
                }
                return [2 /*return*/];
            });
        }); };
        this.scrapLinksByWord = function (word) { return __awaiter(_this, void 0, void 0, function () {
            var pageContent, $, data_id_element, data_id, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get("https://es.forvo.com/word/" + word + "/#de")];
                    case 1:
                        pageContent = _a.sent();
                        $ = cheerio.load(pageContent.data);
                        data_id_element = $("#language-container-de > article:nth-child(1) > ul > li:nth-child(1) > div > div > div").get();
                        data_id = data_id_element[0].attribs["data-id"];
                        console.log("Downloading", "https://es.forvo.com/download/mp3/" + word + "/de/" + data_id);
                        return [2 /*return*/, "https://es.forvo.com/download/mp3/" + word.toLocaleLowerCase() + "/de/" + data_id];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.recursiveAsyncReadLine = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    this.rl.question("Word: ", function (answer) { return __awaiter(_this, void 0, void 0, function () {
                        var cookie, link;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (answer == "exit")
                                        return [2 /*return*/, this.rl.close()];
                                    return [4 /*yield*/, this.cookieLoader()];
                                case 1:
                                    cookie = _a.sent();
                                    return [4 /*yield*/, this.scrapLinksByWord(answer)];
                                case 2:
                                    link = _a.sent();
                                    return [4 /*yield*/, this.downloadLinks(link, cookie)];
                                case 3:
                                    _a.sent();
                                    this.recursiveAsyncReadLine();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                catch (error) {
                    this.rl.question("Word: ", function (answer) { return __awaiter(_this, void 0, void 0, function () {
                        var cookie, link;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (answer == "exit")
                                        return [2 /*return*/, this.rl.close()];
                                    return [4 /*yield*/, this.cookieLoader()];
                                case 1:
                                    cookie = _a.sent();
                                    return [4 /*yield*/, this.scrapLinksByWord(answer)];
                                case 2:
                                    link = _a.sent();
                                    return [4 /*yield*/, this.downloadLinks(link, cookie)];
                                case 3:
                                    _a.sent();
                                    this.recursiveAsyncReadLine(); //Calling this function again to ask new question
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                return [2 /*return*/];
            });
        }); };
    }
    return Downloader;
}());
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var downloader;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    downloader = new Downloader();
                    return [4 /*yield*/, downloader.saveCookieOnDatabase()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, downloader.recursiveAsyncReadLine()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
init();
