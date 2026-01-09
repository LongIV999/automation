/**
 * Long Best AI - Content Planner
 *
 * Tạo kế hoạch nội dung dài hạn và update vào Google Sheets tab "ToTable"
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
require('dotenv').config();

// Cấu hình
const CONFIG = {
  credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json',
  tokenPath: process.env.GOOGLE_TOKEN_PATH || './token.json',
  spreadsheetId: process.env.GOOGLE_SHEETS_ID || '1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0',
  sheetName: 'ToTable',
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
  ]
};

/**
 * Authorize với Google API
 */
async function authorize() {
  const credentials = JSON.parse(await fs.readFile(CONFIG.credentialsPath, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const token = JSON.parse(await fs.readFile(CONFIG.tokenPath, 'utf-8'));
    oAuth2Client.setCredentials(token);
  } catch (error) {
    throw new Error('Token not found. Please run: node setup-auth.js');
  }

  return oAuth2Client;
}

/**
 * Đọc header row của tab ToTable
 */
async function readHeaders() {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.spreadsheetId,
    range: `${CONFIG.sheetName}!A1:Z1`
  });

  const headers = response.data.values ? response.data.values[0] : [];
  console.log('📋 Tab ToTable headers:', headers);
  return headers;
}

/**
 * Đọc tất cả data hiện tại trong tab ToTable
 */
async function readExistingData() {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.spreadsheetId,
    range: `${CONFIG.sheetName}!A:Z`
  });

  return response.data.values || [];
}

/**
 * Tìm row trống tiếp theo
 */
async function getNextEmptyRow() {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.spreadsheetId,
    range: `${CONFIG.sheetName}!A:A`
  });

  const rows = response.data.values || [];
  return rows.length + 1;
}

/**
 * Thêm content plan vào Google Sheets
 */
async function addContentPlan(contentItems) {
  console.log('\n📊 Updating ToTable with content plan...');

  try {
    const auth = await authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    // Đọc headers để map columns
    const headers = await readHeaders();
    const nextRow = await getNextEmptyRow();

    console.log(`✓ Starting from row: ${nextRow}`);
    console.log(`✓ Adding ${contentItems.length} content items...`);

    const updates = [];

    contentItems.forEach((item, index) => {
      const currentRow = nextRow + index;
      const rowUpdates = [];

      // Map data theo headers
      headers.forEach((header, colIndex) => {
        const columnLetter = String.fromCharCode(65 + colIndex);
        const value = item[header] || '';

        if (value) {
          rowUpdates.push({
            range: `${CONFIG.sheetName}!${columnLetter}${currentRow}`,
            values: [[value]]
          });
        }
      });

      updates.push(...rowUpdates);
    });

    // Batch update
    if (updates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: CONFIG.spreadsheetId,
        resource: {
          valueInputOption: 'USER_ENTERED',
          data: updates
        }
      });

      console.log('✅ Content plan updated successfully!');
      console.log(`📝 Added ${contentItems.length} items starting from row ${nextRow}`);
      console.log(`🔗 Sheet: https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}`);

      return {
        success: true,
        itemsAdded: contentItems.length,
        startRow: nextRow
      };
    }

  } catch (error) {
    console.error('❌ Error updating ToTable:', error.message);
    throw error;
  }
}

/**
 * Tạo kế hoạch nội dung dài hạn
 * Match với columns: Date, Week, Topic, Content_Type, Status, Priority, Keywords, Target_Audience, Research_Notes, Assigned_To, Post_ID
 */
