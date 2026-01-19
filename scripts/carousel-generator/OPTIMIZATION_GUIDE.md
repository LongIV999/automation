# Carousel Generator Performance Optimization

## Overview

The optimized carousel generator provides significant performance improvements through:

- **Browser pooling** - Reuse browser instances instead of launching new ones
- **Parallel processing** - Generate multiple slides concurrently
- **Smart rendering** - Network idle detection instead of fixed delays
- **Reduced overhead** - Lower device scale factor with configurable quality
- **Multi-brand support** - Unified generator using brand-loader

## Performance Improvements

Expected speedup: **2-4x faster** than original generator

| Mode | Speed | Quality | Use Case |
|------|-------|---------|----------|
| Original | 1x | High (3x scale) | Legacy |
| Optimized | 2-3x | High (2x scale) | Production |
| Fast mode | 3-4x | Medium (1x scale) | Drafts, iterations |

## Files

- `browser-pool.js` - Browser instance pooling and reuse
- `generator-optimized.js` - Main optimized generator
- `benchmark.js` - Performance comparison tool

## Usage

### Basic Usage

```bash
node generator-optimized.js content/post.json
```

### With Brand Support

```bash
node generator-optimized.js content/post.json --brand longbest-ai
```

### Custom Options

```bash
node generator-optimized.js content/post.json \
  --brand thachvuland \
  --output output/custom \
  --parallel 4 \
  --scale 2
```

### Fast Mode (for quick iterations)

```bash
node generator-optimized.js content/post.json --fast
```

## Options

- `--output <dir>` - Output directory
- `--brand <brand-id>` - Brand ID (longbest-ai, thachvuland)
- `--parallel <n>` - Number of slides to generate in parallel (default: 3)
- `--scale <n>` - Device scale factor for quality (default: 2)
- `--fast` - Fast mode (scale=1, parallel=5)

## Running Benchmarks

Compare performance between original and optimized generators:

```bash
node benchmark.js
```

This will generate performance metrics and file size comparisons.

## Integration with Existing Scripts

### Using as a Module

```javascript
const { generateCarouselOptimized } = require('./generator-optimized');
const { closeGlobalPool } = require('./browser-pool');

async function generateContent() {
  const contentData = { /* your content */ };

  await generateCarouselOptimized(contentData, {
    outputPath: './output/my-carousel',
    brandId: 'longbest-ai',
    parallelSlides: 3,
    deviceScaleFactor: 2
  });

  // Clean up browser pool when done
  await closeGlobalPool();
}
```

### Batch Processing

The browser pool is especially efficient for generating multiple carousels:

```javascript
const { generateCarouselOptimized } = require('./generator-optimized');
const { closeGlobalPool } = require('./browser-pool');

async function batchGenerate(contentFiles) {
  for (const file of contentFiles) {
    const content = await loadContent(file);
    await generateCarouselOptimized(content, {
      outputPath: `./output/${file}`,
      brandId: 'longbest-ai'
    });
  }

  // Browser pool is reused across all generations
  await closeGlobalPool();
}
```

## Configuration Options

Full configuration object:

```javascript
{
  slideWidth: 1080,           // Slide width in pixels
  slideHeight: 1350,          // Slide height in pixels
  outputPath: './output',     // Output directory
  brandId: null,              // Brand ID for multi-brand support
  deviceScaleFactor: 2,       // Image quality (1-3)
  parallelSlides: 3,          // Concurrent slide generation
  renderingDelay: 100,        // Wait time after font load (ms)
  useNetworkIdle: true,       // Wait for network idle
  timeout: 60000,             // Maximum timeout per slide
  maxBrowsers: 2              // Browser pool size
}
```

## Performance Tips

1. **For production**: Use default settings (parallel=3, scale=2)
2. **For drafts**: Use fast mode (parallel=5, scale=1)
3. **For batch processing**: Increase maxBrowsers to match CPU cores
4. **Low memory systems**: Reduce parallelSlides to 2
5. **High CPU systems**: Increase parallelSlides to 5-7

## Troubleshooting

### Out of Memory

Reduce parallel slides or device scale factor:

```bash
node generator-optimized.js content.json --parallel 2 --scale 1
```

### Slow First Run

First run requires browser launch. Subsequent runs reuse the pool.

### Font Loading Issues

Increase renderingDelay:

```javascript
await generateCarouselOptimized(content, {
  renderingDelay: 300  // Increase from 100ms
});
```

## Migration Guide

### From generator.js

Replace:

```javascript
const { generateCarousel } = require('./generator');
await generateCarousel(content, outputDir);
```

With:

```javascript
const { generateCarouselOptimized } = require('./generator-optimized');
const { closeGlobalPool } = require('./browser-pool');

await generateCarouselOptimized(content, {
  outputPath: outputDir
});

// Don't forget cleanup
await closeGlobalPool();
```

### From generator-tvland.js

Replace:

```javascript
const { generateCarousel } = require('./generator-tvland');
await generateCarousel(content, outputDir);
```

With:

```javascript
const { generateCarouselOptimized } = require('./generator-optimized');
const { closeGlobalPool } = require('./browser-pool');

await generateCarouselOptimized(content, {
  outputPath: outputDir,
  brandId: 'thachvuland'  // Specify brand
});

await closeGlobalPool();
```

## Technical Details

### Browser Pooling

- Maintains 2 browser instances by default
- Instances are acquired/released for each slide
- Automatic waiting when pool is exhausted
- Clean shutdown on process exit

### Parallel Processing

- Slides generated in batches
- Each batch processes N slides concurrently
- Automatic resource management
- Error isolation per slide

### Memory Usage

Typical memory usage:
- Original: ~500MB per browser
- Optimized: ~300MB per browser (pool of 2)
- Fast mode: ~200MB per browser

### Compatibility

- Node.js 14+
- Puppeteer 21+
- Works with existing content JSON format
- Compatible with brand-loader system
