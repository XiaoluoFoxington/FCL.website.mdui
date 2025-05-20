window.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  loadTheme();
  
  var Tab = new mdui.Tab('.mdui-tab');
  
  function hashUnfold() {
    return new Promise(function(resolve, reject) {
      try {
        var hash = location.hash.substring(1);
        if (hash) {
          var target = document.getElementById(hash);
          target.scrollIntoView();
          if (!target.classList.contains('mdui-panel-item-open'))
            target.click();
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };
  
  // tab路由
  if (location.href.split('?').length > 1) {
    var requery = new URLSearchParams(location.href.split('?')[1]);
    if (requery.has('tab')) Tab.show(parseInt(requery.get('tab')));
    hashUnfold().finally(function() {
      // 保证地址栏干净(
      history.replaceState(null, null, location.href.split('?')[0]);
    });
  }
  
  openNotice();
  geetest();

  this.document.getElementById('do-not-click').addEventListener('click', async function(event) {
    event.preventDefault();

    const events = (await import('./DoNotClick.js')).default;
    events[parseInt(Math.random() * events.length)].run();
  });
  
  console.log('DOMContentLoaded：完成');
});

window.onload = function() {
  document.getElementById('loading').remove(); //移除加载动画
  document.getElementById('fclIcon').classList.remove('hide');
  
  console.log('window.onload：完成');
}

/**
 * 显示公告
 */
function openNotice() {
  
  mdui.dialog({
    
    title: '公告',
    
    content: `
<div class="mdui-typo">
  <p>PojavLauncher的用户请注意！PojavLauncher开发团队于2025年5月17日宣布项目停止更新，GH代码仓库归档。这意味以后不会再有新功能开发和安全更新。大家可转向FCL启动器、ZL启动器作为替代方案，或密切关注Pojav团队全新成立的<a href="https://github.com/AngelAuraMC" target="_blank">AngelAuraMC组织</a>推出的<a href="https://github.com/AngelAuraMC/Amethyst-Android" target="_blank">Amethyst启动器项目</a>。</p>
  <hr>
  <p>接入 GeeTest 了。让我省点心吧。本来想着那点流量能用到我中考之后的，看来是不可能了…</p>
</div>
`,
    
    buttons: [
    {
      text: '确认'
    }],
    
    history: false
  });
  
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
 * 加载直链：获取下载链接到下载页面
 * @async
 * @param {Object} options 配置选项
 * @param {string} [options.url='/file/data/DonwLinks.html'] - 请求URL
 * @param {string} [options.targetId='tab2'] - 目标容器ID
 */
async function loadDownLinks({
  url = '/file/data/DonwLinks.html',
  targetId = 'tab2'
} = {}) {
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
      
      buttons: [
      {
        text: '确定'
      }],
      
      history: false
    });
  }
}

/**
 * GeeTest
 */
function geetest() {
  var button = document.getElementById('loadDownLinksBtn');
  
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    button.onclick = function() {
      loadDownLinks();
      mdui.snackbar({
        message: '调试：跳过人机验证',
        position: 'right-bottom',
      });
    };
    return;
  }
  
  initGeetest4({
    captchaId: 'adc196db554a4bf4db58b401c057c782',
    product: 'bind'
  }, function(captcha) {
    captcha.onReady(function() {}).onSuccess(function() {
      var result = captcha.getValidate();
      if (!result) {
        mdui.snackbar({
          message: '人机验证：请完成',
          position: 'right-bottom',
        });
      }
      result.captcha_id = "adc196db554a4bf4db58b401c057c782";
      
      console.log('人机验证：通过');
      loadDownLinks();
      
    }).onError(function() {
      console.log('人机验证：发生错误');
      mdui.snackbar({
        message: '人机验证：发生错误',
        position: 'right-bottom',
      });
    });
    
    button.onclick = function() {
      captcha.showBox();
    }
  });
  
}