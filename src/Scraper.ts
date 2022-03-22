// module
import { load, CheerioAPI } from 'cheerio'
// import pretty from 'pretty'

// interface
import { IPengertian } from './interfaces/result.interface'

// scraper class
export class Scraper {
  private ejaan: string[] = []
  private kataTidakBaku?: string = undefined
  private pengertian: IPengertian[] = []
  private $: CheerioAPI

  constructor(html: string) {
    this.$ = load(html)
    // console.log(pretty(html))
  }

  private checkNotFound() {
    const notFound = this.$('h4').text()
    if (notFound.includes('Entri tidak ditemukan'))
      throw new Error('Entri tidak ditemukan')
  }

  private async scrapeData() {
    // check data is found or not
    this.checkNotFound()

    this.$('h2').each((_, element) => {
      const hasil = this.$(element)
      // console.log(hasil.html())

      // get kata baku
      this.kataTidakBaku ??= hasil.find('small').text().replace(/[0-9]/g, '')

      // get ejaan
      hasil.find('small').remove()
      this.ejaan = hasil
        // .remove('small')
        .text()
        .split(' ')
        .filter(Boolean)
        .map((value) => value.replace(/[0-9]/g, ''))

      // get pengertian
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

          // console.log(this.$(el).html())
          // const rawInfo = this.$(el).text().split('  ').filter(Boolean)
          // info.jenisKata = rawInfo[0].split(' ').filter(Boolean)

          // get jenis kata
          info.jenisKata = this.$(el)
            .find('font[color=red] span')
            .map((_, el) => this.$(el).attr('title'))
            .toArray()

          // console.log(this.$(el).text())

          /* if (rawInfo[1].length < 5) {
            info.deskripsi = rawInfo.slice(2).join(' ').trim()
            info.jenisKata.push(rawInfo[1])
          } else {
            info.deskripsi = rawInfo.slice(1).join(' ').trim()
          }*/

          // get deskripsi
          this.$(el).find('font[color=red]').remove()
          info.deskripsi = this.$(el).text()

          // prevent duplicate deskripsi
          if (
            this.pengertian.find((value) => value.deskripsi === info.deskripsi)
          )
            return

          // push variable info into property pengertian
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
