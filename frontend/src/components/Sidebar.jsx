import { motion } from "framer-motion";
import { FileText, Inbox, LogOut, PenSquare, Send, Star, Trash2 } from "lucide-react";

const ITEMS = [
  { id: "INBOX", label: "Inbox", icon: Inbox },
  { id: "STARRED", label: "Starred", icon: Star },
  { id: "SENT", label: "Sent", icon: Send },
  { id: "DRAFT", label: "Drafts", icon: FileText },
  { id: "TRASH", label: "Trash", icon: Trash2 },
];

export default function Sidebar({ label, onLabel, onCompose, user, onLogout }) {
  return (
    <aside className="flex w-64 flex-col gap-1.5 border-r border-line bg-white p-5">
      <div className="mb-6 flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-olive-700 text-sm font-semibold text-white">
          M
        </span>
        <div>
          <div className="text-[15px] font-semibold text-olive-900">Mailmind</div>
          <div className="text-xs text-ink-subtle">Email assistant</div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCompose}
        className="btn-primary mb-4 w-full justify-start"
      >
        <PenSquare size={18} /> Compose
        <kbd className="ml-auto rounded bg-white/20 px-1.5 text-xs">C</kbd>
      </motion.button>

      {ITEMS.map(({ id, label: text, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onLabel(id)}
          className={`relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-medium transition ${
            label === id ? "text-white" : "text-ink-muted hover:bg-olive-50 hover:text-olive-800"
          }`}
        >
          {label === id && (
            <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-2xl bg-olive-700 shadow-md shadow-olive-900/20" />
          )}
          <Icon size={18} className="relative" />
          <span className="relative">{text}</span>
        </button>
      ))}

      <div className="mt-auto flex items-center gap-3 rounded-2xl border border-line bg-cream p-3">
        {user.picture ? (
          <img src={user.picture} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full" />
        ) : (
          <div className="h-9 w-9 rounded-full bg-olive-100" />
        )}
        <div className="min-w-0 flex-1 truncate text-sm text-ink-muted">{user.email}</div>
        <button onClick={onLogout} className="text-ink-subtle transition hover:text-clay-600" title="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}