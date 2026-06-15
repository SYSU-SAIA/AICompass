---
title: 提交贡献
description: 向 AICompass 贡献课程资源与学习经验
layout: page
---

# 提交贡献

<ContributionForm />

<div class="contribute-tips">

### 💡 温馨提示

- **署名** 会出现在 PR 和课程页底部
- **文件** 存储在阿里云 OSS，通过链接引用，不会进入 Git 仓库
- **你的留言和文件** 会原样提交为 PR，审核者直接看到你的原文
- 审核通过后由维护者手动合并到对应课程页面
- Markdown 窗口完全自由书写，不需要按模板填

</div>

<style scoped>
.contribute-tips {
  margin-top: 3rem;
  padding: 1.5rem 1.75rem;
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.contribute-tips h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.85rem;
  margin-top: 0;
}

.contribute-tips ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contribute-tips ul li {
  position: relative;
  padding-left: 1.4em;
  margin-bottom: 0.5rem;
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.contribute-tips ul li::before {
  content: '';
  position: absolute;
  left: 0.2em;
  top: 0.65em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  opacity: 0.5;
}
</style>
