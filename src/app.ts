// modules
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram'
import { Telegraf, Context, Markup } from 'telegraf'
import { isFuture, format } from 'date-fns'
import { id } from 'date-fns/locale'

// interfaces
import { CallbackQuery } from './interfaces/callback-query.interface'
import { IResult } from './interfaces/result.interface'

// etc
import { blackList } from './blacklist/blacklist'
import config from './config/config'

// classes
import { Fetcher } from './Fetcher'
import { Scraper } from './Scraper'

// App class
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

  private sendMessage<T>(ctx: Context, message: string, inlineKb?: T) {
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

  private fetchData(keyword: string) {
    const fetcher = new Fetcher(keyword)
    return fetcher.getData()
  }

  private async scrapeData(html: string) {
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

  private getResult() {
    return this.result
  }

  private createUrlButton(keyword: string) {
    return Markup.button.url(
      `📕 ${keyword.toLowerCase()}`,
      `https://kbbi.kemdikbud.go.id/entri/${keyword.toLowerCase()}`
    )
  }

  private createReportButton(keyword: string) {
    return Markup.button.callback(
      '🐞 Laporkan Bug',
      `bug_${keyword.toLowerCase()}`
    )
  }

  private createInlineKeyboard(
    reportBtn: InlineKeyboardButton.CallbackButton,
    urlBtn: InlineKeyboardButton.UrlButton
  ) {
    return Markup.inlineKeyboard([reportBtn, urlBtn])
  }

  checkBlackList(ctx: Context, next: () => Promise<void>) {
    const username = ctx.message?.from.username
    const result = blackList.find((value) => value.username === username)
    if (!result) {
      next()
    } else {
      if (isFuture(result.until)) {
        ctx.replyWithMarkdown(
          `*Anda telah dibanned dari bot ini!*
Alasan: ${result.reason}

Akses Anda akan dipulihkan pada: 
*${format(result.until, 'EEEE, d MMMM yyyy HH:mm', { locale: id })}*`
        )
      } else {
        next()
      }
    }
  }

  async main(ctx: Context, keyword: string) {
    const html = await this.fetchData(keyword)
    // console.log(html)
    await this.scrapeData(html)
    const result = this.getResult()
    // console.log(result)
    if (result.status === 404) {
      app.sendMessage(
        ctx,
        `*${keyword}* ${result.message}, coba masukkan kata lain`
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

      this.sendMessage(
        ctx,
        `${ejaan} ${
          result.data!.kataTidakBaku ? '\n' + result.data!.kataTidakBaku : ''
        }

${pengertian.join('\n\n')}`,
        this.createInlineKeyboard(
          this.createReportButton(keyword),
          this.createUrlButton(keyword)
        )
      )
    }
  }

  reportBug(ctx: Context) {
    const keyword = (ctx.callbackQuery as CallbackQuery).data.split('_')[1]
    const sender = ctx.callbackQuery?.from.username
    ctx.deleteMessage(ctx.callbackQuery?.message?.message_id)
    this.bot.telegram.sendMessage(
      config.adminId,
      `@${sender} mengirim laporan bug baru
Kata: \`${keyword}\``,
      { parse_mode: 'Markdown' }
    )
    ctx.replyWithMarkdown(
      `Laporan Anda mengenai kata *${keyword}* telah saya terima 😉`
    )
  }
}

// class instantiation
const app = new App(config.botToken)
const bot = app.bot

// middleware
bot.use(app.checkBlackList)

// event handler
bot.start((ctx) => app.sendStartMessage(ctx))

bot.help((ctx) => app.sendHelpMessage(ctx))

bot.on('text', (ctx) => {
  const keyword = ctx.message.text
  app.main(ctx, keyword)
})

bot.on('callback_query', (ctx) => app.reportBug(ctx))

// launcher
if (config.nodeEnv === 'development') {
  bot.launch().then(() => console.log('Bot is running in development'))
} else {
  bot.telegram.setWebhook(`${config.botDomain}/bot${config.botToken}`)
  bot
    .launch({
      webhook: {
        hookPath: `/bot${config.botToken}`,
        port: config.port,
      },
    })
    .then(() => console.log('Bot is running in production'))
  // bot.startWebhook(`/bot${botToken}`, null, port)
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
