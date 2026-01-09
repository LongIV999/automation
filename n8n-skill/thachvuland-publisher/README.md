# Hướng dẫn Thiết lập Tự động hóa Thach Vu Land

Bộ quy trình này được thiết kế dựa trên Long Best AI nhưng đã được tùy biến hoàn toàn cho lĩnh vực Bất động sản (Thach Vu Land).

## 1. Cấu trúc thư mục
- **Chiến lược & Context**: `/Users/admin/automation/context-thachvuland.md`
- **Công cụ tạo ảnh**: `/Users/admin/automation/scripts/carousel-generator/generator-tvland.js`
- **Workflow n8n**: `/Users/admin/automation/n8n-skill/thachvuland-publisher/autopost-tvland.json`

## 2. Thiết lập Ban đầu

### Bước 1: Google Sheet Content Plan
Tạo một Google Sheet mới với các cột sau (giống Long Best AI):
- `Ngày`
- `Giờ`
- `Nội dung` (Caption cho Facebook)
- `Status` (Để là "Ready" khi muốn post)
- `Drive_Folder_ID` (ID folder chứa ảnh trên Google Drive)
- `row_number` (Công thức `=ROW()`)
- `Link bài Post` (Để n8n điền vào)
- `Trạng Thái` (Để n8n điền "Hoàn Thành")

### Bước 2: Cấu hình n8n
1. Import file `autopost-tvland.json` vào n8n.
2. Mở node **Get row(s) in sheet1**:
   - Thay thế `Document ID` bằng ID của Google Sheet bạn vừa tạo.
   - Chọn đúng `Sheet Name`.
3. Mở node **Update row in sheet**:
   - Thay thế `Document ID` tương tự.
4. Cập nhật Credentials:
   - **Facebook Graph API**: Chọn credential cho Page Thach Vu Land (hoặc tạo mới).
   - **Google Drive / Sheets**: Đảm bảo đã kết nối.

## 3. Quy trình Tạo nội dung (Hàng ngày)

### Cách 1: Tạo ảnh bằng Script (Khuyên dùng)
Sử dụng script `generator-tvland.js` với giao diện Navy Blue/Sage Green chuyên nghiệp.

```bash
cd /Users/admin/automation/scripts/carousel-generator
node generator-tvland.js <đường_dẫn_file_content.json>
```

File JSON mẫu (`content.json`):
```json
{
  "slides": [
    {
      "type": "title",
      "headline": "5 RỦI RO KHI MUA ĐẤT NỀN 2025",
      "subheadline": "Đừng để mất tiền oan vì thiếu hiểu biết"
    },
    {
      "type": "content",
      "headline": "1. Pháp lý chưa hoàn thiện",
      "content": "Mua đất chưa có sổ đỏ hoặc đang tranh chấp là rủi ro lớn nhất..."
    },
    {
      "type": "quote",
      "headline": "Lời khuyên chuyên gia",
      "content": "Không bao giờ đặt cọc nếu chưa nhìn thấy sổ đỏ gốc.",
      "subheadline": "Thach Vu Analysis"
    }
  ]
}
```

### Cách 2: Upload thủ công
1. Upload ảnh đã tạo lên Google Drive.
2. Copy ID folder vào Google Sheet cột `Drive_Folder_ID`.
3. Đặt Status là `Ready`.
4. n8n sẽ tự động lấy ảnh và đăng bài theo lịch.

## 4. Lưu ý về Thương hiệu
Màu sắc đã được cấu hình trong `generator-tvland.js`:
- **Xanh Navy (#0A2540)**: Uy tín, chuyên nghiệp.
- **Xanh Sage (#4A7C59)**: Bền vững, đất đai.
- **Cam Đất (#C15F3C)**: Điểm nhấn (kế thừa từ LB AI nhưng trầm hơn).
- **Font**: Merriweather (Tiêu đề) & Inter (Nội dung).
