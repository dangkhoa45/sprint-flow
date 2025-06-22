#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');

async function run() {
    try {
        const token = process.env.GITHUB_TOKEN;
        const issueNumber = process.env.ISSUE_NUMBER;
        const owner = process.env.OWNER;
        const repo = process.env.REPO;

        if (!token || !issueNumber || !owner || !repo) {
            console.error('Missing required environment variables.');
            process.exit(1);
        }

        const octokit = new Octokit({ auth: token });

        console.log(`Analyzing issue #${issueNumber} in ${owner}/${repo}`);
      
        const { data: issue } = await octokit.issues.get({
            owner,
            repo,
            issue_number: issueNumber,
        });

        const body = issue.body || '';
        const checkboxPattern = /- \[([ x])\]/g;
        const checkboxes = (body.match(checkboxPattern) || []).map(cb => cb.includes('[x]'));
      
        if (checkboxes.length === 0) {
            console.log('No checkboxes found in the issue body. Nothing to do.');
            return;
        }
      
        const allChecked = checkboxes.every(checked => checked);

        if (allChecked) {
            console.log('All checkboxes are checked. Creating PR...');
            await createPullRequest(octokit, owner, repo, issue);
        } else {
            const uncheckedCount = checkboxes.filter(c => !c).length;
            console.log(`${uncheckedCount} out of ${checkboxes.length} checkboxes are not checked. Skipping PR creation.`);
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

async function createPullRequest(octokit, owner, repo, issue) {
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    const base = repoData.default_branch;
    const branchName = `feat/issue-${issue.number}-${Date.now()}`;

    const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${base}`,
    });
    const sha = refData.object.sha;
    
    await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha,
    });
    console.log(`Branch ${branchName} created from ${base} at ${sha}.`);
    
    // In order to create a pull request, we need to have at least one commit on the new branch
    await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: `changes/issue-${issue.number}.md`,
        message: `feat: Work for issue #${issue.number}`,
        content: Buffer.from(`This commit is for issue #${issue.number}.`).toString('base64'),
        branch: branchName,
    });
    console.log('Dummy commit created.');

    const pr = await octokit.pulls.create({
        owner,
        repo,
        title: `feat: Resolve #${issue.number} - ${issue.title}`,
        head: branchName,
        base,
        body: `Closes #${issue.number}\n\nThis PR was automatically created after all tasks in the issue were completed.`,
    });

    console.log(`Successfully created PR #${pr.data.number}: ${pr.data.html_url}`);
}

run(); 