/**
 * 下载线路功能模块
 */

import { loadFlags } from '../core/app.js';

// 数据源映射表（优化点3：特殊源逻辑解耦）
const SOURCE_MAP = {
  F1: {
    path: "/file/data/fclDownWay1.json",
    markLatest: false
  },
  F2: {
    path: "https://frostlynx.work/external/fcl/file_tree.json",
    markLatest: true,
    nestedPath: ["fcl"] // 特殊嵌套路径
  },
  F3: {
    path: "/file/data/fclDownWay3.json",
    markLatest: false
  },
  F4: {
    path: "/file/data/fclDownWay4.json",
    markLatest: false
  },
  F5: {
    path: "https://fcl.switch.api.072211.xyz/?from=foldcraftlauncher&isDev=1",
    markLatest: true
  },
  F6: {
    path: "https://bbs.xn--rhqx00c95nv9a.club/mirror.json",
    markLatest: false
  },
  Z1: {
    path: "/file/data/zlDownWay1.json",
    markLatest: false
  },
  Z3: {
    path: "/file/data/ZlDownWay3.json",
    markLatest: false
  },
  Z21: {
    path: "/file/data/zl2DownWay1.json",
    markLatest: false
  },
  Z22: {
    path: "https://frostlynx.work/external/zl2/file_tree.json",
    markLatest: false,
    nestedPath: ["zl2"] // 特殊嵌套路径
  }
};

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

    let versionDirs = null;

    if (url === 'https://frostlynx.work/external/fcl/file_tree.json' || url === 'https://frostlynx.work/external/zl2/file_tree.json') {
      // FCL线2和zl2线2又在根children里包了一个"fcl"，需要再进入这个的children里寻找
      console.log('开门见山：FCL线2特殊处理');
      versionDirs = fileTree.children[0].children.filter(
        child => child.type === 'directory' && child.name !== 'root'
      );
    } else {
      versionDirs = fileTree.children.filter(
        child => child.type === 'directory' && child.name !== 'root'
      );
    }

    if (versionDirs.length === 0) {
      console.warn(`${lineName}：找到版本数：${versionDirs.length}`);
      container.innerHTML = `<div class="mdui-typo">${lineName}：警告：没有找到版本数据</div>`;
    } else {
      console.log(`${lineName}：找到版本数：${versionDirs.length}`);

    }

    versionDirs.forEach(versionDir => {
      panel.appendChild(createPanelItem(versionDir));
    });

    container.appendChild(panel);
    new mdui.Panel(panel);
    console.log(`${lineName}：完成`);
  } catch (error) {
    console.error(`${lineName}：出错：`, error);
    container.innerHTML = `<div class="mdui-typo">${lineName}：出错：${error.message}</div>`;
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
    loadFclDownWay4(),
    loadFclDownWay5(),
    loadFclDownWay6(),
    loadFclDownWay8(),
    loadZlDownWay1(),
    loadZlDownWay3()
  ]);
}

