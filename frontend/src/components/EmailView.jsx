import { motion } from "framer-motion";
import { Archive, Forward, Reply, Star, Trash2 } from "lucide-react";

function ActionButton({ icon: Icon, label, onClick, danger }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`glass flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition hover:bg-white/10 ${
        danger ? "hover:text-rose-300" : ""
      }`}
    >
      <Icon size={15} />
      {label}
    </motion.button>
  );
}

export default function EmailView({ email, detail, onReply, onArchive, onStar, onTrash }) {
  if (!email) {
    return <div className="grid flex-1 place-items-center text-slate-500">Select an email to read ✨</div>;
  }

  return (
    <motion.article
      key={email.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex min-w-0 flex-1 flex-col"
    >
      <header className="border-b border-white/10 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">{email.subject || "(no subject)"}</h1>
        <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-400">
          <div className="min-w-0 truncate">
            <span className="text-slate-200">{email.from}</span> → {email.to}
          </div>
          <time className="shrink-0">{new Date(email.date).toLocaleString()}</time>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton icon={Reply} label="Reply" onClick={onReply} />
          <ActionButton icon={Forward} label="Forward" onClick={onReply} />
          <ActionButton icon={Star} label={email.starred ? "Starred" : "Star"} onClick={() => onStar(email)} />
          <ActionButton icon={Archive} label="Archive" onClick={() => onArchive(email)} />
          <ActionButton icon={Trash2} label="Delete" danger onClick={() => onTrash(email)} />
        </div>
      </header>

      <div className="scrollbar-thin flex-1 overflow-y-auto p-6">
        <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-slate-200">
          {detail ? detail.body : "Loading message…"}
        </pre>
      </div>
    </motion.article>
  );
}