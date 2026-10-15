# Haru 软件集

拾简 Resume Studio 与 Haruphoto 的独立软件发布网站：产品介绍、正式版 / Nightly 下载、十篇使用教程、更新日志、隐私与反馈入口。

正式地址：<https://scj040921.github.io/haruapps/>

## 本地预览

需要 Node.js 22 或更新版本，无第三方运行依赖，无需 npm install。

```powershell
npm run build
npm run check
npm run preview
```

打开 <http://127.0.0.1:4173/haruapps/>。预览服务器仅监听本机。

## 内容在哪里修改

| 文件                           | 用途                                     |
| ------------------------------ | ---------------------------------------- |
| `content/products.mjs`         | 网站名称、地址、软件介绍、系统要求与功能 |
| `content/guides.mjs`           | 教程分类、正文、步骤与提示               |
| `content/releases.json`        | 官方 GitHub Releases 的最后成功快照      |
| `scripts/build.mjs`            | 共用页面组件与静态页面生成               |
| `assets/style.css`             | 桌面、平板、手机样式                     |
| `assets/app.js`                | 局部导航、页面缓存、筛选搜索与滚动展示   |
| `assets/motion.css`            | 首屏入场、滚动渐入与产品展示舞台         |
| `.github/workflows/deploy.yml` | 构建、检查和 GitHub Pages 部署           |

本地内容改好后重新运行 build 与 check。所有生成文件只写入 `dist/`。

## 页面性能与动态展示

站内链接渐进增强为局部导航：保留页头和底部，只替换正文，同时更新标题、SEO 元数据、导航状态和阅读焦点。支持浏览器前进 / 后退与滚动位置恢复。网络请求失败时回退到普通页面跳转，禁用 JavaScript 仍可直接访问所有静态页面。

页面缓存最多保留 8 份文档；初始页面加载完后，空闲时预取两个导航目标，并在鼠标悬停、键盘聚焦或触摸意图出现时按需预取。省流量与 2G 连接不做自动预取。资源使用内容摘要版本号，跨部署检测到页面版本变化时重新加载，避免混用新旧代码。

首页顶部和软件介绍页提供产品展示区域。首页可点击按钮原地切换软件，保留轻量过渡和桌面悬停透视。展示区使用普通文档布局，没有 sticky 固定停留、额外滚动占位或滚动切换，滚轮始终用于滚动整页。手机同样支持按钮切换；禁用 JavaScript 时直接展示两款软件。系统启用“减少动态效果”时关闭动画，按钮仍可使用。

动效以 opacity / transform 为主，切换页面会清理监听器、观察器与待执行动画。没有引入动画框架、滚动更新循环、自动播放视频或永久运行的渲染循环。

两款图标合计从 1,503,279 字节缩小为 96,494 字节（约减少 94%）。构建检查限制图标总大小低于 120 KB、客户端脚本低于 30 KB，防止重新引入过大的首屏资源。

## 更新软件版本

```powershell
npm run sync
npm run build
npm run check
```

同步脚本只读取两个官方仓库，排除草稿与没有可下载安装包的发行，按实际发布时间选择 Stable 和 Nightly。一次刷新中任一仓库失败都不会覆盖已有快照，也不会部署不完整的版本数据。GitHub API 的资产摘要用于展示 SHA-256；没有摘要时引导用户查看发行方 SHA256SUMS，而不是伪造摘要。

网站不在访客浏览时请求 GitHub API，所以浏览、教程搜索和版本选择不依赖 API 额度。快照日期显示在下载和教程页面。新发行可以等待网站的六小时刷新，或在网站仓库 Actions → Deploy software website → Run workflow 手动立即更新。

## GitHub Pages 上线

1. 将本目录作为独立公开仓库 `scj040921/haruapps`，默认分支为 `main`。
2. 在仓库 Settings → Pages → Build and deployment 选择 GitHub Actions。
3. 推送 main 或手动运行部署工作流。所有检查通过才上传网站并部署。
4. 在 Actions 确认部署成功，再打开正式网址。

网站源码与两款软件的源码、签名、安装包保持独立。部署网站不会发布新软件版本或改变客户端更新渠道。

迁移仓库名、域名或根路径时，先修改 `content/products.mjs` 中的 `site.origin` 与 `site.base`；`scripts/serve.mjs` 的预览前缀也应一并调整，再重建和检查。自定义域名需要自行持有域名并配置 DNS。

## 实现与内容边界

- 静态 HTML / CSS / JavaScript + Node 内置库，无数据库、登录或服务端密钥。
- 浏览器搜索只在本地匹配教程标题、摘要、分类和软件名。
- 下载直接链接官方 GitHub Releases，不经过网站代理；当前没有国内镜像。
- 未加入广告、追踪、访客统计或第三方字体与图片服务。
- 窗口展示是界面示意，使用虚构简历和原创 SVG 风景插画，已明确标注；不是软件实拍截图或用户个人资料。
- 正式版和测试版独立展示。不会将 Nightly 混入正式版下载。
- 无反馈表单假提交；反馈直接进入对应项目 GitHub Issues。
- 此网站不是应用数据云端，不会自动接收应用里的照片或简历。后续有用户系统需求时再接入托管后端。

## 内容来源与维护

拾简：`scj040921/resume-studio` 的 README、安装说明、Android、更新与同步文档。

Haruphoto：`scj040921/haruphoto` 的 README、v1.3.8 发行说明、更新通道说明及源码功能。

教程于 2026-10-15 按上述资料编写。发行版本同步与教程修订是两件事：功能流程变化后应人工更新教程，不能把下载数据刷新误认为教程重新验收。

两款应用图标沿用各自公开仓库的现有图标，仅用于对应软件介绍。站点代码与原创 SVG 插画采用 MIT；软件本身与第三方组件按各自仓库许可分发。

## 功能图文维护（2026-10-15）

两款软件各有四组功能图解，内容维护于 `content/feature-stories.mjs`，图解由 `scripts/feature-visuals.mjs` 输出，样式位于 `assets/features.css`。首页功能入口直达对应介绍，配图明确标注示意与虚构内容，不包含私人照片或简历。

Haruphoto 图标已采用官方提交 `62be2b36c8a0c9ee4fbbba4fbc0a8af64142184b` 的 `Assets/AppIcon.png`（256 × 256，45,388 字节），SHA-256 为 `D5E7FB53B2F463E0FB05EF9F6B8C8CAC92643530DEB87DD516B094C112CD12FB`。