function generateContentPlan(weeks = 4) {
  const contentDatabase = [
    // AI Tips & Tutorials
    {
      topic: '5 Mẹo ChatGPT Cho Người Mới Bắt Đầu',
      contentType: 'Tutorial Carousel',
      keywords: 'ChatGPT, AI, beginners, tips',
      targetAudience: 'Người mới bắt đầu với AI',
      researchNotes: '7 slides: intro + 5 tips + CTA. Focus on practical examples.',
      priority: 'High'
    },
    {
      topic: 'Prompt Engineering 101: Viết Prompt Hiệu Quả',
      contentType: 'Tutorial Carousel',
      keywords: 'prompt engineering, AI tips, ChatGPT',
      targetAudience: 'Content creators, marketers',
      researchNotes: 'Before/after examples, common mistakes, best practices',
      priority: 'High'
    },
    {
      topic: 'Tự Động Hóa Email Marketing Với AI',
      contentType: 'Tutorial Carousel',
      keywords: 'email marketing, automation, AI tools',
      targetAudience: 'Email marketers, SMB owners',
      researchNotes: 'Tools: ChatGPT, n8n, Gmail API. Show workflow.',
      priority: 'Medium'
    },
    {
      topic: 'AI Content Calendar: Lên Kế Hoạch 1 Tháng Trong 10 Phút',
      contentType: 'Tutorial Carousel',
      keywords: 'content planning, AI automation, calendar',
      targetAudience: 'Social media managers',
      researchNotes: 'Demo với ChatGPT + Google Sheets integration',
      priority: 'High'
    },
    {
      topic: '7 Công Cụ AI Miễn Phí Cho Content Creator',
      contentType: 'Listicle Carousel',
      keywords: 'AI tools, free, content creation',
      targetAudience: 'Content creators, freelancers',
      researchNotes: 'ChatGPT, Nano Banana, Canva AI, etc. Include links.',
      priority: 'Medium'
    },

    // Nano Banana Content
    {
      topic: 'Top 7 Nano Banana Prompts Cho Portrait Photography',
      contentType: 'Showcase Carousel',
      keywords: 'Nano Banana, AI photography, prompts',
      targetAudience: 'Photographers, designers',
      researchNotes: 'Show actual examples with prompts. Before/after comparisons.',
      priority: 'High'
    },
    {
      topic: 'Tạo Product Photos Chuyên Nghiệp Với Nano Banana',
      contentType: 'Tutorial Carousel',
      keywords: 'product photography, e-commerce, AI',
      targetAudience: 'E-commerce sellers, dropshippers',
      researchNotes: 'Step-by-step tutorial, multiple angles, lighting tips',
      priority: 'High'
    },
    {
      topic: 'Nano Banana vs MidJourney: So Sánh Chi Tiết',
      contentType: 'Comparison Carousel',
      keywords: 'AI comparison, Nano Banana, MidJourney',
      targetAudience: 'AI enthusiasts, designers',
      researchNotes: 'Price, quality, speed, use cases. Honest comparison.',
      priority: 'Medium'
    },
    {
      topic: 'Fashion Photography AI: Xu Hướng 2026',
      contentType: 'Trend Carousel',
      keywords: 'fashion, AI photography, trends 2026',
      targetAudience: 'Fashion brands, influencers',
      researchNotes: 'Showcase latest Nano Banana fashion outputs',
      priority: 'Low'
    },
    {
      topic: 'Behind The Scenes: AI Image Generation Workflow',
      contentType: 'Process Carousel',
      keywords: 'workflow, AI process, Nano Banana',
      targetAudience: 'Creative professionals',
      researchNotes: 'From idea → prompt → generation → editing',
      priority: 'Medium'
    },

    // Case Studies
    {
      topic: 'Case Study: Tăng Engagement 300% Với AI Content',
      contentType: 'Case Study Carousel',
      keywords: 'case study, engagement, AI success',
      targetAudience: 'Business owners, marketers',
      researchNotes: 'Real data, timeline, tools used, results',
      priority: 'High'
    },
    {
      topic: 'Từ 0 Đến 10K Followers: Chiến Lược AI Content',
      contentType: 'Success Story Carousel',
      keywords: 'growth strategy, AI, followers',
      targetAudience: 'Aspiring influencers, brands',
      researchNotes: '90-day plan, specific tactics, posting schedule',
      priority: 'High'
    },
    {
      topic: 'ROI Từ AI Automation: Tính Toán Chi Tiết',
      contentType: 'Data Carousel',
      keywords: 'ROI, automation, business case',
      targetAudience: 'Decision makers, SMB owners',
      researchNotes: 'Time saved vs cost, break-even analysis',
      priority: 'Medium'
    },
    {
      topic: 'E-commerce + AI: Tăng Doanh Thu 200%',
      contentType: 'Case Study Carousel',
      keywords: 'e-commerce, AI, sales growth',
      targetAudience: 'Online store owners',
      researchNotes: 'Product photos, descriptions, customer service AI',
      priority: 'High'
    },

    // Automation & Tools
    {
      topic: 'Setup N8N Automation Trong 15 Phút',
      contentType: 'Quick Start Guide',
      keywords: 'n8n, automation, tutorial',
      targetAudience: 'Tech-savvy marketers',
      researchNotes: 'Installation → first workflow → Facebook posting',
      priority: 'Medium'
    },
    {
      topic: 'Google Sheets + AI: Tự Động Hóa Toàn Bộ',
      contentType: 'Integration Tutorial',
      keywords: 'Google Sheets, automation, AI',
      targetAudience: 'Data-driven marketers',
      researchNotes: 'API setup, sheets updater, auto-posting flow',
      priority: 'High'
    },
    {
      topic: 'Facebook Auto-Posting: Complete Workflow',
      contentType: 'Technical Tutorial',
      keywords: 'Facebook, automation, workflow',
      targetAudience: 'Social media managers',
      researchNotes: 'Drive → Sheets → n8n → Facebook. Full setup.',
      priority: 'High'
    },
    {
      topic: '5 Sai Lầm Khi Tự Động Hóa Content',
      contentType: 'Mistakes Carousel',
      keywords: 'automation mistakes, lessons learned',
      targetAudience: 'Automation beginners',
      researchNotes: 'Common pitfalls, how to avoid, best practices',
      priority: 'Medium'
    },

    // Engagement & Tips
    {
      topic: 'Carousel Design: 7 Nguyên Tắc Vàng',
      contentType: 'Design Tips Carousel',
      keywords: 'carousel design, visual tips, engagement',
      targetAudience: 'Designers, content creators',
      researchNotes: 'Typography, colors, layout, flow. Show examples.',
      priority: 'High'
    },
    {
      topic: 'Viết Caption Viral: Công Thức 4 Bước',
      contentType: 'Writing Tips Carousel',
      keywords: 'caption writing, engagement, copywriting',
      targetAudience: 'Content creators, brands',
      researchNotes: 'Hook, value, story, CTA. Template provided.',
      priority: 'High'
    },
    {
      topic: 'Best Time To Post: Data-Driven Analysis 2026',
      contentType: 'Data Carousel',
      keywords: 'posting time, analytics, engagement',
      targetAudience: 'Social media managers',
      researchNotes: 'Vietnam timezone, Facebook algorithm, testing results',
      priority: 'Low'
    },
    {
      topic: 'Hashtag Strategy: Tăng Reach 10X',
      contentType: 'Strategy Carousel',
      keywords: 'hashtags, reach, Facebook',
      targetAudience: 'Small businesses, creators',
      researchNotes: 'Research tools, quantity, mix of popular/niche',
      priority: 'Medium'
    }
  ];

  const plan = [];
  const startDate = new Date();

  // Lấy thứ Hai tuần sau (để có thời gian chuẩn bị)
  const nextMonday = new Date(startDate);
  nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7) + 7);

  let contentIndex = 0;

  for (let week = 0; week < weeks; week++) {
    const weekNumber = week + 1;

    // Mỗi tuần 3 posts (Thứ 2, 4, 6)
    const postDays = [0, 2, 4]; // Monday, Wednesday, Friday

    postDays.forEach((dayOffset, postInWeek) => {
      if (contentIndex >= contentDatabase.length) {
        contentIndex = 0; // Loop lại nếu hết content
      }

      const content = contentDatabase[contentIndex];
      contentIndex++;

      // Tính ngày post
      const postDate = new Date(nextMonday);
      postDate.setDate(postDate.getDate() + (week * 7) + dayOffset);

      const dateStr = postDate.toISOString().split('T')[0];

      // Tạo Post_ID từ topic
      const topicSlug = content.topic
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 40);

      const postId = `${dateStr}_${topicSlug}`;

      plan.push({
        'Date': dateStr,
        'Week': `Week ${weekNumber}`,
        'Topic': content.topic,
        'Content_Type': content.contentType,
        'Status': week === 0 ? 'In Progress' : 'Planned',
        '**Priority**': content.priority,
        'Keywords': content.keywords,
        'Target_Audience': content.targetAudience,
        'Research_Notes': content.researchNotes,
        'Assigned_To': 'Long Best AI',
        'Post_ID': postId
      });
    });
  }

  return plan;
}

