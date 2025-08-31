/**
 * 网络请求模块
 */

// 缓存已获取的内容以避免重复请求
const contentCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

/**
 * 获取页面：从指定URL获取HTML内容
 * @async
 * @param {string} url - 请求的URL地址
 * @returns {Promise<Document>} HTML文档对象
 * @throws {Error} 当网络请求失败、响应状态非200或解析失败时抛出错误
 */
async function fetchContent(url) {
  console.log(`获取页面：${url}`);

  // 检查缓存
  if (contentCache.has(url)) {
    const cached = contentCache.get(url);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`获取页面：${url} (缓存)`);
      return cached.data;
    } else {
      // 缓存过期，删除
      contentCache.delete(url);
    }
  }

  const response = await fetch(url, {
    // 添加请求优化
    cache: 'force-cache',
    headers: {
      'Accept': 'text/html'
    }
  });
  
  if (!response.ok) {
    throw new Error(`获取页面：HTTP出错：${response.status} ${response.statusText}`);
  }

  try {
    const html = await response.text();
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(html, 'text/html');
    
    // 缓存结果
    contentCache.set(url, {
      data: doc,
      timestamp: Date.now()
    });
    
    return doc;
  } catch (error) {
    throw new Error(`获取页面：HTML解析出错：${error.message}`);
  }
}

// 导出模块内容
export { fetchContent };