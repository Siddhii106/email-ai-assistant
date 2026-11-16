import { motion } from "framer-motion";
import { Archive, Forward, Reply, Star, Trash2 } from "lucide-react";

function ActionButton({ icon: Icon, label, onClick, danger }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-muted shadow-sm transition hover:border-olive-300 hover:text-olive-800 ${
        danger ? "hover:border-clay-300 hover:text-clay-700" : ""
      }`}
    >
      <Icon size={15} />
      {label}
    </motion.button>
  );
}

export default function EmailView({ email, detail, onReply, onArchive, onStar, onTrash }) {
  if (!email) {
    return (
      <div className="grid flex-1 place-items-center bg-cream text-ink-subtle">
        Select an email to read ✨
      </div>
    );
  }

  return (
    <motion.article
      key={email.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex min-w-0 flex-1 flex-col bg-cream"
    >
      <header className="border-b border-line bg-white px-8 py-6">
        <h1 className="text-2xl font-semibold tracking-tight text-olive-900">
          {email.subject || "(no subject)"}
        </h1>
        <div className="mt-3 flex items-center justify-between gap-4 text-sm text-ink-muted">
          <div className="min-w-0 truncate">
            <span className="font-medium text-ink">{email.from}</span> → {email.to}
          </div>
          <time className="shrink-0 text-ink-subtle">{new Date(email.date).toLocaleString()}</time>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <ActionButton icon={Reply} label="Reply" onClick={onReply} />
          <ActionButton icon={Forward} label="Forward" onClick={onReply} />
          <ActionButton icon={Star} label={email.starred ? "Starred" : "Star"} onClick={() => onStar(email)} />
          <ActionButton icon={Archive} label="Archive" onClick={() => onArchive(email)} />
          <ActionButton icon={Trash2} label="Delete" danger onClick={() => onTrash(email)} />
        </div>
      </header>

      <div className="scrollbar-thin flex-1 overflow-y-auto p-8">
        <div className="card mx-auto max-w-3xl p-8">
          <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-ink">
            {detail ? detail.body : "Loading message…"}
          </pre>
        </div>
      </div>
    </motion.article>
  );
}