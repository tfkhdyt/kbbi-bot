import config from '../../config/config'
import { User } from '../../db/postgres/schemas/user.schema'

export const createInvoice = async (amount: number, user: User) => {
  const netPrice = amount * 1000
  const adminFee = netPrice * 0.2
  const grossPrice = netPrice + adminFee

  const invoice = {
    external_id: `payment_${user.id}_${crypto.randomUUID()}`,
    amount: grossPrice,
    currency: 'IDR',
    customer: {
      given_names: user.firstName,
      surname: user.lastName,
    },
    items: [
      {
        name: 'Saldo KBBI Bot',
        quantity: amount,
        price: 1000,
      },
    ],
    fees: [
      {
        type: 'Biaya Admin',
        value: adminFee,
      },
    ],
  }

  const authToken = Buffer.from(config.xenditSecret + ':').toString('base64')

  const response = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authToken}`,
    },
    body: JSON.stringify(invoice),
  })
  const data = await response.json()
  if (!response.ok) {
    console.error(data.errors)
    throw new Error('Terjadi kesalahan saat membuat invoice')
  }

  return data.invoice_url as string
}
