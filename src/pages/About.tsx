import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Users, Award } from "lucide-react";
import creatorsImage from "@/assets/creators.jpg";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To showcase Jaipur's rich culture and vibrant lifestyle to the world through authentic storytelling"
    },
    {
      icon: Heart,
      title: "Our Passion",
      description: "Creating content that celebrates our city's heritage, food, and the warmth of its people"
    },
    {
      icon: Users,
      title: "Our Community",
      description: "Building a connected audience that shares our love for Jaipur's unique character"
    },
    {
      icon: Award,
      title: "Our Promise",
      description: "Delivering high-quality, engaging content that brings you closer to the Pink City"
    }
  ];

  const milestones = [
    { year: "2020", event: "JaipurTV Founded", description: "Started our journey with a simple camera and big dreams" },
    { year: "2021", event: "50K Subscribers", description: "Our community grew as we explored hidden gems of Jaipur" },
    { year: "2022", event: "100+ Videos", description: "Documented countless stories from across the Pink City" },
    { year: "2023", event: "100K Subscribers", description: "Reached a major milestone in our content creation journey" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold">
              About <span className="text-primary">JaipurTV</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              The story of two brothers sharing Jaipur's heartbeat with the world
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Our <span className="text-primary">Story</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Born and raised in the Pink City, we've always been fascinated by Jaipur's rich tapestry of 
                culture, tradition, and modernity. As Sameer Khan and Moin Khan, we decided to turn our 
                passion into purpose by creating JaipurTV.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                What started as casual vlogs about our city has grown into a platform that showcases 
                everything from street food adventures to cultural festivals, historical monuments to 
                contemporary lifestyle. We believe every corner of Jaipur has a story to tell, and we're 
                here to share them all.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Through our content on YouTube, Instagram, and TikTok, we've built a community of Jaipur 
                enthusiasts from around the globe. Our mission is simple: to be the authentic voice of 
                Jaipur's heartbeat.
              </p>
            </div>
            <div className="relative animate-slide-up">
              <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl" />
              <img 
                src={creatorsImage}
                alt="Sameer Khan & Moin Khan" 
                className="relative rounded-2xl shadow-elegant w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              What Drives <span className="text-primary">Us</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our core values guide everything we create
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index}
                className="border-border hover:shadow-elegant transition-smooth animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <value.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-display font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Our <span className="text-primary">Journey</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Key milestones in our content creation adventure
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-8">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="flex gap-6 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-display font-bold">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1 pb-8 border-l-2 border-border pl-6 -ml-[1px]">
                  <h3 className="text-2xl font-display font-semibold mb-2">{milestone.event}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
