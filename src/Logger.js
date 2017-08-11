/**
 * 日志类
 *
 * @author yusangeng
 */

/**
 * 日志类
 *
 * @export
 * @class Logger
 */
export default class Logger {
  /**
   * Creates an instance of Logger.
   *
   * @param {string} moduleName 模块名
   * @param {object} [context=new LogContext()] 日志打印对象, 需要实现log(level, moduleName, ...params)方法
   * @param {Function} [filtler=logFilter] 日志过滤器, 如果使用了自定义filter, globalCommand将当前logger失效
   *
   * @memberof Logger
   */
  constructor (moduleName, context = new Logger.injector.LogContext(),
    filter = Logger.injector.logFilter) {
    this.moduleName = new Logger.injector.LogPath(moduleName || Logger.globalModuleName)
    this.ctx = context
    this.filter = Logger.injector.logFilter
  }

  /**
   * 日志打印(debug级别)
   *
   * @param {any} params 要打印的数据
   *
   * @memberof Logger
   * @instance
   */
  debug (...params) {
    if (this.filter && !this.filter(Logger.Levels.DEBUG, this.moduleName)) {
      return
    }

    this.ctx.log.apply(this.ctx, [Logger.Levels.DEBUG, this.moduleName].concat(params))
  }

  /**
   * 日志打印(info级别)
   *
   * @param {any} params 要打印的数据
   *
   * @memberof Logger
   * @instance
   */
  info (...params) {
    if (this.filter && !this.filter(Logger.Levels.INFO, this.moduleName)) {
      return
    }

    this.ctx.log.apply(this.ctx, [Logger.Levels.INFO, this.moduleName].concat(params))
  }

  /**
   * 日志打印(warn级别)
   *
   * @param {any} params 要打印的数据
   *
   * @memberof Logger
   * @instance
   */
  warn (...params) {
    if (this.filter && !this.filter(Logger.Levels.WARN, this.moduleName)) {
      return
    }

    this.ctx.log.apply(this.ctx, [Logger.Levels.WARN, this.moduleName].concat(params))
  }

  /**
   * 日志打印(error级别)
   *
   * @param {any} params 要打印的数据
   *
   * @memberof Logger
   * @instance
   */
  error (...params) {
    if (this.filter && !this.filter(Logger.Levels.ERROR, this.moduleName)) {
      return
    }

    this.ctx.log.apply(this.ctx, [Logger.Levels.ERROR, this.moduleName].concat(params))
  }

  /**
   * 测试打印, 不过滤
   *
   * @param {any} params 要打印的数据
   * @memberof Logger
   * @instance
   * @private
   */
  print (...params) {
    this.ctx.log.apply(this.ctx, [99, this.moduleName].concat(params))
  }
}

/**
 * @property {string} globalModuleName 默认模块名(同时表示全局)
 * @readonly
 */
Logger.globalModuleName = 'global' /** 默认模块名(同时表示全局) */

/**
 * @enum {number} Levels 日志级别
 * @readonly
 */
Logger.Levels = {
  /** DEBUG */
  DEBUG: 0,
  /** INFO */
  INFO: 1,
  /** WARN */
  WARN: 2,
  /** ERROR */
  ERROR: 3,
  /** MUTE: 表示不打印任何日志 */
  MUTE: 4
}
