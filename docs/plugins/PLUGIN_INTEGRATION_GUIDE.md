# 🔌 Plugin Integration Guide

## Plugins đã cài đặt

Bạn đã cài đặt 5 plugins từ marketplace `kuckit`:

1. **issue-resolution** - Giải quyết bug có hệ thống
2. **planning** - Lập kế hoạch tính năng mới
3. **orchestrator** - Điều phối multi-agent
4. **worker** - Thực thi công việc tự động
5. **knowledge** - Trích xuất kiến thức & sync docs

## 🚀 Kích hoạt Plugins

### Cách 1: Sử dụng Claude Code với Skill Command

```bash
# Trong Claude Code CLI
skill <plugin-name>
```

Ví dụ:
```bash
skill issue-resolution    # Khi cần fix bug
skill planning           # Khi cần plan feature mới
skill knowledge         # Khi cần document work
```

### Cách 2: Tích hợp vào Workflow tự động

Plugins sẽ tự động được kích hoạt khi:
- File `AGENTS.md` tồn tại ở root project (✓ đã tạo)
- Bạn đang dùng Claude Code để làm việc với codebase
- Plugins detect được pattern phù hợp

## 📋 Use Cases cho Automation Project

### 1. 🐛 Fix Bug trong Content Pipeline

**Khi nào**: Lỗi trong writer, generator, uploader, hoặc workflow fails

**Cách dùng**:
```bash
# Trong Claude Code
skill issue-resolution
```

**Plugin sẽ làm gì**:
1. Đọc logs từ `logs/` directory
2. Kiểm tra `data/analytics.db` để tìm failed workflows
3. Tái hiện lỗi với test case
4. Phân tích root cause
5. Tạo fix và verify

**Ví dụ thực tế**:
```
User: "Image generation fails for Thach Vu Land brand"
→ Plugin sẽ:
  - Đọc logs/error-*.log
  - Kiểm tra scripts/carousel-generator/generator-tvland.js
  - Tìm nguyên nhân (font missing, color issue, etc.)
  - Tạo test với sample content
  - Fix và verify
```

---

### 2. 📝 Thêm Feature Mới

**Khi nào**: Muốn thêm tính năng như:
- Auto hashtag generation
- Multi-platform posting (Instagram, LinkedIn)
- A/B testing for content
- Analytics dashboard

**Cách dùng**:
```bash
# Trong Claude Code
skill planning
```

**Plugin sẽ làm gì**:
1. Khám phá codebase hiện tại (Discovery)
2. Phân tích gap (Synthesis)
3. Tạo spike để test approach (Verification)
4. Chia nhỏ thành beads (Decomposition)
5. Tạo execution plan

**Ví dụ thực tế**:
```
User: "Add Instagram posting to the workflow"
→ Plugin sẽ:
  - Discover: Tìm Facebook posting code
  - Synthesis: So sánh Instagram API vs Facebook
  - Verification: Tạo spike test Instagram Graph API
  - Decomposition: Chia thành beads:
    • bd-1: Add Instagram credentials
    • bd-2: Create Instagram uploader
    • bd-3: Integrate into daily-agent.js
    • bd-4: Update docs
  - Track Planning: Gán beads vào tracks
```

---

### 3. 🤖 Parallel Processing cho Multi-Brand

**Khi nào**: Muốn chạy song song cho nhiều brands

**Cách dùng**:
```bash
# Sau khi dùng planning skill
skill orchestrator
```

**Plugin sẽ làm gì**:
1. Đọc execution plan từ planning
2. Spawn worker agents song song
3. Mỗi worker xử lý 1 brand:
   - Worker 1 (BlueLake): `brands/longbest-ai/**`
   - Worker 2 (GreenCastle): `brands/thachvuland/**`
4. Monitor progress qua Agent Mail
5. Handle conflicts nếu có

