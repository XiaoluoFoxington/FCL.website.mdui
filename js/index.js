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
  document.getElementById('loading').remove(); //移除加载动画
  document.getElementById('fclIcon').classList.remove('hide');
  
  console.log('window.onload：完成');
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
  /** 核心加载逻辑 */
  async function _executeLoad() {
    try {
      const htmlContent = await fetchContent(url);
      const setupScript = htmlContent.querySelector('[setup]');
      const script = document.createElement('script');
      script.text = setupScript.innerHTML;
      document.getElementById(targetId).appendChild(script);
      updateContainer(htmlContent.querySelector('[content]').innerHTML, targetId);
      console.log('加载直链：完成');
      mdui.mutation();
    } catch (error) {
      console.error('加载直链: ', error);
      mdui.dialog({
        title: '错误',
        content: error,
        buttons: [{ text: '确定' }],
        history: false
      });
    }
  }
  
  // 环境检测
  const isLocal = window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  
  if (isLocal) {
    await _executeLoad();
    mdui.snackbar({
      message: '人机验证：调试：跳过人机验证',
      position: 'right-bottom',
    });
    dispatchEvent(new Event('hashchange'));
    return;
  }
  
  // 生产环境初始化验证
  initGeetest4({
    captchaId: 'adc196db554a4bf4db58b401c057c782',
    product: 'bind'
  }, (captcha) => {
    captcha.onReady(() => {})
      .onSuccess(() => {
        const result = captcha.getValidate();
        if (!result) {
          mdui.snackbar({ message: '人机验证：请完成', position: 'right-bottom' });
          return;
        }
        result.captcha_id = "adc196db554a4bf4db58b401c057c782";
        console.log('人机验证：通过');
        _executeLoad();
        dispatchEvent(new Event('hashchange'));
      })
      .onError(() => {
        console.log('人机验证：发生错误');
        mdui.snackbar({ message: '人机验证：发生错误', position: 'right-bottom' });
      });
    
    // 直接触发验证框
    captcha.showBox();
  });
}

/**
 * 鉴权并下载
 * @param {string} originalUrl 原始URL
 */
function authAndDown(originalUrl) {
  const authUrl = generateAuthUrl(originalUrl);
  const downloadLink = document.createElement('a');
  downloadLink.href = authUrl;
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// 那些盗用老子下载链接的人，我艹你们全家！老子拿自己的钱买的直链流量，以公益的性质搭建了这个下载站，就被你们这些缺德的没良心的傻逼给霍霍了！你们就不会考虑他人的感受吗？屎吃多了是吧？哈呀木！
(function (_0x112ee, _0x32323a) {
    const _0x3a811f = _0x14fb;
    const _0x64ea5b = _0x112ee();
    while (!![]) {
        try {
            const _0x173bc2 = -parseInt(_0x3a811f(0x6b)) / 0x1 * (parseInt(_0x3a811f(0x76)) / 0x2) + parseInt(_0x3a811f(0x6c)) / 0x3 + -parseInt(_0x3a811f(0x67)) / 0x4 + -parseInt(_0x3a811f(0x71)) / 0x5 + parseInt(_0x3a811f(0x6f)) / 0x6 * (-parseInt(_0x3a811f(0x75)) / 0x7) + -parseInt(_0x3a811f(0x77)) / 0x8 * (-parseInt(_0x3a811f(0x68)) / 0x9) + -parseInt(_0x3a811f(0x6d)) / 0xa * (-parseInt(_0x3a811f(0x78)) / 0xb);
            if (_0x173bc2 === _0x32323a) {
                break;
            } else {
                _0x64ea5b['push'](_0x64ea5b['shift']());
            }
        } catch (_0x371ef9) {
            _0x64ea5b['push'](_0x64ea5b['shift']());
        }
    }
}(_0x2ada, 0xe74de));
function _0x14fb(_0x3aca73, _0x512922) {
    const _0x2adadf = _0x2ada();
    _0x14fb = function (_0x14fbaf, _0x463047) {
        _0x14fbaf = _0x14fbaf - 0x67;
        let _0x332a5e = _0x2adadf[_0x14fbaf];
        return _0x332a5e;
    };
    return _0x14fb(_0x3aca73, _0x512922);
}
function generateAuthUrl(_0x281662) {
    const _0x24cee8 = _0x14fb;
    const _0x3e9d01 = _0x281662[_0x24cee8(0x70)]('\x2f');
    const _0x16f8ec = _0x3e9d01[0x3];
    const _0x25332f = '\x2f' + _0x3e9d01['\x73\x6c\x69\x63\x65'](0x3)['\x6a\x6f\x69\x6e']('\x2f');
    const _0x40983b = Math[_0x24cee8(0x72)](Date['\x6e\x6f\x77']() / 0x3e8) + 0x3c;
    const _0x37774e = Math[_0x24cee8(0x69)]()[_0x24cee8(0x73)](0x24)[_0x24cee8(0x6a)](0x2, 0xa);
    const _0x367107 = _0x25332f + '\x2d' + _0x40983b + '\x2d' + _0x37774e + '\x2d' + _0x16f8ec + ('\x2d\x74\x68\x69\x65\x66\x44\x65\x61\x64' + _0x24cee8(0x74));
    const _0x1e5a52 = CryptoJS[_0x24cee8(0x6e)](_0x367107)['\x74\x6f\x53\x74\x72\x69\x6e\x67']();
    const _0x4d3cb8 = _0x281662 + '\x3f\x61\x75\x74\x68\x5f\x6b\x65\x79\x3d' + _0x40983b + '\x2d' + _0x37774e + '\x2d' + _0x16f8ec + '\x2d' + _0x1e5a52;
    return _0x4d3cb8;
}
// 原始未混淆的代码位于：洛狐的V1809A/storage/emulated/0/XiaoluoFoxington/文档/网站/generateAuthUrl.js