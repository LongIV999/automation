# 📚 Hướng Dẫn Tối Ưu Workflow & Tích Hợp Skill

## 🎯 Tổng Quan

Hệ thống workflow đã được nâng cấp với các tính năng:
- **Monitoring tập trung**: Theo dõi real-time tất cả workflows
- **Skill integration**: Tích hợp các skill AI vào workflow
- **n8n integration**: Kết nối seamless với n8n automation
- **Multi-brand orchestration**: Xử lý parallel cho nhiều brand

## 🚀 Cách Sử Dụng

### 1. Khởi động Monitoring Dashboard

```bash
# Start monitoring server
node scripts/workflow-monitor/monitor.js

# Mở dashboard tại: http://localhost:3001/dashboard.html
```

### 2. Sử dụng Daily Agent với Monitoring

```bash
# Thay vì dùng daily-agent.js cũ, dùng version mới:
node scripts/daily-agent-monitored.js "Topic của bạn" --brand longbest

# Dashboard sẽ hiển thị real-time progress
```

### 3. Tích hợp Skills vào Workflow

```javascript
// Ví dụ sử dụng skill integrator
const skillIntegrator = require('./utils/skill-integrator');

// Execute content writer skill
const content = await skillIntegrator.executeSkill('content-research-writer', {
    topic: 'AI Tools 2024',
    brand: 'longbest',
    format: 'carousel'
});

// Execute orchestrator for parallel tasks
const result = await skillIntegrator.executeSkill('orchestrator', {
    tasks: [
        'Generate content for brand A',
        'Generate content for brand B',
        'Generate content for brand C'
    ],
    brand: 'multi',
    parallel: true
});
```

### 4. Tạo Integrated Workflow với n8n

```javascript
const { createContentPipeline } = require('./n8n-integrator');

// Tạo full pipeline với n8n integration
const pipeline = await createContentPipeline('AI Best Practices', 'longbest');
```

## 📊 Monitoring Features

### Real-time Dashboard
- **Metrics**: Tổng workflows, đang chạy, thành công, thất bại
- **Active Workflows**: Xem chi tiết từng step đang chạy
- **WebSocket Updates**: Cập nhật real-time không cần refresh

### Database Analytics
```javascript
// Xem thống kê workflow
const monitor = require('./workflow-monitor/monitor');
const stats = monitor.getWorkflowStats('longbest', 7); // 7 ngày qua
```

## 🔧 Cấu Hình

### Environment Variables
```env
# n8n Integration
N8N_WEBHOOK_URL=http://localhost:5678/webhook
N8N_API_KEY=your-api-key

# Monitoring
MONITOR_PORT=3001
ENABLE_MONITORING=true
```

### Brand Configuration
Mỗi brand có thể custom workflow:
```json
{
  "name": "longbest-ai",
  "workflow": {
    "parallel": true,
    "steps": ["writer", "generator", "enhancer", "uploader"],
    "monitoring": true
  }
}
```

## 🎨 Workflow Patterns

### 1. Sequential Pipeline (Mặc định)
```
Topic → Writer → Generator → Enhancer → Uploader → Publisher
```

### 2. Parallel Multi-Brand
```
         ┌─→ Brand A Pipeline
Topic ─→ ├─→ Brand B Pipeline
         └─→ Brand C Pipeline
```

### 3. Skill-Enhanced Workflow
```
Topic → Planning Skill → Orchestrator → Workers → Aggregator → Output
```

### 4. n8n Hybrid Workflow
```
Node.js Scripts → Google Sheets → n8n Workflow → Facebook API
```

## 📈 Performance Tips

1. **Parallel Processing**: Sử dụng orchestrator skill cho multi-brand
2. **Caching**: Content được cache trong database
3. **Retry Logic**: Tự động retry failed steps
4. **Resource Pooling**: Browser pool cho Puppeteer

## 🐛 Troubleshooting

### Monitor không kết nối
```bash
# Check if monitor is running
ps aux | grep monitor.js

# Check port availability
lsof -i :3001
```

### Workflow bị stuck
```javascript
// Force complete workflow
monitor.completeWorkflow('workflowId', false, 'Manual stop');
```

### n8n webhook timeout
```javascript
// Increase timeout in n8n-integrator.js
timeout: 600000 // 10 minutes
```

## 🔗 Integration Examples

### 1. Auto-publish với n8n
```javascript
// Trigger n8n publish workflow sau khi upload
const { publishContent } = require('./n8n-integrator');
await publishContent('longbest', 'post-123');
```

### 2. Batch Processing với Monitoring
```javascript
// Process all content với tracking
const files = await getAllContentFiles();
for (const file of files) {
    const runId = `batch_${Date.now()}_${file}`;
    monitor.startWorkflow(runId, detectBrand(file), 'batch-process');
    // ... process file
    monitor.completeWorkflow(runId, true);
}
```

### 3. Error Recovery với Issue Resolution Skill
```javascript
try {
    await runWorkflow();
} catch (error) {
    const resolution = await skillIntegrator.executeSkill('issue-resolution', {
        error: error.message,
        workflow: 'content-pipeline',
        runId: currentRunId
    });
    // Apply suggested fixes
}
```

## 📝 Best Practices

1. **Always use monitoring** cho production workflows
2. **Log tất cả steps** để dễ debug
3. **Implement graceful shutdown** cho long-running tasks
4. **Use skills** cho complex logic thay vì hardcode
5. **Test với single brand** trước khi chạy multi-brand

## 🚀 Next Steps

1. Setup monitoring dashboard
2. Migrate existing workflows sang monitored version
3. Create n8n workflows cho scheduling
4. Implement custom skills cho business logic riêng
5. Setup alerts qua Telegram cho critical failures

---

Cần hỗ trợ thêm? Check logs tại `logs/` hoặc xem real-time dashboard!