**Ví dụ thực tế**:
```
User: "Generate content for both brands in parallel"
→ Planning skill tạo plan
→ Orchestrator skill:
  - Track 1: Long Best AI
    • Generate 5 posts
    • Upload to Drive
    • Update Sheets
  - Track 2: Thach Vu Land
    • Generate 3 posts
    • Upload to Drive
    • Update Sheets
  → Both run simultaneously
```

---

### 4. 📚 Document Work & Update Docs

**Khi nào**: Sau khi hoàn thành epic, feature, hoặc major change

**Cách dùng**:
```bash
# Trong Claude Code
skill knowledge
```

**Plugin sẽ làm gì**:
1. Tìm threads/work history
2. Trích xuất topics, decisions, changes
3. Verify với code thực tế
4. Map vào docs hiện tại
5. Update docs surgically

**Ví dụ thực tế**:
```
User: "Document the multi-brand refactor from last week"
→ Plugin sẽ:
  - Find threads about multi-brand work
  - Extract: "Added brand.json config", "Split workflows", etc.
  - Verify: Check brands/ directory structure
  - Update: docs/MULTI_BRAND_GUIDE.md
  - Create diagrams: Architecture flow with Mermaid
```

---

## 🎯 Integration Points trong Automation Project

### A. Tích hợp vào `scripts/daily-agent.js`

**Hiện tại**:
```javascript
// Sequential workflow
Writer → Generator → Enhancer → Uploader
```

**Với Orchestrator**:
```javascript
// Parallel workflow
Track 1: Writer + Generator (Long Best AI)
Track 2: Writer + Generator (Thach Vu Land)
→ Merge → Uploader
```

**Cách implement**:
1. Dùng `planning` skill để plan refactor
2. Dùng `orchestrator` skill để spawn parallel workers
3. Mỗi worker chạy full pipeline cho 1 brand

---

### B. Tích hợp Error Handling

**Hiện tại**:
```javascript
try {
  await runCommand(...);
} catch (error) {
  logger.error(...);
  process.exit(1);
}
```

**Với issue-resolution**:
```javascript
// Plugin tự động phát hiện pattern
// Khi error xảy ra → gợi ý "skill issue-resolution"
```

**Enhancement**:
Thêm vào `scripts/utils/logger.js`:
```javascript
// Suggest using issue-resolution skill for critical errors
if (level === 'error') {
  console.log('\n💡 Tip: Run "skill issue-resolution" in Claude Code to debug');
}
```

---

### C. Tích hợp Content Planning

**Hiện tại**:
Manual topic creation

**Với planning skill**:
```
User: "Plan content for next month"
→ planning skill tạo:
  - 12 topics (3/week × 4 weeks)
  - Split by brand
  - Dependencies (trending topics, seasonal content)
  - Execution schedule
```

---

## 🛠 Practical Workflow Examples

### Example 1: Fix Bug trong Image Generator

```bash
# 1. User báo lỗi
"Images for Thach Vu Land have wrong colors"

# 2. Kích hoạt issue-resolution
skill issue-resolution

# 3. Plugin workflow:
→ Triage: HIGH severity (affects production)
→ Reproduction:
  • Read brands/thachvuland/brand.json
  • Run generator-tvland.js with test content
  • Capture wrong colors
→ Root Cause:
  • Hypothesis A: Color config not loaded
  • Hypothesis B: CSS override issue
  • Verify: Check generator-tvland.js line 45
  • Confirmed: Missing color.primary fallback
→ Impact: Only Thach Vu Land affected
→ Fix:
  • Edit scripts/carousel-generator/generator-tvland.js
  • Add fallback colors
  • Test with sample content
→ Verify:
  • Colors correct
  • Long Best AI unaffected
  • All tests pass

# 4. Kết quả
✓ Bug fixed
✓ Test added
✓ Docs updated
```

---

### Example 2: Add New Brand

