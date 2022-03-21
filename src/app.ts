import { Telegraf, Context, Markup } from 'telegraf'
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram'
import 'dotenv/config'

import { Fetcher } from './Fetcher'
import { Scraper } from './Scraper'
import config from './config'
import { IResult } from './interfaces/result.interface'
import { CallbackQuery } from './interfaces/callback-query.interface'

// const botToken = process.env.BOT_TOKEN as string

class App {
  bot: Telegraf
  nodeEnv = process.env.NODE_ENV
  private result: IResult = {
    status: 0,
    message: '',
    data: null,
  }

  constructor(botToken: string) {
    this.bot = new Telegraf(botToken)
  }

  sendMessage<T>(ctx: Context, message: string, inlineKb?: T) {
    const messageId = ctx.message!.message_id
    if (typeof inlineKb !== 'undefined')
      ctx.replyWithMarkdown(message, {
        reply_to_message_id: messageId,
        ...inlineKb,
      })
    else ctx.replyWithMarkdown(message, { reply_to_message_id: messageId })
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

  createUrlButton(keyword: string) {
    return Markup.button.url(
      `📕 ${keyword.toLowerCase()}`,
      `https://kbbi.kemdikbud.go.id/entri/${keyword.toLowerCase()}`
    )
  }

  createReportButton(keyword: string) {
    return Markup.button.callback(
      '🐞 Laporkan Bug',
      `bug_${keyword.toLowerCase()}`
    )
  }

  createInlineKeyboard(
    reportBtn: InlineKeyboardButton.CallbackButton,
    urlBtn: InlineKeyboardButton.UrlButton
  ) {
    return Markup.inlineKeyboard([reportBtn, urlBtn])
  }
}

const app = new App(config.botToken)
const bot = app.bot

bot.start((ctx) => app.sendStartMessage(ctx))

bot.help((ctx) => app.sendHelpMessage(ctx))

bot.on('text', async (ctx) => {
  const keyword = ctx.message.text
  const html = await app.fetchData(keyword)
  // console.log(html)
  await app.scrapeData(html)
  const result = app.getResult()
  // console.log(result)
  if (result.status === 404) {
    app.sendMessage(
      ctx,
      `*${ctx.message.text}* ${result.message}, coba masukkan kata lain`
    )
  } else {
    const ejaan = `*${result.data!.ejaan.join(' ').toLowerCase()}*`
    const pengertian = result.data!.pengertian.map((value, index) => {
      // console.log(value)
      return `${index + 1}. ${
        value.jenisKata.length !== 0
          ? '_' + value.jenisKata.join(', ') + '_\n'
          : ''
      }\`${value.deskripsi}\``
    })

    app.sendMessage(
      ctx,
      `${ejaan} ${
        result.data!.kataTidakBaku ? '\n' + result.data!.kataTidakBaku : ''
      }

${pengertian.join('\n\n')}`,
      app.createInlineKeyboard(
        app.createReportButton(keyword),
        app.createUrlButton(keyword)
      )
    )
  }
})

bot.on('callback_query', (ctx) => {
  const keyword = (ctx.callbackQuery as CallbackQuery).data.split('_')[1]
  bot.telegram.sendMessage(
    process.env.ADMIN_ID as string,
    `Terdapat 1 laporan baru
Kata: \`${keyword}\``,
    { parse_mode: 'Markdown' }
  )
  ctx.replyWithMarkdown(
    `Laporan Anda mengenai kata *${keyword}* telah kami terima 😉`
  )
})

bot.launch().then(() => console.log('Bot is running'))
