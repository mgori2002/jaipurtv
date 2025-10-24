import { Link } from "react-router-dom";
import { Youtube, Instagram, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="logo-orbit mx-auto md:mx-0">
              <div className="logo-spin slow">
                <img
                  src="/jaipurtv-logo.png"
                  alt="JaipurTV logo"
                  className="logo-face front"
                  loading="lazy"
                />
                <img
                  src="/jaipurtv-logo.png"
                  alt="JaipurTV logo"
                  className="logo-face back"
                  loading="lazy"
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              The Heartbeat of Jaipur — Stories, Culture & Vibes
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.youtube.com/@jaipurtv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-smooth"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://www.instagram.com/moinjaipurtv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-smooth"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.instagram.com/sameer4ukhan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-smooth"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div>
            <h4 className="font-display font-semibold mb-4">Content</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Culture</li>
              <li className="text-sm text-muted-foreground">Entertainment</li>
              <li className="text-sm text-muted-foreground">Lifestyle</li>
              <li className="text-sm text-muted-foreground">Travel</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                <span>Jaipur, Rajasthan, India</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail size={16} />
                <a href="mailto:sameer@jaipurtv.in" className="hover:text-primary transition-smooth">
                  sameer@jaipurtv.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JaipurTV. Created by Sameer Khan & Moin Khan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
