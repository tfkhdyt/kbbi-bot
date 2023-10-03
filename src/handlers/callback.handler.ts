import { FastifyReply, FastifyRequest } from 'fastify'

import { bot } from '../lib/telegraf.js'
import { increaseCredits } from '../repositories/user.repository.js'
import { PaymentBody } from '../types/paymentBody.js'

export const callbackHandler = async (
  req: FastifyRequest<{ Body: PaymentBody }>,
  reply: FastifyReply,
) => {
  try {
    const { body } = req
    if (body.status !== 'PAID') {
      return reply.status(400).send('Status should be PAID')
    }

    const userId = Number(body.external_id.split('_')[1])
    const amount = body.items[0].quantity
    const paymentChannel = body.payment_channel

    await increaseCredits(userId, amount)
    await bot.telegram.sendMessage(
      userId,
      `Topup sejumlah ${amount} saldo melalui ${paymentChannel} telah berhasil! Terima kasih telah menggunakan layanan kami`,
    )

    reply.status(200).send('Transaction success!')
  } catch (error) {
    console.error(error)
  }
}
