/**
 * 工具函数模块 - 包含与过滤功能无关的辅助函数
 */
const Utils = {
  /**
   * 从指定URL获取JSON数据
   * @param {string} url - 目标URL地址
   * @param {object} [options] - 可选配置项
   * @param {number} [options.timeout=10000] - 超时时间(毫秒)
   * @returns {Promise<object>} - 返回解析后的JSON数据
   */
  async fetchJson(url, options = {}) {
    const { timeout = 10000 } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP错误! 状态码: ${response.status}`);
      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') throw new Error(`请求超时 (${timeout}ms)`);
      throw new Error(`获取数据失败: ${error.message}`);
    }
  },

  /**
   * 渲染错误状态到DOM容器
   * @param {string} errorMessage - 错误消息
   */
  renderErrorState(errorMessage) {
    console.error(errorMessage);
    const mainList = document.getElementById('mainList');

    // 移除现有的错误提示
    const existingError = document.getElementById('errorState');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorState';
    errorDiv.className = 'mdui-panel-item mdui-panel-item-open';
    errorDiv.innerHTML = `
    <div class="mdui-panel-item-header">出错</div>
    <div class="mdui-panel-item-body mdui-typo">
      <p>
        ${errorMessage}
      </p>
      <p>
        <a class="mdui-btn mdui-btn-block mdui-btn-raised mdui-ripple" href="javascript: location.reload();">重试</a>
      </p>
    </div>
`;

    mainList.appendChild(errorDiv);
  }
};

/**
 * 过滤系统模块 - 包含所有与过滤相关的功能
 */
const FilterSystem = {
  /** @type {Set<string>} 当前激活的过滤条件 */
  activeFilters: new Set(),

  /** @type {Set<string>} 所有可用的标签值 */
  allChipValues: new Set(),

  /**
   * 初始化过滤系统
   */
  init() {
    // 为所有标签添加点击事件
    document.getElementById('mainList').addEventListener('click', this.handleChipClick.bind(this));
    document.getElementById('allList').addEventListener('click', this.handleChipClick.bind(this));

    // 清除所有过滤按钮
    document.getElementById('clearFilters').addEventListener('click', this.clearAllFilters.bind(this));

    // 初始化显示
    this.updateActiveFiltersDisplay();
    this.updateResultsCount();
  },

  /**
   * 处理标签点击事件
   * @param {MouseEvent} event - 点击事件对象
   */
  handleChipClick(event) {
    const chip = event.target.closest('.mdui-chip');
    if (!chip) return;

    const chipTitle = chip.querySelector('.mdui-chip-title');
    if (chipTitle) {
      const chipValue = chipTitle.textContent.trim();
      this.toggleFilter(chipValue);
    }
  },

  /**
   * 切换过滤条件
   * @param {string} value - 过滤值
   */
  toggleFilter(value) {
    if (this.activeFilters.has(value)) {
      this.activeFilters.delete(value);
    } else {
      this.activeFilters.add(value);
      this.allChipValues.add(value);
    }

    this.updateActiveFiltersDisplay();
    this.filterPanels();
    this.updateResultsCount();
  },

  /**
   * 清除所有过滤条件
   */
  clearAllFilters() {
    this.activeFilters.clear();
    this.updateActiveFiltersDisplay();
    this.filterPanels();
    this.updateResultsCount();
  },

  /**
   * 更新活动过滤条件显示
   */
  updateActiveFiltersDisplay() {
    const container = document.getElementById('activeFilters');
    container.innerHTML = '';

    if (this.activeFilters.size === 0) {
      container.innerHTML = '<div>无活动过滤条件</div>';
      return;
    }

    this.activeFilters.forEach(value => {
      const chip = document.createElement('div');
      chip.className = 'mdui-chip active-filter mdui-m-r-1 mdui-m-b-1';
      chip.innerHTML = `
        <span class="mdui-chip-title">${value}</span>
        <span class="mdui-chip-close" data-value="${value}">
          <i class="mdui-icon material-icons">close</i>
        </span>
      `;
      container.appendChild(chip);

      // 为关闭按钮添加事件
      chip.querySelector('.mdui-chip-close').addEventListener('click', (e) => {
        e.stopPropagation();
        const value = e.currentTarget.getAttribute('data-value');
        this.activeFilters.delete(value);
        this.updateActiveFiltersDisplay();
        this.filterPanels();
        this.updateResultsCount();
      });
    });
  },

  /**
   * 过滤面板显示
   */
  filterPanels() {
    const panels = document.getElementById('mainList').querySelectorAll('.mdui-panel-item');
    let visibleCount = 0;

    panels.forEach(panel => {
      const chips = panel.querySelectorAll('.mdui-chip');
      let shouldShow = true;

      // 如果没有过滤条件，显示所有
      if (this.activeFilters.size === 0) {
        panel.style.display = 'block';
        visibleCount++;
        return;
      }

      // 检查面板是否包含所有活动过滤条件
      const chipValues = Array.from(chips).map(chip => {
        const title = chip.querySelector('.mdui-chip-title');
        return title ? title.textContent.trim() : '';
      });

      // 面板需要包含所有活动过滤条件才显示
      for (const filter of this.activeFilters) {
        if (!chipValues.includes(filter)) {
          shouldShow = false;
          break;
        }
      }

      panel.style.display = shouldShow ? 'block' : 'none';
      if (shouldShow) visibleCount++;
    });

    // 处理无结果情况
    const noResults = document.getElementById('noResults');
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    } else if (visibleCount === 0) {
      const noResultsDiv = document.createElement('div');
      noResultsDiv.id = 'noResults';
      noResultsDiv.className = 'no-results mdui-panel-item mdui-panel-item-open';
      noResultsDiv.innerHTML = `
      <div class="mdui-panel-item-header">提示</div>
      <div class="mdui-panel-item-body mdui-typo">
        <p>
          过滤后无结果
        </p>
        <p>
          <a class="mdui-btn mdui-btn-block mdui-btn-raised mdui-ripple" href="javascript: FilterSystem.clearAllFilters();">清除所有过滤</a>
        </p>
      </div>
        `;
      document.getElementById('mainList').appendChild(noResultsDiv);
    }
  },

  /**
   * 更新结果计数显示
   */
  updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    const totalPanels = document.querySelectorAll('.mdui-panel-item').length;
    const visiblePanels = document.querySelectorAll('.mdui-panel-item[style="display: block;"]').length;

    if (this.activeFilters.size === 0) {
      countElement.textContent = `显示全部 ${totalPanels} 个项目`;
    } else {
      countElement.textContent = `显示 ${visiblePanels}/${totalPanels} 个项目`;
    }
  }
};

/**
 * 普通函数模块 - 包含主要的业务逻辑函数
 */
const Functions = {
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
  createVersionPanel(versionName, name, sourceName, file) {
    const panel = document.createElement('div');
    panel.className = 'mdui-panel-item mdui-panel-item-open';

    panel.innerHTML = `
      <div class="mdui-panel-item-header">${name} ${versionName}</div>
      <div class="mdui-panel-item-body mdui-typo">
        <p>
          <div class="mdui-chip filter-chip" data-value="${name}">
            <span class="mdui-chip-title">${name}</span>
          </div>
          <div class="mdui-chip filter-chip" data-value="${sourceName}">
            <span class="mdui-chip-title">${sourceName}</span>
          </div>
          <div class="mdui-chip filter-chip" data-value="${file.arch}">
            <span class="mdui-chip-title">${file.arch}</span>
          </div>
          <div class="mdui-chip filter-chip" data-value="${versionName}">
            <span class="mdui-chip-title">${versionName}</span>
          </div>
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
  },

  /**
   * 渲染版本数据到DOM
   * @param {Object[]} versionData - 版本数据数组
   * @param {string} versionData[].name - 版本名称
   * @param {Object[]} versionData[].children - 文件对象数组
   * @param {string} name - 文件名称
   * @param {string} sourceName - 线路名称
   * @returns {DocumentFragment} - 包含所有面板元素的文档片段
   */
  renderVersionData(versionData, name, sourceName) {
    const fragment = document.createDocumentFragment();

    versionData.forEach(versionDir => {
      const versionName = versionDir.name;

      versionDir.children.forEach(file => {
        const panel = this.createVersionPanel(versionName, name, sourceName, file);
        fragment.appendChild(panel);
      });
    });

    return fragment;
  },

  /**
   * 加载列表
   * @param {string} jsonLink - JSON文件链接
   * @param {boolean} f2 - 是否需要特殊处理
   * @param {string} name - 文件名称
   * @param {string} sourceName - 线路名称
   */
  async loadList(jsonLink, f2, name, sourceName) {
    try {
      const data = await Utils.fetchJson(jsonLink);
      const mainList = document.getElementById('mainList');
      // mainList.innerHTML = ''; // 清空现有内容

      if (!data.children || data.children.length === 0) {
        Utils.renderErrorState('数据格式错误，未找到版本信息');
        return;
      }

      let fragment;
      if (f2) {
        fragment = this.renderVersionData(data.children[0].children, name, sourceName);
      } else {
        fragment = this.renderVersionData(data.children, name, sourceName);
      }

      mainList.appendChild(fragment);

    } catch (e) {
      console.error('获取数据失败:', e);
      Utils.renderErrorState(e.message);
    }
  },

  /**
   * 更新状态
   * @param {string} message - 状态消息
   */
  updateStatus(message) {
    const statusElement = document.getElementById('status');

    if (!statusElement) {
      return;
    }

    statusElement.textContent = message;
  }

};

