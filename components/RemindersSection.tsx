"use client";

import { format, isPast, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { Reminder } from "../lib/types";
import { SectionCard } from "./SectionCard";

type Props = {
  reminders: Reminder[];
  onChange: (reminders: Reminder[]) => void;
};

export function RemindersSection({ reminders, onChange }: Props) {
  const [draft, setDraft] = useState<Partial<Reminder>>({
    channel: "push",
    scheduledAt: new Date().toISOString().slice(0, 16)
  });
  const [showPast, setShowPast] = useState(false);

  const upcoming = useMemo(() => {
    const items = reminders
      .map((reminder) => ({ ...reminder, when: parseISO(reminder.scheduledAt) }))
      .sort((a, b) => a.when.getTime() - b.when.getTime());
    if (showPast) return items;
    return items.filter((item) => item.when >= new Date());
  }, [reminders, showPast]);

  const handleSave = () => {
    const title = draft.title?.trim();
    const scheduledAt = draft.scheduledAt;
    if (!title || !scheduledAt) return;
    const reminder: Reminder = {
      id: uuid(),
      title,
      scheduledAt,
      channel: draft.channel ?? "push",
      notes: draft.notes ?? ""
    };
    onChange([reminder, ...reminders]);
    setDraft({
      channel: draft.channel ?? "push",
      scheduledAt: new Date().toISOString().slice(0, 16)
    });
  };

  const removeReminder = (id: string) => {
    onChange(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <SectionCard
      title="Reminders"
      subtitle="Never forget critical follow-ups or rituals."
      action={
        <button
          onClick={() => setShowPast((prev) => !prev)}
          style={{
            padding: "8px 14px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background: showPast ? "var(--primary)" : "var(--surface-alt)",
            color: showPast ? "var(--bg)" : "var(--text-muted)",
            fontSize: "0.8rem"
          }}
        >
          {showPast ? "Hide past" : "Show past"}
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "grid",
            gap: "12px",
            background: "var(--surface-alt)",
            borderRadius: "16px",
            padding: "16px"
          }}
        >
          <input
            placeholder="Reminder title"
            value={draft.title ?? ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            style={inputStyle}
          />
          <textarea
            placeholder="Notes or context"
            value={draft.notes ?? ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap"
            }}
          >
            <label style={labelStyle}>
              Schedule
              <input
                type="datetime-local"
                value={draft.scheduledAt ?? ""}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, scheduledAt: event.target.value }))
                }
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Channel
              <select
                value={draft.channel ?? "push"}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    channel: event.target.value as Reminder["channel"]
                  }))
                }
                style={inputStyle}
              >
                <option value="push">Push</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </label>
          </div>
          <div>
            <button style={primaryButtonStyle} onClick={handleSave}>
              Schedule Reminder
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          {upcoming.length === 0 ? (
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              No reminders scheduled.
            </p>
          ) : (
            upcoming.map((reminder) => {
              const when = parseISO(reminder.scheduledAt);
              const past = isPast(when);
              return (
                <article
                  key={reminder.id}
                  style={{
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    background: "var(--surface-alt)",
                    padding: "16px",
                    display: "grid",
                    gap: "10px"
                  }}
                >
                  <header
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px"
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0 }}>{reminder.title}</h3>
                      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        {format(when, "MMM d, yyyy • h:mm a")}
                      </p>
                    </div>
                    <button style={ghostButtonStyle} onClick={() => removeReminder(reminder.id)}>
                      Remove
                    </button>
                  </header>
                  {reminder.notes ? (
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      {reminder.notes}
                    </p>
                  ) : null}
                  <footer
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.8rem",
                      color: past ? "var(--danger)" : "var(--success)"
                    }}
                  >
                    <span>{past ? "Elapsed" : "Upcoming"}</span>
                    <span style={{ color: "var(--text-muted)" }}>Channel • {reminder.channel}</span>
                  </footer>
                </article>
              );
            })
          )}
        </div>
      </div>
    </SectionCard>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  background: "rgba(15,23,42,0.55)",
  color: "var(--text)",
  fontSize: "0.85rem",
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
  color: "var(--danger)",
  padding: "8px 14px",
  borderRadius: "999px",
  border: "1px solid rgba(249, 115, 115, 0.32)",
  cursor: "pointer",
  fontSize: "0.8rem"
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  fontSize: "0.75rem",
  color: "var(--text-muted)",
  minWidth: "180px"
};
