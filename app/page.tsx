"use client";

import { useMemo } from "react";
import { ChatOverlay } from "../components/ChatOverlay";
import { DashboardOverview } from "../components/DashboardOverview";
import { FileManagerSection } from "../components/FileManagerSection";
import { NotesSection } from "../components/NotesSection";
import { RemindersSection } from "../components/RemindersSection";
import { TasksSection } from "../components/TasksSection";
import { usePersistentState } from "../hooks/usePersistentState";
import { FileAsset, Note, Reminder, Task } from "../lib/types";

export default function Home() {
  const notesState = usePersistentState<Note[]>("second-brain-notes", []);
  const tasksState = usePersistentState<Task[]>("second-brain-tasks", []);
  const remindersState = usePersistentState<Reminder[]>("second-brain-reminders", []);
  const filesState = usePersistentState<FileAsset[]>("second-brain-files", []);

  const dailyAffirmation = useMemo(() => {
    const options = [
      "Build momentum with one meaningful capture.",
      "Connect insights to unlock compound creativity.",
      "Honor focus: ship the task that unlocks everything else.",
      "You have everything you need to orchestrate today with clarity."
    ];
    const index = new Date().getDate() % options.length;
    return options[index];
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "20px",
        paddingBottom: "120px",
        background:
          "radial-gradient(circle at top left, rgba(96,165,250,0.22), transparent 45%), radial-gradient(circle at bottom right, rgba(168,85,247,0.15), transparent 40%), var(--bg)"
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "12px"
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}
        >
          Aurora Second Brain
        </span>
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700 }}>
          Orchestrate your mind, flows, and files.
        </h1>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "540px" }}>
          Capture atomic notes, drive next actions, schedule rituals, and synthesize insights with an AI copilot that is always a tap away.
        </p>
      </header>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <section
          style={{
            borderRadius: "20px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap"
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Today&apos;s Focus</h2>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                {dailyAffirmation}
              </p>
            </div>
            <span
              style={{
                background: "rgba(96,165,250,0.12)",
                color: "var(--primary)",
                padding: "6px 12px",
                borderRadius: "999px",
                fontSize: "0.75rem"
              }}
            >
              Synced locally
            </span>
          </div>
          <DashboardOverview
            notes={notesState.state}
            tasks={tasksState.state}
            reminders={remindersState.state}
            files={filesState.state}
          />
        </section>

        <section
          style={{
            display: "grid",
            gap: "18px"
          }}
        >
          <NotesSection notes={notesState.state} onChange={notesState.setState} />
          <TasksSection tasks={tasksState.state} onChange={tasksState.setState} />
          <RemindersSection reminders={remindersState.state} onChange={remindersState.setState} />
          <FileManagerSection files={filesState.state} onChange={filesState.setState} />
        </section>
      </main>

      <ChatOverlay />
    </div>
  );
}
