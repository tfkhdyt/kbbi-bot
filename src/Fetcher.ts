import config from './config/config.js'

// fetcher class
export class Fetcher {
  constructor(private keyword: string) { }

  async getData() {
    try {
      const response = await fetch(
        `http://api.scraperapi.com?api_key=${config.scraperAPIKey
        }&url=https://kbbi.kemdikbud.go.id/entri/${this.keyword
          .toLowerCase()
          .trim()}`,
      )
      const data = await response.text()
      return data
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message)
    }
  }
}
