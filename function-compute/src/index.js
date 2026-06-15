/**
 * AICompass 贡献处理函数 — 主入口
 *
 * 路由:
 *   POST /signature  → OSS 直传签名
 *   POST /submit     → 格式化表单 → 创建 PR 到 docs/contributions/
 *   OPTIONS *        → CORS 预检
 *
 * Agent 不再分析差异、不合并内容、不写课程页面。
 * 只做一件事：把用户的表单原样整理为 .md，提交 PR，等人审核。
 */
import { generateUploadSignature, buildUploadDir } from "./oss.js";
import { formatSubmission } from "./polish.js";
import { createContributionPR } from "./github.js";

const SHARED_SECRET = process.env.SHARED_SECRET;

const ALLOWED_ORIGINS = [
  "https://aicompass.wiki",
  "https://sysu-saia.github.io",
  "http://localhost:5173",
];

function route(path, method) {
  if (method === "OPTIONS") return handleCORS;
  if (method === "POST" && path === "/signature") return handleSignature;
  if (method === "POST" && path === "/submit") return handleSubmit;
  return null;
}

/**
 * HTTP 触发器入口
 *
 * FC3 内置运行时 event 格式：
 *   path    → event.requestContext.http.path
 *   method  → event.requestContext.http.method
 *   body    → event.body（isBase64Encoded=true 时需 decode）
 *   headers → event.headers
 */
export const handler = async (rawEvent, context) => {
  // FC3 HTTP 触发器：event 是 Buffer，需先解析
  const event = Buffer.isBuffer(rawEvent)
    ? JSON.parse(rawEvent.toString())
    : rawEvent;

  const http = event.requestContext?.http || {};
  const path = http.path || event.rawPath || "/";
  const method = http.method || "GET";
  const headers = event.headers || {};
  const origin = headers?.origin || headers?.Origin || "";
  let body = event.body || "";
  if (event.isBase64Encoded && body) {
    body = Buffer.from(body, "base64").toString("utf-8");
  }

  const handlerFn = route(path, method);
  if (!handlerFn) return json(404, { error: "Not Found" }, origin);

  try {
    return await handlerFn({ body, origin, headers });
  } catch (err) {
    console.error("Handler error:", err);
    return json(500, { error: err.message }, origin);
  }
};

// ============================================================
// 鉴权
// ============================================================
function checkAuth(headers) {
  if (!SHARED_SECRET) return true;
  const token = headers?.["x-auth-token"] || headers?.["X-Auth-Token"] || "";
  return token === SHARED_SECRET;
}

// ============================================================
// POST /signature
// ============================================================
async function handleSignature({ body, origin, headers }) {
  if (!checkAuth(headers)) return json(401, { error: "Unauthorized" }, origin);

  const { semester, courseName } = parseBody(body);
  if (!semester || !courseName) {
    return json(400, { error: "请提供 semester 和 courseName" }, origin);
  }

  const dir = buildUploadDir(semester, courseName);
  return json(200, generateUploadSignature(dir), origin);
}

// ============================================================
// POST /submit
// ============================================================
async function handleSubmit({ body, origin, headers }) {
  if (!checkAuth(headers)) return json(401, { error: "Unauthorized" }, origin);

  const data = parseBody(body);

  // 1. 验证
  const errors = validate(data);
  if (errors.length > 0) {
    return json(400, { error: "表单数据不完整", details: errors }, origin);
  }

  // 2. 格式化表单为 .md（纯模板，无 AI）
  const submittedAt = new Date().toISOString();
  const markdown = formatSubmission({
    courseName: data.courseName,
    userMarkdown: data.markdown || "",
    files: data.files || [],
    contributor: data.contributor,
    contact: data.contact,
    semester: data.semester,
    submittedAt,
  });

  // 3. 记录原始数据
  const rawData = {
    semester: data.semester,
    courseName: data.courseName,
    fileName: data.fileName,
    markdown: data.markdown || "",
    files: data.files || [],
    contributor: data.contributor,
    contact: data.contact,
    submittedAt,
  };

  // 4. 创建 PR
  console.log(`[submit] course=${data.courseName} contributor=${data.contributor}`);
  const { prUrl, branch } = await createContributionPR({
    semester: data.semester,
    courseName: data.courseName,
    fileName: data.fileName,
    markdown,
    rawData,
    contributor: data.contributor,
    contact: data.contact,
  });

  console.log(`[submit] PR: ${prUrl}`);
  return json(200, { success: true, prUrl, branch }, origin);
}

// ============================================================
// OPTIONS
// ============================================================
async function handleCORS({ origin }) {
  return json(204, null, origin);
}

// ============================================================
// 工具函数
// ============================================================
function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try { return JSON.parse(body); } catch { return {}; }
  }
  return body;
}

function validate({ semester, courseName, files, markdown }) {
  const errors = [];
  if (!semester) errors.push("缺少学期信息");
  if (!courseName) errors.push("缺少课程名称");
  if ((!files || files.length === 0) && (!markdown || !markdown.trim())) {
    errors.push("请上传文件或填写课程说明");
  }
  return errors;
}

function json(statusCode, data, origin) {
  const respHeaders = corsHeaders(origin);
  respHeaders["Content-Type"] = "application/json; charset=utf-8";
  return { statusCode, headers: respHeaders, body: data ? JSON.stringify(data, null, 2) : "" };
}

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
    "Access-Control-Max-Age": "86400",
  };
}
