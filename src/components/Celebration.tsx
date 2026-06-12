import { For, onMount, createSignal } from "solid-js";
import type { Level } from "../levels";

interface Props {
  level: Level;
  next: Level | undefined;
  totalChallenges: number;
  onNext: () => void;
  onStay: () => void;
}

const COLORS = ["#a78bfa", "#86efac", "#fbbf24", "#f87171", "#c4b5fd", "#60a5fa", "#fb923c"];

export default function Celebration(props: Props) {
  const [pieces] = createSignal(
    Array.from({ length: 80 }, () => ({
      left: Math.random() * 100,
      dx: (Math.random() - 0.5) * 200,
      dur: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotate: Math.random() * 360,
    })),
  );

  onMount(() => {
    // Trigger any sound or analytics here if desired
  });

  return (
    <div class="fixed inset-0 z-40 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <For each={pieces()}>
        {(p) => (
          <div
            class="confetti-piece"
            style={{
              left: `${p.left}vw`,
              "background-color": p.color,
              "--dx": `${p.dx}px`,
              "--dur": `${p.dur}s`,
              "animation-delay": `${p.delay}s`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        )}
      </For>

      <div class="bg-gradient-to-br from-bg-panel to-bg-soft border border-accent/40 rounded-2xl max-w-lg w-full p-8 text-center shadow-2xl animate-bounce-in">
        <div class="text-6xl mb-4">🎉</div>
        <div class="text-xs uppercase tracking-wider text-accent mb-2">Level Complete</div>
        <h2 class="text-2xl font-semibold text-ink mb-2">{props.level.title}</h2>
        <p class="text-ink-muted mb-1">
          You solved all <span class="text-success font-medium">{props.totalChallenges}</span> challenges.
        </p>
        <p class="text-ink-dim text-sm mb-6">{props.level.concept}</p>

        {props.next ? (
          <div class="space-y-3">
            <div class="text-ink-muted text-sm">Up next:</div>
            <div class="bg-bg-panel border border-bg-border rounded-lg p-4 text-left">
              <div class="text-accent text-sm font-medium">{props.next.title}</div>
              <div class="text-ink-muted text-xs mt-1">{props.next.subtitle} · {props.next.concept}</div>
            </div>
            <div class="flex gap-2 mt-4">
              <button
                onClick={props.onStay}
                class="flex-1 px-4 py-2.5 text-sm text-ink-muted hover:text-ink rounded-lg border border-bg-border hover:border-bg-border/60"
              >
                Stay here
              </button>
              <button
                onClick={props.onNext}
                class="flex-1 px-4 py-2.5 text-sm bg-accent hover:bg-accent-glow text-bg font-medium rounded-lg shadow-lg shadow-accent/30 animate-pulse-glow"
              >
                Continue →
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div class="text-ink-muted text-sm mb-4">
              You've reached the end of what's been built so far. More levels coming!
            </div>
            <button
              onClick={props.onStay}
              class="px-6 py-2.5 text-sm bg-accent hover:bg-accent-glow text-bg font-medium rounded-lg"
            >
              Keep exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
