import { FormEvent, useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("sameer@jaipurtv.in");
  const [password, setPassword] = useState("Aa@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "validating">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("validating");
    setMessage(null);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setMessage("Enter both user name and password to continue.");
      setStatus("idle");
      return;
    }

    const isValid =
      trimmedUsername === "sameer@jaipurtv.in" && trimmedPassword === "Aa@12345";

    if (isValid) {
      window.localStorage.setItem("jaipurtv-admin-auth", JSON.stringify({ authenticatedAt: Date.now() }));
      setMessage("Authenticated. Lock this route behind a real backend session before launching.");
      navigate("/admin", { replace: true });
    } else {
      setMessage("Incorrect username or password. Try again or update the hard-coded credentials.");
    }

    setStatus("idle");
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-background border border-border shadow-elegant p-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-semibold">JaipurTV Admin</h1>
          <p className="text-muted-foreground">Sign in to access the control center.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Mail size={16} /> Admin Email / Username
            </span>
            <div className="relative">
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                type="text"
                autoComplete="username"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="sameer@jaipurtv.in"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Lock size={16} /> Password
            </span>
            <div className="relative">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Aa@12345"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary transition-smooth"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-medium shadow-elegant flex items-center justify-center gap-2"
            disabled={status === "validating"}
          >
            <ShieldCheck size={18} />
            {status === "validating" ? "Checking..." : "Sign in"}
          </button>
        </form>

        {message && (
          <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            {message}
          </div>
        )}

        <div className="space-y-2 text-xs text-muted-foreground text-center">
          <p>
            Successful sign-in drops a short-lived flag in <code>localStorage</code>. Swap this for server-verified
            sessions when your backend is ready.
          </p>
          <p>
            <Link to="/" className="text-primary underline">
              Back to site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
