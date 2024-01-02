/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-csrf
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { createExportKey, extractImportKey } from '../src/internals/utils'

import { createToken } from '../src/internals/token'

/*****************************************************************************************************************/

const SECRET = 'secret'

/*****************************************************************************************************************/

suite('nitro-cors Internal Utils', () => {
  describe('createToken', () => {
    it('should be defined', () => {
      expect(createToken).toBeDefined()
    })

    it('should create a valid CSRF token', async () => {
      const jwt = await createExportKey()

      const ck = await extractImportKey({
        key: jwt
      })

      expect(ck).toBeDefined()
      expect(ck.type).toBe('secret')
      expect(ck.extractable).toBe(true)
      expect(ck.algorithm).toHaveProperty('name', 'AES-CBC')
      expect(ck.algorithm).toHaveProperty('length', 256)
      expect(ck.usages).toEqual(['encrypt', 'decrypt'])

      const token = await createToken({
        secret: SECRET,
        jwk: jwt
      })

      expect(token).toBeDefined()
      expect(token).toMatch(/^[A-Za-z0-9+/=]+::[A-Za-z0-9+/=]+$/)
    })
  })
})

/*****************************************************************************************************************/
