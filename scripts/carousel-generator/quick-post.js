#!/usr/bin/env node
/**
 * Quick Post to Queen Nail Bern Facebook
 *
 * Simple script to post carousel images directly to Facebook
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Configuration
const CONTENT_FOLDER = path.join(__dirname, 'output/queennail-post-1768284788');
const PAGE_ID = '633948429809789';
const ACCESS_TOKEN = 'EAAIlEVK0LRYBQQZBM4MULlf2q9v62YfPpQ3YnlDZCfPlgEQZBviBdDjR7TGDq4iK0E5uXYMmDzR9jTOGqTy5ZCeYVO2JJQJ1jrqh9i94SfF7lbZBJzfPvojF4pqD8ZCPR6edLqHWZBpdmIY9hGV2QASXUSlw6kUF4JRVJjeXUroMbFqucv2MTHJc2J2k01NTiDuN9xLus5aTJWyin720Qhh';

async function main() {
  console.log('📱 Posting to Queen Nail Bern Facebook Page...\n');

  try {
    // Step 1: Get images
    const images = fs.readdirSync(CONTENT_FOLDER)
      .filter(f => f.endsWith('.png') && f.match(/^\d{2}\.png$/))
      .sort()
      .map(f => path.join(CONTENT_FOLDER, f));

    console.log(`📷 Found ${images.length} images`);

    // Step 2: Generate caption
    const caption = generateCaption();
    console.log(`\n📝 Caption:\n${caption}\n`);

    // Step 3: Upload images and get IDs
    console.log('☁️  Uploading images to Facebook...');
    const photoIds = [];

    for (let i = 0; i < images.length; i++) {
      console.log(`   → Uploading image ${i + 1}/${images.length}...`);
      const photoId = await uploadPhoto(images[i], i === 0);
      photoIds.push(photoId);
      console.log(`      ✓ Photo ID: ${photoId}`);
    }

    // Step 4: Create carousel post
    console.log('\n📤 Creating carousel post...');
    const postId = await createCarouselPost(photoIds, caption);
    console.log(`   ✓ Post created: ${postId}`);

    console.log(`\n✅ Success! View at: https://facebook.com/${postId}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
    process.exit(1);
  }
}

/**
 * Generate caption from content
 */
function generateCaption() {
  const contentPath = path.join(CONTENT_FOLDER, 'content.json');

  if (fs.existsSync(contentPath)) {
    const data = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

    let caption = `💅 ${data.title}\n\n`;

    // Add key highlights
    const slides = data.slides || [];
    const listSlides = slides.filter(s => s.type === 'list');

    if (listSlides.length > 0) {
      caption += `${listSlides[0].headline}:\n`;
      const items = listSlides[0].content.slice(0, 3);
      items.forEach(item => {
        caption += `✨ ${item}\n`;
      });
      caption += '\n';
    }

    // Add CTA
    const ctaSlide = slides.find(s => s.type === 'cta');
    if (ctaSlide && ctaSlide.subheadline) {
      caption += `${ctaSlide.subheadline}\n\n`;
    }

    // Hashtags
    caption += '#QueenNailBern #NailSalon #Bern #NailArt #Nagelstudio #BeautyBern';

    return caption;
  }

  return 'Tuyển dụng thợ nail chuyên nghiệp 💅✨\n\n#QueenNailBern #NailSalon #Bern';
}

/**
 * Upload a photo to Facebook
 */
async function uploadPhoto(imagePath, published = false) {
  const form = new FormData();
  form.append('source', fs.createReadStream(imagePath));
  form.append('published', published.toString());
  form.append('access_token', ACCESS_TOKEN);

  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`,
    form,
    {
      headers: form.getHeaders()
    }
  );

  return response.data.id;
}

/**
 * Create carousel post with uploaded photos
 */
async function createCarouselPost(photoIds, caption) {
  // Attach photos to post
  const attachedMedia = photoIds.map(id => ({
    media_fbid: id
  }));

  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${PAGE_ID}/feed`,
    {
      message: caption,
      attached_media: attachedMedia,
      access_token: ACCESS_TOKEN
    }
  );

  return response.data.id;
}

// Run
main();
