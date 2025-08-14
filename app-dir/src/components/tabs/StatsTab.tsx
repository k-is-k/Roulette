import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2 } from "lucide-react";
import type { Project, HistoryItem } from "../../types";
import { aggregateHistory, exportCsv } from "../../lib/history";
import { ResponsiveContainer, BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

type Props = {
  active: Project;
  patchActive: (patch: Partial<Project>) => void;
};

export default function StatsTab({ active, patchActive }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">履歴 & 簡易統計</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={aggregateHistory(active)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="回数" />
                </RBarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" onClick={() => exportCsv(active)}>
                <Download className="w-4 h-4 mr-2" />CSVエクスポート
              </Button>
              <Button variant="ghost" onClick={() => patchActive({ history: [] as unknown as HistoryItem[] })}>
                <Trash2 className="w-4 h-4 mr-2" />履歴クリア
              </Button>
            </div>
          </div>
          <div>
            <div className="text-sm opacity-70 mb-2">最近の結果（最大100件）</div>
            <ScrollArea className="h-64 pr-3">
              <ol className="space-y-2">
                {active.history.slice(0, 100).map((h) => {
                  const o = active.options.find((x) => x.id === h.resultOptionId);
                  return (
                    <li key={h.id} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm" style={{ background: o?.color || "#ccc" }} />
                      <span className="text-sm">{o?.label || "?"}</span>
                      <span className="ml-auto text-xs opacity-70">{new Date(h.drawnAt).toLocaleString()}</span>
                    </li>
                  );
                })}
              </ol>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

