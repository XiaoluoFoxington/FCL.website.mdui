/**
 * 设备信息检测模块
 */

import { sysInfo, sysArch, androidVer } from '../core/app.js';

// 数据源映射表（从downloadWays.js导入）
import { SOURCE_MAP } from '../downloads/downloadWays.js';

/** 架构匹配规则 */
const ARCH_RULES = [
  { regex: /aarch64|arm64|armv8/i, name: 'arm64-v8a' },
  { regex: /armeabi-v7a|(arm$)|armv7/i, name: 'armeabi-v7a' },
  { regex: /armeabi$/i, name: 'armeabi' },
  { regex: /x86_64|x64|amd64/i, name: 'x86_64' },
  { regex: /x86|i[36]86/i, name: 'x86' }
];
// windows 系统不要根据平台来判断架构!!!
// windows 系统不管是 64 位还是 32 位始终为 win32 平台
// 再乱改我就炸了!!!
//                                            晚梦

/**
 * 架构检测：设备信息检测工具函数
 * @param {string} containerId - 要填充结果的容器元素ID
 */
async function showDeviceInfo(containerId) {
  let container = null;
  if (containerId) {
    container = document.getElementById(containerId);
    if (!container) {
      console.warn('架构检测：出错：没有容器：' + containerId);
      return;
    }
  }

  const updateContainer = content => {
    if (container) container.innerHTML = content;
  };

  if (!navigator.userAgent) {
    const msg = "架构检测：无法检测到您的设备信息";
    updateContainer(msg);
    console.warn(msg);
    return;
  }

  try {
    // 延迟导入browser-helper以提高初始加载性能
    const browserHelperModule = await import('/js/lib/browser-helper.min.js');
    const { default: browserHelper } = browserHelperModule;
    
    /** @type {BrowserInfo} */
    const info = await browserHelper.getInfo();

    const matchedRule = ARCH_RULES.find(r => r.regex.test(info.platform));
    const archName = matchedRule ? matchedRule.name : `${info.architecture}${info?.bitness >> 6 && '_64' || ''}`;
    // 64 >> 6 === 1
    const archDisplay = matchedRule ?
      `${matchedRule.name}(${info.platform})` :
      `${archName}(${info.platform})`;

    // 注意：这里我们需要修改全局变量
    if (info.system && /android/i.test(info.system)) {
      window.androidVer = info.systemVersion || '';
    } else {
      window.androidVer = 0;
    }

    console.log(`架构检测：androidVer：${window.androidVer}`);

    window.sysArch = archName;

    console.log(`架构检测：sysArch：${window.sysArch}`);

    // 对特别系统单独做适配
    let output = '';
    if (info.system.toString().includes("Windows")) {
      // Windows Phone也是Windows

      // 延迟加载Microsoft Store徽章脚本以提高性能
      setTimeout(() => {
        if (!document.querySelector('script[src="https://get.microsoft.com/badge/ms-store-badge.bundled.js"]')) {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = 'https://get.microsoft.com/badge/ms-store-badge.bundled.js';
          document.head.appendChild(script);
        }
      }, 0);

      if (info.systemVersion < 10) {
        // windows10之前系统特殊处理
        output = `<p>您的系统为<code>${info.system} ${info.systemVersion}</code>，架构为<code>${archDisplay}</code>，仅供参考，不一定准。</p>
      可以前往
      <ms-store-badge
        productid="9NXP44L49SHJ"
        window-mode="full"
        theme="auto"
        size="middle"
        language="zh-cn"
        animation="on">
      </ms-store-badge>
      购买正版Minecraft Java版，通过各种启动器启动Minecraft Java版`;
      }
      else {
        output = `您的系统为<code>${info.system} ${info.systemVersion}</code>，架构为<code>${archDisplay}</code>，仅供参考，不一定准。
      <br/>可以前往
      <ms-store-badge
        productid="9NXP44L49SHJ"
        window-mode="full"
        theme="auto"
        size="middle"
        language="zh-cn"
        animation="on">
      </ms-store-badge>
      购买和下载正版Minecraft`;
      }
    }
    else if (info.system.toString() == "iOS"|| info.system.toString() == "macOS") {
      output = `<p>您的系统为<code>${info.system} ${info.systemVersion}</code>，架构为<code>${archDisplay}</code>，仅供参考，不一定准。</p>
      <br/>获取国际版Minecraft：
    <a href="https://apps.apple.com/us/app/minecraft-dream-it-build-it/id479516143?itscg=30200&itsct=apps_box_badge&mttnsubad=479516143" style="display: inline-block;">
    <img src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/zh-cn?releaseDate=1321488000" alt="Download on the App Store" style="width: 246px; height: 82px; vertical-align: middle; object-fit: contain;" />
    </a>
      <br/>
      要在iOS上运行Minecraft Java版，
      可以前往<a href="https://pojavlauncher.app/wiki/getting_started/INSTALL.html#ios">此处</a>
      获取更多关于安装PojavLauncher的说明`;
    } else if (navigator.userAgent.includes("OpenHarmony") || typeof window.harmony !== 'undefined') {
      output = `<p>您的系统为<code>${info.system} ${info.systemVersion}</code>，架构为<code>${archDisplay}</code>，仅供参考，不一定准。</p>
      <br/>HarmonyOS NEXT手机需要在"卓易通"中安装，性能有较大损耗
      <br/>鸿蒙电脑暂时无好用的适配方案，可以尝试在虚拟机中打开此页面下载Windows版`;
    } else {
      output = `您的系统为<code>${info.system} ${info.systemVersion}</code>，架构为<code>${archDisplay}</code>，仅供参考，不一定准。`;
    }

    window.sysInfo = output;

    updateContainer(output);

  } catch (error) {
    const errorMsg = `架构检测：出错：${error.message || error}`;
    console.error(errorMsg);
    updateContainer(errorMsg);
  }
}

