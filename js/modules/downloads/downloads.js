/**
 * 下载相关功能模块
 */

import { loadFlags } from '../core/app.js';
import { fetchContent } from '../utils/network.js';
import { Launcher } from '../integrations/launcher-sdk.js';

// 等待Launcher对象加载完成
async function waitForLauncher() {
  // 轮询检查Launcher是否已定义
  while (!Launcher) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return Launcher;
}
import { createPlaceholder, lazyLoadContent } from '../utils/lazyLoader.js';

/**
 * 通用内容加载函数
 * @async
 * @param {Object} options - 配置选项
 * @param {string} [options.url] - 内容URL
 * @param {string} [options.targetId] - 目标容器ID
 * @param {string} [options.context] - 上下文名称（用于日志/错误提示）
 * @param {boolean} [options.usePlaceholder=true] - 是否使用占位符
 */
async function loadContent({
  url = '',
  targetId = '',
  context = '内容',
  usePlaceholder = true
}) {
  const targetContainer = document.getElementById(targetId);
  try {
    if (!targetContainer) {
      throw new Error(`${context}：加载：目标容器不存在：${targetId}`);
    }
    
    // 如果使用占位符，先显示占位符
    if (usePlaceholder) {
      targetContainer.innerHTML = createPlaceholder(`${context}加载中...`, true);
    } else {
      targetContainer.innerHTML = '<div class="mdui-spinner"></div>正在加载';
    }

    const htmlDoc = await fetchContent(url);

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
    if (targetContainer) targetContainer.innerHTML = `<div class="mdui-typo"><p>${context}加载失败：${error.message}</p></div>`;
    mdui.dialog({
      title: `${context}：加载：出错：`,
      content: error.message,
      buttons: [{ text: '关闭' }],
      history: false
    });
  }
}

/**
 * 加载开门见山
 */
async function loadOdlm() {
  await loadContent({
    url: '/file/data/odlm.html',
    targetId: 'odlm',
    context: '开门见山',
    usePlaceholder: true
  });
}

/**
 * 加载FCL介绍
 */
async function loadIntroFcl() {
  await loadContent({
    url: '/file/data/introFcl.html',
    targetId: 'introFcl',
    context: 'FCL介绍',
    usePlaceholder: true
  });
}

/**
 * 加载直链
 */
async function loadDownLinks() {
  console.log('下载：是否不加载：' + loadFlags.downLinksLoaded);
  if (loadFlags.downLinksLoaded) {
    return;
  } else {
    await loadContent({
      url: '/file/data/downLinks.html',
      targetId: 'tab2',
      context: '直链',
      usePlaceholder: true
    });
    loadFlags.downLinksLoaded = true;
  }
}

/**
 * 加载校验
 */
async function loadChecksums() {
  console.log('校验：是否不加载：' + loadFlags.checksumsLoaded);
  if (loadFlags.checksumsLoaded) {
    return;
  } else {
    await loadContent({
      url: '/file/data/checksums.html',
      targetId: 'tab3',
      context: '校验',
      usePlaceholder: true
    });
    loadFlags.checksumsLoaded = true;
  }
}

/**
 * 加载关于
 */
async function loadAbout() {
  console.log('关于：是否不加载：' + loadFlags.aboutLoaded);
  if (loadFlags.aboutLoaded) {
    return;
  } else {
    await loadContent({
      url: '/file/data/about.html',
      targetId: 'tab5',
      context: '关于',
      usePlaceholder: true
    });
    loadFlags.aboutLoaded = true;
  }
}

/**
 * 获取赞助者数据并渲染为HTML表格
 * @async
 * @function loadSponsorList
 * @returns {Promise<void>} 无返回值
 */
async function loadSponsorList() {
  const sponsorContainer = document.getElementById('sponsorList');
  if (!sponsorContainer) {
    console.warn('赞助列表容器不存在');
    return;
  }

  // 显示占位符
  sponsorContainer.innerHTML = createPlaceholder('赞助列表加载中...', true);

  try {
    const response = await fetch('/file/data/sponsorList.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const tableHeaders = ['昵称', '¥', '留言', '邮箱', 'GH', '备注'];

    let html = `
<div class="mdui-table-fluid">
  <table class="mdui-table">
    <thead>
      <tr>
        ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
      </tr>
    </thead>
    <tbody>`;

    for (const [nickname, info] of Object.entries(data)) {
      const ghCell = info.GH ?
        `<td class="mdui-typo"><a href="${info.GH}" target="_blank">${info.GH.split('/').pop() || '链接'}</a></td>` :
        '<td></td>';

      html += `
      <tr>
        <td>${nickname}</td>
        <td>${info.金额 ?? ''}</td>
        <td>${info.留言 ?? ''}</td>
        <td>${info.邮箱 ?? ''}</td>
        ${ghCell}
        <td>${info.备注 ?? ''}</td>
      </tr>`;
    }

    html += `
    </tbody>
  </table>
</div>`;

    sponsorContainer.innerHTML = html;
    mdui.mutation();
  } catch (error) {
    console.error('赞表：加载：出错：', error);
    sponsorContainer.innerHTML = `<div class="mdui-typo"><p>赞助列表加载失败：${error.message}</p></div>`;
  }
}

// 导出模块内容
export {
  loadContent,
  loadOdlm,
  loadIntroFcl,
  loadDownLinks,
  loadChecksums,
  loadAbout,
  loadSponsorList
};