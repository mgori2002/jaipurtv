import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSiteContent, GalleryItem } from "@/context/SiteContentContext";
import { useToast } from "@/hooks/use-toast";

type EditableGalleryItem = GalleryItem;

const createEmptyItem = (): EditableGalleryItem => ({
  id: "",
  type: "image",
  title: "",
  description: "",
  imageUrl: "",
  category: "",
  featured: false,
});

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unsupported file result"));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

const normalizeGalleryItem = (item: EditableGalleryItem, index: number): GalleryItem | null => {
  const title = item.title.trim();
  const description = item.description.trim();
  const imageUrl = item.imageUrl.trim();
  const videoUrl = item.videoUrl?.trim();
  const sourceUrl = item.sourceUrl?.trim();
  if (!imageUrl) {
    return null;
  }

  const derivedId = slugify(item.id) || slugify(title) || `gallery-item-${index + 1}`;

  return {
    id: derivedId,
    type: item.type,
    title: title || `Untitled Media ${index + 1}`,
    description,
    imageUrl,
    videoUrl: videoUrl || undefined,
    sourceUrl: sourceUrl || undefined,
    likes: item.likes?.trim() || undefined,
    comments: item.comments?.trim() || undefined,
    category: item.category.trim() || "General",
    featured: Boolean(item.featured),
    publishedAt: item.publishedAt?.trim() || undefined,
  };
};

