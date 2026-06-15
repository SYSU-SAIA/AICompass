/**
 * 纯格式化 — 把表单数据转成 contributions/ 目录下的 .md 文件
 * 不再调用 AI，不再分析差异、不再生成页面、不再合并内容
 */
export function formatSubmission({
  courseName,
  userMarkdown,
  files,
  contributor,
  contact,
  semester,
  submittedAt,
}) {
  const lines = [];

  lines.push(`# [贡献] ${courseName} — ${contributor || "Anonymous"}`);
  lines.push("");
  lines.push("| 项目 | 内容 |");
  lines.push("|------|------|");
  lines.push(`| **提交时间** | ${submittedAt || new Date().toISOString()} |`);
  lines.push(`| **学期** | ${semester} |`);
  lines.push(`| **贡献者** | ${contributor || "Anonymous"} |`);
  if (contact) lines.push(`| **联系方式** | ${contact} |`);
  lines.push("");

  if (userMarkdown?.trim()) {
    lines.push("## 📝 用户留言");
    lines.push("");
    lines.push(userMarkdown.trim());
    lines.push("");
  }

  if (files?.length > 0) {
    lines.push("## 📎 上传文件");
    lines.push("");
    for (const f of files) {
      lines.push(`- [${f.name}](${f.ossUrl})`);
    }
    lines.push("");
  }

  if (!userMarkdown?.trim() && !files?.length) {
    lines.push("<!-- 空提交 -->");
    lines.push("");
  }

  lines.push("---");
  lines.push("> 此文件由 AICompass 贡献系统自动生成，待人工审核合并到对应课程页面。");

  return lines.join("\n");
}
