const AdminIntegrations = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-display font-semibold">Integrations</h2>
        <p className="text-muted-foreground max-w-2xl">
          Manage connections to YouTube, Instagram, email marketing platforms, and analytics providers. Store API keys
          securely and monitor sync status.
        </p>
      </header>

      <div className="rounded-3xl border border-border bg-background p-8 shadow-sm space-y-4">
        <p className="text-muted-foreground">
          TODO: Build forms for entering OAuth credentials or API tokens, show last sync timestamps, and provide manual
          refresh actions.
        </p>
      </div>
    </div>
  );
};

export default AdminIntegrations;
