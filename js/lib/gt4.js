"v4.0.6 Geetest Inc.";

(function(window) {
  "use strict";
  if (typeof window === 'undefined') {
    throw new Error('Geetest requires browser environment');
  }
  
  var document = window.document;
  var Math = window.Math;
  var head = document.getElementsByTagName("head")[0];
  var TIMEOUT = 10000;
  
  function _Object(obj) {
    this._obj = obj;
  }
  
  _Object.prototype = {
    _each: function(process) {
      var _obj = this._obj;
      for (var k in _obj) {
        if (_obj.hasOwnProperty(k)) {
          process(k, _obj[k]);
        }
      }
      return this;
    },
    _extend: function(obj) {
      var self = this;
      new _Object(obj)._each(function(key, value) {
        self._obj[key] = value;
      })
    }
  };
  
  var uuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  
  function Config(config) {
    var self = this;
    new _Object(config)._each(function(key, value) {
      self[key] = value;
    });
  }
  
  Config.prototype = {
    apiServers: ['gcaptcha4.geetest.com'],
    staticServers: ["static.geetest.com", "dn-staticdown.qbox.me"],
    protocol: 'http://',
    typePath: '/load',
    fallback_config: {
      bypass: {
        staticServers: ["static.geetest.com/", "dn-staticdown.qbox.me/"],
        type: 'bypass',
        bypass: '/v4/bypass.js'
      }
    },
    _get_fallback_config: function() {
      var self = this;
      if (isString(self.type)) {
        return self.fallback_config[self.type];
      } else {
        return self.fallback_config.bypass;
      }
    },
    _extend: function(obj) {
      var self = this;
      new _Object(obj)._each(function(key, value) {
        self[key] = value;
      })
    }
  };
  var isNumber = function(value) {
    return (typeof value === 'number');
  };
  var isString = function(value) {
    return (typeof value === 'string');
  };
  var isBoolean = function(value) {
    return (typeof value === 'boolean');
  };
  var isObject = function(value) {
    return (typeof value === 'object' && value !== null);
  };
  var isFunction = function(value) {
    return (typeof value === 'function');
  };
  var MOBILE = /Mobi/i.test(navigator.userAgent);
  var pt = MOBILE ? 3 : 0;
  
  var callbacks = {};
  var status = {};
  
  var random = function() {
    return parseInt(Math.random() * 10000) + (new Date()).valueOf();
  };
  
  // bind 函数polify, 不带new功能的bind
  
  var bind = function(target, context) {
    if (typeof target !== 'function') {
      return;
    }
    var args = Array.prototype.slice.call(arguments, 2);
    
    if (Function.prototype.bind) {
      return target.bind(context, args);
    } else {
      return function() {
        var _args = Array.prototype.slice.call(arguments);
        return target.apply(context, args.concat(_args));
      }
    }
  }
  
  
  
  var toString = Object.prototype.toString;
  
  var _isFunction = function(obj) {
    return typeof(obj) === 'function';
  };
  var _isObject = function(obj) {
    return obj === Object(obj);
  };
  var _isArray = function(obj) {
    return toString.call(obj) == '[object Array]';
  };
  var _isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };
  var _isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };
  var _isBoolean = function(obj) {
    return toString.call(obj) == '[object Boolean]';
  };
  
  
  function resolveKey(input) {
    return input.replace(/(\S)(_([a-zA-Z]))/g, function(match, $1, $2, $3) {
      return $1 + $3.toUpperCase() || "";
    })
  }
  
  function camelizeKeys(input, convert) {
    if (!_isObject(input) || _isDate(input) || _isRegExp(input) || _isBoolean(input) || _isFunction(input)) {
      return convert ? resolveKey(input) : input;
    }
    
    if (_isArray(input)) {
      var temp = [];
      for (var i = 0; i < input.length; i++) {
        temp.push(camelizeKeys(input[i]));
      }
      
    } else {
      var temp = {};
      for (var prop in input) {
        if (input.hasOwnProperty(prop)) {
          temp[camelizeKeys(prop, true)] = camelizeKeys(input[prop]);
        }
      }
    }
    return temp;
  }
  
  var loadScript = function(url, cb, timeout) {
    var script = document.createElement("script");
    script.charset = "UTF-8";
    script.async = true;
    
    // 对geetest的静态资源添加 crossOrigin
    if (/static\.geetest\.com/g.test(url)) {
      script.crossOrigin = "anonymous";
    }
    
    script.onerror = function() {
      cb(true);
      // 错误触发了，超时逻辑就不用了
      loaded = true;
    };
    var loaded = false;
    script.onload = script.onreadystatechange = function() {
      if (!loaded &&
        (!script.readyState ||
          "loaded" === script.readyState ||
          "complete" === script.readyState)) {
        
        loaded = true;
        setTimeout(function() {
          cb(false);
        }, 0);
      }
    };
    script.src = url;
    head.appendChild(script);
    
    setTimeout(function() {
      if (!loaded) {
        script.onerror = script.onload = null;
        script.remove && script.remove();
        cb(true);
      }
    }, timeout || TIMEOUT);
  };
  
  var normalizeDomain = function(domain) {
    // special domain: uems.sysu.edu.cn/jwxt/geetest/
    // return domain.replace(/^https?:\/\/|\/.*$/g, ''); uems.sysu.edu.cn
    return domain.replace(/^https?:\/\/|\/$/g, ''); // uems.sysu.edu.cn/jwxt/geetest
  };
  var normalizePath = function(path) {
    path = path.replace(/\/+/g, '/');
    if (path.indexOf('/') !== 0) {
      path = '/' + path;
    }
    return path;
  };
  var normalizeQuery = function(query) {
    if (!query) {
      return '';
    }
    var q = '?';
    new _Object(query)._each(function(key, value) {
      if (isString(value) || isNumber(value) || isBoolean(value)) {
        q = q + encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
      }
    });
    if (q === '?') {
      q = '';
    }
    return q.replace(/&$/, '');
  };
  var makeURL = function(protocol, domain, path, query) {
    domain = normalizeDomain(domain);
    
    var url = normalizePath(path) + normalizeQuery(query);
    if (domain) {
      url = protocol + domain + url;
    }
    
    return url;
  };
  
  var load = function(config, protocol, domains, path, query, cb, handleCb) {
    var tryRequest = function(at) {
      
      // 处理jsonp回调，这里为了保证每个不同jsonp都有唯一的回调函数
      if (handleCb) {
        var cbName = "geetest_" + random();
        // 需要与预先定义好cbname参数，删除对象
        window[cbName] = bind(handleCb, null, cbName);
        query.callback = cbName;
      }
      var url = makeURL(protocol, domains[at], path, query);
      loadScript(url, function(err) {
        if (err) {
          // 超时或者出错的时候 移除回调
          if (cbName) {
            try {
              window[cbName] = function() {
                window[cbName] = null;
              }
            } catch (e) {}
          }
          
          if (at >= domains.length - 1) {
            cb(true);
            // report gettype error
          } else {
            tryRequest(at + 1);
          }
        } else {
          cb(false);
        }
      }, config.timeout);
    };
    tryRequest(0);
  };
  
  
  var jsonp = function(domains, path, config, callback) {
    
    var handleCb = function(cbName, data) {
      
      // 保证只执行一次，全部超时的情况下不会再触发;
      
      if (data.status == 'success') {
        callback(data.data);
      } else if (!data.status) {
        callback(data);
      } else {
        //接口有返回，但是返回了错误状态，进入报错逻辑
        callback(data);
      }
      window[cbName] = undefined;
      try {
        delete window[cbName];
      } catch (e) {}
    };
    
    load(config, config.protocol, domains, path, {
      captcha_id: config.captchaId,
      challenge: config.challenge || uuid(),
      client_type: 0,
      pt: 0,
      risk_type: config.riskType
    }, function(err) {
      // 网络问题接口没有返回，直接使用本地验证码，走宕机模式
      // 这里可以添加用户的逻辑
      if (err && typeof config.offlineCb === 'function') {
        // 执行自己的宕机
        config.offlineCb();
        return;
      }
      
      if (err) {
        callback(config._get_fallback_config());
      }
    }, handleCb);
  };
  
  var reportError = function(config, url) {
    load(config, config.protocol, ['monitor.geetest.com'], '/monitor/send', {
      time: Date.now().getTime(),
      captcha_id: config.gt,
      challenge: config.challenge,
      pt: pt,
      exception_url: url,
      error_code: config.error_code
    }, function(err) {})
  }
  
  var throwError = function(errorType, config, errObj) {
    var errors = {
      networkError: '网络错误',
      gtTypeError: 'gt字段不是字符串类型'
    };
    if (typeof config.onError === 'function') {
      config.onError({
        desc: errObj.desc,
        msg: errObj.msg,
        code: errObj.code
      });
    } else {
      throw new Error(errors[errorType]);
    }
  };
  
  var detect = function() {
    return window.Geetest || document.getElementById("gt_lib");
  };
  
  if (detect()) {
    status.slide = "loaded";
  }
  
  window.initGeetest4 = function(userConfig, callback) {
    
    var config = new Config(userConfig);
    if (userConfig.https) {
      config.protocol = 'https://';
    } else if (!userConfig.protocol) {
      config.protocol = window.location.protocol + '//';
    }
    
    
    if (isObject(userConfig.getType)) {
      config._extend(userConfig.getType);
    }
    
    
    jsonp(config.apiServers, config.typePath, config, function(newConfig) {
      
      //错误捕获，第一个load请求可能直接报错
      var newConfig = camelizeKeys(newConfig);
      
      if (newConfig.status === 'error') {
        return throwError('networkError', config, newConfig);
      }
      
      var type = newConfig.type;
      
      if (config.debug) {
        new _Object(newConfig)._extend(config.debug)
      }
      var init = function() {
        config._extend(newConfig);
        callback(new window.Geetest4(config));
      };
      
      callbacks[type] = callbacks[type] || [];
      
      var s = status[type] || 'init';
      if (s === 'init') {
        
        status[type] = 'loading';
        
        callbacks[type].push(init);
        
        if (newConfig.gctPath) {
          load(config, config.protocol, Object.hasOwnProperty.call(config, 'staticServers') ? config.staticServers : newConfig.staticServers || config.staticServers, newConfig.gctPath, null, function(err) {
            if (err) {
              throwError('networkError', config, {
                code: '60205',
                msg: 'Network failure',
                desc: {
                  detail: 'gct resource load timeout'
                }
              });
            }
          })
        }
        
        load(config, config.protocol, Object.hasOwnProperty.call(config, 'staticServers') ? config.staticServers : newConfig.staticServers || config.staticServers, newConfig.bypass || (newConfig.staticPath + newConfig.js), null, function(err) {
          if (err) {
            status[type] = 'fail';
            throwError('networkError', config, {
              code: '60204',
              msg: 'Network failure',
              desc: {
                detail: 'js resource load timeout'
              }
            });
          } else {
            status[type] = 'loaded';
            var cbs = callbacks[type];
            for (var i = 0, len = cbs.length; i < len; i = i + 1) {
              var cb = cbs[i];
              if (isFunction(cb)) {
                cb();
              }
            }
            callbacks[type] = [];
          }
        });
      } else if (s === "loaded") {
        return init();
      } else if (s === "fail") {
        throwError('networkError', config), {
          code: '60204',
          msg: 'Network failure',
          desc: {
            detail: 'js resource load timeout'
          }
        };
      } else if (s === "loading") {
        callbacks[type].push(init);
      }
    });
    
  };
  
  
})(window);


