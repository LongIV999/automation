# Enhanced Carousel Generator với Canvas Design

## Tổng quan

Hệ thống tạo ảnh carousel được nâng cấp với khả năng tự động sinh **Design Philosophy** và tạo **Canvas Artwork** cho slide đầu tiên (hero/cover).

## Kiến trúc hệ thống

```
Topic Input
    ↓
Design Philosophy Generator → Phân tích topic, sinh philosophy theo brand
    ↓
Canvas Adapter → Tạo artwork ngh thuật bằng Python/Matplotlib
    ↓
Enhanced Generator
    ├── Slide 01: Canvas-generated artwork (museum quality)
    └── Slides 02-N: Puppeteer HTML rendering (traditional)
    ↓
Output: Carousel hoàn chỉnh + Design Philosophy Document
```

## Các module chính

### 1. design-philosophy-generator.js

Tự động sinh design philosophy từ topic và brand config.

**Chức năng:**
- Phân tích topic để xác định category (real-estate, tech, beauty, recruitment)
- Sinh movement name (ví dụ: "Welcoming Clarity", "Chromatic Logic")
- Tạo philosophy text (4-6 paragraphs)
- Định nghĩa visual guidelines và color palette
- Tạo prompt hints cho canvas creation

**API:**
```javascript
const { generateDesignPhilosophy, savePhilosophyToMarkdown } = require('./design-philosophy-generator');

const philosophy = generateDesignPhilosophy(topic, brandConfig);
savePhilosophyToMarkdown(philosophy, outputPath);
```

### 2. canvas-adapter.js

Tích hợp canvas-design principles vào workflow.

**Chức năng:**
- Nhận design philosophy và slide data
- Generate Python script cho matplotlib
- Tạo sophisticated geometric compositions
- Export high-quality PNG

**Requirements:**
```bash
pip3 install matplotlib pillow numpy
```

**API:**
```javascript
const { generateCanvasArtwork, isCanvasAvailable } = require('./canvas-adapter');

if (isCanvasAvailable()) {
  await generateCanvasArtwork(designPhilosophy, slideData, dimensions, outputPath);
}
```

### 3. unified-content-generator.js

Entry point chính cho workflow mới.

**Chức năng:**
- Load brand configuration
- Generate design philosophy
- Tạo canvas artwork cho slide đầu
- Generate content slides với Puppeteer
- Output: slides + philosophy document + content.json

## Cách sử dụng

### Installation

```bash
# Install Python packages (required cho canvas generation)
pip3 install matplotlib pillow numpy

# Verify installation
cd scripts/carousel-generator
node -e "require('./canvas-adapter').isCanvasAvailable() ? console.log('✓ Canvas ready') : console.log('✗ Missing packages')"
```

### Basic Usage

```bash
node unified-content-generator.js \
  --content content/queennailbern-tuyendung.json \
  --brand queennailbern
```

### Advanced Options

```bash
# Tắt canvas generation (chỉ dùng Puppeteer)
node unified-content-generator.js \
  --content content/mypost.json \
  --brand longbest-ai \
  --no-canvas

# Custom output directory
node unified-content-generator.js \
  --content content/mypost.json \
  --brand thachvuland \
  --output output/my-custom-folder

# Fast mode (lower quality, faster)
node unified-content-generator.js \
  --content content/mypost.json \
  --brand queennailbern \
  --fast

# Parallel processing
node unified-content-generator.js \
  --content content/mypost.json \
  --brand longbest-ai \
  --parallel 5 \
  --scale 3
```

## Output Structure

Sau khi chạy, bạn sẽ có:

```
output/
└── content-name/
    ├── 01.png              # Canvas-generated hero slide
    ├── 02.png              # Puppeteer slide
    ├── 03.png              # Puppeteer slide
    ├── ...
    ├── _design-philosophy.md  # Design philosophy document
    └── content.json        # Original content
```

## Design Philosophy

Philosophy được sinh tự động dựa trên:

1. **Topic analysis** - Xác định category và visual approach
2. **Brand colors** - Sử dụng palette từ brand.json
3. **Typography** - Font choices từ brand config
4. **Movement naming** - Tên nghệ thuật đặc trưng

### Philosophy Structure

```markdown
# [Movement Name]

## Philosophy
[4-6 paragraphs về visual philosophy]

## Visual Guidelines
- Color Palette
- Composition Approach
- Style Keywords

## Canvas Creation Prompts
- Base Prompt
- Style Modifiers
- Avoidances
```

## Canvas Artwork

Canvas artwork được tạo bằng Python với các đặc điểm:

### Visual Styles

Tùy vào category của topic:

- **Real Estate**: Architectural elements, brutalist aesthetic
- **Tech/AI**: Geometric patterns, futuristic interface
- **Beauty**: Organic forms, elegant curves
- **Recruitment**: Humanistic design, welcoming composition
- **General**: Minimalist geometric composition

### Technical Details

- **Resolution**: Configurable (default 1080x1350)
- **DPI**: 150 (high quality)
- **Format**: PNG
- **Style**: Museum-quality geometric art

## Troubleshooting

### Canvas generation không hoạt động

```bash
# Check Python packages
pip3 install matplotlib pillow numpy

# Test manually
python3 -c "import matplotlib; import PIL; import numpy; print('OK')"
```

### Lỗi permission

```bash
# Make script executable
chmod +x unified-content-generator.js
```

### Slow generation

```bash
# Use fast mode
node unified-content-generator.js --content myfile.json --brand mybrand --fast
```

## Examples

### Example 1: Queen Nail Bern Recruitment Post

```bash
node unified-content-generator.js \
  --content content/queennailbern-tuyendung-5500-6000.json \
  --brand queennailbern
```

**Output:**
- Design Philosophy: "Welcoming Clarity" (humanistic approach)
- Canvas Slide: Geometric composition với pink tones
- 6 content slides: Puppeteer rendering
- Total time: ~40s

### Example 2: Long Best AI Tutorial

```bash
node unified-content-generator.js \
  --content content/longbest-prompt-engineering.json \
  --brand longbest-ai
```

**Output:**
- Design Philosophy: "Algorithmic Beauty" (tech approach)
- Canvas Slide: Futuristic geometric patterns
- Content slides: Technical tutorial layout

## Performance

### Benchmarks

- **With Canvas**: ~8-10s per slide (first slide slower)
- **Without Canvas**: ~1.3s per slide average
- **Philosophy Generation**: <1s

### Optimization Tips

1. Use `--fast` mode cho testing
2. Adjust `--parallel` số lượng (default: 3)
3. Lower `--scale` nếu không cần chất lượng cao
4. Disable canvas với `--no-canvas` nếu không cần

## Integration với Daily Agent

Có thể tích hợp vào `daily-agent.js`:

```javascript
const { unifiedGenerate } = require('./carousel-generator/unified-content-generator');

// Generate với canvas
await unifiedGenerate({
  contentFile: 'content/mypost.json',
  brandId: 'longbest-ai',
  canvas: true
});
```

## Next Steps

### Planned Features

- [ ] Auto-generate content từ topic (hiện tại cần content.json)
- [ ] Multiple canvas styles per brand
- [ ] AI-powered prompt generation
- [ ] Video generation support
- [ ] Multi-page PDF output

### Contribution

Để thêm design styles mới, chỉnh sửa:
- `design-philosophy-generator.js`: Thêm categories và movements
- `canvas-adapter.js`: Thêm composition functions

## License

MIT - Same as automation project

## Support

Nếu có vấn đề, check:
1. Python packages installed
2. Brand config exists
3. Content.json format correct
4. Permissions on output directory
