/**
 * 日志级别相关函数.
 *
 * @author Y3G
 */

import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'

/**
 * 字符串/数字转为日志级别数字.
 *
 * '1'会被转为1, 'DEBUG'会被转为0, 其他字符串一律转为0,
 * 如果是数字, 则向下取整输出, 如果是其他类型, 则一律转为0.
 *
 * @param {any} value
 * @returns {number} 日志级别数字
 *
 * @private
 */
export function anything2Level (value: any) : number {
  if (isNumber(value)) {
    return Math.floor(value)
  }

  if (isString(value)) {
    let parsedValue = parseInt(value)

    if (!isNaN(parsedValue)) {
      return parsedValue
    }

    let level = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'MUTE'].indexOf(value.toUpperCase())

    if (level < 0) {
      level = 0
    }

    return level
  }

  return 0
}

/**
 * level转为字符串.
 *
 * @param {any} level 日志级别
 * @returns {string} 日志级别字符串
 *
 * @private
 */
export function anything2LevelString (level: any) : string {
  const nLevel = anything2Level(level)
  return ['DEBUG', 'INFO', 'WARN', 'ERROR', 'MUTE'][nLevel] || `LEVEL(${level})`
}
