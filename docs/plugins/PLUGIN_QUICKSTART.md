# 🚀 Plugin Quick Start Guide

## Bạn đã sẵn sàng sử dụng Plugins!

Plugins đã được cài đặt và tích hợp vào project. File này hướng dẫn bạn **thử ngay** các plugin.

---

## ✅ Setup Checklist

- [x] Plugins đã cài: issue-resolution, planning, orchestrator, worker, knowledge
- [x] AGENTS.md đã tạo (plugin dùng file này để hiểu project)
- [x] Documentation updated (COMMANDS.md, PLUGIN_INTEGRATION_GUIDE.md)

**Bạn có thể bắt đầu ngay!**

---

## 🎯 Thử Plugin ngay (3 Examples)

### Example 1: Fix một Bug (5 phút)

**Scenario**: Giả sử có lỗi trong image generator

```bash
# Step 1: Trong Claude Code, type:
skill issue-resolution

# Step 2: Mô tả vấn đề khi plugin hỏi:
"Image colors are wrong for Thach Vu Land brand"

# Step 3: Plugin sẽ tự động:
# - Đọc logs/
# - Check generator-tvland.js
# - Tìm root cause
# - Suggest fix
# - Verify

# Step 4: Kiểm tra fix
cd scripts
node daily-agent.js "Test Topic" --brand thachvuland
```

**Kết quả**: Bug được fix một cách có hệ thống, không miss bước nào.

---

### Example 2: Plan Feature Mới (10 phút)

**Scenario**: Thêm Instagram posting vào workflow

```bash
# Step 1: Trong Claude Code
skill planning

# Step 2: Mô tả feature
"Add Instagram posting capability to the automation workflow"

# Step 3: Plugin sẽ:
# - Discovery: Tìm Facebook posting code hiện tại
# - Synthesis: Phân tích cách integrate Instagram
# - Verification: Tạo spike test Instagram API
# - Decomposition: Chia thành beads (tasks)
# - Track Planning: Tạo execution plan

# Step 4: Review plan
# Plugin tạo file: history/instagram-feature/execution-plan.md

# Step 5 (Optional): Execute plan
skill orchestrator
```

**Kết quả**: Plan chi tiết, rõ ràng, ready to execute.

---

### Example 3: Document Work (3 phút)

**Scenario**: Document công việc vừa làm

```bash
# Step 1: Trong Claude Code
skill knowledge

# Step 2: Nói với plugin
"Document the multi-brand system I just built"

# Step 3: Plugin sẽ:
# - Tìm code changes related to multi-brand
# - Extract key decisions và patterns
# - Verify với code thực tế
# - Update docs/MULTI_BRAND_GUIDE.md

# Step 4: Review updates
cat docs/MULTI_BRAND_GUIDE.md
```

**Kết quả**: Docs được update tự động, chính xác với code.

---

## 💡 Khi nào dùng Plugin nào?

| Tình huống | Plugin | Lý do |
|-----------|--------|-------|
| Có bug, lỗi | `issue-resolution` | Giải quyết có hệ thống |
| Thêm feature mới | `planning` | Plan trước khi code |
| Refactor lớn | `planning` | Chia nhỏ công việc |
| Chạy parallel tasks | `orchestrator` | Coordination |
| Sau khi finish epic | `knowledge` | Document ngay |

---

## 🛠 Practical Use Cases cho Project này

### Use Case 1: Optimize Image Generation Speed

```bash
# Problem: Generator chậm, muốn optimize

skill planning
→ "Optimize carousel image generation performance"

# Plugin sẽ plan:
# - Spike: Profile current performance
# - Spike: Test parallel generation
# - Beads: Implement parallel processing
# - Beads: Add caching
# - Beads: Benchmark improvements
```

### Use Case 2: Add New Brand "Nano Banana"

