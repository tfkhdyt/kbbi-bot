// module
import axios from 'axios'

// fetcher class
export class Fetcher {
  constructor(private keyword: string) {}

  async getData() {
    try {
      const { data } = await axios.get(
        'https://kbbi.kemdikbud.go.id/entri/' +
          this.keyword.toLowerCase().trim()
      )
      return data
    } catch (err) {
      if (axios.isAxiosError(err)) throw new Error(err.message)
    }
  }
}
