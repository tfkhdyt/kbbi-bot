import { IJenisKata } from './interfaces/jenis-kata.interface'

export class Parser {
  parseJenisKata(char: string) {
    const jenisKata: IJenisKata = {
      n: 'Nomina (kata benda)',
      v: 'Verba (kata kerja)',
      a: 'Adjektiva (kata sifat)',
      adv: 'Adverbia (kata keterangan)',
      pron: 'Pronomina (kata ganti)',
      p: 'Partikel',
      num: 'Numeralia (kata bilangan)',
    }
    return jenisKata[char] || char
  }
}
