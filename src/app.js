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
Object.defineProperty(exports, "__esModule", { value: true });
const Fetcher_1 = require("./Fetcher");
const Scraper_1 = require("./Scraper");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // let message: string
    const fetcher = new Fetcher_1.Fetcher('bicara');
    const html = yield fetcher.getData();
    const scraper = new Scraper_1.Scraper(html);
    const result = yield scraper
        .getData()
        .catch((err) => console.error(err.message));
    if (!result) {
        return;
    }
    console.log(result);
});
main();
