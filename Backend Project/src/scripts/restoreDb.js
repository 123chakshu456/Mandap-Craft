import dotenv from 'dotenv';
dotenv.config();
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dataManagementService from '../features/data-management/dataManagement.service.js';
import prisma from '../shared/config/prisma.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const backupsDir = join(__dirname, '../../backups');

async function main() {
  console.log('\n======================================================');
  console.log('🔄 RESTORING DATABASE FROM SNAPSHOT BACKUP');
  console.log('======================================================\n');

  try {
    const targetFile = process.argv[2]
      ? join(process.cwd(), process.argv[2])
      : join(backupsDir, 'latest_backup.json');

    if (!existsSync(targetFile)) {
      console.error(`❌ Backup file not found: ${targetFile}`);
      console.log('   Run `npm run db:backup` first or specify a valid file path.');
      process.exit(1);
    }

    console.log(`📂 Reading backup from: ${targetFile}`);
    const fileContent = readFileSync(targetFile, 'utf8');
    const snapshotData = JSON.parse(fileContent);

    console.log(`⏳ Restoring snapshot exported at: ${snapshotData.exportedAt || 'unknown date'}...`);
    const results = await dataManagementService.restoreFullBackup(snapshotData, {
      id: 'cli-admin',
      email: 'cli-admin@shivshaktievents.com',
    });

    console.log('\n✅ DATABASE RESTORE COMPLETED SUCCESSFULLY!');
    console.log('📊 Restored Entities:');
    console.log(`   - Categories: ${results.categories}`);
    console.log(`   - Filters:    ${results.filters}`);
    console.log(`   - Badges:     ${results.badges}`);
    console.log(`   - CMS Pages:  ${results.pages}`);
    console.log(`   - Products:   ${results.products}\n`);
  } catch (error) {
    console.error('\n❌ Restore failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