```bash
skill planning
→ "Add new brand Nano Banana to the system"

# Plugin sẽ:
# - Discover brands/ structure
# - Plan beads:
#   • Create brand directory
#   • Create brand.json
#   • Setup Google Sheet
#   • Test workflow
# - Create execution plan

# Then execute:
skill orchestrator
```

### Use Case 3: Fix Recurring Upload Failures

```bash
skill issue-resolution
→ "Upload to Google Drive sometimes fails"

# Plugin workflow:
# 1. Triage: Check error patterns in logs/
# 2. Reproduction: Create test case
# 3. Root Cause: API timeout? Auth issue?
# 4. Impact: How many workflows affected?
# 5. Fix: Add retry logic
# 6. Verify: Test with real uploads
```

### Use Case 4: Parallel Content Generation

```bash
skill planning
→ "Generate 10 posts for each brand in parallel"

# Creates plan with 2 tracks:
# Track 1: Long Best AI (10 posts)
# Track 2: Thach Vu Land (10 posts)

skill orchestrator
# Spawns 2 workers, both run simultaneously
# Result: 20 posts in time of 10
```

---

## 🎬 Your First Plugin Session (Now!)

**Let's try right now:**

1. Open Claude Code
2. Make sure you're in `/Users/admin/automation`
3. Type: `skill issue-resolution`
4. Follow the prompts

**Try with a simple scenario:**
```
skill issue-resolution

Plugin asks: "What issue would you like to resolve?"
You: "Check if there are any errors in recent logs"

→ Plugin will analyze logs/ and report findings
```

---

## 📖 Reference Files

Created for you:
- `AGENTS.md` - Plugin configuration (tells plugins about project)
- `docs/PLUGIN_INTEGRATION_GUIDE.md` - Detailed integration guide
- `COMMANDS.md` - Updated with plugin commands (section: Plugin Skills)

---

## 🔄 Integration with Current Workflow

**Before Plugins**:
```
Manual workflow → Write code → Debug manually → Document manually
```

**With Plugins**:
```
issue-resolution → Systematic bug fixing
planning → Structured feature planning
orchestrator → Parallel execution
knowledge → Auto documentation
```

**Your daily-agent.js can benefit from**:
- `planning` skill: Plan improvements
- `orchestrator` skill: Run multiple brands in parallel
- `issue-resolution` skill: Fix errors faster
- `knowledge` skill: Keep docs updated

---

## 💬 Quick Tips

1. **Start simple**: Try `skill issue-resolution` first
2. **AGENTS.md is key**: Plugins read this to understand project
3. **Combine plugins**: planning → orchestrator → knowledge
4. **Not every task needs plugin**: Simple changes don't need it
5. **Plugin suggests, you decide**: You're in control

---

## 🆘 If Something Goes Wrong

**Plugin không hiểu project**:
→ Check AGENTS.md có đủ info không

**Plugin gợi ý sai approach**:
→ Bạn có thể reject và suggest approach khác

**Muốn stop plugin**:
→ Ctrl+C hoặc type "exit"

---

## 📊 Success Metrics

After using plugins, bạn sẽ thấy:
- ✅ Bugs được fix nhanh hơn, ít miss steps
- ✅ Features có plan rõ ràng trước khi code
- ✅ Parallel work execution (orchestrator)
- ✅ Docs luôn updated (knowledge)
- ✅ Less context switching

---

## 🎯 Next Steps

1. **Thử ngay**: `skill issue-resolution` để explore
2. **Plan một feature**: `skill planning` → "Add [feature]"
3. **Document recent work**: `skill knowledge`
4. **Explore plugin docs**: Read `skill/*/SKILL.md` files

---

## 💪 You're Ready!

Plugins đã sẵn sàng. Hãy thử một trong 3 examples ở trên ngay bây giờ!

```bash
# Trong Claude Code:
skill issue-resolution
# hoặc
skill planning
# hoặc
skill knowledge
```

**Chúc bạn thành công!** 🚀

---

**Questions?** Check `docs/PLUGIN_INTEGRATION_GUIDE.md` for detailed examples.
