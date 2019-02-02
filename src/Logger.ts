/**
 * 日志类.
 *
 * @author Y3G
 */

import { KonphGlobal } from 'konph/lib/types'
import Path from './Path'
import Filter, { IFilter, Level } from './Filter'
import Context, { IContext } from './Context'
import config, { ChivyConfig } from './config'

type ClassOf<T> = new (...args: any[]) => T

type TC = ClassOf<IContext>
type TF = ClassOf<IFilter>

// 默认模块名(同时表示全局)
const globalModuleName = 'global'

const { assign } = Object

/**
 * 日志类.
 *
 * @export
 * @class Logger
 */
export default class Logger {
  static injector = new class {
    Context: TC = Context
    Filter: TF = Filter

    getClasses () : [ TC, TF ] {
      const { Context, Filter } = this

      if (!Context || !Filter) {
        throw new Error(`Class Context and Filter should be injected.`)
      }

      return [ Context, Filter ]
    }
  }

  moduleName: Path
  ctx: IContext
  filter: IFilter

  constructor (moduleName: string, conf?: KonphGlobal<ChivyConfig>) {
    this.moduleName = new Path(moduleName || globalModuleName)

    const [ Context, Filter ] = Logger.injector.getClasses()
    const cf = assign({}, config, conf)

    this.ctx = new Context(cf)
    this.filter = new Filter(cf)
  }

  debug (...params: any[]) : boolean {
    return this.printByLevel(Level.DEBUG, ...params)
  }

  info (...params: any[]) : boolean {
    return this.printByLevel(Level.INFO, ...params)
  }

  warn (...params: any[]) : boolean {
    return this.printByLevel(Level.WARN, ...params)
  }

  error (...params: any[]) : boolean {
    return this.printByLevel(Level.ERROR, ...params)
  }

  print (...params: any[]) : void {
    this.ctx.log.call(this.ctx, Level.TEST, this.moduleName.toString(), ...params)
  }

  printByLevel (level: Level, ...params: any[]) : boolean {
    if (!this.filter.exec(level, this.moduleName)) {
      return false
    }

    this.ctx.log.call(this.ctx, level, this.moduleName.toString(), ...params)
    return true
  }
}
