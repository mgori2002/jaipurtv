import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteContent } from "@/context/SiteContentContext";
import { Heart, MessageCircle, Share2, Instagram, Play } from "lucide-react";
import { useMemo } from "react";

const Gallery = () => {
  const {
    content: { gallery },
  } = useSiteContent();

  const sortedGallery = useMemo(
    () =>
      [...gallery].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.publishedAt && b.publishedAt) {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        return 0;
      }),
    [gallery],
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold">
              Social <span className="text-primary">Gallery</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Our latest moments captured on Instagram and TikTok
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-smooth"
              >
                <Instagram size={24} />
                <span className="font-medium">Follow on Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedGallery.map((item, index) => (
              <Card 
                key={item.id}
                className="group overflow-hidden border-border hover:shadow-elegant transition-smooth cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                        <p className="text-sm mb-3 line-clamp-3">
                          <span className="font-semibold">{item.title}</span>
                          {item.description ? ` · ${item.description}` : ""}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Heart size={16} />
                            <span>{item.likes ?? "--"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={16} />
                            <span>{item.comments ?? "--"}</span>
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            {item.sourceUrl && (
                              <a
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline-offset-4 hover:underline text-xs"
                              >
                                View Source
                              </a>
                            )}
                            <Share2 size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                    {item.type === "video" ? (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-smooth">
                        <Play className="text-white" size={24} />
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-smooth">
                        <Instagram className="text-white" size={24} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fan Content Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Share Your <span className="text-primary">Jaipur Moments</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Tag us with <span className="text-primary font-semibold">#JaipurTV</span> to be featured on our page!
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <span className="px-4 py-2 bg-background border border-border rounded-full text-sm">#JaipurTV</span>
              <span className="px-4 py-2 bg-background border border-border rounded-full text-sm">#PinkCity</span>
              <span className="px-4 py-2 bg-background border border-border rounded-full text-sm">#JaipurDiaries</span>
              <span className="px-4 py-2 bg-background border border-border rounded-full text-sm">#ExplorJaipur</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
