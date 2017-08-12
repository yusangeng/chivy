/**
 * 日志打印类
 *
 * @author yusangeng
 *
 * @fileoverview
 * Logger生成日志, LogContext打印日志.
 */

import dateFormat from 'dateformat'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import isBoolean from 'lodash/isBoolean'
import { anything2LevelString } from './levelHelper'
import config from './config'
import g from './g'

const notSupportColor = (env => !env.location || !!env.ActiveXObject)(g)

const flags = config['chivy-context-flags']
const noColor = notSupportColor || !flags.includes('color')
const noTime = !flags.includes('time')
const noModule = !flags.includes('module')
const noLevel = !flags.includes('level')

const colorfulStyles = {
  level (level) {
    const bg = {
      'DEBUG': '#3CABDB',
      'INFO': '#167FFC',
      'WARN': '#595BD4',
      'ERROR': '#FD3259'
    }[level] || '#3CABDB'

    return `color: #FFF; background:${bg};`
  },

  module (moduleName) {
    return 'color: #6C6B47;'
  },

  time (now) {
    return 'color: #6C6B47;'
  },

  content (content) {
    return 'color: #0C0C0C;'
  }
}

/**
 * 日志打印类.
 *
 * 可以通过赋值Logger.injector.LogContext替换.
 *
 * @export
 * @class LogContext
 */
export default class LogContext {
  /**
   * 转化level字符串(为了显示整齐).
   *
   * @static
   * @param {string} levelStr 日志级别字符串
   * @returns {string} 转化后的字符串
   *
   * @memberof LogContext
   * @private
   */
  static transLevel (levelStr) {
    return {
      'DEBUG': 'DBG',
      'INFO': 'INF',
      'WARN': 'WRN',
      'ERROR': 'ERR'
    }[levelStr] || '???'
  }

  /**
   * 通过level字符串获取log打印函数.
   *
   * @static
   * @param {any} levelStr 日志级别
   * @returns {Function} 日志打印函数
   *
   * @memberof LogContext
   * @private
   */
  static getLogByLevel (levelStr) {
    let log = null

    if (levelStr === 'DEBUG') {
      log = console.debug.bind(console)
    } else if (levelStr === 'INFO') {
      log = console.info.bind(console)
    } else if (levelStr === 'WARN') {
      log = console.warn.bind(console)
    } else if (levelStr === 'ERROR') {
      log = console.error.bind(console)
    } else {
      log = console.log.bind(console)
    }

    return log
  }

  /**
   * Creates an instance of LogContext.
   *
   * @param {Object} styles [styles=colorfulStyles] log样式
   * @param {Function} styles.level level字段样式
   * @param {Function} styles.module module字段样式
   * @param {Function} styles.time time字段样式
   * @param {Function} styles.content 日志内容样式(只对单行日志有效)
   *
   * @memberof LogContext
   */
  constructor (styles = colorfulStyles) {
    this.cstyles_ = styles
  }

  /**
   * 打印日志.
   *
   * @param {number|string} level 日志级别
   * @param {string} moduleName 模块名
   * @param {Array} params 其他参数
   *
   * @memberof LogContext
   * @instance
   */
  log (level, moduleName, ...params) {
    if (!noColor) {
      // 彩色打印
      this.colorfully(level, moduleName, ...params)
    } else {
      this.monochromatically(level, moduleName, ...params)
    }
  }

  /**
   * 彩色打印.
   *
   * @param {number|string} level 日志级别
   * @param {string} moduleName 模块名
   * @param {Array} params 其他参数
   *
   * @memberof LogContext
   * @instance
   * @private
   */
  colorfully (level, moduleName, ...params) {
    const levelStr = anything2LevelString(level) || ('' + level)
    const paddingLevelStr = LogContext.transLevel(levelStr)

    const now = dateFormat(new Date(), 'HH:mm:ss:l')
    const [p0] = params

    const prefix = []
    const styleParams = []

    if (!noLevel) {
      prefix.push(`%c ${paddingLevelStr}`)
      styleParams.push(this.cstyles_.level(levelStr))
    }

    if (!noModule) {
      prefix.push(`%c ${moduleName}`)
      styleParams.push(this.cstyles_.module(moduleName))
    }

    if (!noTime) {
      prefix.push(`%c ${now}`)
      styleParams.push(this.cstyles_.time(now))
    }

    let log = console.log.bind(console)

    if (params.length === 1 && (isString(p0) || isNumber(p0) || isBoolean(p0))) {
      log(`${prefix.join(' ')}%c - ${'' + p0}`, ...styleParams.concat([this.cstyles_.content(p0)]))
    } else {
      log(`${prefix.join(' ')} ----`, ...styleParams)
      log(...params)
    }
  }

  /**
   * 单色打印.
   *
   * @param {number|string} level 日志级别
   * @param {string} moduleName 模块名
   * @param {Array} params 其他参数
   *
   * @memberof LogContext
   * @instance
   * @private
   */
  monochromatically (level, moduleName, ...params) {
    const levelStr = anything2LevelString(level) || ('' + level)
    const paddingLevelStr = LogContext.transLevel(levelStr)

    const now = dateFormat(new Date(), 'HH:mm:ss:l')
    const [p0] = params

    const prefix = []

    if (!noLevel) {
      prefix.push(`[${paddingLevelStr}]`)
    }

    if (!noModule) {
      prefix.push(`[${moduleName}]`)
    }

    if (!noTime) {
      prefix.push(`[${now}]`)
    }

    const log = LogContext.getLogByLevel(levelStr)

    if (params.length === 1 && (isString(p0) || isNumber(p0) || isBoolean(p0))) {
      log(`${prefix.join(' ')} - ${p0}`)
    } else {
      log(`${prefix.join(' ')}`)
      log(...params)
    }
  }
}
