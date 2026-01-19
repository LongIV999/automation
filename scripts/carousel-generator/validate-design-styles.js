#!/usr/bin/env node

/**
 * Design Style Validator
 *
 * Validates content JSON files against official design style standards.
 * Checks for deprecated styles and provides migration suggestions.
 *
 * Usage:
 *   node validate-design-styles.js [content-file.json]
 *   node validate-design-styles.js --all  (validate all content files)
 */

const fs = require('fs');
const path = require('path');

// Official design styles from DESIGN_STYLES_REFERENCE.md
const OFFICIAL_STYLES = ['tutorial', 'infographic', 'quote', 'comparison'];

// Deprecated styles and their migration paths
const DEPRECATED_STYLES = {
  'notebook-lm': {
    migratesTo: 'tutorial',
    reason: 'Standardized to official tutorial style for educational content',
    brands: ['longbest-ai', 'thachvuland']
  },
  'classic': {
    migratesTo: 'quote',
    reason: 'Classic elegant style maps to "quote" for minimal posts',
    brands: ['queennailbern'],
    note: 'Use "infographic" for multi-point tips instead'
  },
  'modern-minimal': {
    migratesTo: 'quote',
    reason: 'Minimal aesthetic aligns with "quote" style',
    brands: ['all']
  },
  'head-silhouette': {
    migratesTo: 'infographic',
    reason: 'Visual-focused content fits "infographic" style',
    brands: ['all']
  },
  'single-post': {
    migratesTo: null,
    reason: 'This is a FORMAT TYPE, not a design style. Use formatType field instead.',
    note: 'Set formatType: "single-post" and choose a design style from: ' + OFFICIAL_STYLES.join(', ')
  },
  'carousel-standard': {
    migratesTo: null,
    reason: 'This is a FORMAT TYPE, not a design style. Use formatType field instead.',
    note: 'Set formatType: "carousel-standard" and choose a design style'
  },
  'carousel-compact': {
    migratesTo: null,
    reason: 'This is a FORMAT TYPE, not a design style. Use formatType field instead.',
    note: 'Set formatType: "carousel-compact" and choose a design style'
  }
};

// Official format types
const OFFICIAL_FORMATS = [
  'single-post',
  'carousel-compact',
  'carousel-standard',
  'carousel-long',
  'story'
];

// Brand-specific recommendations
const BRAND_STYLES = {
  'queennailbern': {
    primary: 'quote',
    secondary: 'infographic',
    note: 'Use "quote" for promotions/testimonials, "infographic" for tips'
  },
  'longbest-ai': {
    primary: 'tutorial',
    secondary: 'infographic',
    tertiary: 'quote',
    note: 'Use "tutorial" for step-by-step, "infographic" for data'
  },
  'thachvuland': {
    primary: 'infographic',
    secondary: 'tutorial',
    note: 'Use "infographic" for property listings, "tutorial" for educational content'
  }
};

class DesignStyleValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
  }

  validateFile(filePath) {
    console.log(`\n🔍 Validating: ${path.basename(filePath)}`);
    console.log('━'.repeat(60));

    this.errors = [];
    this.warnings = [];
    this.suggestions = [];

    // Read and parse JSON
    let content;
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      content = JSON.parse(fileContent);
    } catch (error) {
      this.errors.push(`Failed to parse JSON: ${error.message}`);
      return this.printResults();
    }

    // Extract brand name from content or filename
    const brand = this.extractBrand(content, filePath);

    // Validate design style
    this.validateDesignStyle(content, brand);

    // Validate format type
    this.validateFormatType(content);

    // Validate consistency between fields
    this.validateConsistency(content);

    // Validate dimensions
    this.validateDimensions(content);

    // Print results
    return this.printResults();
  }

  extractBrand(content, filePath) {
    // Try to get brand from content
    if (content.brand) {
      const brandLower = content.brand.toLowerCase().replace(/\s+/g, '-');
      return brandLower;
    }

    // Try to extract from filename
    const filename = path.basename(filePath, '.json');
    if (filename.startsWith('queennail')) return 'queennailbern';
    if (filename.startsWith('longbest')) return 'longbest-ai';
    if (filename.startsWith('thachvuland')) return 'thachvuland';

    return 'unknown';
  }

  validateDesignStyle(content, brand) {
    const designStyle = content.designStyle;

    if (!designStyle) {
      this.errors.push('Missing "designStyle" field');
      this.suggestions.push(`Add designStyle field with one of: ${OFFICIAL_STYLES.join(', ')}`);

      if (brand && BRAND_STYLES[brand]) {
        this.suggestions.push(`Recommended for ${brand}: "${BRAND_STYLES[brand].primary}" (primary)`);
      }
      return;
    }

    // Check if it's an official style
    if (OFFICIAL_STYLES.includes(designStyle)) {
      console.log(`✅ Design style: "${designStyle}" (official)`);

      // Check if it matches brand recommendations
      if (brand && BRAND_STYLES[brand]) {
        const brandConfig = BRAND_STYLES[brand];
        const recommendedStyles = [brandConfig.primary, brandConfig.secondary, brandConfig.tertiary].filter(Boolean);

        if (!recommendedStyles.includes(designStyle)) {
          this.warnings.push(`Style "${designStyle}" is valid but not typical for ${brand}`);
          this.suggestions.push(`${brand} typically uses: ${recommendedStyles.join(', ')}`);
          this.suggestions.push(`Note: ${brandConfig.note}`);
        }
      }
    }
    // Check if it's deprecated
    else if (DEPRECATED_STYLES[designStyle]) {
      const deprecation = DEPRECATED_STYLES[designStyle];
      this.errors.push(`Deprecated design style: "${designStyle}"`);

      if (deprecation.migratesTo) {
        this.suggestions.push(`Migrate to: "${deprecation.migratesTo}"`);
        this.suggestions.push(`Reason: ${deprecation.reason}`);
      } else {
        this.suggestions.push(deprecation.reason);
      }

      if (deprecation.note) {
        this.suggestions.push(`Note: ${deprecation.note}`);
      }
    }
    // Unknown style
    else {
      this.errors.push(`Unknown design style: "${designStyle}"`);
      this.suggestions.push(`Use one of the official styles: ${OFFICIAL_STYLES.join(', ')}`);

      if (brand && BRAND_STYLES[brand]) {
        this.suggestions.push(`For ${brand}, recommended: "${BRAND_STYLES[brand].primary}"`);
      }
    }
  }

  validateFormatType(content) {
    const formatType = content.formatType;

    if (!formatType) {
      this.warnings.push('Missing "formatType" field');
      this.suggestions.push(`Add formatType field with one of: ${OFFICIAL_FORMATS.join(', ')}`);
      return;
    }

    if (OFFICIAL_FORMATS.includes(formatType)) {
      console.log(`✅ Format type: "${formatType}" (official)`);
    } else {
      this.errors.push(`Unknown format type: "${formatType}"`);
      this.suggestions.push(`Use one of: ${OFFICIAL_FORMATS.join(', ')}`);
    }
  }

  validateConsistency(content) {
    const { formatType, slideCount, dimensions } = content;

    // Check slideCount matches formatType
    if (formatType && slideCount) {
      const expectedCounts = {
        'single-post': 1,
        'carousel-compact': [3, 4, 5],
        'carousel-standard': 7,
        'carousel-long': [8, 9, 10, 11, 12, 13, 14, 15],
        'story': 1
      };

      const expected = expectedCounts[formatType];
      if (expected) {
        const isValid = Array.isArray(expected)
          ? expected.includes(slideCount)
          : slideCount === expected;

        if (!isValid) {
          this.warnings.push(`slideCount ${slideCount} doesn't match formatType "${formatType}"`);
          const expectedStr = Array.isArray(expected) ? expected.join('-') : expected;
          this.suggestions.push(`Expected slideCount for "${formatType}": ${expectedStr}`);
        }
      }
    }

    // Check slides array matches slideCount
    if (content.slides && slideCount) {
      if (content.slides.length !== slideCount) {
        this.warnings.push(`slides array length (${content.slides.length}) doesn't match slideCount (${slideCount})`);
      }
    }
  }

  validateDimensions(content) {
    const { formatType, dimensions } = content;

    if (!dimensions) {
      this.warnings.push('Missing "dimensions" field');
      return;
    }

    const expectedDimensions = {
      'single-post': { width: 1200, height: 1200, aspectRatio: '1:1' },
      'carousel-compact': { width: 1080, height: 1350, aspectRatio: '4:5' },
      'carousel-standard': { width: 1080, height: 1350, aspectRatio: '4:5' },
      'carousel-long': { width: 1080, height: 1350, aspectRatio: '4:5' },
      'story': { width: 1080, height: 1920, aspectRatio: '9:16' }
    };

    const expected = expectedDimensions[formatType];
    if (expected && dimensions) {
      if (dimensions.width !== expected.width || dimensions.height !== expected.height) {
        this.warnings.push(`Dimensions ${dimensions.width}x${dimensions.height} don't match formatType "${formatType}"`);
        this.suggestions.push(`Expected: ${expected.width}x${expected.height} (${expected.aspectRatio})`);
      }
    }
  }

  printResults() {
    const hasIssues = this.errors.length > 0 || this.warnings.length > 0;

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(err => console.log(`   • ${err}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warn => console.log(`   • ${warn}`));
    }

    if (this.suggestions.length > 0) {
      console.log('\n💡 SUGGESTIONS:');
      this.suggestions.forEach(sug => console.log(`   • ${sug}`));
    }

    if (!hasIssues) {
      console.log('\n✨ All validations passed!');
    }

    console.log('━'.repeat(60));

    return {
      valid: this.errors.length === 0,
      hasWarnings: this.warnings.length > 0,
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions
    };
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🎨 Design Style Validator

Usage:
  node validate-design-styles.js <content-file.json>
  node validate-design-styles.js --all

Examples:
  node validate-design-styles.js content/longbest-ai-tools.json
  node validate-design-styles.js --all
    `);
    process.exit(1);
  }

  const validator = new DesignStyleValidator();

  if (args[0] === '--all') {
    // Validate all content files
    const contentDir = path.join(__dirname, 'content');
    const files = fs.readdirSync(contentDir)
      .filter(f => f.endsWith('.json'))
      .map(f => path.join(contentDir, f));

    console.log(`\n📂 Validating ${files.length} content files...\n`);

    let totalErrors = 0;
    let totalWarnings = 0;
    const failedFiles = [];

    files.forEach(file => {
      const result = validator.validateFile(file);
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;

      if (!result.valid) {
        failedFiles.push(path.basename(file));
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total files: ${files.length}`);
    console.log(`Passed: ${files.length - failedFiles.length}`);
    console.log(`Failed: ${failedFiles.length}`);
    console.log(`Total errors: ${totalErrors}`);
    console.log(`Total warnings: ${totalWarnings}`);

    if (failedFiles.length > 0) {
      console.log('\n❌ Files with errors:');
      failedFiles.forEach(f => console.log(`   • ${f}`));
      process.exit(1);
    }

  } else {
    // Validate single file
    const filePath = path.resolve(args[0]);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    const result = validator.validateFile(filePath);

    if (!result.valid) {
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { DesignStyleValidator, OFFICIAL_STYLES, DEPRECATED_STYLES };
