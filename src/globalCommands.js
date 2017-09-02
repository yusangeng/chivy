/**
 * 全局命令
 *
 * @author yusangeng
 */

import filter from './filter'
import Logger from './Logger'
import g from './g'

// 可能网页内存在多个版本的chivy
const filters = g.__chivyFilters || (g.__chivyFilters = [])
g.__chivyFilters = filters.concat([filter])

// 全局命令, 用于在console中改变配置
if (!g.chivyon) {
  /**
   * 打开某个模块的日志
   */
  g.chivyon = moduleName => {
    g.__chivyFilters.forEach(el => el.on(moduleName))
  }
}

if (!g.chivyoff) {
  /**
   * 屏蔽某个模块的日志打印
   */
  g.chivyoff = moduleName => {
    g.__chivyFilters.forEach(el => el.off(moduleName))
  }
}

if (!g.chivylevel) {
  /**
   * 设置日志级别
   */
  g.chivylevel = level => {
    g.__chivyFilters.forEach(el => el.setLevel(level))
  }
}

if (!g.chivy) {
  /**
   * 在命令行打印日志(测试用)
   */
  g.chivy = function (...params) {
    const logger = new Logger()
    logger.print(...params)
  }
}
