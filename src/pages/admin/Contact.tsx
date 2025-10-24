import { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSiteContent, ContactContent } from "@/context/SiteContentContext";

const AdminContact = () => {
  const { content, updateSection, resetSection } = useSiteContent();
  const [contact, setContact] = useState<ContactContent>(content.contact);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setContact(content.contact);
  }, [content.contact]);

  const handleChange = (field: keyof ContactContent, value: string) => {
    setContact((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    updateSection("contact", contact);
    setTimeout(() => setSaving(false), 400);
  };

  const handleReset = () => {
    resetSection("contact");
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h2 className="text-3xl font-display font-semibold">Contact Page</h2>
        <p className="text-muted-foreground max-w-2xl">
          Update the hero headline, contact details, and follow section shown on the public contact page. Changes are
          saved to local storage so you can iterate without a backend.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border border-border p-6 space-y-5">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Hero Section</h3>
              <p className="text-sm text-muted-foreground">
                Controls the headline and intro copy at the top of the contact page.
              </p>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Hero Title</span>
              <Input value={contact.heroTitle} onChange={(event) => handleChange("heroTitle", event.target.value)} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Hero Highlight</span>
              <Input value={contact.heroHighlight} onChange={(event) => handleChange("heroHighlight", event.target.value)} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Hero Description</span>
              <Textarea
                value={contact.heroDescription}
                rows={4}
                onChange={(event) => handleChange("heroDescription", event.target.value)}
              />
            </label>
          </Card>

          <Card className="rounded-3xl border border-border p-6 space-y-5">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Contact Details</h3>
              <p className="text-sm text-muted-foreground">
                Manage email, location, business inquiry, and phone labels.
              </p>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Email Label</span>
              <Input value={contact.emailLabel} onChange={(event) => handleChange("emailLabel", event.target.value)} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Email Address</span>
              <Input value={contact.emailAddress} onChange={(event) => handleChange("emailAddress", event.target.value)} />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Location Label</span>
                <Input
                  value={contact.locationLabel}
                  onChange={(event) => handleChange("locationLabel", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Location Line 1</span>
                <Input
                  value={contact.locationLine1}
                  onChange={(event) => handleChange("locationLine1", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Location Line 2</span>
                <Input
                  value={contact.locationLine2}
                  onChange={(event) => handleChange("locationLine2", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Business Label</span>
                <Input
                  value={contact.businessLabel}
                  onChange={(event) => handleChange("businessLabel", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-medium">Business Note</span>
                <Textarea
                  value={contact.businessNote}
                  rows={3}
                  onChange={(event) => handleChange("businessNote", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Phone Label</span>
                <Input value={contact.phoneLabel} onChange={(event) => handleChange("phoneLabel", event.target.value)} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Phone Number</span>
                <Input value={contact.phoneNumber} onChange={(event) => handleChange("phoneNumber", event.target.value)} />
              </label>
            </div>
          </Card>
        </section>

        <Card className="rounded-3xl border border-border p-6 space-y-5">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Follow Section</h3>
            <p className="text-sm text-muted-foreground">
              Control the text shown above the social buttons.
            </p>
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Follow Label</span>
            <Input value={contact.followLabel} onChange={(event) => handleChange("followLabel", event.target.value)} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Follow Note</span>
            <Textarea
              value={contact.followNote}
              rows={3}
              onChange={(event) => handleChange("followNote", event.target.value)}
            />
          </label>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving} className="rounded-xl px-6 py-3 shadow-elegant">
            {saving ? "Saving..." : "Save Contact"}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <p className="text-sm text-muted-foreground">
            After saving, refresh the public contact page to see your updates.
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminContact;
