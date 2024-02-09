/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-csrf
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { type H3Event, getCookie, getHeader, H3Error, sendError } from 'h3'

import { verifyToken } from './internals/token'

import { getExportKeyFromRaw } from './internals/utils'

import { type H3CsrfOptions } from './types'

/*****************************************************************************************************************/

export const useCSRF = async (event: H3Event, options: H3CsrfOptions) => {
  const { secret } = options

  // If the secret is not valid, return a "CSRF_SECRET_NOT_VALID" error:
  if (!secret || secret.length === 0) {
    return sendError(
      event,
      new H3Error('CSRF secret not valid.', {
        cause: 'CSRF_SECRET_NOT_VALID'
      })
    )
  }

  // Get the token from the cookie or header:
  const token = getCookie(event, 'csrftoken') || getHeader(event, 'x-csrftoken')

  if (!token) {
    return sendError(
      event,
      new H3Error('CSRF token not found.', {
        cause: 'CSRF_TOKEN_NOT_FOUND'
      })
    )
  }

  // Get the key from the cookie or header:
  const key = getCookie(event, 'csrfkey') || getHeader(event, 'x-csrfkey')

  if (!key) {
    return sendError(
      event,
      new H3Error('CSRF key not found.', {
        cause: 'CSRF_KEY_NOT_FOUND'
      })
    )
  }

  let ck: CryptoKey

  // Attempt to get the export key from the raw key:
  try {
    ck = await getExportKeyFromRaw({
      key
    })
  } catch {
    return sendError(
      event,
      new H3Error('CSRF key not valid.', {
        cause: 'CSRF_KEY_NOT_VALID'
      })
    )
  }

  // Attempt to verify the token:
  const isValid = await verifyToken({
    secret,
    ck,
    token
  })

  // If the token is not valid, return a "CSRF_TOKEN_NOT_VALID" error:
  if (!isValid) {
    return sendError(
      event,
      new H3Error('CSRF token not valid.', {
        cause: 'CSRF_TOKEN_NOT_VALID'
      })
    )
  }
}

/*****************************************************************************************************************/
