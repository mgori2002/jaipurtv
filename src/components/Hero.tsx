import { Button } from "@/components/ui/button";
import { Play, TrendingUp } from "lucide-react";
import heroImage from "@/assets/jaipur-hero.jpg";
import { useSiteContent } from "@/context/SiteContentContext";

const Hero = () => {
  const {
    content: {
      hero: {
        headline,
        description,
        primaryCtaLabel,
        primaryCtaLink,
        secondaryCtaLabel,
        secondaryCtaLink,
        trendingBadge,
        stats,
      },
    },
  } = useSiteContent();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Jaipur - The Pink City" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
      </div>

      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/10 via-background/0 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="flex flex-col items-center text-center space-y-8 sm:space-y-10 animate-fade-in">
          <div className="logo-orbit h-32 w-32 md:h-48 md:w-48">
            <div className="logo-spin slow">
              <img src="/jaipurtv-logo.png" alt="JaipurTV" className="logo-face front" loading="lazy" />
              <img src="/jaipurtv-logo.png" alt="JaipurTV" className="logo-face back" loading="lazy" aria-hidden="true" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 sm:gap-3 bg-primary/10 text-primary px-4 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base">
            <TrendingUp size={18} />
            {trendingBadge}
          </div>

          <div className="space-y-5 sm:space-y-6 max-w-3xl px-2 sm:px-0">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight text-foreground">
              {headline}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
            <Button
              size="lg"
              className="gradient-primary text-white shadow-glow w-full sm:w-auto"
              asChild={Boolean(primaryCtaLink)}
            >
              {primaryCtaLink ? (
                <a href={primaryCtaLink} target="_blank" rel="noreferrer">
                  <Play size={20} className="mr-2" /> {primaryCtaLabel}
                </a>
              ) : (
                <span className="inline-flex items-center">
                  <Play size={20} className="mr-2" /> {primaryCtaLabel}
                </span>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-primary/10 w-full sm:w-auto"
              asChild={Boolean(secondaryCtaLink)}
            >
              {secondaryCtaLink ? (
                <a href={secondaryCtaLink} target="_blank" rel="noreferrer">
                  {secondaryCtaLabel}
                </a>
              ) : (
                <span>{secondaryCtaLabel}</span>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl w-full px-2 sm:px-0">
            {stats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="rounded-3xl bg-white/80 backdrop-blur-md border border-border p-5 sm:p-6 shadow-elegant"
              >
                <p className="text-3xl sm:text-4xl font-display font-bold text-primary">{stat.value}</p>
                <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
