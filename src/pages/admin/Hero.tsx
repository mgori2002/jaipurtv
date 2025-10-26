import { FormEvent, useEffect, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useToast } from "@/hooks/use-toast";

type HeroFormState = {
  headline: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  trendingBadge: string;
  stats: { value: string; label: string }[];
};

const AdminHero = () => {
  const {
    content: { hero },
    updateHero,
    resetHero,
    ready,
  } = useSiteContent();
  const { toast } = useToast();

  const [formState, setFormState] = useState<HeroFormState>(hero);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormState(hero);
  }, [hero]);

  const handleChange = (field: keyof HeroFormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatChange = (index: number, key: "label" | "value", value: string) => {
    setFormState((prev) => {
      const nextStats = prev.stats.map((stat, idx) =>
        idx === index
          ? {
              ...stat,
              [key]: value,
            }
          : stat,
      );
      return {
        ...prev,
        stats: nextStats,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateHero({ ...formState });
      toast({ title: "Hero updated", description: "Homepage hero content saved." });
    } catch (error) {
      console.error("Failed to update hero", error);
      toast({
        title: "Save failed",
        description: "Could not update hero section. Try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      await resetHero();
      toast({ title: "Hero reset", description: "Reverted to default hero content." });
    } catch (error) {
      console.error("Failed to reset hero", error);
      toast({
        title: "Reset failed",
        description: "Could not reset hero section. Try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading hero settings…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h2 className="text-3xl font-display font-semibold">Hero Section</h2>
        <p className="text-muted-foreground max-w-2xl">
          Update the homepage hero copy and call-to-actions instantly. Changes sync to Firebase, so your live site stays
          up-to-date without redeploying.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-3xl border border-border bg-background p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Hero Copy</h3>
            <p className="text-muted-foreground text-sm">These fields map to `src/components/Hero.tsx`.</p>
          </div>

          <div className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Headline</span>
              <input
                value={formState.headline}
                onChange={(event) => handleChange("headline", event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Description</span>
              <textarea
                value={formState.description}
                onChange={(event) => handleChange("description", event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                required
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-background p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Call-to-Action Buttons</h3>
            <p className="text-muted-foreground text-sm">Configure labels and links for primary/secondary CTAs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Primary CTA Label</span>
              <input
                value={formState.primaryCtaLabel}
                onChange={(event) => handleChange("primaryCtaLabel", event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Primary CTA Link</span>
              <input
                value={formState.primaryCtaLink}
                onChange={(event) => handleChange("primaryCtaLink", event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Secondary CTA Label</span>
              <input
                value={formState.secondaryCtaLabel}
                onChange={(event) => handleChange("secondaryCtaLabel", event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Secondary CTA Link</span>
              <input
                value={formState.secondaryCtaLink}
                onChange={(event) => handleChange("secondaryCtaLink", event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-background p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Badge & Stats</h3>
            <p className="text-muted-foreground text-sm">Fine-tune the trending badge and hero statistics.</p>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Trending Badge Text</span>
            <input
              value={formState.trendingBadge}
              onChange={(event) => handleChange("trendingBadge", event.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formState.stats.map((stat, index) => (
              <div key={index} className="rounded-2xl border border-border bg-muted/40 p-4 space-y-3">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Value</span>
                  <input
                    value={stat.value}
                    onChange={(event) => handleStatChange(index, "value", event.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Label</span>
                  <input
                    value={stat.label}
                    onChange={(event) => handleStatChange(index, "label", event.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="rounded-xl bg-primary text-primary-foreground px-6 py-3 font-medium shadow-elegant"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-border px-6 py-3 font-medium hover:bg-muted/60 transition-smooth"
          >
            Reset to defaults
          </button>
          <p className="text-sm text-muted-foreground">
            Tip: changes save to your Firebase project. Consider enabling versioned backups for peace of mind.
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminHero;
