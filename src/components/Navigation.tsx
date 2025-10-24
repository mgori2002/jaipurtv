import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Videos", path: "/videos" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 md:py-4 gap-4">
          {/* Logo */}
          <Link to="/" className="hidden md:flex items-center group w-[130px] md:w-[190px]">
            <div className="logo-orbit h-[110px] w-[110px] md:h-[140px] md:w-[140px] group-hover:scale-105">
              <div className="logo-spin">
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
            <span className="sr-only">JaipurTV</span>
          </Link>

          {/* Desktop Navigation */}
          <Link to="/" className="md:hidden flex items-center group">
            <span className="text-xl font-display font-bold text-primary">JaipurTV</span>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-smooth font-medium ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social Icons & CTA */}
          <div className="hidden md:flex items-center justify-end space-x-4 w-[140px] md:w-[200px]">
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
            <Button size="sm" className="gradient-primary text-white font-medium shadow-glow hover:scale-105 transition-smooth">
              Subscribe
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground hover:text-primary transition-smooth p-2 -mr-2"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`transition-smooth font-medium ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
                <a
                  href="https://www.youtube.com/@jaipurtv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-foreground hover:text-primary transition-smooth"
                >
                  <Youtube size={18} /> YouTube
                </a>
                <a
                  href="https://www.instagram.com/moinjaipurtv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-foreground hover:text-primary transition-smooth"
                >
                  <Instagram size={18} /> Moin
                </a>
                <a
                  href="https://www.instagram.com/sameer4ukhan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-foreground hover:text-primary transition-smooth"
                >
                  <Instagram size={18} /> Sameer
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
