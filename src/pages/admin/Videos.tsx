import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteContent, VideoEntry, ReelEntry } from "@/context/SiteContentContext";
import { extractYouTubeId } from "@/components/YouTubeEmbed";
import { useToast } from "@/hooks/use-toast";

const emptyVideo = (type: VideoEntry["type"]): VideoEntry => ({
  id: "",
  title: "",
  category: "",
  type,
  views: "",
  duration: "",
  thumbnail: "",
  url: "",
});

type EditableVideoState = {
  videos: VideoEntry[];
  shorts: VideoEntry[];
};

const AdminVideos = () => {
  const { content, updateSection, ready } = useSiteContent();
  const [state, setState] = useState<EditableVideoState>({
    videos: content.videos,
    shorts: content.shorts,
  });
  const [reels, setReels] = useState<ReelEntry[]>(content.reels);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setState({
      videos: content.videos,
      shorts: content.shorts,
    });
  }, [content.videos, content.shorts]);

  useEffect(() => {
    setReels(content.reels);
  }, [content.reels]);

  const onFieldChange = (listKey: keyof EditableVideoState, index: number, field: keyof VideoEntry, value: string) => {
    setState((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item, idx) => (idx === index ? { ...item, [field]: value } : item)),
    }));
  };

  const onAdd = (listKey: keyof EditableVideoState) => {
    setState((prev) => ({
      ...prev,
      [listKey]: [...prev[listKey], emptyVideo(listKey === "videos" ? "video" : "short")],
    }));
  };

  const onRemove = (listKey: keyof EditableVideoState, index: number) => {
    setState((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, idx) => idx !== index),
    }));
  };

  const normalizeEntry = (entry: VideoEntry): VideoEntry | null => {
    const derivedId = extractYouTubeId(entry.id) ?? extractYouTubeId(entry.url);
    if (!derivedId) {
      return null;
    }

    const trimmedTitle = entry.title.trim();
    const safeTitle = trimmedTitle || "Untitled Video";

    const normalizedUrl = entry.url?.trim() || `https://www.youtube.com/watch?v=${derivedId}`;

    return {
      ...entry,
      id: derivedId,
      title: safeTitle,
      category: entry.category?.trim() || "General",
      duration: entry.duration?.trim(),
      views: entry.views?.trim(),
      thumbnail: entry.thumbnail?.trim() || `https://img.youtube.com/vi/${derivedId}/hqdefault.jpg`,
      url: normalizedUrl,
    };
  };

  const isShortLink = (entry: VideoEntry) => {
    const url = entry.url?.toLowerCase() ?? "";
    return (
      entry.type === "short" ||
      url.includes("youtube.com/shorts/") ||
      url.includes("youtu.be/shorts/")
    );
  };

  const dedupeById = (items: VideoEntry[]) => {
    const map = new Map<string, VideoEntry>();
    items.forEach((item) => {
      if (!map.has(item.id) || map.get(item.id)?.type === "short") {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  };

  const normalizeReel = (entry: ReelEntry): ReelEntry | null => {
    const id = entry.id.trim() || entry.url.trim();
    const url = entry.url.trim();
    if (!url) return null;

    return {
      ...entry,
      id,
      url,
      thumbnail: entry.thumbnail.trim(),
      caption: entry.caption.trim(),
      likes: entry.likes?.trim(),
      comments: entry.comments?.trim(),
      username: entry.username?.trim() || "moinjaipurtv",
      category: entry.category?.trim() || "Reels",
    };
  };

  const handleSave = async () => {
    setSaving(true);
    const normalizedVideos: VideoEntry[] = [];
    const normalizedShorts: VideoEntry[] = [];

    state.videos.forEach((entry) => {
      const normalized = normalizeEntry(entry);
      if (!normalized) return;
      if (isShortLink(entry) || isShortLink(normalized)) {
        normalizedShorts.push({ ...normalized, type: "short" });
      } else {
        normalizedVideos.push({ ...normalized, type: "video" });
      }
    });

    state.shorts.forEach((entry) => {
      const normalized = normalizeEntry(entry);
      if (!normalized) return;
      normalizedShorts.push({ ...normalized, type: "short" });
    });

    const finalVideos = dedupeById(normalizedVideos.map((item) => ({ ...item, type: "video" })));
    const finalShorts = dedupeById(normalizedShorts.map((item) => ({ ...item, type: "short" })));
    const finalReels = reels
      .map((entry) => normalizeReel({
        id: entry.id || "",
        url: entry.url || "",
        thumbnail: entry.thumbnail || "",
        caption: entry.caption || "",
        likes: entry.likes,
        comments: entry.comments,
        username: entry.username || "",
        category: entry.category || "",
      }))
      .filter((entry): entry is ReelEntry => Boolean(entry));

    try {
      await Promise.all([
        updateSection("videos", finalVideos),
        updateSection("shorts", finalShorts),
        updateSection("reels", finalReels),
      ]);
      setState({ videos: finalVideos, shorts: finalShorts });
      setReels(finalReels);
      toast({ title: "Video library updated", description: "Videos, Shorts, and Reels saved successfully." });
    } catch (error) {
      console.error("Failed to save video library", error);
      toast({
        title: "Save failed",
        description: "Could not save the video library. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading video library…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h2 className="text-3xl font-display font-semibold">Video Library</h2>
        <p className="text-muted-foreground max-w-3xl">
          Manage long-form videos and shorts. Your changes sync to Firebase so the public site updates instantly.
        </p>
      </header>

      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="shorts">Shorts</TabsTrigger>
          <TabsTrigger value="reels">Reels</TabsTrigger>
        </TabsList>

        {["videos", "shorts"].map((listKey) => (
          <TabsContent key={listKey} value={listKey} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {listKey === "videos" ? "Full-length Videos" : "YouTube Shorts"}
              </h3>
              <Button type="button" onClick={() => onAdd(listKey as keyof EditableVideoState)}>
                Add {listKey === "videos" ? "Video" : "Short"}
              </Button>
            </div>

            <div className="space-y-6">
              {state[listKey as keyof EditableVideoState].length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No {listKey}. Add one to start curating your library.
                </p>
              )}

              {state[listKey as keyof EditableVideoState].map((entry, index) => (
                <div
                  key={`${listKey}-${index}`}
                  className="rounded-3xl border border-border bg-background p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center gap-3 justify-between">
                    <h4 className="font-semibold">{entry.title || `Untitled ${listKey === "videos" ? "Video" : "Short"}`}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => onRemove(listKey as keyof EditableVideoState, index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Title</span>
                      <Input
                        value={entry.title}
                        onChange={(event) => onFieldChange(listKey as keyof EditableVideoState, index, "title", event.target.value)}
                        placeholder="Video title"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium">YouTube Video ID</span>
                      <Input
                        value={entry.id}
                        onChange={(event) => onFieldChange(listKey as keyof EditableVideoState, index, "id", event.target.value)}
                        placeholder="dQw4w9WgXcQ"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Category</span>
                      <Input
                        value={entry.category}
                        onChange={(event) => onFieldChange(listKey as keyof EditableVideoState, index, "category", event.target.value)}
                        placeholder="Travel, Food, Culture ..."
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Duration</span>
                      <Input
                        value={entry.duration ?? ""}
                        onChange={(event) => onFieldChange(listKey as keyof EditableVideoState, index, "duration", event.target.value)}
                        placeholder={listKey === "videos" ? "12:45" : "0:58"}
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Views</span>
                      <Input
                        value={entry.views ?? ""}
                        onChange={(event) => onFieldChange(listKey as keyof EditableVideoState, index, "views", event.target.value)}
                        placeholder="125K"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Thumbnail URL (optional)</span>
                      <Input
                        value={entry.thumbnail ?? ""}
                        onChange={(event) => onFieldChange(listKey as keyof EditableVideoState, index, "thumbnail", event.target.value)}
                        placeholder="https://"
                      />
                    </label>
                    <label className="flex flex-col gap-2 md:col-span-2">
                      <span className="text-sm font-medium">Direct Video URL (optional)</span>
                      <Input
                        value={entry.url ?? ""}
                        onChange={(event) => onFieldChange(listKey as keyof EditableVideoState, index, "url", event.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="reels" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Instagram Reels</h3>
            <Button type="button" onClick={() => setReels((prev) => [...prev, {
              id: "",
              url: "",
              thumbnail: "",
              caption: "",
              likes: "",
              comments: "",
              username: "",
              category: "Reels",
            }])}>
              Add Reel
            </Button>
          </div>

          <div className="space-y-6">
            {reels.length === 0 && (
              <p className="text-sm text-muted-foreground">No reels yet. Add one to feature Instagram videos.</p>
            )}

            {reels.map((reel, index) => (
              <div
                key={`reel-${index}`}
                className="rounded-3xl border border-border bg-background p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <h4 className="font-semibold">{reel.caption || `Untitled Reel ${index + 1}`}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => setReels((prev) => prev.filter((_, idx) => idx !== index))}
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Instagram Reel URL</span>
                    <Input
                      value={reel.url}
                      onChange={(event) => setReels((prev) => prev.map((item, idx) =>
                        idx === index ? { ...item, url: event.target.value } : item
                      ))}
                      placeholder="https://www.instagram.com/reel/..."
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Thumbnail URL</span>
                    <Input
                      value={reel.thumbnail ?? ""}
                      onChange={(event) => setReels((prev) => prev.map((item, idx) =>
                        idx === index ? { ...item, thumbnail: event.target.value } : item
                      ))}
                      placeholder="https://..."
                    />
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-sm font-medium">Caption</span>
                    <Input
                      value={reel.caption ?? ""}
                      onChange={(event) => setReels((prev) => prev.map((item, idx) =>
                        idx === index ? { ...item, caption: event.target.value } : item
                      ))}
                      placeholder="Short description"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Likes</span>
                    <Input
                      value={reel.likes ?? ""}
                      onChange={(event) => setReels((prev) => prev.map((item, idx) =>
                        idx === index ? { ...item, likes: event.target.value } : item
                      ))}
                      placeholder="15K"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Comments</span>
                    <Input
                      value={reel.comments ?? ""}
                      onChange={(event) => setReels((prev) => prev.map((item, idx) =>
                        idx === index ? { ...item, comments: event.target.value } : item
                      ))}
                      placeholder="234"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Username</span>
                    <Input
                      value={reel.username ?? ""}
                      onChange={(event) => setReels((prev) => prev.map((item, idx) =>
                        idx === index ? { ...item, username: event.target.value } : item
                      ))}
                      placeholder="moinjaipurtv"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Category</span>
                    <Input
                      value={reel.category ?? ""}
                      onChange={(event) => setReels((prev) => prev.map((item, idx) =>
                        idx === index ? { ...item, category: event.target.value } : item
                      ))}
                      placeholder="Travel, Food, Culture ..."
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-4">
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Library"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Entries sync through your Firebase project; connect YouTube APIs later for automated updates.
        </p>
      </div>
    </div>
  );
};

export default AdminVideos;
