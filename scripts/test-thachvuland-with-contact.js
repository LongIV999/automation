#!/usr/bin/env node

/**
 * Test: Tạo single post BĐS với thông tin liên hệ mới
 */

const { generateCaption } = require('../brands/thachvuland/caption-helper');
const fs = require('fs').promises;
const path = require('path');

async function createTestContent() {
  console.log('🏡 Tạo content bất động sản với thông tin liên hệ mới...\n');

  // Content template
  const content = {
    headline: '🏡 CĂN HỘ CAO CẤP PHÚ ĐÔNG SKY ONE',
    description: 'Sở hữu ngay căn hộ 2PN tại vị trí vàng Bình Dương, giá chỉ từ 1.5 tỷ!',
    highlights: [
      '✨ Vị trí đắc địa - Gần KCN VSIP, dễ cho thuê',
      '🏗️ Tiến độ nhanh - Bàn giao Q4/2026',
      '💰 Thanh toán linh hoạt - 20% ký HĐMB, hỗ trợ vay 70%',
      '📜 Pháp lý minh bạch - Sổ hồng riêng từng căn',
      '🎁 Ưu đãi lớn - Chiết khấu đến 200 triệu cho khách đặt sớm'
    ],
    cta: 'Đặt chỗ ngay hôm nay để nhận ưu đãi tốt nhất!',
    hashtags: '#PhuDongSkyOne #BatDongSanBinhDuong #CanHoCaoCapBinhDuong #DauTuBDS #ThachVuLand #BDS2026 #SoHongRieng #KCNVsip'
  };

  // Generate caption with contact info
  const caption = await generateCaption(content);

  console.log('📝 CAPTION ĐÃ TẠO:');
  console.log('='.repeat(60));
  console.log(caption);
  console.log('='.repeat(60));

  // Create full content JSON
  const fullContent = {
    formatType: 'single-post',
    slideCount: 1,
    dimensions: {
      width: 1080,
      height: 1080
    },
    brand: 'thachvuland',
    topic: 'Căn Hộ Phú Đông Sky One - Bình Dương',
    slides: [
      {
        type: 'single-post',
        headline: 'PHÚ ĐÔNG SKY ONE',
        subheadline: 'Căn Hộ Cao Cấp Bình Dương',
        content: 'Sở hữu ngay căn 2PN chỉ từ 1.5 tỷ',
        highlights: [
          '✨ Vị trí vàng gần KCN VSIP',
          '🏗️ Bàn giao Q4/2026',
          '💰 Thanh toán 20% - Vay 70%',
          '🎁 Ưu đãi đến 200 triệu'
        ],
        cta: 'Liên hệ: 0903.469.888',
        footer: '32 đường 40, KDC Vạn Phúc, TP Thủ Đức'
      }
    ],
    designStyle: 'modern-minimal',
    colors: {
      primary: '#0A2540',
      background: '#F4F3EE',
      accent: '#4A7C59',
      text: '#0A2540'
    },
    branding: {
      logoText: 'Thach Vu Land',
      cornerText: 'THACHVULAND',
      website: 'thachvuland.com'
    },
    caption: caption,
    keywords: 'bất động sản, Bình Dương, căn hộ, Phú Đông Sky One, đầu tư',
    targetAudience: 'Người mua nhà lần đầu, Nhà đầu tư BĐS',
    priority: 'High'
  };

  // Save to file
  const outputPath = path.join(__dirname, '../carousel-generator/content/thachvuland-phu-dong-sky-one.json');
  await fs.writeFile(outputPath, JSON.stringify(fullContent, null, 2));

  console.log(`\n✅ Content đã được lưu: ${outputPath}`);
  console.log(`\n📊 Chi tiết:`);
  console.log(`  - Format: Single Post`);
  console.log(`  - Topic: ${fullContent.topic}`);
  console.log(`  - Caption length: ${caption.length} ký tự`);
  console.log(`  - Contact info: ✅ Đã thêm`);

  console.log(`\n💡 Bước tiếp theo:`);
  console.log(`  1. Tạo ảnh: cd scripts/carousel-generator && node generator.js content/thachvuland-phu-dong-sky-one.json`);
  console.log(`  2. Upload: cd scripts/drive-uploader && node test-upload-single-post.js`);

  return fullContent;
}

createTestContent().catch(console.error);
