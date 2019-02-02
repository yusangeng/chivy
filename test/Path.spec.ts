/* global describe it */
import chai from 'chai'
import { Path } from '../src'

chai.should()

describe('Path', () => {
  describe('constructor', () => {
    it('should NOT throw', async () => {
      const p1 = new Path('foo')
      const p2 = new Path('foo/bar')
      const p3 = new Path('foo/*')
      const p4 = new Path('foo/*/**/bar')
    })
  })

  describe('#equal', () => {
    it('should be equal', async () => {
      const p1 = new Path('foo/bar')
      const p2 = new Path('foo/bar')

      p1.equal(p2).should.be.eq(true)
      p2.equal(p1).should.be.eq(true)
    })

    it('should NOT be equal', async () => {
      const p1 = new Path('foo/bar')
      const p2 = new Path('foo/baz')

      p1.equal(p2).should.be.eq(false)
      p2.equal(p1).should.be.eq(false)
    })
  })

  describe('#match', () => {
    it('should be matched', async () => {
      const p1 = new Path('foo/bar')
      const str = 'foo/bar'

      p1.match(str).should.be.eq(true)
    })

    it('should NOT be matched', async () => {
      const p1 = new Path('foo/bar')
      const str = 'foo/baz'

      p1.match(str).should.be.eq(false)
    })
  })

  describe('#wildcard', () => {
    it('should be matched: foo/* => foo/bar', async () => {
      const p1 = new Path('foo/*')
      const p2 = new Path('foo/bar')

      p1.match(p2).should.be.eq(true)
    })

    it('should NOT be matched: foo/* => foo/bar/baz', async () => {
      const p1 = new Path('foo/*')
      const p2 = new Path('foo/bar/baz')

      p1.match(p2).should.be.eq(false)
    })

    it('should NOT be matched: foo/* => foo', async () => {
      const p1 = new Path('foo/*')
      const p2 = new Path('foo')

      p1.match(p2).should.be.eq(false)
    })

    it('should NOT be matched: foo/* => fuu/bar', async () => {
      const p1 = new Path('foo/*')
      const p2 = new Path('fuu/bar')

      p1.match(p2).should.be.eq(false)
    })
  })

  describe('#double wildcard', () => {
    tryMatch('foo/**', 'foo/bar')
    tryMatch('foo/**', 'foo/bar/baz')
    tryMatch('foo/**', 'foo')
    tryMatch('foo/**/baz', 'foo/b/a/r/baz')

    tryNotMatch('foo/**', 'fuu')
    tryNotMatch('foo/**', 'fuu/bar/baz')
    tryNotMatch('foo/**/baz', 'foo/b/a/r/baby')
  })
})

function tryMatch (str1: string, str2: string) {
  it(`should be matched: ${str1} => ${str2}`, async () => {
    const p1 = new Path(str1)
    const p2 = new Path(str2)

    p1.match(p2).should.be.eq(true)
  })
}

function tryNotMatch (str1: string, str2: string) {
  it(`should NOT be matched: ${str1} => ${str2}`, async () => {
    const p1 = new Path(str1)
    const p2 = new Path(str2)

    p1.match(p2).should.be.eq(false)
  })
}