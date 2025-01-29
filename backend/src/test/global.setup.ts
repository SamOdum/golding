import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async () => {
  try {
    // Run migrations
    await execAsync('pnpm prisma:deploy');
    console.log('✅ Test database migrated successfully');
  } catch (error) {
    console.error('Failed to migrate test database:', error);
    throw error;
  }
};
