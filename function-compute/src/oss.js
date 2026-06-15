/**
 * OSS 浏览器直传签名生成
 * 前端用此签名直接将文件上传到 OSS，不经过函数计算中转
 */
import crypto from "crypto";

const OSS_ACCESS_KEY_ID = process.env.OSS_ACCESS_KEY_ID;
const OSS_ACCESS_KEY_SECRET = process.env.OSS_ACCESS_KEY_SECRET;

/**
 * 生成 OSS PostObject 策略签名
 * 参考: https://help.aliyun.com/document_detail/31988.html
 *
 * @param {string} dir        - 上传目录前缀，如 "uploads/2024-01-15/"
 * @param {number} maxSize    - 单文件最大字节数，默认 50MB
 * @param {number} expiration - 签名有效期（秒），默认 300
 */
export function generateUploadSignature(dir, maxSize = 52428800, expiration = 300) {
  const expireTime = new Date(Date.now() + expiration * 1000).toISOString();
  const bucket = process.env.OSS_BUCKET;
  const region = process.env.OSS_REGION;

  // OSS 上传域名
  const host = `https://${bucket}.${region}.aliyuncs.com`;

  // PostObject 策略 — 限制上传条件和有效时间
  const policy = {
    expiration: expireTime,
    conditions: [
      { bucket: bucket },                       // 限定 bucket
      ["starts-with", "$key", dir],              // 限定上传路径前缀
      ["content-length-range", 1, maxSize],      // 限定文件大小
    ],
  };

  const policyBase64 = Buffer.from(JSON.stringify(policy)).toString("base64");
  const signature = crypto
    .createHmac("sha1", OSS_ACCESS_KEY_SECRET)
    .update(policyBase64)
    .digest("base64");

  return {
    host,
    policy: policyBase64,
    signature,
    accessId: OSS_ACCESS_KEY_ID,
    key: `${dir}\${filename}`,              // 前端替换 ${filename} 为实际文件名
    expire: Math.floor(Date.now() / 1000) + expiration,
  };
}

/**
 * 获取上传路径前缀（按日期 + 课程分组）
 * 例: uploads/calculus/2024-01-15/
 */
export function buildUploadDir(semester, courseName) {
  const date = new Date().toISOString().slice(0, 10); // "2024-01-15"
  const course = (courseName || "general").replace(/[^a-zA-Z0-9一-龥_-]/g, "_");
  return `uploads/${semester}/${course}/${date}/`;
}
