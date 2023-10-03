import { Markup } from 'telegraf'

import { calculatePrice, formatCurrency } from '../services/payment.service.js'
import { MyContext } from '../types/context.js'

const createNominalButton = (amount: number) => {
  const price = calculatePrice(amount).gross
  const formattedPrice = formatCurrency(price)

  return Markup.button.callback(
    `${amount} (${formattedPrice})`,
    `topup:${amount}`,
  )
}

export const topupHandler = async (ctx: MyContext) => {
  try {
    const nominalTopup = Markup.inlineKeyboard([
      [createNominalButton(5), createNominalButton(10)],
      [createNominalButton(15), createNominalButton(20)],
      [createNominalButton(25), createNominalButton(50)],
    ])

    await ctx.reply('Silakan pilih nominal topup anda', nominalTopup)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) await ctx.reply(error.message)
  }
}
