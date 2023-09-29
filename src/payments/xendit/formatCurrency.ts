const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
})

export const formatCurrency = (nominal: number) => formatter.format(nominal)
