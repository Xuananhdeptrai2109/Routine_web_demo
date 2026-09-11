const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

// Parse DATABASE_URL: mysql://root:password@localhost:3306/routine_db
const parsed = new URL(dbUrl);
const user = parsed.username;
const password = decodeURIComponent(parsed.password);
const host = parsed.hostname || 'localhost';
const port = parsed.port || '3306';
const database = parsed.pathname.replace(/^\//, '');

const outputFile = path.join(__dirname, '../routine_db.sql');

console.log(`Dumping database "${database}" from ${host}:${port} as user "${user}"...`);

const cmd = `mysqldump -u ${user} -p"${password}" -h ${host} -P ${port} --default-character-set=utf8mb4 --routines --triggers --hex-blob ${database}`;

try {
  const dumpOutput = execSync(cmd, {
    maxBuffer: 50 * 1024 * 1024, // 50MB buffer
    encoding: 'utf8',
  });

  fs.writeFileSync(outputFile, dumpOutput, 'utf8');
  const stats = fs.statSync(outputFile);
  console.log(`Successfully exported to "${outputFile}". File size: ${stats.size} bytes.`);
} catch (err) {
  console.error('Dump failed:', err.message);
  process.exit(1);
}
