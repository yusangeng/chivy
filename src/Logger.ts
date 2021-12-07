/**
 * 日志类.
 *
 * @author  yusangeng@outlook.com
 */

import { KonphGlobal } from "konph";
import Path from "./Path";
import Filter, { IFilter, Level } from "./Filter";
import Driver, { IDriver } from "./Driver";
import config, { ChivyConfig } from "./config";

const { assign } = Object;
// 默认模块名(同时表示全局)
const globalModuleName = "global";

type Constructor<T> = new (...args: any[]) => T;

type C = Constructor<IDriver>;
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
    Driver: C = Driver;
    Filter: F = Filter;

    getClasses(): [C, F] {
      const { Driver, Filter } = this;

      if (!Driver || !Filter) {
        throw new TypeError(
          `Either class Driver or class Filter should be injected.`
        );
      }

      return [Driver, Filter];
    }
  })();

  private readonly moduleName: Path;
  private readonly driver: IDriver;
  private readonly filter: IFilter;

  constructor(moduleName: string, conf?: KonphGlobal<ChivyConfig>) {
    this.moduleName = new Path(moduleName || globalModuleName);

    const [Driver, Filter] = Logger.injector.getClasses();
    const cf = assign({}, config, conf);

    this.driver = new Driver(cf);
    this.filter = new Filter(cf);
  }

  debug = (...params: any[]): boolean => {
    return this.printByLevel(Level.DEBUG, ...params);
  };

  info = (...params: any[]): boolean => {
    return this.printByLevel(Level.INFO, ...params);
  };

  warn = (...params: any[]): boolean => {
    return this.printByLevel(Level.WARN, ...params);
  };

  error = (...params: any[]): boolean => {
    return this.printByLevel(Level.ERROR, ...params);
  };

  print = (...params: any[]): void => {
    this.driver.log.call(
      this.driver,
      Level.TEST,
      this.moduleName.toString(),
      ...params
    );
  };

  private printByLevel(level: Level, ...params: any[]): boolean {
    if (!this.filter.exec(level, this.moduleName)) {
      return false;
    }

    this.driver.log.call(
      this.driver,
      level,
      this.moduleName.toString(),
      ...params
    );
    return true;
  }
}
