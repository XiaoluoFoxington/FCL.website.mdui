window.addEventListener('DOMContentLoaded', function() {
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
  
  // openNotice();
});

window.onload = function() {
  document.getElementById('loading').remove();
}

function openNotice() {
  mdui.alert('直链流量费用高昂，请不要滥用，目前下载站一直在亏损，我们除了赞助外无任何收益，属于公益性质。如果您条件允许，可以考虑赞助站长（当然不赞助也能下）', '公告');
}

function openEgg() {
  mdui.alert('<img src="/file/picture/得意.webp">')
}