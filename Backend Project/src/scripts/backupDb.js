import dotenv from 'dotenv';
dotenv.config();
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dataManagementService from '../features/data-management/dataManagement.service.js';
import prisma from '../shared/config/prisma.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const backupsDir = join(__dirname, '../../backups');

async function main() {
  console.log('\n======================================================');
  console.log('📦 CREATING FULL DATABASE SNAPSHOT BACKUP');
  console.log('======================================================\n');

  try {
    if (!existsSync(backupsDir)) {
      mkdirSync(backupsDir, { recursive: true });
    }

    console.log('⏳ Exporting categories, products, filters, badges, and pages from PostgreSQL...');
    const backupData = await dataManagementService.generateFullBackup();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFileName = `backup-${timestamp}.json`;
    const backupFilePath = join(backupsDir, backupFileName);
    const latestFilePath = join(backupsDir, 'latest_backup.json');

    const jsonString = JSON.stringify(backupData, null, 2);
    writeFileSync(backupFilePath, jsonString, 'utf8');
    writeFileSync(latestFilePath, jsonString, 'utf8');

    console.log('\n✅ BACKUP COMPLETED SUCCESSFULLY!');
    console.log(`   📁 File:      ${backupFileName}`);
    console.log(`   📌 Latest:    latest_backup.json`);
    console.log(`   📂 Location:  ${backupsDir}`);
    console.log('\n📊 Exported Entity Counts:');
    console.log(`   - Products:   ${backupData.counts.products}`);
    console.log(`   - Categories: ${backupData.counts.categories}`);
    console.log(`   - Filters:    ${backupData.counts.filters}`);
    console.log(`   - Badges:     ${backupData.counts.badges}`);
    console.log(`   - CMS Pages:  ${backupData.counts.pages}\n`);
  } catch (error) {
    console.error('\n❌ Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
