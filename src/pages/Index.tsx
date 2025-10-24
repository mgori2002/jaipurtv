import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedVideos from "@/components/FeaturedVideos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Instagram, Youtube, Mail } from "lucide-react";
import creatorsImage from "@/assets/creators.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-[20px] md:pt-[60px]">
        <Hero />

        <FeaturedVideos />

        {/* About Creators Section */}
        <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl" />
                <img 
                  src={creatorsImage}
                  alt="Sameer Khan & Moin Khan" 
                  className="relative rounded-2xl shadow-elegant w-full"
                />
              </div>
            </div>
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Meet the <span className="text-primary">Creators</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to JaipurTV! We're Sameer Khan and Moin Khan, two brothers from the beautiful Pink City 
                of Jaipur. Our passion is to showcase the vibrant culture, hidden gems, and authentic stories 
                of our beloved city.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From street food adventures to cultural explorations, we bring you the real essence of Jaipur 
                through our lens. Join our community and experience the heartbeat of Rajasthan!
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="gradient-primary text-white shadow-glow">
                  <Youtube size={20} className="mr-2" />
                  Subscribe on YouTube
                </Button>
                <Button variant="outline">
                  <Instagram size={20} className="mr-2" />
                  Follow on Instagram
                </Button>
              </div>
            </div>
          </div>
        </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto shadow-elegant border-border">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="text-primary" size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold">
                  Stay <span className="text-primary">Updated</span>
                </h3>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Subscribe to our newsletter and never miss a new video or update from JaipurTV
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1"
                  />
                  <Button className="gradient-primary text-white shadow-glow">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Index;
