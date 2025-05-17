window.addEventListener('DOMContentLoaded', function() {
  'use strict';
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
  document.getElementById('loading').remove();
}

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