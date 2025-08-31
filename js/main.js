/**
 * 应用主入口文件
 * 负责导入和初始化所有模块
 */

// 导入核心模块
import {
  initApp,
  nextFrame,
  showEpilepsyWarning,
  sysInfo,
  sysArch,
  androidVer,
  loadFlags,
  moduleLoadTimes,
  recordModuleLoadTime,
  displayModuleLoadTimes
} from './modules/core/app.js';

// 导入UI模块
import {
  removeLoadTip,
  showLoading,
  runDoNotClickEvent,
  runSelectDNCEvent,
  handleHashRouting,
  initEruda,
  openNotice,
  hashCode,
  openEgg,
  openBlockedIps,
  toggleTheme,
  loadTheme
} from './modules/ui/ui.js';

// 导入下载模块
import {
  loadContent,
  loadOdlm,
  loadIntroFcl,
  loadDownLinks,
  loadChecksums,
  loadAbout,
  loadSponsorList
} from './modules/downloads/downloads.js';

// 导入下载线路模块
import {
  loadFclDownWay1,
  loadFclDownWay2,
  loadFclDownWay3,
  loadFclDownWay4,
  loadFclDownWay5,
  loadFclDownWay6,
  loadFclDownWay7,
  loadFclDownWay8,
  loadZlDownWay1,
  loadZlDownWay3,
  loadZlDownWay7,
  loadZl2DownWay1,
  loadZl2DownWay2,
  loadZl2DownWay3,
  loadZl2DownWay7,
  loadPlDownWay7,
  loadPliosDownWay7,
  loadHmclpeDownWay7,
  loadMcinaboxDownWay7
} from './modules/downloads/downloadWays.js';

// 导入集成模块
import {
  loadRenderDownWay1,
  loadRenderDownWay3,
  loadRenderDownWay7,
  loadDriverDownWay1,
  loadDriverDownWay7,
  loadDriverDownWay8,
  loadJreDownWay7
} from './modules/integrations/integrations.js';

// 导入工具模块
import {
  fetchContent,
  updateContainer,
  getRunTime,
  loadRunTime,
  setCoolDown,
  updateStatus
} from './modules/utils/utils.js';

// 导入设备信息模块
import {
  showDeviceInfo,
  testAndroidVersion,
  setupIndexDownLinks,
  loadFclDownWay2Info
} from './modules/utils/device.js';

// 导入内容展框机制模块
import {
  createPlaceholder,
  lazyLoadContent,
  loadWhenVisible,
  batchLazyLoad
} from './modules/utils/lazyLoader.js';

// 将变量和函数绑定到全局作用域，以保持与原代码的兼容性
window.showEpilepsyWarning = showEpilepsyWarning;
window.sysInfo = sysInfo;
window.sysArch = sysArch;
window.androidVer = androidVer;

// 加载状态标记
window.fclDownWay1Loaded = loadFlags.fclDownWay1Loaded;
window.fclDownWay2Loaded = loadFlags.fclDownWay2Loaded;
window.fclDownWay3Loaded = loadFlags.fclDownWay3Loaded;
window.fclDownWay4Loaded = loadFlags.fclDownWay4Loaded;
window.fclDownWay5Loaded = loadFlags.fclDownWay5Loaded;
window.fclDownWay6Loaded = loadFlags.fclDownWay6Loaded;
window.fclDownWay7Loaded = loadFlags.fclDownWay7Loaded;
window.fclDownWay8Loaded = loadFlags.fclDownWay8Loaded;
window.zlDownWay1Loaded = loadFlags.zlDownWay1Loaded;
window.ZlDownWay3Loaded = loadFlags.ZlDownWay3Loaded;
window.zlDownWay7Loaded = loadFlags.zlDownWay7Loaded;
window.zl2DownWay1Loaded = loadFlags.zl2DownWay1Loaded;
window.zl2DownWay2Loaded = loadFlags.zl2DownWay2Loaded;
window.zl2DownWay3Loaded = loadFlags.zl2DownWay3Loaded;
window.zl2DownWay7Loaded = loadFlags.zl2DownWay7Loaded;
window.plDownWay7Loaded = loadFlags.plDownWay7Loaded;
window.pliosDownWay7Loaded = loadFlags.pliosDownWay7Loaded;
window.hmclpeDownWay7Loaded = loadFlags.hmclpeDownWay7Loaded;
window.mcinaboxDownWay7Loaded = loadFlags.mcinaboxDownWay7Loaded;
window.renderDownWay1Loaded = loadFlags.renderDownWay1Loaded;
window.renderDownWay3Loeded = loadFlags.renderDownWay3Loeded;
window.renderDownWay7Loaded = loadFlags.renderDownWay7Loaded;
window.mgRenderDownWay7Loaded = loadFlags.mgRenderDownWay7Loaded;
window.driverDownWay1Loaded = loadFlags.driverDownWay1Loaded;
window.driverDownWay7Loaded = loadFlags.driverDownWay7Loaded;
window.driverDownWay8Loaded = loadFlags.driverDownWay8Loaded;
window.jreDownWay7Loaded = loadFlags.jreDownWay7Loaded;
window.downLinksLoaded = loadFlags.downLinksLoaded;
window.checksumsLoaded = loadFlags.checksumsLoaded;
window.aboutLoaded = loadFlags.aboutLoaded;

