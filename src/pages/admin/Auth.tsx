import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminAuth = () => {
  const navigate = useNavigate();
  const { user, loading, signIn } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "validating">("idle");

  useEffect(() => {
    if (!loading && user) {
      navigate("/admin", { replace: true });
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    try {
      await signIn(trimmedUsername, trimmedPassword);
      toast({ title: "Signed in", description: "Welcome back to JaipurTV Admin." });
      navigate("/admin", { replace: true });
    } catch (error: any) {
      console.error("Failed to sign in", error);
      const errorMessage = error?.message === "invalid-credentials"
        ? "Incorrect email or password."
        : "Could not sign in. Please try again.";
      setMessage(errorMessage);
      toast({
        title: "Sign-in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setStatus("idle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 text-muted-foreground">
        Checking session…
      </div>
    );
  }

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
                placeholder="you@example.com"
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
                placeholder="Enter your password"
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
            Authentication is powered by static admin credentials stored securely with the project.
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
