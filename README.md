# chivy

[![TypeScript](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.tslang.cn/) [![Build Status](https://travis-ci.org/yusangeng/chivy.svg?branch=master)](https://travis-ci.org/yusangeng/chivy) [![Coverage Status](https://coveralls.io/repos/github/yusangeng/chivy/badge.svg?branch=master)](https://coveralls.io/github/yusangeng/chivy?branch=master) [![Npm Package Info](https://badge.fury.io/js/chivy.svg)](https://www.npmjs.com/package/chivy) [![Downloads](https://img.shields.io/npm/dw/chivy.svg?style=flat)](https://www.npmjs.com/package/chivy)

## Abstract

Configurable console logger.

## Install

```bash
npm install chivy --save
```

## Usage

### Configuration

chivy 使用 konph 进行配置, konph 用法见: https://github.com/yusangeng/konph

配置项:

- chivy-level: 当前网页 log 级别, 低于此级别的日志将不会打印. 可填写整数, 默认为 0. 也可填字符串, 字符串到整数换算规则如下(不区分大小写)：

> DEBUG: 0
> INFO: 1
> WARN: 2
> ERROR: 3
> MUTE: 4

- chivy-modules: 被打开的模块名. 可填一个数组, 或者用","隔开的字符串. 默认为['**']

> chivy-modules 中的 module 名使用"/"分割, 每一段称为一个 section, 匹配时以 section 为单位从左向右匹配.
> chivy-modules 中的 module 名支持单 section 通配符"\*"和多 section 通配符"\*\*", 通配符和其他字符不能混用, 一个 section 要么是通配符, 要么是其他字符.

- chivy-driver-flags: driver 打印配置. 类型为形如['color', 'level', 'module', 'time']的数组, 可以通过增删元素选择打印方式或字段：
  - color: 彩色打印.
  - level: 打印日志级别.
  - module：打印模块名称.
  - time：打印日志时间.

注意：由于 driver 可以自定义实现, 此处的 flags 元素和元素解释也可自定义, 由自定义 driver 接收.

配置例子:

```js
window.__Konph = {
  "chivy-level": "warn",
  "chivy-modules": ["**"], // 这样配置会打开所有module
  "chivy-driver-flags": ["color", "level", "module"]
};
```

### Code Example

```js
import Logger from "chivy";

const log = new Logger("project/module");

log.debug("Debug message!");
log.info("Info message!");
log.warn("Warn message!");
log.error("Error message!");
```

### Customization

Logger 通过 Driver 执行打印, Filter 执行过滤. 通过依赖注入, 可以通过自定义 Driver 和 Filter 的方式自定义 chivy 的行为.

例如:

```typescript
import Logger, { IDriver, IFilter } from "chivy";

class Driver implements IDriver {
  // ...
}

class Filter implements IFilter {
  // ...
}

Logger.injector.Driver = Driver;
Logger.injector.Filter = Filter;

const log = new Logger("foo/bar");
```

IDriver:

```typescript
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
   * @param {Array} params 其他参数
   *
   * @memberof Driver
   * @instance
   */
  log(level: Level, moduleName: string, ...params: any[]): void;
}
```

IFilter:

```typescript
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
```

其中 Path 是对使用"/"分隔的路径字符串的封装, 提供了 equal, match 和 toString 三个方法, 支持通配符. 如果外部需要使用, 可以通过如下代码引入:

```js
import { IFilter, Path } from "chivy";

class Filter implements IFilter {
  exec(level: Level, moduleName: Path): boolean {
    return moduleName.match("foo/bar/**/Foobar");
  }
}
```