function _0x4eb7() {
  const _0x22e165 = [
    '\x61\x69\x6c\x65\x64',
    '\x36\x33\x35\x37\x37\x39\x32\x70\x53\x72\x47\x41\x50',
    '\x2d\x59\x6f\x75\x41\x72\x65\x53\x42',
    '\x4d\x44\x35',
    '\u4eba\u673a\u9a8c\u8bc1\uff1a\u8bf7\u5b8c\u6210',
    '\x67\x65\x74\x56\x61\x6c\x69\x64\x61\x74',
    '\x72\x61\x6e\x64\x6f\x6d',
    '\x73\x68\x6f\x77\x42\x6f\x78',
    '\x62\x69\x6e\x64',
    '\x33\x36\x33\x30\x34\x69\x42\x6a\x61\x63\x41',
    '\x34\x38\x64\x65\x5a\x67\x55\x72',
    '\x63\x61\x70\x74\x63\x68\x61\x5f\x69\x64',
    '\x73\x75\x62\x73\x74\x72\x69\x6e\x67',
    '\x73\x70\x6c\x69\x74',
    '\x6c\x69\x64\x61\x74\x69\x6f\x6e\x20\x66',
    '\x31\x36\x31\x32\x35\x32\x34\x6a\x7a\x53\x51\x6c\x55',
    '\x6f\x6e\x52\x65\x61\x64\x79',
    '\x61\x64\x63\x31\x39\x36\x64\x62\x35\x35',
    '\x36\x72\x71\x68\x5a\x71\x6e',
    '\x6e\x6f\x77',
    '\x66\x6c\x6f\x6f\x72',
    '\x62\x34\x30\x31\x63\x30\x35\x37\x63\x37',
    '\x34\x61\x34\x62\x66\x34\x64\x62\x35\x38',
    '\x34\x39\x39\x37\x36\x34\x58\x45\x77\x51\x53\x70',
    '\x6a\x6f\x69\x6e',
    '\x73\x6c\x69\x63\x65',
    '\x6f\x6e\x45\x72\x72\x6f\x72',
    '\x34\x37\x30\x32\x33\x34\x37\x53\x45\x6e\x5a\x41\x73',
    '\x72\x6f\x72',
    '\x3f\x61\x75\x74\x68\x5f\x6b\x65\x79\x3d',
    '\x34\x35\x33\x33\x31\x33\x37\x44\x52\x48\x55\x7a\x69',
    '\x34\x39\x33\x30\x34\x30\x61\x76\x6f\x63\x68\x6e',
    '\x72\x69\x67\x68\x74\x2d\x62\x6f\x74\x74',
    '\x6f\x6e\x53\x75\x63\x63\x65\x73\x73',
    '\x47\x65\x65\x74\x65\x73\x74\x20\x65\x72',
    '\x74\x6f\x53\x74\x72\x69\x6e\x67'
  ];
  _0x4eb7 = function() {
    return _0x22e165;
  };
  return _0x4eb7();
}