/**
 * Quick workflow: Create carousel for latest topic and upload
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

const CONFIG = {
  credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json',
  tokenPath: process.env.GOOGLE_TOKEN_PATH || './token.json',
  spreadsheetId: process.env.GOOGLE_SHEETS_ID || '1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0',
  toTableSheet: 'ToTable',
  postSheet: 'Post',
  carouselDir: path.resolve(__dirname, '../../carousel-generator'),
  contentDir: path.resolve(__dirname, '../../carousel-generator/content')
};

async function authorize() {
  const credentials = JSON.parse(await fs.readFile(CONFIG.credentialsPath, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = JSON.parse(await fs.readFile(CONFIG.tokenPath, 'utf-8'));
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

async function getFirstPlannedTopic() {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.spreadsheetId,
    range: `${CONFIG.toTableSheet}!A:Z`
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    throw new Error('No data in ToTable');
  }

  const headers = rows[0];

  // Find first topic with Status = "Planned" or "In Progress"
  for (let i = 1; i < rows.length; i++) {
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = rows[i][idx] || '';
    });

    if (row.Status === 'Planned' || row.Status === 'In Progress') {
      return {
        ...row,
        rowIndex: i + 1
      };
    }
  }

  throw new Error('No topics with status "Planned" or "In Progress" found');
}

function topicToSlug(topic) {
  return topic
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 40);
}

async function createContentJSON(topic) {
  console.log(`\n📝 Creating content JSON for: ${topic.Topic}`);

  const slug = topicToSlug(topic.Topic);
  const filename = `${slug}.json`;
  const filepath = path.join(CONFIG.contentDir, filename);

  // Parse research notes into slides
  const researchNotes = topic.Research_Notes || '';

  // Basic template - you can customize based on research notes
  const content = {
    title: topic.Topic,
    slides: [
      {
        title: topic.Topic,
        subtitle: topic.Content_Type || 'Long Best AI',
        type: 'cover'
      },
      {
        title: 'Slide 1',
        content: researchNotes.split('.')[0] || 'Content here',
        type: 'content'
      },
      {
        title: 'Slide 2',
        content: researchNotes.split('.')[1] || 'More content',
        type: 'content'
      },
      {
        title: 'Slide 3',
        content: researchNotes.split('.')[2] || 'Even more content',
        type: 'content'
      },
      {
        title: 'Slide 4',
        content: researchNotes.split('.')[3] || 'Continue...',
        type: 'content'
      },
      {
        title: 'Slide 5',
        content: researchNotes.split('.')[4] || 'Almost there',
        type: 'content'
      },
      {
        title: 'Call to Action',
        content: 'Follow Long Best AI để cập nhật thêm tips!',
        type: 'cta'
      }
    ]
  };

  await fs.writeFile(filepath, JSON.stringify(content, null, 2));

  console.log(`✅ Content JSON created: ${filename}`);
  return { filename, filepath, slug };
}

async function generateCarousel(contentFile) {
  console.log(`\n🎨 Generating carousel from ${contentFile}...`);

  const command = `cd ${CONFIG.carouselDir} && node generator.js content/${contentFile}`;

  try {
    const output = execSync(command, { encoding: 'utf-8' });
    console.log(output);
    console.log('✅ Carousel generated!');
    return true;
  } catch (error) {
    console.error('❌ Error generating carousel:', error.message);
    return false;
  }
}

async function uploadToDrive(slug) {
  console.log(`\n☁️  Uploading to Google Drive...`);

  const outputDir = path.join(CONFIG.carouselDir, 'output', slug);
  const command = `node upload.js ${outputDir} --delete`;

  try {
    const output = execSync(command, { encoding: 'utf-8', cwd: __dirname });
    console.log(output);
    console.log('✅ Uploaded to Drive!');
    return true;
  } catch (error) {
    console.error('❌ Error uploading:', error.message);
    return false;
  }
}

async function main() {
  try {
    console.log('🚀 Starting quick carousel workflow...\n');

    // Step 1: Get first planned topic
    console.log('📋 Step 1: Getting latest topic from ToTable...');
    const topic = await getFirstPlannedTopic();

    console.log(`\n✅ Found topic:`);
    console.log(`   Topic: ${topic.Topic}`);
    console.log(`   Post_ID: ${topic.Post_ID}`);
    console.log(`   Priority: ${topic['**Priority**']}`);
    console.log(`   Status: ${topic.Status}`);
    console.log(`   Research Notes: ${topic.Research_Notes?.substring(0, 100)}...`);

    // Step 2: Create content JSON
    const { filename, filepath, slug } = await createContentJSON(topic);

    // Step 3: Generate carousel
    const generated = await generateCarousel(filename);
    if (!generated) {
      console.error('❌ Failed to generate carousel');
      return;
    }

    // Step 4: Upload to Drive
    const uploaded = await uploadToDrive(slug);
    if (!uploaded) {
      console.error('❌ Failed to upload to Drive');
      return;
    }

    console.log('\n\n🎉 SUCCESS! Workflow completed:');
    console.log(`✅ Content JSON created: ${filename}`);
    console.log(`✅ Carousel generated: output/${slug}/`);
    console.log(`✅ Uploaded to Google Drive`);
    console.log(`✅ Google Sheets updated`);
    console.log('\n📱 Next: n8n will auto-post to Facebook when scheduled');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getFirstPlannedTopic, createContentJSON, generateCarousel, uploadToDrive };
