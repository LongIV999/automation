/**
 * TÀI LIỆU TỐI ƯU HÓA GOOGLE SHEET CHO THACH VU LAND
 * ===================================================
 *
 * Sheet ID: 1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY
 * Workflow: /Users/admin/Downloads/autopost-tvland.json
 */

## CẤU TRÚC SHEET ĐÃ TỐI ƯU HÓA

### Tab "Post" (Sheet ID: 1123323036)

| Column | Header           | Mô tả                                    | Required | Filled By    |
|--------|------------------|------------------------------------------|----------|--------------|
| A      | Post_ID          | ID duy nhất của post                     | ✓        | Auto         |
| B      | Date_Created     | Ngày tạo content                         |          | Auto         |
| C      | Date_Planned     | Ngày dự kiến đăng                        |          | Manual       |
| D      | Topic            | Chủ đề của content                       |          | Auto/Manual  |
| E      | Caption          | Caption cho Facebook post                | ✓        | Manual       |
| F      | Drive_Folder_ID  | ID của folder chứa ảnh trên Drive        | ✓        | Auto         |
| G      | Drive_Link       | Link trực tiếp đến folder                |          | Auto         |
| H      | Status           | Trạng thái: Draft/Ready/Done             | ✓        | Manual→Auto  |
| I      | Type             | Loại content: Carousel/Image/Video       |          | Auto         |
| J      | Images_Count     | Số lượng ảnh trong carousel              |          | Auto         |
| K      | Keywords         | Keywords cho SEO                         |          | Manual       |
| L      | Target_Audience  | Đối tượng mục tiêu                       |          | Manual       |
| M      | Priority         | Độ ưu tiên: High/Medium/Low              |          | Manual       |
| N      | Research_Notes   | Ghi chú nghiên cứu                       |          | Manual       |
| O      | Post_URL         | URL Facebook sau khi đăng thành công     |          | n8n          |
| P      | Published_Date   | Ngày đăng thực tế                        |          | n8n          |
| Q      | Created_At       | Timestamp tạo record                     |          | Auto         |

---

## WORKFLOW N8N - FLOW CHI TIẾT

### 1. Trigger (Schedule Trigger)
- **Chạy mỗi**: 30 phút
- **Hoặc**: Manual trigger khi bấm "Execute workflow"

### 2. Get row(s) in sheet1
- **Tìm kiếm**: Sheet "Post" với Status = "Ready"
- **Lấy**: Row đầu tiên match (returnFirstMatch: true)
- **Trả về**: Object chứa toàn bộ columns

### 3. Search files and folders
- **Input**: `Drive_Folder_ID` từ step 2
- **Action**: List tất cả files trong folder
- **Output**: Array các files (id, name, mimeType)

### 4. Code in JavaScript
- **Action**: Sort files theo tên tự nhiên (1.png < 2.png < 10.png)
- **Lý do**: Đảm bảo thứ tự ảnh trong carousel

### 5. Loop Over Items
- **Action**: Lặp qua từng file (Split in Batches)
- **Branch 1**: Aggregate media IDs để tạo carousel
- **Branch 2**: Download và upload từng ảnh lên Facebook

### 6. Download file (Branch 2)
- **Input**: File ID từ loop
- **Action**: Download file từ Google Drive
- **Output**: Binary data

### 7. Facebook Graph API (Upload Photo)
- **Endpoint**: /photos
- **Method**: POST
- **Published**: false (không đăng ngay)
- **Output**: media_fbid

### 8. Edit Fields (Branch 1)
- **Action**: Extract `media_fbid` từ response
- **Output**: Chỉ giữ lại field `media_fbid`

### 9. Aggregate
- **Action**: Gộp tất cả `media_fbid` thành array
- **Output**: `attached_media` array

### 10. Facebook Graph API1 (Create Post)
- **Endpoint**: /feed
- **Method**: POST
- **Parameters**:
  - `message`: Lấy từ `Caption` column
  - `attached_media`: Array media_fbid từ step 9
- **Output**: Post ID

