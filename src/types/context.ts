import { Context } from 'telegraf'

import { User } from '../db/postgres/schemas/user.schema'

export interface MyContext extends Context {
  user: User
}
