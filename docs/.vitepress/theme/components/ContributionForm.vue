<template>
  <div>
    <div class="form-group">
      <label class="form-label">学期 <span class="required">*</span></label>
      <select v-model="semester" class="form-select">
        <option value="">-- 请选择学期 --</option>
        <option v-for="s in semesters" :key="s.key" :value="s.key">{{ s.label }}</option>
      </select>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">课程名称 <span class="required">*</span></label>
        <select v-model="selectedCourse" class="form-select">
          <option value="">-- 请选择课程 --</option>
          <optgroup v-for="g in filteredCourseGroups" :key="g.label" :label="g.label">
            <option v-for="c in g.courses" :key="c" :value="c">{{ c }}</option>
          </optgroup>
          <option value="__other__">📝 其他（输入新课程）</option>
        </select>
        <input v-if="selectedCourse === '__other__'" v-model="customCourse" class="form-input" placeholder="输入新课程名称" style="margin-top:0.4rem" />
      </div>
      <div class="form-group">
        <label class="form-label">署名 <span class="required">*</span></label>
        <input v-model="contributor" class="form-input" placeholder="你的名字或昵称" :disabled="isAnonymous" />
        <label class="anonymous-toggle">
          <input type="checkbox" v-model="isAnonymous" /> Anonymous贡献
        </label>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">联系方式</label>
      <input v-model="contact" class="form-input" placeholder="选填，用于审核时联系（不会公开）" />
    </div>

    <h2>📎 上传文件</h2>
    <div class="drop-zone"
      @dragenter="preventDefaults" @dragover="preventDefaults" @drop="onDrop"
      @click="openFilePicker">
      <div class="drop-zone-icon">📎</div>
      <div>拖拽文件到此处，或点击选择</div>
      <div class="form-hint">支持 PDF、图片、Office 文档，单文件 ≤ 50MB</div>
    </div>

    <div class="file-list" v-if="files.length">
      <div v-for="f in files" :key="f.id" :class="['file-item', f.status]">
        <span class="file-name">{{ f.name }}</span>
        <span class="file-size">{{ formatSize(f.size) }}</span>
        <span class="file-status" v-if="f.status === 'waiting'">⏳ 等待上传</span>
        <span class="file-status" v-if="f.status === 'uploading'">⏫ 上传中</span>
        <span class="file-status" v-if="f.status === 'done'">✅</span>
        <span class="file-status" v-if="f.status === 'error'" :title="f.error">❌ {{ f.error }}</span>
        <button class="file-remove" @click="removeFile(f.id)" v-if="f.status !== 'uploading'">×</button>
      </div>
    </div>

    <h2>📝 课程说明（可选）</h2>
    <div class="form-hint" style="margin-bottom:0.5rem">你的留言和文件将原样提交为 PR，由人工审核后合并到课程页面。</div>

    <textarea v-model="markdownText" class="form-textarea"
      placeholder="用 Markdown 自由书写课程心得、学习建议、复习策略...&#10;&#10;可以写任何你想分享的内容，审核者会看到原文。&#10;如果只传文件不写说明也完全可以。"></textarea>

    <div class="preview-toggle">
      <button @click="showPreview = !showPreview">{{ showPreview ? '隐藏预览' : '预览 Markdown' }}</button>
    </div>
    <div v-if="showPreview && markdownText" class="preview-box" v-html="renderedMarkdown"></div>

    <div v-if="errorMsg" class="result-box fail">{{ errorMsg }}</div>

    <button class="submit-btn" :disabled="submitting" @click="handleSubmit">
      {{ submitting ? '提交中...' : '🚀 提交贡献' }}
    </button>

    <div v-if="result" :class="['result-box', result.success ? 'success' : 'fail']">
      <template v-if="result.success">
        🎉 {{ result.message }}<br>
        <a :href="result.prUrl" target="_blank">去 GitHub 编辑 PR →</a>
        <div class="form-hint" style="margin-top:0.5rem">点击上方链接，在 PR 的 Files changed 里把文件链接加到课程页面</div>
      </template>
      <template v-else>
        😢 {{ result.message }}
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'

