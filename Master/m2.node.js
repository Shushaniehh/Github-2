const { Octokit } =require('@octokit/core'); 
const axios = require('axios');
const { google } = require('googleapis');

// GitHub API token
const githubToken = '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';
const octokit = new Octokit({
  auth: githubToken,
});

// Google Sheets API credentials
const sheetsClient = new google.auth.GoogleAuth({
  keyFile: '/Users/skocharyan/shushans-project-539e9808d7eb.json', // Path to your Google Sheets API credentials JSON file
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheets spreadsheet ID
const spreadsheetId = '18FofgxpsxTTZY0duUYprP5WXpKB3xW86FMWvMe3VfIU';

async function fetchGitHubPullRequestReviews() {
  try {
    // Fetch pull request reviews from GitHub
    const owner = 'ServiceTitan';
    const repo = 'App';
    const pull_number = '250 node /Users/skocharyan/Desktop/githubdata/Master/m2.node.js';

    const response = await octokit.request('GET /repos/servicetitan/app/pulls/250/reviews', {
      owner,
      repo,
      pull_number,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const reviews = response.data;

    // Authenticate with Google Sheets
    const auth = await sheetsClient.getClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Write pull request reviews to Google Sheets
    const values = reviews.map((review) => [review.user.login, review.state, review.body]);
    const resource = {
      values,
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: '"PRs/Commits!A1"', // Change to the appropriate sheet and range
      valueInputOption: 'RAW',
      resource,
    });

    console.log('Pull request reviews added to Google Sheet.');
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchGitHubPullRequestReviews();
