/**
 * 日志配置
 *
 * @author yusangeng
 */

import conf from 'konph'
import { anything2Level } from './levelHelper'

export default conf({
  'chivy-level': {
    def: 'WARN',
    fit: anything2Level
  },

  'chivy-modules': {
    def: ['**'],
    fit: conf.helper.fit.array
  },

  'chivy-context-flags': {
    def: ['color', 'level', 'module'], // 'color', 'level', 'module', 'time'
    fit: conf.helper.fit.array
  }
})
