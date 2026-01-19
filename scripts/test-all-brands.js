/**
 * Test All Brands - Automated testing for all brands
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');

const BRANDS = [
    { id: 'longbest', name: 'Long Best AI', topic: 'AI Tools for Business 2024' },
    { id: 'thachvuland', name: 'Thach Vu Land', topic: 'Căn hộ cao cấp Quận 2' },
    { id: 'queennailbern', name: 'Queen Nail Bern', topic: 'Winter Nail Trends 2024' }
];

async function testBrand(brand) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing ${brand.name}`);
    console.log(`${'='.repeat(60)}\n`);
    
    try {
        // Run monitored workflow
        const command = `node scripts/daily-agent-monitored.js "${brand.topic}" --brand ${brand.id}`;
        console.log(`Running: ${command}\n`);
        
        const { stdout, stderr } = await execPromise(command, {
            cwd: '/Users/admin/automation',
            env: { ...process.env, NODE_ENV: 'test' }
        });
        
        console.log(stdout);
        if (stderr) console.error(stderr);
        
        console.log(`\n✅ ${brand.name} test completed successfully!`);
        return { brand: brand.name, success: true };
        
    } catch (error) {
        console.error(`\n❌ ${brand.name} test failed:`, error.message);
        return { brand: brand.name, success: false, error: error.message };
    }
}

async function testAllBrands() {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║          🧪 TESTING ALL BRANDS WORKFLOW 🧪               ║
╚══════════════════════════════════════════════════════════╝
    `);
    
    const results = [];
    
    for (const brand of BRANDS) {
        const result = await testBrand(brand);
        results.push(result);
        
        // Wait 2 seconds between brands
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Summary
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 TEST SUMMARY');
    console.log(`${'='.repeat(60)}\n`);
    
    results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        const message = result.success ? 'Passed' : `Failed: ${result.error}`;
        console.log(`${status} ${result.brand}: ${message}`);
    });
    
    const passCount = results.filter(r => r.success).length;
    console.log(`\nTotal: ${passCount}/${results.length} brands passed`);
    
    // Check monitoring dashboard
    console.log('\n📊 View detailed results at: http://localhost:3002');
}

// Run tests
if (require.main === module) {
    testAllBrands().catch(console.error);
}

module.exports = { testAllBrands, testBrand };