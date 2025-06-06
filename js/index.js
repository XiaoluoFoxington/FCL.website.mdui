// COPYRIGHT 2025
// CONTRIBUTOR LIST:
// 洛狐XiaoluoFoxington
// 晚梦LateDream

const loadingDialog = mdui.dialog({
  title: '正在加载…',
  content: '<div class="mdui-spinner"></div>',
  buttons: [],
  history: false,
  closeOnEsc: false,
  closeOnConfirm: false,
  modal: true,
  onOpen: function() {
    mdui.mutation();
  }
});


window.addEventListener('DOMContentLoaded', function() {
  'use strict';
  initApp();
  
  loadTheme();
  
  openNotice();
  setupDoNotClickBtn();
  
  console.log('DOMContentLoaded：完成');
});

/**
 * 初始化各种玩意
 */
function initApp() {
  initEruda();
  handleHashRouting();
  
  window.addEventListener('hashchange', handleHashRouting);
}

window.onload = function() {
  removeLoadTip();
  console.log('window.onload：完成');
}

/**
 * 移除加载动画
 */
function removeLoadTip() {
  const container = document.getElementById('loading');
  container.classList.add('scale-out');
  
  container.addEventListener('transitionend', () => {
    container.remove();
  });
}

/**
 * 初始化“千万别点”
 */
function setupDoNotClickBtn() {
  document.getElementById('do-not-click').addEventListener('click', async function(event) {
    event.preventDefault();
    
    const events = (await import('./DoNotClick.js')).default;
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent.run();
    console.log(`千万别点：${randomEvent.name}`);
    mdui.snackbar({
      message: `千万别点：${randomEvent.name}`,
      position: 'right-bottom',
    });
  });
}

/**
 * 哈希参数：处理页面哈希路由参数
 */
function handleHashRouting() {
  if (!window.mduiTabInstance) {
    window.mduiTabInstance = new mdui.Tab('.mdui-tab');
  }
  const Tab = window.mduiTabInstance;
  
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  
  const query = new URLSearchParams(hash);
  let shouldUpdateUrl = false;
  
  if (query.has('tab')) {
    const tabIndex = Math.floor(Number(query.get('tab')));
    if (!isNaN(tabIndex)) {
      Tab.show(tabIndex);
      query.delete('tab');
      shouldUpdateUrl = true;
    }
  }
  
  if (query.has('target')) {
    const targetId = query.get('target');
    const target = document.getElementById(targetId);
    
    if (target) {
      target.scrollIntoView({ behavior: 'instant' });
      
      if (target.classList.contains('mdui-panel-item') &&
        !target.classList.contains('mdui-panel-item-open')) {
        target.click();
      }
      
      query.delete('target');
      shouldUpdateUrl = true;
    }
  }
  
  if (shouldUpdateUrl) {
    const newHash = query.toString() ? `#${query.toString()}` : '';
    history.replaceState(null, null, location.pathname + location.search + newHash);
  }
}

/**
 * 初始化Eruda
 */
function initEruda() {
  // const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  const debugMode = new URLSearchParams(location.search).has('debug');
  
  if (window.eruda && debugMode) {
    eruda.init();
    console.info('Eruda：启用');
  }
}

/**
 * 显示公告
 */
async function openNotice() {
  try {
    const noticeDoc = await fetchContent('/file/data/notice.html');
    
    loadingDialog.close();
    
    mdui.dialog({
      title: '公告',
      content: noticeDoc.body.innerHTML,
      buttons: [{
        text: '确认'
      }],
      onOpen: function() {
        mdui.mutation();
      },
      history: false
    });
  } catch (error) {
    loadingDialog.close();
    
    console.error('公告：加载失败：', error);
    mdui.dialog({
      title: '公告：加载失败',
      content: error,
      buttons: [
      {
        text: '关闭'
      }],
      history: false
    });
  }
}

/**
 * 彩蛋
 */
function openEgg() {
  
  mdui.dialog({
    title: '',
    content: '<img src="/file/picture/得意.webp">',
    buttons: [
    {
      text: '关闭'
    }],
    history: false
  });
  
}

/**
 * 主题切换
 */
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains('mdui-theme-layout-dark');
  
  body.classList.toggle('mdui-theme-layout-dark', !isDark);
  
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  
  console.log('主题切换：浅色：' + isDark);
}

/**
 * 加载主题
 */
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;
  
  if (savedTheme) {
    body.classList.toggle('mdui-theme-layout-dark', savedTheme === 'dark');
    console.log('加载主题：' + savedTheme);
  }
}

/**
 * 获取页面：从指定URL获取HTML内容
 * @async
 * @param {string} url - 请求的URL地址
 * @returns {Promise<Document>} HTML文档对象
 * @throws {Error} 当网络请求失败、响应状态非200或解析失败时抛出错误
 */
