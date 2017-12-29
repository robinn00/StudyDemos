(function(host, undef) {

  /**
   * @class CustomEvent event object class
   * @param {object} target
   * @param {string} type
   * @param {json} eventArgs
   */
  function CustomEvent(target, type, eventArgs) {
    this.target = target;
    this.type = type;
    $.extend(this, eventArgs || {});
  }

  $.extend(CustomEvent.prototype, {
    target: null,
    currentTarget: null,
    type: null,
    returnValue: undef,
    preventDefault: function() {
      this.returnValue = false;
    }
  });

  /**
   * @class CustomEventTargetH  componet event fx
   * @singleton
   */
  var CustomEventTargetH = {
    /**
     * @method on
     * @param {object} target
     * @param {string} sEvent
     * @param {Functor} fn
     * @return {boolean}
     */
    on: function(target, sEvent, fn) {
      var cbs = target.__customListeners && target.__customListeners[sEvent];
      if (!cbs) {
        CustomEventTargetH.createEvents(target, sEvent);
        cbs = target.__customListeners && target.__customListeners[sEvent];
      }
      cbs.push(fn);
      return true;
    },
    /**
     * @method un
     * @param {object} target
     * @param {string} sEvent
     * @param {Functor} fn
     * @return {boolean}
     */
    un: function(target, sEvent, fn) {
      var cbs = target.__customListeners && target.__customListeners[sEvent];
      if (!cbs) {
        return false;
      }
      if (fn) {
        var idx = [].indexOf.call(cbs, fn);
        if (idx < 0) {
          return false;
        }
        cbs.splice(idx, 1);
      } else {
        cbs.length = 0;
      }
      return true;
    },
    fire: function(target, sEvent, eventArgs) {
      if (sEvent instanceof CustomEvent) {
        var customEvent = $.extend(sEvent, eventArgs);
        sEvent = sEvent.type;
      } else {
        customEvent = new CustomEvent(target, sEvent, eventArgs);
      }
      var cbs = target.__customListeners && target.__customListeners[sEvent];
      if (!cbs) {
        CustomEventTargetH.createEvents(target, sEvent);
        cbs = target.__customListeners && target.__customListeners[sEvent];
      }
      if (sEvent != '*') {
        cbs = cbs.concat(target.__customListeners['*'] || []);
      }
      customEvent.returnValue = undef;
      var obj = customEvent.currentTarget = target;

      if (obj && obj['on' + customEvent.type]) {
        var retDef = obj['on' + customEvent.type].call(obj, customEvent); //先调用默认的onxxx
      }
      for (var i = 0; i < cbs.length; i++) {
        cbs[i].call(obj, customEvent);
      }

      return customEvent.returnValue !== false && (retDef !== false || customEvent.returnValue !== undef);
    },
    createEvents: function(target, types) {
      types = types || [];
      if (typeof types == 'string') {
        types = types.split(',');
      }
      var listeners = target.__customListeners = target.__customListeners || {};
      for (var i = 0; i < types.length; i++) {
        listeners[types[i]] = listeners[types[i]] || [];
      }
      listeners['*'] = listeners['*'] || [];
      return target;
    }
  };

  $.extend(host, { //写入宿主
    CETH: CustomEventTargetH
  });
})(window);


(function(host, chrome, undef) {

  var slice = Array.prototype.slice,
    noop = $.noop;

  /**
   * @function exportPath
   * @param1 name
   * @param2 opt_object
   * @param3 opt_objectToExportTo
   */
  function exportPath(name, opt_object, opt_objectToExportTo) {
    var parts = name.split('.');
    var cur = opt_objectToExportTo || host;

    for (var part; parts.length && (part = parts.shift());) {
      if (!parts.length && opt_object !== undefined) {
        // last part and we have an object; use it
        cur[part] = opt_object;
      } else if (part in cur) {
        cur = cur[part];
      } else {
        cur = cur[part] = {};
      }
    }
    return cur;
  };

  /**
   * @function unname
   * @param1 path
   * @param2 obj
   */
  function unname(path, obj) {
    var parts = path.split('.');
    var cur = obj || host;
    var previous = cur;
    for (var part; parts.length && (part = parts.shift());) {
      if (cur[part]) {
        previous = cur;
        cur = cur[part];
      }
    }
    delete previous[part];
  }

  var ChromeWebUIApis = function(opts) {

    var self = this,
      opts = opts || {},
      methods = opts.methods || [];

    $.extend(self, opts);

    if (typeof methods == 'string') {
      methods = methods.split(',');
    }

    methods.forEach(function(methodName) {

      /**
       * reg functor as runtime
       */
      self[methodName] = function( /* ..., callback, callToken, isUnname */ ) { //注册每个chrome接口函数
        var args = slice.call(arguments, 0),
          isUnname = args.length && typeof args[args.length - 1] == 'boolean' && args.pop() || false,
          callToken = args.length && typeof args[args.length - 1] == 'string' && args.pop() || '__' + (+new Date) + '_' + Math.floor(Math.random() * 1e5),
          callback = args.length && typeof args[args.length - 1] == 'function' && args.pop() || noop;

        CETH.on(self, callToken, function(e) {
          callback.apply(self, e.data);
        });

        exportPath(callToken, function(ret) {
            CETH.fire(self, 'after', {
              methodName: methodName,
              data: ret
            });
            // callback.apply(self, slice.call(arguments, 0));
            CETH.fire(self, callToken, {
              data: slice.call(arguments, 0)
            });
            isUnname && unname(callToken, host);
          },
          host);

        try {
          CETH.fire(self, 'before', {
            methodName: methodName,
            args: [callToken].concat(args)
          });
          self.post(methodName, [callToken].concat(args));
        } catch (ex) {
          CETH.fire(self, 'error', {
            methodName: methodName,
            callback: host[callToken]
          });
        }

      };

    });

    CETH.createEvents(this, ChromeWebUIApis.EVENTS);
  };

  ChromeWebUIApis.EVENTS = 'before,after,error';
  ChromeWebUIApis.prototype = {
    post: function(methodName, args) {
      try {
        var cancel = false;
        if (methodName == 'screenShot') {
          if ($(document.body).css('opacity') == '0') {
            cancel = true;
          }
        }
        if (!cancel) {
          chrome.send(methodName, args);
        }
      } catch (e) {}
    }
  };

  $.extend(host, {
    ChromeWebUIApis: ChromeWebUIApis
  });

})(window, window.chrome);

var ntpApis = new ChromeWebUIApis({
  methods: 'screenShot,hideScreenShot,getCurrentURLS,getCustomData,setCustomData,getMostVisitedData,saveMostVisitedURLs,' +
    'captureWebpage,blacklistURLFromMostVisited,onClickThumbnail,openUrl,sendRset,getSmallThumbnail',
  onerror: function(ev) {
    //console.log('error:', arguments);
  },
  onbefore: function(ev) {
    console.log('before call:' + ev.methodName, ev.args, +new Date - st + 'ms(距页面打开)');
  },
  onafter: function(ev) {
    console.log('after call:' + ev.methodName, ev.data, +new Date - st + 'ms(距页面打开)');
  }
});

var api = {
  GetSID: function() {
    if (api.sid) {
      return api.sid;
    }
    try {
      api.sid = external.GetSID(window);
      return api.sid;
    } catch (e) {
      return '';
    }
  },
  GetMID: function() {
    if (api.mid) {
      return api.mid;
    }
    api.mid = api.GetSID() && external.GetMID(api.sid);
    return api.mid
  },
  GetVersion: function() {
    if (api.ver) {
      return api.ver;
    }
    api.ver = api.GetSID() && external.GetVersion(api.sid);
    return api.ver
  }
};

var storage = {
  get: function(key) {
    try {
      return JSON.parse(localStorage[key] || '{}');
    } catch (e) {
      return {};
    }
  },
  set: function(key, subkey, val) {
    var data = this.get(key);
    data[subkey] = val;
    this.setData(key, data);
  },
  setData: function(key, data) {
    localStorage[key] = JSON.stringify(data);
  }
};

var DC = function() {
  var _key = '__ajax_cache';
  var expires = 1000 * 60 * 60;
  var storage = {
    get: function(key) {
      try {
        return JSON.parse(localStorage[key] || '{}');
      } catch (e) {
        return {};
      }
    },
    set: function(key, data) {
      localStorage[key] = JSON.stringify(data);
    },
    getCache: function(key, expire) {
      var cache = storage.get(_key)[key];
      if (cache) {
        expire = expire === undefined ? expires : expire;
        var dist = Date.now() - cache['expires'];
        var expired = dist < 0 || dist > expire;
        if (!expired) {
          return cache['data'];
        }
      }
      return null;
    },
    setCache: function(key, val) {
      var data = storage.get(_key);
      data[key] = {
        data: val,
        expires: Date.now()
      };
      storage.set(_key, data);
    }
  };

  return {
    storage: storage,
    get: function(url, data, success, expire, cacheCallback, error) {
      var cache;
      if (cache = storage.getCache(url, expire)) {
        if (cacheCallback !== false) {
          success(cache);
        }
      } else {
        $.ajax({
          url: url,
          data: data,
          dataType: 'json',
          success: function(data, status) {
            storage.setCache(url, data);
            success(data);
          },
          error: function(xhr, status, e) {
            error && error(xhr, status, e);
          }
        });
      }
    }
  };
}();

var ScreenShot = {
  capture: function(action) {
    /* 信息流每次都变，不适合用贴图了 */
    if ($(document.body).css('opacity') == '0') {
      return;
    }
    if ($('.search-menu').is(':visible') ||
      $('.ac_results').is(':visible') ||
      $('#page-manager').is(':visible') ||
      $('.customs-startup-mask').is(':visible') ||
      $('.screen-mask-guide').is(':visible') ||
      $('.add-url').is(':visible') ||
      $('.setup-pop').hasClass('setup-pop-end')
    ) {
      action = 'delete';
    }
    ntpApis.screenShot(action);
  },
  safeHide: function() {
    var self = this;
    setTimeout(function() {
      self._hideAndCapture();
    }, 1000);
  },
  hideAndCapture: function(arg, firstPageRenered, setWallpapered) {
    var self = this;
    if (firstPageRenered) this.firstPageRenered = true;
    if (setWallpapered) this.setWallpapered = true;
    if (!this.hideScreenShoted && this.firstPageRenered && this.setWallpapered) {
      this.hideScreenShoted = true
      console.log('ScreenShot.hideAndCapture:', arg, +new Date - st + 'ms(距页面打开)');

      var pageId;
      try {
        pageId = ($('.sliders>a.selected').attr('class').replace('selected', '').replace(/\s+/g, ''));
      } catch (e) {}

      var imgs;

      // 对mosts customs 等待图片加载
      if (pageId == 'mosts' || pageId == 'customs') {
        imgs = $('.page-list .current img');
      } else {
        imgs = $();
      }

      var count = imgs.length;
      imgs.each(function() {
        if (this.complete) {
          count--;
        }
      });
      if (count <= 0) {
        console.log('imgs onload:', +new Date - st + 'ms(距页面打开)');
        self._hideAndCapture(arg);
      } else {
        function complete() {
          if (--count <= 0) {
            console.log('imgs onload:', +new Date - st + 'ms(距页面打开)');
            self._hideAndCapture(arg);
          };
        }
        imgs.on('load error', complete);
      }
    } else {
      self.capture(arg);
    }
  },
  _hideAndCapture: function(arg) {
    if (!this.triggerHideScreenShot) {
      this.triggerHideScreenShot = true;
      document.body.style.opacity = 1;
      // 延迟200ms隐藏贴图，防止闪烁
      setTimeout(function() {
        ntpApis.hideScreenShot(0, arg);
        ScreenShot.capture(arg);
      }, 200);
      console.log('### newpages onload timer: ' + Date.now());
      setTimeout(function() {
        $(window).trigger('newpages:firstPageOnLoad');
        window.newpagesFirstPageOnLoad = true;
      });
    }
  }
};

ScreenShot.safeHide();

// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

String.prototype.shorting = function(len, omiss) {
  omiss = omiss || '...';
  if (this.length > len) {
    return this.substr(0, len / 2) + omiss + this.substr(this.length - len / 2);
  } else {
    return this;
  }
};

String.prototype.getFirstLetter = function() {
  var match = this.match(/[\u4E00-\u9FA5\uF900-\uFA2D]|[a-zA-Z0-9]/);
  return match && match[0] || '';
};

String.prototype.getHashCode = function() {
  var str = this;
  var hash = 1315423911,
    i, ch;

  for (i = str.length - 1; i >= 0; i--) {
    ch = str.charCodeAt(i);
    hash ^= ((hash << 5) + ch + (hash >> 2));
  }
  return (hash & 0x7FFFFFFF);
};

function getFirstLetter(str) {
  var e = "",
    i = t.match(/[\u4E00-\u9FA5\uF900-\uFA2D]|[a-zA-Z0-9]/);
  return e = i.length ? i[0] : ""
}

