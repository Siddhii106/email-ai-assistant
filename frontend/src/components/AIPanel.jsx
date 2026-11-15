import { useState } from "react";
import { motion } from "framer-motion";
import { ListChecks, Loader2, PenLine, Sparkles, Wand2 } from "lucide-react";
import { api } from "../api/client";

const TONES = ["Friendly", "Professional", "Concise", "Firm"];

export default function AIPanel({ email, detail, onUseDraft }) {
  const [analysis, setAnalysis] = useState(null);
  const [tone, setTone] = useState("Professional");
  const [instructions, setInstructions] = useState("");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const call = async (key, path, body, onOk) => {
    setBusy(key);
    setError("");
    try {
      onOk(await api(path, { method: "POST", body }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  };

  const analyze = () => call("analyze", "/ai/analyze/", { message_id: email.id }, setAnalysis);
  const draftReply = () =>
    call("draft", "/ai/draft/", { message_id: email.id, tone, instructions }, (d) => setDraft(d.draft));

  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      className="glass scrollbar-thin flex w-96 flex-col gap-5 overflow-y-auto border-y-0 border-r-0 p-5"
    >
      <div className="flex items-center gap-2 font-semibold">
        <Sparkles size={18} className="text-violet-400" /> AI Copilot
      </div>

      <button
        onClick={analyze}
        disabled={!!busy || !detail}
        className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 py-2.5 text-sm transition hover:bg-white/15 disabled:opacity-50"
      >
        {busy === "analyze" ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
        Analyze email
      </button>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 rounded-2xl bg-white/5 p-4 text-sm">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-violet-300">{analysis.priority} priority</span>
            <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-sky-300">{analysis.category}</span>
            {analysis.needs_reply && (
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-rose-300">Reply needed</span>
            )}
          </div>
          <p className="leading-relaxed text-slate-300">{analysis.summary}</p>
          {analysis.action_items?.length > 0 && (
            <ul className="space-y-1.5">
              {analysis.action_items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-2 text-slate-300"
                >
                  <ListChecks size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                  {item}
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {TONES.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                tone === t ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <input
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder='Instructions, e.g. "decline politely, suggest Friday"'
          className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-500"
        />
        <button
          onClick={draftReply}
          disabled={!!busy || !detail}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {busy === "draft" ? <Loader2 className="animate-spin" size={16} /> : <PenLine size={16} />}
          Draft reply
        </button>
      </div>

      {draft && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={8}
            className="w-full rounded-2xl bg-white/5 p-3 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-500"
          />
          <button
            onClick={() => onUseDraft(draft)}
            className="w-full rounded-xl bg-white/10 py-2 text-sm transition hover:bg-white/15"
          >
            Open in composer →
          </button>
        </motion.div>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}
    </motion.aside>
  );
}