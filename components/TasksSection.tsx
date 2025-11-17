"use client";

import { format, isPast, isToday, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { Task } from "../lib/types";
import { SectionCard } from "./SectionCard";

type Props = {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
};

export function TasksSection({ tasks, onChange }: Props) {
  const [draft, setDraft] = useState<Partial<Task>>({ priority: "medium" });
  const [view, setView] = useState<"all" | "today" | "overdue" | "completed">("all");

  const filtered = useMemo(() => {
    if (view === "all") return tasks.filter((task) => !task.completed);
    if (view === "completed") return tasks.filter((task) => task.completed);
    if (view === "today") {
      return tasks.filter(
        (task) => task.dueDate && isToday(parseISO(task.dueDate)) && !task.completed
      );
    }
    if (view === "overdue") {
      return tasks.filter(
        (task) => task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && !task.completed
      );
    }
    return tasks;
  }, [tasks, view]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const overdue = tasks.filter(
      (task) =>
        task.dueDate &&
        isPast(parseISO(task.dueDate)) &&
        !isToday(parseISO(task.dueDate)) &&
        !task.completed
    ).length;
    const today = tasks.filter(
      (task) => task.dueDate && isToday(parseISO(task.dueDate)) && !task.completed
    ).length;
    return { total, completed, overdue, today };
  }, [tasks]);

  const handleSave = () => {
    const title = draft.title?.trim();
    if (!title) return;
    const task: Task = {
      id: uuid(),
      title,
      notes: draft.notes ?? "",
      dueDate: draft.dueDate,
      completed: false,
      priority: draft.priority ?? "medium"
    };
    onChange([task, ...tasks]);
    setDraft({ priority: "medium" });
  };

  const toggleCompletion = (id: string) => {
    onChange(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed
            }
          : task
      )
    );
  };

  const removeTask = (id: string) => {
    onChange(tasks.filter((task) => task.id !== id));
  };

  return (
    <SectionCard
      title="Tasks"
      subtitle="Actionable tasks linked to your knowledge graph."
      action={
        <div
          style={{
            display: "flex",
            gap: "6px",
            background: "var(--surface-alt)",
            borderRadius: "999px",
            padding: "4px"
          }}
        >
          {(["all", "today", "overdue", "completed"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setView(option)}
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8rem",
                textTransform: "capitalize",
                background: view === option ? "var(--primary)" : "transparent",
                color: view === option ? "var(--bg)" : "var(--text-muted)"
              }}
            >
              {option}
            </button>
          ))}
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "12px"
          }}
        >
          <MetricCard label="Active" value={stats.total - stats.completed} />
          <MetricCard label="Completed" value={stats.completed} tone="success" />
          <MetricCard label="Today" value={stats.today} />
          <MetricCard label="Overdue" value={stats.overdue} tone="danger" />
        </div>

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
            placeholder="Task title"
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
              Due date
              <input
                type="date"
                value={draft.dueDate ?? ""}
                onChange={(event) => setDraft((prev) => ({ ...prev, dueDate: event.target.value }))}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Priority
              <select
                value={draft.priority ?? "medium"}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    priority: event.target.value as Task["priority"]
                  }))
                }
                style={inputStyle}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <div>
            <button style={primaryButtonStyle} onClick={handleSave}>
              Add Task
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          {filtered.length === 0 ? (
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              No tasks found for this view.
            </p>
          ) : (
            filtered.map((task) => (
              <article
                key={task.id}
                style={{
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-alt)",
                  padding: "16px",
                  display: "grid",
                  gap: "10px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px"
                  }}
                >
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleCompletion(task.id)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1rem",
                          textDecoration: task.completed ? "line-through" : "none",
                          color: task.completed ? "var(--text-muted)" : "var(--text)"
                        }}
                      >
                        {task.title}
                      </h3>
                      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.8rem" }}>
                        Priority • {task.priority.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button style={ghostButtonStyle} onClick={() => removeTask(task.id)}>
                    Remove
                  </button>
                </div>
                {task.notes ? (
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {task.notes}
                  </p>
                ) : null}
                {task.dueDate ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "var(--text-muted)",
                      fontSize: "0.8rem"
                    }}
                  >
                    <span>
                      {format(parseISO(task.dueDate), "MMM d, yyyy")}
                      {isToday(parseISO(task.dueDate)) ? " • Today" : null}
                    </span>
                    {isPast(parseISO(task.dueDate)) && !task.completed && !isToday(parseISO(task.dueDate)) ? (
                      <span style={{ color: "var(--danger)" }}>Overdue</span>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))
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
  minWidth: "140px"
};

function MetricCard({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone?: "success" | "danger";
}) {
  const toneColor =
    tone === "success" ? "var(--success)" : tone === "danger" ? "var(--danger)" : "var(--primary)";
  return (
    <div
      style={{
        background: "var(--surface-alt)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
      }}
    >
      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontSize: "1.5rem", fontWeight: 600, color: toneColor }}>{value}</span>
    </div>
  );
}