```bash
# 1. User request
"Add new brand: Nano Banana"

# 2. Kích hoạt planning
skill planning

# 3. Plugin workflow:
→ Discovery:
  • Explore brands/_templates/
  • Check existing brand patterns
  • Find dependencies (n8n, Google Sheets)
→ Synthesis:
  • Approach: Clone from longbest-ai template
  • Risks:
    - HIGH: Facebook credentials setup
    - MEDIUM: Google Sheets creation
    - LOW: Color/font config
→ Verification (Spike):
  • Test Facebook Graph API with test page
  • Verify Google Sheets API permissions
→ Decomposition (Beads):
  • bd-1: Create brand directory structure
  • bd-2: Create brand.json config
  • bd-3: Setup Google Sheet
  • bd-4: Create n8n workflow
  • bd-5: Test end-to-end
→ Track Planning:
  Track 1: Infrastructure setup (bd-1, bd-2, bd-3)
  Track 2: Workflow setup (bd-4, bd-5)

# 4. Execute with orchestrator
skill orchestrator

# 5. Document with knowledge
skill knowledge
→ Updates docs/MULTI_BRAND_GUIDE.md
→ Adds Nano Banana section
```

---

### Example 3: Parallel Content Generation

```bash
# 1. User request
"Generate 5 posts for each brand today"

# 2. Planning
skill planning
→ Creates execution plan with 2 tracks

# 3. Orchestration
skill orchestrator

# Workflow:
┌─────────────────────────────────────────┐
│ ORCHESTRATOR (GoldFox)                  │
├─────────────────────────────────────────┤
│ Spawns 2 workers:                       │
│                                         │
│ ┌────────────────┐  ┌────────────────┐ │
│ │ BlueLake       │  │ GreenCastle    │ │
│ │ (Long Best AI) │  │ (Thach Vu Land)│ │
│ ├────────────────┤  ├────────────────┤ │
│ │ For i in 1..5: │  │ For i in 1..5: │ │
│ │ • Writer       │  │ • Writer       │ │
│ │ • Generator    │  │ • Generator    │ │
│ │ • Enhancer     │  │ • Enhancer     │ │
│ │ • Uploader     │  │ • Uploader     │ │
│ │ • Report       │  │ • Report       │ │
│ └────────────────┘  └────────────────┘ │
└─────────────────────────────────────────┘

# 4. Result
✓ 10 posts created (5 per brand)
✓ All uploaded to Drive
✓ Sheets updated
✓ Ready for n8n scheduling
```

---

## 📌 Quick Reference

| Task | Plugin | Command |
|------|--------|---------|
| Fix bug | issue-resolution | `skill issue-resolution` |
| Plan new feature | planning | `skill planning` |
| Execute parallel work | orchestrator | `skill orchestrator` |
| Document changes | knowledge | `skill knowledge` |

## 🔗 Files to Update

Khi dùng plugins, các file này có thể được tạo/cập nhật:

```
automation/
├── AGENTS.md                    # ✓ Đã tạo
├── .beads/                      # Bead tracking (từ planning)
├── history/                     # Work history (từ knowledge)
│   ├── <feature>/
│   │   ├── discovery.md
│   │   ├── approach.md
│   │   └── execution-plan.md
├── .spikes/                     # Spike experiments (từ planning)
└── docs/
    └── PLUGIN_INTEGRATION_GUIDE.md  # File này
```

## 💡 Tips

1. **AGENTS.md là quan trọng nhất** - Plugin dùng file này để hiểu project
2. **Dùng planning trước orchestrator** - Planning tạo plan, orchestrator execute
3. **issue-resolution cho bug, planning cho feature** - Đừng nhầm lẫn
4. **knowledge để keep docs updated** - Chạy sau mỗi major change

## 🆘 Troubleshooting

**Plugin không chạy**:
- Check AGENTS.md tồn tại
- Restart Claude Code sau khi cài plugin
- Verify plugin installed: `/plugin list`

**Plugin không hiểu project**:
- Update AGENTS.md với details cụ thể
- Add project-specific conventions
- Document tech stack và dependencies

**Conflict giữa plugins**:
- Chạy 1 plugin tại 1 thời điểm
- Finish planning → execute orchestrator
- Don't overlap issue-resolution với planning

---

**Next Steps**: Thử ngay với một task thực tế!
