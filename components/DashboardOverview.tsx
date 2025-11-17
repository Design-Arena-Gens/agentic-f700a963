import { format } from "date-fns";
import { FileAsset, Note, Reminder, Task } from "../lib/types";

type Props = {
  notes: Note[];
  tasks: Task[];
  reminders: Reminder[];
  files: FileAsset[];
};

export function DashboardOverview({ notes, tasks, reminders, files }: Props) {
  const incompleteTasks = tasks.filter((task) => !task.completed).length;
  const completedToday = tasks.filter((task) => {
    if (!task.completed) return false;
    const completedDate = task.dueDate ? new Date(task.dueDate) : undefined;
    if (!completedDate) return false;
    const today = new Date();
    return (
      completedDate.getFullYear() === today.getFullYear() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getDate() === today.getDate()
    );
  }).length;

  const latestNote = notes[0];
  const nextReminder = reminders
    .map((reminder) => ({ ...reminder, date: new Date(reminder.scheduledAt) }))
    .filter((reminder) => reminder.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  const metrics = [
    {
      label: "Notes",
      value: notes.length.toString(),
      detail: latestNote
        ? `Latest: ${latestNote.title.slice(0, 22)}`
        : "Capture your first insight"
    },
    {
      label: "Tasks",
      value: `${incompleteTasks}`,
      detail: `${completedToday} completed today`
    },
    {
      label: "Reminders",
      value: reminders.length.toString(),
      detail: nextReminder
        ? `Next: ${format(nextReminder.date, "MMM d • h:mm a")}`
        : "No upcoming reminders"
    },
    {
      label: "Files",
      value: files.length.toString(),
      detail: files.length ? `Last: ${files[0].name.slice(0, 20)}` : "Upload an asset"
    }
  ];

  return (
    <section
      style={{
        display: "grid",
        gap: "14px",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))"
      }}
    >
      {metrics.map((metric) => (
        <article
          key={metric.label}
          style={{
            borderRadius: "18px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            padding: "18px",
            display: "grid",
            gap: "6px"
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              letterSpacing: "0.02em"
            }}
          >
            {metric.label}
          </span>
          <strong style={{ fontSize: "1.8rem", color: "var(--primary)", fontWeight: 600 }}>
            {metric.value}
          </strong>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{metric.detail}</span>
        </article>
      ))}
    </section>
  );
}
