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

  this.document.getElementById('do-not-click').addEventListener('click', async function(event) {
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
  <p>我一直在思考，我为什么搭建这个下载站。是发自内心的奉献精神？在社区中获得知名度？还是单纯想体验体验当“站长”的感觉？</p>
  <p>当我从柠枺手中接过这个域名开始，我并没有料到，这个网站在社区中越来越知名，日访问量激增，就连流量消耗也从原来的1GiB/天上升为30GiB/天，节假日时甚至达到了惊人的100GiB/天。</p>
  <p>最初，我只是摆了几个站外下载链接。有人说不方便，于是我购买了直链；最初，我在下载页面列出一大堆版本信息。有人说不知道点哪个，于是我专门做了一页只含一个硕大下载按钮的页面；最初，我看不惯如今越来越千篇一律的界面设计，使用了自己的样式。有人说不好看，于是我基于Material Design重制了整个网站。</p>
  <p>我好像一直在被牵着鼻子走。</p>
  <p>我开始回顾，我所做的一切是否有意义。我将空闲时间用在写网站上，将零花钱用于购买直链上。而我只是一个即将中考的普通初中生，没有任何经济来源。最终我得到了什么呢？</p>
  <p>这个世界已经死了。或者说，这个世界从来就没有活过。从滥用直链者的自私，从强加想法于他人者的吐槽辱骂。</p>
  <p>不，是有意义的！下载站搭建完成后，我收到的第一句感谢，第一笔赞助，第一条PR…是你们，让我有了坚持下去的动力，让我不顾是否有意义，让我享受编写网站所带给我的快乐。</p>
  <p>整整1TiB的流量仅耗时2个月就已全部用完，而我的经济实力，面对接下来的暑假，也许有点见挫…</p>
  <p>我将会尽我最大的努力继续运营这个下载站。但也希望某些人好自为知。</p>
  <hr>
  <p>PojavLauncher的用户请注意！PojavLauncher开发团队于2025年5月17日宣布项目停止更新，GH代码仓库归档。这意味以后不会再有新功能开发和安全更新。大家可转向FCL启动器、ZL启动器作为替代方案，或密切关注Pojav团队全新成立的<a href="https://github.com/AngelAuraMC" target="_blank">AngelAuraMC组织</a>推出的<a href="https://github.com/AngelAuraMC/Amethyst-Android" target="_blank">Amethyst启动器项目</a>。</p>
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
      message: '调试：跳过人机验证',
      position: 'right-bottom',
    });
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
      })
      .onError(() => {
        console.log('人机验证：发生错误');
        mdui.snackbar({ message: '人机验证：发生错误', position: 'right-bottom' });
      });
    
    // 直接触发验证框
    captcha.showBox();
  });
}