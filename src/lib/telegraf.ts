import { Telegraf } from 'telegraf'

import config from '../config/config'
import { MyContext } from '../types/context'

export const bot = new Telegraf<MyContext>(config.botToken)
