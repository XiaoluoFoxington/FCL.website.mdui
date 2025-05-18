window.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  loadTheme();
  
  var Tab = new mdui.Tab('.mdui-tab');
  
  function hashUnfold() {
    return new Promise(function(resolve, reject) {
      try {
        var hash = location.hash.substring(1);
        if (hash) {
          var target = document.getElementById(hash);
          target.scrollIntoView();
          if (!target.classList.contains('mdui-panel-item-open'))
            target.click();
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };
  
  // tab路由
  if (location.href.split('?').length > 1) {
    var requery = new URLSearchParams(location.href.split('?')[1]);
    if (requery.has('tab')) Tab.show(parseInt(requery.get('tab')));
    hashUnfold().then(function() {
      // 保证地址栏干净(
      history.replaceState(null, null, location.href.split('?')[0]);
    });
  }
  
  openNotice();
});

window.onload = function() {
  document.getElementById('loading').remove(); //移除加载动画
}

/**
 * 显示公告
 */
function openNotice() {
  
  const notice = {
    
    title: '公告',
    
    content: '<p class="typo">求求某些缺德的人补药再滥用我滴流量了（悲</p><p class="typo"><img src="/file/picture/公告.webp"></p>',
    
    buttons: [
    {
      text: '确认'
    }],
    
    history: false
  };
  
  mdui.dialog(notice);
  
}

/**
 * 彩蛋
 */
function openEgg() {
  
  const egg = {
    
    title: '',
    
    content: '<img src="/file/picture/得意.webp">',
    
    buttons: [
    {
      text: '关闭'
    }],
    
    history: false
  };
  
  mdui.dialog(egg);
  
}

/**
 * 主题切换
 */
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('mdui-theme-layout-dark');
    
    body.classList.toggle('mdui-theme-layout-dark', !isDark);
    
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

/**
 * 加载主题
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    
    if (savedTheme) {
        body.classList.toggle('mdui-theme-layout-dark', savedTheme === 'dark');
    }
}