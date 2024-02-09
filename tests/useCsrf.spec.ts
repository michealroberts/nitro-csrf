/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-csrf
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { beforeEach, describe, expect, it, suite } from 'vitest'

import supertest, { type SuperTest, type Test } from 'supertest'

import { toNodeListener } from 'h3'

import { server } from './utilities/server'

import { useCSRF } from '../src/useCsrf'

import { createExportKey } from '../src/internals/utils'

import { createToken } from '../src/internals/token'

/*****************************************************************************************************************/

const SECRET = '$i9grtx*fgbog(bwgpk6cz9&&g4bv-bi3*s8_2#t0ond-)^sv='

/*****************************************************************************************************************/

suite('nitro-csrf Internal Utils', () => {
  describe('useCSRF', () => {
    let request: SuperTest<Test>

    beforeEach(() => {
      request = supertest(toNodeListener(server))
    })

    it('should be defined', () => {
      expect(useCSRF).toBeDefined()
    })

    it('should set CSRF headers correctly on the request event when csrf event handler is used', async () => {
      const jwt = await createExportKey()

      const token = await createToken({
        secret: SECRET,
        jwk: jwt
      })

      const res = await request
        .get('/csrf/allowed', {
          method: 'GET'
        })
        .set('x-csrftoken', token)
        .set('x-csrfkey', jwt.k)

      expect(res.header['x-csrf-allowed']).toBe('true')
      expect(res.body).toEqual({ csrf: true })
    })

    it('should not set CSRF headers on the request event when csrf event handler is used with an incorrect token value', async () => {
      const jwt = await createExportKey()

      const res = await request
        .get('/csrf/allowed', {
          method: 'GET'
        })
        .set('x-csrftoken', 'invalid')
        .set('x-csrfkey', jwt.k)

      expect(res.statusCode).not.toBe(200)
    })

    it('should not set CSRF headers on the request event when csrf event handler is used without a token value', async () => {
      const jwt = await createExportKey()

      const res = await request
        .get('/csrf/allowed', {
          method: 'GET'
        })
        .set('x-csrfkey', jwt.k)

      expect(res.statusCode).not.toBe(200)
    })

    it('should not set CSRF headers on the request event when csrf event handler is used with an incorrect key value', async () => {
      const jwt = await createExportKey()

      const token = await createToken({
        secret: SECRET,
        jwk: jwt
      })

      const res = await request
        .get('/csrf/allowed', {
          method: 'GET'
        })
        .set('x-csrftoken', token)
        .set('x-csrfkey', 'invalid')

      expect(res.statusCode).not.toBe(200)
    })

    it('should not set CSRF headers on the request event when csrf event handler is used without a key value', async () => {
      const jwt = await createExportKey()

      const token = await createToken({
        secret: SECRET,
        jwk: jwt
      })

      const res = await request
        .get('/csrf/allowed', {
          method: 'GET'
        })
        .set('x-csrftoken', token)

      expect(res.statusCode).not.toBe(200)
    })
  })
})

/*****************************************************************************************************************/
