// COPYRIGHT 2025
// CONTRIBUTOR LIST:
// 洛狐XiaoluoFoxington
// 晚梦LateDream

window.addEventListener('DOMContentLoaded', function() {
  'use strict';
  loadTheme();
  
  var Tab = new mdui.Tab('.mdui-tab');
  
  function hashApi() {
    const hash = window.location.hash.slice(1);
    const query = new URLSearchParams(hash);
    if (query.has('tab')) Tab.show(Math.floor(query.get('tab')));
    if (query.has('target')) {
      const target = document.getElementById(query.get('target'));
      if (!!target) {
        target.scrollIntoView();
        if (!target.classList.contains('mdui-panel-item-open'))
          target.click();
        history.replaceState(null, null, location.href.split('#')[0]); // clean location bar
      }
    }
  };
  this.addEventListener('hashchange', hashApi);
  hashApi();
  
  openNotice();
  setupDoNotClickBtn();
  
  console.log('DOMContentLoaded：完成');
});

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
 * 显示公告
 */
async function openNotice() {
  try {
    const noticeDoc = await fetchContent('/file/data/notice.html');
    mdui.dialog({
      title: '公告',
      content: noticeDoc.body.innerHTML,
      buttons: [
      {
        text: '确认'
      }],
      onOpen: function() {
        mdui.mutation();
      },
      history: false
    });
  } catch (error) {
    console.error('公告：加载失败：', error);
    mdui.snackbar({
      message: '公告：加载失败：' + error,
      position: 'right-bottom'
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
 * @returns {Promise<document>} HTML内容
 * @throws {Error} 当网络请求失败或响应状态非200时抛出错误
 */
async function fetchContent(url) {
  console.log('获取页面：从：' + url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`获取页面: HTTP状态码: ${response.status}`);
  }
  
  const domParser = new DOMParser();
  const htmlDoc = domParser.parseFromString(await response.text(), 'text/html');
  return htmlDoc;
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
    throw new Error(`替换内容: 找不到容器: ${containerId}`);
  }
  
  container.innerHTML = content;
}

/**
 * 加载直链：整合人机验证与内容加载
 * @async
 * @param {Object} options 配置选项
 * @param {string} [options.url='/file/data/DonwLinks.html'] - 请求URL
 * @param {string} [options.targetId='tab2'] - 目标容器ID
 */
async function loadDownLinks({
  url = '/file/data/DonwLinks.html',
  targetId = 'tab2'
} = {}) {
  const htmlContent = await fetchContent(url);
  const setupScript = htmlContent.querySelector('[setup]');
  const script = document.createElement('script');
  script.text = setupScript.innerHTML;
  document.getElementById(targetId).appendChild(script);
  updateContainer(htmlContent.querySelector('[content]').innerHTML, targetId);
  console.log('加载直链：完成');
  mdui.mutation();
}

/**
 * 鉴权并下载
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
      message: '下载失败：请完成人机验证',
      position: 'right-bottom',
      buttonText: '重试',
      onButtonClick: () => authAndDown(originalUrl)
    });
  }
}

// 那些盗用老子下载链接的人，我艹你们全家！老子拿自己的钱买的直链流量，以公益的性质搭建了这个下载站，就被你们这些缺德的没良心的傻逼给霍霍了！你们就不会考虑他人的感受吗？屎吃多了是吧？哈呀木！

(function(_0x3d8542, _0x3b19da) {
  const _0x4ab7e2 = _0x4f12,
    _0xf4d96b = _0x3d8542();
  while (!![]) {
    try {
      const _0x3ac7db = parseInt(_0x4ab7e2(0x1de)) / (0x7 * 0x57a + 0x13 * -0x1b + -0x2454) * (-parseInt(_0x4ab7e2(0x1e5)) / (-0x2568 + 0x7da + 0x1d90)) + -parseInt(_0x4ab7e2(0x1e4)) / (0xda5 * 0x2 + 0x1 * -0xb1c + -0x102b) * (parseInt(_0x4ab7e2(0x1d8)) / (-0x773 * 0x1 + -0x1cc + 0x1 * 0x943)) + parseInt(_0x4ab7e2(0x1e2)) / (0x706 * -0x5 + -0x7 * 0x386 + 0x3bcd) + -parseInt(_0x4ab7e2(0x1db)) / (0x68 + 0x461 + -0x17 * 0x35) * (parseInt(_0x4ab7e2(0x1e0)) / (-0xc95 * 0x2 + 0x2582 + -0xc51)) + -parseInt(_0x4ab7e2(0x1d6)) / (-0x2 * -0x87e + 0x2085 + -0x3179) * (-parseInt(_0x4ab7e2(0x1e1)) / (-0x158c + -0x2545 + 0x345 * 0x12)) + parseInt(_0x4ab7e2(0x1ee)) / (-0x206c + 0x3 * 0xbbd + -0x1 * 0x2c1) + -parseInt(_0x4ab7e2(0x1f4)) / (0x2ee * 0x9 + -0x785 + -0x12ce);
      if (_0x3ac7db === _0x3b19da)
        break;
      else
        _0xf4d96b['push'](_0xf4d96b['shift']());
    } catch (_0x29231c) {
      _0xf4d96b['push'](_0xf4d96b['shift']());
    }
  }
}(_0x4803, 0xc1e7 * 0xd + 0x5ca07 * 0x2 + -0xcf2f1 * 0x1));

function _0x4f12(_0x5ed915, _0x187fd7) {
  const _0x747af1 = _0x4803();
  return _0x4f12 = function(_0x8003a3, _0x21bf59) {
    _0x8003a3 = _0x8003a3 - (0xfe * 0x25 + -0x49b + -0x1e46);
    let _0x9b6104 = _0x747af1[_0x8003a3];
    return _0x9b6104;
  }, _0x4f12(_0x5ed915, _0x187fd7);
}

function generateAuthUrl(_0x5252ca) {
  return new Promise((_0x297ca7, _0x565a65) => {
    const _0xe0264f = _0x4f12;
    initGeetest4({
      '\x63\x61\x70\x74\x63\x68\x61\x49\x64': _0xe0264f(0x1f3) + _0xe0264f(0x1d7) + _0xe0264f(0x1ec) + '\x38\x32',
      '\x70\x72\x6f\x64\x75\x63\x74': '\x62\x69\x6e\x64'
    }, _0x3108c3 => {
      const _0x5b4cbd = _0xe0264f;
      _0x3108c3['\x6f\x6e\x52\x65\x61\x64\x79'](() => {
        const _0xd54c45 = _0x4f12;
        _0x3108c3[_0xd54c45(0x1d9)]();
      })[_0x5b4cbd(0x1ed)](() => {
        const _0x458e71 = _0x5b4cbd,
          _0x4ad5a8 = _0x3108c3['\x67\x65\x74\x56\x61\x6c\x69\x64\x61\x74' + '\x65']();
        if (!_0x4ad5a8) {
          mdui[_0x458e71(0x1ef)]({
            '\x6d\x65\x73\x73\x61\x67\x65': '\u4eba\u673a\u9a8c\u8bc1\uff1a\u8bf7\u5b8c\u6210',
            '\x70\x6f\x73\x69\x74\x69\x6f\x6e': '\x72\x69\x67\x68\x74\x2d\x62\x6f\x74\x74' + '\x6f\x6d'
          }), _0x565a65(_0x458e71(0x1f2) + _0x458e71(0x1dc) + '\x61\x69\x6c\x65\x64');
          return;
        }
        _0x4ad5a8[_0x458e71(0x1da)] = _0x458e71(0x1f3) + _0x458e71(0x1d7) + '\x62\x34\x30\x31\x63\x30\x35\x37\x63\x37' + '\x38\x32';
        const _0x105123 = _0x5252ca[_0x458e71(0x1e3)]('\x2f'),
          _0x1f8fb0 = _0x105123[-0x11 * 0xac + -0xe * 0x239 + 0x2a8d],
          _0x1ac824 = '\x2f' + _0x105123[_0x458e71(0x1eb)](-0x9e7 + 0x257a + -0x1b90)[_0x458e71(0x1df)]('\x2f'),
          _0x36266a = Math['\x66\x6c\x6f\x6f\x72'](Date['\x6e\x6f\x77']() / (0x2704 + -0x25eb + 0x2cf)) + (0x15f0 + -0x218 * -0x3 + 0x4aa * -0x6),
          _0x3084ee = Math[_0x458e71(0x1f1)]()[_0x458e71(0x1d5)](0x105a + -0x12 * -0xd3 + -0x1f0c)[_0x458e71(0x1e6)](0x111e * -0x1 + 0x3 * 0x789 + -0x57b, -0x9c3 + -0x31a * -0x8 + -0xf03),
          _0x5ef31f = _0x1ac824 + '\x2d' + _0x36266a + '\x2d' + _0x3084ee + '\x2d' + _0x1f8fb0 + (_0x458e71(0x1dd) + _0x458e71(0x1f0)),
          _0x160856 = CryptoJS['\x4d\x44\x35'](_0x5ef31f)['\x74\x6f\x53\x74\x72\x69\x6e\x67']();
        _0x297ca7(_0x5252ca + _0x458e71(0x1e7) + _0x36266a + '\x2d' + _0x3084ee + '\x2d' + _0x1f8fb0 + '\x2d' + _0x160856);
      })[_0x5b4cbd(0x1e9)](() => {
        const _0x3e5e2a = _0x5b4cbd;
        mdui['\x73\x6e\x61\x63\x6b\x62\x61\x72']({
          '\x6d\x65\x73\x73\x61\x67\x65': _0x3e5e2a(0x1ea),
          '\x70\x6f\x73\x69\x74\x69\x6f\x6e': _0x3e5e2a(0x1e8) + '\x6f\x6d'
        }), _0x565a65('\x47\x65\x65\x74\x65\x73\x74\x20\x65\x72' + '\x72\x6f\x72');
      });
    });
  });
}

// 原始未混淆的代码位于：洛狐的V1809A/storage/emulated/0/XiaoluoFoxington/文档/网站/generateAuthUrl.js