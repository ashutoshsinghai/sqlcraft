import { For, Show, createSignal } from "solid-js";
import type { Level } from "../levels";
import { IconCheck, IconArrowRight } from "./Icons";

interface Props {
  level: Level;
  next: Level | undefined;
  totalChallenges: number;
  onNext: () => void;
  onStay: () => void;
}

const COLORS = ["#ff9a3c", "#ffb05c", "#86efac", "#fbbf24", "#e8e8ea"];

export default function Celebration(props: Props) {
  const [pieces] = createSignal(
    Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      dx: (Math.random() - 0.5) * 200,
      dur: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotate: Math.random() * 360,
    })),
  );

  return (
    <div class="fixed inset-0 z-40 bg-bg/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
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

      <div class="bg-bg-soft border border-bg-border max-w-md w-full p-7 animate-bounce-in rounded">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-9 h-9 rounded bg-success/15 border border-success/40 flex items-center justify-center text-success">
            <IconCheck class="w-5 h-5" />
          </div>
          <div>
            <div class="label-mono text-success">level complete</div>
            <div class="text-ink font-mono text-base mt-0.5">{props.level.title.replace(/^Level \d+ · /, "")}</div>
          </div>
        </div>

        <div class="text-sm text-ink-muted mb-6">
          You solved all <span class="text-success font-semibold">{props.totalChallenges}</span> challenges.
          <Show when={props.next}>
            <span> Ready for the next concept?</span>
          </Show>
        </div>

        <Show when={props.next}>
          <div class="border border-bg-border bg-bg/40 px-3.5 py-3 mb-5 rounded">
            <div class="label-mono text-ink-dim mb-1">up next</div>
            <div class="text-accent font-mono text-sm">{props.next!.title.replace(/^Level \d+ · /, "")}</div>
            <div class="text-ink-muted text-xs mt-0.5">{props.next!.concept}</div>
          </div>
        </Show>

        <div class="flex gap-2">
          <button
            onClick={props.onStay}
            class="flex-1 px-3 py-2 text-ink-muted hover:text-ink hover:bg-bg-panel rounded transition-colors"
          >
            <span class="label-mono">stay</span>
          </button>
          <Show
            when={props.next}
            fallback={
              <button onClick={props.onStay} class="flex-1 px-3 py-2 bg-accent hover:bg-accent-glow text-bg rounded font-semibold transition-colors">
                <span class="label-mono">close</span>
              </button>
            }
          >
            <button
              onClick={props.onNext}
              class="flex-[2] flex items-center justify-center gap-2 px-3 py-2 bg-accent hover:bg-accent-glow text-bg rounded font-semibold transition-colors"
            >
              <span class="label-mono">next level</span>
              <IconArrowRight class="w-3.5 h-3.5 text-bg" />
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}
