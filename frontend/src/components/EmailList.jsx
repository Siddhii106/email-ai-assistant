import { AnimatePresence, motion } from "framer-motion";
import { Archive, Search, Star } from "lucide-react";

const displayName = (from) => from.replace(/<.*>/, "").replace(/"/g, "").trim() || from;

export default function EmailList({ emails, loading, selectedId, onSelect, query, onQuery, onStar, onArchive }) {
  return (
    <section className="flex w-96 flex-col border-r border-white/10">
      <div className="p-4">
        <div className="glass flex items-center gap-2 rounded-2xl px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input
            id="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search mail   ( / )"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="m-2 h-20 animate-pulse rounded-2xl bg-white/5" />
          ))}

        <AnimatePresence initial={false}>
          {!loading &&
            emails.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                onClick={() => onSelect(m)}
                className={`group relative cursor-pointer rounded-2xl p-3 transition ${
                  selectedId === m.id ? "bg-white/10 ring-1 ring-violet-500/50" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  {m.unread && <span className="h-2 w-2 rounded-full bg-sky-400" />}
                  <span className={`truncate text-sm ${m.unread ? "font-semibold text-white" : "text-slate-300"}`}>
                    {displayName(m.from)}
                  </span>
                  <span className="ml-auto text-xs text-slate-500">
                    {new Date(m.date).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className={`mt-1 truncate text-sm ${m.unread ? "text-slate-100" : "text-slate-400"}`}>
                  {m.subject || "(no subject)"}
                </div>
                <div className="truncate text-xs text-slate-500">{m.snippet}</div>

                <div className="absolute right-2 bottom-2 hidden gap-1 group-hover:flex">
                  <button
                    onClick={(e) => { e.stopPropagation(); onStar(m); }}
                    className="rounded-lg bg-black/50 p-1.5 hover:text-amber-300"
                  >
                    <Star size={14} className={m.starred ? "fill-amber-300 text-amber-300" : ""} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onArchive(m); }}
                    className="rounded-lg bg-black/50 p-1.5 hover:text-sky-300"
                  >
                    <Archive size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>

        {!loading && emails.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">Nothing here. Inbox zero ✨</p>
        )}
      </div>
    </section>
  );
}