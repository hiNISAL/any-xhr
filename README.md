# any-xhr

> 自定义拦截XHR所有方法与属性

> Intercept all of XHR methods and attributes.

## Install 安装

`npm i any-xhr -S`

## Usage 使用

```
var anyxhr = new AnyXHR({
  send: function() {
    console.log(this);
  }
});

anyxhr.add('open', function(...args) {
  console.log(args);
});

anyxhr.rmhook('open');

// ES Module
import AnyXHR from 'any-xhr/release/any-xhr.esm.js';

// commonjs
const AnyXHR from 'any-xhr';
```

## constructor

> constructor(hooks = {}, execedHooks = {})

`hooks` 

  - It will call before the native xhr methods
  - 在原生的xhr方法调用之前调用

`execedHooks`

  - It will call after the native xhr methods
  - 在原生的xhr方法调用之后调用

## methods

### add

Dynamically add hooks
动态添加钩子

- arguments 参数
  - `key` xhr methods or attributes (xhr实例的方法或者属性名)
  - `value`
  - `execed`
    - call after the native xhr methods (是否在原生方法后调用)
    - default: false

### rmHook

Dynamically remove hooks
动态删除钩子

- arguments 参数
  - `key` xhr methods or attributes (xhr实例的方法或者属性名)

### clearHook

clear all of hooks
清空所有钩子

### unset

close all of proxy
还原

### reset

open all of proxy
重新开启监听 代理
