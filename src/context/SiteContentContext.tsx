import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { Octokit } from "@octokit/rest";
import siteContentData from "@/config/site-content.json";
import { useAuth } from "./AuthContext";

export type HeroStats = {
  label: string;
  value: string;
};

export type HeroContent = {
  headline: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  trendingBadge: string;
  stats: HeroStats[];
};

export type VideoEntry = {
  id: string;
  title: string;
  category: string;
  type: "video" | "short";
  views?: string;
  duration?: string;
  thumbnail?: string;
  url?: string;
};

export type ReelEntry = {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  likes?: string;
  comments?: string;
  username?: string;
  category?: string;
};

export type GalleryItem = {
  id: string;
  type: "image" | "video";
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  sourceUrl?: string;
  likes?: string;
  comments?: string;
  category: string;
  featured?: boolean;
  publishedAt?: string;
};

export type PostEntry = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  publishedAt?: string;
  tags?: string[];
};

export type AdminUserEntry = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Editor" | "Contributor";
  status: "active" | "invited" | "suspended";
  lastLogin?: string;
};

export type ContactContent = {
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  emailLabel: string;
  emailAddress: string;
  locationLabel: string;
  locationLine1: string;
  locationLine2: string;
  businessLabel: string;
  businessNote: string;
  phoneLabel: string;
  phoneNumber: string;
  followLabel: string;
  followNote: string;
};

export type SettingsContent = {
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundStyle: string;
  };
  branding: {
    logoPath: string;
    faviconPath: string;
  };
  socials: {
    youtube: string;
    instagramOne: string;
    instagramTwo: string;
    shortsPlaylistId?: string;
    uploadsPlaylistId?: string;
  };
  newsletter: {
    provider: string;
    signupLink: string;
  };
};

export type IntegrationSettings = {
  youtubeApiKey: string;
  youtubeChannelId: string;
  instagramAccessToken: string;
  emailProviderApiKey: string;
  lastSyncedAt?: string;
};

export type SiteContent = {
  hero: HeroContent;
  videos: VideoEntry[];
  shorts: VideoEntry[];
  reels: ReelEntry[];
  gallery: GalleryItem[];
  posts: PostEntry[];
  users: AdminUserEntry[];
  contact: ContactContent;
  settings: SettingsContent;
  integrations: IntegrationSettings;
};

type UpdateSectionFn = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => Promise<void>;
type ResetSectionFn = <K extends keyof SiteContent>(key: K) => Promise<void>;

type SiteContentContextValue = {
  content: SiteContent;
  ready: boolean;
  updateSection: UpdateSectionFn;
  resetSection: ResetSectionFn;
  resetAll: () => Promise<void>;
  updateHero: (data: Partial<HeroContent>) => Promise<void>;
  resetHero: () => Promise<void>;
};

const buildDefaultContent = (): SiteContent =>
  JSON.parse(JSON.stringify(siteContentData)) as SiteContent;

export const defaultContent: SiteContent = buildDefaultContent();

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined);

const mergeSettings = (base: SettingsContent, override?: Partial<SettingsContent>): SettingsContent => {
  if (!override) return base;
  return {
    theme: { ...base.theme, ...override.theme },
    branding: { ...base.branding, ...override.branding },
    socials: { ...base.socials, ...override.socials },
    newsletter: { ...base.newsletter, ...override.newsletter },
  };
};

const mergeWithDefaults = (partial?: Partial<SiteContent>): SiteContent => {
  const base = buildDefaultContent();
  if (!partial) return base;
  return {
    ...base,
    ...partial,
    hero: {
      ...base.hero,
      ...partial.hero,
      stats: partial.hero?.stats ?? base.hero.stats,
    },
    videos: partial.videos ?? base.videos,
    shorts: partial.shorts ?? base.shorts,
    reels: partial.reels ?? base.reels,
    gallery: partial.gallery ?? base.gallery,
    posts: partial.posts ?? base.posts,
    users: partial.users ?? base.users,
    contact: { ...base.contact, ...partial.contact },
    settings: mergeSettings(base.settings, partial.settings),
    integrations: { ...base.integrations, ...partial.integrations },
  };
};

const resolveContentEndpoint = () => {
  const configured = (import.meta.env.VITE_CONTENT_API_BASE ?? "").trim();
  if (!configured) {
    // Fallback to GitHub raw URL if available
    const repo = import.meta.env.VITE_GITHUB_REPO;
    const branch = import.meta.env.VITE_GITHUB_BRANCH || "main";
    const path = import.meta.env.CONTENT_FILE_PATH || "content/site-content.json";
    if (repo) {
      const [owner, repoName] = repo.split("/");
      return `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${path}`;
    }
    return null; // Fallback to bundled content
  }

  const normalized = configured.replace(/\/$/, "");
  if (normalized.endsWith("/.netlify/functions/content")) {
    return normalized;
  }

  if (normalized.endsWith("/api/content")) {
    return normalized;
  }

  return `${normalized}/api/content`;
};

