# chivy

[![TypeScript](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.tslang.cn/) [![Build Status](https://travis-ci.org/yusangeng/chivy.svg?branch=master)](https://travis-ci.org/yusangeng/chivy) [![Coverage Status](https://coveralls.io/repos/github/yusangeng/chivy/badge.svg?branch=master)](https://coveralls.io/github/yusangeng/chivy?branch=master) [![Npm Package Info](https://badge.fury.io/js/chivy.svg)](https://www.npmjs.com/package/chivy) [![Downloads](https://img.shields.io/npm/dw/chivy.svg?style=flat)](https://www.npmjs.com/package/chivy)

## Abstract

Configurable console logger.

## Install

``` bash
npm install chivy --save
```

## Usage

### Configuration

chivy 使用konph进行配置, konph用法见: https://github.com/yusangeng/konph

配置项:

* chivy-level: 当前网页log级别, 低于此级别的日志将不会打印. 可填写整数, 默认为0. 也可填字符串, 字符串到整数换算规则如下(不区分大小写)：

> DEBUG: 0
> INFO:  1
> WARN:  2
> ERROR: 3
> MUTE:  4

* chivy-modules: 被打开的模块名. 可填一个数组, 或者用","隔开的字符串. 默认为['**']

> chivy-modules中的module名使用"/"分割, 每一段称为一个section, 匹配时以section为单位从左向右匹配. 
> chivy-modules中的module名支持单section通配符"*"和多section通配符"**", 通配符和其他字符不能混用, 一个section要么是通配符, 要么是其他字符. 

* chivy-context-flags: LogContext打印配置. 类型为形如['color', 'level', 'module', 'time']的数组, 可以通过增删元素选择打印方式或字段：
  * color: 彩色打印. 
  * level: 打印日志级别. 
  * module：打印模块名称. 
  * time：打印日志时间. 

注意：由于LogContext可以自定义实现, 此处的flags元素和元素解释也可自定义, 由自定义LogContext接收. 

配置例子:

``` js
window.__Konph = {
  'chivy-level': 'warn',
  'chivy-modules': ['**'], // 这样配置会打开所有module
  'chivy-context-flags': ['color', 'level', 'module']
}
```

### Code Example

``` js
import Logger from 'chivy'

const log = new Logger('project/module')

log.debug('Debug message!')
log.info('Info message!')
log.warn('Warn message!')
log.error('Error message!')
```

### Customization

Logger通过Context执行打印, Filter执行过滤. 通过依赖注入, 可以通过自定义Context和Filter的方式自定义chivy的行为.

例如:

``` typescript
import Logger, { IContxt, IFilter } from 'chivy'

class Context implements IContext {
  // ...
}

class Filter implements IFilter {
  // ...
}

Logger.injector.Context = Context
Logger.injector.Filter = Filter

const log = new Logger('foo/bar')
```

IContext:

``` typescript
/**
 * 日志打印接口.
 *
 * @export
 * @interface IContext
 */
export interface IContext {
  /**
   * 打印日志.
   *
   * @param {Level} level 日志级别
   * @param {string} moduleName 模块名
   * @param {Array} params 其他参数
   *
   * @memberof Context
   * @instance
   */
  log(level: Level, moduleName: string, ...params: any[]): void;
}
```

IFilter:

``` typescript
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

其中Path是对使用"/"分隔的路径字符串的封装, 提供了equal, match和toString三个方法, 支持通配符. 如果外部需要使用, 可以通过如下代码引入:

``` js
import { IFilter, Path } from 'chivy'

class Filter implements IFilter {
  exec(level: Level, moduleName: Path): boolean {
    return moduleName.match('foo/bar/**/Foobar')
  }
}
```
