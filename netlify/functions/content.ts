import type { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { Octokit } from "@octokit/rest";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

type AdminUserRecord = {
  email: string;
  passwordHash: string;
};

type ContentPayload = {
  content?: unknown;
  message?: string;
  email?: string;
};

type EnvConfig = {
  githubToken: string;
  repo: string;
  branch: string;
  contentPath: string;
  commitAuthorName: string;
  commitAuthorEmail: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

const adminUsersPath = path.resolve(process.cwd(), "src", "config", "admin-users.json");
let adminUsersCache: AdminUserRecord[] | null = null;

const readAdminUsers = (): AdminUserRecord[] => {
  if (!adminUsersCache) {
    const raw = fs.readFileSync(adminUsersPath, "utf-8");
    adminUsersCache = JSON.parse(raw) as AdminUserRecord[];
  }
  return adminUsersCache;
};

const ensureAuthorized = (authorization?: string): boolean => {
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

const toJsonResponse = (statusCode: number, body: Record<string, unknown>): HandlerResponse => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    ...corsHeaders,
  },
  body: JSON.stringify(body),
});

const getEnvConfig = (): EnvConfig => {
  const githubToken = process.env.VITE_GITHUB_TOKEN;
  const repo = process.env.VITE_GITHUB_REPO;
  const branch = process.env.VITE_GITHUB_BRANCH || "main";
  const contentPath = process.env.CONTENT_FILE_PATH || "content/site-content.json";
  const commitAuthorName = process.env.GIT_COMMIT_AUTHOR_NAME || "JaipurTV Bot";
  const commitAuthorEmail = process.env.GIT_COMMIT_AUTHOR_EMAIL || "bot@jaipurtv.in";

  if (!githubToken || !repo) {
    throw new Error("Missing required environment variables: VITE_GITHUB_TOKEN or VITE_GITHUB_REPO");
  }

  return {
    githubToken,
    repo,
    branch,
    contentPath,
    commitAuthorName,
    commitAuthorEmail,
  };
};

const getOctokit = (token: string) =>
  new Octokit({
    auth: token,
  });

const respondToOptions = (): HandlerResponse => ({
  statusCode: 204,
  headers: corsHeaders,
  body: "",
});

const parseBody = (event: HandlerEvent): ContentPayload | null => {
  if (!event.body) return null;

  const bodyString = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;

  try {
    return JSON.parse(bodyString) as ContentPayload;
  } catch (error) {
    console.warn("Failed to parse function payload", error);
    return null;
  }
};

const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  if (event.httpMethod === "OPTIONS") {
    return respondToOptions();
  }

  let config: EnvConfig;

  try {
    config = getEnvConfig();
  } catch (error) {
    console.error(error);
    return toJsonResponse(500, {
      error: "content-api-misconfigured",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }

  const [owner, repoName] = config.repo.split("/");

  if (!owner || !repoName) {
    return toJsonResponse(500, {
      error: "invalid-repo-format",
      details: `Expected VITE_GITHUB_REPO in the form "owner/repo", received "${config.repo}"`,
    });
  }

  const octokit = getOctokit(config.githubToken);

  if (event.httpMethod === "GET") {
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: config.contentPath,
        ref: config.branch,
      });

      if (Array.isArray(data) || !("content" in data)) {
        return toJsonResponse(500, { error: "unexpected-github-response" });
      }

      const decoded = JSON.parse(decodeFileContent(data.content));
      return toJsonResponse(200, { content: decoded, sha: data.sha });
    } catch (error: unknown) {
      console.error("Failed to read content from GitHub", error);
      return toJsonResponse(500, {
        error: "failed-to-read-content",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  if (event.httpMethod === "POST") {
    if (!ensureAuthorized(event.headers.authorization)) {
      return toJsonResponse(401, { error: "unauthorized" });
    }

    const payload = parseBody(event);

    if (!payload?.content) {
      return toJsonResponse(400, { error: "missing-content" });
    }

    try {
      const serialized = JSON.stringify(payload.content, null, 2);
      const encodedContent = Buffer.from(serialized).toString("base64");
      const commitMessage = payload.message || "chore(content): update site content";

      let sha: string | undefined;

      try {
        const existing = await octokit.repos.getContent({
          owner,
          repo: repoName,
          path: config.contentPath,
          ref: config.branch,
        });

        if (!Array.isArray(existing.data) && "sha" in existing.data) {
          sha = existing.data.sha;
        }
      } catch (readError: any) {
        if (readError?.status !== 404) {
          throw readError;
        }
      }

      const { data } = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: config.contentPath,
        branch: config.branch,
        message: commitMessage,
        content: encodedContent,
        sha,
        committer: {
          name: config.commitAuthorName,
          email: config.commitAuthorEmail,
        },
        author: {
          name: payload.email ?? config.commitAuthorName,
          email: payload.email ?? config.commitAuthorEmail,
        },
      });

      return toJsonResponse(200, {
        status: "committed",
        path: config.contentPath,
        commitUrl: data.commit.html_url,
        sha: data.content?.sha,
      });
    } catch (error: unknown) {
      console.error("Failed to commit content", error);
      return toJsonResponse(500, {
        error: "failed-to-commit-content",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return toJsonResponse(405, { error: "method-not-allowed" });
};

export { handler };
