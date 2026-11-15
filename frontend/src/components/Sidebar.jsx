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
    <aside className="glass flex w-60 flex-col gap-2 border-y-0 border-l-0 p-4">
      <div className="mb-4 flex items-center gap-2 px-2 text-lg font-semibold">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-sky-500 text-xs">M</span>
        Mailmind
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCompose}
        className="mb-4 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-3 font-medium shadow-lg shadow-violet-900/40"
      >
        <PenSquare size={18} /> Compose
        <kbd className="ml-auto rounded bg-black/30 px-1.5 text-xs">C</kbd>
      </motion.button>

      {ITEMS.map(({ id, label: text, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onLabel(id)}
          className={`relative flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
            label === id ? "text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {label === id && (
            <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-white/10" />
          )}
          <Icon size={18} className="relative" />
          <span className="relative">{text}</span>
        </button>
      ))}

      <div className="mt-auto flex items-center gap-3 rounded-xl p-2">
        {user.picture ? (
          <img src={user.picture} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full" />
        ) : (
          <div className="h-9 w-9 rounded-full bg-white/10" />
        )}
        <div className="min-w-0 flex-1 truncate text-sm text-slate-300">{user.email}</div>
        <button onClick={onLogout} className="text-slate-400 hover:text-white" title="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}