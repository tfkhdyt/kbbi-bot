import { IPengertian } from './interfaces/result.interface'
import { load, CheerioAPI } from 'cheerio'
import { Parser } from './Parser'
// import pretty from 'pretty'

export class Scraper {
  private ejaan: string[] = []
  private kataTidakBaku?: string = ''
  private pengertian: IPengertian[] = []
  private $: CheerioAPI
  private parser: Parser

  constructor(html: string) {
    this.$ = load(html)
    // console.log(pretty(html))
    this.parser = new Parser()
  }

  private checkNotFound() {
    const notFound = this.$('h4').text()
    if (notFound.includes('Entri tidak ditemukan'))
      throw new Error('Entri tidak ditemukan')
  }

  async scrapeData() {
    this.checkNotFound()

    this.$('h2').each((_, element) => {
      const hasil = this.$(element)
      // console.log(hasil.html())

      this.kataTidakBaku = hasil.find('small').text() || undefined

      // push ejaan ke array
      hasil.find('small').remove()
      this.ejaan = hasil
        // .remove('small')
        .text()
        .split(' ')
        .filter(Boolean)
        .map((value) => value.replace(/[0-9]/g, ''))

      hasil
        /* .next()
        .next() */
        .siblings('ul.adjusted-par,ol')
        // .first()
        .children()
        .each((_, el) => {
          const info: IPengertian = {
            jenisKata: [],
            deskripsi: '',
          }

          // parse raw pengertian
          // console.log(this.$(el).html())
          // const rawInfo = this.$(el).text().split('  ').filter(Boolean)

          // parse jenis kata
          // info.jenisKata = rawInfo[0].split(' ').filter(Boolean)
          info.jenisKata = this.$(el)
            .find('font[color=red] span')
            .map((_, el) => this.$(el).attr('title'))
            .toArray()

          // console.log(this.$(el).text())

          // parse pengertian
          /* if (rawInfo[1].length < 5) {
            info.deskripsi = rawInfo.slice(2).join(' ').trim()
            info.jenisKata.push(rawInfo[1])
          } else {
            info.deskripsi = rawInfo.slice(1).join(' ').trim()
          }*/
          this.$(el).find('font[color=red]').remove()
          info.deskripsi = this.$(el).text()

          // parse raw jenis kata
          info.jenisKata = info.jenisKata.map(
            this.parser.parseJenisKata
          ) as string[]

          // push objek info ke array pengertian
          if (
            this.pengertian.find((value) => value.deskripsi === info.deskripsi)
          )
            return
          this.pengertian.push(info)
        })
    })
  }

  async getData() {
    await this.scrapeData()
    return {
      ejaan: this.ejaan,
      kataTidakBaku: this.kataTidakBaku,
      pengertian: this.pengertian,
    }
  }
}
