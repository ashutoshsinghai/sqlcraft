import { For } from "solid-js";
import { LEVELS } from "../levels";
import { IconCheck } from "./Icons";

interface Props {
  currentId: string | null;
  progress: Record<string, "untouched" | "in-progress" | "completed">;
  onPick: (id: string) => void;
}

export default function LevelList(props: Props) {
  return (
    <div class="flex flex-col items-center gap-1 py-3">
      <For each={LEVELS}>
        {(l, i) => {
          const status = () => props.progress[l.id] ?? "untouched";
          const isActive = () => props.currentId === l.id;
          const num = String(i() + 1).padStart(2, "0");

          const stateClass = () => {
            if (isActive()) return "bg-accent text-bg border-accent";
            if (status() === "completed") return "bg-success/10 text-success border-success/40";
            if (status() === "in-progress") return "bg-warn/10 text-warn border-warn/40";
            if (!l.available) return "bg-transparent text-ink-dim border-bg-border opacity-40";
            return "bg-transparent text-ink-muted border-bg-border hover:border-ink-dim hover:text-ink";
          };

          return (
            <button
              disabled={!l.available}
              onClick={() => props.onPick(l.id)}
              data-tip={`${l.title}${l.available ? "" : " · soon"}`}
              class={`tooltip w-9 h-9 border font-mono text-[11px] font-medium flex items-center justify-center transition-all rounded ${stateClass()} ${
                !l.available ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {status() === "completed" && !isActive() ? <IconCheck class="w-3.5 h-3.5" /> : num}
            </button>
          );
        }}
      </For>
    </div>
  );
}
