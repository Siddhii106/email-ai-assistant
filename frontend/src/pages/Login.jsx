import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const { hash, search } = useLocation();
  const navigate = useNavigate();

  // Tokens arrive in the URL fragment after Google sign-in.
  useEffect(() => {
    const params = new URLSearchParams(hash.slice(1));
    const access = params.get("access");
    if (access) login({ access, refresh: params.get("refresh") });
  }, [hash]);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user]);

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass w-full max-w-md rounded-3xl p-10 text-center shadow-2xl"
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500"
        >
          <Sparkles />
        </motion.div>
        <h1 className="text-3xl font-semibold tracking-tight">Mailmind</h1>
        <p className="mt-3 text-slate-400">
          Your inbox, triaged and answered by AI. Summarize, prioritize, and reply without the noise.
        </p>
        <a
          href="http://localhost:8000/api/auth/google/login/"
          className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-white py-3 font-medium text-slate-900 transition hover:scale-[1.02]"
        >
        Continue with Google
        </a>
        {search.includes("error") && (
          <p className="mt-4 text-sm text-rose-400">Sign-in failed. Please try again.</p>
        )}
      </motion.div>
    </div>
  );
}