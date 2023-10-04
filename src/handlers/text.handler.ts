import { NarrowedContext } from 'telegraf'
import { Message, Update } from 'telegraf/types'

import { decreaseCredits } from '../repositories/user.repository.js'
import { findWordDefinition } from '../services/scraper.service.js'
import { MyContext } from '../types/context.js'

export const textHandler = async (
  ctx: NarrowedContext<
    MyContext,
    Update.MessageUpdate<Record<'text', unknown> & Message.TextMessage>
  >,
) => {
  try {
    if (ctx.user.credits === 0) {
      return ctx.reply(
        'Maaf, saldo anda tidak mencukupi, silakan isi ulang atau tunggu esok hari. Saldo gratis harian akan di-reset setiap jam 00:00',
      )
    }

    const keyword = ctx.message.text
    const result = await findWordDefinition(keyword)

    await decreaseCredits(ctx.user.id)
    await ctx.replyWithMarkdown(result)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) ctx.reply(error.message)
  }
}
