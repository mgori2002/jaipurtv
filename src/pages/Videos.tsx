import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Filter, Youtube, Instagram as InstagramIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { InstagramEmbed } from "@/components/InstagramEmbed";
import { useSiteContent } from "@/context/SiteContentContext";

const extractPlaylistId = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/^[A-Za-z0-9_-]{12,}$/.test(trimmed) && !trimmed.includes("http")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const listParam = url.searchParams.get("list");
    if (listParam) {
      return listParam;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const candidate = segments[segments.length - 1];
    if (candidate && /^[A-Za-z0-9_-]{12,}$/.test(candidate)) {
      return candidate;
    }
  } catch (error) {
    // Ignore parsing errors and fall back to undefined below.
  }

  return undefined;
};

const Videos = () => {
  const { content } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("youtube");

  const categories = useMemo(() => {
    const pool = [
      ...content.videos.map((item) => item.category),
      ...content.shorts.map((item) => item.category),
      ...content.reels.map((item) => item.category ?? ""),
    ]
      .filter((category): category is string => Boolean(category));
    const unique = Array.from(new Set(pool));
    return ["All", ...unique];
  }, [content.videos, content.shorts, content.reels]);

  const filterByCategory = <T extends { category?: string }>(items: T[]) =>
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const filteredYouTubeVideos = filterByCategory(content.videos).filter((video) => video.type !== "short");
  const filteredYouTubeShorts = filterByCategory(content.shorts);
  const filteredInstagramReels = filterByCategory(content.reels);
  const shortsPlaylistId = extractPlaylistId(content.settings.socials.shortsPlaylistId);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold">
              Our <span className="text-primary">Videos</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Watch our latest YouTube videos, shorts, and Instagram reels
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <a 
                href="https://www.youtube.com/@jaipurtv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                <Youtube size={20} />
                <span>@jaipurtv</span>
              </a>
              <a 
                href="https://www.instagram.com/moinjaipurtv/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                <InstagramIcon size={20} />
                <span>@moinjaipurtv</span>
              </a>
              <a 
                href="https://www.instagram.com/sameer4ukhan/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                <InstagramIcon size={20} />
                <span>@sameer4ukhan</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Filter size={20} className="text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "gradient-primary text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Grid with Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="youtube" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <Youtube size={16} />
                Videos
              </TabsTrigger>
              <TabsTrigger value="shorts" className="flex items-center gap-2">
                <Youtube size={16} />
                Shorts
              </TabsTrigger>
              <TabsTrigger value="instagram" className="flex items-center gap-2">
                <InstagramIcon size={16} />
                Reels
              </TabsTrigger>
            </TabsList>

            <TabsContent value="youtube" className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Featured Videos</h2>
                <p className="text-muted-foreground">Deep dives, documentaries, and long-form stories</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredYouTubeVideos.map((video, index) => (
                  <YouTubeEmbed key={video.id} video={video} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shorts" className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">YouTube Shorts</h2>
                <p className="text-muted-foreground">Quick bites from Jaipur</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredYouTubeShorts.map((video, index) => (
                  <YouTubeEmbed key={video.id} video={video} index={index} />
                ))}
              </div>
              {shortsPlaylistId ? (
                <div className="rounded-3xl border border-border bg-background shadow-sm overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/videoseries?list=${shortsPlaylistId}`}
                    title="JaipurTV Shorts Playlist"
                    className="w-full aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                  Add your Shorts playlist ID in the admin settings to embed the full playlist automatically.
                </div>
              )}
            </TabsContent>

            <TabsContent value="instagram" className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Instagram Reels</h2>
                <p className="text-muted-foreground">From @moinjaipurtv & @sameer4ukhan</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredInstagramReels.map((reel: any, index: number) => (
                  <InstagramEmbed key={reel.id} post={reel} index={index} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Videos;
