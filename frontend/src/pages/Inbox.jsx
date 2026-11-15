import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import EmailList from "../components/EmailList";
import EmailView from "../components/EmailView";
import AIPanel from "../components/AIPanel";
import ComposeModal from "../components/ComposeModal";
import CommandPalette from "../components/CommandPalette";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Inbox() {
  const { user, logout } = useAuth();
  const [label, setLabel] = useState("INBOX");
  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [compose, setCompose] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api(`/mail/messages/?label=${label}&q=${encodeURIComponent(query)}`);
      setEmails(data.messages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [label, query]);

  // Debounce search typing; label switches load immediately.
  useEffect(() => {
    const t = setTimeout(load, query ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, query]);

  // Fetch the full body when an email is selected.
  useEffect(() => {
    setDetail(null);
    if (!selected) return;
    api(`/mail/messages/${selected.id}/`).then(setDetail).catch(console.error);
  }, [selected]);

  const patchLabels = (m, add = [], remove = []) =>
    api(`/mail/messages/${m.id}/modify/`, { method: "POST", body: { add, remove } });

  const removeFromList = (id) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
    setSelected((s) => (s?.id === id ? null : s));
  };

  const select = (m) => {
    if (!m) return;
    setSelected(m);
    if (m.unread) {
      patchLabels(m, [], ["UNREAD"]);
      setEmails((prev) => prev.map((e) => (e.id === m.id ? { ...e, unread: false } : e)));
    }
  };

  const archive = (m) => {
    patchLabels(m, [], ["INBOX"]);
    removeFromList(m.id);
  };

  const trash = (m) => {
    patchLabels(m, ["TRASH"], ["INBOX"]);
    removeFromList(m.id);
  };

  const toggleStar = async (m) => {
    await patchLabels(m, m.starred ? [] : ["STARRED"], m.starred ? ["STARRED"] : []);
    const starred = !m.starred;
    setEmails((prev) => prev.map((e) => (e.id === m.id ? { ...e, starred } : e)));
    setSelected((s) => (s?.id === m.id ? { ...s, starred } : s));
  };

  const openReply = (body = "") =>
    selected &&
    setCompose({
      to: selected.from,
      subject: /^re:/i.test(selected.subject) ? selected.subject : `Re: ${selected.subject}`,
      threadId: selected.thread_id,
      body,
    });

  // Keyboard shortcuts: Gmail-style keys plus Cmd/Ctrl+K for the palette.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName) || compose || paletteOpen) return;

      const i = emails.findIndex((m) => m.id === selected?.id);
      if (e.key === "j") select(emails[Math.min(i + 1, emails.length - 1)]);
      if (e.key === "k") select(emails[Math.max(i - 1, 0)]);
      if (e.key === "c") setCompose({});
      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("search")?.focus();
      }
      if (selected && e.key === "e") archive(selected);
      if (selected && e.key === "s") toggleStar(selected);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emails, selected, compose, paletteOpen]);

  const actions = [
    { label: "Compose new email", hint: "C", run: () => setCompose({}) },
    { label: "Go to Inbox", run: () => setLabel("INBOX") },
    { label: "Go to Starred", run: () => setLabel("STARRED") },
    { label: "Go to Sent", run: () => setLabel("SENT") },
    { label: "Archive selected", hint: "E", run: () => selected && archive(selected) },
    { label: "Sign out", run: logout },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        label={label}
        onLabel={(l) => { setLabel(l); setSelected(null); }}
        onCompose={() => setCompose({})}
        user={user}
        onLogout={logout}
      />
      <EmailList
        emails={emails}
        loading={loading}
        selectedId={selected?.id}
        onSelect={select}
        query={query}
        onQuery={setQuery}
        onStar={toggleStar}
        onArchive={archive}
      />
      <main className="flex min-w-0 flex-1">
        <EmailView
          email={selected}
          detail={detail}
          onReply={() => openReply()}
          onArchive={archive}
          onStar={toggleStar}
          onTrash={trash}
        />
        <AnimatePresence>
          {selected && (
            <AIPanel key={selected.id} email={selected} detail={detail} onUseDraft={openReply} />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {compose && (
          <ComposeModal key="compose" initial={compose} onClose={() => setCompose(null)} onSent={load} />
        )}
        {paletteOpen && (
          <CommandPalette key="palette" actions={actions} onClose={() => setPaletteOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}