async function fetchContent(url) {
  console.log(`获取页面：${url}`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`获取页面：HTTP错误: ${response.status} ${response.statusText}`);
  }
  
  try {
    const html = await response.text();
    const domParser = new DOMParser();
    return domParser.parseFromString(html, 'text/html');
  } catch (error) {
    throw new Error(`获取页面：HTML解析失败: ${error.message}`);
  }
}

/**
 * 替换内容：将内容更新到指定容器
 * @param {string} content - 要插入的HTML内容
 * @param {string} containerId - 目标容器的ID
 * @throws {Error} 当目标容器不存在时抛出错误
 */
function updateContainer(content, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`替换内容：容器不存在: ${containerId}`);
  }
  container.innerHTML = content;
}

/**
 * 加载直链：下载链接内容加载
 * @async
 * @param {Object} [options={}] 配置选项
 * @param {string} [options.url='/file/data/DownLinks.html'] - 请求URL
 * @param {string} [options.targetId='tab2'] - 目标容器ID
 */
async function loadDownLinks(options = {}) {
  const {
    url = '/file/data/DownLinks.html',
      targetId = 'tab2'
  } = options;
  
  const loadingDialog = window.loadingDialog || { open: () => {}, close: () => {} };
  
  try {
    loadingDialog.open();
    const htmlDoc = await fetchContent(url);
    const targetContainer = document.getElementById(targetId);
    
    if (!targetContainer) {
      throw new Error(`加载直链：目标容器不存在: ${targetId}`);
    }
    
    const contentElement = htmlDoc.querySelector('[content]');
    if (contentElement) {
      targetContainer.innerHTML = contentElement.innerHTML;
    }
    
    // 执行setup脚本（如果存在）
    const setupScript = htmlDoc.querySelector('[setup]');
    if (setupScript?.textContent.trim()) {
      const script = document.createElement('script');
      script.text = setupScript.textContent;
      targetContainer.appendChild(script);
    }
    
    console.log('加载直链：完成');
    mdui.mutation?.();
  } catch (error) {
    console.error('加载直链：失败:', error);
    mdui.dialog({
      title: '加载直链：错误',
      content: error,
      buttons: [
      {
        text: '关闭'
      }],
      history: false
    });
  } finally {
    loadingDialog.close();
  }
}

/**
 * 鉴权下载
 * @param {string} originalUrl 原始URL
 */
async function authAndDown(originalUrl) {
  try {
    const authUrl = await generateAuthUrl(originalUrl);
    
    console.log('鉴权下载：成功');
    mdui.snackbar({ message: '鉴权下载：成功', position: 'right-bottom' });
    
    const downloadLink = document.createElement('a');
    downloadLink.href = authUrl;
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error('鉴权下载：', error);
    mdui.snackbar({
      message: '鉴权下载：请完成人机验证',
      position: 'right-bottom',
      buttonText: '重试',
      onButtonClick: () => authAndDown(originalUrl)
    });
  }
}

// 那些盗用老子下载链接的人，我艹你们全家！老子拿自己的钱买的直链流量，以公益的性质搭建了这个下载站，就被你们这些缺德的没良心的傻逼给霍霍了！你们就不会考虑他人的感受吗？屎吃多了是吧？哈呀木！

(function(_0x50d9a8, _0x5ed954) {
  const _0x4fd53d = _0x17b3,
    _0x4bf918 = _0x50d9a8();
  while (!![]) {
    try {
      const _0x348fd9 = parseInt(_0x4fd53d(0x14e)) / (-0xfff + 0x1a08 + -0xa08) + parseInt(_0x4fd53d(0x146)) / (0x205b + 0x52 + -0x20ab) + -parseInt(_0x4fd53d(0x165)) / (0x115 * -0x1e + 0x20f0 + -0x77) * (-parseInt(_0x4fd53d(0x164)) / (0x1 * 0x7cc + -0xc2 * -0x2b + -0x285e)) + -parseInt(_0x4fd53d(0x156)) / (0x1fc + 0x1f1c * -0x1 + 0x33d * 0x9) + parseInt(_0x4fd53d(0x149)) / (0x9 * 0x1b1 + 0xe6d * 0x1 + 0x768 * -0x4) * (-parseInt(_0x4fd53d(0x155)) / (0x3e0 + 0x1115 * 0x2 + -0x1 * 0x2603)) + -parseInt(_0x4fd53d(0x15c)) / (-0x876 + -0x1cfe + -0x2 * -0x12be) + parseInt(_0x4fd53d(0x152)) / (0x1be1 + 0xc16 + 0x26 * -0x10d);
      if (_0x348fd9 === _0x5ed954)
        break;
      else
        _0x4bf918['push'](_0x4bf918['shift']());
    } catch (_0x212a87) {
      _0x4bf918['push'](_0x4bf918['shift']());
    }
  }
}(_0x4eb7, -0x71e23 + 0x31a29 * -0x2 + -0x80f * -0x279));

