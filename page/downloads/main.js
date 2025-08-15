window.onload = async function() {
  await loadF1();
  await loadF2();
  await loadF3();
  await loadF4();
}

/**
 * 加载F1
 */
async function loadF1() {
  loadList('/file/data/fclDownWay1.json', false, 'FCL', '线路1');
}

/**
 * 加载F2
 */
async function loadF2() {
  loadList('https://frostlynx.work/external/fcl/file_tree.json', true, 'FCL', '线路2');
}

/**
 * 加载F3
 */
async function loadF3() {
  loadList('/file/data/fclDownWay3.json', false, 'FCL', '线路3');
}

/**
 * 加载F4
 */
async function loadF4() {
  loadList('/file/data/fclDownWay4.json', false, 'FCL', '线路4');
}

//

/**
 * 加载列表
 * @param {string} jsonLink - JSON文件链接
 * @param {boolean} f2 - 是否需要像FCL线2一样特殊处理
 * @param {string} name - 文件名称
 * @param {string} sourceName - 线路名称
 */
async function loadList(jsonLink, f2, name, sourceName) {
  try {
    const data = await fetchJson(jsonLink);
    const mainList = document.getElementById('mainList');
    
    if (!data.children || data.children.length === 0) {
      renderErrorState('mainList', '数据格式错误，未找到版本信息');
      return;
    }
    
    if (f2) {
      const fragment = renderVersionData(data.children[0].children, name, sourceName);
      mainList.appendChild(fragment);
    } else {
      const fragment = renderVersionData(data.children, name, sourceName);
      mainList.appendChild(fragment);
    };
    
  } catch (e) {
    console.error('获取数据失败:', e);
    renderErrorState('mainList', e);
  }
}














//

/**
 * 从指定URL获取JSON数据
 * @param {string} url - 目标URL地址
 * @param {object} [options] - 可选配置项
 * @param {number} [options.timeout=10000] - 超时时间(毫秒)
 * @param {object} [options.headers] - 自定义请求头
 * @returns {Promise<object>} - 返回解析后的JSON数据
 */
async function fetchJson(url, options = {}) {
  const { timeout = 10000, headers = {} } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    throw new Error(`请求超时 (${timeout}ms)`);
  }, timeout);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(`请求被中止: ${error.message}`);
    }
    
    throw new Error(`获取数据失败: ${error.message}`);
  }
}

/**
 * 创建版本面板元素
 * @param {string} versionName - 版本名称
 * @param {string} name - 文件名称
 * @param {string} sourceName - 线路名称
 * @param {Object} file - 文件对象
 * @param {string} file.arch - 架构信息
 * @param {string} file.download_link - 下载链接
 * @returns {HTMLDivElement} - 创建的面板元素
 */
function createVersionPanel(versionName, name, sourceName, file) {
  const panel = document.createElement('div');
  panel.className = 'mdui-panel-item mdui-panel-item-open';
  
  panel.innerHTML = `
    <div class="mdui-panel-item-header">${name} ${versionName}</div>
    <div class="mdui-panel-item-body mdui-typo">
      <p>
        <div class="mdui-chip"><span class="mdui-chip-title">${name}</span></div>
        <div class="mdui-chip"><span class="mdui-chip-title">${sourceName}</span></div>
        <div class="mdui-chip"><span class="mdui-chip-title">${file.arch}</span></div>
        <div class="mdui-chip"><span class="mdui-chip-title">${versionName}</span></div>
      </p>
      <p>
        <a class="mdui-btn mdui-btn-block mdui-btn-raised mdui-ripple" 
           href="${file.download_link}" 
           download>
           下载
        </a>
      </p>
    </div>
  `;
  
  return panel;
}

/**
 * 渲染版本数据到DOM
 * @param {Object[]} versionData - 版本数据数组
 * @param {string} versionData[].name - 版本名称
 * @param {Object[]} versionData[].children - 文件对象数组
 * @param {string} name - 文件名称
 * @param {string} sourceName - 线路名称
 * @returns {DocumentFragment} - 包含所有面板元素的文档片段
 */
function renderVersionData(versionData, name, sourceName) {
  const fragment = document.createDocumentFragment();
  
  versionData.forEach(versionDir => {
    const versionName = versionDir.name;
    
    versionDir.children.forEach(file => {
      const panel = createVersionPanel(versionName, name, sourceName, file);
      fragment.appendChild(panel);
    });
  });
  
  return fragment;
}

/**
 * 渲染错误状态到DOM容器
 * @param {string} containerId - 容器元素ID
 * @param {string} errorMessage - 错误消息
 */
function renderErrorState(containerId, errorMessage) {
  console.error(e);
}

