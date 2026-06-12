import { For } from "solid-js";
import { LEVELS } from "../levels";

interface Props {
  currentId: string | null;
  progress: Record<string, "untouched" | "in-progress" | "completed">;
  onPick: (id: string) => void;
}

export default function LevelList(props: Props) {
  return (
    <div class="flex flex-col items-center gap-1 py-4">
      <For each={LEVELS}>
        {(l, i) => {
          const status = () => props.progress[l.id] ?? "untouched";
          const isActive = () => props.currentId === l.id;
          const num = i() + 1;

          const ringClass = () => {
            if (isActive()) return "ring-2 ring-accent ring-offset-2 ring-offset-bg";
            return "";
          };
          const fillClass = () => {
            if (status() === "completed") return "bg-success/15 text-success border-success/30";
            if (status() === "in-progress") return "bg-warn/15 text-warn border-warn/30";
            if (!l.available) return "bg-transparent text-ink-dim border-bg-border";
            return "bg-bg-soft text-ink-muted border-bg-border hover:border-accent/40 hover:text-ink";
          };

          return (
            <button
              disabled={!l.available}
              onClick={() => props.onPick(l.id)}
              data-tip={l.title + (l.available ? "" : " · soon")}
              class={`tooltip w-9 h-9 rounded-lg border text-xs font-medium flex items-center justify-center transition-all ${fillClass()} ${ringClass()} ${
                !l.available ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              {status() === "completed" ? "✓" : num}
            </button>
          );
        }}
      </For>
    </div>
  );
}
