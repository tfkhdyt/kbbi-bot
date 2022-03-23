import 'dotenv/config'

export default {
  message: {
    start: `Selamat datang di bot *KBBI*

Dengan bot ini kalian dapat mencari pengertian dari suatu kata dalam KBBI, kalian hanya tinggal mengirim sebuah kata kepada bot ini maka bot ini akan mengirim pengertian dari kata tersebut.

Data dari bot ini diambil dari situs resmi KBBI (https://kbbi.kemdikbud.go.id/) melalui metode _Web Scraping_ dengan *Node.js*

Bot ini dibuat menggunakan *TypeScript*, *Node.js*, *Telegraf*, *Axios*, dan *Cheerio*

Bot ini bersifat _open source_ dengan lisensi *GPL-3.0*, kalian dapat melihat source code dari bot ini pada link [berikut](https://github.com/tfkhdyt/kbbi-bot)`,
    help: `Untuk menggunakan bot ini, kalian hanya perlu mengirimkan kata yang ingin kalian cari kepada bot ini

Jika ada pertanyaan lebih lanjut, silakan tanya langsung kepada saya @tfkhdyt`,
  },
  botDomain: process.env.BOT_DOMAIN as string,
  port: (process.env.PORT || 8080) as number,
  botToken: process.env.BOT_TOKEN as string,
  nodeEnv: process.env.NODE_ENV as string,
  adminId: process.env.ADMIN_ID as string,
}
