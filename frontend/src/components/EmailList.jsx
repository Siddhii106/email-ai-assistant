import { AnimatePresence, motion } from "framer-motion";
import { Archive, Search, Star } from "lucide-react";

const displayName = (from) => from.replace(/<.*>/, "").replace(/"/g, "").trim() || from;

export default function EmailList({ emails, loading, selectedId, onSelect, query, onQuery, onStar, onArchive }) {
  return (
    <section className="flex w-96 flex-col border-r border-line bg-cream">
      <div className="p-4">
        <div className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 shadow-sm focus-within:border-olive-500 focus-within:ring-2 focus-within:ring-olive-100">
          <Search size={16} className="text-ink-subtle" />
          <input
            id="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search mail   ( / )"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
          />
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto px-3 pb-4">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-olive-100/60" />
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
                className={`group relative cursor-pointer rounded-2xl border p-3.5 transition ${
                  selectedId === m.id
                    ? "border-olive-300 bg-white shadow-card"
                    : "border-transparent hover:border-line hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  {m.unread && <span className="h-2 w-2 rounded-full bg-clay-500" />}
                  <span className={`truncate text-sm ${m.unread ? "font-semibold text-ink" : "text-ink-muted"}`}>
                    {displayName(m.from)}
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-ink-subtle">
                    {new Date(m.date).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className={`mt-1 truncate text-sm ${m.unread ? "text-ink" : "text-ink-muted"}`}>
                  {m.subject || "(no subject)"}
                </div>
                <div className="truncate text-xs text-ink-subtle">{m.snippet}</div>

                <div className="absolute bottom-3 right-3 hidden gap-1 group-hover:flex">
                  <button
                    onClick={(e) => { e.stopPropagation(); onStar(m); }}
                    className="rounded-full bg-cream p-1.5 text-ink-subtle transition hover:text-clay-600"
                  >
                    <Star size={14} className={m.starred ? "fill-clay-500 text-clay-500" : ""} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onArchive(m); }}
                    className="rounded-full bg-cream p-1.5 text-ink-subtle transition hover:text-olive-700"
                  >
                    <Archive size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>

        {!loading && emails.length === 0 && (
          <p className="p-6 text-center text-sm text-ink-subtle">Nothing here. Inbox zero ✨</p>
        )}
      </div>
    </section>
  );
}