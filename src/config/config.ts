import { parseEnv, port, z } from 'znv'

export const {
  BOT_DOMAIN,
  PORT,
  BOT_TOKEN,
  NODE_ENV,
  ADMIN_ID,
  DATABASE_URL,
  DATABASE_AUTH_TOKEN,
  MIDTRANS_SERVER_KEY,
  MIDTRANS_CLIENT_KEY,
} = parseEnv(process.env, {
  BOT_DOMAIN: z.string().url().optional(),
  PORT: port().default(3000),
  BOT_TOKEN: z.string().min(1),
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  ADMIN_ID: z.number().int().positive(),
  DATABASE_URL: z.string().min(1),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  MIDTRANS_SERVER_KEY: z.string().min(1),
  MIDTRANS_CLIENT_KEY: z.string().min(1),
})

export const message = {
  start: `Selamat datang di bot *KBBI*

  Dengan bot ini kalian dapat mencari pengertian dari suatu kata dalam KBBI. Kalian hanya perlu mengirim sebuah kata kepada bot ini, maka bot ini akan mengirim definisi dari kata Tersebut.
  
  Data dari bot ini diambil dari situs resmi KBBI melalui metode _Web Scraping_ dengan *Node.js*, *Telegraf*, dan *Cheerio*.
  
  Untuk pertanyaan lebih lanjut, silakan hubungi @tfkhdyt.`,
  help: 'Untuk menggunakan bot ini, kalian hanya perlu mengirimkan kata yang ingin kalian cari kepada bot ini.\nUntuk pertanyaan lebih lanjut, silakan hubungi @tfkhdyt.',
}
