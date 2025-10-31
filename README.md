# 注意

此网站已重制，此版本将不会有任何内容更改。

[XiaoluoFoxington/FCL.website.NEXT](https://github.com/XiaoluoFoxington/FCL.website.NEXT)

# FCL.website.mdui

## 项目介绍

项目网站：[https://mdui.foldcraftlauncher.cn](https://mdui.foldcraftlauncher.cn)。

这里是由玩家社区自行搭建的[《Fold Craft Launcher》](https://github.com/FCL-Team/FoldCraftLauncher)非官方公益下载站，可以在这里下载到FCL的最新发行版、全部旧版本、ZL最新发行版、ZL部分旧版本、插件、驱动、Java和Pojav FFmpeg Plugin。

这是一个静态网站，不需要后端。使用MDUI样式。适合部署在任意静态托管服务上。

此项目有个旧版样式，由于被太多人吐槽难看于是弃用了：[fcl-docs/FCL.website](https://github.com/fcl-docs/FCL.website)。

洛狐对“现代化审美”的一些看法：[https://old.foldcraftlauncher.cn/page/other/perfect](https://old.foldcraftlauncher.cn/page/other/perfect)。

## 项目特点

- 烂大街的MDUI
- 随意命名的变量/函数
- 不务正业地塞彩蛋
- 能跑就行的脚本
- 站长没电脑被迫用手机开发调试的 `eruda.js`
- 站长没钱怕有人滥用而加的 `gt4.js`

## 项目结构

```
.
├── 404.html          # 404页面
├── css/              # 样式
├── file              # 静态小文件
│   ├── avatar/       # 贡献者头像
│   ├── data/         # 单独拎出来加载的页面数据
│   └── ...
├── index.html        # 主页
├── js                # 脚本
│   ├── DoNotClick.js # “千万别点”彩蛋事件
│   ├── index.js      # 主脚本
│   ├── lib/          # 三方库
│   └── ...
└── ...
```

## ~~贡献项目~~ 规则怪谈

~~有这功夫，还不如直接赞助呢（（（~~

### 赞助

![微信赞赏码](/file/picture/微信赞赏码.png)

### JavaScript 规范

- ~~所有函数必须使用 `function` 关键字定义。~~

- 所有函数需附带JSDoc注释。

### 提交规范

采用“渐进式”提交消息：

```
类型：范围：具体内容
```

可用的类型：

| 类型 | 解释 | 举例 |
| --- | --- | --- |
| 内容 | 文本内容修改 | 内容：介绍：修改内容 |
| 样式 | 样式修改 | 样式：微调：工具栏 |
| 功能 | 新功能开发 | 功能：“加载中”提示 |
| 优化 | 性能体验改进 | 优化：内容：下载：单独加载 |
| 修复 | BUG修复 | 修复：内容：关于：缩进错误 |