const FC_URL = 'https://aicomparibution-mbpmhjqzfe.cn-shenzhen.fcapp.run'
const SHARED_SECRET = '9dae7526abb063d166c89fdfdc37ea41'

const semesters = [
  { key: 'FirstYear_1',   label: '大一上学期' },
  { key: 'FirstYear_2',   label: '大一下学期' },
  { key: 'SecondYear_1',  label: '大二上学期' },
  { key: 'SecondYear_2',  label: '大二下学期' },
  { key: 'ThirdYear_1',   label: '大三上学期' },
  { key: 'ThirdYear_2',   label: '大三下学期' },
  { key: 'ResearcherGuide', label: '科研与升学' },
  { key: 'Work',          label: '实习与就业' },
]

const semester = ref('')
const selectedCourse = ref('')
const customCourse = ref('')
const isAnonymous = ref(false)
const contributor = ref('')
const contact = ref('')

// 学期 → 课程映射
const semesterCourseMap = {
  FirstYear_1:   { label: '大一上学期', courses: ['程序设计I', '高等数学I', '线性代数', '大学物理上'] },
  FirstYear_2:   { label: '大一下学期', courses: ['程序设计II', '高等数学II', '大学物理下', '数字电路', '大学物理实验'] },
  SecondYear_1:  { label: '大二上学期', courses: ['数据结构与算法', '概率统计', '离散数学', '信号与系统', '高级语言程序设计'] },
  SecondYear_2:  { label: '大二下学期', courses: ['人工智能原理', '机器人原理', '贝叶斯', '计算机组成原理', '复变函数', '博弈论'] },
  ThirdYear_1:   { label: '大三上学期', courses: ['操作系统', '数据库系统', '计算机网络', '数值计算', '机器学习', '人机交互设计', '数字信号处理'] },
  ThirdYear_2:   { label: '大三下学期', courses: ['智能机器人'] },
  ResearcherGuide: { label: '科研与升学', courses: ['科研入门指南'] },
  Work:          { label: '实习与就业', courses: ['实习就业指南'] },
}

// 根据学期过滤课程列表
const filteredCourseGroups = computed(() => {
  if (!semester.value) return []
  const entry = semesterCourseMap[semester.value]
  return entry ? [{ label: entry.label, courses: entry.courses }] : []
})

// 课程名称 = 选中的下拉值，或自定义输入
const courseName = computed(() => {
  if (selectedCourse.value === '__other__') return customCourse.value
  return selectedCourse.value
})

// 切换学期时清空已选课程
watch(semester, () => { selectedCourse.value = ''; customCourse.value = '' })

watch(isAnonymous, (val) => {
  if (val) {
    contributor.value = 'Anonymous'
  } else if (contributor.value === 'Anonymous') {
    contributor.value = ''
  }
})
const markdownText = ref('')
const files = ref([])
const showPreview = ref(false)
const submitting = ref(false)
const result = ref(null)
const errorMsg = ref('')

let fileIdCounter = 0

const renderedMarkdown = computed(() => {
  if (!markdownText.value) return ''
  return marked.parse(markdownText.value)
})

function preventDefaults(e) { e.preventDefault(); e.stopPropagation() }

function openFilePicker() {
  const input = document.createElement('input')
  input.type = 'file'; input.multiple = true
  input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx'
  input.onchange = (e) => handleFiles(Array.from(e.target.files))
  input.click()
}

function onDrop(e) {
  preventDefaults(e)
  handleFiles(Array.from(e.dataTransfer.files))
}