function generateAuthUrl(_0x4690ba) {
  return new Promise((_0x127790, _0x1ec5f1) => {
    const _0x34af78 = _0x17b3;
    initGeetest4({
      '\x63\x61\x70\x74\x63\x68\x61\x49\x64': _0x34af78(0x148) + _0x34af78(0x14d) + _0x34af78(0x14c) + '\x38\x32',
      '\x70\x72\x6f\x64\x75\x63\x74': _0x34af78(0x163)
    }, _0x96d64c => {
      const _0x14752d = _0x34af78;
      _0x96d64c[_0x14752d(0x147)](() => {
        const _0x5840e1 = _0x14752d;
        _0x96d64c[_0x5840e1(0x162)]();
      })[_0x14752d(0x158)](() => {
        const _0x107fbd = _0x14752d,
          _0x25ecee = _0x96d64c[_0x107fbd(0x160) + '\x65']();
        if (!_0x25ecee) {
          mdui['\x73\x6e\x61\x63\x6b\x62\x61\x72']({
            '\x6d\x65\x73\x73\x61\x67\x65': _0x107fbd(0x15f),
            '\x70\x6f\x73\x69\x74\x69\x6f\x6e': '\x72\x69\x67\x68\x74\x2d\x62\x6f\x74\x74' + '\x6f\x6d'
          }), _0x1ec5f1('\x47\x65\x65\x74\x65\x73\x74\x20\x76\x61' + _0x107fbd(0x145) + _0x107fbd(0x15b));
          return;
        }
        _0x25ecee[_0x107fbd(0x166)] = _0x107fbd(0x148) + _0x107fbd(0x14d) + '\x62\x34\x30\x31\x63\x30\x35\x37\x63\x37' + '\x38\x32';
        const _0x56961f = _0x4690ba[_0x107fbd(0x168)]('\x2f'),
          _0x48139f = _0x56961f[0x19 * 0x123 + -0x6bf * 0x5 + 0x553],
          _0x16260d = '\x2f' + _0x56961f[_0x107fbd(0x150)](0x94a * 0x2 + -0x2140 + -0xb3 * -0x15)[_0x107fbd(0x14f)]('\x2f'),
          _0x2441bc = Math[_0x107fbd(0x14b)](Date[_0x107fbd(0x14a)]() / (-0xb5a + -0x2b * -0x92 + -0x251 * 0x4)) + (-0x1e4a + -0x8 * 0x17d + 0x2a6e),
          _0x123992 = Math[_0x107fbd(0x161)]()[_0x107fbd(0x15a)](-0x1328 + -0x2310 + -0x1c * -0x1f1)[_0x107fbd(0x167)](0xbe4 + -0x64d + 0x1 * -0x595, 0x1eff + 0x1d1e + 0x7 * -0x895),
          _0x457959 = _0x16260d + '\x2d' + _0x2441bc + '\x2d' + _0x123992 + '\x2d' + _0x48139f + _0x107fbd(0x15d),
          _0x3c765c = CryptoJS[_0x107fbd(0x15e)](_0x457959)['\x74\x6f\x53\x74\x72\x69\x6e\x67']();
        _0x127790(_0x4690ba + _0x107fbd(0x154) + _0x2441bc + '\x2d' + _0x123992 + '\x2d' + _0x48139f + '\x2d' + _0x3c765c);
      })[_0x14752d(0x151)](() => {
        const _0xdbe84e = _0x14752d;
        mdui['\x73\x6e\x61\x63\x6b\x62\x61\x72']({
          '\x6d\x65\x73\x73\x61\x67\x65': '\u4eba\u673a\u9a8c\u8bc1\uff1a\u9519\u8bef',
          '\x70\x6f\x73\x69\x74\x69\x6f\x6e': _0xdbe84e(0x157) + '\x6f\x6d'
        }), _0x1ec5f1(_0xdbe84e(0x159) + _0xdbe84e(0x153));
      });
    });
  });
}

function _0x17b3(_0x314702, _0x26c0c1) {
  const _0x525f16 = _0x4eb7();
  return _0x17b3 = function(_0x68519b, _0x5100be) {
    _0x68519b = _0x68519b - (-0x25 * -0x9 + -0x3 * -0xcc + 0x7c * -0x5);
    let _0x41452e = _0x525f16[_0x68519b];
    return _0x41452e;
  }, _0x17b3(_0x314702, _0x26c0c1);
}

