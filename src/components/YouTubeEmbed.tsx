import { Card, CardContent } from "@/components/ui/card";
import { Play, Eye, Clock } from "lucide-react";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail?: string;
  views?: string;
  duration?: string;
  type: "video" | "short";
  url?: string;
}

interface YouTubeEmbedProps {
  video: YouTubeVideo;
  index?: number;
}

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{6,15}$/;

const sanitizeCandidate = (candidate?: string | null): string | undefined => {
  if (!candidate) return undefined;
  const trimmed = candidate.trim();
  if (!trimmed) return undefined;
  if (!YOUTUBE_ID_PATTERN.test(trimmed)) return undefined;
  return trimmed;
};

const RESERVED_SEGMENTS = new Set([
  "watch",
  "shorts",
  "embed",
  "live",
  "playlist",
  "channel",
  "user",
  "videos",
]);

export const extractYouTubeId = (value?: string): string | undefined => {
  if (!value) return undefined;
  const input = value.trim();
  if (!input) return undefined;

  const directId = sanitizeCandidate(input);
  if (directId && !input.includes("/")) {
    return directId;
  }

  const patterns = [
    /(?:v=|vi=|video_id=)([A-Za-z0-9_-]{6,})/i,
    /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.(?:com|nocookie)\/embed\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/live\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/v\/([A-Za-z0-9_-]{6,})/i,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    const candidate = sanitizeCandidate(match?.[1]);
    if (candidate) {
      return candidate;
    }
  }

  try {
    const url = new URL(input.includes("//") ? input : `https://${input}`);
    const paramCandidates = ["v", "vi", "video_id"];
    for (const param of paramCandidates) {
      const candidate = sanitizeCandidate(url.searchParams.get(param));
      if (candidate) {
        return candidate;
      }
    }

    const segments = url.pathname.split("/").filter(Boolean).reverse();
    for (const segment of segments) {
      const lowered = segment.toLowerCase();
      if (RESERVED_SEGMENTS.has(lowered) || lowered.startsWith("@")) {
        continue;
      }
      const candidate = sanitizeCandidate(segment);
      if (candidate) {
        return candidate;
      }
    }
  } catch (error) {
    // Ignore URL parsing errors and fall through to undefined below.
  }

  return undefined;
};

export const YouTubeEmbed = ({ video, index = 0 }: YouTubeEmbedProps) => {
  const videoId = extractYouTubeId(video.id) || extractYouTubeId(video.url);
  const watchUrl = video.url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : watchUrl;
  const thumbnail =
    video.thumbnail ||
    (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "/placeholder.svg");

  return (
    <Card 
      className="group overflow-hidden border-border hover:shadow-elegant transition-smooth cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {videoId ? (
            <iframe
              src={`${embedUrl}?autoplay=0`}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img 
                src={thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
              {watchUrl ? (
                <a 
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth"
                >
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow">
                    <Play size={24} className="text-white ml-1" fill="white" />
                  </div>
                </a>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Play size={24} className="text-muted-foreground ml-1" />
                  </div>
                </div>
              )}
            </>
          )}
          {video.type === "short" && (
            <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded font-medium">
              Shorts
            </div>
          )}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Clock size={12} />
              {video.duration}
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-smooth">
            {video.title}
          </h3>
          {video.views && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Eye size={14} />
              <span>{video.views} views</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
