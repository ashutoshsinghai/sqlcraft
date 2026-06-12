import { Show, createSignal, createEffect } from "solid-js";
import type { GradeResult } from "../lib/grader";
import { IconCheck, IconCross, IconArrowRight } from "./Icons";

interface Props {
  grade: GradeResult;
  solvedCount: number;
  total: number;
  onNext: () => void;
  hasNext: boolean;
}

export default function GradeBanner(props: Props) {
  const [showDetails, setShowDetails] = createSignal(false);

  createEffect(() => {
    props.grade;
    setShowDetails(false);
  });

  return (
    <Show
      when={props.grade.pass}
      fallback={
        <div class="mx-3 mt-3 border border-danger/40 bg-danger/[0.08] px-3.5 py-2.5 animate-bounce-in shake rounded">
          <div class="flex items-start gap-2.5">
            <div class="w-5 h-5 mt-0.5 bg-danger/20 border border-danger/40 flex items-center justify-center text-danger rounded flex-shrink-0">
              <IconCross class="w-3 h-3" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="label-mono text-danger">wrong</div>
              <div class="text-sm text-ink mt-0.5">{props.grade.message}</div>
              <Show when={props.grade.details}>
                <button
                  class="text-[11px] font-mono text-ink-muted hover:text-ink mt-1 underline underline-offset-2"
                  onClick={() => setShowDetails((v) => !v)}
                >
                  {showDetails() ? "hide" : "show"} details
                </button>
                <Show when={showDetails()}>
                  <pre class="text-[11px] text-ink-muted mt-1.5 whitespace-pre-wrap bg-bg/40 border border-bg-border rounded p-2 max-h-32 overflow-auto">
                    {props.grade.details}
                  </pre>
                </Show>
              </Show>
            </div>
          </div>
        </div>
      }
    >
      <div class="mx-3 mt-3 border border-success/40 bg-success/[0.08] px-3.5 py-2.5 animate-bounce-in rounded">
        <div class="flex items-center gap-2.5">
          <div class="w-5 h-5 bg-success/20 border border-success/40 flex items-center justify-center text-success rounded flex-shrink-0">
            <IconCheck class="w-3 h-3" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="label-mono text-success">correct</div>
            <div class="text-[12px] text-ink-muted mt-0.5 tabular-nums">
              {props.solvedCount} / {props.total} solved this level
            </div>
          </div>
          <Show when={props.hasNext}>
            <button
              onClick={props.onNext}
              class="flex items-center gap-1.5 px-2.5 py-1 bg-accent hover:bg-accent-glow text-bg rounded transition-colors"
            >
              <span class="label-mono text-bg">next</span>
              <IconArrowRight class="w-3 h-3 text-bg" />
            </button>
          </Show>
        </div>
      </div>
    </Show>
  );
}
