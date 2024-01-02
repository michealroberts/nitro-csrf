/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-csrf
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { subtle, getRandomValues } from 'uncrypto'

import { defaultEncryptAlgorithm, extractImportKey } from './utils'

/*****************************************************************************************************************/

/**
 *
 * createToken - Create a token from a secret and a JSONWebKey.
 *
 * @returns {Promise<string>} - A token as a string, delimited by `::`.
 *
 */
export const createToken = async (params: { secret: string; jwk: JsonWebKey }): Promise<string> => {
  const { secret, jwk } = params

  // Get cryptographically strong random values:
  const iv = getRandomValues(new Uint8Array(16))

  // Create the AES-CBC import key:
  const ck = await extractImportKey({
    key: jwk,
    encryptAlgorithm: defaultEncryptAlgorithm
  })

  // Encrypt the secret using the AES-CBC algorithm:
  const encryptedSecret = await subtle.encrypt(
    { name: defaultEncryptAlgorithm.name, iv },
    ck,
    new TextEncoder().encode(secret)
  )

  // Convert the encrypted value to a Buffer:
  const encryptedBuffer = Buffer.from(new Uint8Array(encryptedSecret))

  // Return the token as a string, delimited by `::`:
  return `${Buffer.from(iv).toString('base64')}::${encryptedBuffer.toString('base64')}`
}

/*****************************************************************************************************************/
