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

function generateAuthUrl(originalUrl) {
  return new Promise((resolve, reject) => {
    initGeetest4({
      captchaId: 'adc196db554a4bf4db58b401c057c782',
      product: 'bind'
    }, (captcha) => {
      captcha.onReady(() => {
        captcha.showBox();
      }).onSuccess(() => {
        const result = captcha.getValidate();
        if (!result) {
          mdui.snackbar({ message: '人机验证：请完成', position: 'right-bottom' });
          reject('Geetest validation failed');
          return;
        }
        
        result.captcha_id = "adc196db554a4bf4db58b401c057c782";
        const parts = originalUrl.split('/');
        const uid = parts[3];
        const uriPath = '/' + parts.slice(3).join('/');
        const timestamp = Math.floor(Date.now() / 1000) + 60;
        const rand = Math.random().toString(36).substring(2, 10);
        const signString = `${uriPath}-${timestamp}-${rand}-${uid}-thiefDeadFullFam`;
        const md5hash = CryptoJS.MD5(signString).toString();
        resolve(`${originalUrl}?auth_key=${timestamp}-${rand}-${uid}-${md5hash}`);
        
      }).onError(() => {
        mdui.snackbar({ message: '人机验证：错误', position: 'right-bottom' });
        reject('Geetest error');
      });
    });
  });
}

// 原始未混淆的代码位于：洛狐的V1809A/storage/emulated/0/XiaoluoFoxington/文档/网站/generateAuthUrl.js