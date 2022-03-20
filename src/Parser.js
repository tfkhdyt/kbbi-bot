"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    parseJenisKata(char) {
        const jenisKata = {
            n: 'nomina (kata benda)',
        };
        return jenisKata[char] || char;
    }
}
exports.Parser = Parser;
