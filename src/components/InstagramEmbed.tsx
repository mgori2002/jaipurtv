import { Card, CardContent } from "@/components/ui/card";
import { Play, Heart, MessageCircle, Eye } from "lucide-react";
import { Instagram } from "lucide-react";

interface InstagramPost {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  likes?: string;
  comments?: string;
  username: string;
}

interface InstagramEmbedProps {
  post: InstagramPost;
  index?: number;
}

export const InstagramEmbed = ({ post, index = 0 }: InstagramEmbedProps) => {
  return (
    <Card 
      className="group overflow-hidden border-border hover:shadow-elegant transition-smooth cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={post.thumbnail} 
            alt={post.caption || "Instagram post"}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
          <a 
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center shadow-glow">
              <Instagram size={24} className="text-white" />
            </div>
          </a>
          <div className="absolute top-2 right-2 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Play size={12} fill="white" />
            <span>Reel</span>
          </div>
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            @{post.username}
          </div>
        </div>
        <div className="p-4 space-y-2">
          {post.caption && (
            <p className="text-sm line-clamp-2 group-hover:text-primary transition-smooth">
              {post.caption}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {post.likes && (
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{post.likes}</span>
              </div>
            )}
            {post.comments && (
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{post.comments}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
