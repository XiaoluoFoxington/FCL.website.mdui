/**
 * 第三方集成模块
 */

import { loadFlags } from '../core/app.js';
import { Launcher } from './launcher-sdk.js';

// 等待Launcher对象加载完成
async function waitForLauncher() {
  // 轮询检查Launcher是否已定义
  while (!Launcher) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return Launcher;
}

// 从外部加载Launcher SDK
// 浏览器引入 SDK：
// <script src="https://launcher-mirror.zeart.ink/static/launcher-sdk.js"></script>
// 简单调用示例：
// Launcher.getAll().then(console.log);
// Launcher.getByRepo('PojavLauncher').then(console.log);
// Launcher.searchByName('arm64').then(console.log);
// 返回结构示例：
// [
//   {
//     "repo": "PojavLauncher",
//     "tag": "gladiolus",
//     "name": "PojavLauncher.apk",
//     "size": 154187535,
//     "url": "https://pub-0927e5a904734942a47891c9d65b96eb.r2.dev/PojavLauncher/gladiolus/PojavLauncher.apk"
//   }
// ]

/** 
 * 加载线路7
 * @param {string} repoName - 仓库名称
 * @param {string} prefix - DOM元素前缀
 * @param {string} loadedFlag - 全局加载标记
 */
async function loadDownWay7(repoName, prefix, loadedFlag) {
  // 检查是否已加载
  if (loadFlags[loadedFlag]) return;
  console.log(`loadDownWay7：加载${repoName}线7：开始`);

  try {
    // 获取DOM元素引用并检查是否存在
    const spinner = document.getElementById(`${prefix}Spinner`);
    const versionEl = document.getElementById(`${prefix}Version`);
    
    // 检查关键DOM元素是否存在
    if (!spinner || !versionEl) {
      throw new Error(`必要的DOM元素不存在：${prefix}Spinner 或 ${prefix}Version`);
    }

    const archElements = {
      all: document.getElementById(`${prefix}All`),
      v8a: document.getElementById(`${prefix}V8a`),
      v7a: document.getElementById(`${prefix}V7a`),
      x86: document.getElementById(`${prefix}X86`),
      x64: document.getElementById(`${prefix}X64`)
    };

    // 获取制品列表
    const Launcher = await waitForLauncher();
    const artifacts = await Launcher.getByRepo(repoName);
    
    // 检查制品列表是否为空
    if (!artifacts || artifacts.length === 0) {
      throw new Error(`未找到任何制品`);
    }
    
    versionEl.textContent = artifacts[0]?.tag || '未知版本';

    // 架构匹配模式（优先级从高到低）
    const archPatterns = [
      { key: 'v8a', pattern: 'arm64-v8a' },
      { key: 'x64', pattern: 'x86_64' }, // 优先匹配x64
      { key: 'v7a', pattern: 'armeabi-v7a' },
      { key: 'x86', pattern: 'x86' }     // 最后匹配x86
    ];

    // 标记找到的架构
    const foundArch = new Set();

    // 收集未匹配到架构的项
    const unmatchedItems = [];

    // 处理每个制品
    artifacts.forEach(item => {
      // 使用find代替for循环，提高代码可读性
      const matchedArch = archPatterns.find(({ pattern }) => item.name.includes(pattern));
      
      if (matchedArch && archElements[matchedArch.key]) {
        archElements[matchedArch.key].href = item.url;
        foundArch.add(matchedArch.key);
      } else {
        unmatchedItems.push(item);
      }
    });

    // 处理未匹配的项
    handleUnmatchedItems(unmatchedItems, archElements, versionEl);

    // 移除未找到的架构元素
    removeUnsupportedArchElements(archElements, foundArch);

    // 清理并标记完成
    spinner.remove();
    loadFlags[loadedFlag] = true;
    console.log(`loadDownWay7：加载${repoName}线7：完成：版本${artifacts[0]?.tag || '未知'}`);
  } catch (error) {
    console.error(`loadDownWay7：加载${repoName}线7：出错：${error.message}`);
    
    // 确保versionEl存在再更新内容
    const versionEl = document.getElementById(`${prefix}Version`);
    if (versionEl) {
      versionEl.textContent = '出错：' + error.message;
    }

    // 显示错误对话框
    mdui.dialog({
      title: `加载${repoName}线7：出错`,
      content: error.message,
      buttons: [{ text: '关闭' }],
      history: false
    });
  }
}



/**
 * 加载渲染器线1
 */
async function loadRenderDownWay1() {
  await loadList('/file/data/渲染器线1.json', 'renderDownWay1', '渲染器线1', 'renderDownWay1Loaded');
}

/**
 * 加载渲染器线3
 */
async function loadRenderDownWay3() {
  await loadList('/file/data/渲染器线3.json', 'renderDownWay3', '渲染器线3', 'renderDownWay3Loaded');
}

/**
 * 加载渲染器线7
 */
async function loadRenderDownWay7() {
  await loadListDownWay7('MobileGlues', '渲染器线7', 'mgRenderDownWay7Loaded', 'renderDownWay7');
}

/**
 * 加载驱动线1
 */
async function loadDriverDownWay1() {
  await loadList('/file/data/驱动线1.json', 'driverDownWay1', '驱动线1', 'driverDownWay1Loaded');
}

/**
 * 加载驱动线7
 */
async function loadDriverDownWay7() {
  await loadListDownWay7('zl_driver', '驱动线7', 'driverDownWay7Loaded', 'driverDownWay7');
}

/**
 * 加载驱动线8
 */
async function loadDriverDownWay8() {
  await loadList('/file/data/驱动线8.json', 'driverDownWay8', '驱动线8', 'driverDownWay8Loaded');
}

/**
 * 加载JRE线7
 */
