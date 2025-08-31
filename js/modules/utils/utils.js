/**
 * 工具函数模块
 */

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
    throw new Error(`获取页面：HTTP出错：${response.status} ${response.statusText}`);
  }

  try {
    const html = await response.text();
    const domParser = new DOMParser();
    return domParser.parseFromString(html, 'text/html');
  } catch (error) {
    throw new Error(`获取页面：HTML解析出错：${error.message}`);
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
 * CD：为按钮（button和a）添加按下冷却
 */
function setCoolDown() {
  const buttons = document.querySelectorAll('button[class*="-cd"], a[class*="-cd"]');
  console.log(`CD：找到按钮数：${buttons.length}`);

  buttons.forEach(button => {
    if (button._cdBound) {
      console.log('CD：跳过已处理的按钮', button);
      return;
    }
    button._cdBound = true;

    const cdClass = Array.from(button.classList).find(cls => cls.endsWith('-cd'));
    if (!cdClass) {
      console.warn(`CD：可恶，是障眼法：`, button);
      return;
    }

    const timeStr = cdClass.split('-')[0];
    const cdTime = parseFloat(timeStr) * 1000;

    if (isNaN(cdTime) || cdTime <= 0) {
      console.error(`CD：无效的时间：${timeStr}`, button);
      return;
    }

    button.addEventListener('click', function handleClick(event) {
      console.log(`CD：按钮被点击：`, button);

      if (button.hasAttribute('data-cd-active')) {
        console.warn(`CD：冷却中按钮被点击：`, button);
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const originalHTML = button.innerHTML;
      const originalDisabled = button.disabled;
      const originalWidth = button.offsetWidth;

      button.setAttribute('data-cd-active', 'true');
      button.disabled = true;
      button.style.minWidth = `${originalWidth}px`;
      mdui.mutation();

      const startTime = Date.now();
      const endTime = startTime + cdTime;

      if (button._cdTimer) clearInterval(button._cdTimer);

      button._cdTimer = setInterval(() => {
        if (!document.body.contains(button)) {
          console.warn('CD：按钮已消失，停止冷却');
          clearInterval(button._cdTimer);
          button._cdTimer = null;
          return;
        }

        const now = Date.now();
        const remaining = Math.max(0, endTime - now);

        if (remaining <= 0) {
          clearInterval(button._cdTimer);
          button._cdTimer = null;

          button.innerHTML = originalHTML;
          button.disabled = originalDisabled;
          button.removeAttribute('data-cd-active');
          button.style.minWidth = '';

          console.log(`CD：冷却结束：`, button);
          mdui.mutation();
        }
        else {
          button.innerHTML = `${originalHTML} (冷却中${(remaining / 1000).toFixed(1)}s)`;
        }
      }, 100);
    });
  });

  console.log('CD：所有按钮处理完成');
}

/**
 * 更新状态文本
 * @param {string} statusText 状态文本
 * @param {number} progressNum 进度百分比
 */
function updateStatus(statusText, progressNum) {
  console.log('状态：' + statusText + '（' + progressNum + '）');
  const container = document.getElementById('status');
  const porgress = document.getElementById('progress');
  const statusTextElement = document.getElementById('statusDebug');
  if (container) {
    container.innerHTML = statusText;
  };
  if (porgress) {
    porgress.style.width = progressNum + '%';
  };
  if (statusTextElement) {
    statusTextElement.innerHTML = statusTextElement.innerHTML + '<br>' + statusText;
  };
}

// 导出模块内容
export {
  fetchContent,
  updateContainer,
  getRunTime,
  loadRunTime,
  setCoolDown,
  updateStatus
};