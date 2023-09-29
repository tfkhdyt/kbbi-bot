import {
  addUser,
  findUserByID,
  updateUser,
} from '../repositories/user.repository'
import { MyContext } from '../types/context'

export const checkUserMiddleware = async (
  ctx: MyContext,
  next: () => Promise<void>,
) => {
  try {
    const user = ctx.from
    if (!user) {
      throw new Error('User ID atau Username anda tidak valid')
    }
    const { id, username, first_name: firstName, last_name: lastName } = user

    let userData = await findUserByID(id)
    if (userData.length === 0) {
      userData = await addUser({ id, username, firstName, lastName })
    } else {
      const {
        username: usernameDb,
        firstName: firstNameDb,
        lastName: lastNameDb,
      } = userData[0]

      if (
        usernameDb !== username ||
        firstNameDb !== firstName ||
        lastNameDb !== lastName
      ) {
        const updatedUser = await updateUser(id, {
          username,
          firstName,
          lastName,
        })
        if (updatedUser.length === 0) {
          throw new Error('Gagal untuk memperbarui akun')
        }
        userData = updatedUser
      }
    }

    ctx.user = userData[0]

    await next()
  } catch (error) {
    console.error(error)
    await ctx.reply(`Terjadi error yang tak terduga!, ${error}`)
  }
}
