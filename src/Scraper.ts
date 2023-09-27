import { CheerioAPI, load } from 'cheerio'

import { IPengertian } from './interfaces/result.interface.js'

export class Scraper {
  private ejaan: string[] = []
  private kataTidakBaku?: string = undefined
  private prakategorial?: string = undefined
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

    // get prakategorial
    this.prakategorial ??= this.$(
      'font[title="prakategorial: kata tidak dipakai dalam bentuk dasarnya"]',
    )
      .next()
      .text() as string

    this.$('h2').each((_, element) => {
      const hasil = this.$(element)

      // get kata baku
      this.kataTidakBaku ??= hasil.find('small').text().replace(/[0-9]/g, '')

      // get ejaan
      hasil.find('small').remove()
      this.ejaan = hasil
        .text()
        .split(' ')
        .filter(Boolean)
        .map((value) => value.replace(/[0-9]/g, ''))

      // get pengertian
      hasil
        .siblings('ul.adjusted-par,ol')
        .children()
        .each((_, el) => {
          const info: IPengertian = {
            jenisKata: [],
            deskripsi: '',
          }

          // get jenis kata
          info.jenisKata = this.$(el)
            .find('font[color=red] span')
            .map((_, el) => this.$(el).attr('title'))
            .toArray()

          // get deskripsi
          this.$(el).find('font[color=red]').remove()
          info.deskripsi = this.$(el).text()

          if (info.deskripsi.includes('→')) {
            info.deskripsi.replace(/[0-9]/g, '')
          }

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
      prakategorial: this.prakategorial,
    }
  }
}
