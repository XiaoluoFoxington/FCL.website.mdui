/**
 * 核心应用初始化模块
 */

// 全局状态变量
let showEpilepsyWarning = true;
let sysInfo = undefined;
let sysArch = undefined;
let androidVer = 0;

// 加载状态标记
const loadFlags = {
  fclDownWay1Loaded: false,
  fclDownWay2Loaded: false,
  fclDownWay3Loaded: false,
  fclDownWay4Loaded: false,
  fclDownWay5Loaded: false,
  fclDownWay6Loaded: false,
  fclDownWay7Loaded: false,
  fclDownWay8Loaded: false,
  zlDownWay1Loaded: false,
  ZlDownWay3Loaded: false,
  zlDownWay7Loaded: false,
  zl2DownWay1Loaded: false,
  zl2DownWay2Loaded: false,
  zl2DownWay3Loaded: false,
  zl2DownWay7Loaded: false,
  plDownWay7Loaded: false,
  pliosDownWay7Loaded: false,
  hmclpeDownWay7Loaded: false,
  mcinaboxDownWay7Loaded: false,
  renderDownWay1Loaded: false,
  renderDownWay3Loeded: false,
  renderDownWay7Loaded: false,
  mgRenderDownWay7Loaded: false,
  driverDownWay1Loaded: false,
  driverDownWay7Loaded: false,
  driverDownWay8Loaded: false,
  jreDownWay7Loaded: false,
  downLinksLoaded: false,
  checksumsLoaded: false,
  aboutLoaded: false
};

// 模块加载时间记录
const moduleLoadTimes = {};

/**
 * 记录模块加载时间
 * @param {string} moduleName - 模块名称
 * @param {number} startTime - 开始时间
 */
function recordModuleLoadTime(moduleName, startTime) {
  const endTime = performance.now();
  const loadTime = Math.round(endTime - startTime);
  moduleLoadTimes[moduleName] = loadTime;
  console.log(`模块 ${moduleName} 加载用时: ${loadTime}ms`);
}

/**
 * 初始化应用
 */
