import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, X } from "lucide-react";
import { api } from "../api/client";

export default function ComposeModal({ initial, onClose, onSent }) {
  const [to, setTo] = useState(initial.to || "");
  const [subject, setSubject] = useState(initial.subject || "");
  const [body, setBody] = useState(initial.body || "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    setSending(true);
    setError("");
    try {
      await api("/mail/send/", {
        method: "POST",
        body: { to, subject, body, thread_id: initial.threadId || "" },
      });
      onSent?.();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const fields = [
    ["To", to, setTo],
    ["Subject", subject, setSubject],
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-2xl rounded-3xl p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">{initial.threadId ? "Reply" : "New message"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {fields.map(([label, value, set]) => (
            <input
              key={label}
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={label}
              className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-500"
            />
          ))}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            placeholder="Write something brilliant…"
            className="w-full resize-none rounded-xl bg-white/5 p-3 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-500"
          />
        </div>

        {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button
            onClick={send}
            disabled={sending || !to}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            Send
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}