const CONTENT_ENDPOINT = resolveContentEndpoint();

const toBase64 = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

const cloneContent = (value: SiteContent): SiteContent => JSON.parse(JSON.stringify(value)) as SiteContent;

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const { authHeader, user } = useAuth();
  const [content, setContent] = useState<SiteContent>(cloneContent(defaultContent));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const endpoint = CONTENT_ENDPOINT;
      if (!endpoint) {
        // No endpoint configured, use bundled content
        if (active) {
          setContent(cloneContent(defaultContent));
          setReady(true);
        }
        return;
      }

      try {
        const response = await fetch(endpoint, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const contentText = await response.text();
        const parsed = JSON.parse(contentText);

        if (!active) return;

        setContent(mergeWithDefaults(parsed));
      } catch (error) {
        console.warn("Falling back to bundled site content", error);
        if (active) {
          setContent(cloneContent(defaultContent));
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const persistContent = useCallback(
    async (next: SiteContent, options?: { message?: string }) => {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      const repo = import.meta.env.VITE_GITHUB_REPO;
      const branch = import.meta.env.VITE_GITHUB_BRANCH || "main";
      const path = import.meta.env.CONTENT_FILE_PATH || "content/site-content.json";

      if (!token || !repo) {
        throw new Error("GitHub credentials not configured");
      }

      if (!authHeader) {
        throw new Error("auth-required");
      }

      const [owner, repoName] = repo.split("/");

      const octokit = new Octokit({ auth: token });

      try {
        const serialized = JSON.stringify(next, null, 2);
        const encodedContent = toBase64(serialized);
        const commitMessage = options?.message || "chore(content): update site content";

        let sha: string | undefined;

        try {
          const existing = await octokit.repos.getContent({
            owner,
            repo: repoName,
            path,
            ref: branch,
          });

          if (!Array.isArray(existing.data) && "sha" in existing.data) {
            sha = existing.data.sha;
          }
        } catch (readError: any) {
          if (readError?.status !== 404) {
            throw readError;
          }
        }

        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo: repoName,
          path,
          branch,
          message: commitMessage,
          content: encodedContent,
          sha,
          committer: {
            name: "JaipurTV Bot",
            email: "bot@jaipurtv.in",
          },
          author: {
            name: user?.name || user?.email || "Admin",
            email: user?.email || "admin@jaipurtv.in",
          },
        });
      } catch (error) {
        if (error instanceof Error && error.message === "Failed to fetch") {
          throw new Error("github-api-unavailable");
        }
        throw error;
      }
    },
    [authHeader, user?.email, user?.name],
  );

  const updateSection: UpdateSectionFn = useCallback(
    async (key, value) => {
      let previous: SiteContent | null = null;
      let next: SiteContent | null = null;

      setContent((current) => {
        previous = current;
        next = {
          ...current,
          [key]: value,
        };
        return next;
      });

      if (!next || !previous) {
        throw new Error("content-update-failed");
      }

      try {
        await persistContent(next, { message: `chore(content): update ${String(key)}` });
      } catch (error) {
        setContent(previous);
        throw error;
      }
    },
    [persistContent],
  );

  const resetSection: ResetSectionFn = useCallback(
    async (key) => {
      const defaults = buildDefaultContent();
      await updateSection(key, defaults[key]);
    },
    [updateSection],
  );

  const updateHero = useCallback(
    async (data: Partial<HeroContent>) => {
      let previous: SiteContent | null = null;
      let next: SiteContent | null = null;

      setContent((current) => {
        previous = current;
        next = {
          ...current,
          hero: {
            ...current.hero,
            ...data,
            stats: data.stats ?? current.hero.stats,
          },
        };
        return next;
      });

      if (!next || !previous) {
        throw new Error("content-update-failed");
      }

      try {
        await persistContent(next, { message: "chore(content): update hero" });
      } catch (error) {
        setContent(previous);
        throw error;
      }
    },
    [persistContent],
  );

  const resetHero = useCallback(() => resetSection("hero"), [resetSection]);

  const resetAll = useCallback(async () => {
    const snapshot = buildDefaultContent();
    const previous = content;
    setContent(snapshot);

    try {
      await persistContent(snapshot, { message: "chore(content): reset all sections" });
    } catch (error) {
      setContent(previous);
      throw error;
    }
  }, [content, persistContent]);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      content,
      ready,
      updateSection,
      resetSection,
      resetAll,
      updateHero,
      resetHero,
    }),
    [content, ready, resetAll, resetHero, resetSection, updateHero, updateSection],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used within a SiteContentProvider");
  }
  return context;
};
