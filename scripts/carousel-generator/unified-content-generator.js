#!/usr/bin/env node
/**
 * Unified Content Generator
 *
 * Workflow: Topic → Design Philosophy → Canvas Hero → Carousel Slides
 *
 * Features:
 * - Automatic design philosophy generation from topic
 * - Canvas-based hero/cover slide generation
 * - Traditional Puppeteer rendering for content slides
 * - Multi-brand support
 * - Flexible output formats
 *
 * Usage:
 *   node unified-content-generator.js --topic "Your topic here" --brand thachvuland
 *   node unified-content-generator.js --content content.json --brand longbest-ai --canvas
 */

const fs = require('fs').promises;
const path = require('path');
const { generateDesignPhilosophy, savePhilosophyToMarkdown } = require('./design-philosophy-generator');
const { generateCanvasArtwork, isCanvasAvailable } = require('./canvas-adapter');
const { generateCarouselOptimized } = require('./generator-optimized');
const { closeGlobalPool } = require('./browser-pool');

// Load brand configs
const BRANDS_PATH = path.join(__dirname, '../../brands');

/**
 * Main unified generation workflow
 */
async function unifiedGenerate(options) {
  console.log('🎨 Unified Content Generator');
  console.log('━'.repeat(60));

  const startTime = Date.now();

  try {
    // Step 1: Load brand configuration
    const brandConfig = await loadBrandConfig(options.brandId);
    console.log(`\n📦 Brand: ${brandConfig.name}`);

    // Step 2: Load or prepare content data
    let contentData;
    if (options.contentFile) {
      contentData = await loadContentFromFile(options.contentFile);
      console.log(`📄 Content loaded: ${options.contentFile}`);
    } else if (options.topic) {
      console.log(`💡 Topic: "${options.topic}"`);
      // TODO: In future, auto-generate content from topic
      console.error('❌ Auto-content generation from topic not yet implemented');
      console.error('   Please provide a --content file for now');
      process.exit(1);
    } else {
      throw new Error('Either --content or --topic must be provided');
    }

    // Step 3: Generate design philosophy
    console.log('\n🧠 Generating design philosophy...');
    const designPhilosophy = generateDesignPhilosophy(
      options.topic || contentData.topic || contentData.title,
      brandConfig
    );
    console.log(`   → Movement: ${designPhilosophy.movementName}`);
    console.log(`   → Visual approach: ${designPhilosophy.visualGuidelines.composition.approach}`);

    // Save philosophy to output
    const outputPath = options.outputPath || path.join(__dirname, 'output', sanitizeFilename(contentData.title || 'content'));
    await fs.mkdir(outputPath, { recursive: true });

    const philosophyPath = path.join(outputPath, '_design-philosophy.md');
    savePhilosophyToMarkdown(designPhilosophy, philosophyPath);

    // Step 4: Determine which slides use canvas
    const useCanvasForHero = options.canvas !== false && isCanvasAvailable();

    if (useCanvasForHero) {
      console.log('\n✨ Canvas generation: ENABLED');
    } else {
      console.log('\n⚠️  Canvas generation: DISABLED (using standard rendering)');
      if (!isCanvasAvailable()) {
        console.log('   Install Python packages: pip3 install matplotlib pillow numpy');
      }
    }

    // Step 5: Generate slides
    console.log('\n🖼️  Generating slides...');

    const slides = contentData.slides;
    const heroSlideIndex = 0; // First slide is usually the hero

    // Check if first slide should use canvas
    const firstSlide = slides[heroSlideIndex];
    const shouldUseCanvasForFirst = useCanvasForHero &&
      (firstSlide.type === 'title' || firstSlide.type === 'hero' || firstSlide.type === 'cover');

    if (shouldUseCanvasForFirst) {
      console.log('   → Slide 01: Canvas artwork (hero)');

      // Generate canvas artwork for hero slide
      const heroOutputPath = path.join(outputPath, '01.png');
      const dimensions = {
        width: brandConfig.carousel?.slideWidth || 1080,
        height: brandConfig.carousel?.slideHeight || 1350
      };

      try {
        await generateCanvasArtwork(
          designPhilosophy,
          firstSlide,
          dimensions,
          heroOutputPath
        );
        console.log('      ✓ Canvas hero slide generated');
      } catch (error) {
        console.error('      ⚠️  Canvas generation failed, falling back to standard rendering');
        console.error('         Error:', error.message);
        // Will be generated with standard method below
      }
    }

    // Generate remaining slides with standard method
    const slidesToGenerate = shouldUseCanvasForFirst ? slides.slice(1) : slides;
    const slideOffset = shouldUseCanvasForFirst ? 1 : 0;

    if (slidesToGenerate.length > 0) {
      console.log(`   → Slides ${slideOffset + 1}-${slides.length}: Standard rendering`);

      // Prepare modified content data for standard generation
      const modifiedContentData = {
        ...contentData,
        slides: slidesToGenerate
      };

      // Configure generation options
      const generationOptions = {
        brandId: options.brandId,
        outputPath,
        parallelSlides: options.parallel || 3,
        deviceScaleFactor: options.scale || 2,
        slideWidth: brandConfig.carousel?.slideWidth || 1080,
        slideHeight: brandConfig.carousel?.slideHeight || 1350,
        slideNumberOffset: slideOffset // Start numbering from offset
      };

      // Generate with optimized generator
      // Note: slideNumberOffset already handles numbering correctly
      await generateCarouselOptimized(modifiedContentData, generationOptions);
    }

    // Step 6: Copy content.json to output
    const contentOutputPath = path.join(outputPath, 'content.json');
    await fs.writeFile(contentOutputPath, JSON.stringify(contentData, null, 2), 'utf8');

    // Summary
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n' + '━'.repeat(60));
    console.log('🎉 Generation Complete!');
    console.log(`⏱️  Total time: ${elapsed}s`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`   → ${slides.length} slides`);
    console.log(`   → 1 design philosophy document`);
    console.log(`   → 1 content.json`);

    return {
      success: true,
      outputPath,
      designPhilosophy,
      elapsed
    };

  } catch (error) {
    console.error('\n❌ Generation failed:', error.message);
    console.error(error.stack);
    throw error;
  } finally {
    // Cleanup
    await closeGlobalPool();
  }
}

