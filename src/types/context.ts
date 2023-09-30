import { Context } from 'telegraf'

import { User } from '../db/sqlite/schemas/user.schema'

export interface MyContext extends Context {
  user: User
}
