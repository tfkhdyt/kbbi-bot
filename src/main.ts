import fastify from 'fastify'
import { message } from 'telegraf/filters'

import config from './config/config.js'
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

bot.start((ctx) => ctx.replyWithMarkdown(config.message.start))
bot.help((ctx) => ctx.replyWithMarkdown(config.message.help))

bot.use(checkUserMiddleware)
bot.command('saldo', saldoHandler)
bot.command('topup', topupHandler)
bot.action(/^topup:([A-z0-9]+)$/, invoiceHandler)
bot.on(message('text'), (ctx) => textHandler(ctx))

if (config.nodeEnv === 'production') {
  console.log('Bot is running in production')
  const webhook = await bot.createWebhook({ domain: config.botDomain })
  // @ts-ignore
  server.post(`/telegraf/${bot.secretPathComponent()}`, webhook)
  await server.listen({ port: config.port })
} else {
  console.log('Bot is running in development')
  await server.listen({ port: Number(config.port) })
  await bot.launch()
}
