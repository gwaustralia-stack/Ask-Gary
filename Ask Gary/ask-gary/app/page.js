"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("ask-gary-v2-messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMessages(parsed);
      } catch {}
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("ask-gary-v2-messages", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, hydrated]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [input]);

  const canSend = useMemo(() => input.trim() && !loading, [input, loading]);
  const showHero = messages.length === 0;

  function resetChat() {
    setMessages([]);
    setInput("");
    localStorage.removeItem("ask-gary-v2-messages");
    textareaRef.current?.focus();
  }

  async function sendMessage(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { id: uid(), role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content }))
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setMessages((current) => [
        ...current,
        { id: uid(), role: "assistant", content: data.text }
      ]);
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          id: uid(),
          role: "assistant",
          content: `I hit an error: ${err.message}`,
          error: true
        }
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="appShell">
      {!showHero && (
        <header className="chatHeader">
          <div className="chatHeaderBrand">Ask Gary</div>
          <button className="newChatButton" onClick={resetChat}>New chat</button>
        </header>
      )}

      <section className={`contentArea ${showHero ? "heroMode" : "chatMode"}`}>
        {showHero ? (
          <div className="heroWrap">
            <h1 className="heroTitle">Ask Gary</h1>
            <div className="heroImageFrame">
              <img src="/gary-home.jpg" alt="Ask Gary home screen" className="heroImage" />
            </div>
          </div>
        ) : (
          <div className="messagesWrap">
            {messages.map((m) => (
              <article key={m.id} className={`messageRow ${m.role}`}>
                <div className={`messageBubble ${m.role} ${m.error ? "error" : ""}`}>
                  {m.content.split("\n").map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </article>
            ))}

            {loading && (
              <article className="messageRow assistant">
                <div className="messageBubble assistant typing">
                  <i />
                  <i />
                  <i />
                </div>
              </article>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </section>

      <div className="composerDock">
        <form className="composer" onSubmit={sendMessage}>
          <button type="button" className="composerIconButton" aria-label="Tools" title="Tools">
            ＋
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message Ask Gary"
            rows={1}
            maxLength={12000}
          />

          <button className="sendButton" disabled={!canSend} aria-label="Send">
            ↑
          </button>
        </form>
        <div className="fineprint">Ask Gary can make mistakes. Check important information.</div>
      </div>
    </main>
  );
}
