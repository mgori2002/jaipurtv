import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/context/SiteContentContext";

const Contact = () => {
  const {
    content: { contact },
  } = useSiteContent();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  if (res.ok) {
    toast({
      title: "Message Sent!",
      description: "We received your message.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  } else {
    toast({
      title: "Error",
      description: "Failed to send message.",
      variant: "destructive"
    });
  }
};
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold">
              {contact.heroTitle}
              {contact.heroHighlight && (
                <span className="block text-primary">{contact.heroHighlight}</span>
              )}
            </h1>
            <p className="text-xl text-muted-foreground">{contact.heroDescription}</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-border hover:shadow-elegant transition-smooth">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-2">{contact.emailLabel}</h3>
                    <a 
                      href={`mailto:${contact.emailAddress}`}
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {contact.emailAddress}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-elegant transition-smooth">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-2">{contact.locationLabel}</h3>
                    <p className="text-muted-foreground">
                      {contact.locationLine1}
                      <br />
                      {contact.locationLine2}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-elegant transition-smooth">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-2">{contact.phoneLabel}</h3>
                    <p className="text-muted-foreground">{contact.phoneNumber}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-elegant transition-smooth">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-2">{contact.businessLabel}</h3>
                    <p className="text-muted-foreground">
                      {contact.businessNote}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border gradient-primary">
                <CardContent className="p-6 space-y-4 text-white">
                  <h3 className="font-display font-semibold text-lg">{contact.followLabel}</h3>
                  <p className="text-sm text-white/80">{contact.followNote}</p>
                  <div className="flex gap-4">
                    <a 
                      href="https://www.youtube.com/@jaipurtv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-smooth"
                    >
                      <Youtube size={20} />
                    </a>
                    <a 
                      href="https://www.instagram.com/moinjaipurtv/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-smooth"
                    >
                      <Instagram size={20} />
                    </a>
                    <a 
                      href="https://www.instagram.com/sameer4ukhan/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-smooth"
                    >
                      <Instagram size={20} />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-border shadow-elegant">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Sameer Khan"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="sameer@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full gradient-primary text-white shadow-glow"
                      size="lg"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
