const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumSignificantDigits: 1,
})

export const formatCurrency = (nominal: number) => formatter.format(nominal)
