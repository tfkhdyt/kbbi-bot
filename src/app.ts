import { Telegraf, Context } from 'telegraf'
import 'dotenv/config'

import { Fetcher } from './Fetcher'
import { Scraper } from './Scraper'
import config from './config'
import { IResult } from './interfaces/result.interface'

// const botToken = process.env.BOT_TOKEN as string

class App {
  bot: Telegraf
  private result: IResult = {
    status: 0,
    message: '',
    data: null,
  }

  constructor(botToken: string) {
    this.bot = new Telegraf(botToken)
  }

  sendMessage(ctx: Context, message: string) {
    ctx.replyWithMarkdown(message)
  }

  sendStartMessage(ctx: Context) {
    this.sendMessage(ctx, config.message.start)
  }

  sendHelpMessage(ctx: Context) {
    this.sendMessage(ctx, config.message.help)
  }

  fetchData(keyword: string) {
    const fetcher = new Fetcher(keyword)
    return fetcher.getData()
  }

  async scrapeData(html: string) {
    const scraper = new Scraper(html)
    const result = await scraper
      .getData()
      .catch((err) => console.error(err.message))
    if (!result) {
      return (this.result = {
        status: 404,
        message: 'tidak ditemukan',
        data: null,
      })
    }
    this.result = {
      status: 200,
      message: 'scrape data sukses',
      data: result,
    }
  }

  getResult() {
    return this.result
  }
}

const app = new App(config.botToken)
const bot = app.bot

bot.start((ctx) => app.sendStartMessage(ctx))

bot.help((ctx) => app.sendHelpMessage(ctx))

bot.on('text', async (ctx) => {
  const html = await app.fetchData(ctx.message.text)
  console.log(html)
  await app.scrapeData(html)
  const result = app.getResult()
  console.log(result)
  if (result.status === 404) {
    app.sendMessage(ctx, `*${ctx.message.text}* ${result.message}`)
  } else {
    const ejaan = `*${result.data!.ejaan.join(' ')}*`
    const pengertian = result.data!.pengertian.map((value, index) => {
      return `${index + 1}. _${value.jenisKata.join(', ')}_
\`${value.deskripsi}\``
    })

    app.sendMessage(
      ctx,
      `
${ejaan}

${pengertian.join('\n\n')}`
    )
  }
})

bot.launch().then(() => console.log('Bot is running'))
