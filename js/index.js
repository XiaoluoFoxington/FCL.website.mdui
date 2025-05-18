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
    hashUnfold().then(function() {
      // 保证地址栏干净(
      history.replaceState(null, null, location.href.split('?')[0]);
    });
  }
  
  openNotice();
  
  geetest();
});

window.onload = function() {
  document.getElementById('loading').remove(); //移除加载动画
}

/**
 * 显示公告
 */
function openNotice() {
  
  const notice = {
    
    title: '公告',
    
    content: `
<div class="mdui-typo">
  <p>PojavLauncher的用户请注意！PojavLauncher开发团队于2025年5月17日宣布项目停止更新，GH代码仓库归档。这意味以后不会再有新功能开发和安全更新。大家可转向FCL启动器、ZL启动器作为替代方案，或密切关注Pojav团队全新成立的AngelAuraMC组织推出的Amethyst启动器项目。</p>
  <hr>
  <p>求求某些缺德的人补药再滥用我滴流量了（悲</p>
  <p>
    <img src="/file/picture/公告.webp">
  </p>
</div>
`,
    
    buttons: [
    {
      text: '确认'
    }],
    
    history: false
  };
  
  mdui.dialog(notice);
  
}

/**
 * 彩蛋
 */
function openEgg() {
  
  const egg = {
    
    title: '',
    
    content: '<img src="/file/picture/得意.webp">',
    
    buttons: [
    {
      text: '关闭'
    }],
    
    history: false
  };
  
  mdui.dialog(egg);
  
}

/**
 * 主题切换
 */
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains('mdui-theme-layout-dark');
  
  body.classList.toggle('mdui-theme-layout-dark', !isDark);
  
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

/**
 * 加载主题
 */
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;
  
  if (savedTheme) {
    body.classList.toggle('mdui-theme-layout-dark', savedTheme === 'dark');
  }
}

/**
 * 从指定URL获取HTML内容
 * @async
 * @param {string} url - 请求的URL地址
 * @returns {Promise<string>} HTML内容字符串
 * @throws {Error} 当网络请求失败或响应状态非200时抛出错误
 */
async function fetchContent(url) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP错误! 状态码: ${response.status}`);
  }
  
  return await response.text();
}

/**
 * 将内容更新到指定容器
 * @param {string} content - 要插入的HTML内容
 * @param {string} containerId - 目标容器的ID
 * @throws {Error} 当目标容器不存在时抛出错误
 */
function updateContainer(content, containerId) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    throw new Error(`找不到ID为 ${containerId} 的容器`);
  }
  
  container.innerHTML = content;
}

/**
 * 主处理函数：加载并更新内容
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
    updateContainer(htmlContent, targetId);
    mdui.mutation();
  } catch (error) {
    console.error('内容加载失败:', error);
    document.getElementById(targetId).innerHTML = `<p class="error">加载失败: ${error.message}</p>`;
  }
}


/**
 * GeeTest
 */
function geetest() {
  var button = document.getElementById('loadDownLinksBtn');
  
  initGeetest4({
    captchaId: 'adc196db554a4bf4db58b401c057c782',
    product: 'bind'
  }, function(captcha) {
    captcha.onReady(function() {
    }).onSuccess(function() {
      var result = captcha.getValidate();
      if (!result) {
        return alert('请完成验证');
      }
      result.captcha_id = "adc196db554a4bf4db58b401c057c782";
      
      loadDownLinks();
      
    }).onError(function() {
      // 错误处理逻辑
    });
    
    button.onclick = function() {
      captcha.showBox();
    }
  });
  
}