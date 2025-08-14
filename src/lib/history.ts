import type { Project } from "../types";

export function aggregateHistory(p: Project) {
  const counts: Record<string, number> = {};
  p.options.forEach((o) => {
    counts[o.id] = 0;
  });
  p.history.forEach((h) => {
    counts[h.resultOptionId] = (counts[h.resultOptionId] || 0) + 1;
  });
  return p.options.map((o) => ({ name: o.label, 回数: counts[o.id] || 0 }));
}

export function exportCsv(p: Project) {
  const header = ["drawnAt", "label", "optionId", "projectId"];
  const rows = p.history.map((h) => {
    const o = p.options.find((x) => x.id === h.resultOptionId);
    return [new Date(h.drawnAt).toISOString(), JSON.stringify(o?.label || ""), h.resultOptionId, p.id].join(",");
  });
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${p.name || "project"}-history.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
