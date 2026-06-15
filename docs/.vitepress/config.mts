import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'AICompass',
  titleTemplate: ':title · AICompass',
  description: '中山大学人工智能学院课程资源共享平台',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap' }],
  ],

  // Theme config
  themeConfig: {
    logo: { src: '/logo.svg', width: 24, height: 24 },

    // Top navigation
    nav: [
      { text: '首页', link: '/' },
      { text: '课程资源', link: '/FirstYear_1/Calculus' },
      {
        text: '科研 & 升学',
        items: [
          { text: '科研入门指南', link: '/ResearcherGuide/' },
        ]
      },
      {
        text: '实习 & 就业',
        items: [
          { text: '实习就业指南', link: '/Work/' },
        ]
      },
      { text: '贡献指南', link: '/ContributionGuidelines' },
      { text: '致谢 & 友链', link: '/important-source' },
    ],

    // Sidebar - global course navigation visible from all pages
    sidebar: {
      '/': [
      {
        text: '📘 大一上学期',
        collapsed: false,
        items: [
          { text: '程序设计I', link: '/FirstYear_1/Programming' },
          { text: '高等数学I', link: '/FirstYear_1/Calculus' },
          { text: '线性代数', link: '/FirstYear_1/LinearAlgebra' },
          { text: '大学物理上', link: '/FirstYear_1/CollegePhysics' },
        ]
      },
      {
        text: '📗 大一下学期',
        collapsed: true,
        items: [
          { text: '程序设计II', link: '/FirstYear_2/Programming' },
          { text: '高等数学II', link: '/FirstYear_2/Calculus' },
          { text: '大学物理下', link: '/FirstYear_2/CollegePhysics' },
          { text: '数字电路', link: '/FirstYear_2/DigitalCircuitsAndLogicDesign' },
          { text: '大学物理实验', link: '/FirstYear_2/PhysicsLab' },
        ]
      },
      {
        text: '📙 大二上学期',
        collapsed: true,
        items: [
          { text: '数据结构与算法', link: '/SecondYear_1/DataStructuresAndAlgorithms' },
          { text: '概率统计', link: '/SecondYear_1/ProbabilityAndStatistics' },
          { text: '离散数学', link: '/SecondYear_1/DiscreteMath' },
          { text: '信号与系统', link: '/SecondYear_1/SignalsAndSystems' },
          { text: '高级语言程序设计', link: '/SecondYear_1/Python' },
        ]
      },
      {
        text: '📕 大二下学期',
        collapsed: true,
        items: [
          { text: '人工智能原理', link: '/SecondYear_2/ArtificialIntelligence' },
          { text: '机器人原理', link: '/SecondYear_2/Robotics' },
          { text: '贝叶斯', link: '/SecondYear_2/Bayes' },
          { text: '计算机组成原理', link: '/SecondYear_2/ComputerOrganization' },
          { text: '复变函数', link: '/SecondYear_2/Complex' },
          { text: '博弈论', link: '/SecondYear_2/GameTheory' },
        ]
      },
      {
        text: '📓 大三上学期',
        collapsed: true,
        items: [
          { text: '操作系统', link: '/ThirdYear_1/OperatingSystems' },
          { text: '数据库系统', link: '/ThirdYear_1/DatabaseSystems' },
          { text: '计算机网络', link: '/ThirdYear_1/ComputerNetworks' },
          { text: '数值计算', link: '/ThirdYear_1/NumericalMethods' },
          { text: '机器学习', link: '/ThirdYear_1/MachineLearning' },
          { text: '人机交互设计', link: '/ThirdYear_1/HCI' },
          { text: '数字信号处理', link: '/ThirdYear_1/DigitalSignalProcessing' },
        ]
      },
      {
        text: '📔 大三下学期',
        collapsed: true,
        items: [
          { text: '智能机器人', link: '/ThirdYear_2/Robotics' },
        ]
      },
      {
        text: '🎓 科研 & 升学',
        collapsed: true,
        items: [
          { text: '科研入门指南', link: '/ResearcherGuide/' },
        ]
      },
      {
        text: '💼 实习 & 就业',
        collapsed: true,
        items: [
          { text: '实习就业指南', link: '/Work/' },
        ]
      },
      ],
    },

    // Social links (shown in nav)
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SYSU-SAIA/AICompass' }
    ],

    // Footer
    footer: {
      message: '中山大学人工智能学院 · 学生共建',
      copyright: 'AICompass 团队'
    },

    // Search
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索课程',
            buttonAriaLabel: '搜索课程资源'
          },
          modal: {
            displayDetails: '显示详情',
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除搜索',
            footer: {
              selectText: '选择',
              closeText: '关闭',
              navigateText: '切换',
            }
          }
        }
      }
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/SYSU-SAIA/AICompass/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // Last updated
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      }
    },

    // Doc footer
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // Outline (right sidebar TOC)
    outline: {
      label: '本页目录',
      level: [2, 3],
    },

    // Dark mode
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
  },

  // Markdown extensions
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '信息',
      detailsLabel: '详情'
    },
    image: {
      lazyLoading: true,
    },
  },

  // Ignore localhost links during build
  ignoreDeadLinks: true,

  // Vite config
  vite: {
    server: {
      port: 5173,
    },
  },
})
