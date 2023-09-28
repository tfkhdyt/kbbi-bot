export type PaymentBody = {
  status: string
  id: string
  external_id: string
  items: [
    {
      quantity: number
    },
  ]
  payment_channel: string
}