// 绑定函数到全局作用域
window.initApp = initApp;
window.nextFrame = nextFrame;
window.removeLoadTip = removeLoadTip;
window.showLoading = showLoading;
window.runDoNotClickEvent = runDoNotClickEvent;
window.runSelectDNCEvent = runSelectDNCEvent;
window.handleHashRouting = handleHashRouting;
window.initEruda = initEruda;
window.openNotice = openNotice;
window.hashCode = hashCode;
window.openEgg = openEgg;
window.openBlockedIps = openBlockedIps;
window.toggleTheme = toggleTheme;
window.loadTheme = loadTheme;
window.loadContent = loadContent;
window.loadOdlm = loadOdlm;
window.loadIntroFcl = loadIntroFcl;
window.loadDownLinks = loadDownLinks;
window.loadChecksums = loadChecksums;
window.loadAbout = loadAbout;
window.loadSponsorList = loadSponsorList;
window.loadFclDownWay1 = loadFclDownWay1;
window.loadFclDownWay2 = loadFclDownWay2;
window.loadFclDownWay3 = loadFclDownWay3;
window.loadFclDownWay4 = loadFclDownWay4;
window.loadFclDownWay5 = loadFclDownWay5;
window.loadFclDownWay6 = loadFclDownWay6;
window.loadFclDownWay7 = loadFclDownWay7;
window.loadFclDownWay8 = loadFclDownWay8;
window.loadZlDownWay1 = loadZlDownWay1;
window.loadZlDownWay3 = loadZlDownWay3;
window.loadZlDownWay7 = loadZlDownWay7;
window.loadZl2DownWay1 = loadZl2DownWay1;
window.loadZl2DownWay2 = loadZl2DownWay2;
window.loadZl2DownWay3 = loadZl2DownWay3;
window.loadZl2DownWay7 = loadZl2DownWay7;
window.loadPlDownWay7 = loadPlDownWay7;
window.loadPliosDownWay7 = loadPliosDownWay7;
window.loadHmclpeDownWay7 = loadHmclpeDownWay7;
window.loadMcinaboxDownWay7 = loadMcinaboxDownWay7;
window.loadRenderDownWay1 = loadRenderDownWay1;
window.loadRenderDownWay3 = loadRenderDownWay3;
window.loadRenderDownWay7 = loadRenderDownWay7;
window.loadDriverDownWay1 = loadDriverDownWay1;
window.loadDriverDownWay7 = loadDriverDownWay7;
window.loadDriverDownWay8 = loadDriverDownWay8;
window.loadJreDownWay7 = loadJreDownWay7;
window.fetchContent = fetchContent;
window.updateContainer = updateContainer;
window.getRunTime = getRunTime;
window.loadRunTime = loadRunTime;
window.setCoolDown = setCoolDown;
window.updateStatus = updateStatus;
window.showDeviceInfo = showDeviceInfo;
window.testAndroidVersion = testAndroidVersion;
window.setupIndexDownLinks = setupIndexDownLinks;
window.loadFclDownWay2Info = loadFclDownWay2Info;

// 内容展框机制函数
window.createPlaceholder = createPlaceholder;
window.lazyLoadContent = lazyLoadContent;
window.loadWhenVisible = loadWhenVisible;
window.batchLazyLoad = batchLazyLoad;

// 初始化应用
window.addEventListener('DOMContentLoaded', function () {
  'use strict';
  console.log('DOMContentLoaded：完成');
});

window.onload = async function () {
  await initApp();
  console.log('window.onload：完成');
}

document.getElementById('odlmSelect').addEventListener('change', function () {
  console.log('开门见山：选择器：' + this.value);
  setupIndexDownLinks(this.value);
});