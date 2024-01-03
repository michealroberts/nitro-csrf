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

/**
 *
 * verifyToken - Verify a token from a secret and a JSONWebKey.
 *
 * @returns {Promise<boolean>} - A boolean indicating whether the token is valid.
 *
 */
export const verifyToken = async (params: {
  secret: string
  ck: CryptoKey
  token: string
}): Promise<boolean> => {
  const { secret, token, ck } = params

  // Split the token into the IV and encrypted secret values:
  const [iv, encrypted] = token.split('::')

  // If either value is missing, return false:
  if (!iv || !encrypted) {
    return false
  }

  let decrypted: string | undefined

  try {
    // Decrypt the secret using the AES-CBC algorithm:
    const encodedDecrypted = await subtle.decrypt(
      {
        name: defaultEncryptAlgorithm.name,
        iv: Buffer.from(iv, 'base64')
      },
      ck,
      Buffer.from(encrypted, 'base64')
    )

    // Convert the decrypted value to a string:
    decrypted = new TextDecoder().decode(encodedDecrypted)
  } catch {
    return false
  }

  // Return true if the decrypted value matches the secret:
  return decrypted === secret
}

/*****************************************************************************************************************/
