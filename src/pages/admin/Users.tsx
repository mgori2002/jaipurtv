const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-display font-semibold">User Management</h2>
        <p className="text-muted-foreground max-w-2xl">
          Configure admin accounts, roles, and access levels. Connect this module to your authentication provider to
          invite collaborators and track activity logs.
        </p>
      </header>

      <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
        <p className="text-muted-foreground">
          TODO: Display user table with roles, last login, and status. Include actions for inviting users, resetting
          passwords, and revoking access.
        </p>
      </div>
    </div>
  );
};

export default AdminUsers;