/**
 * 加载模块 - 包含加载不同数据的功能
 */
const Loads = {
  /**
   * 加载全部
   */
  async all() {
    Functions.updateStatus('正在加载 FCL线1...');
    await this.f1();
    Functions.updateStatus('正在加载 FCL线2...');
    await this.f2();
    Functions.updateStatus('正在加载 FCL线3...');
    await this.f3();
    Functions.updateStatus('正在加载 FCL线4...');
    await this.f4();
    Functions.updateStatus('正在加载 FCL线5...');
    await this.f5();
    Functions.updateStatus('正在加载 FCL线6...');
    await this.f6();
    Functions.updateStatus('正在加载 ZL线1...');
    await this.z1();
    Functions.updateStatus('正在加载 ZL线2...');
    await this.z2();
    Functions.updateStatus('正在加载 ZL2线1...');
    await this.zl21();
    Functions.updateStatus('正在加载 ZL2线2...');
    await this.zl22();
  },

  /**
   * 加载F1
   */
  async f1() {
    await Functions.loadList('/file/data/fclDownWay1.json', false, 'Fold Craft Launcher', '线路1');
  },

  /**
   * 加载F2
   */
  async f2() {
    await Functions.loadList('https://frostlynx.work/external/fcl/file_tree.json', true, 'Fold Craft Launcher', '线路2');
  },

  /*
   * 加载F3
   */
  async f3() {
    await Functions.loadList('/file/data/fclDownWay3.json', false, 'Fold Craft Launcher', '线路3');
  },

  /*
   * 加载F4
   */
  async f4() {
    await Functions.loadList('/file/data/fclDownWay4.json', false, 'Fold Craft Launcher', '线路4');
  },

  /*
   * 加载F5
   */
  async f5() {
    await Functions.loadList('https://fcl.switch.api.072211.xyz/?from=foldcraftlauncher&isDev=1', false, 'Fold Craft Launcher', '线路5');
  },

  /*
   * 加载F6
   */
  async f6() {
    await Functions.loadList('https://bbs.xn--rhqx00c95nv9a.club/mirror.json', false, 'Fold Craft Launcher', '线路6');
  },

  /*
   * 加载Z1
   */
  async z1() {
    await Functions.loadList('/file/data/zlDownWay1.json', false, 'Zalith Launcher', '线路1');
  },

  /*
   * 加载Z2
   */
  async z2() {
    await Functions.loadList('/file/data/zlDownWay2.json', false, 'Zalith Launcher', '线路3');
  },

  /**
   * 加载Z21
   */
  async zl21() {
    await Functions.loadList('/file/data/zl2DownWay1.json', false, 'Zalith Launcher 2', '线路1');
  },

  /**
   * 加载Z22
   */
  async zl22() {
    await Functions.loadList('https://frostlynx.work/external/zl2/file_tree.json', true, 'Zalith Launcher 2', '线路2');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
});

window.onload = async function () {
  await Loads.all();
  Functions.updateStatus('初始化过滤系统...');
  FilterSystem.init();
  Functions.updateStatus('处理过滤器...');
  FilterSystem.clearAllFilters();
  Functions.updateStatus('移除此提示...');
  document.getElementById('loading').remove();
}