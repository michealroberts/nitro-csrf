/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-csrf
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { subtle } from 'uncrypto'

import { describe, expect, it, suite } from 'vitest'

import { createExportKey, defaultEncryptAlgorithm } from '../src/internals/utils'

import { createToken, verifyToken } from '../src/internals/token'

/*****************************************************************************************************************/

const SECRET = 'secret'

/*****************************************************************************************************************/

suite('nitro-cors Internal Utils', () => {
  describe('verifyToken', () => {
    it('should be defined', () => {
      expect(verifyToken).toBeDefined()
    })

    it('should verify a valid CSRF token', async () => {
      const jwt = await createExportKey()

      const rawKey = Buffer.from(jwt.k, 'base64')

      const ck = await subtle.importKey('raw', rawKey, defaultEncryptAlgorithm, true, [
        'encrypt',
        'decrypt'
      ])

      const token = await createToken({
        secret: SECRET,
        jwk: jwt
      })

      const isValid = await verifyToken({
        secret: SECRET,
        ck,
        token
      })

      expect(isValid).toBe(true)
    })

    it('should not verify an invalid CSRF token', async () => {
      const isValid = await verifyToken({
        secret: SECRET,
        ck: null,
        token: '==::=='
      })

      expect(isValid).toBe(false)
    })
  })
})

/*****************************************************************************************************************/
