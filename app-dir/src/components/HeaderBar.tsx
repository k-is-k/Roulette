import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Settings, History as HistoryIcon } from "lucide-react";
import type { Project } from "../types";

type Props = {
  projects: Project[];
  activeId: string;
  setActiveId: (id: string) => void;
  onCreateProject: () => void;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onToggleHighContrast: () => void;
  sound: boolean;
  haptics: boolean;
  highContrastEnabled: boolean;
};

export default function HeaderBar({
  projects,
  activeId,
  setActiveId,
  onCreateProject,
  onToggleSound,
  onToggleHaptics,
  onToggleHighContrast,
  sound,
  haptics,
  highContrastEnabled,
}: Props) {
  return (
    <header className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 shadow-lg" />
        <h1 className="text-2xl md:text-3xl font-bold">ワクワク抽選</h1>
        <span className="text-xs opacity-60">refactored</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onCreateProject}>
          <Plus className="w-4 h-4 mr-1" />新規
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <HistoryIcon className="w-4 h-4 mr-1" />最近プロジェクト
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>プロジェクト一覧</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-72 pr-3">
              <div className="space-y-2">
                {projects.map((p) => (
                  <Card
                    key={p.id}
                    className={`cursor-pointer ${p.id === activeId ? "ring-2 ring-indigo-500" : ""}`}
                    onClick={() => setActiveId(p.id)}
                  >
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{p.name}</span>
                        <span className="text-xs opacity-70">{new Date(p.updatedAt).toLocaleString()}</span>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="設定">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onToggleSound}>サウンド {sound ? "ON" : "OFF"}</DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleHaptics}>触覚 {haptics ? "ON" : "OFF"}</DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleHighContrast}>高コントラスト {highContrastEnabled ? "ON" : "OFF"}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
