/* global describe it */
import chai from 'chai'
import Logger from '../src'

chai.should()

describe('chivy', () => {
  describe('default config', () => {
    it('should be printed', async () => {
      const log = new Logger('foo/bar')

      log.warn('xxx').should.be.eq(true)
      log.error('xxx').should.be.eq(true)
    })

    it('should NOT be printed', async () => {
      const log = new Logger('foo/bar')

      log.debug('xxx').should.be.eq(false)
      log.info('xxx').should.be.eq(false)
    })
  })

  describe('custom config', () => {
    const conf = {
      'chivy-level': 3,
      'chivy-modules': ['foo/bar']
    }

    it('should be printed', async () => {
      const log = new Logger('foo/bar', conf)
      log.error('error').should.be.eq(true)
    })

    it('should NOT be printed because of level', async () => {
      const log = new Logger('foo/bar', conf)

      log.debug('debug').should.be.eq(false)
      log.info('info').should.be.eq(false)
      log.warn('warn').should.be.eq(false)
    })

    it('should NOT be printed because of module', async () => {
      const log = new Logger('foo/baz', conf)
      log.error('error').should.be.eq(false)
    })
  })
})