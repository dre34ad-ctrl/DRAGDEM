import { execSync } from 'child_process';

export function team_db(sql: string): any {
  try {
    const cmd = `team-db "${sql.replace(/"/g, '\\"')}"`;
    const output = execSync(cmd).toString();
    return JSON.parse(output);
  } catch (error: any) {
    console.error(`team-db error: ${error.message}`);
    throw error;
  }
}
