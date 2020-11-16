/**
 * 日志过滤器.
 *
 * @author Y3G
 */

import { KonphGlobal } from "konph/src/types";
import config, { ChivyConfig } from "./config";
import { anything2Level } from "./levelHelper";
import Path from "./Path";

const { assign } = Object;

/**
 * 日志级别,
 *
 * @enum {number}
 */
export enum Level {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  MUTE = 4,
  TEST = 9999
}

/**
 * 日志过滤器接口.
 *
 * @export
 * @interface IFilter
 */
export interface IFilter {
  /**
   * 过滤日志.
   *
   * 可以通过赋值Logger.injector.logFilter替换.
   *
   * @param {Level} level 日志级别
   * @param {Path} moduleName 模块名
   * @returns {boolean} 需要打印返回true, 否则返回false
   */
  exec(level: Level, moduleName: Path): boolean;
}

export default class Filter implements IFilter {
  level_: Level;
  modules_: Array<Path>;

  constructor(conf?: KonphGlobal<ChivyConfig>) {
    const myConf = assign({}, config, conf);

    this.level_ = anything2Level(myConf["chivy-level"]);
    this.modules_ = myConf["chivy-modules"].map((el: string) => new Path(el));
  }

  exec(level: Level, moduleName: Path): boolean {
    return (
      this.level_ <= level && this.modules_.some(el => el.match(moduleName))
    );
  }
}
