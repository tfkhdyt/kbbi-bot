import { MyContext } from '../types/context.js'

export const saldoHandler = async (ctx: MyContext) => {
  try {
    const { user } = ctx

    await ctx.reply(`Sisa saldo mu adalah: ${user.credits}`)
  } catch (error) {
    console.error(error)
    await ctx.reply(`Terjadi error yang tak terduga!, ${error}`)
  }
}