/**
 * 安卓版本检测：检测当前安卓版本是否大于等于给定的安卓版本
 * @param {number} version - 要比较的安卓版本号（支持小数）
 * @param {string} lineName - 附加信息
 * @returns {boolean} 是否通过检测
 */
function testAndroidVersion(version, lineName) {
  if (typeof version !== 'number' || isNaN(version)) {
    console.error('安卓版本检测：无效版本参数', version);
    return false;
  }

  const reqVersion = parseFloat(version);
  const currentVersion = parseFloat(window.androidVer);

  if (currentVersion === 0) {
    console.log('安卓版本检测：非安卓');
    mdui.dialog({
      title: '安卓版本检测：非安卓',
      content: `您不是Android系统，而${lineName}最低要求 Android ${reqVersion} 。（仅供参考，不一定准）`,
      buttons: [{ text: '关闭' }],
      history: false
    });
    return false;
  }

  if (currentVersion < reqVersion) {
    console.log(`安卓版本检测：版本过低`);
    mdui.dialog({
      title: '安卓版本检测：版本过低',
      content: `您的Android版本为 ${currentVersion} ，而${lineName}最低要求 Android ${reqVersion} 。（仅供参考，不一定准）`,
      buttons: [{ text: '关闭' }],
      history: false
    });
    return false;
  }

  console.log(`安卓版本检测：通过`);
  return true;
}

/**
 * 获取并填充下载线路的最新版本到首页开门见山
 * @param {string} sourceKey - 数据源标识
 */
