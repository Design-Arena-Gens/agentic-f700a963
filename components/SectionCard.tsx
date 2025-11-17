import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ title, subtitle, action, children }: Props) {
  return (
    <section
      className="section-card"
      style={{
        background: "var(--surface)",
        borderRadius: "18px",
        border: `1px solid var(--border)`,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "relative"
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px"
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 600,
              margin: 0
            }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              style={{
                margin: 0,
                color: "var(--text-muted)",
                fontSize: "0.85rem"
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        {action}
      </header>
      <div>{children}</div>
    </section>
  );
}