/**
 * 加载FCL下载线路1
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay1() {
  if (loadFlags.fclDownWay1Loaded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/fclDownWay1.json',
    'fclDownWay1',
    '加载FCL线1'
  );
  loadFlags.fclDownWay1Loaded = true;
}

/**
 * 加载FCL下载线路2
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay2() {
  if (loadFlags.fclDownWay2Loaded) {
    return;
  }
  await loadFclDownWay(
    'https://frostlynx.work/external/fcl/file_tree.json',
    'fclDownWay2',
    '加载FCL线2'
  );
  loadFlags.fclDownWay2Loaded = true;
}

/**
 * 加载FCL下载线路3
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay3() {
  if (loadFlags.fclDownWay3Loaded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/fclDownWay3.json',
    'fclDownWay3',
    '加载FCL线3'
  );
  loadFlags.fclDownWay3Loaded = true;
}

/**
 * 加载FCL下载线路4
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay4() {
  if (loadFlags.fclDownWay4Loaded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/fclDownWay4.json',
    'fclDownWay4',
    '加载FCL线4'
  );
  loadFlags.fclDownWay4Loaded = true;
}

/**
 * 加载FCL下载线路5
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay5() {
  if (loadFlags.fclDownWay5Loaded) {
    return;
  }
  await loadFclDownWay(
    'https://fcl.switch.api.072211.xyz/?from=foldcraftlauncher&isDev=1',
    'fclDownWay5',
    '加载FCL线5'
  );
  loadFlags.fclDownWay5Loaded = true;
}

/**
 * 加载FCL下载线路6
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay6() {
  if (loadFlags.fclDownWay6Loaded) {
    return;
  }
  await loadFclDownWay(
    'https://bbs.xn--rhqx00c95nv9a.club/mirror.json',
    'fclDownWay6',
    '加载FCL线6'
  );
  loadFlags.fclDownWay6Loaded = true;
}

/**
 * 加载FCL下载线路7
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay7() {
  await loadDownWay7('FoldCraftLauncher', 'fclDownWay7', 'fclDownWay7Loaded');
}

/**
 * 加载FCL下载线路8
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadFclDownWay8() {
  if (loadFlags.fclDownWay8Loaded) {
    return;
  }
  await loadFclDownWay(
    // 'http://103.217.184.153/api/FCL/filelist.json',
    'https://api.cxsjmc.cn/api/FCL/filelist.json',
    'fclDownWay8',
    '加载FCL线8'
  );
  loadFlags.fclDownWay8Loaded = true;
}

/**
 * 加载ZL下载线路1
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadZlDownWay1() {
  if (loadFlags.zlDownWay1Loaded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/zlDownWay1.json',
    'zlDownWay1',
    '加载ZL线1'
  );
  loadFlags.zlDownWay1Loaded = true;
}

/**
 * 加载ZL下载线路3
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadZlDownWay3() {
  if (loadFlags.ZlDownWay3Loaded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/zlDownWay3.json',
    'zlDownWay3',
    '加载ZL线3'
  );
  loadFlags.ZlDownWay3Loaded = true;
}

/**
 * 加载ZL下载线路7
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadZlDownWay7() {
  await loadDownWay7('ZalithLauncher', 'zlDownWay7', 'zlDownWay7Loaded');
}

/**
 * 加载ZL2下载线路1
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadZl2DownWay1() {
  if (loadFlags.zl2DownWay1Loaded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/zl2DownWay1.json',
    'zl2DownWay1',
    '加载ZL2线1'
  );
  loadFlags.zl2DownWay1Loaded = true;
}

/**
 * 加载ZL2下载线路2
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadZl2DownWay2() {
  if (loadFlags.zl2DownWay2Loaded) {
    return;
  }
  await loadFclDownWay(
    'https://frostlynx.work/external/zl2/file_tree.json',
    'zl2DownWay2',
    '加载ZL2线2'
  );
  loadFlags.zl2DownWay2Loaded = true;
}

/**
 * 加载ZL2下载线路3
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadZl2DownWay3() {
  if (loadFlags.zl2DownWay3Loaded) {
    return;
  }
  await loadFclDownWay(
    '/file/data/zl2DownWay3.json',
    'zl2DownWay3',
    '加载ZL2线3'
  );
  loadFlags.zl2DownWay3Loaded = true;
}

/**
 * 加载ZL2下载线路7
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadZl2DownWay7() {
  await loadDownWay7('ZalithLauncher2', 'zl2DownWay7', 'zl2DownWay7Loaded');
}

/**
 * 加载PL下载线路7
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadPlDownWay7() {
  await loadDownWay7('PojavLauncher', 'plDownWay7', 'plDownWay7Loaded');
}

/**
 * 加载PL iOS下载线路7
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadPliosDownWay7() {
  await loadDownWay7('PojavLauncher_iOS', 'pliosDownWay7', 'pliosDownWay7Loaded');
}

/**
 * 加载HMCL-PE下载线路7
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadHmclpeDownWay7() {
  await loadDownWay7('HMCL-PE(Outdated)', 'hmclpeDownWay7', 'hmclpeDownWay7Loaded');
}

/**
 * 加载MCinaBOX下载线路7
 * @async
 * @returns {Promise<void>} 无返回值
 */
async function loadMcinaboxDownWay7() {
  await loadDownWay7('MCinaBOX(Outdated)', 'mcinaboxDownWay7', 'mcinaboxDownWay7Loaded');
}

// 导出模块内容
export {
  SOURCE_MAP,
  loadFclDownWay,
  createPanelItem,
  createArchLinkMap,
  createArchButton,
  loadAllFclDownWays,
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
};