async function initApp() {
  // 记录加载开始时间
  const startTime = performance.now();
  
  // 使用IIFE和async/await重构回调地狱
  try {
    // 并行初始化可以并行的模块
    const parallelInitPromises = [];
    
    // 初始化Eruda
    const erudaStart = performance.now();
    await nextFrame('初始化Eruda…', 6);
    initEruda();
    recordModuleLoadTime('Eruda初始化', erudaStart);

    // 获取系统主题色偏好
    const themePrefStart = performance.now();
    await nextFrame('获取系统主题色偏好...', 12);
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches ? 'dark' : 'light');
    }
    recordModuleLoadTime('主题偏好获取', themePrefStart);

    // 加载主题
    const themeLoadStart = performance.now();
    await nextFrame('加载主题…', 18);
    loadTheme();
    recordModuleLoadTime('主题加载', themeLoadStart);

    // 初始化地址栏参数解析
    const hashRoutingStart = performance.now();
    await nextFrame('初始化地址栏参数解析…', 24);
    handleHashRouting();
    recordModuleLoadTime('地址栏参数解析', hashRoutingStart);

    // 添加事件监听
    const eventListenerStart = performance.now();
    await nextFrame('添加事件监听…', 30);
    window.addEventListener('hashchange', handleHashRouting);
    document.getElementById('loadDownLinks').addEventListener('click', loadDownLinks);
    document.getElementById('loadChecksums').addEventListener('click', loadChecksums);
    document.getElementById('loadAbout').addEventListener('click', loadAbout);
    recordModuleLoadTime('事件监听器添加', eventListenerStart);

    // 预加载可以预加载的内容
    const preloadPromises = [
      fetchContent('/file/data/notice.html').catch(() => null),
      fetchContent('/file/data/odlm.html').catch(() => null)
    ];

    // 打开公告
    const noticeStart = performance.now();
    await nextFrame('打开公告…', 36);
    await openNotice();
    recordModuleLoadTime('公告打开', noticeStart);

    // 获取系统信息
    const deviceInfoStart = performance.now();
    await nextFrame('获取系统信息…', 42);
    await showDeviceInfo();
    recordModuleLoadTime('设备信息获取', deviceInfoStart);

    // 获取下载TAB内容
    const downLinksStart = performance.now();
    await nextFrame('获取下载TAB内容...', 48);
    await loadDownLinks();
    recordModuleLoadTime('下载TAB内容获取', downLinksStart);

    // 获取开门见山链接
    const odlmStart = performance.now();
    await nextFrame('获取开门见山链接…', 54);
    const odlm = document.getElementById('odlmSelect');
    if (odlm) {
      await setupIndexDownLinks(odlm.value);
    }
    recordModuleLoadTime('开门见山链接获取', odlmStart);

    // 加载运作时间
    const runTimeStart = performance.now();
    await nextFrame('加载运作时间…', 60);
    await loadRunTime();
    recordModuleLoadTime('运作时间加载', runTimeStart);

    // 加载FCL线路2流量
    const fclTrafficStart = performance.now();
    await nextFrame('加载FCL线路2流量…', 66);
    await loadFclDownWay2Info();
    recordModuleLoadTime('FCL线路2流量加载', fclTrafficStart);

    // 添加定时器
    const timerStart = performance.now();
    await nextFrame('添加定时器…', 72);
    setInterval(loadRunTime, 1000);
    // setInterval(loadFclDownWay2Info, 60000);
    recordModuleLoadTime('定时器添加', timerStart);

    // 添加按钮冷却
    const cooldownStart = performance.now();
    await nextFrame('添加按钮冷却...', 78);
    setCoolDown();
    recordModuleLoadTime('按钮冷却添加', cooldownStart);

    // 等待其它乱七八糟的东西
    await nextFrame('等待其它乱七八糟的东西…', 84);

    // 移除此提示
    const removeTipStart = performance.now();
    await nextFrame('移除此提示…', 90);
    removeLoadTip();
    recordModuleLoadTime('加载提示移除', removeTipStart);
    
    // 计算并显示加载时长
    const endTime = performance.now();
    const loadTime = Math.round(endTime - startTime);
    mdui.snackbar({
      message: `加载完成，用时 ${loadTime}ms`,
      position: 'right-bottom',
      timeout: 3000
    });

    // 更新公告中的加载时间显示
    const loadTimeElement = document.getElementById('loadTimeDisplay');
    if (loadTimeElement) {
      loadTimeElement.textContent = `${loadTime}ms`;
    } else {
      console.log('未找到loadTimeDisplay元素');
    }

    // 显示各模块加载时间
    displayModuleLoadTimes();

  } catch (error) {
    console.error('初始化应用：出错：', error);
    updateStatus('初始化过程中出错', 100);
  }
}

/**
 * 显示各模块加载时间
 */
function displayModuleLoadTimes() {
  const moduleLoadTimesList = document.getElementById('moduleLoadTimesList');
  const moduleLoadTimesContainer = document.getElementById('moduleLoadTimes');
  
  if (moduleLoadTimesList && moduleLoadTimesContainer) {
    // 清空现有内容
    moduleLoadTimesList.innerHTML = '';
    
    // 添加每个模块的加载时间
    for (const [moduleName, loadTime] of Object.entries(moduleLoadTimes)) {
      const li = document.createElement('li');
      li.textContent = `${moduleName}: ${loadTime}ms`;
      moduleLoadTimesList.appendChild(li);
    }
    
    // 显示容器
    moduleLoadTimesContainer.style.display = 'block';
  }
}

/**
 * 封装requestAnimationFrame，返回Promise并更新状态
 * @param {string} statusText - 状态文本
 * @param {number} progressNum - 进度百分比
 * @returns {Promise<void>}
 */
function nextFrame(statusText, progressNum) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      updateStatus(statusText, progressNum);
      resolve();
    });
  });
}

// 导出模块内容
export {
  showEpilepsyWarning,
  sysInfo,
  sysArch,
  androidVer,
  loadFlags,
  moduleLoadTimes,
  initApp,
  nextFrame,
  recordModuleLoadTime,
  displayModuleLoadTimes
};