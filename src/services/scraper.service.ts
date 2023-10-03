import { CheerioAPI, load } from 'cheerio'

import { Pengertian } from '../types/scraper.js'

const fetchHTML = async (keyword: string) => {
  try {
    // const response = await fetch(
    //   `http://api.scraperapi.com?api_key=${config.scraperAPIKey
    //   }&url=https://kbbi.kemdikbud.go.id/entri/${this.keyword
    //     .toLowerCase()
    //     .trim()}`,
    // )
    const response = await fetch(
      `https://kbbi.kemdikbud.go.id/entri/${keyword.toLowerCase().trim()}`,
    )
    const data = await response.text()
    if (!response.ok) {
      throw new Error('Gagal untuk mengakses halaman KBBI')
    }
    return data
  } catch (err) {
    console.error(err)
    if (err instanceof Error) throw err
  }
}

const checkNotFound = ($: CheerioAPI) => {
  const notFound = $('h4').text()
  if (notFound.includes('Entri tidak ditemukan'))
    throw new Error('Kata tidak ditemukan')
}

const scrapeData = (html: string | undefined) => {
  if (html === undefined) {
    throw new Error('Kata tidak ditemukan')
  }
  const $ = load(html)
  checkNotFound($)

  const prakategorial = $(
    'font[title="prakategorial: kata tidak dipakai dalam bentuk dasarnya"]',
  )
    .next()
    .text()
  let kataTidakBaku: string | undefined = undefined
  let ejaan: string[] = []
  const pengertian: Pengertian[] = []

  $('h2').each((_, element) => {
    const hasil = $(element)

    // get kata baku
    kataTidakBaku = hasil.find('small').text().replace(/[0-9]/g, '')

    // get ejaan
    hasil.find('small').remove()
    ejaan = hasil
      .text()
      .split(' ')
      .filter(Boolean)
      .map((value) => value.replace(/[0-9]/g, ''))

    // get pengertian
    hasil
      .siblings('ul.adjusted-par,ol')
      .children()
      .each((_, el) => {
        const info: Pengertian = {
          jenisKata: [],
          deskripsi: '',
        }

        // get jenis kata
        info.jenisKata = $(el)
          .find('font[color=red] span')
          .map((_, el) => $(el).attr('title'))
          .toArray()

        // get deskripsi
        $(el).find('font[color=red]').remove()
        info.deskripsi = $(el).text()

        if (info.deskripsi.includes('→')) {
          info.deskripsi.replace(/[0-9]/g, '')
        }

        // prevent duplicate deskripsi
        if (pengertian.find((value) => value.deskripsi === info.deskripsi))
          return

        // push variable info into property pengertian
        pengertian.push(info)
      })
  })
  return {
    ejaan: `*${ejaan.join(' ').toLowerCase()}*`,
    kataTidakBaku,
    pengertian: pengertian.map((value, index) => {
      return `${index + 1}. ${
        value.jenisKata.length !== 0
          ? '_' + value.jenisKata.join(', ') + '_\n'
          : ''
      }\`${value.deskripsi}\``
    }),
    prakategorial,
  }
}

export const findWordDefinition = async (keyword: string) => {
  const html = await fetchHTML(keyword)
  const { ejaan, kataTidakBaku, pengertian, prakategorial } = scrapeData(html)
  const result = `${ejaan} ${kataTidakBaku ? '\n' + kataTidakBaku : ''}

${pengertian.join('\n\n')}${
    prakategorial
      ? `. _Prakategorial:_ ${prakategorial
          .split(', ')
          .map((text) => `\`${text}\``)
          .join(', ')}`
      : ''
  }
`
  return result
}
