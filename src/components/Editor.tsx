import { onCleanup, onMount, createEffect } from "solid-js";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  schema?: Record<string, string[]>;
}

export default function Editor(props: Props) {
  let host: HTMLDivElement | undefined;
  let view: EditorView | undefined;

  const makeState = (val: string) =>
    EditorState.create({
      doc: val,
      extensions: [
        lineNumbers(),
        drawSelection(),
        highlightActiveLine(),
        history(),
        closeBrackets(),
        autocompletion(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...completionKeymap,
          ...closeBracketsKeymap,
          indentWithTab,
          {
            key: "Mod-Enter",
            run: () => {
              props.onRun?.();
              return true;
            },
          },
        ]),
        sql({ dialect: PostgreSQL, schema: props.schema }),
        oneDark,
        EditorView.updateListener.of((u) => {
          if (u.docChanged) props.onChange(u.state.doc.toString());
        }),
        EditorView.theme({
          "&": { backgroundColor: "#0f141a" },
          ".cm-gutters": { backgroundColor: "#0a0e14", borderRight: "1px solid #1f2933", color: "#6e7681" },
        }),
      ],
    });

  onMount(() => {
    view = new EditorView({ state: makeState(props.value), parent: host });
  });

  createEffect(() => {
    const v = props.value;
    if (view && view.state.doc.toString() !== v) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: v } });
    }
  });

  onCleanup(() => view?.destroy());

  return <div ref={host} class="h-full w-full overflow-hidden" />;
}
