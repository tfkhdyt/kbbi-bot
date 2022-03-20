export default {
  message: {
    start: `Selamat datang di bot *KBBI*

Dengan bot ini kalian dapat mencari pengertian dari suatu kata dalam KBBI, kalian hanya tinggal mengirim sebuah kata kepada bot ini maka bot ini akan mengirim pengertian dari kata tersebut.

Data dari bot ini diambil dari situs resmi KBBI (https://kbbi.kemdikbud.go.id/) melalui metode _Web Scraping_ dengan *Node.js*

Bot ini dibuat menggunakan *TypeScript*, *Node.js*, *Telegraf*, *Axios*, dan *Cheerio*

Bot ini bersifat _open source_ dengan lisensi *GPL-3.0*, kalian dapat melihat source code dari bot ini pada link [berikut](https://github.com), `,
    help: `Untuk menggunakan bot ini, kalian hanya perlu mengirimkan kata yang ingin kalian cari kepada bot ini

Jika ada pertanyaan lebih lanjut, silakan tanya langsung kepada saya @tfkhdyt`,
  },
  botToken: process.env.BOT_TOKEN as string,
}
