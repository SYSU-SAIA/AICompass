---
hide:
  - navigation
  - toc
---

<div class="hero-section">
    <div class="hero-content">
        <h1>AICompass</h1>
        <p class="hero-subtitle">分享信息经验，共享学习资源</p>
        <div class="button-container">
            <a href="ContributionGuidelines" class="cta-button">贡献指南</a>
            <a href="important-source" class="cta-button">友链&致谢</a>
        </div>
    </div>
</div>

<div class="main-content">
    <div class="section-title">
        <h2>课程资源汇总</h2>
        <p>!竖屏打开时：点开左上角‘三条横线’进入目录</p>
    </div>

<div class="course-navigation">
    <div class="course-track">
        <h3>第一学年</h3>
        <div class="semester-row">
            <a href="FirstYear_1/Calculus/" class="course-link">
                <span class="semester">大一上学期</span>
                <span class="course-list">高等数学I、线性代数、大学物理上、程序设计I等</span>
            </a>
            <a href="FirstYear_2/Calculus/" class="course-link">
                <span class="semester">大一下学期</span>
                <span class="course-list">高等数学II、大学物理下、程序设计II、数字电路等</span>
            </a>
        </div>
    </div>

    <div class="course-track">
        <h3>第二学年</h3>
        <div class="semester-row">
            <a href="SecondYear_1/DataStructuresAndAlgorithms/" class="course-link">
                <span class="semester">大二上学期</span>
                <span class="course-list">概率统计、离散数学、信号与系统、数据结构与算法</span>
            </a>
            <a href="SecondYear_2/ArtificialIntelligence" class="course-link">
                <span class="semester">大二下学期</span>
                <span class="course-list">人工智能原理、机器人原理等</span>
            </a>
        </div>
    </div>

    <div class="course-track">
        <h3>第三学年</h3>
        <div class="semester-row">
            <a href="ThirdYear_1/OperatingSystems" class="course-link">
                <span class="semester">大三上学期</span>
                <span class="course-list">操作系统、机器学习等</span>
            </a>
            <a href="ThirdYear_2/Robotics" class="course-link">
                <span class="semester">大三下学期</span>
                <span class="course-list">TODO</span>
            </a>
        </div>
    </div>
</div>

<style>
    .button-container {
        display: flex;
        justify-content: center;
        gap: 20px; /* 您可以调整这个值来改变按钮间的间距 */
    }

    .semester-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }

    .course-link {
        flex: 1;
        background: var(--md-code-bg-color);
        border-radius: 8px;
        padding: 20px;
        text-decoration: none;
        color: var(--md-typeset-color);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
    }

    .course-link:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .semester {
        display: block;
        font-weight: bold;
        margin-bottom: 8px;
        color: var(--md-accent-fg-color);
    }

    .course-list {
        color: var(--md-typeset-color);
        line-height: 1.5;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
        .semester-row {
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .course-link {
            margin-bottom: 0;
        }
    }

    [data-md-color-scheme="slate"] .course-link {
        border: 1px solid rgba(255,255,255,0.1);
    }
</style>
    <div class="features-section">
        <div class="feature">
            <h3>📚 科研&升学</h3>
            <p>科研上手指南与保研、考研、升学规划</p>
            <a href="ResearcherGuide/" class="feature-link">浏览</a>
        </div>
        <div class="feature">
            <h3>💻 实习&就业</h3>
            <p>本科实习就业指南与经验</p>
            <a href="Work/" class="feature-link">浏览</a>
        </div>
        <div class="feature">
            <h3>🤝 参与贡献</h3>
            <p>欢迎为这个项目贡献你的力量</p>
            <a href="ContributionGuidelines/" class="feature-link">了解更多</a>
        </div>
    </div>
</div>

<div class="contact-section">
  <h2>仓库地址与联系邮件</h2>
  <p>欢迎贡献和issue</p>
  <div class="contact-info">
    <p class="repo-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
      <a href="https://github.com/SYSU-SAIA/AICompass" target="_blank" rel="noopener noreferrer">https://github.com/SYSU-SAIA/AICompass</a>
    </p>
    <p class="contact-email">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
      cuikq&#64;mail2&#46;sysu&#46;edu&#46;cn
    </p>
  </div>
</div>

<style>
  .contact-section {
    padding: 1.5rem;
    border-radius: 8px;
    background-color: #f8f9fa;
    margin: 1.5rem auto;
    max-width: 600px;
    text-align: center;
    font-size: 0.9rem;
  }

  .contact-section h2 {
    color: #333;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    align-items: center;
  }

  .repo-link, .contact-email {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0;
  }

  .repo-link a {
    color: #0366d6;
    text-decoration: none;
  }

  .repo-link a:hover {
    text-decoration: underline;
  }

  svg {
    vertical-align: middle;
  }
</style>