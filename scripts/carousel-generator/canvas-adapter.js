/**
 * Canvas Adapter
 * Integrates canvas-design skill into the automation workflow
 * Creates museum-quality artwork for hero/cover slides
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Canvas Design Configuration
 */
const CANVAS_DESIGN_PATH = '/Users/admin/Desktop/Claude/skills_tonghop/canvas-design';
const CANVAS_FONTS_PATH = path.join(CANVAS_DESIGN_PATH, 'canvas-fonts');

/**
 * Generate canvas artwork based on design philosophy
 * This function creates a museum-quality visual using the canvas-design principles
 *
 * @param {Object} designPhilosophy - Generated design philosophy
 * @param {Object} slideData - Slide data with headline, subheadline, visual description
 * @param {Object} dimensions - Width and height for output
 * @param {string} outputPath - Where to save the generated image
 * @returns {Promise<string>} - Path to generated image
 */
async function generateCanvasArtwork(designPhilosophy, slideData, dimensions, outputPath) {
  console.log(`🎨 Generating canvas artwork with philosophy: ${designPhilosophy.movementName}`);

  // Create comprehensive canvas creation prompt
  const canvasPrompt = buildCanvasPrompt(designPhilosophy, slideData, dimensions);

  // For now, we'll use Python with matplotlib/PIL to create sophisticated designs
  // In future, this could integrate with actual canvas-design skill execution
  const artwork = await createSophisticatedCanvas(canvasPrompt, dimensions, outputPath);

  console.log(`✓ Canvas artwork generated: ${outputPath}`);
  return artwork;
}

/**
 * Build comprehensive prompt for canvas creation
 */
function buildCanvasPrompt(philosophy, slideData, dimensions) {
  const { movementName, visualGuidelines, promptHints } = philosophy;

  return {
    philosophy: {
      name: movementName,
      colorPalette: visualGuidelines.colorPalette,
      styleKeywords: visualGuidelines.styleKeywords,
      approach: visualGuidelines.composition.approach
    },
    content: {
      headline: slideData.headline || '',
      subheadline: slideData.subheadline || '',
      visualDescription: slideData.visual || promptHints.base,
      type: slideData.type || 'title'
    },
    technical: {
      width: dimensions.width || 1080,
      height: dimensions.height || 1350,
      format: 'png',
      dpi: 300
    },
    guidelines: {
      textUsage: 'minimal - only headline if needed',
      visualDominance: '90% visual / 10% text',
      craftsmanship: 'museum-quality, meticulously crafted',
      styleModifiers: promptHints.styleModifiers
    }
  };
}

/**
 * Create sophisticated canvas using programmatic design
 * This creates high-quality artwork inspired by canvas-design principles
 */
async function createSophisticatedCanvas(prompt, dimensions, outputPath) {
  const { width, height } = dimensions;
  const { philosophy, content, guidelines } = prompt;

  // Generate Python script for sophisticated design
  const pythonScript = generatePythonCanvasScript(philosophy, content, { width, height }, outputPath);

  // Save temporary Python script
  const tempScriptPath = path.join(path.dirname(outputPath), '_temp_canvas_generator.py');
  fs.writeFileSync(tempScriptPath, pythonScript, 'utf8');

  try {
    // Execute Python script to generate artwork
    console.log('  → Executing canvas generation script...');
    execSync(`python3 "${tempScriptPath}"`, {
      stdio: 'pipe',
      timeout: 30000
    });

    // Clean up temp script
    fs.unlinkSync(tempScriptPath);

    // Verify output exists
    if (!fs.existsSync(outputPath)) {
      throw new Error('Canvas generation failed - output file not created');
    }

    return outputPath;
  } catch (error) {
    console.error('❌ Canvas generation error:', error.message);

    // Clean up temp script
    if (fs.existsSync(tempScriptPath)) {
      fs.unlinkSync(tempScriptPath);
    }

    // Fallback: Return null to use standard generation
    return null;
  }
}

/**
 * Generate Python script for canvas creation
 * Uses matplotlib and PIL for sophisticated geometric design
 */
