/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-csrf
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { createExportKey, extractImportKey } from '../src/internals/utils'

/*****************************************************************************************************************/

suite('nitro-cors Internal Utils', () => {
  describe('extractImportKey', () => {
    it('should be defined', () => {
      expect(extractImportKey).toBeDefined()
    })

    it('should extract an import key', async () => {
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
    })
  })
})

/*****************************************************************************************************************/
