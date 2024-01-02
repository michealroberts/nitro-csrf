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
      const key = await createExportKey()
      expect(key).toBeDefined()
      expect(key).toHaveProperty('kty', 'oct')
      expect(key).toHaveProperty('k')
      expect(key).toHaveProperty('alg', 'A256CBC')
      expect(key).toHaveProperty('ext', true)
      expect(key).toHaveProperty('key_ops', ['encrypt', 'decrypt'])
    })
  })
})

/*****************************************************************************************************************/
