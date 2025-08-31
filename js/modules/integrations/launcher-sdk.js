/**
 * Launcher SDK 模块
 */

// 从外部加载Launcher SDK
// 浏览器引入 SDK：
// <script src="https://launcher-mirror.zeart.ink/static/launcher-sdk.js"></script>
// 简单调用示例：
// Launcher.getAll().then(console.log);
// Launcher.getByRepo('PojavLauncher').then(console.log);
// Launcher.searchByName('arm64').then(console.log);
// 返回结构示例：
// [
//   {
//     "repo": "PojavLauncher",
//     "tag": "gladiolus",
//     "name": "PojavLauncher.apk",
//     "size": 154187535,
//     "url": "https://pub-0927e5a904734942a47891c9d65b96eb.r2.dev/PojavLauncher/gladiolus/PojavLauncher.apk"
//   }
// ]

// 创建一个 Promise 来处理异步加载的 Launcher SDK
const launcherPromise = new Promise((resolve, reject) => {
  // 检查 Launcher 是否已经存在
  if (typeof Launcher !== 'undefined') {
    resolve(Launcher);
  } else {
    // 监听 Launcher SDK 加载完成事件
    const checkLauncher = () => {
      if (typeof Launcher !== 'undefined') {
        resolve(Launcher);
      } else {
        // 如果还没加载完成，继续检查
        setTimeout(checkLauncher, 100);
      }
    };
    
    // 开始检查
    checkLauncher();
    
    // 设置超时时间（5秒）
    setTimeout(() => {
      if (typeof Launcher === 'undefined') {
        reject(new Error('Launcher SDK 加载超时'));
      }
    }, 5000);
  }
});

// 导出模块内容
export { launcherPromise as Launcher };