import { Telegraf } from 'telegraf'

import config from '../config/config.js'
import { MyContext } from '../types/context.js'

export const bot = new Telegraf<MyContext>(config.botToken)
