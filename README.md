# chivy | 浏览器控制台打印工具

[![Build Status](https://travis-ci.org/yusangeng/chivy.svg?branch=master)](https://travis-ci.org/yusangeng/chivy) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Npm Package Info](https://badge.fury.io/js/chivy.svg)](https://www.npmjs.com/package/chivy)

## 综述

chivy是一个轻量级浏览器控制台打印工具, 实现了按模块和按级别过滤.

## 安装

``` bash
npm install chivy --save
```

### 网页引用

index.js:
``` html
<!DOCTYPE html>
<html>
  <head>
    <script src="path/to/chivy.js"></script>
    <script src="./index.js"></script>
  </head>
</html>
```

index.js:
``` js
var logger = new Chivy('project/module')
logger.info('some information.')
```

## 使用

### 配置

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

### js调用

``` js
import Logger from 'chivy'

log = new Logger('project/module')

log.debug('Debug message!')
log.info('Info message!')
log.warn('Warn message!')
log.error('Error message!')
```

### 临时改变配置

#### 在浏览器console中改变

``` js
chivyon('SOME-MODULE-NAME') // 打开模块
chivyoff('SOME-MODULE-NAME') // 屏蔽模块
chivylevel('ERROR') // 修改日志级别
```

### 在console中执行打印

chivy在浏览器中提供了全局函数`chivy`用来执行日志打印, 测试用. 

``` js
chivy('12345')
```