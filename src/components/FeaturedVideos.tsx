import { Card, CardContent } from "@/components/ui/card";
import { Play, Eye } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const FeaturedVideos = () => {
  const { content } = useSiteContent();
  const videos = content.videos.filter((video) => video.type !== "short").slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12 animate-fade-in px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3 sm:mb-4">
            Watch Latest <span className="text-primary">Episodes</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Discover the vibrant culture, stories, and lifestyle of Jaipur through our latest videos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
          {videos.map((video, index) => (
            <Card 
              key={`${video.id}-${index}`} 
              className="group overflow-hidden border-border hover:shadow-elegant transition-smooth cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow">
                      <Play size={24} className="text-white ml-1" fill="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-smooth text-base sm:text-lg">
                    {video.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye size={14} />
                    <span>{video.views} views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVideos;
