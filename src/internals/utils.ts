/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-csrf
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { subtle } from 'uncrypto'

/*****************************************************************************************************************/

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-cbc
export const defaultEncryptAlgorithm = {
  name: 'AES-CBC',
  length: 256
} as const satisfies AesKeyAlgorithm

/*****************************************************************************************************************/

/**
 *
 * createExportKey
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey
 *
 */
export const createExportKey = async (params?: {
  encryptAlgorithm?: AesKeyAlgorithm
}): Promise<JsonWebKey> => {
  const { encryptAlgorithm = defaultEncryptAlgorithm } = params || {}
  // Generate a key that can be used with AES-CBC, for symmetric encryption and decryption.
  const key = await subtle.generateKey(encryptAlgorithm, true, ['encrypt', 'decrypt'])
  // Provide the key in extractable, JWK format:
  return await subtle.exportKey('jwk', key)
}

/*****************************************************************************************************************/

/**
 *
 * extractImportKey
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
 *
 */
export const extractImportKey = (params: {
  key: JsonWebKey
  encryptAlgorithm?: AesKeyAlgorithm
}): Promise<CryptoKey> => {
  const { key, encryptAlgorithm = defaultEncryptAlgorithm } = params
  // Provide the key in extractable, JWK format:
  return subtle.importKey('jwk', key, encryptAlgorithm, true, ['encrypt', 'decrypt'])
}

/*****************************************************************************************************************/