async function setupIndexDownLinks(sourceKey) {
  console.log(`开门见山：加载：${sourceKey}`);

  try {
    // 并行加载odlm页面和获取数据
    const odlmPromise = loadOdlm();
    
    // 提前获取源配置
    const sourceConfig = SOURCE_MAP[sourceKey];
    if (!sourceConfig) throw new Error(`无效数据源标识："${sourceKey}"`);

    const jsonUrl = sourceConfig.path;
    console.log(`开门见山：JSON：${jsonUrl}`);

    // 并行执行网络请求
    const [_, jsonData] = await Promise.all([
      odlmPromise,
      fetch(jsonUrl).then(response => {
        if (!response.ok) throw new Error(`HTTP出错：${response.status}`);
        return response.json();
      })
    ]);

    const antiSpamEl = document.getElementById('fu');
    if (sourceKey !== "F2" && antiSpamEl) {
      console.log('开门见山：隐藏防刷提示');
      antiSpamEl.remove();
    }

    const { latest, children } = jsonData;

    if (!latest || !Array.isArray(children)) {
      throw new Error('无效的文件树结构');
    }

    let latestVersionDir = findNestedDirectory(children, latest, sourceConfig.nestedPath);
    if (!latestVersionDir) throw new Error(`未找到最新版本目录: ${latest}`);

    console.log(`开门见山：最新版本：${latestVersionDir.name}`);

    const archLinks = latestVersionDir.children?.reduce((map, child) => {
      if (child.type === 'file' && child.arch) {
        map[child.arch] = child.download_link;
      }
      return map;
    }, {}) || {};

    const setLink = (id, arch) => {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`找不到元素: ${id}`);
        return;
      }

      const link = archLinks[arch];
      if (link) {
        element.textContent = arch;
        element.href = link;
      } else {
        console.warn(`无效架构: ${arch}`);
        element.textContent = '无效架构';
        element.onclick = () => {
          mdui.dialog({
            title: '开门见山：无效架构',
            content: `您的系统架构为${arch}（仅供参考，不一定准），而此源未提供此架构。`,
            buttons: [{ text: '确定' }],
            history: false,
            onOpen: () => mdui.mutation()
          });
          return false;
        };
        element.href = 'javascript:void(0)';
      }
    };

    setLink('odlmAllLink', 'all');
    console.log(`开门见山：系统架构：${window.sysArch}`);
    setLink('odlmv8aLink', window.sysArch);

    const latestInfoEl = document.getElementById('latestInfo');
    if (latestInfoEl) {
      latestInfoEl.textContent = sourceConfig.markLatest ?
        `${latest}（此源最新）` :
        latest;
    }

    const diEl = document.getElementById('deviceInfo');
    if (diEl) diEl.innerHTML = window.sysInfo;

    testAndroidVersion(8, 'FCL');

    console.log('开门见山：setCoolDown()!!!');
    setCoolDown();
  } catch (error) {
    console.error(`开门见山：出错：${error.message}`, error);

    const errorHtml = `
    <div class="mdui-typo">
      <p>抱歉，我们遇到了一个无法解决的问题。</p>
      <p>${error.message}</p>
      <p>点击"转到'下载'TAB"将会跳转到"下载"选项卡，您可以在这里使用其它路线继续下载。</p>
    </div>
    <br>
    <div class="mdui-row-xs-2">
      <div class="mdui-col">
        <a class="mdui-btn mdui-btn-raised mdui-btn-block mdui-ripple" href="#tab=1">转到"下载"TAB</a>
      </div>
      <div class="mdui-col">
        <a class="mdui-btn mdui-btn-raised mdui-btn-block mdui-ripple" href="https://wj.qq.com/s2/22395480/df5b/">向站长反馈</a>
      </div>
    </div>
    <br>
    <div class="mdui-typo">
      <p>下载站运营困难，不妨<a href="#tab=3">赞助此下载站</a>吧awa（不赞助也能下！）</p>
      <p>启动器的开发者也不容易，<a href="https://afdian.com/@tungs" target="_blank">赞助FCL开发者</a>。</p>
      <p>注意：<mark>赞助是纯自愿的，请结合您的经济状况实力再考虑是否要赞助！赞助后无法退款！</mark></p>
    </div>
    `;

    const odlm = document.getElementById('odlm');
    if (odlm) {
      odlm.innerHTML = errorHtml;
      mdui.mutation();
    }

    mdui.dialog({
      title: '开门见山：出错',
      content: error.message,
      buttons: [{ text: '关闭' }],
      history: false
    });
  }
}

/**
 * 递归查找嵌套目录（支持多级嵌套）
 * @param {Array} children - 目录子项数组
 * @param {string} targetName - 目标目录名
 * @param {Array} [nestedPath] - 嵌套路径数组
 */
function findNestedDirectory(children, targetName, nestedPath = []) {
  let currentChildren = children;
  if (nestedPath) {
    for (const dirName of nestedPath) {
      const dir = currentChildren.find(
        d => d.name === dirName && d.type === 'directory'
      );
      if (!dir || !dir.children) return null;
      currentChildren = dir.children;
    }
  }

  return currentChildren.find(
    dir => dir.type === 'directory' && dir.name === targetName
  );
}

/**
 * 获取并填充FCL下载线路2的流量使用信息
 */
async function loadFclDownWay2Info() {
  try {
    const response = await fetch('https://frostlynx.work/external/fcl/file_tree.json');

    if (!response.ok) {
      throw new Error(`HTTP出错：${response.status}`);
    }

    const data = await response.json();

    const targetElement = document.getElementById('fclDownWay2Info');

    if (targetElement) {
      targetElement.textContent = data.traffic + 'GiB';
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

// 导出模块内容
export {
  ARCH_RULES,
  showDeviceInfo,
  testAndroidVersion,
  setupIndexDownLinks,
  findNestedDirectory,
  loadFclDownWay2Info
};