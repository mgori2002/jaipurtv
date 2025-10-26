import { FormEvent, useEffect, useState } from "react";
import { useSiteContent, SettingsContent } from "@/context/SiteContentContext";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { content, updateSection, ready } = useSiteContent();
  const [settings, setSettings] = useState<SettingsContent>(content.settings);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSettings(content.settings);
  }, [content.settings]);

  const handleChange = (path: string, value: string) => {
    setSettings((prev) => {
      const clone = structuredClone(prev) as SettingsContent;
      const segments = path.split(".");
      let target: any = clone;
      while (segments.length > 1) {
        const segment = segments.shift()!;
        target = target[segment];
      }
      target[segments[0]] = value;
      return clone;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateSection("settings", settings);
      toast({ title: "Settings updated", description: "Global settings saved to Firebase." });
    } catch (error) {
      console.error("Failed to save settings", error);
      toast({
        title: "Save failed",
        description: "Could not save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h2 className="text-3xl font-display font-semibold">Global Settings</h2>
        <p className="text-muted-foreground max-w-2xl">
          Configure site-wide options and social integrations. Adjust the Shorts playlist ID here so embeds stay in sync across Firebase-backed content.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-3xl border border-border bg-background p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Social Profiles</h3>
            <p className="text-sm text-muted-foreground">Links and identifiers for YouTube and Instagram embeds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">YouTube Channel URL</span>
              <input
                value={settings.socials.youtube}
                onChange={(event) => handleChange("socials.youtube", event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://www.youtube.com/@jaipurtv"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Shorts Playlist ID</span>
              <input
                value={settings.socials.shortsPlaylistId ?? ""}
                onChange={(event) => handleChange("socials.shortsPlaylistId", event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="UUSH..."
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Instagram (Primary)</span>
              <input
                value={settings.socials.instagramOne}
                onChange={(event) => handleChange("socials.instagramOne", event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://www.instagram.com/moinjaipurtv/"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Instagram (Secondary)</span>
              <input
                value={settings.socials.instagramTwo}
                onChange={(event) => handleChange("socials.instagramTwo", event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://www.instagram.com/sameer4ukhan/"
              />
            </label>
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-xl bg-primary text-primary-foreground px-6 py-3 font-medium shadow-elegant"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          <p className="text-sm text-muted-foreground">
            Shorts playlist ID lets the site embed your latest Shorts via playlist embed. Changes sync instantly through Firebase.
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
