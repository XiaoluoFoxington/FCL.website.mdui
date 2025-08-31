/**
 * 内容展框机制模块
 * 提供内容加载的占位符和延迟加载功能
 */

/**
 * 创建内容占位符
 * @param {string} placeholderText - 占位符文本
 * @param {boolean} showSpinner - 是否显示加载动画
 * @returns {string} 占位符HTML
 */
function createPlaceholder(placeholderText = '内容加载中...', showSpinner = true) {
  if (showSpinner) {
    return `
      <div class="content-placeholder mdui-valign">
        <div class="mdui-spinner mdui-m-r-2"></div>
        <span>${placeholderText}</span>
      </div>
    `;
  } else {
    return `
      <div class="content-placeholder">
        <span>${placeholderText}</span>
      </div>
    `;
  }
}

/**
 * 延迟加载内容的包装器
 * @param {Function} loadFunction - 实际加载函数
 * @param {string} targetId - 目标元素ID
 * @param {string} placeholderText - 占位符文本
 * @param {boolean} showSpinner - 是否显示加载动画
 * @returns {Promise<void>}
 */
async function lazyLoadContent(loadFunction, targetId, placeholderText = '内容加载中...', showSpinner = true) {
  const targetElement = document.getElementById(targetId);
  if (!targetElement) {
    console.warn(`延迟加载：未找到目标元素 ${targetId}`);
    return;
  }

  // 显示占位符
  targetElement.innerHTML = createPlaceholder(placeholderText, showSpinner);

  try {
    // 执行实际加载函数
    await loadFunction();
    
    // 移除占位符相关的类
    targetElement.classList.remove('content-placeholder-container');
  } catch (error) {
    console.error(`延迟加载 ${targetId} 出错：`, error);
    targetElement.innerHTML = `<div class="mdui-typo"><p>内容加载失败：${error.message}</p></div>`;
  }
}

/**
 * 为元素添加可见性监听器，当元素进入视口时加载内容
 * @param {string} targetId - 目标元素ID
 * @param {Function} loadFunction - 实际加载函数
 * @param {string} placeholderText - 占位符文本
 * @param {boolean} showSpinner - 是否显示加载动画
 */
function loadWhenVisible(targetId, loadFunction, placeholderText = '内容加载中...', showSpinner = true) {
  const targetElement = document.getElementById(targetId);
  if (!targetElement) {
    console.warn(`可见性加载：未找到目标元素 ${targetId}`);
    return;
  }

  // 显示占位符
  targetElement.innerHTML = createPlaceholder(placeholderText, showSpinner);
  targetElement.classList.add('content-placeholder-container');

  // 创建交叉观察器
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 元素进入视口，开始加载内容
        lazyLoadContent(loadFunction, targetId, placeholderText, showSpinner);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 // 当10%的元素可见时触发
  });

  observer.observe(targetElement);
}

/**
 * 批量延迟加载内容
 * @param {Array} loadItems - 加载项数组 [{id, loadFunction, placeholderText, showSpinner}]
 */
function batchLazyLoad(loadItems) {
  loadItems.forEach(item => {
    const { id, loadFunction, placeholderText = '内容加载中...', showSpinner = true } = item;
    setTimeout(() => {
      lazyLoadContent(loadFunction, id, placeholderText, showSpinner);
    }, 0);
  });
}

// 导出模块内容
export {
  createPlaceholder,
  lazyLoadContent,
  loadWhenVisible,
  batchLazyLoad
};