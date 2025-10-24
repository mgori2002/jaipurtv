const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-semibold">Dashboard Overview</h2>
        <p className="text-muted-foreground max-w-2xl">
          High-level metrics and quick actions will appear here once the backend is connected.
          Use this area to monitor channel performance, publication status, and community stats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {["Videos", "Shorts", "Gallery", "Subscribers"].map((label) => (
          <div key={label} className="rounded-2xl bg-background border border-border p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
            <p className="mt-4 text-4xl font-display font-bold">--</p>
            <p className="mt-2 text-sm text-muted-foreground">Synced from upcoming analytics service.</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <p className="text-muted-foreground">
          Hook this section to your audit log to track who updated videos, gallery tiles, or site settings.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
