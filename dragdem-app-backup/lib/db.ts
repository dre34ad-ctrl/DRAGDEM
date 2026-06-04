import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function teamDb(sql: string): Promise<any[]> {
  try {
    // Sanitize the SQL string to escape single quotes properly for the shell command
    const sanitizedSql = sql.replace(/'/g, "'\\''");
    const { stdout, stderr } = await execAsync(`team-db "${sanitizedSql}"`);
    
    if (stderr) {
      console.error('team-db stderr:', stderr);
    }

    try {
      return JSON.parse(stdout);
    } catch (parseError) {
      // If it's not JSON, it might be an empty result or an error message
      if (stdout.trim() === '[]' || stdout.trim() === '') {
        return [];
      }
      console.error('Error parsing team-db output:', stdout);
      return [];
    }
  } catch (error) {
    console.error('Error executing team-db command:', error);
    return [];
  }
}
