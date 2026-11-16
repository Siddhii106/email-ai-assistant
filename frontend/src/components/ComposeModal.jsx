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
      className="fixed inset-0 z-40 grid place-items-center bg-olive-900/40 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-olive-900">{initial.threadId ? "Reply" : "New message"}</h2>
          <button onClick={onClose} className="text-ink-subtle transition hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {fields.map(([label, value, set]) => (
            <input
              key={label}
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={label}
              className="input"
            />
          ))}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            placeholder="Write something brilliant…"
            className="input resize-none leading-relaxed"
          />
        </div>

        {error && <p className="mt-3 text-xs text-clay-700">{error}</p>}

        <div className="mt-5 flex justify-end">
          <button onClick={send} disabled={sending || !to} className="btn-primary px-6">
            {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            Send
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}