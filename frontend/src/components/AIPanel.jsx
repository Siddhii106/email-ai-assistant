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
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      className="scrollbar-thin flex w-96 flex-col gap-5 overflow-y-auto border-l border-line bg-white p-6"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-olive-100 text-olive-700">
          <Sparkles size={17} />
        </span>
        <span className="font-semibold text-olive-900">AI Copilot</span>
      </div>

      <button onClick={analyze} disabled={!!busy || !detail} className="btn-outline w-full">
        {busy === "analyze" ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
        Analyze email
      </button>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card space-y-3 bg-cream p-4 text-sm">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-olive-100 px-2.5 py-1 font-medium capitalize text-olive-800">
              {analysis.priority} priority
            </span>
            <span className="rounded-full bg-clay-50 px-2.5 py-1 font-medium capitalize text-clay-700">
              {analysis.category}
            </span>
            {analysis.needs_reply && (
              <span className="rounded-full bg-clay-500 px-2.5 py-1 font-medium text-white">Reply needed</span>
            )}
          </div>
          <p className="leading-relaxed text-ink-muted">{analysis.summary}</p>
          {analysis.action_items?.length > 0 && (
            <ul className="space-y-2">
              {analysis.action_items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-2 text-ink"
                >
                  <ListChecks size={15} className="mt-0.5 shrink-0 text-olive-600" />
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
            <button key={t} onClick={() => setTone(t)} className={`chip ${tone === t ? "chip-active" : "chip-idle"}`}>
              {t}
            </button>
          ))}
        </div>
        <input
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder='Instructions, e.g. "decline politely, suggest Friday"'
          className="input"
        />
        <button onClick={draftReply} disabled={!!busy || !detail} className="btn-primary w-full">
          {busy === "draft" ? <Loader2 className="animate-spin" size={16} /> : <PenLine size={16} />}
          Draft reply
        </button>
      </div>

      {draft && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={8}
            className="input resize-y leading-relaxed"
          />
          <button onClick={() => onUseDraft(draft)} className="btn-secondary w-full">
            Open in composer →
          </button>
        </motion.div>
      )}

      {error && <p className="text-xs text-clay-700">{error}</p>}
    </motion.aside>
  );
}