class AnyXHR {
  constructor(hooklist) {
    this.XHR = XMLHttpRequest;

    this.hooks = [];
  }

  /**
   * 初始化 重写xhr对象
   */
  init() {
    let _this = this;
    
    XMLHttpRequest = function() {
      this.xhr = new _this.XHR;

      for (let [k, v] of this.xhr) {

        if (typeof v === 'function') {

          continue;
        }

        Object.defineProperty(this, k, {
          get() {

          },
          set() {

          },
        })

      }

    }

  }

  /**
   * 添加方法勾子
   * @param {*} name 
   * @param {*} cb 
   */
  addHook(name, cb) {

  }

  rmHook(name) {

  }

  clearHook() {

  }
}