function htmlEncode(str) {
  var div = document.createElement("div");
  var text = document.createTextNode(str);
  div.appendChild(text);
  var ret = div.innerHTML;
  ret = ret.replace(/"/g, '&quot;');
  return ret;
}

function checkUrlProtocol(url) {
  if (url) {
    if (url.substr(0, 7) == 'http://' || url.substr(0, 8) == 'https://' || url.substr(0, 6) == 'ftp://' || url.substr(0, 7) == 'ftps://') {
      return url;
    }
  }
  return '';
}

function filterParam(url) {
  return (url || '').replace(/\?.*$/ig, '');
}

filterUrl.filterRegex = /&?(adsession|key|clientkey|pass|psd|password|usr|user|username|usrname|shoujhao|mima|xingming|userid|usrid|shoujihao|addr|address|dizhi)=[^&]*(&|$)/ig;

function filterUrl(url) {
  return url.replace(filterUrl.filterRegex, '');
}

function openUrl(url) {
  setTimeout(function() {
    ntpApis.openUrl(url, 1, 0, 0);
  });
}


var Stat = {
  init: function() {
    this.allPV();
    this.bindSoHotwordClickPV();
  },
  allPV: function() {
    this.send('40.7042.gif');
    this.send('472.9031.gif');
  },
  searchPV: function() {
    this.send('41.1301.gif');
  },
  bindSoHotwordClickPV: function() {
    var self = this;
    $(document).delegate('.so-hotword a[href]', 'click', function() {
      var gif;
      if (/^ad_/.test($(this).data('from'))) {
        gif = '357.7519.gif';
      } else {
        gif = '357.4373.gif';
      }
      self.send(gif);
    });
  },
  send: function(filename) {
    window._stat_request = new Image();
    _stat_request.src = 'http://dd.browser.360.cn/static/a/' + filename + (filename.indexOf('?') > -1 ? '&' : '?') + Date.now() + Math.random().toString().replace('0.', '').substr(0, 10);
  }
};

$(window).on('newpages:firstPageOnLoad', function() {
  Stat.init();
});

var _nativeLog = console.log;
console.log = localStorage['__debug'] ? _nativeLog : function() {};

﻿(function($) {
  var DEFAULT_LOGO = 'images/dial/default_logo.png';

  var reURL = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z|]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

  function getLetterLogo(item) {
    var title = item.title;
    if (reURL.test(title)) {
      // return '';
    }
    var fl = title.getFirstLetter();
    var hash = item.url.replace(/\/$/, '').getHashCode();
    var bg_idx = (hash % 12) + 1;
    if (bg_idx == 10) {
      bg_idx = 1;
    }
    if (fl) {
      return '<span class="logo-bg default-logo-bg-' + bg_idx + '"><i>' + fl + '</i></span>';
    }
    return '';
  }

  var HotKeyword = function() {
    var keywordData, mvData = [];
    var input, container, toggle;

    function toggleSug(e) {
      if (e && e.button != 0) {
        return;
      }
      hideUpdateNum();
      clearTimeout(window.sug_hide_timeout);
      if (!toggle.hasClass('open')) {
        input.focus();
        if (render()) {
          sugSelect.show('hot-keyword');
          Stat.send('336.5186.gif');
          sendMvStat();
        }
      } else {
        toggle.removeClass('open');
        sugSelect.hide();
      }
      return false;
    }

    function showUpdateNum() {
      if (storage.get('settings')['hide-update-num'] == new Date().Format('yyyy-MM-dd')) {
        return;
      }
      var cat = $('.search-cat .on').attr('cat-name');
      var list = keywordData; // && keywordData[cat];
      var newcount = 0;
      list.forEach(function(item) {
        if (item.new == '1') {
          newcount++;
        }
      });
      if (newcount > 0) {
        $('#search-hotword-update').text(newcount).show();
      }
    }

    function hideUpdateNum() {
      $('#search-hotword-update').hide();
      ScreenShot.capture('delete');
      storage.set('settings', 'hide-update-num', new Date().Format('yyyy-MM-dd'));
    }

    function render() {
      var cat = $('.search-cat .on').attr('cat-name');
      var list = keywordData; // && keywordData[cat];
      if (!list) {
        return false;
      }
      var ul = container.find('ul');
      ul.empty();
      list.forEach(function(item, i) {
        var li = $('<li asin="' + (item.asin || '') + '"><a' + (item.link ? ' href="' + htmlEncode(checkUrlProtocol(item.link)) + '"' : '') + '><em class="hot">' + (i + 1) + '</em><span class="' + (item.new == '1' ? 'new' : '') + '">' + htmlEncode(item.text) + '</span></a></li>');
        ul.append(li);
        item.result = item.text;
        li.data('ac_data', item);
      });
      toggle.addClass('open');
      return true;
    }

    var _mvStatSended = false;

    function sendMvStat() {
      if (_mvStatSended) {
        return;
      }
      _mvStatSended = true;

      var group = [];
      $('.hot-keyword li[asin!=""]').each(function(i, item) {
        group.push($(item).attr('asin'));
        if (i % 10 == 9 || i == ($('.hot-keyword li[asin!=""]').length - 1)) {
          var _stat_name = '_stat_img_' + new Date().getTime();
          window[_stat_name] = new Image();
          window[_stat_name].src = 'https://xd-q.mediav.com/s?type=1&r=20&asin=' + group.join(';');
          group = [];
        }
      });
    }

    return {
      init: function(ele) {
        container = $('.ac_results:first');
        input = ele.on('mousedown', function(e) {
          if (e.button != 0) {
            return;
          }
          if ($(this).val() == '' || $(this).val() == $(this).attr('_placeholder')) {
            toggleSug();
          }
          e.stopPropagation();
        });
        toggle = $('#search-hotword').on('mousedown', toggleSug);
        $('#search-hotword-update').on('mousedown', toggleSug);

        var _requestCount = 2;
        $.ajax({
          url: 'https://show-s.mediav.com/s?pubid=117337&type=1&of=4&tags=70_2%2C80_2%2C53_2',
          data: {},
          dataType: 'jsonp',
          jsonp: 'jsonp',
          success: function(data) {
            data = data && data[0] && data[0].info;
            for (var k in data) {
              mvData = mvData.concat(data[k]);
            }
            if (--_requestCount == 0) {
              HotKeyword.ondata();
            }
          },
          error: function() {
            if (--_requestCount == 0) {
              HotKeyword.ondata();
            }
          }
        });

        DC.get('http://site.browser.360.cn/msgmodel.php?callback=?&mt=["tabssrc"]', {
            v: api.GetVersion()
          },
          function(ret) {
            keywordData = ret && ret.data && ret.data.tabssrc && ret.data.tabssrc.data;
            if (--_requestCount == 0) {
              HotKeyword.ondata();
            }
          });
      },
      ondata: function() {
        var mvDataItem, mvIdx = 0;
        if (keywordData[1] && keywordData[1].locked != true && (mvDataItem = mvData[mvIdx++])) {
          keywordData[1] = {
            text: mvDataItem[0],
            link: mvDataItem[1],
            asin: mvDataItem[3]
          };
        }

        if (keywordData[3] && keywordData[3].locked != true && (mvDataItem = mvData[mvIdx++])) {
          keywordData[3] = {
            text: mvDataItem[0],
            link: mvDataItem[1],
            asin: mvDataItem[3]
          };
        }

        if (keywordData[5] && keywordData[5].locked != true && (mvDataItem = mvData[mvIdx++])) {
          keywordData[5] = {
            text: mvDataItem[0],
            link: mvDataItem[1],
            asin: mvDataItem[3]
          };
        }

        toggle.show();
        showUpdateNum();
      }
    };
  }();

  var RegularKeyword = {
    init: function() {
      var self = this;
      this.bindEvents();
      var surl = 'http://query.rec.360.cn/gasucs/query_rec/?mid=' + api.GetMID() + '&src=newtab&__callback=?&ret_type=jsonp&req=kw';
      var search_cache = DC.storage.getCache(surl, Number.MAX_VALUE);
      // 渲染常搜词
      setTimeout(function() {
        if (self.SoHotWord.acceptSoHotword() && search_cache) {
          self.SoHotWord.execSearchWord(search_cache);
        }
      });
      $(window).on('newpages:firstPageOnLoad', function() {
        /*获取常搜*/
        self.SoHotWord.getSearchWord(surl);
      });
    },
    bindEvents: function() {
      var self = this;
      $(document).on('click', function() {
        $('.so-hotword menu, .so-hotword .confirm').hide();
        $('.so-hotword').removeClass('opening');
      }).on('click', '.so-hotword .rec-setting', function(e) {
        e.stopPropagation();
        $(document).trigger('click');
        $('.so-hotword menu').show();
      }).on('click', '.so-hotword .rec-return', function() {
        $('.so-hotword').removeClass('editing');
      }).on('click', '.so-hotword menu li:eq(0)', function(e) {
        $('.so-hotword').removeClass('opening').addClass('editing');
        self.SoHotWord.reFlow();
      }).on('click', '.so-hotword menu li:eq(1)', function(e) {
        e.stopPropagation();
        $('.so-hotword .confirm').show();
      }).on('click', '.so-hotword .confirm .cancel', function(e) {
        $('.so-hotword .confirm').hide();
      }).on('click', '.so-hotword .confirm .btns a:eq(0)', function(e) {
        self.SoHotWord.stopFeature();
      }).on("click", ".so-hotword li a.del", function() {
        var kw = $(this).attr("data-m");
        self.SoHotWord.worddel($(this));
        storage.set("black_words", kw, 1);
      }).on("click", ".so-hotword a.next", function(e) {
        e.stopPropagation();
        // 隐藏搜索引擎列表框
        var opening = $('.so-hotword').hasClass('opening');
        $(document).trigger('click');
        if (opening) {
          $('.so-hotword').removeClass('opening');
        } else {
          $('.so-hotword').addClass('opening');
          self.SoHotWord.reFlow();
        }
      });
    },
    SoHotWord: {
      line_height: 20,
      $parent: $(".cloud-links"),
      worddel: function(e) {
        var self = this,
          o = self.$parent;
        var idx = e.parent().index();
        o.find('.links ul li').eq(idx).remove();
        o.find('.more-layer ul li').eq(idx).remove();
        self.reFlow();

        var t = o.find("ul");
        if (t.find("a").length == 0) {
          //删完了
          o.empty();
        }

        var mixedMid = api.GetMID();
        var _t = +new Date();
        var kw = e.attr('data-m');
        var oa = hex_md5(mixedMid + kw + _t + 'a%&k*b');
        var params = {
          action: 'del',
          mid: mixedMid,
          src: 'del',
          del_kw: kw,
          oa: oa,
          _t: _t
        };
        $.ajax({
          url: 'http://query.rec.360.cn/gasucs/query_rec/',
          data: params,
          dataType: "jsonp",
          jsonp: "__callback",
          success: function(ret) {}
        });

        DC.storage.setCache(self.surl, null);
      },
      openFeature: function() {
        var self = this;
        storage.set('so_hotword_options', 'enable-push-hotword', true);
        DC.storage.setCache(this.surl, null);

        var mixedMid = api.GetMID();
        var _t = +new Date();
        var oa = hex_md5(mixedMid + _t + 'a%&k*b');
        var params = {
          action: 'reset',
          mid: mixedMid,
          src: 'newtab',
          oa: oa,
          _t: _t
        };
        $.ajax({
          url: 'http://query.rec.360.cn/gasucs/query_rec/',
          data: params,
          dataType: "jsonp",
          jsonp: "__callback",
          success: function(ret) {
            self.getSearchWord(self.surl);
          }
        });
      },
      stopFeature: function() {
        $('#enable-query-rec').attr('checked', false);
        $('.so-hotword menu, .so-hotword .confirm').hide();
        $('.so-hotword').removeClass('so-hotword editing opening');
        storage.set('so_hotword_options', 'enable-push-hotword', false);
        Stat.send('357.202.gif');
        var mixedMid = api.GetMID();
        var _t = +new Date();
        var oa = hex_md5(mixedMid + _t + 'a%&k*b');
        var params = {
          action: 'off',
          mid: mixedMid,
          src: 'newtab',
          oa: oa,
          _t: _t
        };
        $.ajax({
          url: 'http://query.rec.360.cn/gasucs/query_rec/',
          data: params,
          dataType: "jsonp",
          jsonp: "__callback",
          success: function(ret) {}
        });
      },
      acceptSoHotword: function() {
        return storage.get('so_hotword_options')['enable-push-hotword'] !== false;
      },
      hideSearchWord: function() {
        $('#search-form .cloud-links').empty();
      },
      getSearchWord: function(surl) {
        var self = this;
        self.surl = surl;
        if (!self.acceptSoHotword()) {
          return false;
        }

        DC.get(surl, {}, function(ret) {
          if (ret) {
            self.execSearchWord(ret);
          }
        }, 1000 * 60 * 60, false);
      },
      execSearchWord: function(search_data) {
        var self = this;
        self.wordlistTplFn = doT.template($('#so-hostword-list').html());

        if (search_data.length > 0) {
          var data = search_data.slice(0, 30);
          if (!data || data.length == 0) {
            return;
          }
          var html = self.wordlistTplFn(data);
          $('#search-form .cloud-links').addClass("so-hotword").find('.links').html(html);
          $('#search-form .cloud-links .more-layer').html(html);
          self.reFlow();

          var showed = true;
          try {
            var list = [];
            pageManager.getPageList().forEach(function(item) {
              if (item.selected == 'selected') {
                list.push(item.pageId);
              }
            });
            if (list.length == 0 || (list.length == 1 && list[0] == 'video')) {
              showed = false;
            }
          } catch (e) {}
          if (showed) {
            Stat.send('357.689.gif');
          }
        }
      },
      reFlow: function() {
        var prevTop, lineCount;
        $('.so-hotword .links ul li').each(function(i) {
          var top = $(this).offset().top;
          if (prevTop !== undefined && prevTop != top) {
            lineCount = i;
            return false;
          }
          prevTop = top;
        });
        var $lis = $('.so-hotword .more-layer ul li');
        if ($lis.length > lineCount) {
          $('.so-hotword .next').show().find('span').text($lis.length - lineCount);
          $('.so-hotword .more-layer').addClass('show');
          $lis.removeClass('headline').slice(0, lineCount).addClass('headline');
        } else {
          $('.so-hotword .next').hide();
          $('.so-hotword .more-layer').removeClass('show');
        }
      },
      resizeReflow: function() {
        var bodyClass = $('.ntp-body').attr('class');
        if (this.__prevBodyClass != bodyClass) {
          this.reFlow();
          this.__prevBodyClass = bodyClass;
        }
      },
    }
  };

  var SearchForm = function() {
    var searchMaps = {
      so: {
        type: 'so',
        desc: '360搜索',
        url: 'https://www.so.com/s?ie=utf-8&src=se7_newtab_new',
        default_url: 'https://www.so.com/?src=se7_newtab_new',
        key: 'q',
        params: {
          ie: 'utf-8',
          src: 'se7_newtab_new'
        }
      },
      baidu: {
        type: 'baidu',
        desc: '百度',
        url: 'https://www.baidu.com/s?&ie=utf-8',
        key: 'wd',
        params: {
          ie: 'utf-8'
        }
      },
      google: {
        type: 'google',
        desc: '谷歌',
        url: 'http://www.google.com.hk/search?client=aff-cs-360se&ie=UTF-8',
        key: 'q',
        params: {
          client: 'aff-cs-360se',
          ie: 'UTF-8'
        }
      },

      news_so: {
        type: 'news_so',
        desc: '360搜索',
        url: 'http://news.so.com/ns?ie=utf-8&tn=news&src=se7_newtab_new',
        default_url: 'http://sh.qihoo.com/?src=se7_newtab_new',
        key: 'q',
        params: {
          ie: 'utf-8',
          tn: 'news',
          src: 'se7_newtab_new'
        }
      },
      news_baidu: {
        type: 'news_baidu',
        desc: '百度',
        url: 'http://news.baidu.com/ns?&ie=utf-8',
        key: 'word',
        params: {
          ie: 'utf-8'
        }
      },
      news_google: {
        type: 'news_google',
        desc: '谷歌',
        url: 'http://news.google.com.hk/news/search?client=aff-cs-360se&ie=UTF-8',
        key: 'q',
        params: {
          client: 'aff-cs-360se',
          ie: 'UTF-8'
        }
      },

      video_so: {
        type: 'video_so',
        desc: '360搜索',
        url: 'http://video.so.com/v?ie=utf-8&src=se7_newtab_new',
        default_url: 'http://video.so.com/?src=se7_newtab_new',
        key: 'q',
        params: {
          ie: 'utf-8',
          src: 'se7_newtab_new'
        }
      },
      video_baidu: {
        type: 'video_baidu',
        desc: '百度',
        url: 'http://video.baidu.com/v?&ie=utf-8',
        key: 'word',
        params: {
          ie: 'utf-8'
        }
      },
      video_google: {
        type: 'video_google',
        desc: '谷歌',
        url: 'http://www.google.com.hk/search?client=aff-cs-360se&ie=UTF-8',
        key: 'q',
        params: {
          tbm: 'vid',
          client: 'aff-cs-360se',
          ie: 'UTF-8'
        }
      },

      image_so: {
        type: 'image_so',
        desc: '360搜索',
        url: 'http://image.so.com/i?ie=utf-8&src=se7_newtab_new',
        default_url: 'http://image.so.com/?src=se7_newtab_new',
        key: 'q',
        params: {
          ie: 'utf-8',
          src: 'se7_newtab_new'
        }
      },
      image_baidu: {
        type: 'image_baidu',
        desc: '百度',
        url: 'http://image.baidu.com/i?&ie=utf-8',
        key: 'word',
        params: {
          ie: 'utf-8'
        }
      },
      image_google: {
        type: 'image_google',
        desc: '谷歌',
        url: 'http://images.google.com.hk/images?client=aff-cs-360se&ie=UTF-8',
        key: 'q',
        params: {
          client: 'aff-cs-360se',
          ie: 'UTF-8'
        }
      },

      music_so: {
        type: 'music_so',
        desc: '360搜索',
        url: 'http://s.music.so.com/s?ie=utf-8&src=se7_newtab_new',
        default_url: 'http://music.so.com/?src=se7_newtab_new',
        key: 'q',
        params: {
          ie: 'utf-8',
          src: 'se7_newtab_new'
        }
      },
      music_baidu: {
        type: 'music_baidu',
        desc: '百度',
        url: 'http://music.baidu.com/search?&ie=utf-8',
        key: 'key',
        params: {
          ie: 'utf-8'
        }
      },
      music_sogou: {
        type: 'music_sogou',
        desc: '搜狗',
        url: 'http://mp3.sogou.com/music?ie=UTF-8',
        key: 'query',
        params: {
          ie: 'UTF-8'
        }
      },

      map_so: {
        type: 'map_so',
        desc: '360搜索',
        url: 'http://map.so.com/?ie=utf-8&t=map&src=se7_newtab_new',
        default_url: 'http://map.so.com/?src=se7_newtab_new',
        key: 'k',
        params: {
          ie: 'utf-8',
          t: 'map',
          src: 'se7_newtab_new'
        }
      },
      map_baidu: {
        type: 'map_baidu',
        desc: '百度',
        url: 'http://map.baidu.com/m?&ie=utf-8',
        key: 'word',
        params: {
          ie: 'utf-8'
        }
      },
      map_google: {
        type: 'map_google',
        desc: '谷歌',
        url: 'http://ditu.google.cn/maps?client=aff-cs-360se&ie=UTF-8',
        key: 'q',
        params: {
          client: 'aff-cs-360se',
          ie: 'UTF-8'
        }
      },

      wenda_so: {
        type: 'wenda_so',
        desc: '360问答',
        url: 'http://wenda.so.com/search/?ie=utf-8&src=se7_newtab_new',
        default_url: 'http://wenda.so.com/?src=se7_newtab_new',
        key: 'q',
        params: {
          ie: 'utf-8',
          src: 'se7_newtab_new'
        }
      },
      wenda_baidu: {
        type: 'wenda_baidu',
        desc: '百度',
        url: 'http://zhidao.baidu.com/search?&ie=utf-8',
        key: 'word',
        params: {
          ie: 'utf-8'
        }
      },
    };

    var searchTypeMaps = {
      webpage: ['so', 'google', 'baidu'],
      news: ['news_so', 'news_google', 'news_baidu'],
      video: ['video_so', 'video_google', 'video_baidu'],
      image: ['image_so', 'image_google', 'image_baidu'],
      music: ['music_so', 'music_sogou', 'music_baidu'],
      map: ['map_so', 'map_google', 'map_baidu'],
      wenda: ['wenda_so', 'wenda_baidu']
    };

    function saveSetting(item, exec) {
      var settings = localStorage['settings'] = localStorage['settings'] || '{}';
      try {
        settings = JSON.parse(settings);
      } catch (e) {
        settings = {};
      }

      settings[item] = exec;

      localStorage['settings'] = JSON.stringify(settings);
    }

    function loadSettings() {
      var settings = localStorage['settings'] = localStorage['settings'] || '{}';
      try {
        settings = JSON.parse(settings);
      } catch (e) {
        settings = {};
      }
      for (var k in settings) {
        try {
          eval(settings[k]);
        } catch (e) {}
      }
      setSearchType('webpage');
    }

    function setSearchType(type) {
      $('.search-cat > a').removeClass('on').filter('[cat-name=' + type + ']').addClass('on');
      var engines = searchTypeMaps[type];
      if (engines) {
        $('.search-menu').empty();
        engines.forEach(function(sn) {
          var item = searchMaps[sn] || {};
          $('.search-menu').append('<li><a __href="#" class="' + item.type + '"></a>' + item.desc + '</li>');
        });
        var jitem = $('.search-menu .' + storage.get('default_engine')[type]);
        if (jitem.length == 0) {
          jitem = $('.search-menu a:first');
        }
        jitem.trigger('click');

        saveSetting('search_type', 'setSearchType("' + type + '")');

        return true;
      }
      return false
    }

    function setSearch(searchItem) {
      $('#search-form .btn :submit').val(searchItem.type == 'so' ? '搜一下' : '搜索一下');
      $('#search-switch>a')[0].className = searchItem.type;
      $('#search-form').attr('action', searchItem.url);
      $('#search-kw').attr('name', searchItem.key);
      // $('#search-kw').attr('placeholder', searchItem.desc);

      $('#search-form input[type=hidden]').remove();

      $('#search-form').attr('default-url', searchItem.default_url || '');

      var params = searchItem.params;
      if (params) {
        for (var k in params) {
          var hInput = document.createElement('input');
          hInput.type = 'hidden';
          hInput.name = k;
          hInput.value = params[k];
          $('#search-form').append(hInput);
        }
      }
    }

    function bindEvents() {
      $('#search-form').on('submit', function() {
        Stat.searchPV();
      });
      // 切换搜索引擎
      $('#search-switch').on('click', function() {
        var menu = $('.search-menu');
        if (menu.is(':visible')) {
          menu.slideUp();
        } else {
          menu.slideDown();
        }
      });
      $(document).on('click', function(e) {
        if (e.target.id != 'search-switch' && !$(e.target).parents('#search-switch').length && !$(e.target).parents('.search-menu').length) {
          $('.search-menu').slideUp();
        }
      });
      // 切换搜索引擎菜单项
      $(document).delegate('.search-menu li', 'click', function(e) {
        var searchItem;
        if (searchItem = searchMaps[e.target.className] || searchMaps[e.target.firstElementChild.className]) {
          setSearch(searchItem);

          if ($('.search-menu').is(':visible')) {
            $('.search-menu').slideUp(function() {
              $(this).removeClass('open');
              if ($('#search-kw').val() == '') {
                ScreenShot.capture('SearchEngineChanged');
              } else {
                ScreenShot.capture('delete');
              }
            });

            saveSetting('search', 'setSearch(' + JSON.stringify(searchItem) + ');');
            storage.set('default_engine', $('.search-cat .on').attr('cat-name'), searchItem.type);
          }
        }
      });
    }

    function init() {
      bindEvents();
      loadSettings();

      // autocomplete
      $('#search-kw').autocomplete('http://sug.so.360.cn/suggest?encodein=utf-8&encodeout=utf-8', {
        zhida: true,
        selectFirst: false,
        type: 'jsonp',
        dataType: 'jsonp',
        scrollHeight: 300,
        offset: {
          left: -1,
          top: 0
        },
        onbeforeshow: function(callback) {
          var searchMenu = $('.search-menu');
          searchMenu.hide();
          callback && callback();
          return true;
        },
        parse: function(data) {
          var parsed = [];
          data.s.forEach(function(v) {
            parsed.push({
              data: [v],
              value: v,
              result: v
            });
          });
          return parsed;
        }
      }).on('result', function(e, data) {
        Stat.searchPV();
        if (data.link) {
          //location = data.link;
          openUrl(data.link);
          return;
        }
        var $searchForm = $(this).parents('form');
        $searchForm.find(':hidden[name="src"]').val(
          $('.ac_results:first').hasClass('hot-keyword') ? 'se7_newtab_new_hot' : 'se7_newtab_new'
        );
        $searchForm[0].submit();
      });

      // 常搜词
      RegularKeyword.init();

      // hotkeyword
      $(window).on('newpages:firstPageOnLoad', function() {
        HotKeyword.init($('#search-kw'));
      });

    }
    return {
      init: init
    }
  }();

  var AddUrlDlg = function() {
    var _type;
    var networkError = false;
    var sitesData, mostVisitedData = [];
    var $error = $('.add-url-dlg .custom form .error');
    var listTmplFn = doT.template($('#addurl-list-tmpl').html());

    function show(type) {
      if ($('.add-url-dlg').is(':hidden')) {
        // 不更新最常访问，否则编辑项找不到，添加失败
        // MostVisitedDial.dontRefreshMosts = true;
        MostVisitedDial.dontRefreshMostsCount++;
      }
      _type = type;
      var $edit = $('.tile.edit');
      var $link = $edit.find('.link');
      if ($link.length > 0) {
        //edit
        $('#addurl-title').val($link.attr('title'));
        $('#addurl-url').val($link.attr('href'));
        if ($link.find('img').length > 0) {
          $('#addurl-logo').html('<img src="' + $link.find('img').attr('src') + '">');
        } else {
          $('#addurl-logo').html($link.find('.logo-bg').clone());
        }
      } else {
        //add
        $('#addurl-title, #addurl-url').val('');
        $('#addurl-logo').html('<img src="' + DEFAULT_LOGO + '">');
      }
      $error.hide();
      showTab('mosts');
      $('.add-url-dlg').show();
      $('.ntp-body').append('<div class="mask"></div>');
    }

    function hide() {
      if ($('.add-url-dlg').is(':hidden')) {
        return;
      }
      // MostVisitedDial.dontRefreshMosts = false;
      MostVisitedDial.dontRefreshMostsCount--;
      $('.ntp-body > .mask').remove();
      $('.add-url-dlg').hide();
      $('.tile.edit').removeClass('edit');
      // 触发repaint，解决渲染残留BUG: 95609
      $(document.body).css({
        opacity: .99
      });
      setTimeout(function() {
        $(document.body).css({
          opacity: 1
        });
      }, 0);
    }

    function showTab(name) {
      $('.add-url-dlg .url-cats a').removeClass('current').filter('[data-cat=' + name + ']').addClass('current');
      if (sitesData) {
        buildTab();
      } else {
        $(AddUrlDlg).on('loaddata', buildTab);
      }
    }

    function buildTab() {
      var name = $('.add-url-dlg .url-cats .current').data('cat');
      var data = sitesData[name];
      if (name == 'mosts') {
        data = mostVisitedData;
      }
      render(data);
    }

    function render(list) {
      list = list || [];

      var newList = [];
      $.each(list, function(i, item) {
        if (!(item.title && item.url)) {
          return;
        }
        var added;
        var urlKey = item.url;
        if (urlKey && urlKey.substr(-1) == '/') {
          urlKey = urlKey.substr(0, urlKey.length - 1);
        }
        if (_type == 'mosts') {
          added = MostVisitedDial.mostsShowedMap[urlKey] || MostVisitedDial.mostsShowedMap[urlKey + '/'];
        } else {
          added = MostVisitedDial.customsShowedMap[urlKey] || MostVisitedDial.customsShowedMap[urlKey + '/']
        }
        if (item.hasOwnProperty('logo_se82')) {
          // 没有logo的，先不显示
          if (!item.logo_se82) {
            return;
          }
          item.logo = item.logo_se82 || DEFAULT_LOGO;
        }
        if (item.logo == DEFAULT_LOGO) {
          item.letterLogo = getLetterLogo(item);
        }
        item.added = added;
        newList.push(item);
      });

      var html = listTmplFn(newList);
      if (networkError && newList.length == 0) {
        html = '<div class="loaderror">无法连接到服务器，请检查网络后<a class="reload">点此重试</a></div>';
      }
      $('.add-url-dlg .logo-list').html(html);
    }

    function removeMosts(url) {
      var name = $('.add-url-dlg .url-cats .current').data('cat');
      if (name != 'mosts') {
        return;
      }

      $('.add-url-dlg .logo-list li[data-url="' + url + '"], .add-url-dlg .logo-list li[data-url="' + url + '/"]').remove();
    }

    function reloadChecked() {
      $('.add-url-dlg .logo-list li').each(function() {
        var added;
        var urlKey = $(this).data('url');
        if (urlKey && urlKey.substr(-1) == '/') {
          urlKey = urlKey.substr(0, urlKey.length - 1);
        }
        if (_type == 'mosts') {
          added = MostVisitedDial.mostsShowedMap[urlKey] || MostVisitedDial.mostsShowedMap[urlKey + '/'];
        } else {
          added = MostVisitedDial.customsShowedMap[urlKey] || MostVisitedDial.customsShowedMap[urlKey + '/']
        }

        if (added) {
          $(this).addClass('added');
        } else {
          $(this).removeClass('added');
        }
      });
    }

    function bindEvents() {
      $('.add-url-dlg .close').on('click', function() {
        AddUrlDlg.hide();
      });

      $('.add-url-dlg form').on('submit', function(e) {
        e.preventDefault();

        var title = $('#addurl-title').val().trim(),
          url = $('#addurl-url').val();

        if (url && !/^(https?):\/\//i.test(url)) {
          url = 'http://' + url;
        }
        url = url.replace(/\|/g, '%7c');

        if (!reURL.test(url)) {
          $('#addurl-url').focus();
          if (url != '') {
            $error.html('网址输入有误，请确认后重试').show();
          }
          return;
        }

        var ret = MostVisitedDial.addTile(title, url);
        if (ret === true) {
          AddUrlDlg.hide();
        } else {
          $error.html(ret).show();
        }
      });

      $('#addurl-url').on('input', function(e) {
        var url = $('#addurl-url').val();

        if (url && !/^(https?):\/\//i.test(url)) {
          url = 'http://' + url;
        }
        url = url.replace(/\|/g, '%7c');
        if (reURL.test(url)) {
          $error.hide();
        }
      });

      $('.add-url-dlg .url-cats a').on('click', function() {
        showTab($(this).data('cat'));
      });

      $('.add-url-dlg').delegate('.logo-list li', 'click', function() {
        $('#addurl-title').val($(this).data('title'));
        $('#addurl-url').val($(this).data('url'));

        if ($(this).find('img').length > 0) {
          $('#addurl-logo').html('<img src="' + $(this).find('img').attr('src') + '">');
        } else {
          $('#addurl-logo').html($(this).find('.logo-bg').clone());
        }
        // $('#addurl-logo img').attr('src', $(this).find('img').attr('src'));
        $('.add-url-dlg form').submit();
      }).delegate('.loaderror .reload', 'click', loadData);
    }

    function loadData() {
      $('.add-url-dlg .logo-list .loaderror').hide();
      DC.get('http://site.browser.360.cn/csite.php?callback=?', {
          rn: Date.now(),
          v: api.GetVersion()
        },
        function(ret) {
          networkError = false;
          sitesData = ret && ret.data;
          $(AddUrlDlg).trigger('loaddata');
        },
        1000 * 60 * 60,
        true,
        function() {
          networkError = true;
          sitesData = {};
          setTimeout(function() {
            $('.add-url-dlg .logo-list .loaderror').show();
          }, 200);
        }
      );
    }

    function init() {
      bindEvents();
      loadData();
    }

    $(window).on('newpages:firstPageOnLoad', function() {
      init();
    });

    return {
      show: show,
      hide: hide,
      removeMosts: removeMosts,
      reloadChecked: reloadChecked,
      set mostVisitedData(value) {
        mostVisitedData = value;
      },
      get mostVisitedData() {
        return mostVisitedData;
      }
    };
  }();

  var ThumbnailManager = function() {
    var thumbnailCache;
    var updateUrlList = [];
    var CACHE_KEY = 'thumbnail_cache';
    var expires = 1000 * 60 * 60 * 24;

    function getLogo(url) {
      if (!thumbnailCache) {
        thumbnailCache = storage.get(CACHE_KEY);
      }
      var dist = Date.now() - thumbnailCache['__update_time'];
      var expired = dist < 0 || dist > expires;
      var cloudLogo = thumbnailCache[url];
      if (!cloudLogo) {
        cloudLogo = thumbnailCache[url + '/'];
      }
      if (cloudLogo == undefined || expired) {
        updateUrlList.push(url);
      }
      return (cloudLogo && cloudLogo.logo) || DEFAULT_LOGO;
    }

    function setLogos(list) {
      list.forEach(function(item) {
        if (item.url) {
          item.logo = getLogo(item.url);
        }
      });
      update();
    }

    var _prevUrls_max20 = [];
    var _timer_reset_prevurls

    function getSmallThumbnail(urls_max20) {
      // 过滤重复请求
      if (_prevUrls_max20.toString() == urls_max20.toString()) {
        clearTimeout(_timer_reset_prevurls);
        _timer_reset_prevurls = setTimeout(function() {
          _prevUrls_max20 = [];
        }, 3000);
        return;
      }

      _prevUrls_max20 = urls_max20;
      ntpApis.getSmallThumbnail(urls_max20, function(data) {
        data = data || [];
        if (data.length == 0) {
          return;
        }
        data.forEach(function(item) {
          var url = item[0];
          var logo = item[1];
          var title = item[2];
          if (url != '') {
            storage.set(CACHE_KEY, url, {
              logo: logo,
              title: title
            });
          }
          if (logo != '') {
            // update grid logo
            try {
              var $tileImg = $('.wrap-new .tile .link[href="' + url + '"] img');
              if ($tileImg.length == 0) {
                $tileImg = $('.wrap-new .tile .link[href="' + url.substr(0, url.length - 1) + '"] img');
              }
              if ($tileImg.length > 0) {
                $tileImg.attr('src', logo);
              } else {
                $tileImg = $('.wrap-new .tile .link[href="' + url + '"] .logo-bg');
                if ($tileImg.length == 0) {
                  $tileImg = $('.wrap-new .tile .link[href="' + url.substr(0, url.length - 1) + '"] .logo-bg');
                }
                $tileImg.replaceWith('<img src="' + logo + '" onerror="src=\'images/dial/default_logo.png\'">');
              }
            } catch (e) {}
          }
        });
        storage.set(CACHE_KEY, '__update_time', Date.now());

        thumbnailCache = storage.get(CACHE_KEY);
        // 更新添加网址对话框，最常访问logo
        AddUrlDlg.mostVisitedData.forEach(function(item) {
          var logo = thumbnailCache[item.url] && thumbnailCache[item.url].logo;
          if (logo) {
            item.logo = logo;
            item.letterLogo = '';
          } else {
            logo = DEFAULT_LOGO;
          }
        });
      });
    }

    function update() {
      var groupLen = 20;
      for (var i = 0; i < Math.ceil(updateUrlList.length / groupLen); i++) {
        var group = updateUrlList.slice(i * groupLen, i * groupLen + groupLen);
        getSmallThumbnail(group);
      }

      updateUrlList = [];
    }

    return {
      getLogo: getLogo,
      setLogos: setLogos,
      update: update
    };
  }();

  window.MostVisitedDial = function() {
    var GRID_COUNT = 12;
    var dontRefreshMosts = false;
    var dontRefreshMostsCount = 0;
    var tileTmplFn = doT.template($('#tile-tmpl').html()),
      emptyTileTmplFn = doT.template($('#tile-empty-tmpl').html()),
      tileAddTmpl = $('#tile-add-tmpl').html();
    var mostsShowedMap = {},
      customsShowedMap = {};

    function buildDataGrid(type, data, clear) {
      if (type == 'mosts') {
        // if (dontRefreshMosts) {
        if (dontRefreshMostsCount > 0) {
          return;
        }
        mostsShowedMap = {};
      } else {
        customsShowedMap = {};
      }

      var $container = $('.dial ul.' + type);
      // if (clear)
      {
        $container.empty();
      }

      var elis = $container.children();
      var idx = 0;
      data.every(function(item, i) {
        var tile;
        if (item.url) {
          item.url = checkUrlProtocol(item.url);
        }
        if (item.url) {
          if (item.logo == DEFAULT_LOGO) {
            item.letterLogo = getLetterLogo(item);
          }
          if (item.pinned_type != undefined) item.pinned_type = item.pinned_type.toString();
          if (type == 'mosts') {
            mostsShowedMap[item.url] = item;
          } else {
            customsShowedMap[item.url] = item;
          }
          tile = tileTmplFn(item).trim();
          idx++;
        } else {
          // tile = emptyTileTmplFn(item).trim();
        }
        var current = elis.eq(i);
        if (current.length > 0) {
          if (current.find('.link').attr('href') != item.url) {
            current.replaceWith(tile);
          }
        } else {
          $container.append(tile);
        }

        if (idx < GRID_COUNT) {
          return true;
        } else {
          return false;
        }
      });

      if (idx < GRID_COUNT && $container.find('.tile-add').length == 0) {
        $container.append(tileAddTmpl);
      }

      if ($container.is(':visible')) {
        // ScreenShot.hideAndCapture(type + '-Rendered', true, true);
      }
    }

    function showDial(type) {
      AddUrlDlg.hide();
      if (['mosts', 'customs'].indexOf(type) < 0) {
        // 继承
        try {
          var oldVerSliders = storage.get('sliders');
          var oldSelected = oldVerSliders['page-list'][oldVerSliders['default']];
          type = oldSelected && oldSelected.pageId;
        } catch (e) {}
        if (['mosts', 'customs'].indexOf(type) < 0) {
          type = 'mosts';
        }
      }
      $('.dial > ul').hide()
        .filter('.' + type).show();
      $('.dial-nav > a').removeClass('current')
        .filter('[data-type="' + type + '"]').addClass('current');
      storage.set('settings', 'dial-current-show', type);
      // ScreenShot.capture('');
    }

    function bindEvents() {
      var $menu = $('.dial-menu');
      $(window).on('resize', function() {
        $menu.hide();
      });
      $(document).delegate('.dial-nav > a', 'click', function() {
        showDial($(this).data('type'));
        // click nav stat
        switch ($(this).data('type')) {
          case 'mosts':
            Stat.send('472.587.gif');
            break;
          case 'customs':
            Stat.send('472.6958.gif');
            break;
        }
      }).delegate('.wrap-new .tile-add', 'click', function() {
        $('.tile.edit').removeClass('edit');
        $(this).parent('.tile').addClass('edit');
        AddUrlDlg.show($(this).parents('ul').attr('class'));
      }).delegate('.wrap-new .tile-add', 'mousedown', function(e) {
        // 阻止添加按钮图片拖动
        e.preventDefault();
      }).delegate('.dial .tile .link', 'contextmenu', function(e) {
        e.preventDefault();

        // dontRefreshMosts = true;
        dontRefreshMostsCount++;
        var link = $(this);
        var $pin_edit = $menu.find('.pin-edit');
        if (link.parents('ul').attr('class') == 'mosts') {
          $pin_edit.text(link.attr('pinned_type') == 1 ? '解锁' : '锁定');
        } else {
          $pin_edit.text('编辑');
        }
        $menu.data({
          target: link
        }).css({
          left: e.clientX + $('body').scrollLeft() - 1,
          top: e.clientY + $('body').scrollTop() - 1
        }).show();
      }).delegate('', 'mousedown', function() {
        if ($menu.is(':visible')) {
          $menu.hide();
          dontRefreshMostsCount--;
        }
      }).delegate('.dial-menu', 'mousedown', function(e) {
        e.stopPropagation();
      }).delegate('.dial-menu li', 'click', function(e) {
        var link = $menu.data('target');
        var type = link.parents('ul').attr('class');
        switch ($(this).attr('class')) {
          case 'pin-edit':
            if (type == 'mosts') {
              changePinnedState(link, link.attr('pinned_type') == 1 ? 0 : 1);
            } else {
              $('.tile.edit').removeClass('edit');
              link.parent('.tile').addClass('edit');
              AddUrlDlg.show(type);
            }
            break;
          case 'remove':
            removeTile(link);
            break;
        }
        $menu.hide();
        dontRefreshMostsCount--;
      });
    }

    function saveGrid(type, addedUrl) {
      var tiles = parseGrid('.wrap-new .' + type + ' .tile:not(.add)');

      // 更新添加对话框勾选状态
      if (type == 'mosts') {
        mostsShowedMap = {};
      } else {
        customsShowedMap = {};
      }
      tiles.forEach(function(tile) {
        if (type == 'mosts') {
          mostsShowedMap[tile.url] = tile;
        } else {
          customsShowedMap[tile.url] = tile;
        }
      });
      AddUrlDlg.reloadChecked();


      if (type == 'mosts') {
        // 过滤重复
        var _mostsFilterMap = {};
        tiles = tiles.filter(function(tile) {
          if (_mostsFilterMap[tile.url]) {
            return false;
          }
          _mostsFilterMap[tile.url] = tile;
          return true;
        });
      }

      var method = type == 'customs' ? 'setCustomData' : 'saveMostVisitedURLs';
      ntpApis[method](JSON.stringify(tiles), function() {});

      if (type == 'mosts') {
        // 另一屏数据刷新
        if (addedUrl) {
          ntpApis.captureWebpage(addedUrl, function(args) {});
          addedUrl = '';
        }
        setTimeout(function() {
          OldMostVisitedDial.renderMostsData(false, function() {});
        }, 500);
      }
      // ScreenShot.capture('DataChanged');
    }

    function parseGrid(sel) {
      var tiles = [];
      $(sel).each(function(i, tile) {
        var pinned_type = parseInt($('.link', tile).attr('pinned_type') || 1);
        var link = $('.link', tile);
        tiles.push({
          title: link.attr('title') || '',
          url: link.attr('href') || '',
          pinned_type: isNaN(pinned_type) ? 1 : pinned_type
        });

      });
      return tiles;
    }

    function changePinnedState(link, pinned_type) {
      link.attr('pinned_type', pinned_type);
      saveGrid('mosts');
    }

    function addTile(title, url) {
      var item = {
        title: title || url,
        url: url,
        logo: ThumbnailManager.getLogo(url),
        pinned_type: 1
      };
      if (item.logo == DEFAULT_LOGO) {
        item.letterLogo = getLetterLogo(item);
      }
      var tile = tileTmplFn(item).trim();

      ThumbnailManager.update();

      var $edit = $('.tile.edit');
      var $container = $edit.parent('ul');
      var type = $container.attr('class');
      // 最常访问，不允许重复格子
      if (type == 'mosts') {
        try {
          var exists = false;
          $('.wrap-new .mosts .tile a.link').each(function() {
            var _url = this.href;
            _url = _url.replace(/\/$/i, '');
            var _addurl = url;
            _addurl = _addurl.replace(/\/$/i, '');
            if (_addurl == _url) {
              exists = true;
              $edit = $(this).parents('.tile');
              return false;
            }
          });
          if (exists) {
            return '网站已存在';
          }
        } catch (e) {}

        // 添加/删除最常访问时，3秒内不接受数据更新，防止添加按钮点击无反应和图标闪烁
        dontRefreshMostsCount++;
        setTimeout(function() {
          dontRefreshMostsCount--;
        }, 3000);

      }
      if ($edit.find('.tile-add').length > 0) {
        $edit.before(tile);
        if ($container.children('.tile:not(.empty)').length > GRID_COUNT) {
          $edit.remove();
        }
      } else {
        var url = $edit.find('.link').attr('href');
        $edit.replaceWith(tile);
      }

      saveGrid(type, url);
      // 更新添加网址对话框最常访问数据
      if (type == 'mosts') {
        setTimeout(function() {
          ntpApis.getMostVisitedData(function(data) {
            ThumbnailManager.setLogos(data);
            AddUrlDlg.mostVisitedData = data;
            return arguments.callee;
          });
        }, 0);
      }
      return true;
    }

    function removeTile(link) {
      var needSetEdit = false;
      var updateAddurlForm = false;
      var type = link.parents('ul').attr('class');
      var url = link.attr('href');
      var $tile = link.parent('li');
      if (type == 'mosts') {
        // 删除锁定
        $tile.remove();
        if (link.attr('pinned_type') == 1) {
          saveGrid(type);
        }
        // 删除最常访问
        ntpApis.blacklistURLFromMostVisited(url);

        // renderMostsData(true);
        AddUrlDlg.removeMosts(url);
      } else {
        if ($tile.hasClass('edit')) {
          updateAddurlForm = true;
          var $next = $tile.next();
          if ($next.length > 0) {
            $next.addClass('edit');
          } else {
            needSetEdit = true;
          }
        }
        $tile.remove();
        saveGrid(type);
      }

      var $container = $('.dial ul.' + type);
      if ($container.children('.tile').length < GRID_COUNT && $container.find('.tile-add').length == 0) {
        $container.append(tileAddTmpl);
        if (needSetEdit) {
          $container.find('.tile.add').addClass('edit');
        }
      }

      if (updateAddurlForm) {
        // update addurl form data
        AddUrlDlg.show(type);
      }
    }

    function renderMostsData(clear) {
      // dontRefreshMosts = false;
      ntpApis.getMostVisitedData(function(data) {
        console.log('new-getMostVisitedData 回调函数被调用:', +new Date - st + 'ms(距页面打开)', arguments, 'dontRefreshMostsCount:', dontRefreshMostsCount);
        ThumbnailManager.setLogos(data);
        buildDataGrid('mosts', data, clear);
        // $('.mosts').sortable();
        AddUrlDlg.mostVisitedData = data;
        // dontRefreshMosts = true;
        return arguments.callee;
      }, 'getMostVisitedData_callback');
    }

    function renderCustomsData(clear) {
      ntpApis.getCustomData(function(data) {
        console.log('getCustomData 回调函数被调用:', +new Date - st + 'ms(距页面打开)', arguments);
        ThumbnailManager.setLogos(data);
        buildDataGrid('customs', data, clear);
        return arguments.callee;
      });
    }

    function initSortable() {
      var DISTANCE = 5;
      var type, rectsCache;
      var dragObj, targetDrag, mousedownEvent, $dragHolder;

      function getDragRects(selector) {
        var dragRects = [];
        $(selector).each(function(index, item) {
          var jItem = $(item),
            offset = jItem.offset();
          dragRects.push(item.rect = {
            index: index,
            drag: item,
            left: offset.left,
            top: offset.top,
            right: offset.left + jItem.outerWidth(),
            bottom: offset.top + jItem.outerHeight()
          });
        });
        return dragRects;
      }

      function mousemove(e) {
        if (!mousedownEvent) {
          return;
        }
        e.preventDefault();
        if (!dragObj) {
          if (Math.max(
              Math.abs(mousedownEvent.pageX - e.pageX),
              Math.abs(mousedownEvent.pageY - e.pageY)
            ) >= DISTANCE) {
            dragObj = mousedownEvent.target;

            type = $(dragObj).parent('ul').attr('class');
            rectsCache = getDragRects('.' + type + ' > li[class="tile"]'); //get all dragbox rectangle

            mousedownEvent.position = $(dragObj).position();
            mousedownEvent.index = $(dragObj).index();

            $dragHolder = $(dragObj).clone().css('visibility', 'hidden').addClass('drag-holder');

            $(dragObj).css({
              'position': 'absolute',
              'z-index': 1000,
              'left': e.pageX - mousedownEvent.pageX + mousedownEvent.position.left,
              'top': e.pageY - mousedownEvent.pageY + mousedownEvent.position.top,
            });

            $(dragObj).after($dragHolder);
          }
        } else {
          $(dragObj).css({
            'left': e.pageX - mousedownEvent.pageX + mousedownEvent.position.left,
            'top': e.pageY - mousedownEvent.pageY + mousedownEvent.position.top,
          });

          var hitRect;
          rectsCache.every(function(rect) { //拿到当前mousemove命中到的元素
            if (e.pageX > rect.left && e.pageX < rect.right) {
              if (e.pageY > rect.top && e.pageY < rect.bottom) {
                hitRect = rect;
                return false;
              }
            }
            return true;
          });

          if (hitRect) {
            if (targetDrag != hitRect.drag) {
              targetDrag = hitRect.drag;
              // console.log(mousedownEvent.index, hitRect.index);
              if (mousedownEvent.index < hitRect.index) {
                $(targetDrag).after($dragHolder);
              } else {
                $(targetDrag).before($dragHolder);
              }
            }
          }
        }
      }
      $(document).delegate('.dial li[class="tile"]', 'mousedown', function(e) {
        if (e.button !== 0) {
          return;
        }
        // dontRefreshMosts = true;
        dontRefreshMostsCount++;
        mousedownEvent = e;
        mousedownEvent.target = this;
        $(document).on('mousemove', mousemove);
      });
      $(document).on('mouseup', function(e) {
        $(document).off('mousemove', mousemove);
        if (dragObj) {
          $(dragObj).removeAttr('style');
          $dragHolder.after(dragObj);
          $dragHolder.remove();

          if ($(dragObj).index() != mousedownEvent.index) {
            if (type == 'mosts') {
              changePinnedState($(dragObj).find('.link'), 1);
            } else {
              saveGrid(type);
            }
          }
        }
        if (mousedownEvent) {
          setTimeout(function() {
            mousedownEvent = dragObj = null;
            // dontRefreshMosts = false;
            dontRefreshMostsCount--;
          }, 0);
        }
      });
      $(document).delegate('.dial li[class="tile"]', 'click', function(e) {
        if (dragObj) {
          e.preventDefault();
        }
      });
    }

    function init() {
      bindEvents();
      initSortable();
      showDial(storage.get('settings')['dial-current-show']);

      renderMostsData();
      renderCustomsData();
    }

    return {
      init: init,
      addTile: addTile,
      renderMostsData: renderMostsData,
      get mostsShowedMap() {
        return mostsShowedMap;
      },
      get customsShowedMap() {
        return customsShowedMap;
      },
      set dontRefreshMosts(value) {
        dontRefreshMosts = value;
      },
      get dontRefreshMostsCount() {
        return dontRefreshMostsCount;
      },
      set dontRefreshMostsCount(value) {
        dontRefreshMostsCount = value;
      }
    };
  }();


  SearchForm.init();
  MostVisitedDial.init();

  $(document.body).css({
    opacity: 1
  });


})(jQuery);

