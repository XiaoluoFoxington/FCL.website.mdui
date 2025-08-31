/**
 * UI相关功能模块
 */

import { showEpilepsyWarning } from '../core/app.js';

/**
 * 移除加载动画
 */
function removeLoadTip() {
  const container = document.getElementById('loading');
  container.classList.add('scale-out');

  container.addEventListener('transitionend', () => {
    container.remove();
  });
}

/**
 * 显示加载中
 * @returns "正在加载"弹窗
 */
function showLoading() {
  const dialog = new mdui.dialog({
    title: '正在加载…',
    content: '<div class="mdui-spinner"></div>',
    buttons: [],
    history: false,
    closeOnEsc: false,
    closeOnConfirm: false,
    modal: true,
  });
  dialog.open();
  mdui.mutation();
  return dialog;
}

/**
 * 执行"千万别点"事件
 * @param {number} eventId - 可选的事件ID，指定要运行的事件
 */
async function runDoNotClickEvent(eventId) {
  const events = (await import('/js/DoNotClick.js')).default;
  console.log("千万别点：事件数量：", events.length);

  const runEvent = (event) => {
    event.run();
    console.log(`千万别点：执行：${event.name}`);
    mdui.snackbar({
      message: `千万别点：${event.name}`,
      position: 'right-bottom',
    });
  };

  const shouldShowWarning = (event) => {
    const needWarning = event.warning && showEpilepsyWarning;
    console.log(`千万别点：${event.name}：显示警告：${needWarning}`);
    return needWarning;
  };

  const handleWarningDialog = (event, runCallback) => {
    mdui.dialog({
      title: '光敏性癫痫警告',
      content: '此功能包含闪烁、闪光或动态视觉效果，可能对光敏性癫痫患者或光敏症患者造成不适。如果您有相关病史，请勿继续操作。',
      buttons: [
        {
          text: '取消',
          onClick: () => {
            return true;
          }
        },
        {
          text: '继续',
          onClick: () => {
            showEpilepsyWarning = false;
            // 只显示一次警告
            runCallback();
            return true;
          }
        }],
      onOpen: function () {
        mdui.mutation();
      },
      history: false,
      closeOnEsc: false,
      modal: true
    });
  };

  if (typeof eventId === 'number') {
    console.log(`千万别点：指定：${eventId}`);

    if (eventId >= 0 && eventId < events.length) {
      const selectedEvent = events[eventId];
      console.log(`千万别点：${selectedEvent.name}：找到`);

      if (shouldShowWarning(selectedEvent)) {
        handleWarningDialog(selectedEvent, () => runEvent(selectedEvent));
      } else {
        runEvent(selectedEvent);
      }
    } else {
      console.error(`千万别点：出错：无效的事件ID：${eventId}`);
      mdui.dialog({
        title: '千万别点：出错：',
        content: `无效的事件ID：${eventId}`,
        buttons: [{
          text: '确定',
          onClick: () => true
        }],
        history: false
      });
    }
    return;
  }

  const runRandom = () => {
    const randomIndex = Math.floor(Math.random() * events.length);
    const randomEvent = events[randomIndex];
    console.log(`千万别点：随机选中${randomEvent.name}[${randomIndex}]`);

    if (shouldShowWarning(randomEvent)) {
      handleWarningDialog(randomEvent, () => runEvent(randomEvent));
    } else {
      runEvent(randomEvent);
    }
  };

  runRandom();
}

/**
 * 选择一个"千万别点"事件运行
 */
function runSelectDNCEvent() {
  mdui.prompt('eventId', '请输入事件ID，空为随机',
    function (value) {
      runDoNotClickEvent(Number(value));
    },
  );
}

/**
 * 哈希参数：处理页面哈希路由参数
 */
function handleHashRouting() {
  // 使用防抖优化频繁调用
  if (!window.mduiTabInstance) {
    window.mduiTabInstance = new mdui.Tab('.mdui-tab');
  }
  const Tab = window.mduiTabInstance;

  const hash = window.location.hash.slice(1);
  if (!hash) return;

  // 使用URLSearchParams提高解析性能
  const query = new URLSearchParams(hash);
  let shouldUpdateUrl = false;

  if (query.has('tab')) {
    const tabIndex = Math.floor(Number(query.get('tab')));
    if (!isNaN(tabIndex)) {
      // 只在真正需要时才切换tab
      const currentTab = Tab.activeIndex;
      if (currentTab !== tabIndex) {
        Tab.show(tabIndex);
      }
      query.delete('tab');
      shouldUpdateUrl = true;
    }
  }

  if (query.has('target')) {
    const targetId = query.get('target');
    const target = document.getElementById(targetId);

    if (target) {
      // 使用requestAnimationFrame优化滚动性能
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth' });

        if (target.classList.contains('mdui-panel-item') &&
          !target.classList.contains('mdui-panel-item-open')) {
          target.click();
        }
      });

      query.delete('target');
      shouldUpdateUrl = true;
    }
  }

  if (shouldUpdateUrl) {
    const newHash = query.toString() ? `#${query.toString()}` : '';
    // 只在真正需要时才更新URL
    if (window.location.hash !== newHash) {
      history.replaceState(null, null, location.pathname + location.search + newHash);
    }
  }
}

