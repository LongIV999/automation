#!/usr/bin/env node
/**
 * Typography Preset Switcher
 * Tiện ích để nhanh chóng thay đổi preset kích thước chữ
 */

const fs = require('fs').promises;
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'typography-config.json');

// Color codes for terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

async function loadConfig() {
  const rawData = await fs.readFile(CONFIG_PATH, 'utf-8');
  return JSON.parse(rawData);
}

async function saveConfig(config) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

function printCurrentConfig(config) {
  console.log(`\n${colors.bright}📐 TYPOGRAPHY CONFIGURATION${colors.reset}\n`);

  const preset = config.presets[config.currentPreset];
  console.log(`Current Preset: ${colors.green}${config.currentPreset}${colors.reset}`);
  console.log(`Description: ${preset.description}`);
  console.log(`Multiplier: ${preset.multiplier}x\n`);

  console.log(`${colors.bright}Font Sizes (with current preset applied):${colors.reset}`);

  Object.keys(config.fontSizes).forEach(key => {
    const fs = config.fontSizes[key];
    const appliedValue = Math.round(fs.value * preset.multiplier);
    console.log(`  ${key.padEnd(15)} : ${appliedValue}px  (base: ${fs.value}px)`);
  });
}

function printPresets(config) {
  console.log(`\n${colors.bright}Available Presets:${colors.reset}\n`);

  Object.keys(config.presets).forEach((key, index) => {
    const preset = config.presets[key];
    const isCurrent = key === config.currentPreset;
    const marker = isCurrent ? `${colors.green}➤${colors.reset}` : ' ';

    console.log(`${marker} [${index + 1}] ${colors.blue}${key}${colors.reset}`);
    console.log(`    ${preset.description}`);
    console.log(`    Multiplier: ${preset.multiplier}x\n`);
  });
}

async function changePreset(presetName) {
  const config = await loadConfig();

  if (!config.presets[presetName]) {
    console.error(`${colors.red}❌ Preset "${presetName}" not found!${colors.reset}`);
    console.log('\nAvailable presets:');
    Object.keys(config.presets).forEach(key => {
      console.log(`  - ${key}`);
    });
    process.exit(1);
  }

  config.currentPreset = presetName;
  await saveConfig(config);

  console.log(`${colors.green}✓ Preset changed to: ${presetName}${colors.reset}`);
  printCurrentConfig(config);
}

async function interactiveMode() {
  const config = await loadConfig();

  printCurrentConfig(config);
  printPresets(config);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question(`\n${colors.bright}Select preset (1-${Object.keys(config.presets).length}):${colors.reset} `, async (answer) => {
    readline.close();

    const presetKeys = Object.keys(config.presets);
    const index = parseInt(answer) - 1;

    if (index >= 0 && index < presetKeys.length) {
      await changePreset(presetKeys[index]);
    } else {
      console.error(`${colors.red}❌ Invalid selection${colors.reset}`);
      process.exit(1);
    }
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Interactive mode
    await interactiveMode();
  } else {
    const command = args[0];

    switch (command) {
      case 'show':
      case 'status':
        const config = await loadConfig();
        printCurrentConfig(config);
        break;

      case 'set':
        if (args.length < 2) {
          console.error(`${colors.red}Usage: npm run set-preset set <preset-name>${colors.reset}`);
          process.exit(1);
        }
        await changePreset(args[1]);
        break;

      case 'list':
        const cfg = await loadConfig();
        printPresets(cfg);
        break;

      case 'help':
      default:
        console.log(`
${colors.bright}Typography Preset Switcher${colors.reset}

Usage:
  ${colors.green}npm run set-preset${colors.reset}                    - Interactive mode
  ${colors.green}npm run set-preset show${colors.reset}               - Show current configuration
  ${colors.green}npm run set-preset list${colors.reset}               - List all presets
  ${colors.green}npm run set-preset set <name>${colors.reset}         - Set preset by name

Examples:
  ${colors.blue}npm run set-preset set readablePreview${colors.reset}
  ${colors.blue}npm run set-preset set default${colors.reset}
  ${colors.blue}npm run set-preset set extraLarge${colors.reset}
        `);
        break;
    }
  }
}

main().catch(error => {
  console.error(`${colors.red}❌ Error:${colors.reset}`, error.message);
  process.exit(1);
});
