import { Context, Markup } from 'telegraf'
import { CallbackQuery, Update } from 'telegraf/types'

import {
  calculatePrice,
  createInvoice,
  formatCurrency,
} from '../services/payment.service.js'
import { MyContext } from '../types/context.js'

export const invoiceHandler = async (
  ctx: Context<Update.CallbackQueryUpdate<CallbackQuery>> &
    MyContext & {
      match: RegExpExecArray
    },
) => {
  try {
    await ctx.deleteMessage(ctx.update.callback_query.message?.message_id)

    const nominal = Number(ctx.match[1])
    const invoiceUrl = await createInvoice(nominal, ctx.user)
    const price = calculatePrice(nominal).gross
    const formattedPrice = formatCurrency(price)
    const keyboard = Markup.inlineKeyboard([
      Markup.button.url(`💵 Midtrans Payment (${formattedPrice})`, invoiceUrl),
    ])

    await ctx.reply(
      'Silakan lanjutkan pembayaran dengan menekan tombol di bawah ini',
      keyboard,
    )
  } catch (error) {
    console.error(error)
    if (error instanceof Error) await ctx.reply(error.message)
  }
}
