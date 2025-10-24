import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

const adminLinks = [
  { name: "Dashboard", to: "." },
  { name: "Videos", to: "videos" },
  { name: "Gallery", to: "gallery" },
  { name: "Hero", to: "hero" },
  { name: "Posts", to: "posts" },
  { name: "Contact", to: "contact" },
  { name: "Users", to: "users" },
  { name: "Settings", to: "settings" },
  { name: "Integrations", to: "integrations" },
];

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authFlag = window.localStorage.getItem("jaipurtv-admin-auth");
    if (!authFlag) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    window.localStorage.removeItem("jaipurtv-admin-auth");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="bg-background border-b border-border shadow-sm sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md border border-border p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">JaipurTV Admin</p>
              <h1 className="text-xl font-display font-semibold">Control Center</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-xs text-muted-foreground">
              <span className="text-sm font-medium text-foreground">Admin User</span>
              <span>Last login: just now</span>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm shadow-elegant"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed md:static inset-y-0 left-0 w-72 bg-background border-r border-border shadow-lg md:shadow-none transform transition-transform duration-200 ease-in-out z-30 md:translate-x-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } md:block`}
        >
          <div className="px-6 py-5 border-b border-border">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Navigation</p>
          </div>
          <nav className="flex flex-col p-4 space-y-1">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "."}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition-smooth flex items-center justify-between ${
                    isActive ? "bg-primary text-primary-foreground shadow-glow" : "hover:bg-muted/60"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <span>{link.name}</span>
                <span className="text-xs text-muted-foreground/80">Manage</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 md:ml-0 ml-0 md:pl-0 md:pr-0 md:py-0">
          <div className="px-4 sm:px-6 md:px-10 py-6 md:py-10">
            <Outlet />
          </div>
        </main>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
