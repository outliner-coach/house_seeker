import { onRequest } from 'firebase-functions/v2/https'

export const healthcheck = onRequest((request, response) => {
  response.json({
    ok: true,
    method: request.method,
    service: 'house-seeker-functions',
    timestamp: new Date().toISOString(),
  })
})
