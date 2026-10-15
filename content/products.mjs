export const site = {
  name: "Haru 软件集",
  subtitle: "为认真生活的你，做一点好用的软件。",
  origin: "https://scj040921.github.io",
  base: "/software-hub/",
  author: "scj040921",
  contentReviewedAt: "2026-10-15T00:00:00+08:00",
};

export const products = [
  {
    id: "resume-studio",
    name: "拾简",
    english: "Resume Studio",
    repo: "scj040921/resume-studio",
    icon: "resume-studio.png",
    number: "01",
    category: "效率 · 求职",
    color: "violet",
    tagline: "从一份简历，到下一段旅程。",
    description: "把简历、心仪的岗位和面试准备放在一起，让每一步求职都有条理。",
    platforms: ["Windows", "Android"],
    requirements: "Windows 10 2004 及以上 · x64；Android 8.0 及以上",
    summary: "电脑认真打磨，手机随时准备。",
    detail:
      "在电脑上编辑简历、预览并导出 PDF，在手机上查看资料、准备面试。收藏岗位、跟进投递，再用自己的 WebDAV 服务连接两端。",
    features: [
      {
        icon: "document",
        title: "让内容成为主角",
        text: "多份简历、模块排序与模板预览，支持照片、字体和排版设置。导出 PDF 只包含你实际填写的内容。",
      },
      {
        icon: "briefcase",
        title: "让求职进展有迹可循",
        text: "收藏职位，记录投递时间线，保存简历快照，关联笔试与面试日程，把复盘留给下一次机会。",
      },
      {
        icon: "cards",
        title: "把面试资料变成题卡",
        text: "导入 Markdown、TXT、DOCX 或文字型 PDF，按标题拆题，隐藏答案自测，分别记录记住与未掌握的题目。",
      },
      {
        icon: "sync",
        title: "在自己的设备间继续",
        text: "Windows 与 Android 通过你配置的 WebDAV 同步资料。账号密钥分别留在本机，冲突时由你选择保留方向。",
      },
    ],
    steps: [
      "安装并创建第一份简历",
      "选择模板，完善并预览内容",
      "导出 PDF，记录一次投递",
    ],
    notes: [
      "当前提供 PDF 导出，没有 Word 导出。",
      "AI 优化需要自行配置兼容接口；仅在主动请求时发送相关内容。",
      "WebDAV 同步包以明文保存在你选择的服务器，请使用个人目录。",
    ],
    sourceDocs: [
      "README.md",
      "docs/INSTALLATION.md",
      "docs/ANDROID.md",
      "docs/UPDATES.md",
    ],
  },
  {
    id: "haruphoto",
    name: "Haruphoto",
    english: "Photo Album",
    repo: "scj040921/haruphoto",
    icon: "haruphoto.png",
    number: "02",
    category: "影像 · 整理",
    color: "sage",
    tagline: "让值得记住的瞬间，再次被看见。",
    description:
      "一个属于本机的照片空间。整理、收藏、对比，在照片与地点之间重温生活。",
    platforms: ["Windows"],
    requirements: "Windows 10 1809 及以上 · x64，或 Windows 11 x64",
    summary: "少一点寻找，多一点欣赏。",
    detail:
      "把散落在文件夹里的照片带入同一座图库。用分类、评分和收藏理清线索，再用大图、对比和地图相册，慢慢看见那些熟悉的日常。",
    features: [
      {
        icon: "grid",
        title: "把照片整理成自己的秩序",
        text: "导入文件或文件夹，通过分类、收藏、评分与筛选组织照片，在网格与原比例瀑布流之间选择喜欢的浏览方式。",
      },
      {
        icon: "image",
        title: "给每张照片一点空间",
        text: "大图预览、缩放平移、胶片条与全屏浏览。2–4 张对比选片与同步缩放，让相近的瞬间更容易选择。",
      },
      {
        icon: "map",
        title: "在地图上重温一次出发",
        text: "地图相册支持搜索地名、定位地点和放置照片。照片、地点记录和批注保存在本机；底图与地点搜索需要联网。",
      },
      {
        icon: "heart",
        title: "让日常浏览更合心意",
        text: "浅色与深色主题、外观设置和可关闭的动效。可配置文件夹自动扫描，让新增照片进入自己的整理节奏。",
      },
    ],
    steps: [
      "安装并导入一个照片文件夹",
      "建立分类，收藏喜欢的照片",
      "打开大图或地图，重新发现回忆",
    ],
    notes: [
      "目前仅提供 Windows x64 版，没有 Android 版。",
      "安装器尚未商业代码签名；请从本页官方发行地址下载并核对校验值。",
      "地点搜索会把输入的地名发送给 OpenStreetMap Nominatim，地图底图的地名语言由图块服务决定。",
    ],
    sourceDocs: [
      "README.md",
      "docs/RELEASE_NOTES_v1.3.8.md",
      "docs/UPDATE_CHANNELS.md",
    ],
  },
];
