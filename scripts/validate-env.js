#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read both files
const templatePath = path.join(process.cwd(), '.env.template');
const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please create one based on .env.template');
  process.exit(1);
}

if (!fs.existsSync(templatePath)) {
  console.error('❌ .env.template file not found');
  process.exit(1);
}

const templateVars = fs.readFileSync(templatePath, 'utf8')
  .split('\n')
  .filter(line => line && !line.startsWith('#'))
  .map(line => line.split('=')[0]);

const envVars = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .filter(line => line && !line.startsWith('#'))
  .map(line => line.split('=')[0]);

const missingVars = templateVars.filter(v => !envVars.includes(v));

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:');
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error('\nPlease add them to your .env file');
  process.exit(1);
}

console.log('✅ All required environment variables are present');
