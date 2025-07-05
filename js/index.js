// COPYRIGHT 2025
// CONTRIBUTOR LIST:
// 洛狐XiaoluoFoxington
// 晚梦LateDream

let fclDownWay1Laoded = false;
let fclDownWay2Laoded = false;
let fclDownWay3Laoded = false;
let zlDownWay1Laoded = false;
let zlDownWay2Laoded = false;
let checksumsLoaded = false;
let aboutLoaded = false;
let showEpilepsyWarning = true;


window.addEventListener('DOMContentLoaded', function () {
  'use strict';
  requestAnimationFrame(() => {
    initApp();
    console.log('DOMContentLoaded：完成');
  });
});

/**
 * 初始化各种玩意
 */
function initApp() {
  requestAnimationFrame(() => {
    updateStatus('初始化Eruda…');
    initEruda();

    requestAnimationFrame(() => {
      updateStatus('获取系统主题色偏好...');
      if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches ? 'dark' : 'light');
      }

      requestAnimationFrame(() => {
        updateStatus('加载主题…');
        loadTheme();

        requestAnimationFrame(() => {
          updateStatus('初始化地址栏参数解析…');
          handleHashRouting();

          requestAnimationFrame(() => {
            updateStatus('添加事件监听…');
            window.addEventListener('hashchange', handleHashRouting);
            document.getElementById('loadChecksums').addEventListener('click', loadChecksums);
            document.getElementById('loadAbout').addEventListener('click', loadAbout);

            requestAnimationFrame(() => {
              updateStatus('打开公告…');
              openNotice();

              requestAnimationFrame(() => {
                updateStatus('获取首页链接…');
                setupIndexDownLinks();

                requestAnimationFrame(() => {
                  updateStatus('获取系统信息…');
                  showDeviceInfo('deviceInfo');

                  requestAnimationFrame(() => {
                    updateStatus('加载运作时间…');
                    loadRunTime();

                    requestAnimationFrame(() => {
                      updateStatus('加载FCL线路2流量…');
                      loadFclDownWay2Info();

                      requestAnimationFrame(() => {
                        updateStatus('添加定时器…');
                        setInterval(loadRunTime, 1000);
                        setInterval(loadFclDownWay2Info, 60000);

                        requestAnimationFrame(() => {
                          updateStatus('等待其它乱七八糟的东西…')
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

window.onload = function () {
  requestAnimationFrame(() => {
    updateStatus('移除此提示…');
    removeLoadTip();
    console.log('window.onload：完成');
  });
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
 * 显示加载中
 * @returns “正在加载”弹窗
 */
function showLoading() {
  const dialog = new mdui.dialog({
    title: '正在加载…',
    content: '<div class="mdui-spinner"></div>',
    buttons: [],
    history: false,
    closeOnEsc: false,
    closeOnConfirm: false,
    modal: true,
  });
  dialog.open();
  mdui.mutation();
  return dialog;
}

/**
 * 执行"千万别点"事件
 * @param {number} eventId - 可选的事件ID，指定要运行的事件
 */
async function runDoNotClickEvent(eventId) {
  const events = (await import('./DoNotClick.js')).default;
  console.log("千万别点：事件数量：", events.length);

  const runEvent = (event) => {
    event.run();
    console.log(`千万别点：执行：${event.name}`);
    mdui.snackbar({
      message: `千万别点：${event.name}`,
      position: 'right-bottom',
    });
  };

  const shouldShowWarning = (event) => {
    const needWarning = event.warning && showEpilepsyWarning;
    console.log(`千万别点：${event.name}：显示警告：${needWarning}`);
    return needWarning;
  };

  const handleWarningDialog = (event, runCallback) => {
    mdui.dialog({
      title: '光敏性癫痫警告',
      content: '此功能包含闪烁、闪光或动态视觉效果，可能对光敏性癫痫患者或光敏症患者造成不适。如果您有相关病史，请勿继续操作。',
      buttons: [
        {
          text: '取消',
          onClick: () => {
            return true;
          }
        },
        {
          text: '继续',
          onClick: () => {
            showEpilepsyWarning = false;
            // 只显示一次警告
            runCallback();
            return true;
          }
        }],
      onOpen: function () {
        mdui.mutation();
      },
      history: false,
      closeOnEsc: false,
      modal: true
    });
  };

  if (typeof eventId === 'number') {
    console.log(`千万别点：指定：${eventId}`);

    if (eventId >= 0 && eventId < events.length) {
      const selectedEvent = events[eventId];
      console.log(`千万别点：${selectedEvent.name}：找到`);

      if (shouldShowWarning(selectedEvent)) {
        handleWarningDialog(selectedEvent, () => runEvent(selectedEvent));
      } else {
        runEvent(selectedEvent);
      }
    } else {
      console.error(`千万别点：错误：无效的事件ID：${eventId}`);
      mdui.dialog({
        title: '千万别点：错误：',
        content: `无效的事件ID：${eventId}`,
        buttons: [{
          text: '确定',
          onClick: () => true
        }],
        history: false
      });
    }
    return;
  }

  const runRandom = () => {
    const randomIndex = Math.floor(Math.random() * events.length);
    const randomEvent = events[randomIndex];
    console.log(`千万别点：随机选中${randomEvent.name}[${randomIndex}]`);

    if (shouldShowWarning(randomEvent)) {
      handleWarningDialog(randomEvent, () => runEvent(randomEvent));
    } else {
      runEvent(randomEvent);
    }
  };

  runRandom();
}

/**
 * 选择一个“千万别点”事件运行
 */
function runSelectDNCEvent() {
  mdui.prompt('eventId', '请输入事件ID，空为随机',
    function (value) {
      runDoNotClickEvent(Number(value));
    },
  );
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
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  const debugMode = new URLSearchParams(location.search).has('debug');
  const debugTip = document.getElementById('debugTip');
  const statusTip = document.getElementById('statusTip');

  if (window.eruda && debugMode) {
    eruda.init();
    console.info('Eruda：启用');

    if (!isLocal && debugTip) {
      console.log('调试：非localhost');
      debugTip.classList.remove('hide');
    } else {
      debugTip.remove();
      statusTip.classList.remove('hide')
    }
  } else {
    debugTip.remove();
    statusTip.remove();
  }
}

/**
 * 显示公告
 * @param {boolean} [forceShow=false] 强制显示公告，忽略哈希检查
 */
async function openNotice(forceShow = false) {
  const loadingDialog = showLoading();

  try {
    const noticeDoc = await fetchContent('/file/data/notice.html');
    loadingDialog.close();

    const noticeContent = noticeDoc.body.innerHTML;
    const hashCurrent = hashCode(noticeContent);
    const hashStored = localStorage.getItem('notice_hash');

    const shouldSkipDisplay = !forceShow && (hashStored === hashCurrent);

    if (shouldSkipDisplay) {
      console.log('公告：内容未变，不显示');
      mdui.snackbar({
        message: `公告：内容未变`,
        position: 'right-bottom',
      });
      return;
    }

    const closeHandler = () => console.log('公告：已关闭');

    const dialog = mdui.dialog({
      title: '公告',
      content: noticeContent,
      buttons: [
        {
          text: '不再显示当前公告',
          onClick: () => {
            localStorage.setItem('notice_hash', hashCurrent);
            console.log('公告：不再显示，已存储内容标识');
            return true;
          }
        },
        {
          text: '确认'
        }],
      onOpen: () => mdui.mutation(),
      onClose: closeHandler,
      history: false
    });

    console.log(`公告：${forceShow ? '强制显示' : '显示新内容'}`);

  } catch (error) {
    loadingDialog.close();

    console.error('公告：加载失败：', error);
    mdui.dialog({
      title: '公告：加载失败',
      content: error,
      buttons: [{ text: '关闭' }],
      history: false
    });
  }
}

/**
 * 简易哈希函数生成内容标识
 */
function hashCode(str) {
  let hash = 0;
  if (str.length === 0) return '0';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // 转换为32位整数
  }
  return hash.toString(16);
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
 * 通用内容加载函数
 * @async
 * @param {Object} options - 配置选项
 * @param {string} [options.url] - 内容URL
 * @param {string} [options.targetId] - 目标容器ID
 * @param {string} [options.context] - 上下文名称（用于日志/错误提示）
 */
async function loadContent({
  url = '',
  targetId = '',
  context = '内容'
}) {
  const loadingDialog = showLoading();

  try {
    loadingDialog.open();
    const htmlDoc = await fetchContent(url);
    const targetContainer = document.getElementById(targetId);

    if (!targetContainer) {
      throw new Error(`${context}：加载：目标容器不存在 - ${targetId}`);
    }

    // 插入内容
    const contentElement = htmlDoc.querySelector('[content]');
    if (contentElement) {
      targetContainer.innerHTML = contentElement.innerHTML;
    }

    // 执行setup脚本
    const setupScript = htmlDoc.querySelector('[setup]');
    if (setupScript?.textContent.trim()) {
      const script = document.createElement('script');
      script.text = setupScript.textContent;
      targetContainer.appendChild(script);
    }

    console.log(`${context}：加载：完成`);
    mdui.mutation?.();
  } catch (error) {
    console.error(`${context}：加载：`, error);
    mdui.dialog({
      title: `${context}：加载：错误：`,
      content: error.message,
      buttons: [{ text: '关闭' }],
      history: false
    });
  } finally {
    loadingDialog.close();
  }
}

/**
 * 加载直链
 */
async function loadDownLinks() {
  await loadContent({
    url: '/file/data/downLinks.html',
    targetId: 'tab2',
    context: '直链'
  });
}

/**
 * 加载赞表
 */
async function loadSupportList() {
  await loadContent({
    url: '/file/data/supportList.html',
    targetId: 'supportList',
    context: '赞表'
  });
}

/**
 * 加载校验
 */
async function loadChecksums() {
  console.log('校验：是否不加载：' + checksumsLoaded);
  if (checksumsLoaded) {
    return;
  } else {
    await loadContent({
      url: '/file/data/checksums.html',
      targetId: 'tab3',
      context: '校验'
    });
    checksumsLoaded = true;
  }
}

/**
 * 加载关于
 */
async function loadAbout() {
  console.log('关于：是否不加载：' + aboutLoaded);
  if (aboutLoaded) {
    return;
  } else {
    await loadContent({
      url: '/file/data/about.html',
      targetId: 'tab5',
      context: '关于'
    });
    aboutLoaded = true;
  }
}

/**
 * 加载下载线路
 * @async
 * @param {string} url - 文件树JSON的URL
 * @param {string} containerId - 容器元素的ID
 * @param {string} lineName - 线路名称（用于日志标识）
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay(url, containerId, lineName) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`${lineName}：找不到容器：${containerId}`);
    return;
  }

  try {
    console.log(`${lineName}：${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const fileTree = await response.json();
    container.innerHTML = '';

    const panel = document.createElement('div');
    panel.className = 'mdui-panel';
    panel.setAttribute('mdui-panel', '');

    const versionDirs = fileTree.children.filter(
      child => child.type === 'directory' && child.name !== 'root'
    );

    console.log(`${lineName}：找到版本数：${versionDirs.length}`);
    versionDirs.forEach(versionDir => {
      panel.appendChild(createPanelItem(versionDir));
    });

    container.appendChild(panel);
    new mdui.Panel(panel);
    console.log(`${lineName}：完成`);
  } catch (error) {
    console.error(`${lineName}：错误：`, error);
    container.innerHTML = `<div class="mdui-typo">${lineName}错误：${error.message}</div>`;
  }
}

/**
 * 创建单个版本的面板项
 * @param {Object} versionDir - 版本目录对象
 * @returns {HTMLElement} 创建好的面板项元素
 */
function createPanelItem(versionDir) {
  const version = versionDir.name;
  const archMap = createArchLinkMap(versionDir);
  const allArchs = Object.keys(archMap);

  const panelItem = document.createElement('div');
  panelItem.className = 'mdui-panel-item';

  const header = document.createElement('div');
  header.className = 'mdui-panel-item-header mdui-ripple';
  header.innerHTML = `
        <div>${version}</div>
        <i class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>
    `;

  const body = document.createElement('div');
  body.className = 'mdui-panel-item-body';

  // 单架构不显示提示语
  if (allArchs.length === 1) {
    const arch = allArchs[0];
    const btn = createArchButton(arch, archMap[arch]);
    body.appendChild(btn);
  }
  else if (allArchs.length > 1) {
    body.innerHTML = `<p class="mdui-typo">您的系统架构是？</p>`;

    // 优先创建"我不知道"按钮（后续将"all"显示为"我不知道"）
    if (allArchs.includes('all')) {
      const btn = createArchButton('all', archMap.all);
      body.appendChild(btn);
    }

    // 创建其他架构按钮（排除all）
    allArchs
      .filter(arch => arch !== 'all')
      .forEach(arch => {
        const btn = createArchButton(arch, archMap[arch]);
        body.appendChild(btn);
      });
  }
  else {
    body.innerHTML = `<p class="mdui-typo">此版本无可用下载文件</p>`;
  }

  panelItem.appendChild(header);
  panelItem.appendChild(body);
  return panelItem;
}

/**
 * 创建架构链接映射
 * @param {Object} versionDir - 版本目录对象
 * @returns {Object} 架构到下载链接的映射
 */
function createArchLinkMap(versionDir) {
  const map = {};
  versionDir.children
    .filter(child => child.type === 'file' && child.arch)
    .forEach(file => {
      map[file.arch] = file.download_link;
    });
  return map;
}

/**
 * 创建架构下载按钮
 * @param {string} arch - 架构名称
 * @param {string} link - 下载链接
 * @returns {HTMLAnchorElement} 按钮元素
 */
function createArchButton(arch, link) {
  const btn = document.createElement('a');
  btn.className = 'mdui-btn mdui-btn-raised mdui-btn-block mdui-ripple';

  btn.textContent = arch === 'all' ? '我不知道' : arch;
  btn.href = link || 'javascript:void(0);';

  if (!link) {
    btn.classList.add('mdui-btn-disabled');
    btn.title = '未提供此架构版本';
  }
  return btn;
}

/**
 * 加载所有下载线路
 */
async function loadAllFclDownWays() {
  await Promise.all([
    loadFclDownWay1(),
    loadFclDownWay2(),
    loadFclDownWay3(),
    loadZlDownWay1(),
    loadZlDownWay2()
  ]);
}

/**
 * 加载FCL下载线路1
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay1() {
  if (fclDownWay1Laoded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/fclDownWay1.json',
    'fclDownWay1',
    '加载FCL线1'
  );
  fclDownWay1Laoded = true;
}

/**
 * 加载FCL下载线路2
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay2() {
  if (fclDownWay2Laoded) {
    return;
  }
  await loadFclDownWay(
    'https://frostlynx.work/external/fcl/file_tree.json',
    'fclDownWay2',
    '加载FCL线2'
  );
  fclDownWay2Laoded = true;
}

/**
 * 加载FCL下载线路3
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay3() {
  if (fclDownWay3Laoded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/fclDownWay3.json',
    'fclDownWay3',
    '加载FCL线3'
  );
  fclDownWay3Laoded = true;
}

/**
 * 加载ZL下载线路1
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadZlDownWay1() {
  if (zlDownWay1Laoded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/zlDownWay1.json',
    'zlDownWay1',
    '加载ZL线1'
  );
  zlDownWay1Laoded = true;
}

/**
 * 加载ZL下载线路2
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadZlDownWay2() {
  if (zlDownWay2Laoded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/zlDownWay2.json',
    'zlDownWay2',
    '加载ZL线2'
  );
  zlDownWay2Laoded = true;
}

/**
 * 获取当前时间与建站时间的时间差（精确到天）
 * @returns {string} 格式化后的时间差字符串（非零单位：天、小时、分钟、秒）
 */
function getRunTime() {
  const startDate = new Date(2025, 2, 19, 2, 19, 45); // 建站时间（月份0-based）
  const now = Date.now();

  if (now < startDate) return "0秒";

  const UNITS = [
    { value: 24 * 60 * 60 * 1000, label: "天" },
    { value: 60 * 60 * 1000, label: "时" },
    { value: 60 * 1000, label: "分" },
    { value: 1000, label: "秒" }
  ];

  let diff = now - startDate;
  const parts = [];

  for (const unit of UNITS) {
    const count = Math.floor(diff / unit.value);
    if (count > 0) {
      parts.push(`${count}${unit.label}`);
      diff %= unit.value;
    }
  }

  return parts.length > 0 ? parts.join('') : "0秒";
}

/**
 * 更新建站时间信息
 */
function loadRunTime() {
  const timeString = getRunTime();
  const displayElement = document.getElementById('runTime');

  if (displayElement) {
    displayElement.textContent = timeString;
  }
}

/**
 * 获取并填充FCL下载线路2的最新版本的两个架构的链接到首页的开门见山中
 */
async function setupIndexDownLinks() {
  try {
    const response = await fetch('https://frostlynx.work/external/fcl/file_tree.json');
    if (!response.ok) throw new Error(`HTTP错误：${response.status}`);
    const fileTree = await response.json();

    if (!fileTree.latest || !fileTree.children || !Array.isArray(fileTree.children)) {
      throw new Error('未找到最新版本目录');
    }

    const latestVersionDir = fileTree.children.find(
      dir => dir.type === 'directory' && dir.name === fileTree.latest
    ) || null;
    if (!latestVersionDir) throw new Error('未找到最新版本目录');

    const findLink = (dir, arch) => {
      if (!dir.children || !Array.isArray(dir.children)) return null;
      const file = dir.children.find(child =>
        child.type === 'file' && child.arch === arch
      );
      return file ? file.download_link : null;
    };

    const setLink = (id, arch) => {
      const link = findLink(latestVersionDir, arch);
      const element = document.getElementById(id);
      if (link && element) element.href = link;
    };

    setLink('fclDownWay2AllLink', 'all');
    setLink('fclDownWay2v8aLink', 'arm64-v8a');

    document.getElementById('latestInfo').textContent = fileTree.latest;

  } catch (error) {
    console.error('首页链接：获取错误：', error);
    mdui.dialog({
      title: `首页链接：获取错误：`,
      content: error,
      buttons: [{ text: '关闭' }],
      history: false
    });
  }
}

/**
 * 获取并填充FCL下载线路2的流量使用信息
 */
async function loadFclDownWay2Info() {
  try {
    const response = await fetch('https://frostlynx.work/api/fcl-traffic/data');

    if (!response.ok) {
      throw new Error(`HTTP错误：${response.status}`);
    }

    const data = await response.json();

    const targetElement = document.getElementById('fclDownWay2Info');

    if (targetElement) {
      targetElement.textContent = data.traffic_gib + 'GiB';
    } else {
      console.error('流量信息：未找到显示元素');
    }
  } catch (error) {
    console.error('流量信息：', error);
    const targetElement = document.getElementById('fclDownWay2Info');
    if (targetElement) {
      targetElement.textContent = error;
    }
  }
}

/**
 * 架构检测：设备信息检测工具函数
 * @param {string} containerId - 要填充结果的容器元素ID
 */
async function showDeviceInfo(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('架构检测：找不到容器：' + containerId);
    return;
  }

  if (!navigator.userAgent) {
    container.innerHTML = "抱歉，我们无法检测您的设备信息。";
    return;
  }

  try {
    const browserHelper = (await import('/js/lib/browser-helper.min.js')).default;
    const info = await browserHelper.getInfo();

    const archRules = {
      regexes: [
        /aarch64|arm64|armv8/i,
        /armeabi-v7a|(arm$)|armv7/i,
        /armeabi$/i,
        /x86_64|x64|amd64/i,
        /x86|i[36]86/i,
        /win32/i
      ],
      names: [
        'arm64-v8a',
        'armeabi-v7a',
        'armeabi',
        'x86_64',
        'x86',
        `${info.architecture}_${info.bitness}`
      ]
    };

    const parseArch = (arch) => {
      for (let i = 0; i < archRules.regexes.length; i++) {
        if (archRules.regexes[i].test(arch)) {
          return `${archRules.names[i]}(${arch})`;
        }
      }
      return `${info.architecture}(${arch})`;
    };

    console.log('架构检测：', info);
    // 妈的，它就不能把object的内容转为字符吗？直接摆烂输出[object Object]是故意的还是不小心的？

    const archDisplay = parseArch(info.platform) || `${info.architecture}(${info.platform})`;
    const displayText = `浏览器报告您的系统信息为<code>${info.system} ${info.systemVersion}</code>，架构为<code>${archDisplay}</code>，仅供参考，不一定准。`;

    container.innerHTML = displayText;

  } catch (error) {
    console.error('架构检测：错误：', error);
    container.innerHTML = "架构检测：错误：" + error;
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

/**
 * 更新状态文本
 */
function updateStatus(statusText) {
  console.log('状态：' + statusText);
  const container = document.getElementById('status');
  const statusTextElement = document.getElementById('statusDebug');
  if (container) {
    container.innerHTML = statusText;
  }
  if (statusTextElement) {
    statusTextElement.innerHTML = statusTextElement.innerHTML + '<br>' + statusText;
  }
}

// 那些盗用老子下载链接的人，我艹你们全家！老子拿自己的钱买的直链流量，以公益的性质搭建了这个下载站，就被你们这些缺德的没良心的傻逼给霍霍了！你们就不会考虑他人的感受吗？屎吃多了是吧？哈呀木！

(function (_0x50d9a8, _0x5ed954) {
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
  return _0x17b3 = function (_0x68519b, _0x5100be) {
    _0x68519b = _0x68519b - (-0x25 * -0x9 + -0x3 * -0xcc + 0x7c * -0x5);
    let _0x41452e = _0x525f16[_0x68519b];
    return _0x41452e;
  }, _0x17b3(_0x314702, _0x26c0c1);
}

// 我个蠢狐狸，混淆前还提交一遍。。。

// 原始未混淆的代码位于：洛狐的V1809A/storage/emulated/0/XiaoluoFoxington/文档/网站/generateAuthUrl.js