# Hướng Dẫn Sử Dụng Agentic Agent

Hệ thống tự động hóa hoàn toàn quy trình tạo nội dung từ ý tưởng đến đăng bài.

## Quy trình
1.  **Agent Writer**: Claude AI viết nội dung & cấu trúc JSON.
2.  **Visual Generator**: Tạo ảnh carousel thiết kế chuẩn branding.
3.  **Cloud Sync**: Upload lên Google Drive & cập nhật Google Sheets.
4.  **Automation**: n8n (hoặc Make) sẽ lấy dữ liệu từ Sheets để đăng Facebook.

## Cách sử dụng

Chạy lệnh sau tại thư mục `automation`:

```bash
node scripts/daily-agent.js "Chủ đề của bạn"
```

Ví dụ:
```bash
node scripts/daily-agent.js "5 Xu Hướng Marketing 2026"
```

## Cấu trúc
- `scripts/agent-writer`: Chứa logic AI viết bài (`writer.js`).
- `scripts/carousel-generator`: Chứa logic tạo ảnh (`generator.js`).
- `scripts/drive-uploader`: Chứa logic upload (`upload.js`).
- `scripts/daily-agent.js`: Script tổng điều phối.

## Cấu hình
- **API Key**: Đã lưu trong `.claude/settings.json`.
- **Sheet ID**: Cấu hình trong `scripts/drive-uploader/sheets-updater.js` hoặc `sync-drive-to-sheet.js`.
- **Drive Folder**: Mặc định tạo folder mới theo ngày.

## Troubleshooting
- Nếu lỗi API Token: Kiểm tra `.claude/settings.json`.
- Nếu lỗi Drive/Sheets: Kiểm tra `scripts/drive-uploader/token.json` (chạy `npm run auth` nếu hết hạn).
