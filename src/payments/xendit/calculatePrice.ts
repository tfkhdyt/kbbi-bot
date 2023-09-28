export const calculatePrice = (amount: number) => {
  const net = amount * 1000
  const adminFee = net * 0.2
  const gross = net + adminFee

  return { net, adminFee, gross }
}
