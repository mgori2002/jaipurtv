import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.API_PORT || 8787;
const githubToken = process.env.VITE_GITHUB_TOKEN;
const repo = process.env.VITE_GITHUB_REPO;
const branch = process.env.VITE_GITHUB_BRANCH || "main";
const contentPath = process.env.CONTENT_FILE_PATH || "content/site-content.json";
const commitAuthorName = process.env.GIT_COMMIT_AUTHOR_NAME || "JaipurTV Bot";
const commitAuthorEmail = process.env.GIT_COMMIT_AUTHOR_EMAIL || "bot@jaipurtv.in";

if (!githubToken || !repo) {
  console.error("Missing required environment variables: VITE_GITHUB_TOKEN or VITE_GITHUB_REPO");
  process.exit(1);
}

const [owner, repoName] = repo.split("/");

if (!owner || !repoName) {
  console.error(`Invalid repo format: ${repo}. Expected format 'owner/repo'`);
  process.exit(1);
}

const octokit = new Octokit({
  auth: githubToken,
});

type AdminUserRecord = {
  email: string;
  passwordHash: string;
};

const readAdminUsers = (): AdminUserRecord[] => {
  const filePath = path.resolve(process.cwd(), "src", "config", "admin-users.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as AdminUserRecord[];
};

const ensureAuthorized = (authorization?: string) => {
  if (!authorization?.startsWith("Basic ")) {
    return false;
  }
  const token = authorization.replace("Basic ", "").trim();
  const decoded = Buffer.from(token, "base64").toString("utf-8");
  const [email, password] = decoded.split(":");
  if (!email || !password) {
    return false;
  }

  const adminUsers = readAdminUsers();
  const record = adminUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (!record) {
    return false;
  }

  return bcrypt.compareSync(password, record.passwordHash);
};

const decodeFileContent = (encoded: string) => Buffer.from(encoded, "base64").toString("utf-8");

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/content", async (_req, res) => {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo: repoName,
      path: contentPath,
      ref: branch,
    });

    if (!("content" in data)) {
      res.status(500).json({ error: "Unexpected GitHub response for content" });
      return;
    }

    const decoded = JSON.parse(decodeFileContent(data.content));
    res.json({ content: decoded, sha: data.sha });
  } catch (error: any) {
    console.error("Failed to read content from GitHub", error);
    res.status(500).json({
      error: "Failed to read content",
      details: error?.message ?? "Unknown error",
    });
  }
});

app.post("/api/content", async (req, res) => {
  if (!ensureAuthorized(req.headers.authorization)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { content, message, email } = req.body as {
      content: unknown;
      message?: string;
      email?: string;
    };

    if (!content) {
      res.status(400).json({ error: "Missing content payload" });
      return;
    }

    const serialized = JSON.stringify(content, null, 2);
    const encodedContent = Buffer.from(serialized).toString("base64");
    const commitMessage = message || "chore(content): update site content";

    const existing = await octokit.repos.getContent({
      owner,
      repo: repoName,
      path: contentPath,
      ref: branch,
    });

    const sha = Array.isArray(content) ? content[0]?.sha : content?.sha;

    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: contentPath,
      message: commitMessage,
      content: encodedContent,
      sha,
      branch,
      committer: {
        name: commitAuthorName,
        email: commitAuthorEmail,
      },
      author: {
        name: email ?? commitAuthorName,
        email: email ?? commitAuthorEmail,
      },
    });

    res.json({
      status: "committed",
      path: contentPath,
      commitUrl: data.commit.html_url,
      sha: data.content?.sha,
    });
  } catch (error: any) {
    console.error("Failed to commit content", error);
    res.status(500).json({
      error: "Failed to commit content",
      details: error?.message ?? "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`GitHub content API listening on port ${port}`);
});
