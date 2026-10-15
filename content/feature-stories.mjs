// Website illustrations explain actual features with fictional sample content.
export const featureStories = {
  "resume-studio": [
    {
      id: "resume",
      label: "简历与 PDF",
      icon: "document",
      visual: "templates",
      kicker: "WRITE · ARRANGE · EXPORT",
      title: "一份经历，找到适合自己的表达。",
      description:
        "先把经历写清楚，再决定它如何呈现。多份简历、模块排序和模板预览，让你为不同岗位保留独立的准备，而不是反复覆盖同一个文件。",
      points: [
        [
          "内容与版式一起打磨",
          "设置照片、字体、字号、行距和强调色，按需要移动或隐藏模块。",
        ],
        [
          "示例帮你理解，实际内容由你填写",
          "模板中的示例用于预览，导出前检查实际内容、分页和联系方式。",
        ],
        [
          "把投递版本留住",
          "导出 PDF，结合历史版本和投递快照，回看自己当时发出的内容。",
        ],
      ],
      guide: "resume-pdf",
      guideLabel: "查看简历编辑与 PDF 导出教程",
      caption: "版式功能示意 · 虚构简历与简化模板，非应用截图",
    },
    {
      id: "applications",
      label: "岗位与投递",
      icon: "briefcase",
      visual: "applications",
      kicker: "SAVE · FOLLOW UP · REVIEW",
      title: "心仪的岗位，不再散落在聊天和网页里。",
      description:
        "把职位线索、投递记录与后续安排放进同一条求职路径。准备面试时，可以回到岗位要求，也能找到那次投递关联的简历内容。",
      points: [
        [
          "收藏具体职位",
          "通过链接、分享文本或内置浏览器手动收藏；重复收藏时保留已写好的备注。",
        ],
        [
          "记下进展与安排",
          "记录投递时间线，关联笔试、面试或截止日程，减少来回查找。",
        ],
        [
          "给下一次留一点经验",
          "保留简历快照和复盘记录，回顾每次机会中的收获。",
        ],
      ],
      guide: "resume-install",
      guideLabel: "从安装和创建第一份简历开始",
      caption: "求职流程示意 · 虚构岗位与示例状态，非应用截图",
    },
    {
      id: "interview",
      label: "面试题卡",
      icon: "cards",
      visual: "interview",
      kicker: "IMPORT · RECALL · REPEAT",
      title: "从“看过了”，到真的能回答。",
      description:
        "把长篇资料拆成一道道题，每次专注一个问题。先尝试回忆，再核对答案，用掌握标记决定下一轮该练什么。",
      points: [
        [
          "沿着标题拆分题目",
          "支持 Markdown、TXT、DOCX 与文字型 PDF，导入前选择标题层级并预览。",
        ],
        [
          "隐藏答案，主动回忆",
          "逐题阅读，通过点击、滚轮或方向键切题，按自己的节奏练习。",
        ],
        [
          "把时间留给薄弱部分",
          "分别记录已记住与未掌握，筛选需要再次复习的问题。",
        ],
      ],
      guide: "resume-interview",
      guideLabel: "查看题库导入与背诵教程",
      caption: "题卡功能示意 · 示例题目，非应用截图",
    },
    {
      id: "sync",
      label: "跨端同步",
      icon: "sync",
      visual: "sync",
      kicker: "WINDOWS + ANDROID",
      title: "电脑上认真打磨，手机上随时准备。",
      description:
        "在电脑上完成排版，在手机上查看简历、收藏和面试资料。使用你配置的 WebDAV 连接两端，资料存放的服务由你选择。",
      points: [
        [
          "准备同一个实际目录",
          "电脑和手机分别配置地址、用户名与应用密码，先从资料完整的一端同步。",
        ],
        [
          "一端结束，再到另一端继续",
          "同步以整套资料替换为主，两端都修改时需要明确选择保留方向。",
        ],
        [
          "知道哪些会同步",
          "简历、照片、收藏、日程和题库可同步；Cookie、密钥、密码与导出的 PDF 不随包上传。",
        ],
      ],
      guide: "resume-sync",
      guideLabel: "查看首次 WebDAV 同步教程",
      caption: "跨端同步关系示意 · 需自行配置 WebDAV，并非实时协同编辑",
    },
  ],
  haruphoto: [
    {
      id: "library",
      label: "分类与收藏",
      icon: "grid",
      visual: "library",
      kicker: "IMPORT · ORGANIZE · REDISCOVER",
      title: "从散落的文件夹，到有自己的秩序。",
      description:
        "先导入熟悉的一组照片，再慢慢整理。文件名搜索、分类、收藏和评分可以搭配使用，让“那张照片放在哪儿”更容易有答案。",
      points: [
        [
          "从文件或文件夹开始",
          "支持多选图片，也可以导入文件夹并扫描其中的照片。",
        ],
        [
          "给照片加上自己的线索",
          "建立旅行、家人等分类，用收藏和 1–5 星评分表达偏好。",
        ],
        [
          "按合适的方式浏览",
          "选择规整网格或原比例瀑布流，结合筛选和排序，专注当前这组内容。",
        ],
      ],
      guide: "haruphoto-library",
      guideLabel: "查看导入、分类和图库整理教程",
      caption: "图库整理功能示意 · 原创风景插画，非应用截图",
    },
    {
      id: "viewer",
      label: "大图与对比",
      icon: "image",
      visual: "compare",
      kicker: "LOOK CLOSER · CHOOSE SLOWLY",
      title: "相近的瞬间，放在一起慢慢选。",
      description:
        "看完整构图，也看清那些微小的不同。大图预览和对比选片，让相近的照片不必依靠记忆来回比较。",
      points: [
        [
          "让一张照片占据视线",
          "通过大图、缩放平移、全屏与底部胶片条，按自己的节奏欣赏。",
        ],
        [
          "同时比较 2–4 张",
          "用对比选片和同步缩放查看相近区域，比较构图、焦点和细节。",
        ],
        [
          "留下更愿意重看的那张",
          "选片后结合收藏和评分回到图库，让下一次回顾更容易。",
        ],
      ],
      guide: "haruphoto-viewer",
      guideLabel: "查看大图浏览与对比选片教程",
      caption: "双图对比功能示意 · 原创风景插画，非应用截图",
    },
    {
      id: "map",
      label: "地图相册",
      icon: "map",
      visual: "map",
      kicker: "EVERY MEMORY HAS A PLACE",
      title: "把照片，放回记忆发生的地方。",
      description:
        "当地点也成为线索，一次出发就有了另一种回顾方式。搜索地名、定位地图，再为一组照片保存地点与批注。",
      points: [
        [
          "按需要搜索地点",
          "输入地名后按回车或点击搜索提交，从结果中选择合适的位置。",
        ],
        [
          "放置照片，留下记录",
          "核对预览中的照片批次，将照片与地点组织在一起。",
        ],
        [
          "分清本机记录与在线服务",
          "照片、地点和批注留在本机；底图与地名搜索需要联网，搜索词发送给 Nominatim。",
        ],
      ],
      guide: "haruphoto-map",
      guideLabel: "查看地点搜索与地图相册教程",
      caption: "照片与地点关系示意 · 原创示意地图，不代表真实地理位置",
    },
    {
      id: "appearance",
      label: "主题与扫描",
      icon: "heart",
      visual: "appearance",
      kicker: "YOUR PHOTOS · YOUR PACE",
      title: "打开图库，也打开自己的浏览节奏。",
      description:
        "白天整理，晚上欣赏。选择舒适的主题和布局，把整理方式慢慢调成自己的习惯，让工具服务照片。",
      points: [
        ["选择舒服的主题", "支持浅色、深色与跟随系统，可配置外观方案和动效。"],
        [
          "让新增照片接上整理节奏",
          "按需要配置文件夹自动扫描，也可以关闭监控后手动导入。",
        ],
        [
          "更新由自己确认",
          "在设置中检查正式版或 Nightly，确认后下载更新，程序会校验安装资源。",
        ],
      ],
      guide: "haruphoto-install",
      guideLabel: "查看安装、升级与版本选择说明",
      caption: "浅色与深色浏览功能示意 · 原创插画，非应用截图",
    },
  ],
};