(function($) {

  var AddUrlDlg = function() {
    var inited = false;
    var sitesData;

    function init() {
      if (inited) {
        return;
      }
      inited = true;
      bindEvents();
      loadData();
    }

    function bindEvents() {
      $('.add-url .url-cats li').on('click', function() {
        showTab($(this).attr('cat-name'));
      });
      $('input[name=add-url-q]').on('search', function(e) {
        var q = $(this).val();
        if (q) {
          search(q);
        } else {
          buildTab();
        }
      });
      $('.add-url .recommend .loaderror .reload').on('click', loadData);

      $(document).delegate('#add-url-form input[type=text]', 'keypress', function(e) {
        if (e.charCode == 13) {
          $('#js-addurl-url').trigger('blur');
          $('#add-url-form').trigger('submit');
        }
      }).delegate('.url-often li', 'click', function(e) {
        $('#js-addurl-title').val($(this).text().trim());
        $('#js-addurl-url').val($('a', this).attr('href'));
        e.preventDefault();
      }).delegate('.url-often li', 'dblclick', function(e) {
        $('#js-addurl-title').val($(this).text().trim());
        $('#js-addurl-url').val($('a', this).attr('href'));
        $('#js-addurl-confirm').trigger('click');
        e.preventDefault();
      });

      $('#js-addurl-url').on('blur', function(e) {
        if (this.value && !/^(https?):\/\//i.test(this.value)) {
          this.value = 'http://' + this.value;
        }
        this.value = this.value.replace(/\|/g, '%7c');
      });

      var url_tabs = $(".url-tab li");
      url_tabs.click(function() {
        $(this).addClass("cur").siblings().removeClass("cur");
        var index = url_tabs.index(this);
        $(".url-often > ul").eq(index).show().siblings().hide();
      });

    }

    function loadData() {
      DC.get('http://site.browser.360.cn/csite.php?callback=?', {
          version: 'se62',
          rn: Date.now(),
          v: api.GetVersion()
        },
        function(ret) {
          sitesData = ret && ret.data;
          $(document).trigger('AddUrlDlg:showtab');
        },
        1000 * 60 * 60,
        function() {
          $('.add-url .recommend .loaderror .reload').show();
        });
      return false;
    }

    function showTab(name) {
      $('.add-url .url-cats li').removeClass('on').filter('[cat-name=' + name + ']').addClass('on');
      if (name == 'custom') {
        $('.add-url .recommend').hide();
        $('.add-url .custom').show();
        localStorage['__addurl_default_tab'] = 'custom';
        return;
      }
      $('.add-url .recommend').show();
      $('.add-url .custom').hide();
      localStorage['__addurl_default_tab'] = 'hot';
      if (sitesData) {
        buildTab();
      } else {
        $(document).on('AddUrlDlg:showtab', buildTab);
      }
    }

    function buildTab() {
      var name = $('.add-url .url-cats li.on').attr('cat-name');
      render(sitesData[name]);
    }

    function render(list) {
      list = list || [];
      var sb = [];
      $.each(list, function(i, item) {
        var added = mostsUrlMap[item.url] || mostsUrlMap[item.url + '/'] || customsUrlMap[item.url] || customsUrlMap[item.url + '/'];
        sb.push('<li class="' + ' ' + (added ? 'added' : '') + '" url="' + htmlEncode(checkUrlProtocol(item.url)) + '"> <i class=""></i><img src="' + htmlEncode(item.logo) + '" onerror="src=\'images/default_logo.png\'"><h4 title="' + htmlEncode(item.title) + '">' + htmlEncode(item.title) + '</h4></li>');
      });
      if (list.length > 0) {
        $('.add-url .recommend .nodata').hide();
      }
      $('.add-url .recommend .logo-list').html(sb.join(''));
      $('.add-url .recommend .logo-list li').click(function() {
        window.isOftenUrl = true;
        $('#js-addurl-title').val($(this).find('h4').attr('title'));
        $('#js-addurl-url').val($(this).attr('url'));
        $('#add-url-form').submit();
      });
      $('.add-url .recommend .logo-list li img').on('mousedown', function() {
        return false;
      });
      getStatus();
    }

    function search(q) {
      var ret = [];
      var urlTable = {};
      $.each(sitesData, function(name, list) {
        $.each(list, function(i, item) {
          if (item.title.indexOf(q) > -1 || item.url.indexOf(q) > -1) {
            if (!urlTable[item.url]) {
              urlTable[item.url] = true;
              ret.push(item);
            }
          }
        })
      });
      if (ret.length <= 0) {
        $('.add-url .recommend .nodata').show();
      }
      render(ret);
    }

    function getStatus() {

    }
    return {
      show: function() {
        init();
        this.onshow();
      },
      onshow: function() {
        sugSelect.hide();
        //PlaceHolder._setValue($('input[name=add-url-q]')[0]);
        $('input[name=add-url-q]').val('');
        $('.ipt-2+label.error').hide();
        showTab(localStorage['__addurl_default_tab'] || 'hot');
      }
    };
  }();

  window.OldMostVisitedDial = function() {
    var RENDER_DELAY = 250;
    var GRID_COUNT = 12,
      CAPTURE_TIMEOUT = 10 * 1000,
      ANIMATE_EFFECT = true;
    var dontRefreshMosts = false,
      isDraging = false;
    var tileTmplFn = doT.template($('#old-tile-tmpl').html()),
      tileAddTmplFn = doT.template($('#old-tile-add-tmpl').html());

    var $addUrl = $('.add-url');

    function wrapResize(animate, callback) {
      console.log('wrapResize:', +new Date - st + 'ms(距页面打开)');

      var max_width = 1200,
        min_width = 700,
        ratio = 720 / 1480;
      var w = document.body.clientWidth;
      var gridW = Math.floor(w * .75);
      gridW = Math.min(gridW, max_width);
      var gridH = Math.floor(gridW * ratio);
      var areaHeight = window.innerHeight - 170;
      if (gridH > areaHeight) {
        gridH = areaHeight;
        gridW = Math.max(Math.floor(gridH * (1 / ratio)), Math.min(min_width, gridW));
        gridH = Math.floor(gridW * ratio);
      }
      $('.grid').width(gridW);

      var pageList = $('.wrap-dial');
      setTimeout(function() {
        pageList.height(Math.max(document.body.offsetHeight - pageList[0].offsetTop - 30, gridH));
      });


      if (gridW > 1000) {
        $('.page>.grid, .ntp-body').removeClass('w1024 w1440 __scale').addClass('w1440');
        $('.page>.grid').css({
          '-webkit-transform': 'none',
          left: 0,
          top: 0
        });
      } else if (gridW > 730) {
        $('.page>.grid, .ntp-body').removeClass('w1024 w1440 __scale').addClass('w1024');
        $('.page>.grid').css({
          '-webkit-transform': 'none',
          left: 0,
          top: 0
        });
      } else {
        var w1024 = Math.floor(1010 * .75),
          h1024 = w1024 * 672 / 1480,
          vh1024 = w1024 * 853 / 1200,
          scale2 = gridW / w1024;
        $('.page>.grid, .ntp-body').removeClass('w1024 w1440').addClass('w1024 __scale');
      }

      /*fix right white line start*/
      $('.tile .box').width('auto');
      setTimeout(function() {
        $('.tile .box').width($('.tile .box').width());
      }, 0);
      /*end*/

      $('.tile .box, .box img').css('height', imgHeight = Math.floor($('.tile .box').width() * 0.6054));

      if (!isDraging) { // 拖拽时重新定位会打破拖拽定位逻辑
        positionTiles();
      }

      fixAddUrlTop();

      //console.log('wrapResize End:', + new Date - st + 'ms(距页面打开)');
      return arguments.callee;
    }

    function positionTiles(start, end, offset) {
      var tile = $('.wrap-dial .mosts .tile:not(draging):first');
      if (tile.length == 0) {
        return;
      }
      var size = {
        w: tile.outerWidth(),
        h: tile.outerHeight()
      };
      var tiles = $('.wrap-dial .mosts .tile');
      tiles.each(function(i) {
        if (i >= start && i <= end) {
          i += offset;
        }
        var $this = $(this);
        if (!$this.hasClass('draging')) {
          $this.css({
            left: (i % 4) * size.w,
            top: Math.floor(i / 4) * size.h
          });
        }
      })
    }

    function renderCurrentURLS() {
      setTimeout(function() {
        ntpApis.getCurrentURLS(function(datas) {
          var oftenLis = '';
          datas.forEach(function(item) {
            if (item.title) {
              var mv_li = $('<li><img src="chrome://favicon/size/16/' + htmlEncode(checkUrlProtocol(item.url)) + '"><a href="' + htmlEncode(checkUrlProtocol(item.url)) + '">' + htmlEncode(item.title) + '</a></li>');
              oftenLis += mv_li[0].outerHTML;
            }
          });
          $('.url-often ul:last').html(oftenLis);
        });
      }, RENDER_DELAY);
    }

    function buildAddMostsVisited(datas) {
      var oftenLis = '';
      datas.forEach(function(item, i) {
        if (item.title) {
          var mv_li = $('<li><img src="chrome://favicon/size/16/' + htmlEncode(checkUrlProtocol(item.url)) + '"><a href="' + htmlEncode(checkUrlProtocol(item.url)) + '">' + htmlEncode(item.title) + '</a></li>');
          oftenLis += mv_li[0].outerHTML;
        }
      });
      $('.url-often ul:first').html(oftenLis);
    }

    function buildDataGrid(type, datas, screenshot) {
      if (type == 'mosts') {
        setTimeout(function() {
          buildAddMostsVisited(datas);
        }, RENDER_DELAY);

        if (dontRefreshMosts) {
          return;
        }

        window.mostsUrlMap = {};
        window.customsUrlMap = {};
      } else {
        window.customsUrlMap = {};
      }

      var emptyLiFn = tileAddTmplFn, //tileEmptyTmplFn,
        container = $('.wrap-dial .' + type + ' ul'),
        elis = container.children(),
        tileSize,
        drag = '';

      var needSave = GRID_COUNT - datas.length;
      if (needSave > 0) {
        for (var i = 0; i < needSave; i++) {
          datas.push({
            drag: drag
          });
        }
      }

      datas.every(function(item, i) {
        var li;
        if (item.url && item.url.substr(0, 7) == 'widget:') {
          item.url = '';
        }
        if (item.url) {
          if (item.pinned_type != undefined) item.pinned_type = item.pinned_type.toString();
          if (type == 'mosts') {
            mostsUrlMap[item.url] = item;
          } else {
            customsUrlMap[item.url] = item;
          }
          item.drag = drag;
          item.url = checkUrlProtocol(item.url);
          item.short_url = item.url.shorting(50);
          item.pic = item.local_pic || 'chrome://thumb/' + item.url;
          switch (item.thumbnail_type) {
            case 300:
            case 400:
              item.snapshot = '';
              break;
            default:
              item.snapshot = 'snapshot';
              break;
          }
          li = tileTmplFn(item).trim();
        } else {
          li = emptyLiFn({
            drag: drag
          }).trim();
        }
        var current = elis.eq(i);
        if (current.length > 0) {
          if (current.find('.link').attr('href') != item.url) {
            current.html($(li).children());
          } else {
            changePinnedState(current.find('.link'), item.pinned_type);
          }
        } else {
          if (!tileSize) {
            container.append(li);
            var tile = container.find('.tile:first');
            tile.find('.box').height(tile.find('.box').width() * 0.6051);
            tileSize = {
              w: tile.outerWidth(),
              h: tile.outerHeight()
            };
          } else {
            if (type == 'mosts') {
              li = $(li).css({
                left: (i % 4) * tileSize.w,
                top: Math.floor(i / 4) * tileSize.h
              });
            }
            container.append(li);
          }
        }
        if (i + 1 < GRID_COUNT) {
          return true;
        } else {
          return false;
        }
      });

      wrapResize();

      if (screenshot) {
        ScreenShot.hideAndCapture(type + '-Rendered', true);
      }
    }

    function changePinnedState(link, pinned) {
      link.attr('pinned_type', pinned);
      if (pinned == 1) {
        link.addClass('pinned');
      } else {
        link.removeClass('pinned');
      }
      link.find('.pin').attr('title', pinned == 1 ? '解锁' : '锁定');
    }

    function removeTile(tile, animate) {
      tile = $(tile);
      tile.find('.box').addClass('empty');
      tile.find('.remove').hide();
      var logo = tile.find('.link .tile-logo');
      var grid = $(logo).parents('.grid');
      if (grid.hasClass('mosts')) {
        dontRefreshMosts = true;
      }
      if (animate) {
        logo.addClass('hide-tit').css({
          position: 'absolute',
          top: 0
        }).animate({
          top: -logo.height()
        }, 400, '', complete);
      } else {
        complete.call(logo);
      }

      function complete() {
        var grid = $(this).parents('.grid');
        var tile = $(this).parents('.tile');
        var link = $(this).parent('.link');
        var url = link.attr('href');
        link.remove();
        if (grid.hasClass('mosts')) {
          saveGrid('mosts');
          ntpApis.blacklistURLFromMostVisited(url);
        } else {
          saveGrid('customs');
        }
        dontRefreshMosts = false;
      }
    }

    function saveGrid(type) {
      var tiles = parseGrid('.wrap-dial .' + type + ' .tile');
      var mapKey = type + 'UrlMap';
      window[mapKey] = {};
      tiles.forEach(function(tile) {
        window[mapKey][tile.url] = tile;
      });

      var method = type == 'customs' ? 'setCustomData' : 'saveMostVisitedURLs';
      ntpApis[method](JSON.stringify(tiles), function() {
        setTimeout(function() {
          $('.just-dragged').removeClass('just-dragged');
        });
      });

      ScreenShot.capture('DataChanged');

      if (type == 'mosts') {
        // 另一屏数据刷新
        setTimeout(function() {
          MostVisitedDial.renderMostsData();
        }, 500);
      }
    }

    function parseGrid(sel) {
      var tiles = [];
      $(sel).each(function(i, tile) {
        var pinned_type = parseInt($('.link', tile).attr('pinned_type') || 1);
        tiles.push({
          title: $('.tile-tit', tile).text() || '',
          url: $('.link', tile).attr('href') || '',
          pinned_type: isNaN(pinned_type) ? 1 : pinned_type
        });

      });
      return tiles;
    }

    function renderMostsData(screenshot, callback) {
      // dontRefreshMosts = false;
      ntpApis.getMostVisitedData(function(datas) {
        console.log('old-getMostVisitedData 回调函数被调用:', +new Date - st + 'ms(距页面打开)', arguments, 'dontRefreshMosts:', dontRefreshMosts);
        buildDataGrid('mosts', datas, screenshot);
        callback && callback();
        // dontRefreshMosts = true;
        return arguments.callee;
      }, 'getMostVisitedData_callback');
    }

    function initSortable() {
      var DELAY_DRAG_OFFSET = 2;
      var DURATION = 300;

      function getDragRects(selector) {
        var dragRects = [];
        $(selector).each(function(index, item) {
          var jItem = $(item),
            offset = jItem.offset();
          dragRects.push(item.rect = {
            index: index,
            drag: item,
            left: offset.left,
            top: offset.top,
            right: offset.left + jItem.outerWidth(),
            bottom: offset.top + jItem.outerHeight()
          });
        });
        return dragRects;
      }

      var dragObj, rects, startX, startY, boxX, boxY, dragHelper, passDrag, sx, sy, cx, cy, downObj, dragStart, isMostVisited, dragIndex, newDragIndex;
      $(document).delegate('.tile .box', 'mousedown', function(e) {
        if (e.altKey) {
          return false;
        }
        isMostVisited = true; //$('#page-mosts').is('.current');
        sx = e.clientX,
          sy = e.clientY;
        dragStart = true;
        downObj = $(this).parent('.tile')[0]; //this.parentNode.parentNode;
        $(downObj).parent().addClass('animating');
        isDraging = true;
        if (isMostVisited) {
          dontRefreshMosts = true;
        }
        $(document).on('mousemove', mousemove);
        return false;
      });

      $(document).delegate('', 'mouseup', function(e) {
        $(document).off('mousemove', mousemove);
        dragStart = false;
        setTimeout(function() {
          isDraging = dontRefreshMosts = false;
          $(downObj).parent().removeClass('animating');
        }, DURATION);
        if (dragObj) {
          if (Math.max(Math.abs(cx - sx), Math.abs(cy - sy)) > DELAY_DRAG_OFFSET) {
            e.preventDefault();
          }
          if (passDrag && !isMostVisited) {
            $(passDrag).removeClass('pass-drag pass-drag-left pass-drag-top pass-drag-right pass-drag-bottom');
            $(passDrag).addClass('just-dragged');
            $(dragHelper).animate({
              left: passDrag.rect.left + 'px',
              top: passDrag.rect.top + 'px'
            }, DURATION, function(dragObj) {
              return function() {
                if (!passDrag) {
                  return false;
                };
                if (!dragHelper) {
                  dragHelper = $('.drag-helper');
                };
                dragObj.innerHTML = dragSwitcher.innerHTML;
                $(dragObj).css('opacity', 1).removeClass('draging');
                passDrag.innerHTML = dragHelper.innerHTML;
                $(passDrag).css('opacity', 1);
                document.body.removeChild(dragHelper);
                document.body.removeChild(dragSwitcher);
                dragHelper = null;

                saveGrid('customs');
              };
            }(dragObj));


            var dragSwitcher = document.createElement('div');
            dragSwitcher.innerHTML = passDrag.innerHTML;
            $(passDrag).css('opacity', 0);


            document.body.appendChild(dragSwitcher);
            $(dragSwitcher).addClass('drag-switcher').css({
              width: $(passDrag).width() + 'px',
              height: $(passDrag).height() + 'px',
              left: $(passDrag).offset().left + 'px',
              top: $(passDrag).offset().top + 'px'
            }).animate({
              left: $(dragObj).offset().left + 'px',
              top: $(dragObj).offset().top + 'px'
            }, DURATION);

          } else {
            var $dragObj = $(dragObj),
              pos = $dragObj.offset(),
              mostMoved = isMostVisited && passDrag,
              tilePos;
            if (mostMoved) {
              var size = {
                w: $dragObj.outerWidth(),
                h: $dragObj.outerHeight()
              };
              tilePos = {
                left: (newDragIndex % 4) * size.w,
                top: Math.floor(newDragIndex / 4) * size.h
              };
              var poffset = $dragObj.parent().offset();
              pos = {
                left: poffset.left + tilePos.left,
                top: poffset.top + tilePos.top
              };

              var start = Math.min(dragIndex, newDragIndex),
                end = Math.max(dragIndex, newDragIndex);
              positionTiles(start, end, newDragIndex > dragIndex ? -1 : 1);
            }
            $(dragHelper).removeClass('drag-helper-disabled');
            $(dragHelper).animate(pos, DURATION, function(dragObj) {
              return function() {
                if (mostMoved) {
                  changePinnedState($dragObj.css(tilePos).find('.link'), 1)
                  var before = newDragIndex > dragIndex ? newDragIndex : newDragIndex - 1;
                  if (before < 0) {
                    $dragObj.parent().prepend($dragObj);
                  } else {
                    $('.mosts .tile:eq(' + before + ')').after($dragObj);
                  }
                  saveGrid('mosts');
                }
                $dragObj.css('opacity', 1).removeClass('draging');
                document.body.removeChild(dragHelper);
                dragHelper = null;
              };
            }(dragObj));
          }
          dragObj = null;
        }
      });

      function mousemove(e) {
        cx = e.clientX;
        cy = e.clientY;

        if (!dragObj) {
          if (!dragStart) {
            return false;
          }
          if (e.button) { //only left-mousebutton
            return false;
          }

          if (Math.max(Math.abs(cx - sx), Math.abs(cy - sy)) < DELAY_DRAG_OFFSET) {
            return false;
          }

          if (dragHelper) {
            //$(dragHelper).stop(true, true);
            dragStart = false;
            return false;
          }
          var self = downObj,
            jSelf = $(self);

          rects = getDragRects('.' + (isMostVisited ? 'mosts' : 'customs') + ' .tile'); //get all dragbox rectangle
          dragObj = self;

          startX = e.pageX;
          startY = e.pageY;

          boxX = jSelf.offset().left - startX;
          boxY = jSelf.offset().top - startY;

          //$(dragObj).find('.tile-logo').stop(true, true);
          dragHelper = document.createElement('div');
          dragHelper.innerHTML = dragObj.innerHTML;
          $(dragObj).css('opacity', 0).addClass('draging');
          dragIndex = $(dragObj).index();
          $(dragHelper).addClass('drag-helper').css({
            width: jSelf.width() + 'px',
            height: jSelf.height() + 'px',
            left: jSelf.offset().left + 'px',
            top: jSelf.offset().top + 'px'
          });
          if (jSelf.hasClass('ui-state-disabled')) {
            $(dragHelper).addClass('drag-helper-disabled');
            TipsManager.showMostsDragTips();
          }
          document.body.appendChild(dragHelper);
        } else {
          var deltaX = e.pageX - startX,
            deltaY = e.pageY - startY,
            newPosX = startX + deltaX + boxX,
            newPosY = startY + deltaY + boxY;

          $(dragHelper).css({
            left: newPosX + 'px',
            top: newPosY + 'px'
          });

          var hitDrag;
          rects.every(function(rect) { //拿到当前mousemove命中到的元素
            if (e.pageX > rect.left && e.pageX < rect.right) {
              if (e.pageY > rect.top && e.pageY < rect.bottom) {
                if (rect.drag !== dragObj) {
                  hitDrag = rect.drag;
                }
                return false;
              }
            }
            return true;
          });

          if (hitDrag !== passDrag) {

            if (passDrag) {
              $(passDrag).removeClass('pass-drag').removeClass('pass-drag-left').removeClass('pass-drag-top').removeClass('pass-drag-right').removeClass('pass-drag-bottom');
            }

            passDrag = hitDrag;

            if (isMostVisited) {
              newDragIndex = passDrag ? $(passDrag).index() : dragIndex;
              var start = Math.min(dragIndex, newDragIndex),
                end = Math.max(dragIndex, newDragIndex);
              positionTiles(start, end, newDragIndex > dragIndex ? -1 : 1);
              return false;
            } // else


            if (!passDrag) {
              return false;
            }

            var dragRect = {
                left: $(dragObj).offset().left,
                top: $(dragObj).offset().top,
                right: $(dragObj).offset().left + $(dragObj).width(),
                bottom: $(dragObj).offset().top + $(dragObj).height()
              },
              passRect = {
                left: $(passDrag).offset().left,
                top: $(passDrag).offset().top,
                right: $(passDrag).offset().left + $(passDrag).width(),
                bottom: $(passDrag).offset().top + $(passDrag).height()
              };

            $(passDrag).addClass('pass-drag');

            if (passRect.left > dragRect.left) {
              $(passDrag).addClass('pass-drag-left');
            } else if (passRect.left < dragRect.left) {
              $(passDrag).addClass('pass-drag-right');
            }

            if (passRect.top > dragRect.top) {
              $(passDrag).addClass('pass-drag-top');
            } else if (passRect.top < dragRect.top) {
              $(passDrag).addClass('pass-drag-bottom');
            }

          }
        }
      }
    }

    function fixAddUrlTop() {
      if ($addUrl.is(':visible')) {
        $addUrl.removeAttr('style').show();
        if ($addUrl.offset().top - $(window).scrollTop() < 0) {
          $addUrl.css('top', -parseInt($addUrl.css('margin-top')));
        }
      }
    }

    function showAddUrl() {
      $('.add-url,.addurl-mask').show();
      fixAddUrlTop();
      AddUrlDlg.show();

      $('#add-url-form input[type=text]').val('');
      var grid = $(this).parents('.grid');
      var type = 'customs';
      if (grid.hasClass('mosts')) {
        type = 'mosts';
      }
      $('#js-addurl-fortype').val(type);

      var curLi = $(this).parents('li')[0];
      [].slice.call(curLi.parentNode.children, 0).every(function(el, idx) {
        if (el == curLi) {
          $('#js-addurl-foridx').val(idx);
          return false;
        }
        return true;
      });
    }

    //隐藏添加弹层
    function hideAddUrl(log) {
      $('.add-url,.addurl-mask').hide();
    }

    function bindAddUrlSubmit() {

      window.isOftenUrl = false;

      $('#add-url-form').on('submit', function(e) {
        e.preventDefault();
        var type = $('#js-addurl-fortype').val();
        if (type != 'mosts') {
          type = 'customs';
        }
        if ($('#js-addurl-foridx').val() == '') {
          var firstEmpty = $('.' + type + ' li.tile div.empty:first').parent().index();
          $('#js-addurl-foridx').val(Math.max(firstEmpty, 0));
        }

        var title = $('#js-addurl-title').val().trim(),
          url = $('#js-addurl-url').val(),
          idx = $('#js-addurl-foridx').val() - 0;
        if (!/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z|]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url)) {
          $('#js-addurl-url').focus();
          if (url) {
            if ($('#js-addurl-url').next('label').length == 0) {
              $('#js-addurl-url').after('<label for="js-addurl-url" generated="true" class="error" style="">网址输入有误，请确认后重试</label>');
            } else {
              $('#js-addurl-url').next('label').show();
            }
          }
          return;
        }

        if (type == 'mosts') {
          dontRefreshMosts = true;
        }
        var isOU = window.isOftenUrl;
        window.isOftenUrl = false;
        var item;
        if (type == 'mosts') {
          try {
            $('.wrap-dial .mosts .tile a.link').each(function() {
              var _url = this.href;
              _url = _url.replace(/\/$/i, '');
              var _addurl = url;
              _addurl = _addurl.replace(/\/$/i, '');
              if (_addurl == _url) {
                item = $(this).parents('.tile');
                return false;
              }
            });
          } catch (e) {}
        }
        if (!item) {
          item = $('.wrap-dial .' + type + ' .tile:eq(' + idx + ')');
        }
        var addUrlImg = null;
        var imgUrl = '';
        //推荐的tile，展现动画
        if (isOU) {
          var img = $('.logo-list li[url="' + url + '"] img');
          imgUrl = img.attr('src');
          var offset = img.offset();
          var targetOffset = item.children().offset();
          addUrlImg = $('<img src="' + imgUrl + '"/>').css({
            width: 135,
            height: 95,
            position: 'absolute',
            top: offset.top,
            left: offset.left,
            zIndex: 100000
          }).addClass('add-url-img').attr('url', url).appendTo(document.body).animate({
            width: item.width() - 1,
            height: item.height(),
            top: targetOffset.top,
            left: targetOffset.left
          }, 500, '', function() {
            setTimeout(function() {
              addUrlImg.remove();
            }, 0);
          });
          window.animateAddUrl = url;
        };
        setTimeout(function() {
          var el = item.html($(tileTmplFn({
            title: title || url,
            short_url: url.shorting(50),
            url: url
          }).trim()).html()) /*.fadeIn()*/ .find('.box').css('height', imgHeight);
          if (isOU && imgUrl) {
            el.find('.tile-logo img').attr('src', imgUrl)
          } else {
            el.find('.tile-logo img').attr('src', 'images/logo_loading.gif')
          }

          if (!isOU) {
            onSnapshotAnimUrl = url;
          };

          wrapResize();
          saveGrid(type);
          dontRefreshMosts = false;

          ntpApis.captureWebpage(url, function(args) {
            if (window.animateAddUrl == args[0]) {
              window.animateAddUrl = args[1];
            }
            clearTimeout(window['capture_timeout_' + args[0]]);
            //if (!isOU)
            {
              window['capture_timeout_' + args[1]] = setTimeout(function() {
                window.onSnapshotComplete([{
                  url: args[1]
                }]);
              }, CAPTURE_TIMEOUT);
            }
            $('.tile a[href="' + args[0] + '"]').attr('href', args[1]);
            //saveGrid(type);
          });
          //if (!isOU)
          {
            window['capture_timeout_' + url] = setTimeout(function() {
              window.onSnapshotComplete([{
                url: url
              }]);
            }, CAPTURE_TIMEOUT);
          }

        }, 500)
        hideAddUrl('from save');
      });
    }

    window.importDataCaptureCount = 0;
    var onSnapshotAnimUrl = '';
    window.onSnapshotComplete = function(args) {
      console.log('onSnapshotComplete被调用', arguments);
      importDataCaptureCount--;
      args = args || [];
      var item = args[0] || {},
        url = item.url;
      clearTimeout(window['capture_timeout_' + url]);
      if (url) {
        var query = '.wrap-dial .tile a[href^="' + url + '"] img[src="images/loading.gif"]',
          img = $(query);
        if (img.length <= 0) {
          query = '.wrap-dial .tile a[href^="' + url + '"] img';
          img = $(query);
        }
        if (img.length > 0) {
          var src = img.attr('src');
          if (src == 'images/loading.gif' || src == '' || importDataCaptureCount >= 0 || window.animateAddUrl != url) {
            img.attr('src', 'chrome://thumb/' + url);
            onSnapshotAnimUrl = onSnapshotAnimUrl.replace(/\/$/, '');
            url = url.replace(/\/$/, '');
            onSnapshotAnimUrl = '';
            var box = img.parents('.box');
            switch (item.thumbnail_type) {
              case 300:
              case 400:
                box.removeClass('snapshot');
                break;
              default:
                box.addClass('snapshot');
                break;
            }
            img.parents('.tile-logo').css('top', -parseInt(imgHeight)).animate({
              top: 0
            }, 500, function() {
              ScreenShot.capture('DataChanged');
            });
            window.animateAddUrl = null;
          }
        }
      }
    };

    function bindEvents() {
      bindAddUrlSubmit();

      $(window).on('resize', wrapResize);

      $(document).delegate('.tile-tit > .pin', 'click', function(e) {
          var link = $(this).parents('.link');
          link.toggleClass('pinned');
          changePinnedState(link, link.hasClass('pinned') ? 1 : 0);
          saveGrid('mosts');
          return false;
        }).delegate('.tile .remove', 'click', function(e) {
          var tile = $(this).parents('li.tile');
          removeTile(tile, ANIMATE_EFFECT);
          return false;
        }).delegate('.wrap-dial .tile-add', 'click', showAddUrl)
        .delegate('#js-addurl-cancel, .add-url-close', 'click', hideAddUrl);

      $(document).on('keydown', function(e) {
        switch (e.keyCode) {
          case 27:
            hideAddUrl();
            break;
        }
      });
    }

    function init() {
      bindEvents();
      initSortable();

      renderMostsData($('.wrap-dial').is(':visible'));
      renderCurrentURLS();
    }

    return {
      init: init,
      renderMostsData: renderMostsData,
      wrapResize: wrapResize
    };
  }();

  $('.version-switch a').on('click', function(e) {
    if ($(this).hasClass('current')) {
      return;
    }
    $('.version-switch a').removeClass('current').filter(this).addClass('current');
    var ctrl = $(this).data('ctrl');
    $('.wrap > *').hide().filter(ctrl).show();
    if (ctrl == '.wrap-dial') {
      OldMostVisitedDial.wrapResize();
      ScreenShot.capture('VersionSwitch');
    } else {
      // 新版信息流不适合贴图优化，删除贴图
      ScreenShot.capture('delete');
    }
    storage.set('settings', 'version-switch', ctrl);
    if (e.isTrigger) {
      Stat.send(ctrl == '.wrap-dial' ? '472.8489.gif' : '472.3554.gif');
    } else {
      // 手动点击
      $('.version-switch .first-tips').fadeOut();
    }
  });

  var $ver_switch = $('.version-switch a[data-ctrl="' + storage.get('settings')['version-switch'] + '"]');
  if ($ver_switch.length == 0) {
    $ver_switch = $('.version-switch .new-newtab');
  }
  // 导航到新闻流
  if (location.pathname.substr(1) == 'news') {
    $ver_switch = $('.version-switch .new-newtab');
    setTimeout(function() {
      location.href = '/scrolltonews';
    }, 0);
  }
  $ver_switch.trigger('click');

  OldMostVisitedDial.init();

  if (storage.get('__tips_manager')['version-switch-tips'] != true) {
    storage.set('__tips_manager', 'version-switch-tips', true);
    $('.version-switch .first-tips').fadeIn();
    setTimeout(function() {
      $('.version-switch .first-tips').fadeOut();
    }, 5000);
  }


})(jQuery);