async function handleFiles(selected) {
  for (const f of selected) {
    if (f.size > 50 * 1024 * 1024) { errorMsg.value = `文件 ${f.name} 超过 50MB`; continue }
    const id = ++fileIdCounter
    files.value.push({ id, name: f.name, size: f.size, status: 'waiting', ossUrl: null, error: null, file: f })
  }
  for (const f of files.value.filter(x => x.status === 'waiting')) {
    await uploadFile(f)
  }
}

async function uploadFile(fileEntry) {
  if (!semester.value || !courseName.value) {
    fileEntry.status = 'error'; fileEntry.error = '请先选择学期和课程'; return
  }
  fileEntry.status = 'uploading'

  try {
    const sigResp = await fetch(`${FC_URL}/signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth-Token': SHARED_SECRET },
      body: JSON.stringify({ semester: semester.value, courseName: courseName.value }),
    })
    if (!sigResp.ok) throw new Error('获取上传凭证失败')
    const sig = await sigResp.json()

    const formData = new FormData()
    formData.append('key', sig.key.replace('${filename}', fileEntry.name))
    formData.append('policy', sig.policy)
    formData.append('signature', sig.signature)
    formData.append('OSSAccessKeyId', sig.accessId)
    formData.append('success_action_status', '200')
    formData.append('file', fileEntry.file)

    const uploadResp = await fetch(sig.host, { method: 'POST', body: formData })
    if (!uploadResp.ok) throw new Error(`上传失败 (${uploadResp.status})`)

    fileEntry.ossUrl = `${sig.host}/${sig.key.replace('${filename}', encodeURIComponent(fileEntry.name))}`
    fileEntry.status = 'done'
    errorMsg.value = ''
  } catch (err) {
    fileEntry.status = 'error'; fileEntry.error = err.message
  }
}

function removeFile(id) { files.value = files.value.filter(f => f.id !== id) }

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

async function handleSubmit() {
  errorMsg.value = ''; result.value = null

  if (!semester.value) { errorMsg.value = '请选择学期'; return }
  if (!courseName.value.trim()) { errorMsg.value = '请填写课程名称'; return }
  if (!contributor.value.trim()) { errorMsg.value = '请填写贡献者署名'; return }
  if (files.value.length === 0 && !markdownText.value.trim()) { errorMsg.value = '请上传文件或撰写课程说明'; return }

  const uploading = files.value.filter(f => f.status === 'uploading' || f.status === 'waiting')
  if (uploading.length) { errorMsg.value = `还有 ${uploading.length} 个文件正在上传，请稍候`; return }

  const failed = files.value.filter(f => f.status === 'error')
  if (failed.length) { errorMsg.value = `${failed.length} 个文件上传失败，请重试或移除`; return }

  submitting.value = true

  try {
    const resp = await fetch(`${FC_URL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth-Token': SHARED_SECRET },
      body: JSON.stringify({
        semester: semester.value,
        courseName: courseName.value.trim(),
        fileName: courseName.value.trim(),
        markdown: markdownText.value.trim(),
        files: files.value.filter(f => f.status === 'done').map(f => ({ name: f.name, ossUrl: f.ossUrl })),
        contributor: contributor.value.trim(),
        contact: contact.value.trim(),
      }),
    })
    const data = await resp.json()
    if (resp.ok && data.success) {
      result.value = { success: true, prUrl: data.prUrl, message: 'PR 已创建！你可以在 GitHub 上继续编辑，把文件链接加到课程页面里。' }
    } else {
      result.value = { success: false, message: data.error || '提交失败，请稍后重试' }
    }
  } catch (err) {
    result.value = { success: false, message: `网络错误: ${err.message}` }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* ── Section headers ── */
h2 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border-bottom: 1.5px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
  letter-spacing: 0.01em;
}

/* ── Form groups ── */
.form-group { margin-bottom: 1.35rem; }
.form-label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.35rem;
  color: var(--vp-c-text-1);
}
.required { color: #ef4444; font-weight: 700; }
.form-hint {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  margin-top: 0.3rem;
  line-height: 1.5;
}

/* ── Inputs / Selects ── */
.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
}
.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--vp-c-text-3);
}

