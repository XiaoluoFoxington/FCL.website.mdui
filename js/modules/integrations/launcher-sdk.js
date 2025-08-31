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

// 动态加载外部Launcher SDK
let Launcher;

// 检查是否在浏览器环境中
if (typeof window !== 'undefined') {
  // 创建script标签来加载外部SDK
  const script = document.createElement('script');
  script.src = 'https://launcher-mirror.zeart.ink/static/launcher-sdk.js';
  script.async = true;
  
  // 将script标签添加到页面中
  document.head.appendChild(script);
  
  // 等待脚本加载完成
  script.onload = () => {
    // 从window对象中获取Launcher
    Launcher = window.Launcher;
  };
  
  // 处理加载错误
  script.onerror = (error) => {
    console.error('Failed to load Launcher SDK:', error);
  };
}

// 导出模块内容
export { Launcher };