(function($) {
  var fixed = false,
    scrollLine = 327,
    scrollLock = false,
    scrollToNews = false,
    MID = external.GetMID(external.GetSID(window)),
    // MID = '0a0c8144e18da7810c2e7bcab557c06d',
    _version = external.GetVersion(external.GetSID(window)),
    _url = 'http://elephant.browser.360.cn/',
    _sign = hex_md5('t=360xxl&mid=' + MID + '&source=pcxxl&device=1 browxxlserweishi360!#$ '),
    _data = {
      t: '360xxl',
      source: 'pcxxl',
      device: 1,
      sign: _sign,
      mid: MID,
      n: 10,
      ch: 'platform_7',
      pcver: _version
    },
    curTheme = [{
      theme: 'youlike',
      loadType: 'refresh'
    }],
    defaultTheme = 'youlike',
    timer = {
      errorTimer: '',
      tipTimer: ''
    },
    firstLoad = true;

  function toFixNav(tag) {
    if (tag == 'add') {
      $('.news-nav-pack').addClass('news-nav-container-fixed');
      $('.sidebar-wrapper').addClass('sidebar-wrapper-fixed');
      $('.news-rank-pack').addClass('news-rank-wrapper-fixed');
      fixed = true;
    } else if (tag == 'remove') {
      $('.news-nav-pack').removeClass('news-nav-container-fixed');
      $('.sidebar-wrapper').removeClass('sidebar-wrapper-fixed');
      $('.news-rank-pack').removeClass('news-rank-wrapper-fixed');
      $('.news-nav-pack').css('marginLeft', 0);
      $('.sidebar-wrapper').css('marginLeft', 0);
      $('.news-rank-pack').css('marginLeft', 0);
      fixed = false;
    }
  };

  function formatDate(date) {
    var _date = new Date(date),
      _year = _date.getFullYear(),
      _mouth = _date.getMonth() + 1,
      _day = _date.getDate(),
      _hour = _date.getHours(),
      _minute = _date.getMinutes(),
      _second = _date.getSeconds();
    _mouth = _mouth >= 10 ? _mouth : '0' + _mouth;
    _day = _day >= 10 ? _day : '0' + _day;
    _hour = _hour >= 10 ? _hour : '0' + _hour;
    _minute = _minute >= 10 ? _minute : '0' + _minute;
    return _mouth + '-' + _day + ' ' + _hour + ':' + _minute;
  };

  function renderNav(data) {
    var d, l,
      nc = [],
      nm = [],
      cs = ms = '';
    if (Object.prototype.toString.call(data) == '[object String]') {
      try {
        d = JSON.parse(data).data;
      } catch (e) {
        return;
      }
    }
    l = d.length;
    if (l > 9) {
      nc = d.slice(0, 9);
      nm = d.slice(9);
    } else {
      nc = d;
    }
    for (var i = 0; i < nc.length; i++) {
      var active = '';
      if (nc[i].c == defaultTheme) {
        active = ' news-active';
      }
      cs += '<li class="nav-common-item' + active + '" data-c="' + nc[i].c +
        '">' + nc[i].name + '</li>';
    }
    $('.news-nav-common').empty().append(cs);
    for (var j = 0; j < nm.length; j++) {
      ms += '<li class="nav-more-item" data-c="' + nm[j].c +
        '">' + nm[j].name + '</li>';
    }
    $('.news-nav-more').empty().append(ms);
  };

  function dealNav(data) {
    var _date = new Date(),
      _today = _date.getFullYear() + _date.getMonth() + _date.getDate();
    renderNav(data);
    localStorage.news_nav = data;
    localStorage.news_nav_date = _today;
    localStorage.news_rank_rp = 1;
  };

  function renderNews(str, curTheme, newsNum) {
    var packId = 'news-content-' + curTheme.theme,
      packCon = $('#' + packId);
    // if(packCon.length < 1) {
    //   packCon = document.createElement('DIV');
    //   packCon.id = packId;
    //   packCon.class = 'news-content-wrapper';
    // }
// 
    
    switch (curTheme.loadType) {
      case "refresh":
        packCon.prepend(str);
        checkScrollTop(packCon);
        if (str != '') {
          $('.news-bd-error').hide();
          showNewsTip('为您推荐了' + newsNum + '条新闻', 'refresh');
        } else {
          showNewsTip('暂无更新，请稍后再试！', 'refresh');
        }
        break;
      case 'loadMore':
        packCon.append(str);
        checkScrollTop(packCon, true);
        if (str == '') {
          showNewsTip('暂无更新，请稍后再试！', 'loadMore');
        } else {
          $('.news-bd-tip').hide();
          // showNewsTip('为您推荐了' + newsNum + '条新闻', 'loadMore');
        }
        break;
    }
    // se://newtab/news 访问时，直接定位到新闻流位置
    if (location.pathname.substr(1) == 'scrolltonews' && !scrollToNews) {
      $(document).scrollTop(scrollLine);
      scrollToNews = true;
    }
  };

  function renderHot(data) {
    var len = data.length,
      str = '';
    if (len == 0) {
      $('.rank-no-news').text('暂无更新，请稍后再试！').slideDown();
    } else {
      for (var i = 0; i < len; i++) {
        var num = i + 1;
        str += '<li class="render-item"><div class="rank-num">' + num +
          '</div><div class="rank-content"><a class="rank-href" href="' + data[i].u + '" target="_blank" title="' + data[i].t + '">' + data[i].t + '</a></div></li>';
      }
      $('.render-bd').append(str);
    }
  };

  function getNews(d, type, cb) {
    if (type == 'refresh') {
      $(document).scrollTop() > scrollLine && $(document).scrollTop(scrollLine);
      $('.news-loading-wrapper').show();
    }
    getData(d, type, cb);
  }

  function getData(d, type, cb) {
    $.ajax({
      url: _url,
      type: 'get',
      dataType: 'jsonp',
      data: d,
      success: function(data) {
        if (data.errno == 0) {
          var d = data.data;
          d.tblist && dealNav(d.tblist);
          d.hasOwnProperty('rank') && renderHot(d.rank || []);
          dealNews(d);
        }
        cb && cb();
        console.info(data)
          // console.info(JSON.parse(data.data.tblist))
      },
      error: function(xhr) {
        showNewsTip('请求失败，请稍后再试！', type);
        if (/rank/.test(_data.p)) {
          $('.rank-no-news').text('请求失败，请稍后再试！').slideDown();
        }
      }
    })
  }

  function dealNews(data) {
    var len = curTheme.length;
    for (var i = 0; i < len; i++) {
      if (data.hasOwnProperty(curTheme[i].theme)) {
        dealData(data[curTheme[i].theme], curTheme[i]);
        curTheme.splice(i, 1);
        break;
      }
    }
  }

  function dealData(data, curTheme) {
    var data = data || [],
      len = data.length,
      tpl = '',
      str = '';
    for (var i = 0; i < len; i++) {
      var imgs = data[i].i.split('|');
      var imgLen = imgs.length;
      if (data[i].i == "") {
        data[i].newsType = 'news-tpl1';
        data[i].imgUrl = imgs;
      } else if (imgLen >= 3) {
        data[i].newsType = 'news-tpl3';
        data[i].imgUrl = imgs.slice(0, 3);
      } else if (imgLen > 0) {
        data[i].newsType = 'news-tpl2';
        data[i].imgUrl = imgs.slice(0, 1);
      };
      data[i].t = data[i].t.toString().trim();
      data[i].newsTime = formatDate(data[i].p * 1000);
      // data[i].newsUrl = decodeURIComponent(data[i].pcurl);//getQueryString(data[i].u).u ? getQueryString(data[i].u).u : getQueryString(data[i].u).url;

    }
    tpl = doT.template($("#news-template").text());
    str = tpl({
      tplData: data
    });
    renderNews(str.trim(), curTheme, len);
  }

  function showNewsTip(msg,type) {
    var id = '',
      con = '',
      timerName,
      tar,
      ch = 0;
    if (firstLoad && $('.news-content-active').children().length > 0) {
      $('.news-loading-wrapper').hide();
      return;
    }
    switch (type) {
      case 'refresh':
        id = 'news-bd-error';
        con = '.news-bd-wrapper';
        timerName = 'errorTimer';
        ch = 30;
        break;
      case 'loadMore':
        id = 'news-bd-tip';
        con = '.news-nav-container';
        timerName = 'tipTimer';
        break;
      default: break;
    }
    if ($('.'+id).length < 1) {
      var el = document.createElement('DIV');
      el.className = id;
      $(con).prepend(el);
      $(el).empty().append(msg);
      tar = $(el);
    } else {
      $('.'+id).empty().append(msg);
      tar = $('.'+id);
    }
    // $(con).height(ch + $(con).height());
    $('.news-loading-wrapper').hide();
    $(tar).show();
    timer[timerName] && clearTimeout(timer[timerName]);
    timer[timerName] = setTimeout(function() {
      clearTimeout(timer[timerName]);
      $('.'+id).slideUp('fast', function() {
        // $(con).height($(con).height() - ch);
      });
    }, 3000);
  }

    

  function bindEvent() {
    $(document).on('click', function(e) {
      var $tar = $(e.target);
      if (!$tar.hasClass('news-btn-more') && !$tar.hasClass('nav-more-title') && !$tar.hasClass('news-more-arrow') && !$tar.hasClass('nav-more-cur')) {
        $('.news-btn-more').removeClass('news-btn-more-show');
        $('.news-nav-more').slideUp('fast');
      }
    });
    $(window).on('resize', function(e) {
      console.info('resize');
      $(document).trigger('scroll');
    })
    $(document).on('scroll', function(e) {
      if ($(this) == undefined) return;
      var $this = $(this),
        viewH = $this.get(0).body.offsetHeight, //可见高度
        viewW = $this.get(0).body.offsetWidth, //可见宽度
        contentH = $this.height(), //内容高度
        contentW = $this.width(), //内容宽度
        scrollTop = $this.scrollTop(), //滚动高度
        scrollLeft = $this.scrollLeft(), //滚动高度
        _style='';
      if ($this.scrollTop() > scrollLine && !fixed) {
        toFixNav('add');
      }
      if ($this.scrollTop() <= scrollLine && fixed) {
        toFixNav('remove');
      }
      if (contentW > viewW && scrollLeft == 0) {
        _style = 'margin-left:' + scrollLeft + 'px';
      } else if(contentW > viewW && scrollLeft > 0) {
        _style = 'margin-left:' + -1*scrollLeft + 'px';
      } else {
        _style = '';
      }
      $('.sidebar-wrapper-fixed, .news-nav-container-fixed, .news-rank-wrapper-fixed, .news-refresh-top-container').attr('style', _style);
      // $('.news-refresh-top').attr('style', _style2);
      // if ($this.scrollTop() > 500) {
      //   $('.news-refresh-top').show();
      // } else {
      //   $('.news-refresh-top').hide();
      // }
      if (!scrollLock && (contentH <= viewH || (contentH - viewH - scrollTop) <= 100)) {
        var theme = $('.news-active').data('c');
        if (!theme) return;
        curTheme.push({
          theme: theme,
          loadType: 'loadMore'
        });
        _data.p = theme;
        getNews(_data,'loadMore');
        scrollLock = true;
        setTimeout(function() {
          scrollLock = false;
        }, 200);
      }
    });
    $('.news-btn-more').on('click', function(e) {
      var $this = $(this);
      Stat.send('472.912.gif');
      if ($this.hasClass('news-btn-more-show')) {
        $this.removeClass('news-btn-more-show');
        $('.news-nav-more').slideUp(200);
      } else {
        $this.addClass('news-btn-more-show');
        $('.news-nav-more').slideDown(200);
      }
    });
    $('.news-nav-common, .news-nav-more').on('click', function(e) {
      var $tar = $(e.target);
      if ($tar[0].tagName != 'LI') return;
      var theme = $tar.data('c'),
        packId = 'news-content-' + theme,
        packCon = $('#' + packId);
      $('.news-bd-error').hide();
      if (packCon.length < 1 || packCon.children().length < 1 || $('.news-content-active')[0].id.split('news-content-')[1] == theme) {
        var themeObj = {
          theme: theme,
          loadType: 'refresh'
        }
        if (packCon.length < 1) {
          packCon = document.createElement('UL');
          packCon.id = packId;
          packCon.className = 'news-content-wrapper';
          $(packCon).data('c', theme);
          $('.news-bd-wrapper').append(packCon);
        }
        curTheme.push(themeObj);
        _data.p = theme;
        getNews(_data,'refresh');
      } else {
        checkScrollTop($(packCon));;
      }
      
      $('.nav-common-item').removeClass('news-active');
      $('.nav-more-item').removeClass('news-active');
      $tar.addClass('news-active');

      if ($(this).hasClass('news-nav-more')) {
        $('.nav-more-title').text($tar.text());
        $('.news-btn-more').addClass('news-active');
      } else {
        $('.nav-more-title').text('更多');
        $('.news-btn-more').removeClass('news-active');
      }
    });
    $('.news-bd-wrapper').delegate('a', 'click', function(e) {
      var tar = e.target,
        d = {};
      Stat.send('472.9029.gif');
      $(tar).parents('.news-pack').addClass('news-visited');
      // d = {
      //   uid: api.mid,
      //   url: encodeURI($(tar).data('u')),
      //   sign: _data.sign,
      //   version: api.ver,
      //   device: 2,
      //   channel: $(tar).parents('.news-content-wrapper').data('c'),
      //   c: $(tar).data('c'),
      //   a: $(tar).data('a'),
      //   source: _data.source,
      //   act: 'click_pctab'
      // };
      // $.ajax({
      //   url: 'http://api.look.360.cn/srv/c',
      //   type: 'get',
      //   dataType: 'jsonp',
      //   data: d,
      //   success: function(data) {
      //     console.info(data)
      //   },
      //   error: function(xhr) {
      //     console.info(xhr)
      //   }
      // })
    });
    $('.news-refresh').on('click', function(e) {
      var theme = $('.news-active').data('c');
      Stat.send('472.8227.gif');
      if (!theme) return;
      curTheme.push({
        theme: theme,
        loadType: 'refresh'
      });
      _data.p = theme;
      getNews(_data,'refresh');
    });
    $('.news-top').on('click', function(e) {
      Stat.send('472.7285.gif');
      $(document.body).animate({
        scrollTop: 0
      }, 200);
    });
    $('.render-bd').delegate('.rank-href', 'click', function(e) {
      Stat.send('472.412.gif');
    })
  };

  function checkScrollTop(packCon, lm) {
    var st = $(document).scrollTop();

    // packCon.addClass('news-content-hidden');
    var h = packCon.height();
    var wh = $(window).height();
    var nh = $('.news-nav-pack').height();
    var th = 60;
    var bh = $('.news-bd-wrapper').height();
    $('.news-content-active').removeClass('news-content-active');
    // if ((wh - h > 44) && st >= scrollLine) {
    //   $('.news-bd-wrapper').height(wh-44+th);
    //   $(document).scrollTop(scrollLine);
    // } else if (st >= scrollLine) {
    //   $('.news-bd-wrapper').height(h+th);
    //   !lm && $(document).scrollTop(scrollLine);
    // } else if (st < scrollLine) {
    //   $('.news-bd-wrapper').height('auto');
    // }


    if (st>=scrollLine) {
      if (h+nh<wh) {
        $('.news-bd-wrapper').height(wh-nh+th);
      } else {
        $('.news-bd-wrapper').height(h+th);
      }
      !lm && $(document).scrollTop(scrollLine);
    } else {
      $('.news-bd-wrapper').height('auto');
    }
    // st > scrollLine && $(document).scrollTop(scrollLine);
      // $('.news-content-wrapper').hide();
    $(packCon).addClass('news-content-active');
  };

  function checkLocalStorage() {
    var p = '',
      rp = 1,
      _date = new Date(),
      _today = _date.getFullYear() + _date.getMonth() + _date.getDate(),
      ls = localStorage.news_nav || '',
      ld = localStorage.news_nav_date || '';
    if (ls && _today == ld) {
      p = 'rank,youlike';
      rp = Number(localStorage.news_rank_rp ++) % 6 + 1;
      renderNav(ls);
    } else {
      p = 'tblist,rank,youlike';
    }
    _data.p = p;
    _data.rp = rp;
    getNews(_data,'refresh', function() {
      firstLoad = false;
    });
  }
  (function init() {
    checkLocalStorage()
    bindEvent();
  })();
})(jQuery);