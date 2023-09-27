import { NarrowedContext } from 'telegraf'
import { Message, Update } from 'telegraf/typings/core/types/typegram'
import { MyContext } from '../interfaces/context'

export const textHandler = async (
  ctx: NarrowedContext<
    MyContext,
    Update.MessageUpdate<Record<'text', unknown> & Message.TextMessage>
  >,
) => {
  try {
    if (ctx.user.credits === 0) {
      return ctx.reply(
        'Maaf, saldo anda tidak cukup, silakan isi ulang atau tunggu besok hari',
      )
    }

    const keyword = ctx.message.text
    await app.main(ctx, keyword)
  } catch (error) {
    console.error(error)
  }
}
