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

## constructor 构造函数

> constructor(hooks = {}, execedHooks = {})

`hooks` 在原生的xhr方法调用之前调用

`execedHooks` 在原生的xhr方法调用之后调用

## methods

### add

动态添加钩子

* 参数

`key` xhr实例的方法或者属性名

`value`

`execed` 是否在原生方法后调用 (default: false)

### rmHook

动态删除钩子

* 参数

`key` xhr实例的方法或者属性名

### clearHook

清空所有钩子

### unset

还原

### reset

重新开启监听 代理
