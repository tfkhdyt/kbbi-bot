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
exports.Scraper = void 0;
const cheerio_1 = require("cheerio");
const Parser_1 = require("./Parser");
// import pretty from 'pretty'
class Scraper {
    constructor(html) {
        this.ejaan = [];
        this.pengertian = [];
        this.$ = (0, cheerio_1.load)(html);
        // console.log(pretty(html))
        this.parser = new Parser_1.Parser();
    }
    checkNotFound() {
        const notFound = this.$('h4').text();
        if (notFound.includes('Entri tidak ditemukan'))
            throw new Error('Entri tidak ditemukan');
    }
    scrapeData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkNotFound();
            this.$('h2').each((_, element) => {
                const hasil = this.$(element);
                // push ejaan ke array
                this.ejaan = hasil
                    .text()
                    .split(' ')
                    .filter(Boolean)
                    .map((value) => value.replace(/[0-9]/g, ''));
                hasil
                    /* .next()
                    .next() */
                    .siblings('ul,ol')
                    .first()
                    .children()
                    .each((_, el) => {
                    const info = {
                        jenisKata: [],
                        deskripsi: '',
                    };
                    // parse raw pengertian
                    // console.log(this.$(el).text())
                    const rawInfo = this.$(el).text().split('  ').filter(Boolean);
                    // parse jenis kata
                    info.jenisKata = rawInfo[0].split(' ').filter(Boolean);
                    // console.log(rawInfo)
                    // parse deskripsi
                    if (rawInfo[1].length < 5) {
                        info.deskripsi = rawInfo.slice(2).join(' ').trim();
                        info.jenisKata.push(rawInfo[1]);
                    }
                    else {
                        info.deskripsi = rawInfo.slice(1).join(' ').trim();
                    }
                    // parse raw jenis kata
                    info.jenisKata = info.jenisKata.map(this.parser.parseJenisKata);
                    // push objek info ke array pengertian
                    this.pengertian.push(info);
                });
            });
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.scrapeData();
            return {
                ejaan: this.ejaan,
                pengertian: this.pengertian,
            };
        });
    }
}
exports.Scraper = Scraper;
