/**
 * GitHub API 封装 — 使用 GitHub App 创建分支、提交、发起 PR
 *
 * 提交内容写入 docs/contributions/ 文件夹，不碰课程页面
 * PR 显示为 AICompass Bot [bot] 创建
 */
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_APP_ID = process.env.GITHUB_APP_ID;
const GITHUB_APP_PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY;
const GITHUB_APP_INSTALLATION_ID = process.env.GITHUB_APP_INSTALLATION_ID;

function getOctokit() {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: GITHUB_APP_ID,
      privateKey: GITHUB_APP_PRIVATE_KEY,
      installationId: GITHUB_APP_INSTALLATION_ID,
    },
  });
}

/**
 * 创建贡献 PR：
 * 1. 获取 main 最新 commit
 * 2. 创建分支
 * 3. 提交格式化后的 .md 到 docs/contributions/{semester}/
 * 4. 创建 PR
 */
export async function createContributionPR({
  semester,
  courseName,
  fileName,
  markdown,
  rawData,
  contributor,
  contact,
}) {
  const octokit = getOctokit();
  const safeFileName = (fileName || courseName).replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = Date.now();
  const branchName = `contrib/${semester}/${safeFileName}-${timestamp}`;

  // 1. main 最新 commit
  const { data: mainRef } = await octokit.git.getRef({
    owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: "heads/main",
  });

  // 2. 创建分支
  await octokit.git.createRef({
    owner: GITHUB_OWNER, repo: GITHUB_REPO,
    ref: `refs/heads/${branchName}`, sha: mainRef.object.sha,
  });

  // 3. 提交到 contributions 文件夹（不碰课程页）
  const filePath = `docs/contributions/${semester}/${safeFileName}-${timestamp}.md`;
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER, repo: GITHUB_REPO, path: filePath,
    message: `贡献: ${courseName} — ${contributor || "Anonymous"}

Co-Authored-By: AICompass Bot <bot@aicompass.wiki>`,
    content: Buffer.from(markdown).toString("base64"),
    branch: branchName,
  });

  // 4. 创建 PR
  const prBody = buildPRBody({ courseName, semester, contributor, contact, rawData, filePath });

  const { data: pr } = await octokit.pulls.create({
    owner: GITHUB_OWNER, repo: GITHUB_REPO,
    title: `[贡献] ${courseName} — ${contributor || "Anonymous"}`,
    body: prBody, head: branchName, base: "main",
  });

  return { prUrl: pr.html_url, prNumber: pr.number, branch: branchName };
}

function buildPRBody({ courseName, semester, contributor, contact, rawData, filePath }) {
  const files = rawData.files || [];
  const userMarkdown = rawData.markdown || "";

  return `## 📤 ${contributor || "Anonymous"} 的贡献

> 此 PR 由贡献者通过 [AICompass 贡献表单](https://aicompass.wiki/contribute) 提交。
> **欢迎贡献者继续编辑这个 PR！** 你可以直接修改课程页面，把文件链接和内容加进去。

### 📋 基本信息

| 项目 | 内容 |
|------|------|
| **课程** | ${courseName} |
| **学期** | ${semester} |
| **贡献者** | ${contributor || "Anonymous"} |
| **联系方式** | ${contact || "未提供"} |
| **提交时间** | ${rawData.submittedAt || "未知"} |

---

### 📎 你的文件链接

${files.length > 0
  ? files.map((f, i) => `${i + 1}. [${f.name}](${f.ossUrl})`).join("\n")
  : "（未上传文件）"}

---

### 📝 你的留言

${userMarkdown || "（未撰写留言）"}

---

### 接下来可以做什么？

**如果你是贡献者：**
1. 点击上方 \`Files changed\` 标签
2. 找到 \`docs/${semester}/\` 下对应的课程页面进行编辑
3. 把上面的文件链接和留言内容加到课程页面的合适位置
4. 如果课程页面不存在，可以新建一个
5. 编辑完成后提交，维护者会审核

**如果你是维护者：**
1. 审核贡献者的改动
2. 如需补充，直接在 PR 中编辑
3. 确认无误后 **Merge**

---

### 📄 原始提交记录

<details>
<summary>展开</summary>

\`\`\`json
${JSON.stringify(rawData, null, 2)}
\`\`\`

</details>

---
🤖 AICompass Bot · 贡献系统自动创建`;
}
