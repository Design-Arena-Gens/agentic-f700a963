"use client";

import { formatDistanceToNow } from "date-fns";
import { ChangeEvent, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { FileAsset } from "../lib/types";
import { SectionCard } from "./SectionCard";

type Props = {
  files: FileAsset[];
  onChange: (files: FileAsset[]) => void;
};

export function FileManagerSection({ files, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "docs" | "media" | "other">("all");

  const filtered = useMemo(() => {
    const search = query.toLowerCase();
    return files.filter((file) => {
      const matchesText =
        !search || file.name.toLowerCase().includes(search) || file.type.toLowerCase().includes(search);
      if (!matchesText) return false;
      if (typeFilter === "all") return true;
      if (typeFilter === "docs") return /pdf|word|sheet|text|presentation|officedocument/i.test(file.type);
      if (typeFilter === "media") return /image|audio|video/i.test(file.type);
      return !/pdf|word|sheet|text|presentation|officedocument|image|audio|video/i.test(file.type);
    });
  }, [files, query, typeFilter]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    const reader = new FileReader();
    reader.onload = () => {
      const asset: FileAsset = {
        id: uuid(),
        name: selected.name,
        size: selected.size,
        type: selected.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
        dataUrl: typeof reader.result === "string" ? reader.result : ""
      };
      onChange([asset, ...files]);
    };
    reader.readAsDataURL(selected);
    event.target.value = "";
  };

  const remove = (id: string) => {
    onChange(files.filter((file) => file.id !== id));
  };

  return (
    <SectionCard
      title="Files"
      subtitle="Unified assets connected to your workflows."
      action={
        <div
          style={{
            display: "flex",
            gap: "8px"
          }}
        >
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)}
            style={pillInputStyle}
          >
            <option value="all">All</option>
            <option value="docs">Docs</option>
            <option value="media">Media</option>
            <option value="other">Other</option>
          </select>
          <input
            type="search"
            placeholder="Search files"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={pillInputStyle}
          />
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <label
          style={{
            border: "1px dashed var(--border)",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "center",
            cursor: "pointer",
            background:
              "linear-gradient(135deg, rgba(96,165,250,0.12), rgba(96,165,250,0.05))",
            transition: "border 0.2s ease, transform 0.2s ease"
          }}
        >
          <input type="file" hidden onChange={handleFileSelect} />
          <strong style={{ display: "block", marginBottom: "6px" }}>Upload an asset</strong>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Drag & drop or tap to browse. Stored locally in your browser.
          </span>
        </label>

        <div
          className="scroll-thin"
          style={{
            display: "grid",
            gap: "12px",
            maxHeight: "260px",
            overflowY: "auto",
            paddingRight: "4px"
          }}
        >
          {filtered.length === 0 ? (
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              No files available. Add your first asset above.
            </p>
          ) : (
            filtered.map((file) => (
              <article
                key={file.id}
                style={{
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-alt)",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px"
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div
                    aria-hidden
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "14px",
                      background: "rgba(96,165,250,0.18)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--primary)",
                      fontWeight: 600,
                      textTransform: "uppercase"
                    }}
                  >
                    {file.name.slice(0, 2)}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "0.95rem" }}>{file.name}</h3>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      {(file.size / 1024).toFixed(1)} KB • {file.type || "Unknown type"}
                    </p>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      Added {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <a
                    download={file.name}
                    href={file.dataUrl}
                    style={pillActionStyle}
                  >
                    Download
                  </a>
                  <button style={dangerButtonStyle} onClick={() => remove(file.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </SectionCard>
  );
}

const pillInputStyle: React.CSSProperties = {
  background: "var(--surface-alt)",
  borderRadius: "999px",
  border: "1px solid var(--border)",
  padding: "8px 14px",
  color: "var(--text)",
  fontSize: "0.8rem",
  outline: "none"
};

const pillActionStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: "999px",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: "0.8rem",
  textDecoration: "none",
  background: "transparent"
};

const dangerButtonStyle: React.CSSProperties = {
  ...pillActionStyle,
  borderColor: "rgba(249, 115, 115, 0.32)",
  color: "var(--danger)",
  cursor: "pointer"
};
