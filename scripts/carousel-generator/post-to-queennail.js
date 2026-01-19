#!/usr/bin/env node
/**
 * Post Content to Queen Nail Bern
 *
 * Workflow:
 * 1. Upload images to Google Drive
 * 2. Update Google Sheets
 * 3. Post to Facebook
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BRAND_ID = 'queennailbern';
const CONTENT_FOLDER = path.join(__dirname, 'output/test-canvas-queennail');
const DRIVE_UPLOADER = path.join(__dirname, '../drive-uploader');
const FB_PUBLISHER = path.join(__dirname, '../facebook-auto-publisher');

async function main() {
  console.log('🚀 Starting post workflow for Queen Nail Bern...\n');

  try {
    // Step 1: Check if content exists
    console.log('📂 Checking content folder...');
    if (!fs.existsSync(CONTENT_FOLDER)) {
      throw new Error(`Content folder not found: ${CONTENT_FOLDER}`);
    }

    const pngFiles = fs.readdirSync(CONTENT_FOLDER)
      .filter(f => f.endsWith('.png') && f.match(/^\d{2}\.png$/))
      .sort();

    console.log(`   ✓ Found ${pngFiles.length} images`);
    pngFiles.forEach(f => console.log(`     - ${f}`));

    // Step 2: Read content.json for caption
    console.log('\n📝 Reading content data...');
    const contentPath = path.join(CONTENT_FOLDER, 'content.json');
    let caption = '';

    if (fs.existsSync(contentPath)) {
      const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      caption = generateCaption(contentData);
      console.log(`   ✓ Generated caption (${caption.length} chars)`);
    } else {
      caption = 'Tuyển dụng thợ nail chuyên nghiệp tại Queen Nail Bern 💅✨';
      console.log('   ⚠️  No content.json, using default caption');
    }

    // Step 3: Upload to Google Drive
    console.log('\n☁️  Uploading to Google Drive...');
    const driveResult = uploadToDrive(CONTENT_FOLDER, pngFiles);
    console.log('   ✓ Upload complete');

    // Step 4: Update Google Sheets
    console.log('\n📊 Updating Google Sheets...');
    updateSheets(driveResult, caption);
    console.log('   ✓ Sheets updated');

    // Step 5: Post to Facebook
    console.log('\n📱 Posting to Facebook...');
    await postToFacebook(driveResult.imageUrls, caption);
    console.log('   ✓ Posted to Facebook');

    console.log('\n✅ All done! Post published successfully.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Generate caption from content data
 */
function generateCaption(contentData) {
  const title = contentData.title || '';
  const topic = contentData.topic || '';

  let caption = `${title}\n\n`;

  // Extract key points from slides
  if (contentData.slides && contentData.slides.length > 0) {
    const highlights = contentData.slides
      .filter(s => s.type === 'list' && s.content)
      .slice(0, 2) // First 2 list slides
      .map(s => s.headline)
      .join('\n✨ ');

    if (highlights) {
      caption += `✨ ${highlights}\n\n`;
    }
  }

  // Add CTA
  const ctaSlide = contentData.slides?.find(s => s.type === 'cta');
  if (ctaSlide && ctaSlide.subheadline) {
    caption += `${ctaSlide.subheadline}\n\n`;
  }

  // Add hashtags
  caption += '#QueenNailBern #NailSalon #Bern #NailArt #BeautyBern #Nagelstudio';

  return caption;
}

/**
 * Upload images to Google Drive
 */
function uploadToDrive(folderPath, imageFiles) {
  console.log('   → Creating Drive folder...');

  // Use upload.js from drive-uploader
  const uploadScript = path.join(DRIVE_UPLOADER, 'upload.js');

  // Create temp folder name
  const folderName = `QUEENNAIL_${Date.now()}`;

  try {
    // Upload each image
    const imageUrls = [];

    for (const imageFile of imageFiles) {
      const imagePath = path.join(folderPath, imageFile);
      console.log(`   → Uploading ${imageFile}...`);

      // Execute upload script
      const result = execSync(
        `cd "${DRIVE_UPLOADER}" && node upload.js "${imagePath}" "${folderName}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );

      // Parse result to get URL
      const urlMatch = result.match(/https:\/\/drive\.google\.com\/[^\s]+/);
      if (urlMatch) {
        imageUrls.push(urlMatch[0]);
      }
    }

    return {
      folderName,
      imageUrls,
      imageCount: imageFiles.length
    };

  } catch (error) {
    throw new Error(`Drive upload failed: ${error.message}`);
  }
}

/**
 * Update Google Sheets
 */
function updateSheets(driveResult, caption) {
  console.log('   → Adding row to Google Sheets...');

  const sheetsScript = path.join(DRIVE_UPLOADER, 'sheets-updater.js');

  try {
    // Prepare data
    const postData = {
      brand: 'queennailbern',
      topic: 'Recruitment Post',
      caption: caption,
      imageCount: driveResult.imageCount,
      driveFolder: driveResult.folderName,
      status: 'Ready',
      createdAt: new Date().toISOString()
    };

    // Update sheets
    execSync(
      `cd "${DRIVE_UPLOADER}" && node sheets-updater.js add '${JSON.stringify(postData)}'`,
      { encoding: 'utf8', stdio: 'inherit' }
    );

  } catch (error) {
    throw new Error(`Sheets update failed: ${error.message}`);
  }
}

/**
 * Post to Facebook
 */
async function postToFacebook(imageUrls, caption) {
  console.log('   → Publishing to Facebook Page...');

  // Use Facebook Graph API
  const pageId = '633948429809789';
  const accessToken = 'EAAIlEVK0LRYBQQZBM4MULlf2q9v62YfPpQ3YnlDZCfPlgEQZBviBdDjR7TGDq4iK0E5uXYMmDzR9jTOGqTy5ZCeYVO2JJQJ1jrqh9i94SfF7lbZBJzfPvojF4pqD8ZCPR6edLqHWZBpdmIY9hGV2QASXUSlw6kUF4JRVJjeXUroMbFqucv2MTHJc2J2k01NTiDuN9xLus5aTJWyin720Qhh';

  try {
    // First, download images from Drive URLs (or use local files)
    const localImages = fs.readdirSync(CONTENT_FOLDER)
      .filter(f => f.endsWith('.png') && f.match(/^\d{2}\.png$/))
      .sort()
      .map(f => path.join(CONTENT_FOLDER, f));

    // Use publisher.js
    const publisherScript = path.join(FB_PUBLISHER, 'publisher.js');

    // Create temp post data
    const postDataPath = path.join(FB_PUBLISHER, 'temp-post.json');
    const postData = {
      pageId,
      accessToken,
      caption,
      images: localImages
    };

    fs.writeFileSync(postDataPath, JSON.stringify(postData, null, 2));

    // Execute publisher
    execSync(
      `cd "${FB_PUBLISHER}" && node publisher.js post-carousel "${postDataPath}"`,
      { encoding: 'utf8', stdio: 'inherit' }
    );

    // Clean up
    fs.unlinkSync(postDataPath);

  } catch (error) {
    throw new Error(`Facebook post failed: ${error.message}`);
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
