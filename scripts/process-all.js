
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const contentDir = path.resolve(__dirname, 'carousel-generator/content');
const generatorScript = path.resolve(__dirname, 'carousel-generator/generator.js');
const uploadScript = path.resolve(__dirname, 'drive-uploader/upload.js');
const outputBaseDir = path.resolve(__dirname, 'carousel-generator/output');

if (!fs.existsSync(contentDir)) {
    console.error(`Content directory not found: ${contentDir}`);
    process.exit(1);
}

const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'));

console.log(`Found ${files.length} content files to process.`);

files.forEach((file, index) => {
    const slug = path.basename(file, '.json');
    const contentPath = path.join(contentDir, file);
    const outputDir = path.join(outputBaseDir, slug);

    console.log(`\n[${index + 1}/${files.length}] Processing: ${slug}`);

    try {
        // 1. Generate Carousel
        console.log(`   Generating images...`);
        // We run in the generator's directory to ensure it finds config files relative to itself if needed,
        // OR we just run from root and rely on absolute paths. 
        // generator.js uses ./output relative to cwd if not specified.
        // It's safer to run from the root of the automation repo.

        execSync(`node "${generatorScript}" "${contentPath}" "${outputDir}"`, {
            stdio: 'inherit',
            cwd: path.resolve(__dirname, '..') // Run from /Users/admin/automation
        });

        // 2. Upload to Drive (and update Sheets)
        console.log(`   Uploading to Drive...`);
        // Run from drive-uploader directory so it assumes credentials are in CWD or relative.
        // We use "upload.js" since we set CWD to that dir.
        execSync(`node "upload.js" "${outputDir}" --delete`, {
            stdio: 'inherit',
            cwd: path.resolve(__dirname, 'drive-uploader')
        });

        console.log(`   ✅ Completed: ${slug}`);

    } catch (error) {
        console.error(`   ❌ Failed to process ${slug}`);
        // console.error(error); // Optional: print error details
    }
});

console.log('\n🎉 All batch processing completed!');
