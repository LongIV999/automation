# AUTO-DELETE LOCAL IMAGES - HƯỚNG DẪN SỬ DỤNG

## 🎯 Tổng quan

Tính năng **AUTO-DELETE** giúp tự động xóa ảnh local sau khi upload thành công lên Google Drive, tiết kiệm dung lượng đĩa cứng.

**Lợi ích:**
- ✅ Tiết kiệm dung lượng disk (mỗi carousel ~1-2MB)
- ✅ Tự động dọn dẹp output folder
- ✅ Ảnh vẫn an toàn trên Google Drive
- ✅ Có thể re-generate bất cứ lúc nào từ content JSON

**An toàn:**
- ✅ Chỉ xóa SAU KHI upload thành công
- ✅ Default là KHÔNG xóa (phải bật thủ công)
- ✅ Có nhiều options để kiểm soát
- ✅ Log rõ ràng những file đã xóa

---

## 🔧 CÁC CÁCH SỬ DỤNG

### Option 1: Bật toàn cục trong .env (Recommended cho production)

Chỉnh sửa file `.env`:

```bash
# Auto-delete local images after successful upload
AUTO_DELETE_AFTER_UPLOAD=true
```

**Sau đó:**
- Mọi upload sẽ TỰ ĐỘNG xóa ảnh local
- Không cần thêm flag khi chạy lệnh

**Khi nào dùng:**
- Khi bạn CHẮC CHẮN workflow đã ổn định
- Khi đĩa cứng sắp đầy
- Khi tạo nhiều posts mỗi ngày

---

### Option 2: Dùng flag --delete (Recommended cho testing)

Upload và xóa cho 1 lần cụ thể:

```bash
cd /Users/admin/automation/scripts/drive-uploader

# Upload + delete
node upload.js ../carousel-generator/output/ai-tips-hero --delete

# Hoặc shorthand
node upload.js ../carousel-generator/output/ai-tips-hero -d
```

**Khi nào dùng:**
- Khi muốn kiểm soát từng lần upload
- Khi test tính năng mới
- Khi chưa chắc chắn 100%

---

### Option 3: Override với --keep

Nếu `.env` có `AUTO_DELETE_AFTER_UPLOAD=true` nhưng lần này muốn GIỮ:

```bash
node upload.js ../carousel-generator/output/important-post --keep

# Hoặc shorthand
node upload.js ../carousel-generator/output/important-post -k
```

**Khi nào dùng:**
- Post quan trọng muốn backup local
- Test/debug cần giữ ảnh
- Chưa chắc chắn sẽ dùng ảnh này

---

### Option 4: Dùng với create-and-publish.sh

Script tự động cũng hỗ trợ --delete:

```bash
cd /Users/admin/automation/scripts/content-automation

# Workflow đầy đủ + auto-delete
./create-and-publish.sh content/my-post.json readablePreview --delete

# Hoặc
./create-and-publish.sh content/my-post.json --delete

# Keep images
./create-and-publish.sh content/my-post.json --keep
```

---

## 📊 DEMO OUTPUT

### Khi delete được enable:

```bash
node upload.js ../carousel-generator/output/ai-tips-hero --delete
```

**Output:**

```
🚀 Starting Google Drive upload...
✅ Created folder: 2026-01-09_ai-tips-hero
📁 Folder ID: 1BKD-...

📸 Found 7 images to upload

[1/7] Uploading: 01.png...
✅ Uploaded: 01.png

[2/7] Uploading: 02.png...
✅ Uploaded: 02.png

...

[7/7] Uploading: 07.png...
✅ Uploaded: 07.png

🎉 Upload completed successfully!

📋 IMPORTANT - Copy this info:
────────────────────────────────────────────────────────────
Folder Name: 2026-01-09_ai-tips-hero
Folder ID: 1BKD-7ose12tkBE0yJjCGh5-xg05O-0w1
Folder Link: https://drive.google.com/...
────────────────────────────────────────────────────────────

📊 Updating Google Sheets...
✓ Column mapping loaded
✓ Next empty row: 3
✅ Google Sheets auto-updated!
📝 Row: 3, Post ID: post_1736468901234

────────────────────────────────────────────────────────────
🗑️  Deleting local images...
  ✓ Deleted: 01.png
  ✓ Deleted: 02.png
  ✓ Deleted: 03.png
  ✓ Deleted: 04.png
  ✓ Deleted: 05.png
  ✓ Deleted: 06.png
  ✓ Deleted: 07.png

✅ Deleted 7 local images
✓ Deleted empty folder: ai-tips-hero
💾 Disk space saved! Images uploaded safely to Drive.
```

