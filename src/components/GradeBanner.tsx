import { Show, createSignal, createEffect } from "solid-js";
import type { GradeResult } from "../lib/grader";

interface Props {
  grade: GradeResult;
  solvedCount: number;
  total: number;
  onNext: () => void;
  hasNext: boolean;
}

export default function GradeBanner(props: Props) {
  const [showDetails, setShowDetails] = createSignal(false);

  // Auto-collapse details whenever a new grade arrives
  createEffect(() => {
    props.grade;
    setShowDetails(false);
  });

  return (
    <Show
      when={props.grade.pass}
      fallback={
        <div class="mx-3 mt-3 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 animate-bounce-in shake">
          <div class="flex items-start gap-3">
            <div class="text-xl flex-shrink-0 mt-0.5">✗</div>
            <div class="flex-1 min-w-0">
              <div class="text-danger font-medium text-sm">{props.grade.message}</div>
              <div class="text-ink-muted text-[11px] mt-0.5">Edit the query and run again.</div>
              <Show when={props.grade.details}>
                <button
                  class="text-[11px] text-ink-muted hover:text-ink mt-1 underline underline-offset-2"
                  onClick={() => setShowDetails((v) => !v)}
                >
                  {showDetails() ? "hide" : "show"} details
                </button>
                <Show when={showDetails()}>
                  <pre class="text-[11px] text-ink-muted mt-1.5 whitespace-pre-wrap bg-bg-soft/60 rounded p-2 max-h-32 overflow-auto">
                    {props.grade.details}
                  </pre>
                </Show>
              </Show>
            </div>
          </div>
        </div>
      }
    >
      <div class="mx-3 mt-3 rounded-xl border border-success/40 bg-success/10 px-4 py-3 animate-bounce-in">
        <div class="flex items-start gap-3">
          <div class="text-xl flex-shrink-0 mt-0.5">✓</div>
          <div class="flex-1 min-w-0">
            <div class="text-success font-medium text-sm">Correct.</div>
            <div class="text-ink-muted text-[11px] mt-0.5">
              {props.solvedCount} of {props.total} challenges solved on this level.
            </div>
          </div>
          <Show when={props.hasNext}>
            <button
              onClick={props.onNext}
              class="text-[11px] px-3 py-1.5 bg-accent hover:bg-accent-glow text-bg font-medium rounded-md whitespace-nowrap"
            >
              next →
            </button>
          </Show>
        </div>
      </div>
    </Show>
  );
}
