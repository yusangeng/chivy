/**
 * 日志打印类.
 *
 * @author  yusangeng@outlook.com
 *
 * @fileoverview
 * Logger生成日志, Driver打印日志.
 */

import dateFormat from "dateformat";
import { KonphGlobal } from "konph";
import config, { ChivyConfig } from "./config";
import { Level } from "./Filter";
import { anything2LevelString } from "./level-utils";

const { assign } = Object;
const notSupportColor = (env => !env.location || !!(env as any).ActiveXObject)(globalThis);

type Styles = {
  level: (level: string) => string;
  module: (moduleName: string) => string;
  time: (now: string) => string;
  content: (content: string) => string;
};

const colorTable: any = {
  DEBUG: "#3CABDB",
  INFO: "#167FFC",
  WARN: "#595BD4",
  ERROR: "#FD3259"
};

const colorfulStyles: Styles = {
  level(level: string): string {
    let bg = colorTable[level];

    if (typeof bg !== "string") {
      bg = "#3CABDB";
    }

    return `color: #FFF; background:${bg};`;
  },

  module(/*moduleName: string*/): string {
    return "color: #6C6B47;";
  },

  time(/*now: string*/): string {
    return "color: #6C6B47;";
  },

  content(/*content: string*/): string {
    return "color: #0C0C0C;";
  }
};

const levelTextTable: any = {
  DEBUG: "DBG",
  INFO: "INF",
  WARN: "WRN",
  ERROR: "ERR"
};

function level2Text(levelStr: string): string {
  let text = levelTextTable[levelStr];

  if (typeof text !== "string") {
    text = "#3CABDB";
  }

  return text;
}

type FLog = (message?: any, ...optionalParams: any[]) => void;

function getConsoleLogFunctionByLevel(levelStr: string): FLog {
  if (levelStr === "DEBUG") {
    return console.debug.bind(console);
  } else if (levelStr === "INFO") {
    return console.info.bind(console);
  } else if (levelStr === "WARN") {
    return console.warn.bind(console);
  } else if (levelStr === "ERROR") {
    return console.error.bind(console);
  } else {
    return console.log.bind(console);
  }
}

/**
 * 日志打印接口.
 *
 * @export
 * @interface IDriver
 */
export interface IDriver {
  /**
   * 打印日志.
   *
   * @param {Level} level 日志级别
   * @param {string} moduleName 模块名
   * @param {Array} data 其他参数
   *
   * @memberof IDriver
   * @instance
   */
  log(level: Level, moduleName: string, ...data: any[]): void;
}

export default class Driver implements IDriver {
  readonly noColor: boolean;
  readonly noTime: boolean;
  readonly noModule: boolean;
  readonly noLevel: boolean;
  readonly cstyles_: Styles;

  constructor(conf?: KonphGlobal<ChivyConfig>) {
    const myConf: ChivyConfig = assign({}, config, conf);

    const flags = myConf["chivy-driver-flags"];

    this.noColor = notSupportColor || !flags.find(el => el === "color");
    this.noTime = !flags.find(el => el === "time");
    this.noModule = !flags.find(el => el === "module");
    this.noLevel = !flags.find(el => el === "level");

    this.cstyles_ = colorfulStyles;
  }

  log(level: Level, moduleName: string, ...params: any[]): void {
    if (!this.noColor) {
      // 彩色打印
      this.colorfully(level, moduleName, ...params);
    } else {
      this.monochromatically(level, moduleName, ...params);
    }
  }

  colorfully(level: Level, moduleName: string, ...params: any[]): void {
    const levelStr = anything2LevelString(level) || "" + level;
    const paddingLevelStr = level2Text(levelStr);

    const now = dateFormat(new Date(), "HH:mm:ss:l");
    const [p0] = params;

    const prefix = [];
    const styleParams = [];

    if (!this.noLevel) {
      prefix.push(`%c ${paddingLevelStr}`);
      styleParams.push(this.cstyles_.level(levelStr));
    }

    if (!this.noModule) {
      prefix.push(`%c ${moduleName}`);
      styleParams.push(this.cstyles_.module(moduleName));
    }

    if (!this.noTime) {
      prefix.push(`%c ${now}`);
      styleParams.push(this.cstyles_.time(now));
    }

    const log = (...args: any[]) => {
      console.log(...args);
    };

    if (params.length !== 1) {
      log(`${prefix.join(" ")} ----`, ...styleParams);
      log(...params);

      return;
    }

    const content0 = `${prefix.join(" ")}%c - ${"" + p0}`;

    if (typeof p0 === "string") {
      log(content0, ...styleParams.concat([this.cstyles_.content(p0)]));
      return;
    }

    if (typeof p0 === "number") {
      log(content0, ...styleParams.concat([this.cstyles_.content("" + p0)]));
      return;
    }

    if (typeof p0 === "boolean") {
      log(
        content0,
        ...styleParams.concat([this.cstyles_.content(p0 ? "true" : "false")])
      );
      return;
    }

    log(`${prefix.join(" ")} ----`, ...styleParams);
    log(...params);
  }

  monochromatically(level: Level, moduleName: string, ...params: any[]): void {
    const levelStr = anything2LevelString(level) || "" + level;
    const paddingLevelStr = level2Text(levelStr);

    const now = dateFormat(new Date(), "HH:mm:ss:l");
    const [p0] = params;

    const prefix = [];

    if (!this.noLevel) {
      prefix.push(`[${paddingLevelStr}]`);
    }

    if (!this.noModule) {
      prefix.push(`[${moduleName}]`);
    }

    if (!this.noTime) {
      prefix.push(`[${now}]`);
    }

    const log = getConsoleLogFunctionByLevel(levelStr);

    if (
      params.length === 1 &&
      ["string", "number", "boolean"].includes(typeof p0)
    ) {
      log(`${prefix.join(" ")} - ${p0}`);
    } else {
      log(`${prefix.join(" ")}`);
      log(...params);
    }
  }
}
