import { MyContext } from '../interfaces/context'

export const saldoHandler = async (ctx: MyContext) => {
  try {
    const user = ctx.user

    ctx.reply(`Jumlah saldo mu adalah: ${user.credits}`)
  } catch (error) {
    console.error(error)
    ctx.reply(`Terjadi error yang tak terduga!, ${error}`)
  }
}