/**
 * 初始化Eruda
 */
function initEruda() {
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  const debugMode = new URLSearchParams(location.search).has('debug');
  const debugTip = document.getElementById('debugTip');
  const statusTip = document.getElementById('statusTip');

  if (window.eruda && debugMode) {
    eruda.init();
    console.info('Eruda：启用');

    if (!isLocal && debugTip) {
      console.log('调试：非localhost');
      debugTip.classList.remove('hide');
    } else {
      debugTip.remove();
      statusTip.classList.remove('hide')
    }
  } else {
    debugTip.remove();
    statusTip.remove();
  }
}

/**
 * 显示公告
 * @param {boolean} [forceShow=false] 强制显示公告，忽略哈希检查
 */
async function openNotice(forceShow = false) {
  // 预加载公告内容以提高性能
  const noticeContentPromise = fetchContent('/file/data/notice.html').catch(error => {
    console.error('公告：预加载出错：', error);
    return null;
  });

  const loadingDialog = showLoading();

  try {
    const noticeDoc = await noticeContentPromise;
    if (!noticeDoc) {
      throw new Error('公告内容加载失败');
    }
    
    loadingDialog.close();

    const noticeContent = noticeDoc.body.innerHTML;
    const hashCurrent = hashCode(noticeContent);
    const hashStored = localStorage.getItem('notice_hash');

    const shouldSkipDisplay = !forceShow && (hashStored === hashCurrent);

    if (shouldSkipDisplay) {
      console.log('公告：内容未变，不会显示');
      mdui.snackbar({
        message: `公告：内容未变，不会显示`,
        position: 'right-bottom',
      });
      return;
    }

    const closeHandler = () => console.log('公告：已关闭');

    const dialog = mdui.dialog({
      title: '公告',
      content: noticeContent,
      buttons: [
        {
          text: '不再显示当前公告',
          onClick: () => {
            localStorage.setItem('notice_hash', hashCurrent);
            console.log('公告：不再显示，已存储内容标识');
            return true;
          }
        },
        {
          text: '确认'
        }],
      onOpen: () => mdui.mutation(),
      onClose: closeHandler,
      history: false
    });

    console.log(`公告：${forceShow ? '强制显示' : '显示新内容'}`);

  } catch (error) {
    loadingDialog.close();

    console.error('公告：加载出错：', error);
    mdui.dialog({
      title: '公告：加载出错：',
      content: error.message || error,
      buttons: [{ text: '关闭' }],
      history: false
    });
  }
}

/**
 * 简易哈希函数生成内容标识
 */
function hashCode(str) {
  let hash = 0;
  if (str.length === 0) return '0';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // 转换为32位整数
  }
  return hash.toString(16);
}

/**
 * 彩蛋
 */
function openEgg() {

  mdui.dialog({
    title: '',
    content: '<img src="/file/picture/得意.webp">',
    buttons: [
      {
        text: '关闭'
      }],
    history: false
  });

}

/**
 * 显示封神榜
 */
async function openBlockedIps() {
  try {
    const blockedIps = await fetch('/file/data/blocked_ips.txt');
    if (!blockedIps.ok) {
      console.error("封神榜：加载：HTTP出错：" + blockedIps.status + " " + blockedIps.statusText);
      mdui.dialog({
        title: '封神榜：加载：HTTP出错：',
        content: blockedIps.status + " " + blockedIps.statusText,
        buttons: [
          {
            text: '关闭'
          }],
        history: false
      });
      return;
    }
    const blockedIpsText = (await blockedIps.text()).replace(/\n/g, '<br>');
    mdui.dialog({
      title: '封神榜',
      content: blockedIpsText,
      buttons: [
        {
          text: '关闭'
        }],
      history: false
    });
  } catch (e) {
    console.error("封神榜：加载：出错：" + e);
    mdui.dialog({
      title: '封神榜：加载：出错：',
      content: e,
      buttons: [
        {
          text: '关闭'
        }],
      history: false
    });
  }
}

/**
 * 主题切换
 */
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains('mdui-theme-layout-dark');

  body.classList.toggle('mdui-theme-layout-dark', !isDark);

  localStorage.setItem('theme', isDark ? 'light' : 'dark');

  console.log('主题切换：浅色：' + isDark);
}

/**
 * 加载主题
 */
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;

  if (savedTheme) {
    body.classList.toggle('mdui-theme-layout-dark', savedTheme === 'dark');
    console.log('加载主题：' + savedTheme);
  }
}

// 导出模块内容
export {
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
};