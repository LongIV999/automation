/**
 * Performance Benchmark Script
 *
 * Compares original vs optimized carousel generator
 */

const fs = require('fs').promises;
const path = require('path');
const { generateCarousel } = require('./generator');
const { generateCarouselOptimized } = require('./generator-optimized');
const { closeGlobalPool } = require('./browser-pool');

async function benchmark() {
  console.log('🔬 Carousel Generator Performance Benchmark\n');

  // Find a test content file
  const contentDir = path.join(__dirname, 'content');
  const files = await fs.readdir(contentDir);
  const testFile = files.find(f => f.endsWith('.json') && f.startsWith('longbest'));

  if (!testFile) {
    console.error('❌ No test content file found');
    process.exit(1);
  }

  const contentPath = path.join(contentDir, testFile);
  const contentData = JSON.parse(await fs.readFile(contentPath, 'utf-8'));

  console.log(`📄 Test file: ${testFile}`);
  console.log(`📊 Slides: ${contentData.slides.length}\n`);

  // Benchmark original generator
  console.log('='.repeat(60));
  console.log('Testing ORIGINAL generator');
  console.log('='.repeat(60));

  const outputOriginal = path.join(__dirname, 'output/benchmark-original');
  await fs.rm(outputOriginal, { recursive: true, force: true });

  const startOriginal = Date.now();
  try {
    await generateCarousel(contentData, outputOriginal);
  } catch (error) {
    console.error('Error in original:', error.message);
  }
  const timeOriginal = (Date.now() - startOriginal) / 1000;

  console.log(`\n⏱️  Original time: ${timeOriginal.toFixed(2)}s`);
  console.log(`⏱️  Per slide: ${(timeOriginal / contentData.slides.length).toFixed(2)}s\n`);

  // Benchmark optimized generator with default settings
  console.log('='.repeat(60));
  console.log('Testing OPTIMIZED generator (default: 3 parallel, scale 2x)');
  console.log('='.repeat(60));

  const outputOptimized = path.join(__dirname, 'output/benchmark-optimized');
  await fs.rm(outputOptimized, { recursive: true, force: true });

  const startOptimized = Date.now();
  try {
    await generateCarouselOptimized(contentData, {
      outputPath: outputOptimized,
      parallelSlides: 3,
      deviceScaleFactor: 2
    });
  } catch (error) {
    console.error('Error in optimized:', error.message);
  }
  const timeOptimized = (Date.now() - startOptimized) / 1000;

  console.log(`\n⏱️  Optimized time: ${timeOptimized.toFixed(2)}s`);
  console.log(`⏱️  Per slide: ${(timeOptimized / contentData.slides.length).toFixed(2)}s\n`);

  // Benchmark optimized generator in fast mode
  console.log('='.repeat(60));
  console.log('Testing OPTIMIZED generator (fast mode: 5 parallel, scale 1x)');
  console.log('='.repeat(60));

  const outputFast = path.join(__dirname, 'output/benchmark-fast');
  await fs.rm(outputFast, { recursive: true, force: true });

  const startFast = Date.now();
  try {
    await generateCarouselOptimized(contentData, {
      outputPath: outputFast,
      parallelSlides: 5,
      deviceScaleFactor: 1,
      useNetworkIdle: false,
      renderingDelay: 50
    });
  } catch (error) {
    console.error('Error in fast mode:', error.message);
  }
  const timeFast = (Date.now() - startFast) / 1000;

  console.log(`\n⏱️  Fast mode time: ${timeFast.toFixed(2)}s`);
  console.log(`⏱️  Per slide: ${(timeFast / contentData.slides.length).toFixed(2)}s\n`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 PERFORMANCE SUMMARY');
  console.log('='.repeat(60));

  const improvementOptimized = ((timeOriginal - timeOptimized) / timeOriginal * 100).toFixed(1);
  const improvementFast = ((timeOriginal - timeFast) / timeOriginal * 100).toFixed(1);
  const speedupOptimized = (timeOriginal / timeOptimized).toFixed(2);
  const speedupFast = (timeOriginal / timeFast).toFixed(2);

  console.log(`\nOriginal:          ${timeOriginal.toFixed(2)}s`);
  console.log(`Optimized:         ${timeOptimized.toFixed(2)}s  (${improvementOptimized}% faster, ${speedupOptimized}x speedup)`);
  console.log(`Fast mode:         ${timeFast.toFixed(2)}s  (${improvementFast}% faster, ${speedupFast}x speedup)`);

  console.log('\n💡 Recommendations:');
  if (parseFloat(improvementOptimized) > 20) {
    console.log('  ✅ Use optimized generator for production (better quality)');
  }
  if (parseFloat(improvementFast) > 40) {
    console.log('  ✅ Use fast mode for drafts and quick iterations');
  }

  // Check file sizes
  try {
    const originalFiles = await fs.readdir(outputOriginal);
    const optimizedFiles = await fs.readdir(outputOptimized);
    const fastFiles = await fs.readdir(outputFast);

    const getSize = async (dir, file) => {
      const stats = await fs.stat(path.join(dir, file));
      return stats.size;
    };

    const originalSize = await getSize(outputOriginal, originalFiles[0]);
    const optimizedSize = await getSize(outputOptimized, optimizedFiles[0]);
    const fastSize = await getSize(outputFast, fastFiles[0]);

    console.log('\n📦 File sizes (first slide):');
    console.log(`  Original:  ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(1)} KB`);
    console.log(`  Fast mode: ${(fastSize / 1024).toFixed(1)} KB`);
  } catch (error) {
    // Ignore file size errors
  }

  console.log('\n✨ Benchmark complete!\n');

  // Cleanup
  await closeGlobalPool();
}

// Run benchmark
if (require.main === module) {
  benchmark().catch(error => {
    console.error('Benchmark failed:', error);
    process.exit(1);
  });
}

module.exports = { benchmark };