### 11. Update row in sheet
- **Action**: Update row với matching `Drive_Folder_ID`
- **Update**:
  - Status = "Done"
  - Post_URL = "fb.com/[post_id]"

---

## CÁC VẤN ĐỀ ĐÃ TỐI ƯU HÓA

### ✅ 1. Column Headers
**Trước**: Column 1, Column 2, ... (Không rõ ràng)
**Sau**: Post_ID, Caption, Drive_Folder_ID, ... (Semantic names)

### ✅ 2. Status Workflow
**Flow**: Draft → Ready → Done
- **Draft**: Content đang chuẩn bị
- **Ready**: Sẵn sàng để n8n autopost
- **Done**: Đã đăng thành công

### ✅ 3. Drive_Folder_ID Matching
**Workflow sử dụng**: `Drive_Folder_ID` làm matching key
**Lợi ích**: Tránh update nhầm row

### ✅ 4. Caption Format
**Best practices**:
```
Nội dung hấp dẫn về chủ đề...

📍 Chi tiết quan trọng
✨ Call to action

#BatDongSan #BinhDuong #ThachVuLand
```

### ✅ 5. Error Handling
**Nếu workflow fail**:
- Status vẫn là "Ready" → Sẽ retry lần sau
- Không update Sheet → Tránh mất data

---

## HƯỚNG DẪN SỬ DỤNG

### Tạo Content Mới

1. **Chạy generator**:
   ```bash
   cd /Users/admin/automation
   npm run daily -- thachvuland
   ```

2. **Upload lên Drive**:
   ```bash
   cd scripts/drive-uploader
   npm run upload:tvland
   ```

3. **Auto sync vào Sheet**:
   - Script `sync-drive-to-sheet.js` sẽ tự động thêm row
   - Status mặc định: "Ready"

4. **Review và adjust Caption**:
   - Mở Google Sheet
   - Chỉnh sửa Caption nếu cần
   - Kiểm tra Drive_Folder_ID đã đúng

5. **Trigger autopost**:
   - Đợi schedule (30 phút)
   - Hoặc manual trigger trong n8n

### Kiểm Tra Status

```bash
# Check sheet structure
node scripts/drive-uploader/check-thachvuland-sheet.js

# View trong browser
open "https://docs.google.com/spreadsheets/d/1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY"
```

---

## TROUBLESHOOTING

### Issue: Workflow không tìm thấy row
**Nguyên nhân**: Status không phải "Ready" (có thể có khoảng trắng)
**Giải pháp**: Đảm bảo Status = "Ready" (exact match, no spaces)

### Issue: Caption không hiển thị
**Nguyên nhân**: Column E trống hoặc sai format
**Giải pháp**: Điền Caption với UTF-8 encoding

### Issue: Drive_Folder_ID invalid
**Nguyên nhân**: ID không đúng format hoặc không có quyền
**Giải pháp**: Copy ID từ URL: `drive.google.com/drive/folders/[THIS_IS_THE_ID]`

### Issue: Post_URL không update
**Nguyên nhân**: Matching key `Drive_Folder_ID` không khớp
**Giải pháp**: Đảm bảo Drive_Folder_ID unique trong sheet

---

## MAINTENANCE

### Backup Sheet
```bash
# Export to JSON
node scripts/utils/backup-sheet.js thachvuland
```

### Archive Old Posts
- Tự động: Posts với Status="Done" và >30 ngày → Archive tab
- Manual: Chuyển sang tab "Archive" khi cần

### Clean Up Drive
- Xóa folders đã đăng sau 60 ngày (tuỳ chọn)
- Giữ backup trong Archive

---

## KẾT LUẬN

✅ Sheet structure đã được tối ưu hóa hoàn toàn cho workflow n8n
✅ Tất cả required fields đã được map đúng
✅ Sample row đã được thêm để test
✅ Documentation đầy đủ cho maintenance

**Next Steps**:
1. Test workflow với sample row
2. Điều chỉnh schedule nếu cần (hiện tại: 30 phút)
3. Monitor performance và error logs
