// Code-native illustrations, not screenshots: no private resume/photo data or external image services.
export function featureVisual(kind, { landscape, icon }) {
  const tile = (index, label = "") =>
    `<div class="visual-photo">${landscape(index)}${label ? `<span>${label}</span>` : ""}</div>`;
  const bar = (width = "100%") =>
    `<i class="visual-line" style="width:${width}"></i>`;
  const paper = (variant, label) =>
    `<div class="template-option"><div class="template-sheet template-${variant}"><div class="template-name">林同学</div><small>软件工程师 · 示例简历</small><div class="template-rule"></div>${["教育经历", "项目经历", "专业技能"].map((title, i) => `<div class="template-block"><b>${title}</b>${bar()}${bar(i === 1 ? "88%" : "70%")}${i === 1 ? bar("80%") : ""}</div>`).join("")}</div><span>${label}</span></div>`;
  switch (kind) {
    case "templates":
      return `<div class="visual-toolbar"><span>${icon("document")}选择适合岗位的表达</span><span class="visual-badge">PDF 导出</span></div><div class="visual-templates">${paper("simple", "简洁清晰")}${paper("accent", "模块有序")}${paper("photo", "照片版式")}</div><div class="visual-bottom"><span>${icon("check")}内容由你填写</span><span>${icon("check")}预览后再导出</span></div>`;
    case "applications":
      return `<div class="visual-toolbar"><span>${icon("briefcase")}一次机会，一条清晰的线索</span><span class="visual-badge">示例流程</span></div><div class="application-steps">${[
        ["01", "收藏岗位", "示例公司 A", "软件工程师", "保留职位要求与备注"],
        ["02", "记录投递", "简历版本 A", "已投递", "保存当时的简历快照"],
        ["03", "准备面试", "下一次安排", "待准备", "关联日程与复盘"],
      ]
        .map(
          ([n, title, name, status, note]) =>
            `<div class="application-step"><span class="step-dot">${n}</span><b>${title}</b><div class="sample-job"><span>${name}</span><strong>${status}</strong>${bar()}${bar("65%")}</div><small>${note}</small></div>`,
        )
        .join(
          "",
        )}</div><div class="visual-note">从岗位线索到面试准备，把每一步留在自己的记录里。</div>`;
    case "interview":
      return `<div class="visual-toolbar"><span>${icon("cards")}面试题卡</span><span class="visual-badge">示例题库</span></div><div class="quiz-preview"><div class="quiz-categories"><span>全部题目</span><span class="current">未掌握</span><span>已记住</span></div><div class="quiz-paper"><div class="quiz-eyebrow">C 语言基础 <span>01 / 12 · 示例</span></div><strong>指针与数组，<br>有什么区别？</strong><div class="quiz-answer">先独立回忆，再展开答案核对。<div>${bar()}${bar("80%")}${bar("62%")}</div></div><div class="quiz-status"><span>再练一次</span><span>已记住 ${icon("check")}</span></div></div></div>`;
    case "sync":
      return `<div class="visual-toolbar"><span>${icon("sync")}让准备在另一台设备上继续</span></div><div class="sync-illustration"><div class="desktop-device"><div class="device-screen"><span>Windows</span><b>我的简历</b>${bar()}${bar("75%")}<div class="device-module">项目经历</div>${bar()}${bar("70%")}</div><i></i></div><div class="sync-path"><span>检查并同步</span><div>${icon("sync")}</div><b>你的 WebDAV</b><small>个人同步目录</small></div><div class="phone-device"><div class="phone-speaker"></div><span>Android</span><b>随时准备</b><div>简历</div><div>面试题库</div><div>我的求职</div></div></div><div class="visual-note">先在一端同步，再到另一端继续；双方都修改时需确认保留方向。</div>`;
    case "library":
      return `<div class="visual-toolbar"><span>${icon("grid")}我的图库</span><span class="visual-badge">分类 · 收藏 · 评分</span></div><div class="library-illustration"><aside><b>我的分类</b><span class="current">旅行</span><span>日常</span><span>家人</span><small>${icon("heart")}我的收藏</small></aside><div class="library-content"><div class="library-filters"><span>文件名搜索</span><span>按评分排序 ↓</span></div><div class="visual-photo-grid">${["山海之间", "日落之后", "向远处看", "林间散步", "海边一天", "温柔时刻"].map((label, i) => tile(i, label)).join("")}</div><div class="library-stars">${icon("heart")}收藏喜欢的瞬间 <span>★★★★★</span></div></div></div>`;
    case "compare":
      return `<div class="visual-toolbar"><span>${icon("image")}对比选片</span><span class="visual-badge">2–4 张 · 同步缩放</span></div><div class="compare-illustration"><div>${tile(0)}<span>照片 A <small>构图与层次</small></span></div><div>${tile(4)}<span>照片 B <small>焦点与细节</small></span></div></div><div class="comparison-zoom"><span>适应窗口</span><span class="current">${icon("sync")}同步缩放</span><span>看整体，也看细节</span></div><div class="visual-filmstrip">${[0, 4, 2, 3, 5].map((i) => tile(i)).join("")}</div>`;
    case "map":
      return `<div class="visual-toolbar"><span>${icon("map")}地图相册</span><span class="visual-badge">地点关联示意</span></div><div class="map-illustration"><svg class="illustrated-map" viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="600" height="340" fill="#e5eadb"/><path d="M-40 70Q120 180 245 74T650 170M-40 270Q100 160 265 267T650 240" fill="none" stroke="#d4ddc5" stroke-width="65"/><path d="M-40 90Q180 50 260 190T650 245" fill="none" stroke="#b6d2d2" stroke-width="45"/><path d="M0 205 600 90M70 0 190 340M390 0 420 340M0 300 600 185" stroke="#fcfcf4" stroke-width="11"/><path d="M0 205 600 90M70 0 190 340M390 0 420 340M0 300 600 185" stroke="#d4d7c6" stroke-width="1"/><circle cx="125" cy="130" r="34" fill="#bdcfa9"/><circle cx="455" cy="235" r="45" fill="#c1d1ae"/></svg><div class="map-search">${icon("search")}输入地点，回车后搜索</div><div class="map-pin pin-one">${tile(0)}<span>旅行地点 A</span></div><div class="map-pin pin-two">${tile(3)}<span>旅行地点 B</span></div><div class="map-local">${icon("shield")}照片、地点和批注保存在本机</div></div>`;
    case "appearance":
      return `<div class="visual-toolbar"><span>${icon("heart")}适合自己的浏览方式</span><span class="visual-badge">浅色 / 深色 / 跟随系统</span></div><div class="theme-illustration">${["light", "dark"].map((theme, i) => `<div class="theme-pane ${theme}"><div><b>Haruphoto</b><span>${i ? "深色" : "浅色"}</span></div><div class="theme-grid">${[0, 1, 3, 4].map((n) => tile(n)).join("")}</div><small>${i ? "夜晚，慢慢欣赏" : "白天，轻松整理"}</small></div>`).join("")}</div><div class="visual-bottom"><span>${icon("grid")}网格 / 瀑布流</span><span>${icon("sync")}按需设置自动扫描</span></div>`;
    default:
      throw new Error(`Unknown feature visual: ${kind}`);
  }
}
