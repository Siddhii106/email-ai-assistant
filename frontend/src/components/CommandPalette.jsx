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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-32 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search size={16} className="text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={onKey}
            placeholder="Type a command…"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {list.map((a, i) => (
            <li
              key={a.label}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(a)}
              className={`flex cursor-pointer justify-between rounded-xl px-3 py-2 text-sm ${
                i === active ? "bg-white/10" : ""
              }`}
            >
              <span>{a.label}</span>
              {a.hint && <kbd className="text-xs text-slate-500">{a.hint}</kbd>}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}