/**
 * Load brand configuration
 */
async function loadBrandConfig(brandId) {
  if (!brandId) {
    throw new Error('Brand ID is required. Use --brand <brand-id>');
  }

  const brandPath = path.join(BRANDS_PATH, brandId, 'brand.json');

  try {
    const data = await fs.readFile(brandPath, 'utf8');
    const config = JSON.parse(data);

    // Validate required fields
    if (!config.brandId || !config.name) {
      throw new Error('Invalid brand config: missing brandId or name');
    }

    return config;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Brand '${brandId}' not found. Check brands directory.`);
    }
    throw error;
  }
}

/**
 * Load content from JSON file
 */
async function loadContentFromFile(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

/**
 * Sanitize filename
 */
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

/**
 * Renumber slides when canvas hero was generated
 */
async function renumberSlides(outputPath, offset) {
  const files = await fs.readdir(outputPath);
  const slideFiles = files.filter(f => f.match(/^\d{2}\.png$/)).sort();

  // Rename in reverse order to avoid conflicts
  for (let i = slideFiles.length - 1; i >= 0; i--) {
    const oldName = slideFiles[i];
    const oldNumber = parseInt(oldName.match(/^(\d{2})/)[1], 10);
    const newNumber = String(oldNumber + offset).padStart(2, '0');
    const newName = `${newNumber}.png`;

    if (oldName !== newName) {
      await fs.rename(
        path.join(outputPath, oldName),
        path.join(outputPath, newName)
      );
    }
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🎨 Unified Content Generator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Automatically generates design philosophy and beautiful carousel images.

USAGE:
  node unified-content-generator.js [options]

OPTIONS:
  --content <file>      Content JSON file (required for now)
  --topic <text>        Content topic (for future auto-generation)
  --brand <id>          Brand ID (required)
                        Available: longbest-ai, thachvuland, queennailbern

  --output <dir>        Output directory (default: ./output/<content-name>)
  --canvas              Enable canvas generation for hero slide (default: auto)
  --no-canvas           Disable canvas generation
  --parallel <n>        Parallel slide generation (default: 3)
  --scale <n>           Image quality scale (default: 2)
  --fast                Fast mode (lower quality, faster generation)

EXAMPLES:
  # Generate with canvas hero slide
  node unified-content-generator.js \\
    --content content/longbest-prompt-engineering.json \\
    --brand longbest-ai

  # Generate for specific brand
  node unified-content-generator.js \\
    --content content/queennailbern-tuyendung.json \\
    --brand queennailbern \\
    --output output/recruitment-post

  # Fast generation (testing)
  node unified-content-generator.js \\
    --content content/thachvuland-tips.json \\
    --brand thachvuland \\
    --fast

WORKFLOW:
  1. Load brand configuration
  2. Generate design philosophy from topic
  3. Create canvas artwork for hero slide
  4. Generate content slides with Puppeteer
  5. Output: slides + design philosophy + content.json
    `);
    process.exit(0);
  }

  // Parse arguments
  const options = {
    canvas: true // Default: enabled if available
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--content':
        options.contentFile = args[++i];
        break;
      case '--topic':
        options.topic = args[++i];
        break;
      case '--brand':
        options.brandId = args[++i];
        break;
      case '--output':
        options.outputPath = args[++i];
        break;
      case '--canvas':
        options.canvas = true;
        break;
      case '--no-canvas':
        options.canvas = false;
        break;
      case '--parallel':
        options.parallel = parseInt(args[++i], 10);
        break;
      case '--scale':
        options.scale = parseInt(args[++i], 10);
        break;
      case '--fast':
        options.parallel = 5;
        options.scale = 1;
        options.fast = true;
        break;
      default:
        if (!args[i].startsWith('--')) {
          console.error(`Unknown argument: ${args[i]}`);
          process.exit(1);
        }
    }
  }

  // Validate required options
  if (!options.contentFile && !options.topic) {
    console.error('❌ Error: Either --content or --topic is required');
    console.error('   Run with --help for usage information');
    process.exit(1);
  }

  if (!options.brandId) {
    console.error('❌ Error: --brand is required');
    console.error('   Available brands: longbest-ai, thachvuland, queennailbern');
    process.exit(1);
  }

  try {
    await unifiedGenerate(options);
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = {
  unifiedGenerate,
  loadBrandConfig
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}
