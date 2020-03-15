/**
 * 日志类.
 *
 * @author Y3G
 */

import { KonphGlobal } from "konph/lib/types";
import Path from "./Path";
import Filter, { IFilter, Level } from "./Filter";
import Context, { IContext } from "./Context";
import config, { ChivyConfig } from "./config";

const { assign } = Object;
// 默认模块名(同时表示全局)
const globalModuleName = "global";

type Constructor<T> = new (...args: any[]) => T;

type C = Constructor<IContext>;
type F = Constructor<IFilter>;

interface IInjector {
  getClasses(): [C, F];
}

/**
 * 日志类.
 *
 * @export
 * @class Logger
 */
export default class Logger {
  static readonly injector = new (class DefaultInjector implements IInjector {
    Context: C = Context;
    Filter: F = Filter;

    getClasses(): [C, F] {
      const { Context, Filter } = this;

      if (!Context || !Filter) {
        throw new Error(`Class Context and Filter should be injected.`);
      }

      return [Context, Filter];
    }
  })();

  private readonly moduleName: Path;
  private readonly ctx: IContext;
  private readonly filter: IFilter;

  constructor(moduleName: string, conf?: KonphGlobal<ChivyConfig>) {
    this.moduleName = new Path(moduleName || globalModuleName);

    const [Context, Filter] = Logger.injector.getClasses();
    const cf = assign({}, config, conf);

    this.ctx = new Context(cf);
    this.filter = new Filter(cf);

    // 上层应用可能会直接使用成员方法
    this.debug = this.debug.bind(this);
    this.info = this.info.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
    this.print = this.print.bind(this);
  }

  debug(...params: any[]): boolean {
    return this.printByLevel(Level.DEBUG, ...params);
  }

  info(...params: any[]): boolean {
    return this.printByLevel(Level.INFO, ...params);
  }

  warn(...params: any[]): boolean {
    return this.printByLevel(Level.WARN, ...params);
  }

  error(...params: any[]): boolean {
    return this.printByLevel(Level.ERROR, ...params);
  }

  print(...params: any[]): void {
    this.ctx.log.call(
      this.ctx,
      Level.TEST,
      this.moduleName.toString(),
      ...params
    );
  }

  private printByLevel(level: Level, ...params: any[]): boolean {
    if (!this.filter.exec(level, this.moduleName)) {
      return false;
    }

    this.ctx.log.call(this.ctx, level, this.moduleName.toString(), ...params);
    return true;
  }
}
