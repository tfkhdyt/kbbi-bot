import { Context, Telegraf } from 'telegraf'

import { Fetcher } from './Fetcher.js'
import { Scraper } from './Scraper.js'
import config from './config/config.js'
import { MyContext } from './interfaces/context.js'
import { IResult } from './interfaces/result.interface.js'
import { decreaseCredits } from './repositories/user.repository.js'

// App class
export default class App {
  bot: Telegraf<MyContext>
  nodeEnv = config.nodeEnv
  private result: IResult = {
    status: 0,
    message: '',
    data: null,
  }

  constructor(botToken: string) {
    this.bot = new Telegraf<MyContext>(botToken)
  }

  private async sendMessage<T>(ctx: Context, message: string, inlineKb?: T) {
    const messageId = ctx.message!.message_id
    if (typeof inlineKb !== 'undefined')
      await ctx.replyWithMarkdown(message.trim(), {
        reply_to_message_id: messageId,
        ...inlineKb,
      })
    else
      await ctx.replyWithMarkdown(message.trim(), {
        reply_to_message_id: messageId,
      })
  }

  async sendStartMessage(ctx: Context) {
    await this.sendMessage(ctx, config.message.start)
  }

  async sendHelpMessage(ctx: Context) {
    await this.sendMessage(ctx, config.message.help)
  }

  private async fetchData(keyword: string) {
    const fetcher = new Fetcher(keyword)
    return await fetcher.getData()
  }

  private async scrapeData(html: string) {
    try {
      const scraper = new Scraper(html)
      const result = await scraper.getData()
      if (!result) {
        this.result = {
          status: 404,
          message: 'tidak ditemukan',
          data: null,
        }
        return
      }
      this.result = {
        status: 200,
        message: 'scrape data sukses',
        data: result,
      }
    } catch (error) {
      console.error(error)
      this.result = {
        status: 404,
        message: 'tidak ditemukan',
        data: null,
      }
    }
  }

  private getResult() {
    return this.result
  }

  // private createUrlButton(keyword: string) {
  //   return Markup.button.url(
  //     `📕 ${keyword.toLowerCase()}`,
  //     `https://kbbi.kemdikbud.go.id/entri/${keyword.toLowerCase()}`,
  //   )
  // }

  // private createReportButton(keyword: string) {
  //   return Markup.button.callback(
  //     '🐞 Laporkan Bug',
  //     `bug_${keyword.toLowerCase()}`,
  //   )
  // }

  // private createInlineKeyboard(
  //   // reportBtn: InlineKeyboardButton.CallbackButton,
  //   urlBtn: InlineKeyboardButton.UrlButton,
  // ) {
  //   return Markup.inlineKeyboard([/* reportBtn, */ urlBtn])
  // }

  //   checkBlackList(ctx: Context, next: () => Promise<void>) {
  //     const username = ctx.message?.from.username
  //     const result = blackList.find((value) => value.username === username)
  //     if (!result) {
  //       next()
  //     } else {
  //       if (isFuture(result.until)) {
  //         ctx.replyWithMarkdown(
  //           `*Anda telah dibanned dari bot ini!*
  // Alasan: ${result.reason}
  //
  // Akses Anda akan dipulihkan pada:
  // *${format(result.until, 'EEEE, d MMMM yyyy HH:mm', { locale: id })}*`,
  //         )
  //       } else {
  //         next()
  //       }
  //     }
  //   }

  async main(ctx: MyContext, keyword: string) {
    const html = await this.fetchData(keyword)
    if (html === undefined) {
      return await this.sendMessage(
        ctx,
        `Terjadi kesalahan yang tidak terduga, silakan coba lagi`,
      )
    }

    await this.scrapeData(html)
    const result = this.getResult()

    if (result.status === 404) {
      return await this.sendMessage(
        ctx,
        `*${keyword}* ${result.message}, coba masukkan kata lain`,
      )
    }

    const ejaan = `*${result.data!.ejaan.join(' ').toLowerCase()}*`
    const pengertian = result.data!.pengertian.map((value, index) => {
      return `${index + 1}. ${
        value.jenisKata.length !== 0
          ? '_' + value.jenisKata.join(', ') + '_\n'
          : ''
      }\`${value.deskripsi}\``
    })

    await this.sendMessage(
      ctx,
      `${ejaan} ${
        result.data!.kataTidakBaku ? '\n' + result.data!.kataTidakBaku : ''
      }

${pengertian.join('\n\n')}${
        result.data!.prakategorial
          ? `. _Prakategorial:_ ${result
              .data!.prakategorial.split(', ')
              .map((text) => `\`${text}\``)
              .join(', ')}`
          : ''
      }
`,
      // this.createInlineKeyboard(
      //   // this.createReportButton(keyword),
      //   this.createUrlButton(keyword),
      // ),
    )

    await decreaseCredits(ctx.user.id)
  }

  //   reportBug(ctx: Context) {
  //     const keyword = (ctx.callbackQuery as CallbackQuery).data.split('_')[1]
  //     const sender = ctx.callbackQuery?.from.username

  //     ctx.deleteMessage(ctx.callbackQuery?.message?.message_id)
  //     this.bot.telegram.sendMessage(
  //       config.adminId,
  //       `@${sender} mengirim laporan bug baru
  // Kata: \`${keyword}\``,
  //       { parse_mode: 'Markdown' },
  //     )
  //     ctx.replyWithMarkdown(
  //       `Laporan Anda mengenai kata *${keyword}* telah saya terima 😉`,
  //     )
  //   }
}
