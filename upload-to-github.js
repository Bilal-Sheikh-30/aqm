const fs = require("fs");
const axios = require("axios");
require('dotenv').config();
// upload-to-github.js
const github_token= process.env.GITHUB_TOKEN;
const repo_owner = process.env.REPO_OWNER;
const repo_name = process.env.REPO_NAME;
const File_path= process.env.FILE_PATH;
const BRANCH = "main";

async function getFileSHA() {
  const url = `https://api.github.com/repos/${repo_owner}/${repo_name}/contents/${File_path}`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `token ${github_token}`,
    },
  });
  return res.data.sha;
}

async function uploadToGitHub(localPath) {
  const content = fs.readFileSync(localPath, { encoding: "base64" });
  const sha = await getFileSHA();

  const url = `https://api.github.com/repos/${repo_owner}/${repo_name}/contents/${File_path}`;
  const res = await axios.put(
    url,
    {
      message: "Update firmware",
      content,
      sha,
      branch: BRANCH,
    },
    {
      headers: {
        Authorization: `token ${github_token}`,
      },
    }
  );

  console.log("✅ Firmware uploaded:", res.data.content.download_url);
}

module.exports = uploadToGitHub;
