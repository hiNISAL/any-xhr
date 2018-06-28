(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.AnyXHR = factory());
}(this, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var AnyXHR = function () {
    /**
     * 构造函数
     * @param {*} hooks 
     * @param {*} execedHooks 
     */
    function AnyXHR() {
      var hooks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var execedHooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      classCallCheck(this, AnyXHR);

      // 单例
      if (AnyXHR.instance) {
        return AnyXHR.instance;
      }

      this.XHR = window.XMLHttpRequest;

      this.hooks = hooks;
      this.execedHooks = execedHooks;
      this.init();

      AnyXHR.instance = this;
    }

    /**
     * 初始化 重写xhr对象
     */


    createClass(AnyXHR, [{
      key: 'init',
      value: function init() {
        var _this = this;

        window.XMLHttpRequest = function () {
          this._xhr = new _this.XHR();

          _this.overwrite(this);
        };
      }

      /**
       * 添加勾子
       * @param {*} key 
       * @param {*} value 
       */

    }, {
      key: 'add',
      value: function add(key, value) {
        var execed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (execed) {
          this.execedHooks[key] = value;
        } else {
          this.hooks[key] = value;
        }
        return this;
      }

      /**
       * 处理重写
       * @param {*} xhr 
       */

    }, {
      key: 'overwrite',
      value: function overwrite(proxyXHR) {
        for (var key in proxyXHR._xhr) {

          if (typeof proxyXHR._xhr[key] === 'function') {
            this.overwriteMethod(key, proxyXHR);
            continue;
          }

          this.overwriteAttributes(key, proxyXHR);
        }
      }

      /**
       * 重写方法
       * @param {*} key 
       */

    }, {
      key: 'overwriteMethod',
      value: function overwriteMethod(key, proxyXHR) {
        var hooks = this.hooks;
        var execedHooks = this.execedHooks;

        proxyXHR[key] = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          // 拦截
          if (hooks[key] && hooks[key].call(proxyXHR, args) === false) {
            return;
          }

          // 执行方法本体
          var res = proxyXHR._xhr[key].apply(proxyXHR._xhr, args);

          // 方法本体执行后的钩子
          execedHooks[key] && execedHooks[key].call(proxyXHR._xhr, res);

          return res;
        };
      }

      /**
       * 重写属性
       * @param {*} key 
       */

    }, {
      key: 'overwriteAttributes',
      value: function overwriteAttributes(key, proxyXHR) {
        Object.defineProperty(proxyXHR, key, this.setProperyDescriptor(key, proxyXHR));
      }

      /**
       * 设置属性的属性描述
       * @param {*} key 
       */

    }, {
      key: 'setProperyDescriptor',
      value: function setProperyDescriptor(key, proxyXHR) {
        var obj = Object.create(null);
        var _this = this;

        obj.set = function (val) {

          // 如果不是on打头的属性
          if (!key.startsWith('on')) {
            proxyXHR['__' + key] = val;
            return;
          }

          if (_this.hooks[key]) {

            this._xhr[key] = function () {
              for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              _this.hooks[key].call(proxyXHR), val.apply(proxyXHR, args);
            };

            return;
          }

          this._xhr[key] = val;
        };

        obj.get = function () {
          return proxyXHR['__' + key] || this._xhr[key];
        };

        return obj;
      }

      /**
       * 获取实例
       */

    }, {
      key: 'getInstance',
      value: function getInstance() {
        return AnyXHR.instance;
      }

      /**
       * 删除钩子
       * @param {*} name 
       */

    }, {
      key: 'rmHook',
      value: function rmHook(name) {
        var isExeced = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var target = isExeced ? this.execedHooks : this.hooks;
        delete target[name];
      }

      /**
       * 清空钩子
       */

    }, {
      key: 'clearHook',
      value: function clearHook() {
        this.hooks = {};
        this.execedHooks = {};
      }

      /**
       * 取消监听
       */

    }, {
      key: 'unset',
      value: function unset() {
        window.XMLHttpRequest = this.XHR;
      }

      /**
       * 重新监听
       */

    }, {
      key: 'reset',
      value: function reset() {
        AnyXHR.instance = null;
        AnyXHR.instance = new AnyXHR(this.hooks, this.execedHooks);
      }
    }]);
    return AnyXHR;
  }();

  return AnyXHR;

})));