async function loadJreDownWay7() {
  await loadListDownWay7('jre', 'JRE线7', 'jreDownWay7Loaded', 'jreDownWay7');
}

// 导出模块内容
/**
 * 处理未匹配架构的下载项
 * @param {Array} unmatchedItems - 未匹配架构的下载项数组
 * @param {Object} archElements - 架构元素对象
 * @param {HTMLElement} versionEl - 版本元素
 */
function handleUnmatchedItems(unmatchedItems, archElements, versionEl) {
  if (unmatchedItems.length === 0) return;
  
  // 如果只有一个未匹配项，使用现有的all按钮
  if (unmatchedItems.length === 1 && archElements.all) {
    archElements.all.href = unmatchedItems[0].url;
    return;
  }
  
  // 多个未匹配项时，创建新按钮
  // 先移除原始的all按钮
  if (archElements.all) {
    archElements.all.remove();
  }
  
  // 获取父容器
  const parentContainer = versionEl.parentElement?.nextElementSibling;
  if (!parentContainer) return;
  
  // 为每个未匹配项创建新按钮
  unmatchedItems.forEach((item) => {
    const newButton = document.createElement('a');
    newButton.href = item.url;
    newButton.className = 'mdui-btn mdui-btn-raised mdui-btn-block mdui-ripple';
    newButton.textContent = item.name;
    
    // 添加到父容器
    parentContainer.appendChild(newButton);
  });
}

/**
 * 移除不支持的架构元素
 * @param {Object} archElements - 架构元素对象
 * @param {Set} foundArch - 找到的架构集合
 */
function removeUnsupportedArchElements(archElements, foundArch) {
  Object.keys(archElements).forEach(arch => {
    if (arch !== 'all' && !foundArch.has(arch) && archElements[arch]) {
      archElements[arch].remove();
    }
  });
}

/**
 * 加载一般列表。这种列表不像上面的需要按架构进行各种杂七杂八的东西，就是一个简单的按钮列表。
 * @async
 * @param {string} fileUrl - 数据JSON文件路径
 * @param {string} targetId - 目标DOM元素ID
 * @param {string} operationName - 操作名称（用于错误信息）
 * @param {string} loadedFlag - 全局加载标记

*/
async function loadList(fileUrl, targetId, operationName, loadedFlag) {
  // 检查是否已加载
  if (loadFlags[loadedFlag]) {
    return;
  }

  const targetElement = document.getElementById(targetId);

  //调试
  console.log(`加载${operationName}：${fileUrl}`);

  try {
    // 发起请求获取JSON数据
    const response = await fetch(fileUrl);

    // 检查请求是否成功
    if (!response.ok) {
      throw new Error(`状态码：${response.status}`);
    }

    // 解析JSON数据
    const data = await response.json();

    // 获取目标DOM元素
    if (!targetElement) {
      throw new Error(`元素不存在：${targetId}`);
    }

    // 生成HTML链接字符串
    const linksHtml = data.map(item =>
      `<a href="${item.url}" class="mdui-btn mdui-btn-raised mdui-btn-block mdui-ripple">${item.name}</a>`
    ).join('\n');

    // 将生成的HTML填充到目标元素
    targetElement.innerHTML = linksHtml;

    // 输出加载完成
    console.log(`加载${operationName}：完成`);

    // 标记为已加载
    loadFlags[loadedFlag] = true;

  } catch (error) {
    // 显示错误
    if (targetElement) {
      targetElement.textContent = `出错：${error.message}`;
    }

    // 打印错误
    console.error(`加载${operationName}：`, error);

    // 显示错误对话框
    mdui.dialog({
      title: `加载${operationName}：出错：`,
      content: error.message,
      buttons: [{ text: '关闭' }],
      history: false
    });
  }
}

/**
 * 加载一般列表（线路7）
 * @param {string} repoName - 仓库名称
 * @param {string} logPrefix - 日志和提示信息前缀
 * @param {string} loadedFlag - 全局加载标记
 * @param {string} containerId - 容器元素ID
 */
async function loadListDownWay7(repoName, logPrefix, loadedFlag, containerId) {
  // 获取DOM元素引用
  const container = document.getElementById(containerId);

  // 检查是否已加载
  if (loadFlags[loadedFlag]) return;
  console.log(`${logPrefix}：开始`);

  try {
    // 获取制品列表
    const Launcher = await waitForLauncher();
    const drivers = await Launcher.getByRepo(repoName);

    // 清空容器
    container.innerHTML = '';

    // 处理每个驱动程序
    drivers.forEach(driver => {
      // 创建链接元素
      const link = document.createElement('a');
      link.href = driver.url;
      link.className = 'mdui-btn mdui-btn-raised mdui-btn-block mdui-ripple';
      link.textContent = driver.name;
      // 如果名称不合理则改为仓库名称
      if (driver.name === 'app-release.apk') {
        link.textContent = repoName;
      }
      // 添加到容器
      container.appendChild(link);
    });

    // 清理并标记完成
    loadFlags[loadedFlag] = true;
    console.log(`${logPrefix}：完成`);
  } catch (error) {
    console.error(`${logPrefix}：出错`, error);

    // 显示错误信息
    container.textContent = '出错：' + error.message;

    // 显示错误对话框
    mdui.dialog({
      title: `${logPrefix}：出错`,
      content: error.message,
      buttons: [{ text: '关闭' }],
      history: false
    });
  }
}

// 导出模块内容
export {
  Launcher,
  loadDownWay7,
  handleUnmatchedItems,
  removeUnsupportedArchElements,
  loadList,
  loadListDownWay7,
  loadRenderDownWay1,
  loadRenderDownWay3,
  loadRenderDownWay7,
  loadDriverDownWay1,
  loadDriverDownWay7,
  loadDriverDownWay8,
  loadJreDownWay7
};