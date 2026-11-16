import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const { hash, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(hash.slice(1));
    const access = params.get("access");
    if (access) login({ access, refresh: params.get("refresh") });
  }, [hash]);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user]);

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-olive-900 via-olive-800 to-olive-700 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl bg-cream p-10 text-center shadow-2xl"
      >
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-clay-500 text-white shadow-lg">
          <Sparkles />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-olive-900">Mailmind</h1>
        <p className="mt-3 leading-relaxed text-ink-muted">
          Your inbox, triaged and answered by AI. Summarize, prioritize, and reply without the noise.
        </p>
        <a
          href={`${import.meta.env.VITE_API_URL}/api/auth/google/login/`}
          className="btn-primary mt-8 w-full py-3.5 text-[15px]"
        >
          Continue with Google
        </a>
        {search.includes("error") && (
          <p className="mt-4 text-sm text-clay-700">Sign-in failed. Please try again.</p>
        )}
      </motion.div>
    </div>
  );
}