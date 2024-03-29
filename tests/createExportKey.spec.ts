/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-csrf
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { createExportKey } from '../src/internals/utils'

/*****************************************************************************************************************/

suite('nitro-cors Internal Utils', () => {
  describe('createExportKey', () => {
    it('should be defined', () => {
      expect(createExportKey).toBeDefined()
    })

    it('should create an export key', async () => {
      const jwt = await createExportKey()
      expect(jwt).toBeDefined()
      expect(jwt).toHaveProperty('kty', 'oct')
      expect(jwt).toHaveProperty('k')
      expect(jwt).toHaveProperty('alg', 'A256CBC')
      expect(jwt).toHaveProperty('ext', true)
      expect(jwt).toHaveProperty('key_ops', ['encrypt', 'decrypt'])
    })
  })
})

/*****************************************************************************************************************/
