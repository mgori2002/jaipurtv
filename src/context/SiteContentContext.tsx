import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

export const defaultContent: SiteContent = {
  hero: {
    headline: "Full Power, No Shaur. Jaipur's Stories On Screen.",
    description:
      "Dive into the creators redefining Rajasthan's voice. From food trails to festival nights, JaipurTV brings the Pink City to the world across YouTube, Instagram, and beyond.",
    primaryCtaLabel: "Watch Latest Videos",
    primaryCtaLink: "https://www.youtube.com/@jaipurtv",
    secondaryCtaLabel: "Join the Community",
    secondaryCtaLink: "https://www.instagram.com/moinjaipurtv/",
    trendingBadge: "Trending Now on JaipurTV",
    stats: [
      { value: "100K+", label: "Subscribers" },
      { value: "500+", label: "Videos Published" },
      { value: "10M+", label: "Lifetime Views" },
    ],
  },
  videos: [
    {
      id: "dQw4w9WgXcQ",
      title: "Jaipur City Tour 2024",
      views: "125K",
      duration: "12:45",
      type: "video",
      category: "Travel",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Street Food of Jaipur",
      views: "98K",
      duration: "15:20",
      type: "video",
      category: "Food",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Jaipur Culture & Heritage",
      views: "156K",
      duration: "18:30",
      type: "video",
      category: "Culture",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ],
  shorts: [
    {
      id: "dQw4w9WgXcQ",
      title: "Hawa Mahal in 60 seconds",
      views: "203K",
      duration: "0:58",
      type: "short",
      category: "Travel",
      url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Jaipur Street Food Quick Bite",
      views: "142K",
      duration: "0:45",
      type: "short",
      category: "Food",
      url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Traditional Dance Performance",
      views: "178K",
      duration: "0:52",
      type: "short",
      category: "Culture",
      url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    },
  ],
  reels: [
    {
      id: "1",
      url: "https://www.instagram.com/p/example1/",
      thumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      caption: "Exploring the Pink City 🌸 #JaipurTV",
      likes: "15K",
      comments: "234",
      username: "moinjaipurtv",
      category: "Travel",
    },
    {
      id: "2",
      url: "https://www.instagram.com/p/example2/",
      thumbnail: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800",
      caption: "Best street food in Jaipur 🍛",
      likes: "12K",
      comments: "189",
      username: "sameer4ukhan",
      category: "Food",
    },
    {
      id: "3",
      url: "https://www.instagram.com/p/example3/",
      thumbnail: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      caption: "Traditional Rajasthani culture 🎭",
      likes: "18K",
      comments: "312",
      username: "moinjaipurtv",
      category: "Culture",
    },
  ],
  gallery: [
    {
      id: "g-1",
      type: "image",
      title: "Sunrise at Amer Fort",
      description: "Morning glow over Amer Fort captured during a shoot.",
      imageUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200",
      sourceUrl: "https://instagram.com/p/example1",
      likes: "12.4K",
      comments: "312",
      category: "Travel",
      featured: true,
      publishedAt: "2024-01-18",
    },
    {
      id: "g-2",
      type: "image",
      title: "Rajasthani Cuisine",
      description: "Behind the scenes tasting session with Jaipur's best chefs.",
      imageUrl: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200",
      sourceUrl: "https://instagram.com/p/example2",
      likes: "18.1K",
      comments: "842",
      category: "Food",
      featured: false,
      publishedAt: "2024-01-10",
    },
    {
      id: "g-3",
      type: "video",
      title: "Behind the Lens: City Night Shoot",
      description: "A quick cut of our nighttime shoot across the Pink City skyline.",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      likes: "22K",
      comments: "1.1K",
      category: "Behind the Scenes",
      featured: true,
      publishedAt: "2024-02-02",
    },
  ],
  posts: [
    {
      id: "p-1",
      title: "Behind JaipurTV: Filming the Pink City",
      slug: "behind-jaipurtv-filming-the-pink-city",
      excerpt: "How we storyboard, shoot, and edit every episode to capture Jaipur's spirit.",
      content: "# Behind JaipurTV\nWe plan each episode with local stories in mind...",
      status: "published",
      publishedAt: "2024-01-05",
      tags: ["jaipur", "production", "storytelling"],
    },
    {
      id: "p-2",
      title: "Top 5 Hidden Gems to Visit",
      slug: "top-5-hidden-gems",
      excerpt: "Our must-see spots beyond the usual tourist circuit.",
      content: "Discover quiet courtyards, artisan workshops, and late-night eateries...",
      status: "draft",
      tags: ["travel", "guide"],
    },
  ],
  users: [
    {
      id: "u-1",
      name: "Sameer Khan",
      email: "sameer@jaipurtv.com",
      role: "Owner",
      status: "active",
      lastLogin: "2025-10-15T09:00:00+05:30",
    },
    {
      id: "u-2",
      name: "Moin Khan",
      email: "moin@jaipurtv.com",
      role: "Owner",
      status: "active",
      lastLogin: "2025-10-18T14:30:00+05:30",
    },
    {
      id: "u-3",
      name: "Aditi Sharma",
      email: "aditi@jaipurtv.com",
      role: "Editor",
      status: "invited",
    },
  ],
  contact: {
    heroTitle: "Get in Touch",
    heroHighlight: "We'd love to hear from you!",
    heroDescription: "Drop us a line or follow us on social media.",
    emailLabel: "Email",
    emailAddress: "hello@jaipurtv.com",
    locationLabel: "Location",
    locationLine1: "Jaipur, Rajasthan",
    locationLine2: "India",
    businessLabel: "Business",
    businessNote: "For collaborations and business inquiries, please email us.",
    phoneLabel: "Phone",
    phoneNumber: "+91 1234567890",
    followLabel: "Follow us",
    followNote: "Stay updated on our latest content and behind-the-scenes stories.",
  },
  settings: {
    theme: {
      primaryColor: "#f973ab",
      accentColor: "#facc15",
      backgroundStyle: "gradient",
    },
    branding: {
      logoPath: "/jaipurtv-logo.png",
      faviconPath: "/favicon.png",
    },
    socials: {
      youtube: "https://www.youtube.com/@jaipurtv",
      instagramOne: "https://www.instagram.com/moinjaipurtv/",
      instagramTwo: "https://www.instagram.com/sameer4ukhan/",
      shortsPlaylistId: "UUSHuiKWS36eKqAoW2sxVxtScA",
      uploadsPlaylistId: "UUuiKWS36eKqAoW2sxVxtScA",
    },
    newsletter: {
      provider: "Mailchimp",
      signupLink: "https://mailchi.mp/jaipurtv/signup",
    },
  },
  integrations: {
    youtubeApiKey: "",
    youtubeChannelId: "UC-example",
    instagramAccessToken: "",
    emailProviderApiKey: "",
    lastSyncedAt: "2025-10-01T10:00:00+05:30",
  },
};

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

const prepareContentForWrite = (content: SiteContent): Record<string, unknown> =>
  JSON.parse(JSON.stringify(content)) as Record<string, unknown>;

const mergeWithDefaults = (partial?: Partial<SiteContent>): SiteContent => {
  if (!partial) return defaultContent;
  return {
    ...defaultContent,
    ...partial,
    hero: {
      ...defaultContent.hero,
      ...partial.hero,
      stats: partial.hero?.stats ?? defaultContent.hero.stats,
    },
    videos: partial.videos ?? defaultContent.videos,
    shorts: partial.shorts ?? defaultContent.shorts,
    reels: partial.reels ?? defaultContent.reels,
    gallery: partial.gallery ?? defaultContent.gallery,
    posts: partial.posts ?? defaultContent.posts,
    users: partial.users ?? defaultContent.users,
    contact: { ...defaultContent.contact, ...partial.contact },
    settings: mergeSettings(defaultContent.settings, partial.settings),
    integrations: { ...defaultContent.integrations, ...partial.integrations },
  };
};

const contentDocRef = doc(db, "site", "content");

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = onSnapshot(
      contentDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setContent(mergeWithDefaults(snapshot.data() as Partial<SiteContent>));
          setReady(true);
        } else {
          const payload = {
            ...prepareContentForWrite(defaultContent),
            _updatedAt: serverTimestamp(),
          } as Record<string, unknown>;
          void setDoc(contentDocRef, payload).catch((error) => {
            console.error("Failed to seed site content", error);
            setReady(true);
          });
        }
      },
      (error) => {
        console.error("Failed to load site content", error);
        setContent(defaultContent);
        setReady(true);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const persistContent = async (next: SiteContent) => {
    try {
      await setDoc(
        contentDocRef,
        {
          ...prepareContentForWrite(next),
          _updatedAt: serverTimestamp(),
        } as Record<string, unknown>,
        { merge: true },
      );
    } catch (error) {
      console.error("Failed to persist site content", error);
      throw error;
    }
  };

  const updateSection: UpdateSectionFn = async (key, value) => {
    let next: SiteContent | null = null;
    setContent((prev) => {
      next = {
        ...prev,
        [key]: value,
      };
      return next;
    });
    if (next) {
      await persistContent(next);
    }
  };

  const resetSection: ResetSectionFn = async (key) => {
    let next: SiteContent | null = null;
    setContent((prev) => {
      next = {
        ...prev,
        [key]: defaultContent[key],
      };
      return next;
    });
    if (next) {
      await persistContent(next);
    }
  };

  const updateHero = async (data: Partial<HeroContent>) => {
    let next: SiteContent | null = null;
    setContent((prev) => {
      next = {
        ...prev,
        hero: {
          ...prev.hero,
          ...data,
          stats: data.stats ?? prev.hero.stats,
        },
      };
      return next;
    });
    if (next) {
      await persistContent(next);
    }
  };

  const resetHero = () => resetSection("hero");

  const resetAll = async () => {
    setContent(defaultContent);
    const payload = {
      ...prepareContentForWrite(defaultContent),
      _updatedAt: serverTimestamp(),
    } as Record<string, unknown>;
    try {
      await setDoc(contentDocRef, payload);
    } catch (error) {
      console.error("Failed to reset site content", error);
      throw error;
    }
  };

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
    [content, ready],
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
