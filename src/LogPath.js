/**
 * 路径封装类
 *
 * @author yusangeng
 */

import isString from 'lodash/isString'

/**
 * 路径封装类.
 *
 * 路径是指形如`a/b/c/d`的字符串, 其中`/`隔开的部分叫做分段, 分段可以为字符串、通配符`*`, 或者多分段通配符`**`
 * 注意, 在一个分段内, 不支持通配符和和其他字符混用.
 *
 * 相当于简陋版的minimatch(https://github.com/isaacs/minimatch)
 *
 * @class LogPath
 * @private
 */
export default class LogPath {
  /**
   * 路径分段列表
   *
   * @readonly
   *
   * @memberof LogPath
   */
  get sections () {
    return this.sections_.slice()
  }

  /**
   * Creates an instance of LogPath.
   *
   * @param {string | LogPath} str 路径字符串或其他路径对象, 不可为空字符串
   *
   * @memberof LogPath
   * @private
   */
  constructor (str) {
    const pathStr = (str || '').toString()

    this.sections_ = pathStr.split(/\/+/).map(el => el.trim()).filter(el => el.length)

    if (!this.sections_.length) {
      console.warn(`不建议使用空字符串("${pathStr}")构造LogPath实例.`)
    }
  }

  /**
   * 转化为字符串
   *
   * @returns {string} 转化结果
   * @memberof LogPath
   */
  toString () {
    return this.sections.join('/')
  }

  /**
   * 是否相等
   *
   * @param {string | LogPath} other 路径字符串或其他路径对象
   * @returns {boolean} 相等返回true, 否则返回false
   *
   * @memberof LogPath
   */
  equal (other) {
    return this.toString() === other.toString()
  }

  /**
   * 是否匹配
   *
   * `a/#/b`可以匹配`a/foobar/b`, `a/##/b`可以匹配`a/foobar/b`、`a/foo/bar/b`以及`a/b`, `##`可以匹配任意路径(#号实际为*号)
   *
   * @param {string | LogPath} other 路径字符串或其他路径对象, 不可包含通配符
   * @returns {boolean} 匹配返回true, 否则返回false
   *
   * @memberof LogPath
   */
  match (other) {
    const otherPath = isString(other) ? new LogPath(other) : other

    if (other.toString().indexOf(LogPath.wildcard) !== -1) {
      throw new Error('被匹配的路径不可包含通配符(*或**).')
    }

    return sectionListMatch(this.sections, otherPath.sections)
  }
}

/**
 * 路径分段匹配算法
 *
 * @param {Array<string>} left
 * @param {Array<string>} right
 * @returns {boolean} 匹配返回true, 否则返回false
 *
 * @private
 */
function sectionListMatch (left, right) {
  while (left.length && right.length) {
    const currentLeft = left.shift()
    const nextLeft = left[0] // 如果数组里没元素则为undefined, sectionMatch会认为没有nextLeft可用
    const currentRight = right.shift()

    const sectionResult = sectionMatch(currentLeft, nextLeft, currentRight)

    if (sectionResult < 0) {
      return false
    } else if (sectionResult === 0) {
      if (currentLeft === LogPath.doubleWildcard) {
        // 把通配符放回去
        left.unshift(currentLeft)
      }
    } else if (sectionResult > 0) {
      if (currentLeft !== LogPath.doubleWildcard) {
        // 此时需要要把下一个元素取出来, 下次匹配的时候直接从下下个开始
        left.shift()
      }
    }
  }

  if (right.length) {
    return false
  }

  if (left.length && left.filter(el => el !== LogPath.doubleWildcard).length) {
    // 如果left中剩下的不止有多段通配符, 则说明匹配失败
    return false
  }

  return true
}

/**
 * 单个路径分段匹配算法
 *
 * @param {string} left
 * @param {string} nextLeft
 * @param {string} right
 * @returns {number} left匹配right返回0, nextLeft匹配right返回1, 不匹配返回-1
 *
 * @private
 */
function sectionMatch (left, nextLeft, right) {
  if (left === LogPath.wildcard) {
    // 通配符
    return 0
  }

  if (left === LogPath.doubleWildcard) {
    // 多分段通配符
    if (sectionMatch(nextLeft, null, right) === 0) {
      // **/x 或 **/* 或 **/**
      return 1
    }

    return 0
  }

  if (left === right) {
    return 0
  }

  return -1
}

LogPath.wildcard = '*'
LogPath.doubleWildcard = '**'