/* ── Two-column row ── */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
}

/* ── Anonymous toggle ── */
.anonymous-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  cursor: pointer;
  user-select: none;
}
.anonymous-toggle input[type="checkbox"] {
  cursor: pointer;
  accent-color: var(--vp-c-brand-1);
}

/* ── Textarea ── */
.form-textarea {
  min-height: 220px;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  font-size: 0.84rem;
  line-height: 1.7;
  resize: vertical;
}

/* ── Drop zone ── */
.drop-zone {
  border: 2px dashed var(--vp-c-divider);
  border-radius: 14px;
  padding: 2.5rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  background: var(--vp-c-bg-soft);
}
.drop-zone:hover {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-bg-muted);
  box-shadow: 0 0 0 4px rgba(79,70,229,0.04);
}
.drop-zone-icon {
  font-size: 2.25rem;
  margin-bottom: 0.6rem;
  line-height: 1;
}

/* ── File list ── */
.file-list { margin-top: 0.85rem; }
.file-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.85rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.file-item.uploading { opacity: 0.6; }
.file-item.error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}
.file-item.done {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}
.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}
.file-size {
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  white-space: nowrap;
}
.file-status {
  white-space: nowrap;
  font-size: 0.75rem;
}
.file-remove {
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  font-size: 1.15rem;
  padding: 0 0.25rem;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.15s;
}
.file-remove:hover {
  color: #ef4444;
  background: rgba(239,68,68,0.08);
}

/* ── Mode badge ── */
.mode-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  background: rgba(79,70,229,0.08);
  color: var(--vp-c-brand-1);
  margin-bottom: 0.85rem;
  letter-spacing: 0.01em;
}
:root.dark .mode-badge {
  background: rgba(99,102,241,0.12);
}

/* ── Preview toggle ── */
.preview-toggle { margin-top: 0.5rem; }
.preview-toggle button {
  background: var(--vp-c-bg);
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.35rem 0.85rem;
  cursor: pointer;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s;
}
.preview-toggle button:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(79,70,229,0.06);
}

/* ── Preview box ── */
.preview-box {
  margin-top: 0.6rem;
  padding: 1.25rem;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  min-height: 80px;
  line-height: 1.7;
  font-size: 0.9rem;
}
.preview-box :deep(h1) { font-size: 1.4rem; margin: 0.5rem 0; }
.preview-box :deep(h2) { font-size: 1.15rem; margin: 0.5rem 0; border-bottom: 1px solid var(--vp-c-divider); }
.preview-box :deep(p) { margin: 0.4rem 0; }
.preview-box :deep(ul), .preview-box :deep(ol) { padding-left: 1.5rem; }
.preview-box :deep(code) { background: var(--vp-c-bg-mute); padding: 0.1rem 0.3rem; border-radius: 3px; font-size: 0.85rem; }
.preview-box :deep(pre) { background: var(--vp-c-bg-mute); padding: 0.75rem; border-radius: 6px; overflow-x: auto; }
.preview-box :deep(blockquote) { border-left: 3px solid var(--vp-c-brand-1); padding-left: 0.75rem; color: var(--vp-c-text-2); }
.preview-box :deep(a) { color: var(--vp-c-brand-1); }

/* ── Submit button ── */
.submit-btn {
  width: 100%;
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 650;
  letter-spacing: 0.02em;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: #fff;
  margin-top: 1.25rem;
  box-shadow: 0 4px 16px rgba(79,70,229,0.2);
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(79,70,229,0.3);
}
.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}
.submit-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ── Result box ── */
.result-box {
  margin-top: 1.25rem;
  padding: 1.15rem 1.25rem;
  border-radius: 10px;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.6;
}
.result-box.success {
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  color: #166534;
}
.result-box.fail {
  background: #fef2f2;
  border: 1.5px solid #fecaca;
  color: #991b1b;
}
.result-box a {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
</style>
