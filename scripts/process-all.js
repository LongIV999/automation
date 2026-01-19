
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const contentDir = path.resolve(__dirname, 'carousel-generator/content');
const uploadScript = path.resolve(__dirname, 'drive-uploader/upload.js');
const outputBaseDir = path.resolve(__dirname, 'carousel-generator/output');
const generatorBaseDir = path.resolve(__dirname, 'carousel-generator');

if (!fs.existsSync(contentDir)) {
    console.error(`Content directory not found: ${contentDir}`);
    process.exit(1);
}

const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'));

if (files.length === 0) {
    console.log("No content files found in " + contentDir);
    process.exit(0);
}

console.log(`Found ${files.length} content files to process.`);

files.forEach((file, index) => {
    const slug = path.basename(file, '.json');
    const contentPath = path.join(contentDir, file);
    const outputDir = path.join(outputBaseDir, slug);

    console.log(`\n[${index + 1}/${files.length}] Processing: ${slug}`);

    try {
        // Read brand from JSON
        const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
        const brandRaw = content.brand || 'Long Best AI';
        const brand = brandRaw.toLowerCase().includes('thach vu') ? 'thachvuland' : 'longbest';

        console.log(`   Brand detected: ${brandRaw} (${brand})`);

        // 1. Generate Carousel
        console.log(`   Generating images...`);
        let generatorScript = 'generator.js';
        if (brand === 'thachvuland') {
            generatorScript = 'generator-tvland.js';
        }

        execSync(`node "${generatorScript}" "${contentPath}" "${outputDir}"`, {
            stdio: 'inherit',
            cwd: generatorBaseDir
        });

        // 1.5 Enhance images
        console.log(`   Enhancing images...`);
        execSync(`node enhancer.js "${outputDir}"`, {
            stdio: 'inherit',
            cwd: generatorBaseDir
        });

        // 2. Upload to Drive (and update Sheets)
        console.log(`   Uploading to Drive...`);
        execSync(`node "upload.js" "${outputDir}" --brand ${brand} --delete`, {
            stdio: 'inherit',
            cwd: path.resolve(__dirname, 'drive-uploader')
        });

        console.log(`   ✅ Completed: ${slug}`);

        // Move to archive after success
        const archiveDir = path.join(generatorBaseDir, 'archive');
        if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir);
        fs.renameSync(contentPath, path.join(archiveDir, file));
        console.log(`   📦 Archived content file`);

    } catch (error) {
        console.error(`   ❌ Failed to process ${slug}`);
        // console.error(error); 
    }
});

console.log('\n🎉 All batch processing completed!');
