#!/usr/bin/env node

/**
 * Script to automatically update GitHub issue checkboxes based on commit messages
 * Usage: node scripts/update-issues.js
 */

const { execSync } = require('child_process');
const https = require('https');

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPOSITORY?.split('/')[0] || 'dangkhoa45';
const REPO_NAME = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'sprint-flow';

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

/**
 * Make HTTP request to GitHub API
 */
function githubRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}${path}`,
      method,
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'User-Agent': 'SprintFlow-CI',
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(
              new Error(
                `GitHub API error: ${res.statusCode} - ${response.message}`
              )
            );
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

/**
 * Get commits since last push
 */
function getCommits() {
  try {
    const before = process.env.GITHUB_EVENT_BEFORE || 'HEAD~1';
    const after = process.env.GITHUB_EVENT_AFTER || 'HEAD';

    const commits = execSync(`git log --oneline ${before}..${after}`, {
      encoding: 'utf8',
    });
    return commits.split('\n').filter(line => line.trim());
  } catch (error) {
    console.error('❌ Failed to get commits:', error.message);
    return [];
  }
}

/**
 * Extract issue numbers from commit messages
 */
function extractIssueNumbers(commits) {
  const issueNumbers = new Set();

  commits.forEach(commit => {
    const matches = commit.match(/#(\d+)/g);
    if (matches) {
      matches.forEach(match => {
        issueNumbers.add(match.substring(1)); // Remove #
      });
    }
  });

  return Array.from(issueNumbers);
}

/**
 * Parse tasks from issue body
 */
function parseTasks(issueBody) {
  const taskRegex = /^- \[([ x])\] (.+)$/gm;
  const tasks = [];
  let match;

  while ((match = taskRegex.exec(issueBody)) !== null) {
    tasks.push({
      completed: match[1] === 'x',
      description: match[2].trim(),
      line: match[0],
    });
  }

  return tasks;
}

/**
 * Update issue checkboxes based on commit messages
 */
async function updateIssueCheckboxes(issueNumber, commits) {
  try {
    console.log(`🔄 Processing issue #${issueNumber}...`);

    // Get issue details
    const issue = await githubRequest(`/issues/${issueNumber}`);

    if (issue.state === 'closed') {
      console.log(`ℹ️ Issue #${issueNumber} is already closed`);
      return false;
    }

    const tasks = parseTasks(issue.body || '');
    if (tasks.length === 0) {
      console.log(`ℹ️ No tasks found in issue #${issueNumber}`);
      return false;
    }

    console.log(`📋 Found ${tasks.length} tasks in issue #${issueNumber}`);

    // Check if any tasks should be marked as completed based on commit messages
    let hasChanges = false;
    const updatedBody = issue.body.replace(
      /^- \[ \] (.+)$/gm,
      (match, description) => {
        // Check if any commit message contains keywords that indicate task completion
        const keywords = [
          'complete',
          'finish',
          'done',
          'implement',
          'add',
          'create',
          'update',
          'fix',
          'resolve',
          'add',
          'integrate',
          'setup',
          'configure',
        ];

        const shouldComplete = commits.some(commit => {
          const commitLower = commit.toLowerCase();
          const descLower = description.toLowerCase();

          // Check if commit contains task description keywords
          return keywords.some(
            keyword =>
              commitLower.includes(keyword) &&
              (descLower.includes(keyword) || descLower.includes('task'))
          );
        });

        if (shouldComplete) {
          hasChanges = true;
          console.log(`✅ Marking task as completed: ${description}`);
          return `- [x] ${description}`;
        }

        return match;
      }
    );

    if (hasChanges) {
      // Update issue body
      await githubRequest(`/issues/${issueNumber}`, 'PATCH', {
        body: updatedBody,
      });

      console.log(`✅ Updated issue #${issueNumber}`);

      // Check if all tasks are now completed
      const updatedTasks = parseTasks(updatedBody);
      const completedTasks = updatedTasks.filter(task => task.completed);

      if (completedTasks.length === tasks.length && tasks.length > 0) {
        console.log(
          `🎉 All tasks completed for issue #${issueNumber}. Closing...`
        );

        // Close the issue
        await githubRequest(`/issues/${issueNumber}`, 'PATCH', {
          state: 'closed',
        });

        // Add completion comment
        const comment = `🎉 **Issue automatically closed!**

All tasks have been completed. This issue was automatically closed by the SprintFlow CI/CD pipeline.

**Completed tasks:** ${completedTasks.length}/${tasks.length}

**Related commits:**
${commits
  .filter(commit => commit.includes(`#${issueNumber}`))
  .slice(0, 5)
  .map(commit => `- ${commit}`)
  .join('\n')}

---
*This action was performed automatically by the SprintFlow CI/CD pipeline.*`;

        await githubRequest(`/issues/${issueNumber}/comments`, 'POST', {
          body: comment,
        });

        return true; // Issue was closed
      }
    }

    return false;
  } catch (error) {
    console.error(`❌ Failed to update issue #${issueNumber}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting issue automation...');

  const commits = getCommits();
  if (commits.length === 0) {
    console.log('ℹ️ No commits to process');
    return;
  }

  console.log(`📝 Processing ${commits.length} commits:`);
  commits.forEach(commit => console.log(`  ${commit}`));

  const issueNumbers = extractIssueNumbers(commits);
  if (issueNumbers.length === 0) {
    console.log('ℹ️ No issue references found in commits');
    return;
  }

  console.log(`🎯 Found issues: ${issueNumbers.join(', ')}`);

  let closedIssues = [];

  for (const issueNumber of issueNumbers) {
    const wasClosed = await updateIssueCheckboxes(issueNumber, commits);
    if (wasClosed) {
      closedIssues.push(issueNumber);
    }
  }

  if (closedIssues.length > 0) {
    console.log(`🎉 Successfully closed issues: ${closedIssues.join(', ')}`);
  } else {
    console.log('ℹ️ No issues were closed');
  }

  console.log('✅ Issue automation completed');
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});
