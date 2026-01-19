#!/usr/bin/env node

/**
 * Design Style Migration Script
 *
 * Automatically migrates content JSON files from deprecated design styles
 * to official standardized design styles.
 *
 * Usage:
 *   node migrate-design-styles.js [content-file.json]
 *   node migrate-design-styles.js --all
 *   node migrate-design-styles.js --all --dry-run
 */

const fs = require('fs');
const path = require('path');

// Migration rules
const MIGRATION_RULES = {
  'notebook-lm': 'tutorial',
  'classic': 'quote',
  'modern-minimal': 'quote',
  'head-silhouette': 'infographic',
  'notebook-typography': 'tutorial'
};

// Brand-specific overrides
const BRAND_OVERRIDES = {
  'thachvuland': {
    'notebook-lm': 'infographic' // Real estate uses infographic primarily
  }
};

class DesignStyleMigrator {
  constructor(dryRun = false) {
    this.dryRun = dryRun;
    this.migrated = 0;
    this.skipped = 0;
    this.errors = 0;
  }

  migrateFile(filePath) {
    console.log(`\n📄 Processing: ${path.basename(filePath)}`);

    try {
      // Read file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const content = JSON.parse(fileContent);

      // Extract brand
      const brand = this.extractBrand(content, filePath);

      // Check if migration needed
      const currentStyle = content.designStyle;
      if (!currentStyle) {
        console.log('   ⏭️  No designStyle field found - skipping');
        this.skipped++;
        return;
      }

      // Get migration target
      const newStyle = this.getMigrationTarget(currentStyle, brand);

      if (!newStyle) {
        console.log(`   ✅ Already using official style: "${currentStyle}"`);
        this.skipped++;
        return;
      }

      // Migrate
      console.log(`   🔄 Migrating: "${currentStyle}" → "${newStyle}"`);

      const updatedContent = {
        ...content,
        designStyle: newStyle
      };

      // Write back
      if (!this.dryRun) {
        const updatedJson = JSON.stringify(updatedContent, null, 2) + '\n';
        fs.writeFileSync(filePath, updatedJson, 'utf8');
        console.log('   ✅ Migration completed');
      } else {
        console.log('   🔍 DRY RUN - Changes not saved');
      }

      this.migrated++;

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      this.errors++;
    }
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

    return null;
  }

  getMigrationTarget(currentStyle, brand) {
    // Check brand-specific overrides first
    if (brand && BRAND_OVERRIDES[brand] && BRAND_OVERRIDES[brand][currentStyle]) {
      return BRAND_OVERRIDES[brand][currentStyle];
    }

    // Check general migration rules
    if (MIGRATION_RULES[currentStyle]) {
      return MIGRATION_RULES[currentStyle];
    }

    // Already official or unknown
    return null;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Migrated: ${this.migrated}`);
    console.log(`Skipped: ${this.skipped}`);
    console.log(`Errors: ${this.errors}`);

    if (this.dryRun) {
      console.log('\n⚠️  DRY RUN MODE - No files were actually modified');
      console.log('   Run without --dry-run to apply changes');
    }
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🔄 Design Style Migration Script

Usage:
  node migrate-design-styles.js <content-file.json>
  node migrate-design-styles.js --all
  node migrate-design-styles.js --all --dry-run

Examples:
  # Migrate single file
  node migrate-design-styles.js content/longbest-ai-tools.json

  # Migrate all files (preview only)
  node migrate-design-styles.js --all --dry-run

  # Migrate all files (apply changes)
  node migrate-design-styles.js --all

Migration Rules:
  notebook-lm       → tutorial
  classic           → quote
  modern-minimal    → quote
  head-silhouette   → infographic
  notebook-typography → tutorial

Brand-specific:
  thachvuland: notebook-lm → infographic (real estate uses data-focused style)
    `);
    process.exit(0);
  }

  const dryRun = args.includes('--dry-run');
  const migrator = new DesignStyleMigrator(dryRun);

  if (args.includes('--all')) {
    // Migrate all content files
    const contentDir = path.join(__dirname, 'content');

    if (!fs.existsSync(contentDir)) {
      console.error(`❌ Content directory not found: ${contentDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(contentDir)
      .filter(f => f.endsWith('.json') && !f.startsWith('.'))
      .map(f => path.join(contentDir, f));

    console.log(`\n📂 Found ${files.length} content files`);

    if (dryRun) {
      console.log('🔍 Running in DRY RUN mode - no changes will be saved\n');
    }

    files.forEach(file => {
      migrator.migrateFile(file);
    });

    migrator.printSummary();

  } else {
    // Migrate single file
    const filePath = path.resolve(args[0]);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    if (dryRun) {
      console.log('🔍 Running in DRY RUN mode - no changes will be saved\n');
    }

    migrator.migrateFile(filePath);
    migrator.printSummary();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { DesignStyleMigrator, MIGRATION_RULES };
