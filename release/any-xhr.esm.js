class AnyXHR {
/**
 * 构造函数
 * @param {*} hooks 
 * @param {*} execedHooks 
 */
  constructor(hooks = {}, execedHooks = {}) {
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
  init() {
    let _this = this;

    window.XMLHttpRequest = function() {
      this._xhr = new _this.XHR();

      _this.overwrite(this);
    };

  }

  /**
   * 添加勾子
   * @param {*} key 
   * @param {*} value 
   */
  add(key, value, execed = false) {
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
  overwrite(proxyXHR) {
    for (let key in proxyXHR._xhr) {
      
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
  overwriteMethod(key, proxyXHR) {
    let hooks = this.hooks;
    let execedHooks = this.execedHooks;

    proxyXHR[key] = (...args) => {
      // 拦截
      if (hooks[key] && (hooks[key].call(proxyXHR, args) === false)) {
        return;
      }

      // 执行方法本体
      const res = proxyXHR._xhr[key].apply(proxyXHR._xhr, args);

      // 方法本体执行后的钩子
      execedHooks[key] && execedHooks[key].call(proxyXHR._xhr, res);

      return res;
    };
  }

  /**
   * 重写属性
   * @param {*} key 
   */
  overwriteAttributes(key, proxyXHR) {
    Object.defineProperty(proxyXHR, key, this.setProperyDescriptor(key, proxyXHR));
  }

  /**
   * 设置属性的属性描述
   * @param {*} key 
   */
  setProperyDescriptor(key, proxyXHR) {
    let obj = Object.create(null);
    let _this = this;

    obj.set = function(val) {

      // 如果不是on打头的属性
      if (!key.startsWith('on')) {
        proxyXHR['__' + key] = val;
        return;
      }

      if (_this.hooks[key]) {

        this._xhr[key] = function(...args) {
          (_this.hooks[key].call(proxyXHR), val.apply(proxyXHR, args));
        };

        return;
      }

      this._xhr[key] = val;
    };

    obj.get = function() {
      return proxyXHR['__' + key] || this._xhr[key];
    };

    return obj;
  }

  /**
   * 获取实例
   */
  getInstance() {
    return AnyXHR.instance;
  }

  /**
   * 删除钩子
   * @param {*} name 
   */
  rmHook(name, isExeced = false) {
    let target = (isExeced ? this.execedHooks : this.hooks);
    delete target[name];
  }

  /**
   * 清空钩子
   */
  clearHook() {
    this.hooks = {};
    this.execedHooks = {};
  }

  /**
   * 取消监听
   */
  unset() {
    window.XMLHttpRequest = this.XHR;
  }

  /**
   * 重新监听
   */
  reset() {
    AnyXHR.instance = null;
    AnyXHR.instance = new AnyXHR(this.hooks, this.execedHooks);
  }
}

export default AnyXHR;
