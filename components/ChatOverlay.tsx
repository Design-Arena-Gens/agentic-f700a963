"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { usePersistentState } from "../hooks/usePersistentState";
import { ChatMessage } from "../lib/types";

export function ChatOverlay() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState("");
  const { state: messages, setState: setMessages } = usePersistentState<ChatMessage[]>(
    "second-brain-chat",
    [
      {
        id: uuid(),
        role: "assistant",
        content:
          "Hi! I'm your Aurora AI. Ask me to synthesize notes, craft plans, or extract insights from your workspace.",
        createdAt: new Date().toISOString()
      }
    ]
  );
  const formRef = useRef<HTMLFormElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [messages]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    setPending(true);
    const userMessage: ChatMessage = {
      id: uuid(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString()
    };
    const optimistic = [...messages, userMessage];
    setMessages(optimistic);
    setInput("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      });
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: uuid(),
        role: "assistant",
        content: data.reply ?? "I captured that!",
        createdAt: new Date().toISOString()
      };
      setMessages([...optimistic, assistantMessage]);
    } catch (error) {
      const fallback: ChatMessage = {
        id: uuid(),
        role: "assistant",
        content: "Something went wrong, but I kept your message. Try again in a moment.",
        createdAt: new Date().toISOString()
      };
      setMessages([...optimistic, fallback]);
      console.warn(error);
    } finally {
      setPending(false);
      setTimeout(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 50);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, var(--primary), var(--primary-accent))",
          color: "var(--bg)",
          fontSize: "1.6rem",
          fontWeight: 600,
          boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
          cursor: "pointer",
          zIndex: 90
        }}
        aria-label="Toggle AI chat"
      >
        {open ? "×" : "AI"}
      </button>
      {open ? (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "20px",
            width: "min(360px, 92vw)",
            height: "460px",
            borderRadius: "24px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 24px 48px rgba(15, 23, 42, 0.45)",
            zIndex: 100
          }}
        >
          <header
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: "1rem" }}>Aurora AI</h2>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.8rem" }}>
                Ask anything about your notes, tasks, and files.
              </p>
            </div>
            <span
              style={{
                background: "rgba(96,165,250,0.12)",
                color: "var(--primary)",
                padding: "6px 10px",
                borderRadius: "999px",
                fontSize: "0.7rem",
                textTransform: "uppercase"
              }}
            >
              Realtime
            </span>
          </header>
          <div
            className="scroll-thin"
            style={{
              flex: 1,
              padding: "16px 20px",
              display: "grid",
              gap: "12px",
              overflowY: "auto"
            }}
          >
            {sortedMessages.map((message) => (
              <div
                key={message.id}
                style={{
                  justifySelf: message.role === "user" ? "end" : "start",
                  maxWidth: "85%",
                  background:
                    message.role === "user" ? "var(--primary)" : "rgba(96,165,250,0.12)",
                  color: message.role === "user" ? "var(--bg)" : "var(--text)",
                  padding: "12px 14px",
                  borderRadius:
                    message.role === "user"
                      ? "18px 4px 18px 18px"
                      : "4px 18px 18px 18px",
                  whiteSpace: "pre-wrap",
                  fontSize: "0.9rem"
                }}
              >
                {message.content}
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{
              padding: "16px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: "10px"
            }}
          >
            <input
              placeholder="Summarize today's capture..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              style={{
                flex: 1,
                borderRadius: "999px",
                border: "1px solid var(--border)",
                background: "var(--surface-alt)",
                padding: "12px 18px",
                color: "var(--text)",
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
            <button
              type="submit"
              disabled={pending}
              style={{
                borderRadius: "999px",
                border: "none",
                background: pending
                  ? "rgba(148, 163, 184, 0.35)"
                  : "linear-gradient(135deg, var(--primary), var(--primary-accent))",
                color: pending ? "var(--text-muted)" : "var(--bg)",
                padding: "12px 18px",
                fontWeight: 600,
                cursor: pending ? "wait" : "pointer"
              }}
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