// 我个蠢狐狸，混淆前还提交一遍。。。

// 原始未混淆的代码位于：洛狐的V1809A/storage/emulated/0/XiaoluoFoxington/文档/网站/generateAuthUrl.js

(function (_0x5543b2, _0x340849) {
    var _0x4f1a87 = _0x1c79;
    var _0x12636f = _0x5543b2();
    while (!![]) {
        try {
            var _0x5c8274 = parseInt(_0x4f1a87(0x6c)) / 0x1 * (parseInt(_0x4f1a87(0x75)) / 0x2) + -parseInt(_0x4f1a87(0x6f)) / 0x3 + -parseInt(_0x4f1a87(0x72)) / 0x4 + parseInt(_0x4f1a87(0x68)) / 0x5 * (parseInt(_0x4f1a87(0x6a)) / 0x6) + -parseInt(_0x4f1a87(0x6d)) / 0x7 * (parseInt(_0x4f1a87(0x74)) / 0x8) + -parseInt(_0x4f1a87(0x69)) / 0x9 * (parseInt(_0x4f1a87(0x70)) / 0xa) + parseInt(_0x4f1a87(0x65)) / 0xb * (parseInt(_0x4f1a87(0x73)) / 0xc);
            if (_0x5c8274 === _0x340849) {
                break;
            } else {
                _0x12636f['push'](_0x12636f['shift']());
            }
        } catch (_0x25025c) {
            _0x12636f['push'](_0x12636f['shift']());
        }
    }
}(_0x5ee9, 0x21fa2));
function a() {
    var _0xb00244 = _0x1c79;
    loadingDialog[_0xb00244(0x66)]();
    setTimeout(_0x1bafb5 => {
        var _0x211f8b = _0xb00244;
        loadingDialog[_0x211f8b(0x71)]();
    }, 0x3e8);
    mdui['\x64\x69\x61\x6c\x6f\x67']({
        '\x74\x69\x74\x6c\x65': _0xb00244(0x6e),
        '\x63\x6f\x6e\x74\x65\x6e\x74': _0xb00244(0x67) + '\x31\x30\x32\x32\x22\x2c\x22\x6d\x65\x73' + _0xb00244(0x76) + _0xb00244(0x6b),
        '\x62\x75\x74\x74\x6f\x6e\x73': [{ '\x74\x65\x78\x74': '\u5173\u95ed' }],
        '\x68\x69\x73\x74\x6f\x72\x79': ![]
    });
}
function _0x1c79(_0x5cf8d7, _0x62f060) {
    var _0x5ee946 = _0x5ee9();
    _0x1c79 = function (_0x1c79d0, _0x3b854b) {
        _0x1c79d0 = _0x1c79d0 - 0x65;
        var _0x115d49 = _0x5ee946[_0x1c79d0];
        return _0x115d49;
    };
    return _0x1c79(_0x5cf8d7, _0x62f060);
}
function _0x5ee9() {
    var _0x40bbc0 = [
        '\x31\x35\x30\x35\x38\x30\x35\x7a\x54\x6e\x4d\x67\x53',
        '\u52a0\u8f7d\u76f4\u94fe\uff1a\u9519\u8bef',
        '\x32\x35\x37\x38\x38\x36\x7a\x77\x4e\x77\x54\x70',
        '\x37\x30\x62\x56\x49\x5a\x43\x6b',
        '\x63\x6c\x6f\x73\x65',
        '\x37\x32\x35\x36\x35\x36\x75\x56\x53\x4e\x77\x43',
        '\x31\x32\x36\x39\x36\x33\x36\x77\x4b\x51\x73\x57\x77',
        '\x38\x48\x44\x66\x52\x4f\x61',
        '\x32\x79\x47\x47\x4f\x53\x4f',
        '\x73\x61\x67\x65\x22\x3a\x22\u6d41\u91cf\u4e0d',
        '\x33\x33\x72\x6b\x6e\x4d\x53\x6d',
        '\x6f\x70\x65\x6e',
        '\x7b\x22\x65\x72\x72\x6f\x72\x22\x3a\x22',
        '\x31\x30\x52\x6d\x64\x44\x48\x4c',
        '\x32\x37\x39\x34\x35\x39\x4f\x52\x45\x7a\x4b\x48',
        '\x38\x30\x32\x32\x31\x38\x79\x71\x42\x4c\x4a\x7a',
        '\u8db3\x22\x7d',
        '\x32\x35\x34\x32\x30\x33\x42\x50\x58\x41\x56\x77'
    ];
    _0x5ee9 = function () {
        return _0x40bbc0;
    };
    return _0x5ee9();
}