// CLI commands
async function main() {
  const command = process.argv[2];

  if (!command) {
    console.log('📋 Long Best AI - Content Planner');
    console.log('\nUsage:');
    console.log('  node content-planner.js headers          # Xem cấu trúc tab ToTable');
    console.log('  node content-planner.js preview [weeks]  # Preview content plan');
    console.log('  node content-planner.js generate [weeks] # Tạo và update content plan');
    console.log('\nExample:');
    console.log('  node content-planner.js generate 8       # Tạo plan 8 tuần');
    process.exit(0);
  }

  try {
    switch (command) {
      case 'headers': {
        const headers = await readHeaders();
        console.log('\n✅ Headers found:', headers.length);
        break;
      }

      case 'preview': {
        const weeks = parseInt(process.argv[3]) || 4;
        const plan = generateContentPlan(weeks);
        console.log(`\n📋 Content Plan Preview (${weeks} weeks, ${plan.length} posts):\n`);
        plan.forEach((item, i) => {
          console.log(`${i + 1}. ${item.Date} (${item.Week}) - ${item.Content_Type}`);
          console.log(`   📌 ${item.Topic}`);
          console.log(`   🎯 ${item.Target_Audience} | Priority: ${item['**Priority**']}`);
          console.log('');
        });
        break;
      }

      case 'generate': {
        const weeks = parseInt(process.argv[3]) || 4;
        const plan = generateContentPlan(weeks);

        console.log(`\n🎯 Generating content plan for ${weeks} weeks...`);
        console.log(`📊 Total posts: ${plan.length}`);

        const result = await addContentPlan(plan);

        if (result.success) {
          console.log('\n✅ Content plan added to ToTable!');
          console.log(`📝 ${result.itemsAdded} items added starting from row ${result.startRow}`);
        }
        break;
      }

      default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('Run without arguments to see usage.');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateContentPlan,
  addContentPlan,
  readHeaders
};
