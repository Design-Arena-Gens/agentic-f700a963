"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { Note } from "../lib/types";
import { SectionCard } from "./SectionCard";

type Props = {
  notes: Note[];
  onChange: (notes: Note[]) => void;
};

const palate = ["#60a5fa", "#34d399", "#f97316", "#f472b6", "#a855f7", "#facc15"];

export function NotesSection({ notes, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Partial<Note>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    if (!query.trim()) return notes;
    const search = query.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search) ||
        note.tags.some((tag) => tag.toLowerCase().includes(search))
    );
  }, [notes, query]);

  const resetDraft = () => {
    setDraft({});
    setEditingId(null);
  };

  const handleSave = () => {
    const title = draft.title?.trim();
    const content = draft.content?.trim();
    if (!title || !content) return;
    const tags = (draft.tags ?? []).filter(Boolean);
    const color = draft.color ?? palate[notes.length % palate.length];
    const timestamp = new Date().toISOString();

    if (editingId) {
      onChange(
        notes.map((note) =>
          note.id === editingId
            ? { ...note, title, content, tags, color, updatedAt: timestamp }
            : note
        )
      );
    } else {
      const next: Note = {
        id: uuid(),
        title,
        content,
        tags,
        color,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      onChange([next, ...notes]);
    }
    resetDraft();
  };

  const handleEdit = (note: Note) => {
    setDraft(note);
    setEditingId(note.id);
  };

  const handleDelete = (id: string) => {
    onChange(notes.filter((note) => note.id !== id));
    if (editingId === id) {
      resetDraft();
    }
  };

  const handleTagInput = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setDraft((prev) => ({ ...prev, tags }));
  };

  return (
    <SectionCard
      title="Notes"
      subtitle="Capture research, ideas, and knowledge fragments."
      action={
        <input
          type="search"
          placeholder="Search notes"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{
            background: "var(--surface-alt)",
            color: "var(--text)",
            borderRadius: "999px",
            border: "1px solid var(--border)",
            padding: "8px 14px",
            fontSize: "0.85rem"
          }}
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "12px",
            background: "var(--surface-alt)",
            borderRadius: "16px",
            padding: "16px"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <input
              value={draft.title ?? ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Note title"
              style={inputStyle}
            />
            <textarea
              value={draft.content ?? ""}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, content: event.target.value }))
              }
              placeholder="Write your thought or summary..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <input
              value={(draft.tags ?? []).join(", ")}
              onChange={(event) => handleTagInput(event.target.value)}
              placeholder="Tags: research, ideas"
              style={inputStyle}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap"
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Color</span>
              {palate.map((color) => (
                <button
                  key={color}
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    border:
                      draft.color === color
                        ? "2px solid var(--primary-accent)"
                        : "2px solid transparent",
                    background: color,
                    cursor: "pointer"
                  }}
                  onClick={() => setDraft((prev) => ({ ...prev, color }))}
                  aria-label={`Pick ${color} for note color`}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px"
            }}
          >
            <button style={primaryButtonStyle} onClick={handleSave}>
              {editingId ? "Update Note" : "Save Note"}
            </button>
            {editingId ? (
              <button
                style={ghostButtonStyle}
                onClick={() => resetDraft()}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "12px"
          }}
        >
          {filteredNotes.length === 0 ? (
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              No notes yet. Capture your first insight above.
            </p>
          ) : (
            filteredNotes.map((note) => (
              <article
                key={note.id}
                style={{
                  borderRadius: "18px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-alt)",
                  padding: "16px",
                  display: "grid",
                  gap: "10px",
                  position: "relative"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "0",
                    borderRadius: "18px",
                    border: `1px solid ${note.color}`,
                    opacity: 0.2,
                    pointerEvents: "none"
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "1rem" }}>{note.title}</h3>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      Updated {format(new Date(note.updatedAt), "MMM d, yyyy • h:mm a")}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={ghostButtonStyle} onClick={() => handleEdit(note)}>
                      Edit
                    </button>
                    <button
                      style={dangerButtonStyle}
                      onClick={() => handleDelete(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{note.content}</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(96,165,250,0.12)",
                        color: "var(--text)",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "0.75rem"
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </SectionCard>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid var(--border)",
  background: "rgba(15,23,42,0.55)",
  color: "var(--text)",
  fontSize: "0.9rem",
  outline: "none"
};

const primaryButtonStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, var(--primary), var(--primary-accent))",
  color: "var(--bg)",
  padding: "10px 18px",
  borderRadius: "999px",
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.9rem"
};

const ghostButtonStyle: React.CSSProperties = {
  background: "transparent",
  color: "var(--text-muted)",
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid var(--border)",
  cursor: "pointer",
  fontSize: "0.85rem"
};

const dangerButtonStyle: React.CSSProperties = {
  ...ghostButtonStyle,
  color: "var(--danger)",
  borderColor: "rgba(249, 115, 115, 0.32)"
};
