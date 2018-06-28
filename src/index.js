class AnyXHR {

  constructor(hooks = {}, execedHooks = {}) {
    // 单例
    if (AnyXHR.instance) {
      return AnyXHR.instance;
    }

    this.XHR = window.XMLHttpRequest;
    this.proxyXHR = null;

    this.hooks = hooks;
    this.execedHooks = execedHooks;
    this.init();

    AnyXHR.instance = this;
  }

  /**
   * 获取实例
   */
  getInstance() {
    return AnyXHR.instance;
  }

  /**
   * 初始化 重写xhr对象
   */
  init() {
    let _this = this;

    window.XMLHttpRequest = function() {
      this._xhr = new _this.XHR();
      _this.proxyXHR = this;

      _this.overwrite(this);
    }

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
  overwrite(xhr) {
    for (let key in xhr._xhr) {

      if (typeof xhr._xhr[key] === 'function') {
        this.overwriteMethod(key);
        continue;
      }

      this.overwriteAttributes(key);
    }
  }

  /**
   * 重写方法
   * @param {*} key 
   */
  overwriteMethod(key) {
    let proxyXHR = this.proxyXHR;
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
  overwriteAttributes(key) {
    let proxyXHR = this.proxyXHR;

    Object.defineProperty(proxyXHR, key, this.setProperyDescriptor(key));
  }

  /**
   * 生成属性描述 设置代理属性的set和get方法
   */
  setProperyDescriptor(key) {
    let obj = Object.create(null);
    let proxyXHR = this.proxyXHR;
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
        }

        return;
      }

      this._xhr[key] = val;
    }

    obj.get = function() {
      console.log(key);
      return proxyXHR['__' + key] || this._xhr[key];
    }

    return obj;
  }

  /**
   * 删除钩子
   * @param {*} name 
   */
  rmHook(name, isExeced = false) {
    delete (isExeced ? this.execedHooks[name] : this.hooks[name]);
  }

  /**
   * 清空钩子
   */
  clearHook() {
    this.hooks = {};
  }
}

export default AnyXHR;
