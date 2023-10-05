import 'dotenv/config.js'

import fastify from 'fastify'
import { message } from 'telegraf/filters'

import { BOT_DOMAIN, message as msg, NODE_ENV, PORT } from './config/config.js'
import { callbackHandler } from './handlers/callback.handler.js'
import { invoiceHandler } from './handlers/invoice.handler.js'
import { saldoHandler } from './handlers/saldo.handler.js'
import { textHandler } from './handlers/text.handler.js'
import { topupHandler } from './handlers/topup.handler.js'
import { bot } from './lib/telegraf.js'
import { checkUserMiddleware } from './middlewares/user.middleware.js'
import { startCron } from './services/cron.service.js'

startCron()

const server = fastify()

server.get('/', () => 'Hello world')
server.post('/receive_callback', callbackHandler)

bot.start((ctx) => ctx.replyWithMarkdown(msg.start))
bot.help((ctx) => ctx.replyWithMarkdown(msg.help))

bot.use(checkUserMiddleware)
bot.command('saldo', saldoHandler)
bot.command('topup', topupHandler)
bot.action(/^topup:([A-z0-9]+)$/, invoiceHandler)
bot.on(message('text'), (ctx) => textHandler(ctx))

if (NODE_ENV === 'production' && BOT_DOMAIN !== undefined) {
  console.log('Bot is running in production')
  const webhook = await bot.createWebhook({ domain: BOT_DOMAIN })
  // @ts-expect-error fastify and telegraf webhook issue
  server.post(`/telegraf/${bot.secretPathComponent()}`, webhook)
  await server.listen({ port: PORT, host: '0.0.0.0' })
} else {
  console.log('Bot is running in development')
  await server.listen({ port: PORT })
  await bot.launch()
}
