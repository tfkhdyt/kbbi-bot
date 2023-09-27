import { MyContext } from '../interfaces/context'
import { addUser, findUserByID } from '../user.repository'

export const checkUserMiddleware = async (
  ctx: MyContext,
  next: () => Promise<void>,
) => {
  try {
    const userId = ctx.from?.id
    const username = ctx.from?.username
    if (!userId || !username)
      throw new Error('User ID atau Username anda tidak valid')

    const user = await findUserByID(userId)
    if (user.length === 0) {
      await addUser({ id: userId, username })
    }

    ctx.user = user[0]

    await next()
  } catch (error) {
    console.error(error)
    ctx.reply(`Terjadi error yang tak terduga!, ${error}`)
  }
}
