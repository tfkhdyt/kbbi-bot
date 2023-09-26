export default {
  botDomain: process.env.BOT_DOMAIN as string,
  port: (process.env.PORT || 8080) as number,
  botToken: process.env.BOT_TOKEN as string,
  nodeEnv: process.env.NODE_ENV as string,
  adminId: process.env.ADMIN_ID as string,
  scraperAPIKey: process.env.SCRAPER_API_KEY as string,
  message: {
    start: `Selamat datang di bot *KBBI*

Dengan bot ini kalian dapat mencari pengertian dari suatu kata dalam KBBI. Kalian hanya perlu mengirim sebuah kata kepada bot ini, maka bot ini akan mengirim definisi dari kata Tersebut.

Data dari bot ini diambil dari situs resmi KBBI melalui metode _Web Scraping_ dengan *Bun.js*, *Telegraf*, dan *Cheerio*.

Untuk pertanyaan lebih lanjut, silakan hubungi @tfkhdyt.`,
    help: 'Untuk menggunakan bot ini, kalian hanya perlu mengirimkan kata yang ingin kalian cari kepada bot ini.\nUntuk pertanyaan lebih lanjut, silakan hubungi @tfkhdyt.',
  },
}