function generatePythonCanvasScript(philosophy, content, dimensions, outputPath) {
  const { colorPalette, styleKeywords, approach } = philosophy;
  const { headline, subheadline, visualDescription } = content;
  const { width, height } = dimensions;

  // Convert hex colors to RGB
  const primaryRGB = hexToRgb(colorPalette.primary);
  const accentRGB = hexToRgb(colorPalette.accent);
  const backgroundRGB = hexToRgb(colorPalette.background);
  const textRGB = hexToRgb(colorPalette.text);

  return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sophisticated Canvas Generator
Inspired by canvas-design principles for museum-quality artwork
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import Rectangle, Circle, Polygon
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# Design philosophy configuration
PHILOSOPHY = {
    'name': '${philosophy.name}',
    'approach': '${approach}',
    'style': ${JSON.stringify(styleKeywords)}
}

# Color palette (RGB normalized 0-1)
COLORS = {
    'primary': (${primaryRGB.r / 255}, ${primaryRGB.g / 255}, ${primaryRGB.b / 255}),
    'accent': (${accentRGB.r / 255}, ${accentRGB.g / 255}, ${accentRGB.b / 255}),
    'background': (${backgroundRGB.r / 255}, ${backgroundRGB.g / 255}, ${backgroundRGB.b / 255}),
    'text': (${textRGB.r / 255}, ${textRGB.g / 255}, ${textRGB.b / 255})
}

# Content
HEADLINE = """${escapeString(headline)}"""
SUBHEADLINE = """${escapeString(subheadline)}"""

# Dimensions
WIDTH = ${width}
HEIGHT = ${height}
DPI = 150  # High quality

def create_geometric_composition():
    """Create sophisticated geometric composition"""
    fig, ax = plt.subplots(figsize=(WIDTH/DPI, HEIGHT/DPI), dpi=DPI)
    ax.set_xlim(0, WIDTH)
    ax.set_ylim(0, HEIGHT)
    ax.set_aspect('equal')
    ax.axis('off')

    # Background
    bg = Rectangle((0, 0), WIDTH, HEIGHT,
                   facecolor=COLORS['background'],
                   edgecolor='none',
                   zorder=0)
    ax.add_patch(bg)

    # Create geometric elements based on approach
    approach = '${approach}'

    if 'geometric' in approach.lower() or 'futuristic' in approach.lower():
        create_geometric_blocks(ax, WIDTH, HEIGHT)
    elif 'organic' in approach.lower():
        create_organic_forms(ax, WIDTH, HEIGHT)
    elif 'architectural' in approach.lower():
        create_architectural_elements(ax, WIDTH, HEIGHT)
    else:
        create_minimalist_composition(ax, WIDTH, HEIGHT)

    # Add text (minimal, sophisticated)
    if HEADLINE:
        add_sophisticated_text(ax, WIDTH, HEIGHT)

    plt.tight_layout(pad=0)
    return fig

def create_geometric_blocks(ax, w, h):
    """Geometric precision blocks"""
    np.random.seed(42)  # Consistent randomization

    # Large primary block
    block_w = w * 0.6
    block_h = h * 0.4
    block_x = w * 0.2
    block_y = h * 0.3

    primary_block = Rectangle(
        (block_x, block_y), block_w, block_h,
        facecolor=COLORS['primary'],
        edgecolor='none',
        alpha=0.9,
        zorder=1
    )
    ax.add_patch(primary_block)

    # Accent geometric shapes
    for i in range(5):
        size = np.random.uniform(50, 150)
        x = np.random.uniform(0, w - size)
        y = np.random.uniform(0, h - size)

        if i % 2 == 0:
            shape = Rectangle((x, y), size, size,
                            facecolor=COLORS['accent'],
                            alpha=0.3,
                            edgecolor='none',
                            zorder=2)
        else:
            shape = Circle((x + size/2, y + size/2), size/2,
                          facecolor=COLORS['accent'],
                          alpha=0.2,
                          edgecolor='none',
                          zorder=2)
        ax.add_patch(shape)

    # Fine lines for sophistication
    for i in range(10):
        x1 = np.random.uniform(0, w)
        y1 = np.random.uniform(0, h)
        x2 = np.random.uniform(0, w)
        y2 = np.random.uniform(0, h)
        ax.plot([x1, x2], [y1, y2],
               color=COLORS['accent'],
               linewidth=0.5,
               alpha=0.3,
               zorder=3)

def create_organic_forms(ax, w, h):
    """Elegant organic shapes"""
    np.random.seed(42)

    # Flowing curves
    t = np.linspace(0, 2*np.pi, 100)

    for i in range(3):
        offset_x = w * (0.2 + i * 0.3)
        offset_y = h * 0.5
        scale_x = w * 0.15
        scale_y = h * 0.2

        x = offset_x + scale_x * np.sin(t + i)
        y = offset_y + scale_y * np.cos(2*t + i)

        color = COLORS['accent'] if i % 2 == 0 else COLORS['primary']
        alpha = 0.3 if i == 1 else 0.2

        ax.fill(x, y, color=color, alpha=alpha, edgecolor='none', zorder=1)

def create_architectural_elements(ax, w, h):
    """Brutalist architectural composition"""
    # Monumental vertical blocks
    blocks = [
        {'x': w * 0.1, 'y': h * 0.2, 'w': w * 0.25, 'h': h * 0.6},
        {'x': w * 0.4, 'y': h * 0.1, 'w': w * 0.15, 'h': h * 0.7},
        {'x': w * 0.65, 'y': h * 0.25, 'w': w * 0.25, 'h': h * 0.5},
    ]

    for i, block in enumerate(blocks):
        color = COLORS['primary'] if i % 2 == 0 else COLORS['accent']
        alpha = 0.8 if i == 1 else 0.6

        rect = Rectangle(
            (block['x'], block['y']), block['w'], block['h'],
            facecolor=color,
            edgecolor='none',
            alpha=alpha,
            zorder=i+1
        )
        ax.add_patch(rect)

def create_minimalist_composition(ax, w, h):
    """Pure minimalist approach"""
    # Single powerful element
    center_x = w * 0.5
    center_y = h * 0.5
    size = min(w, h) * 0.4

    circle = Circle((center_x, center_y), size,
                   facecolor=COLORS['primary'],
                   alpha=0.8,
                   edgecolor='none',
                   zorder=1)
    ax.add_patch(circle)

    # Accent line
    ax.plot([0, w], [h * 0.7, h * 0.7],
           color=COLORS['accent'],
           linewidth=3,
           alpha=0.7,
           zorder=2)

def add_sophisticated_text(ax, w, h):
    """Add minimal, sophisticated text"""
    # Headline - small, precise
    if HEADLINE:
        headline_size = 24 if len(HEADLINE) > 30 else 32
        ax.text(w * 0.5, h * 0.85, HEADLINE,
               fontsize=headline_size,
               fontweight='light',
               ha='center',
               va='center',
               color=COLORS['text'],
               zorder=10,
               alpha=0.9)

    # Subheadline - whisper quiet
    if SUBHEADLINE and len(SUBHEADLINE) < 100:
        ax.text(w * 0.5, h * 0.15, SUBHEADLINE,
               fontsize=14,
               fontweight='light',
               ha='center',
               va='center',
               color=COLORS['accent'],
               alpha=0.7,
               zorder=10)

def main():
    """Generate canvas artwork"""
    print("🎨 Creating sophisticated canvas artwork...")

    fig = create_geometric_composition()

    # Save with high quality
    output_path = """${outputPath}"""
    plt.savefig(output_path,
               dpi=DPI,
               bbox_inches='tight',
               pad_inches=0,
               facecolor=COLORS['background'])
    plt.close()

    print(f"✓ Canvas artwork saved: {output_path}")

if __name__ == '__main__':
    main()
`;
}

/**
 * Helper: Convert hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Helper: Escape string for Python
 */
function escapeString(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');
}

/**
 * Check if canvas generation is available
 */
function isCanvasAvailable() {
  try {
    // Check if Python 3 is available
    execSync('python3 --version', { stdio: 'pipe' });

    // Check if required Python packages are available
    const checkPackages = `python3 -c "import matplotlib; import PIL; import numpy"`;
    execSync(checkPackages, { stdio: 'pipe' });

    return true;
  } catch (error) {
    console.warn('⚠️  Canvas generation not available. Install: pip3 install matplotlib pillow numpy');
    return false;
  }
}

module.exports = {
  generateCanvasArtwork,
  buildCanvasPrompt,
  isCanvasAvailable,
  CANVAS_DESIGN_PATH,
  CANVAS_FONTS_PATH
};
