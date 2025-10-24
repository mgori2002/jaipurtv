const AdminPosts = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-display font-semibold">Announcements & Posts</h2>
        <p className="text-muted-foreground max-w-2xl">
          Publish updates, newsletters, and behind-the-scenes stories. This section will connect to your CMS for rich
          text editing, scheduling, and homepage pinning.
        </p>
      </header>

      <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
        <p className="text-muted-foreground">
          TODO: Integrate a rich text/Markdown editor, version history, and publishing workflow. Store posts in your
          backend and expose them through an API for the public site.
        </p>
      </div>
    </div>
  );
};

export default AdminPosts;
