import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function CommandPalette({ actions, onClose }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const list = useMemo(
    () => actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase())),
    [q, actions]
  );

  const run = (action) => {
    action.run();
    onClose();
  };

  const onKey = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, list.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && list[active]) run(list[active]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-olive-900/40 pt-32 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <Search size={16} className="text-ink-subtle" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={onKey}
            placeholder="Type a command…"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
          />
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {list.map((a, i) => (
            <li
              key={a.label}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(a)}
              className={`flex cursor-pointer justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                i === active ? "bg-olive-50 text-olive-900" : "text-ink-muted"
              }`}
            >
              <span>{a.label}</span>
              {a.hint && <kbd className="text-xs text-ink-subtle">{a.hint}</kbd>}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}