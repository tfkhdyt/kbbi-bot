import { Telegraf } from 'telegraf'

import { BOT_TOKEN } from '../config/config.js'
import { MyContext } from '../types/context.js'

export const bot = new Telegraf<MyContext>(BOT_TOKEN)
