import { DateTime } from 'luxon';

export const Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

export const tickets = []

export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'ARS',
    currencyDisplay: 'narrowSymbol',
  }).format(price);
}

export function formatToBuenosAires(input) {
  const dt = typeof input === 'string'
      ? DateTime.fromISO(input, { zone: 'utc' })
      : DateTime.fromJSDate(input, { zone: 'utc' });

  const dtBA = dt.setZone('America/Argentina/Buenos_Aires');
  return dtBA.toFormat('dd/LL/yyyy HH:mm');
}
