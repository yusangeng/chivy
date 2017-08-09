/**
 * 日志过滤器
 *
 * @author yusangeng
 */

import config from './config'
import { anything2Level } from './levelHelper'
import LogPath from './LogPath'

/**
 * 过滤日志.
 *
 * @param {number|string} level 日志级别
 * @param {string|Path} moduleName 模块名
 * @returns {boolean} 需要打印返回true, 否则返回false
 */
export default function filter (level, moduleName) {
  return (filter.level_ <= level && filter.modules_.some(el => el.match(moduleName)))
}

/**
 * 打开某个模块的日志.
 *
 * @param {string} moduleName 模块名
 */
filter.on = function on (moduleName) {
  const modules = filter.modules_ || []

  if (!modules.some(el => el.equal(moduleName))) {
    filter.modules_ = modules.concat([new LogPath(moduleName)])
  }
}

/**
 * 关闭某个模块的日志.
 *
 * @param {string} moduleName 模块名
 */
filter.off = function off (moduleName) {
  const modules = filter.modules_ || []
  filter.modules_ = modules.filter(el => !el.equal(moduleName))
}

/**
 * 设置日志级别.
 *
 * @param {number|string} value 级别数或者级别名字
 */
filter.setLevel = function setLevel (value) {
  filter.level_ = anything2Level(value)
}

/**
 * 当前日志级别.
 */
filter.level_ = config['chivy-level']

/**
 * 当前屏蔽的模块列表.
 */
filter.modules_ = config['chivy-modules'].map(el => new LogPath(el))
