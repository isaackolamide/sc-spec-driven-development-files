import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Get root directory
const rootDir = process.cwd();
const changelogPath = path.join(rootDir, 'CHANGELOG.md');

// Run git command to get log
let gitLog = '';
try {
  gitLog = execSync('git log --date=short --pretty=format:"%ad|%s"', { encoding: 'utf-8' });
} catch (error) {
  console.error('Error fetching git log:', error);
  process.exit(1);
}

// Parse git log entries
const commits = gitLog.split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => {
    const parts = line.split('|');
    const date = parts[0];
    const message = parts.slice(1).join('|');
    return { date, message };
  })
  // Filter out merge commits
  .filter(c => !c.message.startsWith('Merge '));

// Read existing changelog
let existingContent = '';
if (fs.existsSync(changelogPath)) {
  existingContent = fs.readFileSync(changelogPath, 'utf-8');
}

// Extract existing bullets to prevent duplicates
const existingBullets = new Set<string>();
const lines = existingContent.split('\n');
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('- ')) {
    existingBullets.add(trimmed.substring(2).trim());
  }
}

// Group new commits by date
const newCommitsByDate: { [date: string]: string[] } = {};
for (const c of commits) {
  if (!existingBullets.has(c.message)) {
    if (!newCommitsByDate[c.date]) {
      newCommitsByDate[c.date] = [];
    }
    // Avoid adding duplicate commit messages in the same run
    if (!newCommitsByDate[c.date].includes(c.message)) {
      newCommitsByDate[c.date].push(c.message);
    }
  }
}

// If no new commits, we are done!
const newDates = Object.keys(newCommitsByDate).sort((a, b) => b.localeCompare(a));
if (newDates.length === 0) {
  console.log('Changelog is already up-to-date.');
  process.exit(0);
}

// Build new entries content
let newEntriesContent = '';
for (const date of newDates) {
  newEntriesContent += `\n## ${date}\n\n`;
  for (const msg of newCommitsByDate[date]) {
    newEntriesContent += `- ${msg}\n`;
  }
}

let finalContent = '';
if (existingContent.trim().length === 0) {
  finalContent = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n${newEntriesContent}`;
} else {
  // Insert new entries below the title/description header
  // Find the first heading starting with '##'
  const firstHeadingIndex = lines.findIndex(line => line.trim().startsWith('##'));
  if (firstHeadingIndex === -1) {
    // If no headings found, just append to header
    finalContent = `${existingContent.trim()}\n${newEntriesContent}`;
  } else {
    const headerLines = lines.slice(0, firstHeadingIndex);
    const restLines = lines.slice(firstHeadingIndex);
    finalContent = `${headerLines.join('\n').trim()}\n${newEntriesContent}\n${restLines.join('\n')}`;
  }
}

fs.writeFileSync(changelogPath, finalContent.trim() + '\n', 'utf-8');
console.log('CHANGELOG.md updated successfully.');
