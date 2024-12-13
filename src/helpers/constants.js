export const Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT'
}

export const tickets = []

export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'ARS',
    currencyDisplay: 'narrowSymbol',
  }).format(price);
}