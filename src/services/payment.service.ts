import { CreateInvoiceRequest, Invoice } from 'xendit-node/invoice/models'

import { User } from '../db/postgres/schemas/user.schema'
import { xenditClient } from '../lib/xendit'

export const calculatePrice = (amount: number) => {
  const net = amount * 1000
  const adminFee = net * 0.2
  const gross = net + adminFee

  return { net, adminFee, gross }
}

export const createInvoice = async (amount: number, user: User) => {
  const price = calculatePrice(amount)

  const invoice: CreateInvoiceRequest = {
    externalId: `topup_${user.id}_${crypto.randomUUID()}`,
    amount: price.gross,
    currency: 'IDR',
    customer: {
      givenNames: user.firstName,
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
        value: price.adminFee,
      },
    ],
  }

  const response: Invoice = await xenditClient.Invoice.createInvoice({
    data: invoice,
  })

  return response.invoiceUrl

  // const authToken = Buffer.from(config.xenditSecret + ':').toString('base64')
  //
  // const response = await fetch('https://api.xendit.co/v2/invoices', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Basic ${authToken}`,
  //   },
  //   body: JSON.stringify(invoice),
  // })
  // const data = await response.json()
  // if (!response.ok) {
  //   console.error(data.errors)
  //   throw new Error('Terjadi kesalahan saat membuat invoice')
  // }
  //
  // return data.invoice_url as string
}

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
})

export const formatCurrency = (value: number) => formatter.format(value)
