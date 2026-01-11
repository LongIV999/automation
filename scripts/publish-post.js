const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function publishToFacebook(folderPath, brandId) {
    console.log(`🚀 Starting publish for brand: ${brandId}`);

    // 1. Load Brand Config
    const brandPath = path.join(__dirname, `../brands/${brandId}/brand.json`);
    const brandConfig = JSON.parse(fs.readFileSync(brandPath, 'utf8'));
    const { pageId, credentialId: accessToken } = brandConfig.facebook;

    if (!pageId || !accessToken) {
        throw new Error('Missing Facebook Page ID or Access Token');
    }

    // 2. Load Content
    const contentPath = path.join(folderPath, 'content.json'); // Assuming content.json is saved in output, if not we check the input file
    // Note: ensure generator copies content.json to output, or we infer caption. 
    // For now, let's try to find a .json file in the folder or just use the images.

    // Actually generator.js output folder contains just images usually. 
    // We need the caption. It was in the input JSON.
    // Hack: We can read the caption from the matching input file in `scripts/carousel-generator/content/` 
    // OR just pass the caption as an arg.
    // Let's look for a json file in the folder.

    const files = fs.readdirSync(folderPath);
    const jsonFile = files.find(f => f.endsWith('.json'));
    let caption = "New Update from Queen Nail Bern!"; // Default

    if (jsonFile) {
        const jsonContent = JSON.parse(fs.readFileSync(path.join(folderPath, jsonFile), 'utf8'));

        // Construct caption
        if (jsonContent.caption) {
            caption = jsonContent.caption;
        } else if (jsonContent.slides && Array.isArray(jsonContent.slides)) {
            // Carousel Format
            caption = `${jsonContent.intro || ''}\n\n${jsonContent.slides.map(s => s.headline).join('\n')}\n\n${jsonContent.outro || ''}`;
        } else if (jsonContent.headline) {
            // Single Post Format
            caption = `${jsonContent.headline}\n\n${jsonContent.bodyText || ''}\n\n👉 ${jsonContent.ctaText || 'Contact'} at ${brandId}`;
        }
    }

    // 3. Upload Images
    const imageFiles = files.filter(f => f.endsWith('.png')).sort();
    const mediaIds = [];

    console.log(`📸 Found ${imageFiles.length} images.`);

    for (const imageFile of imageFiles) {
        console.log(`Uploading ${imageFile}...`);
        const form = new FormData();
        form.append('access_token', accessToken);
        form.append('published', 'false'); // Important: Don't publish individually
        form.append('source', fs.createReadStream(path.join(folderPath, imageFile)));

        const res = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/photos`, form, {
            headers: form.getHeaders()
        });

        if (res.data && res.data.id) {
            mediaIds.push(res.data.id);
            console.log(`  -> Uploaded ID: ${res.data.id}`);
        }
    }

    // 4. Publish Container Post
    console.log(`📝 Publishing container post...`);

    const feedPayload = {
        access_token: accessToken,
        message: caption,
        attached_media: mediaIds.map(id => ({ media_fbid: id }))
    };

    const postRes = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/feed`, feedPayload);

    console.log(`✅ Published Successfully! Post ID: ${postRes.data.id}`);
    console.log(`https://facebook.com/${postRes.data.id}`);
    return postRes.data.id;
}

// CLI
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log("Usage: node publish-post.js <folderPath> <brandId> [caption]");
        process.exit(1);
    }
    const [folderPath, brandId, caption] = args;
    publishToFacebook(folderPath, brandId, caption).catch(console.error);
}
