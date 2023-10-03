import { Context } from 'telegraf'

import { User } from '../db/sqlite/schemas/user.schema.js'

export interface MyContext extends Context {
  user: User
}
