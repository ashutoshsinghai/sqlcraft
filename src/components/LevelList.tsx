import { For } from "solid-js";
import { LEVELS } from "../levels";

interface Props {
  currentId: string | null;
  progress: Record<string, "untouched" | "in-progress" | "completed">;
  onPick: (id: string) => void;
}

const STATUS_DOT: Record<string, string> = {
  completed: "bg-success",
  "in-progress": "bg-warn",
  untouched: "bg-bg-border",
};

export default function LevelList(props: Props) {
  return (
    <div class="text-xs">
      <div class="text-ink-muted uppercase tracking-wider mb-2 px-1">Levels</div>
      <div class="space-y-0.5">
        <For each={LEVELS}>
          {(l) => {
            const status = () => props.progress[l.id] ?? "untouched";
            const isActive = () => props.currentId === l.id;
            return (
              <button
                disabled={!l.available}
                onClick={() => props.onPick(l.id)}
                class={`w-full text-left rounded px-2 py-1.5 flex items-start gap-2 transition-colors ${
                  isActive() ? "bg-accent-soft/50 border border-accent/40" : "border border-transparent hover:bg-bg-panel"
                } ${!l.available ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <span class={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${STATUS_DOT[status()]}`} />
                <div class="flex-1 min-w-0">
                  <div class={`text-ink truncate ${isActive() ? "font-medium" : ""}`}>{l.title}</div>
                  <div class="text-ink-dim text-[10px] truncate">
                    {l.subtitle}
                    {!l.available && " · soon"}
                  </div>
                </div>
              </button>
            );
          }}
        </For>
      </div>
    </div>
  );
}