### Khi delete KHÔNG enable (default):

```
...
🎉 Upload completed successfully!

📋 IMPORTANT - Copy this info:
────────────────────────────────────────────────────────────
Folder Name: 2026-01-09_ai-tips-hero
Folder ID: 1BKD-...
────────────────────────────────────────────────────────────

💾 Local images kept at: /Users/admin/automation/scripts/carousel-generator/output/ai-tips-hero
💡 To auto-delete after upload, set AUTO_DELETE_AFTER_UPLOAD=true in .env
```

---

## ⚙️ CONFIGURATION

### File .env

```bash
# Auto-delete local images after successful upload (default: false)
# Set to "true" to enable automatic deletion (SAVES DISK SPACE!)
# WARNING: Deleted images cannot be recovered unless you re-generate them
AUTO_DELETE_AFTER_UPLOAD=false
```

**Options:**
- `false` - Không xóa (default, an toàn)
- `true` - Tự động xóa sau mọi upload

---

## ✅ AN TOÀN & BẢO MẬT

### Tính năng an toàn:

1. **Chỉ xóa sau upload THÀNH CÔNG**
   - Nếu upload fail → Không xóa
   - Nếu 1 file upload fail → Chỉ xóa files đã upload thành công

2. **Log chi tiết**
   - Liệt kê từng file đã xóa
   - Báo lỗi nếu không xóa được file nào

3. **Xóa folder nếu trống**
   - Tự động cleanup folder rỗng
   - Không xóa nếu còn file

4. **Default là KHÔNG xóa**
   - Phải BẬT thủ công trong .env hoặc dùng flag
   - Tránh xóa nhầm

---

## 🔄 WORKFLOW KHUYẾN NGHỊ

### Phase 1: Testing (1-2 tuần đầu)

```bash
# Giữ AUTO_DELETE_AFTER_UPLOAD=false trong .env

# Upload + delete thủ công cho từng post
node upload.js output/post1 --delete
node upload.js output/post2 --delete

# Kiểm tra Drive để chắc ảnh đã lên
# Kiểm tra Sheets để chắc data đã update
```

### Phase 2: Semi-Auto (sau khi confident)

```bash
# Vẫn giữ AUTO_DELETE_AFTER_UPLOAD=false

# Nhưng thêm --delete vào script
./create-and-publish.sh content/post.json --delete

# Hoặc alias
alias publish-clean='./create-and-publish.sh $1 readablePreview --delete'
publish-clean content/post.json
```

### Phase 3: Full Auto (production)

```bash
# Bật trong .env
AUTO_DELETE_AFTER_UPLOAD=true

# Chạy bình thường, tự động xóa
./create-and-publish.sh content/post.json

# Nếu cần giữ 1 post quan trọng
./create-and-publish.sh content/important.json --keep
```

---

## 💾 DISK SPACE SAVING

### Ước tính tiết kiệm:

| Carousel | Số slides | Kích thước | Tiết kiệm/tháng (30 posts) |
|----------|-----------|------------|----------------------------|
| Nhỏ | 5 slides | ~800KB | ~24MB |
| Trung bình | 7 slides | ~1.5MB | ~45MB |
| Lớn | 10 slides | ~2.5MB | ~75MB |

**Sau 1 năm:**
- Small: ~288MB
- Medium: ~540MB
- Large: ~900MB

---

## ❓ FAQ

**Q: Nếu tôi xóa nhầm thì sao?**
A: Bạn có thể re-generate từ content JSON:
```bash
node generator.js content/my-post.json
```

**Q: Có backup tự động không?**
A: Không. Nhưng ảnh đã lên Google Drive là backup rồi.

**Q: Xóa cả content JSON không?**
A: KHÔNG. Chỉ xóa ảnh PNG trong output folder.