const AdminGallery = () => {
  const { content, updateSection, resetSection, ready } = useSiteContent();
  const [items, setItems] = useState<EditableGalleryItem[]>(content.gallery);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setItems(content.gallery);
  }, [content.gallery]);

  const featuredCount = useMemo(() => items.filter((item) => item.featured).length, [items]);

  const librarySummary = useMemo(() => {
    if (items.length === 0) {
      return "No media yet. Add your first image or video.";
    }

    const itemLabel = items.length === 1 ? "item" : "items";
    const featuredLabel = featuredCount === 1 ? "featured item" : "featured items";
    return `${items.length} ${itemLabel} · ${featuredCount} ${featuredLabel}`;
  }, [featuredCount, items.length]);

  const handleFieldChange = <K extends keyof EditableGalleryItem>(index: number, key: K, value: EditableGalleryItem[K]) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)));
  };

  const handleToggleFeatured = (index: number, value: boolean) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, featured: value } : item)));
  };

  const handleImageUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    void fileToDataUrl(file)
      .then((dataUrl) => {
        setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, imageUrl: dataUrl } : item)));
      })
      .catch((error) => {
        console.error("Failed to process image upload", error);
      })
      .finally(() => {
        event.target.value = "";
      });
  };

  const handleVideoUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    void fileToDataUrl(file)
      .then((dataUrl) => {
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === index
              ? {
                  ...item,
                  type: "video",
                  videoUrl: dataUrl,
                }
              : item,
          ),
        );
      })
      .catch((error) => {
        console.error("Failed to process video upload", error);
      })
      .finally(() => {
        event.target.value = "";
      });
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        ...createEmptyItem(),
        id: "",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const normalized: GalleryItem[] = [];

    items.forEach((item, index) => {
      const result = normalizeGalleryItem(item, index);
      if (result) {
        normalized.push(result);
      }
    });

    try {
      await updateSection("gallery", normalized);
      setItems(normalized);
      toast({ title: "Gallery updated", description: "Media library saved to Firebase." });
    } catch (error) {
      console.error("Failed to save gallery", error);
      toast({
        title: "Save failed",
        description: "Could not save gallery items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      await resetSection("gallery");
      toast({ title: "Gallery reset", description: "Gallery reverted to defaults." });
    } catch (error) {
      console.error("Failed to reset gallery", error);
      toast({
        title: "Reset failed",
        description: "Could not reset gallery. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading gallery items…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h2 className="text-3xl font-display font-semibold">Gallery Manager</h2>
        <p className="text-muted-foreground max-w-3xl">
          Curate the media grid that appears on the public gallery page. Add cover art, optional video links, and
          metadata like categories or engagement.
        </p>
      </header>

      <section className="rounded-3xl border border-border bg-background p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div>
            <h3 className="text-xl font-semibold">Media Library</h3>
            <p className="text-sm text-muted-foreground">{librarySummary}</p>
          </div>
          <Button type="button" onClick={handleAddItem}>
            Add Media Item
          </Button>
        </div>

        <div className="space-y-6">
          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
              Upload cover images or link out to YouTube/Instagram videos. Edits sync through Firebase instantly.
            </div>
          )}

          {items.map((item, index) => (
            <div key={`gallery-item-${index}`} className="rounded-3xl border border-border bg-background p-6 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div>
                  <h4 className="font-semibold">
                    {item.title || `Untitled Media ${index + 1}`}
                  </h4>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.type === "video" ? "Video" : "Image"}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Title</span>
                  <Input
                    value={item.title}
                    onChange={(event) => handleFieldChange(index, "title", event.target.value)}
                    placeholder="Sunrise at Amer Fort"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Media Type</span>
                  <Select value={item.type} onValueChange={(value) => handleFieldChange(index, "type", value as GalleryItem["type"])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label className="flex flex-col gap-2 lg:col-span-2">
                  <span className="text-sm font-medium">Description</span>
                  <Textarea
                    value={item.description}
                    onChange={(event) => handleFieldChange(index, "description", event.target.value)}
                    placeholder="Story, credits, or context for this media"
                    className="min-h-[110px]"
                  />
                </label>

                <label className="flex flex-col gap-2 lg:col-span-2">
                  <span className="text-sm font-medium">Cover Image URL</span>
                  <Input
                    value={item.imageUrl}
                    onChange={(event) => handleFieldChange(index, "imageUrl", event.target.value)}
                    placeholder="https://"
                  />
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(index, event)}
                      className="text-sm"
                    />
                    {item.imageUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleFieldChange(index, "imageUrl", "")}
                      >
                        Clear image
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Uploading converts the file to a data URL for preview. Consider moving large assets to Firebase Storage or another CDN.
                  </p>
                </label>

                {item.type === "video" && (
                  <label className="flex flex-col gap-2 lg:col-span-2">
                    <span className="text-sm font-medium">Video URL</span>
                    <Input
                      value={item.videoUrl ?? ""}
                      onChange={(event) => handleFieldChange(index, "videoUrl", event.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(event) => handleVideoUpload(index, event)}
                        className="text-sm"
                      />
                      {item.videoUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleFieldChange(index, "videoUrl", "")}
                        >
                          Clear video
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Videos are saved as data URLs for previewing only; offload long clips to a streaming platform when possible.
                    </p>
                  </label>
                )}

                <label className="flex flex-col gap-2 lg:col-span-2">
                  <span className="text-sm font-medium">Source / Credit URL (optional)</span>
                  <Input
                    value={item.sourceUrl ?? ""}
                    onChange={(event) => handleFieldChange(index, "sourceUrl", event.target.value)}
                    placeholder="https://instagram.com/p/..."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Category</span>
                  <Input
                    value={item.category}
                    onChange={(event) => handleFieldChange(index, "category", event.target.value)}
                    placeholder="Travel, Food, BTS ..."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Published Date</span>
                  <Input
                    type="date"
                    value={item.publishedAt ?? ""}
                    onChange={(event) => handleFieldChange(index, "publishedAt", event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Likes (optional)</span>
                  <Input
                    value={item.likes ?? ""}
                    onChange={(event) => handleFieldChange(index, "likes", event.target.value)}
                    placeholder="12.4K"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Comments (optional)</span>
                  <Input
                    value={item.comments ?? ""}
                    onChange={(event) => handleFieldChange(index, "comments", event.target.value)}
                    placeholder="312"
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Featured</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3">
                    <Switch
                      checked={Boolean(item.featured)}
                      onCheckedChange={(checked) => handleToggleFeatured(index, checked)}
                    />
                    <span className="text-sm text-muted-foreground">Highlight in the gallery hero section</span>
                  </div>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Custom ID (optional)</span>
                  <Input
                    value={item.id}
                    onChange={(event) => handleFieldChange(index, "id", event.target.value)}
                    placeholder="sunrise-amer-fort"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Gallery"}
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset to defaults
        </Button>
        <p className="text-sm text-muted-foreground">
          Changes save to Firebase. For heavy assets, connect Firebase Storage or another media bucket for durability.
        </p>
      </div>
    </div>
  );
};

export default AdminGallery;