**Q: Có thể undo không?**
A: Không thể undo sau khi xóa. Nhưng có thể download lại từ Drive hoặc re-generate.

**Q: Delete có xóa caption file không?**
A: KHÔNG. Chỉ xóa ảnh trong output/. Caption file ở content-calendar/ vẫn giữ nguyên.

**Q: Nếu upload thất bại thì sao?**
A: Script sẽ KHÔNG xóa ảnh nếu upload fail.

---

## 🎯 BEST PRACTICES

### ✅ NÊN:

1. **Test trước khi bật toàn cục**
   - Dùng --delete cho 5-10 posts
   - Kiểm tra Drive, Sheets
   - Sau đó mới set AUTO_DELETE_AFTER_UPLOAD=true

2. **Backup content JSON**
   - Git commit content files thường xuyên
   - Content JSON là nguồn duy nhất để re-generate

3. **Check Drive sau upload**
   - Đảm bảo ảnh đã lên Drive
   - Đảm bảo Sheets đã update

4. **Dùng --keep cho posts quan trọng**
   - Posts cần edit sau
   - Posts cần backup local

### ❌ KHÔNG NÊN:

1. **Bật AUTO_DELETE ngay từ đầu**
   - Chưa test → Có thể xóa nhầm

2. **Xóa content JSON sau khi upload**
   - Cần giữ để re-generate nếu cần

3. **Rely 100% vào auto-delete**
   - Vẫn nên check Drive thường xuyên

---

## 🧪 TESTING

### Test 1: Upload thành công + Delete

```bash
# 1. Generate carousel test
cd scripts/carousel-generator
node generator.js content/test-post.json

# 2. Upload + delete
cd ../drive-uploader
node upload.js ../carousel-generator/output/test-post --delete

# 3. Kiểm tra:
# - Drive có folder + ảnh
# - Local output/test-post đã bị xóa
# - Sheets có row mới
```

### Test 2: Upload fail → Không delete

```bash
# 1. Disconnect internet (simulate fail)
# 2. Try upload
node upload.js ../carousel-generator/output/test-post --delete

# 3. Kết quả:
# - Upload fail
# - Ảnh local VẪN CÒN (không bị xóa)
```

### Test 3: Override với --keep

```bash
# 1. Set AUTO_DELETE_AFTER_UPLOAD=true trong .env
# 2. Upload với --keep
node upload.js ../carousel-generator/output/test-post --keep

# 3. Kết quả:
# - Upload thành công
# - Ảnh local VẪN CÒN (override)
```

---

## 📝 COMMAND REFERENCE

### Upload commands:

```bash
# Không xóa (default)
node upload.js <images-dir>

# Xóa sau upload
node upload.js <images-dir> --delete
node upload.js <images-dir> -d

# Giữ ảnh (override config)
node upload.js <images-dir> --keep
node upload.js <images-dir> -k

# Với folder name custom
node upload.js <images-dir> "Custom Name" --delete
```

### Script commands:

```bash
# Default (theo .env)
./create-and-publish.sh content/post.json

# Force delete
./create-and-publish.sh content/post.json readablePreview --delete

# Force keep
./create-and-publish.sh content/post.json readablePreview --keep
```

---

## 🔍 TROUBLESHOOTING

### Lỗi: "Failed to delete X files"

**Nguyên nhân:** Permission issues hoặc file đang được dùng

**Giải pháp:**
```bash
# Check permissions
ls -la output/post-name/

# Xóa thủ công
rm -rf output/post-name/
```

### Lỗi: Xóa nhưng folder vẫn còn

**Nguyên nhân:** Folder còn file khác (không phải PNG)

**Giải pháp:**
```bash
# Check folder
ls output/post-name/

# Xóa thủ công nếu cần
rm -rf output/post-name/
```

### Upload thành công nhưng không xóa

**Nguyên nhân:** Flag hoặc config sai

**Debug:**
```bash
# Check .env
cat .env | grep AUTO_DELETE

# Check command
node upload.js output/post --delete  # Phải có --delete
```

---

**Tạo bởi:** Long Best AI
**Ngày:** 2026-01-09
**Tính năng:** Auto-Delete Local Images After Upload
